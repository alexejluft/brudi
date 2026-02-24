#!/bin/bash
#
# BRUDI MOTION PROTOCOL COMPLIANCE CHECKER
# ════════════════════════════════════════════════════════════════════════════════
# Validiert Motion-Einhaltung gegen den BRUDI Motion Protocol v1.0
# Wird vom brudi-gate.sh aufgerufen bei pre-slice + post-slice
#
# Usage:
#   bash motion-compliance-check.sh <project-root> [check-type]
#   check-type: "config" | "imports" | "animation-code" | "all" (default: "all")

set -e

PROJECT_ROOT="${1:-.}"
CHECK_TYPE="${2:-all}"

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

log_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASSED++))
}

log_fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAILED++))
}

log_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

section() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 1: motion.protocol.ts existiert und ist valid
# ═══════════════════════════════════════════════════════════════════════════════

check_motion_protocol_file() {
  section "1. MOTION PROTOCOL FILE"

  local protocol_file="$PROJECT_ROOT/assets/configs/motion.protocol.ts"

  if [ -f "$protocol_file" ]; then
    log_pass "motion.protocol.ts existiert"

    # Check für erforderliche Exports
    if grep -q "export const DURATION_TOKENS" "$protocol_file"; then
      log_pass "DURATION_TOKENS definiert"
    else
      log_fail "DURATION_TOKENS nicht gefunden"
    fi

    if grep -q "export const EASING_TOKENS" "$protocol_file"; then
      log_pass "EASING_TOKENS definiert"
    else
      log_fail "EASING_TOKENS nicht gefunden"
    fi

    if grep -q "export const COMPONENT_MOTION_RULES" "$protocol_file"; then
      log_pass "COMPONENT_MOTION_RULES definiert"
    else
      log_fail "COMPONENT_MOTION_RULES nicht gefunden"
    fi

    if grep -q "export const INTENSITY_CONFIG" "$protocol_file"; then
      log_pass "INTENSITY_CONFIG (3 levels) definiert"
    else
      log_fail "INTENSITY_CONFIG nicht gefunden"
    fi

    # Validate required component types
    local required_components=("HERO" "SECTION" "CARD" "BUTTON" "NAVIGATION" "IMAGE" "TEXT_BLOCK" "CTA" "MODAL" "PAGE_TRANSITION")
    for comp in "${required_components[@]}"; do
      if grep -q "^\s*${comp}:" "$protocol_file"; then
        log_pass "Component rule: $comp"
      else
        log_warn "Component rule missing: $comp"
      fi
    done

  else
    log_fail "motion.protocol.ts nicht gefunden unter $protocol_file"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 2: globals.css hat alle Duration + Easing Tokens
# ═══════════════════════════════════════════════════════════════════════════════

check_globals_css() {
  section "2. GLOBALS.CSS TOKENS"

  local globals_file="$PROJECT_ROOT/assets/configs/globals.css"

  if [ ! -f "$globals_file" ]; then
    log_fail "globals.css nicht gefunden"
    return
  fi

  # Duration Tokens
  local durations=("micro" "fast" "normal" "slow" "hero" "stagger")
  for dur in "${durations[@]}"; do
    if grep -q "\-\-duration\-${dur}" "$globals_file"; then
      log_pass "CSS Token: --duration-$dur"
    else
      log_fail "CSS Token missing: --duration-$dur"
    fi
  done

  # Easing Tokens
  local easings=("enter" "exit" "smooth" "dramatic" "spring" "in-out" "linear")
  for ease in "${easings[@]}"; do
    if grep -q "\-\-ease\-${ease}" "$globals_file"; then
      log_pass "CSS Token: --ease-$ease"
    else
      log_fail "CSS Token missing: --ease-$ease"
    fi
  done

  # Distance Tokens
  local distances=("micro" "xs" "sm" "base" "md" "lg" "xl")
  for dist in "${distances[@]}"; do
    if grep -q "\-\-distance\-${dist}" "$globals_file"; then
      log_pass "CSS Token: --distance-$dist"
    else
      log_warn "CSS Token optional: --distance-$dist"
    fi
  done
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 3: GSAP Animations verwenden Tokens (nicht hardcoded)
# ═══════════════════════════════════════════════════════════════════════════════

check_animation_code_hardcodes() {
  section "3. ANIMATION CODE HARDCODING VIOLATIONS"

  local violations_found=0

  # Suche nach hardcoded duration-Zahlen in .ts/.tsx
  if find "$PROJECT_ROOT/src" -name "*.ts" -o -name "*.tsx" 2>/dev/null | grep -v node_modules | head -1 >/dev/null; then
    log_info "Suche nach hardcoded durations in Animationscode..."

    # Pattern: duration: 0.3 oder duration: 300 oder similar (ohne Token-Referenz)
    local hardcoded=$(find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | \
      xargs grep -h "duration:\s*[0-9]*\.[0-9]\+\|duration:\s*[0-9]\+ms\|ease:\s*['\"]power\|ease:\s*['\"]cubic" 2>/dev/null || true)

    if [ -n "$hardcoded" ]; then
      echo -e "${YELLOW}Found potential hardcoded animation values:${NC}"
      echo "$hardcoded" | head -5
      ((violations_found++))
      log_warn "Hardcoded duration/ease values gefunden — sollten Tokens verwenden"
    else
      log_pass "Keine offensichtlichen hardcoded duration/ease-Werte"
    fi
  fi

  # Check: GSAP from() ist VERBOTEN (immer set + to verwenden)
  if find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | \
    xargs grep -l "gsap\.from\(" 2>/dev/null >/dev/null; then
    log_fail "gsap.from() gefunden — VERBOTEN! Nur set() + to() erlaubt"
  else
    log_pass "Kein gsap.from() detected (set + to pattern)"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 4: Reduced Motion Support
# ═══════════════════════════════════════════════════════════════════════════════

check_reduced_motion_support() {
  section "4. REDUCED MOTION A11Y SUPPORT"

  local globals_file="$PROJECT_ROOT/assets/configs/globals.css"

  if grep -q "@media.*prefers-reduced-motion.*reduce" "$globals_file"; then
    log_pass "prefers-reduced-motion media query gefunden"

    if grep -A5 "@media.*prefers-reduced-motion.*reduce" "$globals_file" | grep -q "animation-duration.*0.01ms\|transition-duration.*0.01ms"; then
      log_pass "Reduced motion: animation/transition auf 0.01ms gesetzt"
    else
      log_warn "Reduced motion: keine duration-Override gefunden"
    fi
  else
    log_fail "prefers-reduced-motion media query nicht gefunden"
  fi

  # Check für JS-seitige Reduced Motion Checks
  if find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | \
    xargs grep -l "prefers-reduced-motion\|prefersReducedMotion\|reduceMotion" 2>/dev/null >/dev/null; then
    log_pass "JS-seitige Reduced Motion Checks erkannt"
  else
    log_warn "Keine expliziten Reduced Motion Checks im JavaScript gefunden"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 5: Component Motion Rules angewendet
# ═══════════════════════════════════════════════════════════════════════════════

check_component_usage() {
  section "5. COMPONENT MOTION RULE USAGE"

  log_info "Prüfe auf Verwendung von COMPONENT_MOTION_RULES..."

  # Check: Werden die Regeln aktuell verwendet?
  if find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | \
    xargs grep -l "getComponentRule\|COMPONENT_MOTION_RULES" 2>/dev/null >/dev/null; then
    log_pass "Component motion rules werden aktuell verwendet"
  else
    log_warn "Component motion rules werden noch nicht im Projekt verwendet (optional für Phase 0)"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 6: INTENSITY Config genutzt
# ═══════════════════════════════════════════════════════════════════════════════

check_intensity_usage() {
  section "6. INTENSITY MULTIPLIER SYSTEM"

  local protocol_file="$PROJECT_ROOT/assets/configs/motion.protocol.ts"

  if grep -q "INTENSITY_CONFIG" "$protocol_file"; then
    # Check für drei Levels
    if grep -q "'subtle'" "$protocol_file" && grep -q "'balanced'" "$protocol_file" && grep -q "'expressive'" "$protocol_file"; then
      log_pass "Alle 3 Intensity Levels vorhanden (subtle, balanced, expressive)"
    else
      log_fail "Nicht alle Intensity Levels definiert"
    fi

    # Check für Multiplikatoren
    if grep -q "durationMultiplier" "$protocol_file" && grep -q "staggerMultiplier" "$protocol_file" && grep -q "distanceMultiplier" "$protocol_file"; then
      log_pass "Alle Multiplikator-Typen definiert"
    else
      log_fail "Einige Multiplikatoren fehlen"
    fi
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 7: Performance Rules (nur transform + opacity)
# ═══════════════════════════════════════════════════════════════════════════════

check_performance_rules() {
  section "7. PERFORMANCE: ONLY TRANSFORM + OPACITY"

  log_info "Suche nach disallowed animierten Properties..."

  local disallowed_props=("width" "height" "left" "top" "right" "bottom" "padding" "margin" "border")
  local violations=0

  for prop in "${disallowed_props[@]}"; do
    if find "$PROJECT_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | \
      xargs grep -l "gsap\.to.*${prop}:\|gsap\.from.*${prop}:" 2>/dev/null >/dev/null; then
      log_warn "Animierte Layout-Property gefunden: $prop"
      ((violations++))
    fi
  done

  if [ $violations -eq 0 ]; then
    log_pass "Keine animierten Layout-Properties detected"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 8: Stagger Timing (sollte Multiples von 80ms sein)
# ═══════════════════════════════════════════════════════════════════════════════

check_stagger_timing() {
  section "8. STAGGER TIMING (80ms multiples)"

  local protocol_file="$PROJECT_ROOT/assets/configs/motion.protocol.ts"

  if grep -q "stagger.*0.08\|stagger.*80" "$protocol_file"; then
    log_pass "Standard stagger: 80ms erkannt"
  else
    log_warn "Standard stagger (0.08/80ms) nicht explizit definiert"
  fi

  if grep -q "staggerTight.*0.05\|staggerTight.*50" "$protocol_file"; then
    log_pass "Tight stagger: 50ms erkannt"
  else
    log_warn "Tight stagger Option nicht definiert"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

main() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║        BRUDI MOTION PROTOCOL COMPLIANCE CHECKER v1.0          ║${NC}"
  echo -e "${BLUE}║                      $(date +%Y-%m-%d) — $(date +%H:%M:%S)                      ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Project Root: $PROJECT_ROOT"
  echo "Check Type: $CHECK_TYPE"
  echo ""

  # Determine which checks to run
  case "$CHECK_TYPE" in
    config)
      check_motion_protocol_file
      check_globals_css
      ;;
    imports)
      check_animation_code_hardcodes
      check_component_usage
      ;;
    animation-code)
      check_animation_code_hardcodes
      check_performance_rules
      check_stagger_timing
      ;;
    all)
      check_motion_protocol_file
      check_globals_css
      check_animation_code_hardcodes
      check_reduced_motion_support
      check_component_usage
      check_intensity_usage
      check_performance_rules
      check_stagger_timing
      ;;
    *)
      echo "Unknown check type: $CHECK_TYPE"
      echo "Valid types: config | imports | animation-code | all"
      exit 1
      ;;
  esac

  # Print Summary
  section "SUMMARY"
  echo -e "${GREEN}Passed:${NC}  $PASSED"
  echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
  echo -e "${RED}Failed:${NC}  $FAILED"
  echo ""

  # Exit code
  if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Motion Protocol Compliance: FAILED${NC}"
    exit 1
  elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Motion Protocol Compliance: PASSED (with warnings)${NC}"
    exit 0
  else
    echo -e "${GREEN}Motion Protocol Compliance: PASSED${NC}"
    exit 0
  fi
}

main "$@"
