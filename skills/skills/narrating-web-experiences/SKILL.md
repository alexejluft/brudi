---
name: narrating-web-experiences
description: Use when building scroll-driven storytelling interfaces. Combines Lenis smooth scroll, GSAP ScrollTrigger, and progressive reveals to guide users through a deliberate visual narrative.
---

# Narrating Web Experiences

## The Rule

**Sections are narrative beats. Lenis for smooth scroll. GSAP ScrollTrigger for pacing. Always respect `prefers-reduced-motion`.**

---

## Storytelling Architecture

```tsx
// ✅ Each section = one narrative beat (hook → rising action → climax)
<section className="h-screen flex items-center justify-center bg-slate-900 text-white">
  <h1 className="text-6xl">Act One: The Hook</h1>
</section>
<section className="h-[150vh] relative">{/* Rising action — pinned reveals */}</section>
<section className="h-screen bg-amber-950">{/* Climax */}</section>
// ❌ WRONG: Random divs with no pacing or visual hierarchy
```

---

## Lenis + GSAP ScrollTrigger Setup

```tsx
// ✅ Correct: Sync Lenis with GSAP ticker
'use client'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, smoothTouch: false })
    const raf = (time) => { lenis.raf(time * 1000); ScrollTrigger.update() } // GSAP=seconds, Lenis=ms
    gsap.ticker.add(raf)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
  return children
}

// ❌ WRONG: Lenis without ScrollTrigger sync → scroll position mismatch
```

---

## Progressive Reveal

```tsx
// ✅ Correct: set() + to() — NIEMALS from()
export function RevealOnScroll({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y: 30 })
    const tween = gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true }
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [])
  return <div ref={ref}>{children}</div>
}
```

---

## Pin + Scrub (Scroll-Driven Animation)

```tsx
// ✅ Correct: Pin + scrub with matchMedia (desktop only)
const ctx = gsap.context(() => {
  gsap.matchMedia().add('(min-width: 768px)', () => {
    gsap.to(contentRef.current, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=200%', scrub: 1, pin: true },
      opacity: 1, x: 0, scale: 1
    })
  })
}, sectionRef)
return () => ctx.revert()
// ❌ WRONG: Pin without matchMedia, or more than 2 pins per page
```

---

## Accessibility + Performance

```tsx
// ✅ MANDATORY: Respect reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
gsap.to(el, { opacity: 1, y: 0, duration: prefersReduced ? 0.01 : 0.8 })

// ✅ Only transform + opacity (GPU). Always clean up.
gsap.to(el, { x: 100, opacity: 0.8, willChange: 'transform, opacity' })
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, containerRef)
  return () => ctx.revert()
}, [])
// ❌ WRONG: No reduced-motion, animating width/height/top/left
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Scroll hijacking on mobile | `smoothTouch: false` in Lenis |
| No `prefers-reduced-motion` | Always check, set duration to ~0 |
| Jarring transitions | Use easing: `power2.out` for reveals |
| Too many pinned sections | Max 1-2 pins per scroll journey |
| No cleanup in useEffect | `gsap.context()` + `ctx.revert()` |
| Animating layout properties | Only `transform` + `opacity` (GPU) |
