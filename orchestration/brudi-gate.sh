#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# brudi-gate.sh — Imperative Gate Runner for Brudi Tier-1 Orchestration
#
# Usage:
#   brudi-gate.sh pre-slice              Check pre-conditions before starting a slice
#   brudi-gate.sh post-slice <slice_id>  Check post-conditions after completing a slice
#   brudi-gate.sh phase-gate <from>_to_<to>  Check phase transition gate
#   brudi-gate.sh mode-check <action>    Check if action is allowed in current mode
#   brudi-gate.sh status                 Print current state summary
#
# Exit codes:
#   0 = Gate passed
#   1 = Gate failed (reason on stderr)
#   2 = Usage error / corrupt state
#
# Dependencies: jq (must be installed)
# ─────────────────────────────────────────────────────────────────────────────

STATE_FILE="${BRUDI_STATE_FILE:-.brudi/state.json}"
SCHEMA_FILE="${BRUDI_SCHEMA_FILE:-$(dirname "$0")/state.schema.json}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

# ── Helpers ──────────────────────────────────────────────────────────────────

die() {
  echo -e "${RED}⛔ GATE FAILED: $1${RESET}" >&2
  # Update state with failure
  if [ -f "$STATE_FILE" ] && command -v jq &>/dev/null; then
    local now
    now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local tmp
    tmp=$(mktemp)
    jq --arg t "$now" --arg e "$1" \
      '.gates.last_check = $t | .gates.last_check_result = "fail" | .gates.last_check_errors += [$e]' \
      "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
  fi
  exit 1
}

pass() {
  echo -e "${GREEN}✅ GATE PASSED: $1${RESET}"
  # Update state with pass
  if [ -f "$STATE_FILE" ] && command -v jq &>/dev/null; then
    local now
    now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local tmp
    tmp=$(mktemp)
    jq --arg t "$now" \
      '.gates.last_check = $t | .gates.last_check_result = "pass" | .gates.last_check_errors = []' \
      "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
  fi
  exit 0
}

warn() {
  echo -e "${YELLOW}⚠️  $1${RESET}" >&2
}

require_jq() {
  if ! command -v jq &>/dev/null; then
    echo "ERROR: jq is required but not installed. Run: npm install -g jq or brew install jq" >&2
    exit 2
  fi
}

require_state() {
  if [ ! -f "$STATE_FILE" ]; then
    echo "ERROR: State file not found at $STATE_FILE" >&2
    echo "Run 'sh ~/Brudi/use.sh' in your project directory first." >&2
    exit 2
  fi
  # Basic JSON validity
  if ! jq empty "$STATE_FILE" 2>/dev/null; then
    echo "ERROR: State file is not valid JSON: $STATE_FILE" >&2
    exit 2
  fi
}

get_state() {
  jq -r "$1" "$STATE_FILE"
}

get_state_raw() {
  jq "$1" "$STATE_FILE"
}

# ── Core: State Validation ───────────────────────────────────────────────────

validate_state() {
  require_jq
  require_state

  local version mode phase
  version=$(get_state '.version')
  mode=$(get_state '.mode')
  phase=$(get_state '.phase')

  if [ "$version" != "1.0" ]; then
    die "Unknown state version: $version (expected 1.0)"
  fi

  case "$mode" in
    BUILD|AUDIT|FIX|RESEARCH) ;;
    *) die "Invalid mode: $mode (must be BUILD|AUDIT|FIX|RESEARCH)" ;;
  esac

  if [ "$phase" -lt 0 ] || [ "$phase" -gt 3 ]; then
    die "Invalid phase: $phase (must be 0-3)"
  fi
}

# ── Command: pre-slice ───────────────────────────────────────────────────────

cmd_pre_slice() {
  validate_state

  local mode phase
  mode=$(get_state '.mode')
  phase=$(get_state '.phase')

  # 0. Version drift check (warning, not blocking)
  local brudi_dir="${BRUDI_DIR:-${HOME}/Brudi}"
  local installed_version
  installed_version=$(cat "${brudi_dir}/VERSION" 2>/dev/null || echo "unknown")
  local state_version
  state_version=$(get_state '.brudi_version')
  if [ "$state_version" != "" ] && [ "$state_version" != "null" ] && [ "$installed_version" != "$state_version" ]; then
    warn "Version drift: Projekt initialisiert mit Brudi v${state_version}, installiert ist v${installed_version}. Empfehlung: cd ~/Brudi && git pull"
  fi

  # 1. Mode must be BUILD
  if [ "$mode" != "BUILD" ]; then
    die "Cannot start a slice in $mode mode. Only BUILD mode allows creating slices."
  fi

  # 2. Check: If we're in phase >= 1, the phase gate must be passed
  if [ "$phase" -ge 1 ]; then
    local gate_key="0_to_1"
    local gate_passed
    gate_passed=$(get_state_raw ".phase_gate_passed.\"$gate_key\"")
    if [ "$gate_passed" != "true" ]; then
      die "Phase gate $gate_key not passed. Cannot work in phase $phase."
    fi
  fi
  if [ "$phase" -ge 2 ]; then
    local gate_passed
    gate_passed=$(get_state_raw '.phase_gate_passed."1_to_2"')
    if [ "$gate_passed" != "true" ]; then
      die "Phase gate 1_to_2 not passed. Cannot work in phase $phase."
    fi
  fi

  # 3. Check: All previous slices in this phase must be completed
  local incomplete
  incomplete=$(jq --argjson p "$phase" \
    '[.slices[] | select(.phase == $p and .status == "in_progress")] | length' \
    "$STATE_FILE")
  if [ "$incomplete" -gt 0 ]; then
    die "There are $incomplete in-progress slices in phase $phase. Complete them first."
  fi

  # 4. Check: Last completed slice has full evidence
  local last_completed_id
  last_completed_id=$(jq --argjson p "$phase" \
    '[.slices[] | select(.phase == $p and .status == "completed")] | sort_by(.id) | last | .id // 0' \
    "$STATE_FILE")

  if [ "$last_completed_id" -gt 0 ]; then
    check_slice_evidence "$last_completed_id"
  fi

  pass "Pre-slice check passed. Mode=$mode, Phase=$phase. Ready for next slice."
}

# ── Command: post-slice ──────────────────────────────────────────────────────

cmd_post_slice() {
  local slice_id="${1:-}"
  if [ -z "$slice_id" ]; then
    echo "Usage: brudi-gate.sh post-slice <slice_id>" >&2
    exit 2
  fi

  validate_state

  local errors=()

  # Check evidence for this specific slice
  local slice_exists
  slice_exists=$(jq --argjson id "$slice_id" \
    '[.slices[] | select(.id == $id)] | length' \
    "$STATE_FILE")

  if [ "$slice_exists" -eq 0 ]; then
    die "Slice $slice_id not found in state."
  fi

  local skill_read build_ok screenshot_d screenshot_m console_ok qg_count
  skill_read=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.skill_read' "$STATE_FILE")
  build_ok=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.build_zero_errors' "$STATE_FILE")
  screenshot_d=$(jq -r --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.screenshot_desktop' "$STATE_FILE")
  screenshot_m=$(jq -r --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.screenshot_mobile' "$STATE_FILE")
  console_ok=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.console_zero_errors' "$STATE_FILE")
  qg_count=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.quality_gate_checks | length' "$STATE_FILE")

  # 1. Skill read
  if [ "$skill_read" != "true" ]; then
    errors+=("Slice $slice_id: verifying-ui-quality not read (skill_read=false)")
  fi

  # 2. Build
  if [ "$build_ok" != "true" ]; then
    errors+=("Slice $slice_id: npm run build has errors (build_zero_errors=false)")
  fi

  # 3. Desktop screenshot
  if [ -z "$screenshot_d" ] || [ "$screenshot_d" = "null" ]; then
    errors+=("Slice $slice_id: Desktop screenshot path missing")
  elif [ ! -f "$screenshot_d" ]; then
    warn "Slice $slice_id: Desktop screenshot file not found at '$screenshot_d' (path recorded but file missing)"
  fi

  # 4. Mobile screenshot
  if [ -z "$screenshot_m" ] || [ "$screenshot_m" = "null" ]; then
    errors+=("Slice $slice_id: Mobile 375px screenshot path missing")
  elif [ ! -f "$screenshot_m" ]; then
    warn "Slice $slice_id: Mobile screenshot file not found at '$screenshot_m' (path recorded but file missing)"
  fi

  # 5. Console
  if [ "$console_ok" != "true" ]; then
    errors+=("Slice $slice_id: Console errors present (console_zero_errors=false)")
  fi

  # 6. Quality gate checks (need exactly 3)
  if [ "$qg_count" -lt 3 ]; then
    errors+=("Slice $slice_id: Quality gate needs 3 checks, has $qg_count")
  fi

  if [ ${#errors[@]} -gt 0 ]; then
    local msg
    msg=$(printf '%s\n' "${errors[@]}")
    die "Post-slice check failed for slice $slice_id:
$msg"
  fi

  pass "Post-slice check passed for slice $slice_id. All evidence complete."
}

# ── Command: phase-gate ──────────────────────────────────────────────────────

cmd_phase_gate() {
  local transition="${1:-}"
  if [ -z "$transition" ]; then
    echo "Usage: brudi-gate.sh phase-gate 0_to_1|1_to_2|2_to_3" >&2
    exit 2
  fi

  validate_state

  case "$transition" in
    0_to_1) check_phase_gate 0 1 ;;
    1_to_2) check_phase_gate 1 2 ;;
    2_to_3) check_phase_gate 2 3 ;;
    *) echo "Unknown transition: $transition" >&2; exit 2 ;;
  esac
}

check_phase_gate() {
  local from_phase=$1
  local to_phase=$2
  local errors=()

  # All slices in from_phase must be completed
  local incomplete
  incomplete=$(jq --argjson p "$from_phase" \
    '[.slices[] | select(.phase == $p and .status != "completed" and .status != "not_applicable")] | length' \
    "$STATE_FILE")

  if [ "$incomplete" -gt 0 ]; then
    errors+=("$incomplete slices in phase $from_phase not completed")
  fi

  # All completed slices must have full evidence
  local completed_ids
  completed_ids=$(jq -r --argjson p "$from_phase" \
    '[.slices[] | select(.phase == $p and .status == "completed") | .id] | .[]' \
    "$STATE_FILE")

  for sid in $completed_ids; do
    local ev_errors
    ev_errors=$(check_slice_evidence_silent "$sid")
    if [ -n "$ev_errors" ]; then
      errors+=("$ev_errors")
    fi
  done

  if [ ${#errors[@]} -gt 0 ]; then
    local msg
    msg=$(printf '%s\n' "${errors[@]}")
    die "Phase gate ${from_phase}_to_${to_phase} FAILED:
$msg"
  fi

  # Mark gate as passed in state
  local tmp
  tmp=$(mktemp)
  local gate_key="${from_phase}_to_${to_phase}"
  jq --arg k "$gate_key" \
    '.phase_gate_passed[$k] = true | .phase = (.phase + 1)' \
    "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"

  pass "Phase gate ${from_phase}_to_${to_phase} passed. Now in phase $to_phase."
}

# ── Command: mode-check ──────────────────────────────────────────────────────

cmd_mode_check() {
  local action="${1:-}"
  if [ -z "$action" ]; then
    echo "Usage: brudi-gate.sh mode-check <write_code|read_only|fix_issue|create_file|delete_file>" >&2
    exit 2
  fi

  validate_state

  local mode
  mode=$(get_state '.mode')

  case "$mode" in
    BUILD)
      case "$action" in
        write_code|create_file|screenshot|quality_gate) pass "Action '$action' allowed in BUILD mode." ;;
        audit_code) die "AUDIT action '$action' not allowed in BUILD mode." ;;
        fix_issue) die "FIX action '$action' not allowed in BUILD mode (only current slice bugs)." ;;
        *) pass "Action '$action' allowed in BUILD mode (default allow)." ;;
      esac
      ;;
    AUDIT)
      case "$action" in
        read_only|screenshot|write_analysis) pass "Action '$action' allowed in AUDIT mode." ;;
        write_code|create_file|delete_file|fix_issue)
          die "Action '$action' FORBIDDEN in AUDIT mode. AUDIT may only read, screenshot, and write analysis documents. Do NOT switch to FIX without user permission." ;;
        *) die "Action '$action' not explicitly allowed in AUDIT mode. Ask user." ;;
      esac
      ;;
    FIX)
      case "$action" in
        fix_issue|write_code|screenshot) pass "Action '$action' allowed in FIX mode." ;;
        create_file) die "Creating new files not allowed in FIX mode. Only fix named issues." ;;
        *) warn "Action '$action' in FIX mode — proceed with caution (only fix named issues)." ; exit 0 ;;
      esac
      ;;
    RESEARCH)
      case "$action" in
        read_only|write_analysis) pass "Action '$action' allowed in RESEARCH mode." ;;
        write_code|create_file|delete_file|fix_issue)
          die "Action '$action' FORBIDDEN in RESEARCH mode. RESEARCH may only read and write analysis." ;;
        *) die "Action '$action' not explicitly allowed in RESEARCH mode." ;;
      esac
      ;;
  esac
}

# ── Command: status ──────────────────────────────────────────────────────────

cmd_status() {
  validate_state

  local mode phase project
  mode=$(get_state '.mode')
  phase=$(get_state '.phase')
  project=$(get_state '.project')

  echo ""
  echo "  Brudi State — $project"
  echo "  ─────────────────────────────────"
  echo "  Mode:  $mode"
  echo "  Phase: $phase"
  echo ""

  # Phase gates
  echo "  Phase Gates:"
  for gate in "0_to_1" "1_to_2" "2_to_3"; do
    local passed
    passed=$(get_state_raw ".phase_gate_passed.\"$gate\"")
    if [ "$passed" = "true" ]; then
      echo -e "    ${GREEN}✅ $gate${RESET}"
    else
      echo -e "    ❌ $gate"
    fi
  done
  echo ""

  # Slices summary
  local total completed in_progress pending
  total=$(jq '.slices | length' "$STATE_FILE")
  completed=$(jq '[.slices[] | select(.status == "completed")] | length' "$STATE_FILE")
  in_progress=$(jq '[.slices[] | select(.status == "in_progress")] | length' "$STATE_FILE")
  pending=$(jq '[.slices[] | select(.status == "pending")] | length' "$STATE_FILE")

  echo "  Slices: $completed/$total completed, $in_progress in progress, $pending pending"

  # Last gate check
  local last_result
  last_result=$(get_state '.gates.last_check_result')
  local last_time
  last_time=$(get_state '.gates.last_check')
  echo ""
  echo "  Last gate check: $last_result ($last_time)"

  if [ "$last_result" = "fail" ]; then
    echo -e "  ${RED}Errors:${RESET}"
    jq -r '.gates.last_check_errors[]' "$STATE_FILE" | while read -r err; do
      echo -e "    ${RED}• $err${RESET}"
    done
  fi
  echo ""
}

# ── Evidence Check Helpers ───────────────────────────────────────────────────

check_slice_evidence() {
  local slice_id=$1
  local errors
  errors=$(check_slice_evidence_silent "$slice_id")
  if [ -n "$errors" ]; then
    die "Evidence incomplete for slice $slice_id:
$errors"
  fi
}

check_slice_evidence_silent() {
  local slice_id=$1
  local errors=""

  local skill_read build_ok screenshot_d screenshot_m console_ok qg_count
  skill_read=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.skill_read // false' "$STATE_FILE")
  build_ok=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.build_zero_errors // false' "$STATE_FILE")
  screenshot_d=$(jq -r --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.screenshot_desktop // ""' "$STATE_FILE")
  screenshot_m=$(jq -r --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.screenshot_mobile // ""' "$STATE_FILE")
  console_ok=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.console_zero_errors // false' "$STATE_FILE")
  qg_count=$(jq --argjson id "$slice_id" \
    '.slices[] | select(.id == $id) | .evidence.quality_gate_checks | length // 0' "$STATE_FILE")

  [ "$skill_read" != "true" ] && errors+="  - skill_read not set\n"
  [ "$build_ok" != "true" ] && errors+="  - build_zero_errors not set\n"
  [ -z "$screenshot_d" ] && errors+="  - screenshot_desktop path missing\n"
  [ -z "$screenshot_m" ] && errors+="  - screenshot_mobile path missing\n"
  [ "$console_ok" != "true" ] && errors+="  - console_zero_errors not set\n"
  [ "$qg_count" -lt 3 ] && errors+="  - quality_gate_checks needs 3, has $qg_count\n"

  echo -e "$errors"
}

# ── Main ─────────────────────────────────────────────────────────────────────

main() {
  require_jq

  local cmd="${1:-help}"
  shift || true

  case "$cmd" in
    pre-slice)   cmd_pre_slice "$@" ;;
    post-slice)  cmd_post_slice "$@" ;;
    phase-gate)  cmd_phase_gate "$@" ;;
    mode-check)  cmd_mode_check "$@" ;;
    status)      cmd_status "$@" ;;
    validate)    validate_state && echo "State is valid." ;;
    help|--help|-h)
      echo "Usage: brudi-gate.sh <command> [args]"
      echo ""
      echo "Commands:"
      echo "  pre-slice              Check pre-conditions before starting a slice"
      echo "  post-slice <id>        Check post-conditions for a completed slice"
      echo "  phase-gate <X_to_Y>    Check phase transition gate (0_to_1, 1_to_2, 2_to_3)"
      echo "  mode-check <action>    Check if action is allowed in current mode"
      echo "  status                 Print current state summary"
      echo "  validate               Validate state.json structure"
      echo ""
      ;;
    *) echo "Unknown command: $cmd. Run with --help." >&2; exit 2 ;;
  esac
}

main "$@"
