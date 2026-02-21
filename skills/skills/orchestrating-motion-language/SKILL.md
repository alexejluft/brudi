---
name: orchestrating-motion-language
description: Use when creating a unified motion/animation system across a project with GSAP. Prevents inconsistent timing, janky animations, and accessibility failures.
---

# Orchestrating Motion Language

## The Rule

**Centralized motion tokens. GSAP timelines for orchestration. Only animate `transform` + `opacity`. Always check `prefers-reduced-motion`. Clean up with `gsap.context()`.**

---

## Motion Tokens

```tsx
// ✅ Correct: Centralized timing + easing — single source of truth
export const motion = {
  duration: { fast: 0.15, base: 0.3, slow: 0.6, epic: 1.0 },
  ease: {
    smooth: 'power2.out',
    sharp: 'power3.out',
    bounce: 'back.out(1.7)',
    brand: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  stagger: { tight: 0.05, base: 0.1, loose: 0.2 },
}

// ❌ WRONG: Magic numbers everywhere
// gsap.to(a, { duration: 0.3 }); gsap.to(b, { duration: 0.5 }); gsap.to(c, { duration: 0.35 })
```

---

## Timeline Orchestration

```tsx
// ✅ Correct: Sequential + overlapping with stagger
const tl = gsap.timeline({ defaults: { duration: motion.duration.base, ease: motion.ease.smooth } })
tl.from('.hero-title', { opacity: 0, y: 30 })
  .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.15')        // Overlap
  .from('.hero-cards', { opacity: 0, y: 20, stagger: motion.stagger.base }, '-=0.1')
  .from('.hero-cta', { opacity: 0, scale: 0.9 })

// ❌ WRONG: Independent gsap.to() calls — no coordination, can't pause/reverse
// gsap.to('.title', { opacity: 1 }); gsap.to('.subtitle', { opacity: 1, delay: 0.3 })
```

---

## Entrance/Exit Patterns

```tsx
// ✅ Correct: Reusable entrance hook
export function useEntrance(ref, { y = 20, delay = 0 } = {}) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0, y, duration: motion.duration.slow,
        ease: motion.ease.smooth, delay,
      })
    }, ref)
    return () => ctx.revert()
  }, [])
}

// Usage: const ref = useRef(null); useEntrance(ref); <div ref={ref}>Content</div>

// ❌ WRONG: Different entrance styles per component — no visual consistency
```

---

## Page Transitions

```tsx
// ✅ Correct: Coordinated exit → navigate → enter
export function usePageTransition() {
  const router = useRouter()
  return async (href) => {
    await gsap.to('main', { opacity: 0, y: -10, duration: motion.duration.base })
    router.push(href)
    gsap.from('main', { opacity: 0, y: 10, duration: motion.duration.base })
  }
}

```

---

## Accessibility + Performance

```tsx
// ✅ MANDATORY: Respect reduced motion
export function getMotionDuration(d: number) {
  if (typeof window === 'undefined') return d
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : d
}

// ✅ GPU only: transform + opacity. Always clean up.
gsap.to(el, { x: 100, opacity: 0.8, duration: getMotionDuration(motion.duration.base), willChange: 'transform, opacity' }) // willChange: use on max 3 elements, remove after animation
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, containerRef)
  return () => ctx.revert()
}, [])
// ❌ WRONG: Animating width/height/top, no cleanup, no reduced-motion
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Magic duration/easing numbers | Centralized `motion` tokens |
| Independent `gsap.to()` calls | Use `gsap.timeline()` for orchestration |
| No `prefers-reduced-motion` | `getMotionDuration()` wrapper — mandatory |
| Animating layout properties | Only `transform` + `opacity` (GPU) |
| 10+ simultaneous animations | Stagger + timeline sequencing |
| No cleanup in useEffect | `gsap.context()` + `ctx.revert()` |
