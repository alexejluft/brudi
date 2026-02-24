#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# brudi-gate-complexity.sh — Creative DNA Complexity Floor Enforcement
#
# Sourced by brudi-gate.sh
# Provides:
#   - check_complexity_tokens()
#   - check_forbidden_patterns()
#   - check_complexity_evidence()
#   - run_complexity_check()
#
# Exit: 0 = OK, 1 = VIOLATION
# ─────────────────────────────────────────────────────────────────────────────

STATE_FILE="${BRUDI_STATE_FILE:-.brudi/state.json}"

# Fallback for warn() if not provided by brudi-gate.sh
if ! type warn &>/dev/null; then
  warn() {
    echo -e "\033[1;33m⚠️  $1\033[0m" >&2
  }
fi

# ── Complexity Token Checks ───────────────────────────────────────────────────

check_complexity_tokens() {
  local violations=0

  # Check: materiality-tokens.css exists
  if [ ! -f "src/styles/materiality-tokens.css" ]; then
    warn "materiality-tokens.css nicht gefunden (src/styles/materiality-tokens.css)"
    violations=$((violations + 1))
  fi

  # Check: globals.css hat die 4-Layer Tokens
  if [ ! -f "src/styles/globals.css" ]; then
    warn "globals.css nicht gefunden"
    violations=$((violations + 1))
  else
    # Prüfe auf notwendige CSS Custom Properties
    local has_bg has_bg_elevated has_surface has_surface_high
    has_bg=$(grep -c "\-\-color-bg[^-]" src/styles/globals.css 2>/dev/null || echo 0)
    has_bg_elevated=$(grep -c "\-\-color-bg-elevated" src/styles/globals.css 2>/dev/null || echo 0)
    has_surface=$(grep -c "\-\-color-surface[^-]" src/styles/globals.css 2>/dev/null || echo 0)
    has_surface_high=$(grep -c "\-\-color-surface-high" src/styles/globals.css 2>/dev/null || echo 0)

    if [ "$has_bg" -eq 0 ] || [ "$has_bg_elevated" -eq 0 ] || [ "$has_surface" -eq 0 ] || [ "$has_surface_high" -eq 0 ]; then
      warn "4-Layer Color Tokens nicht vollständig in globals.css (brauche: --color-bg, --color-bg-elevated, --color-surface, --color-surface-high)"
      violations=$((violations + 1))
    fi
  fi

  # Check: Motion Tokens existieren
  if [ ! -f "src/styles/motion-tokens.css" ] && [ ! -f "src/styles/globals.css" ]; then
    warn "Motion Tokens nicht gefunden"
    violations=$((violations + 1))
  else
    local has_duration has_easing
    has_duration=$(grep -r "\-\-duration-" src/styles/ 2>/dev/null | wc -l)
    has_easing=$(grep -r "\-\-easing-" src/styles/ 2>/dev/null | wc -l)

    if [ "$has_duration" -eq 0 ] || [ "$has_easing" -eq 0 ]; then
      warn "Motion Tokens (--duration-*, --easing-*) nicht definiert"
      violations=$((violations + 1))
    fi
  fi

  return $violations
}

# ── Forbidden Pattern Checks ──────────────────────────────────────────────────

check_forbidden_patterns() {
  local violations=0

  # Pattern 1: transition: all
  local transition_all_count
  transition_all_count=$(grep -r "transition:\s*all\|transition-all" \
    src/ \
    --include="*.tsx" --include="*.ts" --include="*.css" \
    2>/dev/null | wc -l)
  if [ "$transition_all_count" -gt 0 ]; then
    warn "❌ VIOLATION: $transition_all_count × 'transition: all' gefunden (nutze spezifische Properties wie 'transition: opacity 0.3s')"
    violations=$((violations + transition_all_count))
  fi

  # Pattern 2: gsap.from() in React
  local gsap_from_count
  gsap_from_count=$(grep -r "gsap\.from(" \
    src/ \
    --include="*.tsx" --include="*.ts" \
    2>/dev/null | wc -l)
  if [ "$gsap_from_count" -gt 0 ]; then
    warn "❌ VIOLATION: $gsap_from_count × 'gsap.from()' gefunden (nutze gsap.set() + gsap.to())"
    violations=$((violations + gsap_from_count))
  fi

  # Pattern 3: Layout property animations (warning, nicht blocking)
  local layout_anim_count
  layout_anim_count=$(grep -rE "animate.*(margin|width|height|padding|top|left|right|bottom)" \
    src/ \
    --include="*.tsx" --include="*.ts" \
    2>/dev/null | wc -l)
  if [ "$layout_anim_count" -gt 0 ]; then
    warn "⚠️  WARNING: $layout_anim_count × Layout-Property Animation gefunden (transform ist performanter)"
  fi

  # Pattern 4: orphaned ScrollTrigger references
  local orphaned_triggers
  orphaned_triggers=$(grep -r "ScrollTrigger\\.refresh()" \
    src/ \
    --include="*.tsx" --include="*.ts" \
    2>/dev/null | wc -l)
  if [ "$orphaned_triggers" -gt 0 ]; then
    warn "⚠️  WARNING: $orphaned_triggers × orphaned ScrollTrigger.refresh() (cleanup-Safety problematisch)"
  fi

  return $violations
}

# ── Creative Metrics Checks (P2: Animation Count, Easing, Depth) ─────────────

check_animation_count() {
  # Proxy: Count gsap.to/gsap.set/gsap.timeline/ScrollTrigger calls in src/
  local gsap_calls
  gsap_calls=$(grep -rE "gsap\.(to|set|fromTo|timeline|context)|ScrollTrigger\.(create|batch)" \
    src/ \
    --include="*.tsx" --include="*.ts" \
    2>/dev/null | wc -l)

  if [ "$gsap_calls" -lt 5 ]; then
    warn "❌ CREATIVE METRIC: Nur $gsap_calls GSAP/ScrollTrigger Aufrufe gefunden (Minimum: 5 für Award-Level Hero)"
    return 1
  fi
  echo "  ✓ Animation Count: $gsap_calls GSAP Aufrufe (≥5)" >&2
  return 0
}

check_easing_variety() {
  # Proxy: Count unique easing strings in src/ (power2, power3, sine, expo, back, elastic, etc.)
  local unique_easings
  unique_easings=$(grep -roE "(power[0-9]|sine|expo|back|elastic|circ|bounce)\.(in|out|inOut)" \
    src/ \
    --include="*.tsx" --include="*.ts" \
    2>/dev/null | sort -u | wc -l)

  if [ "$unique_easings" -lt 3 ]; then
    warn "❌ CREATIVE METRIC: Nur $unique_easings verschiedene Easing-Typen gefunden (Minimum: 3)"
    return 1
  fi
  echo "  ✓ Easing Variety: $unique_easings verschiedene Easings (≥3)" >&2
  return 0
}

check_depth_layer_usage() {
  # Proxy: Count references to the 4 depth layer tokens in TSX/CSS
  local layer_count=0
  local has_bg has_elevated has_surface has_high

  has_bg=$(grep -rE "(color-bg[^-]|bg-\[var|--bg[^-])" src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)
  has_elevated=$(grep -rE "(bg-elevated|color-bg-elevated)" src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)
  has_surface=$(grep -rE "(color-surface[^-]|surface[^-])" src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)
  has_high=$(grep -rE "(surface-high|color-surface-high)" src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l)

  [ "$has_bg" -gt 0 ] && layer_count=$((layer_count + 1))
  [ "$has_elevated" -gt 0 ] && layer_count=$((layer_count + 1))
  [ "$has_surface" -gt 0 ] && layer_count=$((layer_count + 1))
  [ "$has_high" -gt 0 ] && layer_count=$((layer_count + 1))

  if [ "$layer_count" -lt 3 ]; then
    warn "❌ CREATIVE METRIC: Nur $layer_count/4 Depth-Layer im Code genutzt (Minimum: 3)"
    return 1
  fi
  echo "  ✓ Depth Layers: $layer_count/4 Layer genutzt (≥3)" >&2
  return 0
}

# ── Complexity Evidence Checks ────────────────────────────────────────────────

check_complexity_evidence() {
  local slice_id="$1"

  if [ -z "$slice_id" ]; then
    return 0  # Optional für pre-slice
  fi

  # Prüfe ob complexity_evidence für diesen Slice in state.json existiert
  local has_evidence
  has_evidence=$(jq --argjson id "$slice_id" \
    '[.slices[] | select(.id == $id) | .complexity_evidence] | length' \
    "$STATE_FILE" 2>/dev/null || echo 0)

  if [ "$has_evidence" -eq 0 ]; then
    warn "complexity_evidence nicht in state.json für slice $slice_id (optional aber empfohlen)"
    return 0  # Nicht blockierend
  fi

  return 0
}

# ── Main Complexity Check ─────────────────────────────────────────────────────

run_complexity_check() {
  local phase="$1"  # "pre-slice" oder "post-slice"
  local slice_id="${2:-}"

  if [ "$phase" = "pre-slice" ]; then
    check_complexity_tokens
    return $?
  fi

  if [ "$phase" = "post-slice" ]; then
    local violations=0

    # Level 2: Forbidden Patterns (BLOCKING)
    check_forbidden_patterns
    violations=$?
    if [ "$violations" -gt 0 ]; then
      return 1
    fi

    # Level 3: Creative Metrics (BLOCKING)
    local metric_fails=0
    check_animation_count || metric_fails=$((metric_fails + 1))
    check_easing_variety || metric_fails=$((metric_fails + 1))
    check_depth_layer_usage || metric_fails=$((metric_fails + 1))

    if [ "$metric_fails" -gt 0 ]; then
      warn "❌ $metric_fails/3 Creative Metrics nicht erfüllt. Slice kann nicht abgeschlossen werden."
      return 1
    fi

    check_complexity_evidence "$slice_id"
    return $?
  fi

  return 0
}
