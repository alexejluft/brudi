---
name: orchestrating-gsap-lenis
description: Use when combining GSAP with Lenis smooth scroll, or when ScrollTrigger animations break, stutter, or don't fire. The initialization order is non-negotiable.
---

# Orchestrating GSAP + Lenis

## Why This Breaks

GSAP and Lenis both want to control the animation loop (RAF = requestAnimationFrame).
If both run their own RAF loop, they fight each other — ScrollTrigger fires at wrong scroll positions, animations stutter, scrub effects jerk.

**The fix:** Lenis hands control to GSAP's ticker. One RAF loop. Always.

---

## Correct Setup (non-negotiable order)

```javascript
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 1. Register plugins FIRST — before any gsap calls
gsap.registerPlugin(ScrollTrigger)

// 2. Create Lenis with autoRaf: false — GSAP drives the loop
const lenis = new Lenis({
  lerp: 0.1,        // smoothness (0.05 = very smooth, 0.2 = snappy)
  autoRaf: false,   // ⚠️ CRITICAL: must be false
})

// 3. Connect Lenis to GSAP ticker — single RAF loop
gsap.ticker.add((time) => {
  lenis.raf(time * 1000) // GSAP time is seconds, Lenis needs ms
})

// 4. Prevent GSAP lag smoothing from conflicting
gsap.ticker.lagSmoothing(0)

// 5. Keep ScrollTrigger in sync with Lenis scroll position
lenis.on('scroll', ScrollTrigger.update)
```

**Wrong:** `autoRaf: true` → double RAF → broken scrub, wrong trigger positions.

---

## Cleanup (critical in React/Astro)

```javascript
// React: in useEffect cleanup
useEffect(() => {
  // ... setup above ...
  return () => {
    lenis.destroy()
    ScrollTrigger.getAll().forEach(t => t.kill())
    gsap.ticker.remove(lenisRafCallback) // remove the specific callback
  }
}, [])

// Astro: on page transition
document.addEventListener('astro:before-swap', () => {
  lenis.destroy()
  ScrollTrigger.getAll().forEach(t => t.kill())
})

document.addEventListener('astro:page-load', () => {
  // Re-initialize everything here
})
```

**Missing cleanup = memory leaks, duplicate animations on navigation.**

---

## ScrollTrigger with Lenis

```javascript
// ✅ Works correctly after setup above
gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 0.5,   // smooth catch-up (not true — that's jerky)
  }
})

// ✅ Pin a section while scrolling through it
ScrollTrigger.create({
  trigger: '.pinned',
  start: 'top top',
  end: '+=500',
  pin: true,
  scrub: 1,
})
```

---

## Lenis + ScrollTrigger Anchor Fix

Lenis intercepts scroll — native anchor links (`href="#section"`) break.

```javascript
// Fix: tell Lenis to handle anchor scrolling
lenis.on('scroll', ({ target }) => {
  ScrollTrigger.update()
})

// Programmatic scroll to element
lenis.scrollTo('#section', { offset: -80 })

// Programmatic scroll to top
lenis.scrollTo(0)
```

---

## Reduced Motion

```javascript
// Always check before initializing Lenis
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reducedMotion) {
  // Full Lenis + GSAP setup
  initSmoothScroll()
} else {
  // Native scroll only — no smooth scroll, instant animations
  gsap.globalTimeline.timeScale(0) // or skip animation setup
}
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `autoRaf: true` | Double RAF, broken scrub | `autoRaf: false` always |
| Forgot `lenis.on('scroll', ScrollTrigger.update)` | ScrollTrigger fires wrong | Add scroll sync |
| No cleanup in React | Memory leaks, duplicate runs | Destroy in useEffect return |
| `gsap.registerPlugin` after first gsap call | Plugin not found | Register before all gsap code |
| `time * 1000` missing | Lenis gets wrong time unit | GSAP = seconds, Lenis = ms |
