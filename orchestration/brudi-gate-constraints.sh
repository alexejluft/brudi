#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# brudi-gate-constraints.sh — Spacing Consistency Gate
#
# Enforces layout discipline by checking:
#   A. Container Primitive Usage — consistent max-width strategies
#   B. No Edge-to-Edge Text — text must have padding/container context
#   C. Spacing Token Consistency — variance in py-* and gap-* usage
#   D. Section ID Requirement — homepage sections must have id attributes
#   E. Token Adoption Ratio — tokens must be referenced in code
#
# Usage:
#   brudi-gate-constraints.sh check-all
#   brudi-gate-constraints.sh check-containers
#   brudi-gate-constraints.sh check-text-wrapping
#   brudi-gate-constraints.sh check-spacing-tokens
#   brudi-gate-constraints.sh check-section-ids
#   brudi-gate-constraints.sh check-token-adoption
#
# Exit codes:
#   0 = All checks passed
#   1 = At least one check failed
#
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

PROJECT_ROOT="${PROJECT_ROOT:-.}"
SRC_DIR="${PROJECT_ROOT}/src"

# ── Helpers ───────────────────────────────────────────────────────────────────

pass() {
  echo -e "${GREEN}✅ $1${RESET}"
}

fail() {
  echo -e "${RED}❌ $1${RESET}"
  return 1
}

warn() {
  echo -e "${YELLOW}⚠️  $1${RESET}"
}

info() {
  echo -e "${BLUE}ℹ️  $1${RESET}"
}

# Check if src/ directory exists
check_src_exists() {
  if [ ! -d "$SRC_DIR" ]; then
    echo -e "${RED}ERROR: src/ directory not found at $SRC_DIR${RESET}" >&2
    exit 2
  fi
}

# ── Check A: Container Primitive Usage ────────────────────────────────────────

check_containers() {
  local violations=0

  info "Check A: Container Primitive Usage"

  # Collect all max-w-* values used (exclude primitives/ — they define the allowed palette)
  local max_widths
  max_widths=$(find "$SRC_DIR" -type f \( -name "page.tsx" -o -name "*.tsx" \) -not -path "*/primitives/*" -exec grep -h -roE "max-w-[a-z0-9]+" {} \; 2>/dev/null | sort -u || echo "")

  local unique_count
  unique_count=$(echo "$max_widths" | wc -w)

  if [ "$unique_count" -gt 4 ]; then
    fail "Container inconsistency: $unique_count different max-w-* values found (max allowed: 4)"
    echo "$max_widths" | sed 's/^/  - /'
    violations=$((violations + 1))
  elif [ "$unique_count" -gt 0 ]; then
    pass "Container consistency: $unique_count max-w-* values (all within limits)"
  else
    warn "No max-w-* classes found — verify Container primitives are in use"
  fi

  # Check for Container imports (proxy for proper use)
  local container_imports
  container_imports=$(find "$SRC_DIR" -type f -name "*.tsx" -exec grep -l "from.*Container\|import.*Container" {} \; 2>/dev/null | wc -l || true)

  if [ "$container_imports" -eq 0 ]; then
    warn "No Container imports found — ensure layout primitives are being used"
  else
    info "Found $container_imports Container imports"
  fi

  return $violations
}

# ── Check B: No Edge-to-Edge Text ────────────────────────────────────────────

check_text_wrapping() {
  local violations=0

  info "Check B: No Edge-to-Edge Text"

  # Find TSX files
  local files
  files=$(find "$SRC_DIR" -type f -name "*.tsx" 2>/dev/null)

  if [ -z "$files" ]; then
    return 0
  fi

  # Proxy: look for text elements (h1-h6, p, span with text content) without padding context
  # This is a heuristic check — look for p or heading tags without px-* or Container wrapper

  local violations_found=0
  while IFS= read -r file; do
    if [ -z "$file" ]; then
      continue
    fi
    # Check if file has heading or p tags
    if grep -qE "<(h[1-6]|p)[\s>]" "$file" 2>/dev/null; then
      # Check if file lacks px-* padding context
      if ! grep -qE "px-[0-9]|px-\[" "$file" 2>/dev/null; then
        # Check if file imports Container
        if ! grep -qE "Container" "$file" 2>/dev/null; then
          fail "Text wrapping issue in $file: contains text elements but no px-* padding and no Container import"
          violations_found=$((violations_found + 1))
        fi
      fi
    fi
  done <<< "$files"

  if [ "$violations_found" -eq 0 ]; then
    pass "Text wrapping: All text elements have proper context"
  else
    violations=$violations_found
  fi

  return $violations
}

# ── Check C: Spacing Token Consistency ───────────────────────────────────────

check_spacing_tokens() {
  local violations=0

  info "Check C: Spacing Token Consistency"

  # Collect py-*, gap-*, space-y-* values (exclude primitives/ — they define the allowed palette)
  local py_values
  py_values=$(find "$SRC_DIR" -type f \( -name "*.tsx" -o -name "*.css" \) -not -path "*/primitives/*" -not -path "*/styles/*" -exec grep -h -roE "(py|gap|space-y)-[a-z0-9]+" {} \; 2>/dev/null | sort -u || echo "")

  local py_count
  py_count=$(echo "$py_values" | grep -c "py-\|gap-\|space-y-" 2>/dev/null || true)
  py_count=${py_count:-0}
  # Sanitize to ensure pure integer
  py_count=$(echo "$py_count" | tr -d '[:space:]')

  if [ "$py_count" -gt 6 ]; then
    fail "Spacing variance too high: $py_count different py-*/gap-*/space-y-* values found (max: 6)"
    echo "$py_values" | sed 's/^/  - /'
    violations=$((violations + 1))
  elif [ "$py_count" -gt 0 ]; then
    pass "Spacing consistency: $py_count spacing values (within limits)"
  else
    warn "No spacing token usage (py-*, gap-*, space-y-*) detected — verify spacing is intentional"
  fi

  return $violations
}

# ── Check D: Section ID Requirement (Homepage) ────────────────────────────────

check_section_ids() {
  local violations=0

  info "Check D: Section ID Requirement (Homepage)"

  # Look for main page.tsx or app/page.tsx
  local page_file=""
  if [ -f "$SRC_DIR/app/page.tsx" ]; then
    page_file="$SRC_DIR/app/page.tsx"
  elif [ -f "$SRC_DIR/pages/index.tsx" ]; then
    page_file="$SRC_DIR/pages/index.tsx"
  fi

  if [ -z "$page_file" ] || [ ! -f "$page_file" ]; then
    warn "Homepage (app/page.tsx or pages/index.tsx) not found — skipping section ID check"
    return 0
  fi

  # Count sections (components with Section name or <section> tags) — case insensitive
  local section_count
  section_count=$(grep -ic "<section\|<Section" "$page_file" 2>/dev/null || true)
  section_count=${section_count:-0}

  if [ "$section_count" -eq 0 ]; then
    warn "No <section> or <Section> components found in homepage"
    return 0
  fi

  # Count sections with id attributes
  local sections_with_id
  sections_with_id=$(grep -i "<section\|<Section" "$page_file" 2>/dev/null | grep -c "id=" 2>/dev/null || true)
  sections_with_id=${sections_with_id:-0}

  if [ "$sections_with_id" -lt "$section_count" ]; then
    fail "Section IDs missing: $sections_with_id/$section_count sections have id attributes"
    violations=1
  else
    pass "Section ID coverage: $sections_with_id/$section_count sections have id attributes"
  fi

  return $violations
}

# ── Check E: Token Adoption Ratio ────────────────────────────────────────────

check_token_adoption() {
  local violations=0

  info "Check E: Token Adoption Ratio"

  # Find globals.css or tokens file
  local tokens_file=""
  if [ -f "$SRC_DIR/styles/globals.css" ]; then
    tokens_file="$SRC_DIR/styles/globals.css"
  elif [ -f "$SRC_DIR/styles/tokens.css" ]; then
    tokens_file="$SRC_DIR/styles/tokens.css"
  elif [ -f "$SRC_DIR/app/globals.css" ]; then
    tokens_file="$SRC_DIR/app/globals.css"
  fi

  if [ -z "$tokens_file" ] || [ ! -f "$tokens_file" ]; then
    warn "globals.css or tokens.css not found — skipping token adoption check"
    return 0
  fi

  # Count defined tokens (--duration-*, --easing-*, --distance-*, --color-*)
  local duration_tokens
  duration_tokens=$(grep -c "\-\-duration-" "$tokens_file" 2>/dev/null || true)
  duration_tokens=${duration_tokens:-0}

  local easing_tokens
  easing_tokens=$(grep -c "\-\-easing-" "$tokens_file" 2>/dev/null || true)
  easing_tokens=${easing_tokens:-0}

  local color_tokens
  color_tokens=$(grep -c "\-\-color-\|--bg\|--surface" "$tokens_file" 2>/dev/null || true)
  color_tokens=${color_tokens:-0}

  local total_defined=$((duration_tokens + easing_tokens + color_tokens))

  if [ "$total_defined" -eq 0 ]; then
    fail "Token Adoption: 0 tokens defined in $tokens_file"
    violations=1
  else
    info "Tokens defined: $duration_tokens duration, $easing_tokens easing, $color_tokens color"

    # Count references to these tokens in src/
    local duration_refs
    duration_refs=$(grep -r "\-\-duration-" "$SRC_DIR" --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l || true)
    duration_refs=${duration_refs:-0}

    local easing_refs
    easing_refs=$(grep -r "\-\-easing-" "$SRC_DIR" --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l || true)
    easing_refs=${easing_refs:-0}

    local color_refs
    color_refs=$(grep -r "var(--color-\|var(--bg\|var(--surface" "$SRC_DIR" --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l || true)
    color_refs=${color_refs:-0}

    local total_refs=$((duration_refs + easing_refs + color_refs))

    if [ "$total_refs" -eq 0 ]; then
      fail "Token Adoption: 0% — No token references found in code (defined $total_defined but used 0)"
      violations=1
    else
      local adoption_percent=$((total_refs * 100 / (total_defined + 1)))
      if [ "$adoption_percent" -lt 50 ]; then
        warn "Token Adoption: ${adoption_percent}% — Only $total_refs references to $total_defined tokens"
      else
        pass "Token Adoption: ${adoption_percent}% ($total_refs refs / $total_defined tokens)"
      fi
    fi
  fi

  return $violations
}

# ── Main: check-all ──────────────────────────────────────────────────────────

check_all() {
  local violations=0

  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BLUE}  SPACING CONSISTENCY GATE — ALL CHECKS${RESET}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""

  check_containers || violations=$((violations + 1))
  echo ""

  check_text_wrapping || violations=$((violations + 1))
  echo ""

  check_spacing_tokens || violations=$((violations + 1))
  echo ""

  check_section_ids || violations=$((violations + 1))
  echo ""

  check_token_adoption || violations=$((violations + 1))
  echo ""

  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

  if [ "$violations" -gt 0 ]; then
    echo -e "${RED}  ⛔ $violations constraint checks FAILED${RESET}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    return 1
  else
    echo -e "${GREEN}  ✅ All constraint checks PASSED${RESET}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    return 0
  fi
}

# ── Main ──────────────────────────────────────────────────────────────────────

main() {
  check_src_exists

  local cmd="${1:-check-all}"

  case "$cmd" in
    check-all) check_all ;;
    check-containers) check_containers ;;
    check-text-wrapping) check_text_wrapping ;;
    check-spacing-tokens) check_spacing_tokens ;;
    check-section-ids) check_section_ids ;;
    check-token-adoption) check_token_adoption ;;
    help|--help|-h)
      echo "Usage: brudi-gate-constraints.sh [command]"
      echo ""
      echo "Commands:"
      echo "  check-all              Run all constraint checks"
      echo "  check-containers       Check container primitive usage consistency"
      echo "  check-text-wrapping    Check that text elements have padding/container context"
      echo "  check-spacing-tokens   Check spacing token (py-*, gap-*) variance"
      echo "  check-section-ids      Check that homepage sections have id attributes"
      echo "  check-token-adoption   Check token definition and reference ratio"
      echo "  help                   Show this help message"
      echo ""
      ;;
    *)
      echo "Unknown command: $cmd" >&2
      exit 2
      ;;
  esac
}

main "$@"
