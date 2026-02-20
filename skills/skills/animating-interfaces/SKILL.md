---
name: animating-interfaces
description: Use when adding animations, scroll effects, or smooth scrolling. Start here for timing, easing, and performance rules. For GSAP+Lenis setup see orchestrating-gsap-lenis. For React integration see orchestrating-react-animations.
---

# Animating Interfaces

## Critical: Reduced Motion First

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion) return // Skip animation setup
```

## Timing Hierarchy

| Type | Duration | When |
|------|----------|------|
| Micro | 100–200ms | Button hover, toggles, icon swap |
| Standard | 200–400ms | Card reveal, dropdown, panel |
| Dramatic | 400–800ms | Hero, page transition, modal |

**Easing:**
- Entering: `ease-out` — responsive, impactful
- Leaving: `ease-in` — graceful exit
- Never `linear` for movement — robotic, unnatural

## Performance Rule

**Only animate:**
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`

**Never animate** (causes layout thrashing):
- ❌ `width`, `height`, `top`, `left`, `margin`, `padding`

```javascript
gsap.to('.sidebar', { x: 300 })    // ✅ GPU
gsap.to('.sidebar', { width: 300 }) // ❌ CPU
```

## Stagger

```javascript
gsap.from('.card', { y: 40, opacity: 0, stagger: 0.08 })
// Max 150ms between items — more feels draggy
```

## View Transitions (Astro)

```javascript
// ✅ Re-initializes after EVERY navigation
document.addEventListener('astro:page-load', () => {
  gsap.from('.hero', { y: 50, opacity: 0 })
})

// ✅ Cleanup before DOM swap
document.addEventListener('astro:before-swap', () => {
  ScrollTrigger.getAll().forEach(t => t.kill())
  window.lenis?.destroy()
})
```

**Common mistake:** Initializing GSAP outside `astro:page-load` = breaks after navigation.

## Related Skills

- **orchestrating-gsap-lenis** — Full GSAP + Lenis setup, autoRaf, ticker, cleanup
- **orchestrating-react-animations** — GSAP/Framer Motion lifecycle in React
