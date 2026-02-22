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
// ✅ Correct: set() Startzustand, dann to() in Timeline
const title = containerRef.current?.querySelector('.hero-title')
const subtitle = containerRef.current?.querySelector('.hero-subtitle')
const cards = containerRef.current?.querySelectorAll('.hero-cards')
const cta = containerRef.current?.querySelector('.hero-cta')

gsap.set([title, subtitle, cta], { opacity: 0 })
gsap.set(title, { y: 30 })
gsap.set(subtitle, { y: 20 })
gsap.set(cards, { opacity: 0, y: 20 })
gsap.set(cta, { scale: 0.9 })

const tl = gsap.timeline({ defaults: { duration: motion.duration.base, ease: motion.ease.smooth } })
tl.to(title, { opacity: 1, y: 0 })
  .to(subtitle, { opacity: 1, y: 0 }, '-=0.15')
  .to(cards, { opacity: 1, y: 0, stagger: motion.stagger.base }, '-=0.1')
  .to(cta, { opacity: 1, scale: 1 })

// ❌ WRONG: gsap.from() — causes invisible elements in React StrictMode
// ❌ WRONG: Independent gsap.to() calls — no coordination, can't pause/reverse
```

---

## Entrance/Exit Patterns

```tsx
// ✅ Correct: Reusable entrance hook mit set() + to()
export function useEntrance(ref, { y = 20, delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y })
    const tween = gsap.to(el, {
      opacity: 1, y: 0, duration: motion.duration.slow,
      ease: motion.ease.smooth, delay,
    })

    return () => tween.kill()
  }, [])
}

// Usage: const ref = useRef(null); useEntrance(ref); <div ref={ref}>Content</div>

// ❌ WRONG: gsap.from() — causes invisible elements in StrictMode
// ❌ WRONG: Different entrance styles per component — no visual consistency
```

---

## Page Transitions

```tsx
// ✅ Correct: Coordinated exit → navigate → enter
export function usePageTransition() {
  const router = useRouter()
  return async (href) => {
    const mainEl = document.querySelector('main')
    if (!mainEl) return

    await gsap.to(mainEl, { opacity: 0, y: -10, duration: motion.duration.base })
    router.push(href)
    // ✅ set() + to() mit Element-Ref
    gsap.set(mainEl, { opacity: 0, y: 10 })
    gsap.to(mainEl, { opacity: 1, y: 0, duration: motion.duration.base })
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
