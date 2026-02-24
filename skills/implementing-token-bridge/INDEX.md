# Token Bridge System — File Index

Quick navigation guide for all token bridge files.

---

## Start Here

1. **README.md** — System overview (start with this)
   - What problem it solves
   - Quick start guide
   - Token values at a glance
   - Key principles

2. **SKILL.md** — Comprehensive agent skill
   - Philosophy and architecture
   - Token categories (duration, easing, distance, stagger)
   - Before/after comparisons
   - Hook usage examples
   - Common mistakes

---

## For Implementation

3. **INTEGRATION.md** — Step-by-step setup guide
   - 11 integration steps
   - Copy files checklist
   - globals.css verification
   - CLAUDE.md and TASK.md updates
   - Gate script setup
   - Troubleshooting

4. **EXAMPLES.md** — Real-world code patterns
   - 6 before/after examples
   - Simple scroll reveal
   - Staggered list reveal
   - Hero character reveal
   - Button hover animation
   - Parallax background
   - Complex timeline
   - Copy-paste patterns

---

## For Enforcement

5. **GATE-ENFORCEMENT.md** — Automated detection
   - Grep detection patterns
   - brudi-gate-token-bridge.sh script
   - CI/CD integration
   - Manual audit checklist
   - Exception process

---

## Template Files

### Token Constants

**templates/primitives/tokens.ts**
- Duration tokens (micro, fast, normal, slow, hero)
- Easing tokens (enter, exit, smooth, emphasis, spring, inOut, linear)
- Distance tokens (micro, xs, sm, base, md, lg, xl, xxl, xxxl, full)
- Stagger tokens (tight, normal, relaxed, dramatic)
- Color token references
- Validation function
- TypeScript enums

### Animation Hooks

**templates/primitives/use-scroll-reveal.ts**
- useScrollReveal() — Scroll-triggered entrance
- useStaggerReveal() — Staggered scroll reveal
- useParallax() — Subtle parallax effect

**templates/primitives/use-stagger-entrance.ts**
- useStaggerEntrance() — On-mount stagger animation
- useCharacterReveal() — Character-by-character reveal
- useListReveal() — Simple list reveal alias

---

## File Reading Order

### For New Agents (Building Animations)

1. README.md — Get context (5 min)
2. SKILL.md — Learn the system (15 min)
3. EXAMPLES.md — See patterns (10 min)
4. tokens.ts (reference) — Understand token structure (5 min)
5. Start building with hooks

### For Project Setup

1. README.md — Understand the system (5 min)
2. INTEGRATION.md — Follow setup steps (20 min)
3. Copy template files (5 min)
4. Test: `bash brudi-gate-token-bridge.sh` (2 min)

### For Architecture/Enforcement

1. GATE-ENFORCEMENT.md — Understand automation (15 min)
2. Review grep patterns (5 min)
3. Integrate into CI/CD (10 min)

---

## Quick Reference

### Token Values

```
duration.micro   = 0.12s  (120ms)
duration.fast    = 0.18s  (180ms)
duration.normal  = 0.35s  (350ms)
duration.slow    = 0.65s  (650ms)
duration.hero    = 1.0s   (1000ms)

easing.enter     = power3.out
easing.exit      = power2.out
easing.smooth    = power2.out
easing.emphasis  = power3.out
easing.spring    = back.out(1.5)
easing.inOut     = power2.inOut
easing.linear    = linear (FORBIDDEN for motion)

distance.micro   = 4px
distance.xs      = 8px
distance.sm      = 12px
distance.base    = 24px
distance.md      = 32px
distance.lg      = 40px
distance.xl      = 48px
distance.xxl     = 64px
distance.xxxl    = 80px
distance.full    = 100px

stagger.tight    = 0.04s (40ms)
stagger.normal   = 0.08s (80ms)
stagger.relaxed  = 0.12s (120ms)
stagger.dramatic = 0.2s  (200ms)
```

### Hook Quick Reference

```typescript
// Scroll-triggered entrance
useScrollReveal(ref, { distance: 'md', duration: 'slow', ease: 'exit' })

// Staggered scroll reveal
useStaggerReveal(ref, { itemSelector: '.item', stagger: 0.08 })

// Parallax background
useParallax(ref, { speed: 0.3, direction: 'y' })

// On-mount stagger
useStaggerEntrance(ref, { itemSelector: '.item', duration: 'normal' })

// Character reveal
useCharacterReveal(ref, { duration: 'hero', stagger: 'tight' })

// List reveal
useListReveal(ref, { duration: 'slow' })
```

### Forbidden Patterns

```typescript
// ❌ DON'T DO THIS
gsap.to(el, { duration: 0.65, ease: "power2.out", y: 32 })
gsap.to(el, { marginTop: "32px" })
gsap.from(el, { ... })

// ✅ DO THIS INSTEAD
gsap.to(el, { duration: duration.slow, ease: easing.exit, y: distance.md })
gsap.to(el, { y: distance.md })
gsap.set(el, { y: distance.md }); gsap.to(el, { ... })
```

---

## File Sizes

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| tokens.ts | 8.4K | 281 | Token constants |
| use-scroll-reveal.ts | 6.9K | 252 | Scroll animation hooks |
| use-stagger-entrance.ts | 8.4K | 321 | Entrance animation hooks |
| README.md | 9.5K | 315 | Overview |
| SKILL.md | 16K | 531 | Agent skill |
| INTEGRATION.md | 11K | 423 | Setup guide |
| GATE-ENFORCEMENT.md | 13K | 415 | Enforcement system |
| EXAMPLES.md | 18K | 709 | Code examples |
| **TOTAL** | **90K** | **3,247** | Complete system |

---

## Checklist to Get Started

- [ ] Read README.md (this directory)
- [ ] Read SKILL.md (this directory)
- [ ] Copy tokens.ts to src/primitives/
- [ ] Copy use-scroll-reveal.ts to src/primitives/
- [ ] Copy use-stagger-entrance.ts to src/primitives/
- [ ] Verify globals.css has all --duration-*, --ease-*, --distance-* tokens
- [ ] Follow INTEGRATION.md setup steps
- [ ] Test: `bash brudi-gate-token-bridge.sh`
- [ ] Commit and celebrate!

---

## Troubleshooting

**Q: Can't find token_bridge_enforcement.sh**
A: It's in GATE-ENFORCEMENT.md — copy the script into your project

**Q: Import errors for tokens.ts**
A: Verify tsconfig.json has path alias: `"@/*": ["./src/*"]`

**Q: Gate script not running**
A: Check file permissions: `chmod +x brudi-gate-token-bridge.sh`

**Q: Which duration should I use?**
A: See "Token Values" in this file, or read SKILL.md section "When to use each"

**Q: Can I use custom easing?**
A: No. If you need new easing, add to tokens.ts and globals.css

---

## Related Skills

After mastering this skill, read:
- `orchestrating-react-animations` — GSAP in React lifecycle
- `scrolling-with-purpose` — ScrollTrigger patterns
- `designing-award-motion` — Motion design principles

---

## Document Structure

Each documentation file serves a specific purpose:

| File | Audience | Purpose |
|------|----------|---------|
| README.md | Everyone | Overview, quick start |
| SKILL.md | Agents/Developers | Complete reference |
| INTEGRATION.md | Project Managers | Setup instructions |
| GATE-ENFORCEMENT.md | Architects/CI Engineers | Automation details |
| EXAMPLES.md | Developers | Copy-paste patterns |
| INDEX.md | Everyone | Navigation and quick ref |

---

## Summary

This is a **complete token bridge system** that connects CSS design tokens to GSAP animations.

**The System:**
- tokens.ts exports TypeScript constants
- use-scroll-reveal.ts and use-stagger-entrance.ts use those constants
- Gate enforcement prevents hardcoding

**The Result:**
- Single source of truth for all animation timing
- Change once, update everywhere
- Type-safe, semantic, maintainable

**Start:** Read README.md, then SKILL.md
