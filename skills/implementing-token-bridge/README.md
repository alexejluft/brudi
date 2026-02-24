# Token Bridge — Complete System Overview

This directory contains the complete Token Bridge system that solves the voidlab postmortem finding: "CSS tokens have 0% adoption by GSAP animations."

---

## What This System Solves

**Problem:** GSAP animations use hardcoded strings and numbers:
```typescript
// ❌ Before
gsap.to(el, { y: 32, duration: 0.65, ease: "power2.out" })
```

**Solution:** All motion values flow through TypeScript token constants:
```typescript
// ✅ After
gsap.to(el, { y: distance.md, duration: duration.slow, ease: easing.exit })
```

**Impact:**
- Single source of truth for all animation timing
- Change one token → all animations update
- Type-safe: TypeScript catches token name typos
- Semantic: token names clarify intent

---

## File Structure

### 1. TypeScript Token Constants

**`templates/primitives/tokens.ts`** (281 lines)

Exports all motion tokens as immutable TypeScript constants:
- `duration` — Animation durations in seconds (micro, fast, normal, slow, hero)
- `easing` — GSAP-compatible easing strings (enter, exit, smooth, emphasis, spring, inOut, linear)
- `distance` — Transform distances in pixels (micro, xs, sm, base, md, lg, xl, xxl, xxxl, full)
- `stagger` — Delay between animated children (tight, normal, relaxed, dramatic)
- `colors` — Reference to CSS color tokens

**Usage:**
```typescript
import { duration, easing, distance, stagger } from '@/primitives/tokens'

gsap.to(el, {
  y: distance.md,
  duration: duration.normal,
  ease: easing.exit,
})
```

---

### 2. Animation Hooks

**`templates/primitives/use-scroll-reveal.ts`** (252 lines)

Reusable React hooks for common GSAP patterns:

- `useScrollReveal()` — Scroll-triggered entrance animation (fade + translateY)
- `useStaggerReveal()` — Scroll-triggered stagger for lists/grids
- `useParallax()` — Subtle scroll parallax effect

**Eliminates:**
- ScrollTrigger boilerplate (20+ lines per component)
- Manual cleanup (ScrollTrigger.kill, tween.kill)
- gsap.from() gotchas (uses gsap.set + gsap.to pattern)

---

**`templates/primitives/use-stagger-entrance.ts`** (321 lines)

Hooks for on-mount animations (not scroll-triggered):

- `useStaggerEntrance()` — Staggered entrance for lists/grids on mount
- `useCharacterReveal()` — Character-by-character headline reveal
- `useListReveal()` — Simple alias for common list reveal pattern

---

### 3. Documentation

**`SKILL.md`** (531 lines)

Complete skill file for agents building animations:
- Philosophy and the token system
- Token categories (duration, easing, distance, stagger)
- Before & after comparisons
- Hook usage examples
- Common mistakes and fixes
- Migration path for existing projects
- TypeScript strict mode support

**Read this first** when building animations.

---

**`INTEGRATION.md`** (423 lines)

Step-by-step guide to integrate the system into a project:
1. Copy files to project
2. Verify globals.css has all tokens
3. Update CLAUDE.md and TASK.md
4. Copy and integrate gate script
5. Test locally
6. Update ESLint rules (optional)
7. Document for team

**Read this** to set up the system.

---

**`GATE-ENFORCEMENT.md`** (415 lines)

Automated detection and prevention of hardcoded values:
- Grep patterns for finding violations
- Shell script implementation (brudi-gate-token-bridge.sh)
- Integration with main gate runner
- Manual audit checklist
- Exception process

**Read this** to understand how enforcement works.

---

**`EXAMPLES.md`** (709 lines)

Real-world before & after code examples:
1. Simple scroll reveal (FeatureCard)
2. Staggered list reveal (FeatureList)
3. Hero headline character reveal
4. Button hover animation
5. Parallax background
6. Complex timeline

**Read this** for copy-paste patterns.

---

## Quick Start

### For Projects Starting Fresh

1. Copy files:
   ```bash
   cp ~/Brudi/templates/primitives/tokens.ts src/primitives/
   cp ~/Brudi/templates/primitives/use-scroll-reveal.ts src/primitives/
   cp ~/Brudi/templates/primitives/use-stagger-entrance.ts src/primitives/
   ```

2. Verify tokens in globals.css match tokens.ts values

3. Use in components:
   ```tsx
   import { useScrollReveal } from '@/primitives/use-scroll-reveal'
   import { duration, easing, distance } from '@/primitives/tokens'

   function MyComponent() {
     const ref = useRef(null)
     useScrollReveal(ref, { duration: 'slow', ease: 'exit' })
     return <div ref={ref}>Content</div>
   }
   ```

---

### For Existing Projects

1. Read: `SKILL.md` (understand the system)
2. Copy: Files from templates/primitives/
3. Migrate: Find hardcoded values → replace with tokens
4. Test: Gate passes, animations smooth
5. Gate: Add to CI/CD for enforcement

See EXAMPLES.md for migration patterns.

---

## The Token System at a Glance

### Duration (seconds for GSAP)
```
micro   0.12s   Toggle, checkbox, focus
fast    0.18s   Button hover
normal  0.35s   Card reveal, dropdown
slow    0.65s   Section entrance, page transition
hero    1.0s    Hero banner, maximum attention
```

### Easing (GSAP-compatible strings)
```
enter       power3.out      Aggressive entrance
exit        power2.out      Responsive, standard
smooth      power2.out      Subtle, premium
emphasis    power3.out      Hero luxury
spring      back.out(1.5)   Bouncy, playful
inOut       power2.inOut    Symmetric scroll
linear      linear          FORBIDDEN (spinners only)
```

### Distance (pixels for transform)
```
micro    4px     Fine-tuning
xs       8px     Subtle offset
sm       12px    Light entrance
base     24px    Standard entrance
md       32px    Medium entrance
lg       40px    Prominent entrance
xl       48px    Large entrance
xxl      64px    Hero parallax
xxxl     80px    Extra-large parallax
full     100px   Maximum parallax
```

### Stagger (seconds between children)
```
tight       0.04s   Dense sequences (20+ items)
normal      0.08s   Standard lists (6-12 items)
relaxed     0.12s   Loose spacing, gallery
dramatic    0.2s    Hero animations, emphasis
```

---

## Gates (Enforcement)

Automated checks prevent hardcoded values:

```bash
bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh
```

Checks:
1. ✅ No hardcoded GSAP durations
2. ✅ No hardcoded easing strings
3. ✅ No non-token distance values
4. ✅ No margin/padding/width animations

Failures block commits.

---

## File Dependencies

```
globals.css (CSS tokens)
    ↓
tokens.ts (TypeScript constants)
    ↓
use-scroll-reveal.ts (Hooks that use tokens)
use-stagger-entrance.ts (Hooks that use tokens)
    ↓
Your components (Import hooks + tokens)
```

All files must be present for the system to work.

---

## Integration Checklist

- [ ] Copy tokens.ts, use-scroll-reveal.ts, use-stagger-entrance.ts to src/primitives/
- [ ] Verify globals.css has all --duration-*, --ease-*, --distance-* tokens
- [ ] Read SKILL.md and EXAMPLES.md
- [ ] Update CLAUDE.md with token bridge section
- [ ] Update TASK.md Phase 1 requirements
- [ ] Set up gate script for automated enforcement
- [ ] Test locally: `bash ./brudi-gate-token-bridge.sh .`
- [ ] Integrate gate into CI/CD pipeline
- [ ] Communicate system to team

---

## Key Principles

1. **Single Source of Truth:** Token values defined once in CSS, exported as TS constants
2. **Semantic Naming:** Token names clarify intent (duration.slow vs 0.65)
3. **Type Safety:** TypeScript catches typos in token keys
4. **Automated Enforcement:** Grep patterns + gate script prevent violations
5. **Hooks Eliminate Boilerplate:** useScrollReveal() replaces 20 lines of ScrollTrigger setup
6. **Global Updates:** Change tokens.distance.md once → all animations update

---

## For Agents

When building animations:

1. **Always import tokens:**
   ```typescript
   import { duration, easing, distance } from '@/primitives/tokens'
   ```

2. **Never hardcode:**
   ```typescript
   // ❌ WRONG
   gsap.to(el, { y: 32, duration: 0.65 })

   // ✅ CORRECT
   gsap.to(el, { y: distance.md, duration: duration.slow })
   ```

3. **Use hooks for common patterns:**
   ```typescript
   // ✅ Instead of raw gsap.to + ScrollTrigger
   useScrollReveal(ref, { duration: 'slow', distance: 'md' })
   ```

4. **Gate will catch violations:**
   - If you hardcode a duration → gate fails
   - If you hardcode an easing string → gate fails
   - If you use margin animation → gate warns
   - Fix and re-commit (no exceptions)

---

## References

- **Skill File:** This directory (SKILL.md)
- **Integration Guide:** INTEGRATION.md
- **Gate Enforcement:** GATE-ENFORCEMENT.md
- **Code Examples:** EXAMPLES.md
- **Token Constants:** templates/primitives/tokens.ts (JSDoc comments)
- **Hooks API:** templates/primitives/use-scroll-reveal.ts (JSDoc comments)

---

## Related Skills

After this skill, read:
- `orchestrating-react-animations` — GSAP in React lifecycle
- `scrolling-with-purpose` — ScrollTrigger patterns and optimization
- `designing-award-motion` — Motion design principles and choreography
- `animating-interfaces` — Animation timing, performance, best practices

---

## Summary

This is a **complete bridge between CSS design tokens and JavaScript/GSAP animations.**

Instead of:
- Hardcoded durations scattered across components
- Easing strings with no semantic meaning
- Distance values that don't connect to design system
- Duplication making global changes impossible

You get:
- One source of truth (tokens.ts)
- Semantic token names (duration.slow, easing.enter)
- Typed constants (no typos)
- Hooks that eliminate boilerplate (one line vs 20)
- Automated enforcement (gate prevents violations)
- Global updates (change once, everything updates)

**Read SKILL.md to get started.**
