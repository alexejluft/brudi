---
name: animating-interfaces
description: Use when adding animations, scroll effects, or smooth scrolling. Start here for timing, easing, and performance rules. For GSAP+Lenis setup see orchestrating-gsap-lenis. For React integration see orchestrating-react-animations.
---

# Animating Interfaces

## The Rule

**Only animate `transform` and `opacity`. Respect reduced motion. Micro ≤200ms, standard ≤400ms, dramatic ≤800ms. Use `will-change` sparingly. Clean up every animation.**

---

## Reduced Motion First

```tsx
// ✅ CSS kill-switch + JS check before GSAP setup
// CSS: @media (prefers-reduced-motion: reduce) { *, *::before, *::after {
//   animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }}
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) return  // Skip all GSAP setup
// ❌ WRONG: No reduced-motion check — accessibility failure
```

---

## Timing + Easing

Micro: 100–200ms (hover, toggles). Standard: 200–400ms (cards, panels). Dramatic: 400–800ms (hero, modals).

```
Entering  → ease-out             (responsive, impactful)
Leaving   → ease-in              (graceful exit)
Movement  → cubic-bezier(0.16, 1, 0.3, 1)  (smooth deceleration)
Never     → linear               (feels robotic)
```

---

## Performance: Transform & Opacity Only

```tsx
// ✅ Correct: GPU-accelerated properties only
gsap.to('.card', { x: 200, opacity: 1, scale: 1.05 })

// ❌ WRONG: Layout-triggering properties — causes jank
// gsap.to('.card', { width: 200, height: 300, top: 50 })
// ❌ WRONG: margin, padding, left, right — all cause reflow
```

### `will-change` — Apply Before, Remove After

```tsx
// ✅ Set before, release after — never globally
gsap.set('.card', { willChange: 'transform, opacity' })
gsap.to('.card', { y: 0, opacity: 1, onComplete: () =>
  gsap.set('.card', { willChange: 'auto' })
})
// ❌ WRONG: * { will-change: transform; } — wastes GPU memory permanently
```

---

## Stagger Patterns

```tsx
// ✅ Max 80–100ms between items — more feels sluggish
gsap.from('.card', { y: 40, opacity: 0, stagger: 0.08, ease: 'power2.out' })
// ✅ Grid stagger for 2D layouts
gsap.from('.grid-item', { scale: 0.8, opacity: 0,
  stagger: { each: 0.06, grid: 'auto', from: 'start' } })
// ❌ WRONG: stagger: 0.3 — user waits too long
```

---

## useGSAP Hook (React)

```tsx
// ✅ useGSAP: handles cleanup + StrictMode automatically
import { useGSAP } from '@gsap/react'
function HeroSection() {
  const container = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.from('.hero-title', { y: 60, opacity: 0, duration: 0.8 })
    gsap.from('.hero-subtitle', { y: 40, opacity: 0, delay: 0.2 })
  }, { scope: container })
  return <div ref={container}>...</div>
}
// ❌ WRONG: useEffect + manual cleanup — breaks in StrictMode
```

---

## Variable Font Animations

> 💡 Asset: `~/.brudi/assets/configs/gsap-snippets.ts`

GSAP animates `font-variation-settings` — weight, slant in real-time. Only works with variable fonts. See `crafting-typography` for full patterns.

```tsx
// ✅ Hover: thin → bold. Scroll-driven: text "grows" as user scrolls
gsap.to('.nav-link', { fontVariationSettings: '"wght" 700', duration: 0.3 })
// ❌ Static font → fontVariationSettings has no effect
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Animating width/height/top/left | Only `transform` + `opacity` |
| No reduced-motion check | CSS media query + JS matchMedia |
| `will-change` on everything | Apply before, remove after animation |
| `linear` easing on UI elements | `ease-out` for enter, `ease-in` for exit |
| Stagger > 150ms between items | Keep `stagger: 0.06–0.1` max |
| `useEffect` for GSAP in React | `useGSAP` hook with `scope` |
| Static font + fontVariationSettings | Variable font required — no effect otherwise |
