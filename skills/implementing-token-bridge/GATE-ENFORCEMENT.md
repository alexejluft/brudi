# Token Bridge Gate Enforcement

This document specifies how to detect and enforce token-based animation values in automated quality gates.

---

## The Problem We're Solving

Without enforcement, developers revert to hardcoding:
- `duration: 0.8` instead of `duration.slow`
- `ease: "power2.out"` instead of `easing.exit`
- `y: 32` instead of `distance.md`

Enforcement catches these before merge.

---

## Detection Patterns

### Pattern 1: Hardcoded GSAP Duration Numbers

**What to catch:**
- Numeric durations directly in `gsap.to()`, `gsap.from()`, `gsap.set()`
- Excludes legitimate uses like `delay`, `repeat`

**Grep patterns:**

```bash
# Pattern A: Direct numeric duration in gsap calls
grep -rn 'gsap\.\(to\|from\|set\)\s*(' src/ --include="*.tsx" --include="*.ts" \
  | grep -E 'duration:\s*[0-9]+\.[0-9]*|duration:\s*[0-9]+'

# Pattern B: More precise — capture duration in GSAP config objects
grep -rn 'duration:\s*[0-9]' src/components/ --include="*.tsx" --include="*.ts" \
  | grep -v 'duration:.*duration\.' \
  | grep -v 'timeline\.duration' \
  | grep -v 'skipDuration\|baseDuration\|maxDuration'

# Pattern C: With context (show surrounding lines)
grep -rn -B2 -A2 'gsap\.to.*duration:\s*[0-9]' src/components/
```

**What should match:** Zero instances (all durations from `duration.micro|fast|normal|slow|hero`)

**Expected false positives:**
- `tl.duration()` — getter, not duration value (filter with `!~ /\.duration\(/)
- Property names like `baseDuration`, `maxDuration` (filter with `!~ /\w+Duration/`)
- Comments (filter with `!~ /#.*duration/)

---

### Pattern 2: Hardcoded GSAP Easing Strings

**What to catch:**
- Easing strings that aren't from the `easing.*` namespace
- Both old GSAP strings and inline cubic-bezier

**Grep patterns:**

```bash
# Pattern A: Catch easing strings in gsap calls
grep -rn 'ease:\s*["\047]' src/ --include="*.tsx" --include="*.ts" \
  | grep -E 'ease:\s*["\047](power|sine|cubic-bezier|elastic|back|bounce)'

# Pattern B: More specific — exclude token references
grep -rn 'ease:\s*["\047]' src/components/ --include="*.tsx" --include="*.ts" \
  | grep -v "easing\." \
  | grep -v '@media.*prefers-reduced-motion'

# Pattern C: Catch common hardcoded values
grep -rn 'ease:.*["\047]power[0-9]' src/components/

# Pattern D: Inline cubic-bezier (more aggressive)
grep -rn 'cubic-bezier(' src/components/ --include="*.tsx" --include="*.ts" \
  | grep -v 'globals.css\|design-tokens'
```

**What should match:** Zero instances (all easings from `easing.enter|exit|smooth|emphasis|spring|inOut|linear`)

**Expected false positives:**
- Comments explaining easings (filter with `!~ /#.*ease/)
- CSS files (exclude with `--include` above)

---

### Pattern 3: Hardcoded Transform Distance Values

**What to catch:**
- Numeric y/x/scale values that should be from `distance.*`
- Token-compliant values: 4, 8, 12, 24, 32, 40, 48, 64, 80, 100

**Grep patterns:**

```bash
# Pattern A: Find all y: <number> in gsap calls
grep -rn '[xy]:\s*[0-9]+' src/components/ --include="*.tsx" --include="*.ts" \
  | grep -i gsap

# Pattern B: More specific — exclude distance tokens
grep -rn 'gsap\.\(to\|set\)' src/components/ --include="*.tsx" --include="*.ts" \
  | grep '[xy]:\s*[0-9]' \
  | grep -v 'distance\.' \
  | grep -v '[xy]:\s*\(4\|8\|12\|24\|32\|40\|48\|64\|80\|100\)'

# Pattern C: Catch margin-based animations (FORBIDDEN anyway)
grep -rn 'margin\|padding\|width\|height' src/components/ --include="*.tsx" \
  | grep gsap
```

**What should match:** Zero instances (all distances from `distance.*`)

**Token-compliant values:** 4, 8, 12, 24, 32, 40, 48, 64, 80, 100
- If a value outside this list appears → definitely wrong

---

### Pattern 4: Non-Hook Scroll Animations

**What to catch:**
- ScrollTrigger used directly (without going through `useScrollReveal`)
- Suggests the hook wasn't used

**Grep patterns:**

```bash
# Find ScrollTrigger usage
grep -rn 'ScrollTrigger' src/components/ --include="*.tsx" --include="*.ts"

# Filter out: imports, registration, type imports
grep -rn 'ScrollTrigger' src/components/ --include="*.tsx" --include="*.ts" \
  | grep -v 'import\|register\|type ScrollTrigger'

# If any matches: Check if they're in a hook or component
# Ideally: Should only see ScrollTrigger in primitives/use-scroll-reveal.ts
```

**Expected match:** Only in `primitives/use-scroll-reveal.ts` and `use-stagger-entrance.ts`
- If found in component files → Developer bypassed the hook

---

## Shell Script Implementation

### brudi-gate-token-bridge.sh

Create: `~/Brudi/orchestration/brudi-gate-token-bridge.sh`

```bash
#!/bin/bash
# BRUDI Gate: Token Bridge Enforcement
# Detects hardcoded animation values and enforces token usage

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="${1:-.}"
SRC_DIR="$PROJECT_ROOT/src"

echo "Checking Token Bridge Compliance..."

VIOLATIONS=0

# ────────────────────────────────────────────────────────────────
# CHECK 1: Hardcoded GSAP durations
# ────────────────────────────────────────────────────────────────

echo -n "  [1/4] Hardcoded durations... "

HARDCODED_DURATIONS=$(
  grep -rn 'duration:\s*[0-9]' "$SRC_DIR/components" --include="*.tsx" --include="*.ts" 2>/dev/null || true | \
  grep -v 'duration:.*duration\.' | \
  grep -v 'timeline\.duration' | \
  grep -v 'skipDuration\|baseDuration\|maxDuration' || true
)

if [ ! -z "$HARDCODED_DURATIONS" ]; then
  echo -e "${RED}FAIL${NC}"
  echo "❌ Found hardcoded GSAP durations. Use tokens.duration.* instead:"
  echo "$HARDCODED_DURATIONS" | head -5
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}OK${NC}"
fi

# ────────────────────────────────────────────────────────────────
# CHECK 2: Hardcoded easing strings
# ────────────────────────────────────────────────────────────────

echo -n "  [2/4] Hardcoded easing strings... "

HARDCODED_EASINGS=$(
  grep -rn 'ease:\s*["\047]' "$SRC_DIR/components" --include="*.tsx" --include="*.ts" 2>/dev/null || true | \
  grep -E 'ease:\s*["\047](power|sine|cubic-bezier|elastic|back|bounce)' | \
  grep -v 'easing\.' | \
  grep -v '@media.*prefers-reduced-motion' || true
)

if [ ! -z "$HARDCODED_EASINGS" ]; then
  echo -e "${RED}FAIL${NC}"
  echo "❌ Found hardcoded easing strings. Use tokens.easing.* instead:"
  echo "$HARDCODED_EASINGS" | head -5
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}OK${NC}"
fi

# ────────────────────────────────────────────────────────────────
# CHECK 3: Non-token distance values
# ────────────────────────────────────────────────────────────────

echo -n "  [3/4] Non-token distances... "

# Valid token values
VALID_DISTANCES="4\|8\|12\|24\|32\|40\|48\|64\|80\|100"

HARDCODED_DISTANCES=$(
  grep -rn 'gsap\.' "$SRC_DIR/components" --include="*.tsx" --include="*.ts" 2>/dev/null | \
  grep '[xy]:\s*[0-9]' | \
  grep -v 'distance\.' | \
  grep -v "[xy]:\s*\($VALID_DISTANCES\)" || true
)

if [ ! -z "$HARDCODED_DISTANCES" ]; then
  echo -e "${YELLOW}WARN${NC}"
  echo "⚠️  Found non-token distances. Verify these are intentional:"
  echo "$HARDCODED_DISTANCES" | head -3
  # Not a hard fail — manual review needed
else
  echo -e "${GREEN}OK${NC}"
fi

# ────────────────────────────────────────────────────────────────
# CHECK 4: Margin/padding animations (FORBIDDEN)
# ────────────────────────────────────────────────────────────────

echo -n "  [4/4] Margin/padding animations... "

MARGIN_ANIMS=$(
  grep -rn 'gsap\.' "$SRC_DIR/components" --include="*.tsx" --include="*.ts" 2>/dev/null | \
  grep -E 'margin|padding|width|height' || true
)

if [ ! -z "$MARGIN_ANIMS" ]; then
  echo -e "${YELLOW}WARN${NC}"
  echo "⚠️  Found margin/padding/width/height animations. Use transform instead:"
  echo "$MARGIN_ANIMS" | head -3
else
  echo -e "${GREEN}OK${NC}"
fi

# ────────────────────────────────────────────────────────────────
# SUMMARY
# ────────────────────────────────────────────────────────────────

if [ $VIOLATIONS -gt 0 ]; then
  echo ""
  echo -e "${RED}❌ Token Bridge Compliance FAILED ($VIOLATIONS violations)${NC}"
  echo ""
  echo "Fixes:"
  echo "  1. Import tokens: import { duration, easing, distance } from '@/primitives/tokens'"
  echo "  2. Replace all hardcoded values with token references"
  echo "  3. Use useScrollReveal() and useStaggerEntrance() hooks"
  echo ""
  exit 1
else
  echo ""
  echo -e "${GREEN}✅ Token Bridge Compliance OK${NC}"
  exit 0
fi
```

---

## Integration with brudi-gate.sh

Add to main gate runner (`~/Brudi/orchestration/brudi-gate.sh`):

```bash
# In the quality-gate phase (after eslint, before build):

if [ "$PHASE" = "1" ]; then
  echo "Running Token Bridge Compliance Check..."
  bash "$GATE_DIR/brudi-gate-token-bridge.sh" "$PROJECT_ROOT" || {
    echo "❌ Token Bridge gate failed. Commit blocked."
    exit 1
  }
fi
```

---

## Integration with TASK.md

Add to Phase 1 checklist:

```markdown
### Phase 1 — Vertical Slices

**Token Bridge Enforcement (MANDATORY):**
- [ ] All animations import from `tokens.ts` — no hardcoded durations/easings/distances
- [ ] `useScrollReveal()` used for scroll-triggered reveals (not raw ScrollTrigger)
- [ ] `useStaggerEntrance()` used for list/grid animations (not raw gsap.to)
- [ ] Token bridge gate passes: `bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh`
```

---

## Integration with CLAUDE.md

Add to Agent Startup (new step):

```markdown
**Step 5.5 — Token Bridge Setup:**
Verify these files exist in your project:
- `primitives/tokens.ts` — Token constants
- `primitives/use-scroll-reveal.ts` — ScrollTrigger hook
- `primitives/use-stagger-entrance.ts` — Stagger animation hook

If missing, copy from `~/Brudi/templates/primitives/`.
```

---

## Manual Audit Process

For code review, check:

1. **Every `gsap.to()` call:**
   ```tsx
   ✅ gsap.to(el, { y: distance.md, duration: duration.normal, ease: easing.exit })
   ❌ gsap.to(el, { y: 32, duration: 0.35, ease: "power2.out" })
   ```

2. **Every ScrollTrigger usage:**
   ```tsx
   ✅ useScrollReveal(ref, { duration: 'slow' })
   ❌ gsap.to(el, { ... scrollTrigger: { ... } })
   ```

3. **Every staggered animation:**
   ```tsx
   ✅ useStaggerEntrance(ref, { itemSelector: '.item', stagger: 'normal' })
   ❌ gsap.to(items, { ... stagger: 0.08 })
   ```

---

## Testing the Gates

### Local Test

```bash
# Test the gate locally
bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh ./my-project

# Should output:
# ✅ Token Bridge Compliance OK
# (or list violations)
```

### CI Integration (GitHub Actions)

Add to `.github/workflows/quality.yml`:

```yaml
- name: Token Bridge Compliance
  run: bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh .
  if: github.event_name == 'pull_request'
```

---

## Exception Process

If a legitimate hardcoded value is needed (rare):

1. Document it with a comment:
   ```tsx
   // EXCEPTION: Custom easing for special interaction
   // Approved by: [person] on [date]
   // Reason: [explanation]
   gsap.to(el, { ease: "custom.easing" })
   ```

2. Add to gate whitelist:
   ```bash
   # In brudi-gate-token-bridge.sh, add:
   | grep -v 'custom\.easing'
   ```

3. Require approval in PR review

---

## Summary

**Gate checks:**
1. Zero hardcoded durations
2. Zero hardcoded easing strings
3. All distances match token values (4, 8, 12, 24, 32, 40, 48, 64, 80, 100)
4. No margin/padding/width animations (use transform)

**Failure = commit blocked**

**Command to run manually:**
```bash
bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh
```

**Integration:** Add to brudi-gate.sh quality phase + TASK.md Phase 1 checklist.
