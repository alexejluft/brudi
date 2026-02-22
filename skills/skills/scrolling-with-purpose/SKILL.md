---
name: scrolling-with-purpose
description: Use when building scroll animations with GSAP ScrollTrigger — React cleanup, Lenis integration, horizontal scroll, sequential animations. AI consistently skips cleanup (memory leaks) and misintegrates Lenis (wrong scroll positions).
---

# Scrolling with Purpose

## The Rule

AI skips cleanup in React → double triggers in Strict Mode. AI uses
`window.addEventListener` with Lenis → wrong scroll positions. Both are
silent bugs that only appear at runtime.

---

## React: Always useGSAP()

```jsx
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

export function AnimatedSection() {
  const container = useRef(null)

  useGSAP(() => {
    // ✅ Element-Refs statt String-Selektoren
    const box = container.current?.querySelector(".box")
    if (!box) return

    gsap.to(box, {
      scrollTrigger: {
        trigger: box,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      x: 200,
    })
  }, { scope: container })

  return <div ref={container}><div className="box" /></div>
}
```

**Never use `useEffect` for GSAP.** `useGSAP()` handles cleanup automatically.
No manual `ctx.revert()` needed. Works correctly in React 18 Strict Mode.

---

## Lenis + ScrollTrigger: Correct Integration

```js
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ autoRaf: false })

// ✅ Use lenis.on — not window.addEventListener
lenis.on("scroll", ScrollTrigger.update)

// ✅ Single loop for both libraries
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// ✅ Prevent double smoothing
gsap.ticker.lagSmoothing(0)
```

**Never** `window.addEventListener("scroll", ScrollTrigger.update)` — Lenis
overrides native scroll events, ScrollTrigger gets wrong positions.

---

## Horizontal Scroll

```js
gsap.to(".panels", {
  xPercent: -100 * (panelCount - 1),
  ease: "none",                        // linear — required for scrub
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,                          // lag in seconds — prevents jitter
    start: "top top",
    end: () => "+=" + (document.querySelector(".panels")?.offsetWidth ?? 0),
  },
})
```

```css
.container { overflow: hidden; }
body { overflow-x: clip; }   /* clip not hidden — doesn't break scrollbar */
```

**`scrub: true` = no lag = jitter on fast scroll. Always use a number.**
**`overflow-x: hidden` on body hides the vertical scrollbar. Use `clip`.**

---

## Sequential Animations on Same Property

```js
// ❌ Bug: second tween caches starting value from first render
gsap.to(".box", { x: 100, scrollTrigger: { trigger: ".s1" } })
gsap.to(".box", { x: 200, scrollTrigger: { trigger: ".s2" } })
// Result: animates to 100, jumps back to 0, then to 200

// ✅ Option A: fromTo() with explicit start
gsap.fromTo(".box",
  { x: 100 },
  { x: 200, scrollTrigger: { trigger: ".s2" } }
)

// ✅ Option B: Timeline — one ScrollTrigger, no cache issue
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  },
})
tl.to(".box", { x: 100 })
  .to(".box", { x: 200 })
```

---

## When Not to Use GSAP

Use **CSS Scroll-Driven Animations** instead when:
- Simple fade-in / slide-in (no pinning, no scrubbing)
- No complex sequencing
- Chrome/Edge 115+ is acceptable (not Firefox)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```

Zero JS, zero dependencies, GPU-accelerated. Use GSAP only when you need
pinning, scrubbing, timelines, or cross-browser support.
