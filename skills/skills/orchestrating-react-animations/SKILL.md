---
name: orchestrating-react-animations
description: Use when adding GSAP or Framer Motion to React components. Animations break in predictable ways — wrong lifecycle, missing cleanup, SSR crashes, StrictMode double-runs.
---

# Orchestrating React Animations

**The rule:** Animations live inside `useEffect`. DOM is only safe to touch after mount.

## GSAP in React

```tsx
gsap.registerPlugin(ScrollTrigger) // Outside component — register once

function AnimatedCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, { y: 40, opacity: 0, duration: 0.6, ease: 'power2.out' })
    }, cardRef) // scope to this element

    return () => ctx.revert() // ✅ cleans up animations + ScrollTriggers
  }, [])

  return <div ref={cardRef}>...</div>
}
```

**`gsap.context()` is non-negotiable.** Scopes, cleans up, and fixes StrictMode double-runs.

## Framer Motion in React

```tsx
// ✅ Simple enter animation — no useEffect needed
<motion.div
  initial={{ y: 40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
/>

// ✅ Scroll-triggered
function ScrollCard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div ref={ref}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.5 }}
    />
  )
}
```

## GSAP vs Framer Motion

| Use case | Library |
|----------|---------|
| Scroll sequences, scrubbing, pinning | GSAP + ScrollTrigger |
| Component enter/exit, page transitions | Framer Motion |
| Already using Lenis | GSAP (shared ticker) |
| Timeline-based sequences | GSAP |

**Don't mix both in the same component.**

## Reduced Motion Hook

```tsx
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

// Usage: if (reducedMotion) return inside useEffect
```

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| GSAP outside `useEffect` | SSR crash | Always inside `useEffect` |
| No `ctx.revert()` | Memory leaks, StrictMode flicker | Always return `() => ctx.revert()` |
| `registerPlugin` inside component | Re-registers every render | Once at module level |
| Mixing GSAP + Framer Motion | Conflicts | One library per scope |
