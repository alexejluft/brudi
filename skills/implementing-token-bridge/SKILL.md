---
name: implementing-token-bridge
description: Bridge CSS tokens to GSAP animations. Use when building animations with GSAP — all motion values must flow through TypeScript token constants, not hardcoded strings or numbers.
---

# Implementing Token Bridge — CSS ↔ JavaScript Constants

**The Problem:** GSAP animations use hardcoded strings (`"power2.out"`) and numbers (`0.8`) instead of reusable tokens. The voidlab postmortem shows 0% adoption of the CSS token system by JavaScript.

**The Solution:** A TypeScript token bridge (`primitives/tokens.ts`) that maps CSS custom properties to JavaScript constants. All animations import from this single source.

**Golden Rule:** If you hardcode a duration, easing, or distance value in GSAP — you've broken the system.

---

## The Token System

### Three Layers

```
CSS (globals.css)
    ↓
TypeScript Constants (primitives/tokens.ts)
    ↓
React Hooks (use-scroll-reveal.ts, use-stagger-entrance.ts)
```

**Flow:**
1. CSS defines the physical value: `--duration-normal: 350ms`
2. TypeScript exports it: `export const duration = { normal: 0.35 }`
3. Components import and use: `duration.normal` (no magic strings)

---

## Token Categories

### DURATION TOKENS — milliseconds to seconds

CSS milliseconds are converted to GSAP seconds:

```typescript
import { duration } from '@/primitives/tokens'

export const duration = {
  micro:  0.12,   // 120ms   — toggles, checkboxes
  fast:   0.18,   // 180ms   — button hover
  normal: 0.35,   // 350ms   — card reveal, dropdown
  slow:   0.65,   // 650ms   — section entrance, page transition
  hero:   1.0,    // 1000ms  — hero banner, max attention
} as const
```

**Usage:**

```tsx
// ✅ CORRECT — Token-driven
gsap.to(el, { y: 0, opacity: 1, duration: duration.normal })

// ❌ WRONG — Hardcoded number
gsap.to(el, { y: 0, opacity: 1, duration: 0.5 })

// ❌ WRONG — Hardcoded string (not a valid GSAP duration)
gsap.to(el, { y: 0, opacity: 1, duration: "normal" })
```

**When to use each:**
- `micro` (0.12s): Very fast feedback (checkbox toggle, focus indicator)
- `fast` (0.18s): Quick interactions (button hover, dropdown open)
- `normal` (0.35s): Standard reveal (card entrance, panel expand)
- `slow` (0.65s): Section entrance from scroll
- `hero` (1.0s): Maximum attention (hero headline, icon sequence)

---

### EASING TOKENS — GSAP-compatible strings

All easings are GSAP-compatible power curves:

```typescript
export const easing = {
  enter:    "power3.out",        // Aggressive entrance
  exit:     "power2.out",        // Responsive exit
  smooth:   "power2.out",        // Subtle, premium
  emphasis: "power3.out",        // Hero luxury
  spring:   "back.out(1.5)",     // Bouncy playful
  inOut:    "power2.inOut",      // Symmetric scroll
  linear:   "linear",            // FORBIDDEN (except spinners)
}
```

**Mapping to cubic-bezier (for reference):**
- `power3.out` = `cubic-bezier(0.16, 1, 0.3, 1)` — sharp arrival
- `power2.out` = `cubic-bezier(0.25, 1, 0.5, 1)` — smooth arrival
- `sine.inOut` = `cubic-bezier(0.42, 0, 0.58, 1)` — symmetric (same in/out)
- `back.out(1.5)` = `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — bouncy
- `linear` = `cubic-bezier(0, 0, 1, 1)` — NO motion feel (spinners only)

**Usage:**

```tsx
// ✅ CORRECT — Token easing
gsap.to(el, { y: 0, ease: easing.enter })

// ❌ WRONG — Hardcoded GSAP easing string
gsap.to(el, { y: 0, ease: "power2.out" })

// ❌ WRONG — Hardcoded cubic-bezier
gsap.to(el, { y: 0, ease: "cubic-bezier(0.25,1,0.5,1)" })
```

**When to use each:**
- `enter`: Hero headlines, card reveals, section entrances (aggressive)
- `exit`: Standard animations, button clicks, quick feedback
- `smooth`: Subtle scroll-based movement, refined feel
- `emphasis`: Maximum impact, luxury animations, hero areas
- `spring`: Playful, celebratory, bouncy interactions
- `inOut`: Scroll scrubbing, symmetric timing (enter and exit same duration)
- `linear`: ⛔ FORBIDDEN for natural motion. ONLY for spinners/loaders

---

### DISTANCE TOKENS — pixels for transform

All distances are transform-safe (use `y`, `x`, `scale` — never `margin`/`width`):

```typescript
export const distance = {
  micro:  4,      // 4px   — fine-tuning
  xs:     8,      // 8px   — subtle offset
  sm:     12,     // 12px  — light entrance
  base:   24,     // 24px  — standard entrance
  md:     32,     // 32px  — medium entrance
  lg:     40,     // 40px  — prominent entrance
  xl:     48,     // 48px  — large entrance
  xxl:    64,     // 64px  — hero parallax
  xxxl:   80,     // 80px  — extra-large parallax
  full:   100,    // 100px — maximum parallax
}
```

**Usage:**

```tsx
// ✅ CORRECT — Transform-based (efficient, GPU-accelerated)
gsap.set(el, { y: distance.md })
gsap.to(el, { y: 0 })

// ❌ WRONG — Margin-based animation (triggers layout recalc)
gsap.to(el, { marginTop: "32px" })

// ❌ WRONG — Hardcoded pixels
gsap.to(el, { y: 32 })
```

**When to use each:**
- `micro` (4px): Tiny adjustments, fine-tuning
- `xs` (8px): Subtle entrance, minimal motion
- `sm` (12px): Light reveal
- `base` (24px): Most common, standard entrance
- `md` (32px): Medium prominence
- `lg` (40px): Category-level reveal
- `xl` (48px): Section-level movement
- `xxl` (64px): Hero parallax
- `full` (100px): Maximum parallax depth

---

### STAGGER TOKENS — delay between children

Sequential animation delay for lists and grids:

```typescript
export const stagger = {
  tight:    0.04,   // 40ms  — dense sequences
  normal:   0.08,   // 80ms  — standard 6-12 items
  relaxed:  0.12,   // 120ms — loose spacing
  dramatic: 0.2,    // 200ms — hero, maximum emphasis
}
```

**Usage:**

```tsx
// ✅ CORRECT — Token-driven stagger
gsap.to(items, { opacity: 1, stagger: stagger.normal })

// ❌ WRONG — Hardcoded delay
gsap.to(items, { opacity: 1, stagger: 0.08 })
```

**When to use each:**
- `tight` (0.04s): Many items (20+), dense layout
- `normal` (0.08s): Standard list/grid (6-12 items)
- `relaxed` (0.12s): Loose spacing, gallery reveal
- `dramatic` (0.2s): Hero animations, maximum emphasis

---

## Using the Token System — Before & After

### Before (❌ Wrong — Hardcoded)

```tsx
// voidlab project — pure hardcoding, 0% token adoption
function HeroSection() {
  const headlineRef = useRef(null)

  useEffect(() => {
    gsap.set(headlineRef.current, { opacity: 0, y: 40 })
    gsap.to(headlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,           // ❌ Magic number
      ease: "power2.out",      // ❌ Magic string
      scrollTrigger: {
        trigger: headlineRef.current,
        start: "top 80%",
        once: true,
      }
    })
  }, [])

  return <h1 ref={headlineRef}>...</h1>
}
```

**Problems:**
- Hardcoded `0.8` has no semantic meaning
- `"power2.out"` is arbitrary (why not `power3.out`?)
- No connection to CSS tokens
- If you change `--duration-slow`, you have to find 47 `0.8` values

---

### After (✅ Correct — Token-driven)

```tsx
import { useScrollReveal } from '@/primitives/use-scroll-reveal'
import { duration, easing, distance } from '@/primitives/tokens'

function HeroSection() {
  const headlineRef = useRef(null)

  // ✅ One hook call, token-driven
  useScrollReveal(headlineRef, {
    distance: 'md',      // 32px (from tokens.distance)
    duration: 'slow',    // 0.65s (from tokens.duration)
    ease: 'exit',        // power2.out (from tokens.easing)
  })

  return <h1 ref={headlineRef}>...</h1>
}
```

**Benefits:**
- Single source of truth: `tokens.ts` is the authority
- Change `tokens.distance.md` → updates everywhere
- No magic strings or numbers
- Readable semantic names
- TypeScript enforces valid token keys

---

## The Hooks — Eliminate Boilerplate

### useScrollReveal — Scroll-triggered entrance

Replaces 20+ lines of `gsap.set()`, `gsap.to()`, `ScrollTrigger` config:

```tsx
import { useScrollReveal } from '@/primitives/use-scroll-reveal'

function FeatureCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  // ✅ One line — all boilerplate gone
  useScrollReveal(cardRef, {
    distance: 'lg',
    duration: 'slow',
    ease: 'enter',
  })

  return <div ref={cardRef}>Card content...</div>
}
```

**What's included:**
- `gsap.set()` initial state
- `gsap.to()` animation
- `ScrollTrigger` registration and cleanup
- `ScrollTrigger.kill()` in useEffect return (StrictMode safe)

**Options:**
```typescript
interface ScrollRevealOptions {
  distance?: 'micro' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'full'
  duration?: 'micro' | 'fast' | 'normal' | 'slow' | 'hero'
  ease?: 'enter' | 'exit' | 'smooth' | 'emphasis' | 'spring' | 'inOut' | 'linear'
  triggerStart?: string              // 'top 85%' by default
  once?: boolean                     // true by default
  additionalProps?: gsap.TweenVars   // Extra properties (rotation, scale, etc.)
  scrollTriggerConfig?: { ... }      // Custom ScrollTrigger options
}
```

---

### useStaggerEntrance — On-mount stagger animation

Reveals lists/grids with sequential delay on component mount (not scroll):

```tsx
import { useStaggerEntrance } from '@/primitives/use-stagger-entrance'

function FeatureList() {
  const listRef = useRef<HTMLDivElement>(null)

  useStaggerEntrance(listRef, {
    itemSelector: '.feature-item',
    duration: 'normal',
    stagger: 'normal',
    ease: 'exit',
  })

  return (
    <div ref={listRef}>
      <div className="feature-item">Item 1</div>
      <div className="feature-item">Item 2</div>
      <div className="feature-item">Item 3</div>
    </div>
  )
}
```

**Variants:**
- `slideUp` (default): Fade-in + translateY from below
- `fadeScale`: Fade-in + scale from 0.9
- `fadeOnly`: Pure opacity entrance

---

### useParallax — Subtle scroll parallax

```tsx
import { useParallax } from '@/primitives/use-scroll-reveal'

function HeroBackground() {
  const bgRef = useRef<HTMLDivElement>(null)

  // Speed 0.3 = subtle parallax
  useParallax(bgRef, { speed: 0.3, direction: 'y' })

  return <div ref={bgRef} className="absolute inset-0 bg-gradient-to-b" />
}
```

---

## Gate Enforcement — Detecting Non-Token Usage

### Grep Patterns for Detection

**Pattern 1: Hardcoded GSAP duration numbers**

```bash
# Find gsap.to() with explicit numeric duration
grep -rn 'duration:\s*[0-9.]*[,}]' src/components/
# OR
grep -rn 'gsap\.(to|from)\s*([^,]*,\s*{[^}]*duration:\s*[0-9.]' src/
```

**Expected matches:** Should be 0 (all durations from `duration.*`)

---

**Pattern 2: Hardcoded easing strings**

```bash
# Find GSAP easing strings that aren't from tokens
grep -rn 'ease:\s*["\047]power\|sine\|cubic-bezier' src/components/
# OR
grep -rn 'ease:\s*["\047](?!easing\.)' src/  # Strings not starting with "easing."
```

**Expected matches:** Should be 0 (all easings from `easing.*`)

---

**Pattern 3: Hardcoded distance values in transforms**

```bash
# Find numeric y/x values in gsap.set/to that aren't from distance.*
grep -rn 'gsap\.(set|to).*{[^}]*[xy]:\s*[0-9]+' src/components/
# Then verify the number matches a token value (4, 8, 12, 24, 32, 40, 48, 64, 80, 100)
```

---

### Pre-commit Hook Integration

Add to `.husky/pre-commit`:

```bash
# Token bridge compliance checks
echo "Checking token bridge compliance..."

# Check 1: No hardcoded durations
HARDCODED_DURATIONS=$(grep -rn 'duration:\s*[0-9]' src/components/ --include="*.tsx" --include="*.ts" | grep -v 'duration:.*duration\.' || true)
if [ ! -z "$HARDCODED_DURATIONS" ]; then
  echo "❌ Found hardcoded GSAP durations. Import from tokens.ts:"
  echo "$HARDCODED_DURATIONS"
  exit 1
fi

# Check 2: No hardcoded easing strings
HARDCODED_EASINGS=$(grep -rn 'ease:.*["\047]power\|ease:.*["\047]sine' src/components/ --include="*.tsx" --include="*.ts" || true)
if [ ! -z "$HARDCODED_EASINGS" ]; then
  echo "❌ Found hardcoded easing strings. Import from tokens.ts:"
  echo "$HARDCODED_EASINGS"
  exit 1
fi

echo "✅ Token bridge compliance OK"
```

---

## Integration Checklist

### Phase 0 — Foundation Setup

- [ ] Copy `templates/primitives/tokens.ts` to your project
- [ ] Copy `templates/primitives/use-scroll-reveal.ts` to your project
- [ ] Copy `templates/primitives/use-stagger-entrance.ts` to your project
- [ ] Ensure `globals.css` has all `--duration-*`, `--ease-*`, `--distance-*` tokens
- [ ] Verify `validateTokens()` passes (optional test)

### Phase 1 — Component Building

- [ ] Import tokens in every animation: `import { duration, easing, distance, stagger } from '@/primitives/tokens'`
- [ ] Use hooks instead of raw GSAP: `useScrollReveal()`, `useStaggerEntrance()`
- [ ] Never write hardcoded `duration`, `ease`, or distance values
- [ ] If you need a custom value, add it to `tokens.ts` (don't hardcode)

### Phase 2 — Quality Gate

- [ ] Run grep patterns (above) — should return 0 matches
- [ ] Confirm `npm run build` succeeds
- [ ] Run pre-commit hook test (optional)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `gsap.to(el, { y: 32 })` | Use `distance.base` or appropriate token |
| `duration: 0.8` | Use `duration.slow` |
| `ease: "power2.out"` | Use `easing.exit` |
| `gsap.from()` with refs | Use `gsap.set() + gsap.to()` pattern (✅ hooks do this) |
| String selectors in GSAP | Always use refs (`ref.current` → `gsap.to(ref.current, ...)`) |
| No ScrollTrigger cleanup | ✅ Hooks handle cleanup automatically |
| Hardcoding `stagger: 0.08` | Use `stagger.normal` |

---

## Migration Path (Existing Projects)

If you have existing GSAP code without tokens:

1. **Find all GSAP animations:**
   ```bash
   grep -rn "gsap\." src/components/ | grep -E "(to|from|set)\s*\("
   ```

2. **Categorize by type:**
   - Duration values → Map to `duration.*`
   - Easing strings → Map to `easing.*`
   - Distance values → Map to `distance.*`

3. **Replace in place:**
   ```tsx
   // Before
   gsap.to(el, { y: 32, duration: 0.65, ease: "power2.out" })

   // After
   import { duration, easing, distance } from '@/primitives/tokens'
   gsap.to(el, { y: distance.md, duration: duration.slow, ease: easing.exit })
   ```

4. **Extract repeated patterns into hooks:**
   - 5+ `useEffect` with ScrollTrigger → Extract to `useScrollReveal()`
   - 3+ stagger animations → Extract to `useStaggerEntrance()`

---

## TypeScript Strict Mode Support

All tokens are typed as `as const`, enabling strict type checking:

```tsx
import { duration, DurationToken } from '@/primitives/tokens'

// ✅ TypeScript catches this at compile time
const myDuration: DurationToken = 'normal'  // ✅ OK
const badDuration: DurationToken = 'slow-ish'  // ❌ Type error

// Use enums for even stricter typing
import { DurationToken } from '@/primitives/tokens'
const speed = duration[DurationToken.Normal]  // ✅ Fully typed
```

---

## Summary

**The Rule:** No more hardcoded animation values.

**The System:**
- `tokens.ts` = single source of truth
- `use-scroll-reveal.ts` + `use-stagger-entrance.ts` = hooks that use tokens
- All durations, easings, distances flow through constants

**The Benefit:** Change `tokens.distance.md` once → updates everywhere. No hunting for `32` across 50 files.

**The Enforcement:** Grep patterns catch violations. Pre-commit hook blocks violations. TypeScript enums prevent typos.

**Read Next:**
- `orchestrating-react-animations` — GSAP in React lifecycle
- `scrolling-with-purpose` — ScrollTrigger patterns
- `designing-award-motion` — Motion design principles
