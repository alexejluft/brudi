---
name: animating-interfaces
description: Use when adding animations, scroll effects, or smooth scrolling. Start here for timing, easing, and performance rules. Updated for Tailwind CSS v4 easing customization. For GSAP+Lenis setup see orchestrating-gsap-lenis. For React integration see orchestrating-react-animations.
---

# Animating Interfaces

## The Rule

**Only animate `transform` and `opacity`. Respect reduced motion. Micro ≤200ms, standard ≤400ms, dramatic ≤800ms. Use `will-change` sparingly. Clean up every animation.**

## Reduced Motion First

```tsx
// ✅ CSS kill-switch + JS check before GSAP setup
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) return  // Skip all GSAP setup

// ✅ Global CSS safeguard
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Timing + Easing (Tailwind v4)

Micro: 100–200ms (hover, toggles). Standard: 200–400ms (cards, panels). Dramatic: 400–800ms (hero, modals).

```css
/* globals.css — define custom easings via @theme */
@theme {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
}
```

Then use in classes: `duration-300 ease-out-expo`, `duration-600 ease-in-out-quint`

**GSAP patterns:**
- Entering → `ease-out` (responsive, impactful)
- Leaving → `ease-in` (graceful exit)
- Movement → custom ease from `@theme`

## Performance: Transform & Opacity Only

```tsx
// ✅ Correct: GPU-accelerated properties only — Element-Refs, nicht Strings
const card = document.querySelector('.card') // oder ref.current in React
gsap.to(card, { x: 200, opacity: 1, scale: 1.05 })

// ❌ WRONG: Layout-triggering — causes jank
// gsap.to(card, { width: 200, height: 300, top: 50 })
```

### `will-change` — Apply Before, Remove After

```tsx
// ✅ Set before animation, release after — Element-Refs verwenden
const card = document.querySelector('.card') // oder ref.current in React
gsap.set(card, { willChange: 'transform, opacity' })
gsap.to(card, { y: 0, opacity: 1, onComplete: () =>
  gsap.set(card, { willChange: 'auto' })
})
```

## Stagger Patterns

```tsx
// ✅ Max 80–100ms between items — use set() + to(), NEVER from()
const cards = containerRef.current?.querySelectorAll('.card')
gsap.set(cards, { y: 40, opacity: 0 })
gsap.to(cards, { y: 0, opacity: 1, stagger: 0.08, ease: 'power2.out' })

// ✅ Grid stagger for 2D layouts
const items = containerRef.current?.querySelectorAll('.grid-item')
gsap.set(items, { scale: 0.8, opacity: 0 })
gsap.to(items, { scale: 1, opacity: 1,
  stagger: { each: 0.06, grid: 'auto', from: 'start' } })
```

## useGSAP Hook (React)

```tsx
'use client'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

function HeroSection() {
  const container = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    // ✅ IMMER set() + to() — NIEMALS from()
    const title = container.current?.querySelector('.hero-title')
    const subtitle = container.current?.querySelector('.hero-subtitle')
    gsap.set([title, subtitle], { opacity: 0 })
    gsap.set(title, { y: 60 })
    gsap.set(subtitle, { y: 40 })
    gsap.to(title, { y: 0, opacity: 1, duration: 0.8 })
    gsap.to(subtitle, { y: 0, opacity: 1, delay: 0.2 })
  }, { scope: container })
  return <div ref={container}>...</div>
}
// ✅ useGSAP: handles cleanup + StrictMode automatically
```

## Variable Font Animations

GSAP animates `font-variation-settings` — weight, slant in real-time. Only works with variable fonts.

```tsx
// ✅ Hover: thin → bold — Element-Ref verwenden
const navLink = document.querySelector('.nav-link') // oder ref.current
gsap.to(navLink, { fontVariationSettings: '"wght" 700', duration: 0.3 })
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Animating width/height/top/left | Only `transform` + `opacity` |
| No reduced-motion check | Add CSS media query + JS `matchMedia` |
| `will-change` globally | Apply before, remove after animation |
| Custom easing hardcoded in JS | Define via `@theme` in CSS, use GSAP easing names |
| Stagger > 150ms | Keep `stagger: 0.06–0.1` max |
| `useEffect` for GSAP in React | Use `useGSAP` hook with `scope` |
| Static font + fontVariationSettings | Variable font required |
