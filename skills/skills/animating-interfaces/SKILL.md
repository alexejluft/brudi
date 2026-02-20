---
name: animating-interfaces
description: Use when adding animations, scroll effects, or smooth scrolling. Especially important for GSAP + Lenis integration and respecting reduced motion preferences.
---

# Animating Interfaces

## Critical: Reduced Motion First

**Before ANY animation code:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or in JS:
```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) return; // Skip animation setup
```

## Timing Hierarchy

| Type | Duration | When |
|------|----------|------|
| Micro | 100-200ms | Button hover, toggles |
| Standard | 200-400ms | Card reveals, panels |
| Dramatic | 400-800ms | Hero, page transitions |

**Easing:**
- Enter (appearing): `ease-out`
- Exit (leaving): `ease-in`
- Never: `linear` for movement

## GSAP + Lenis Setup (Critical)

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  autoRaf: false  // ⚠️ MUST be false with GSAP
});

// Connect Lenis to GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
```

**Common Bug:** `autoRaf: true` with GSAP = double RAF loop = broken animations

## Performance Rule

**Only animate:**
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`

**Never animate:**
- ❌ `width`, `height`
- ❌ `top`, `left`, `right`, `bottom`
- ❌ `margin`, `padding`

```javascript
// ❌ Layout thrashing
gsap.to('.sidebar', { width: 300 });

// ✅ GPU-accelerated
gsap.to('.sidebar', { x: 300 });
```

## ScrollTrigger Essentials

```javascript
gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1  // 1s smooth catch-up
  }
});
```

**scrub values:**
- `true` = instant (jerky)
- `0.5-1` = smooth (recommended)
- `2+` = laggy

## Stagger

```javascript
gsap.from('.card', {
  y: 40,
  opacity: 0,
  stagger: 0.08  // 80ms between each
});
```

Max stagger: 150ms. More feels draggy.

## View Transitions (Astro)

**Problem:** View Transitions swap DOM, but scripts don't re-execute. Animations break on navigation.

**Solution:** Use `astro:page-load` event:

```javascript
document.addEventListener('astro:page-load', () => {
  // Initialize animations HERE
  // This fires on initial load AND after each navigation
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Your GSAP animations...
  gsap.from('.hero', { y: 50, opacity: 0 });
});
```

**Cleanup on navigation:**

```javascript
document.addEventListener('astro:before-swap', () => {
  // Kill ScrollTriggers before DOM swap
  ScrollTrigger.getAll().forEach(t => t.kill());
  
  // Destroy Lenis
  if (window.lenis) {
    window.lenis.destroy();
  }
});
```

**Common mistake:**
```javascript
// ❌ Only runs once, breaks after navigation
gsap.from('.hero', { y: 50 });

// ✅ Re-initializes after each navigation
document.addEventListener('astro:page-load', () => {
  gsap.from('.hero', { y: 50 });
});
```
