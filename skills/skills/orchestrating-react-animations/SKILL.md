---
name: orchestrating-react-animations
description: Use when adding GSAP or Framer Motion to React components. Animations break in predictable ways — wrong lifecycle, missing cleanup, SSR crashes, StrictMode double-runs.
---

# Orchestrating React Animations

**The rule:** Animations live inside `useEffect`. DOM is only safe to touch after mount.

## ⛔ VERBOTEN — gsap.from() in React

**NIEMALS `gsap.from()` verwenden.** Es setzt initial-Werte (z.B. opacity:0) sofort beim Erstellen — bevor React rendern kann. Das führt zu unsichtbaren Elementen, besonders mit StrictMode oder ScrollTrigger.

```tsx
// ❌ VERBOTEN — Element wird unsichtbar, bleibt oft stecken
gsap.from(ref.current, { y: 40, opacity: 0 })
gsap.from('.card', { y: 40, opacity: 0 })  // String-Selektoren noch schlimmer

// ✅ KORREKT — gsap.set() + gsap.to() mit Element-Refs
gsap.set(ref.current, { y: 40, opacity: 0 })
gsap.to(ref.current, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
```

## GSAP in React — Korrektes Pattern

```tsx
gsap.registerPlugin(ScrollTrigger) // Outside component — register once

function AnimatedCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    // ✅ set() setzt den Startzustand explizit
    gsap.set(el, { y: 40, opacity: 0 })

    // ✅ to() animiert zum Zielzustand
    const tween = gsap.to(el, {
      y: 0, opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [])

  return <div ref={cardRef}>...</div>
}
```

**Warum set() + to():** `gsap.set()` setzt den Startzustand synchron. `gsap.to()` animiert davon weg. Das ist idempotent — funktioniert mit StrictMode, funktioniert bei ScrollTrigger-Reruns, keine unsichtbaren Elemente.

**`gsap.context()` is non-negotiable.** Scopes, cleans up, and fixes StrictMode double-runs. Alternativ: manuelles Cleanup wie oben (tween.kill + ScrollTrigger.kill).

> 💡 Asset: `~/Brudi/assets/configs/framer-motion-snippets.ts`

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

## Multiple Elemente animieren (Stagger)

```tsx
// ✅ KORREKT — querySelectorAll statt String-Selektoren
useEffect(() => {
  const cards = sectionRef.current?.querySelectorAll('[data-card]')
  if (!cards?.length) return

  gsap.set(cards, { y: 60, opacity: 0 })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
  })
  tl.to(cards, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' })

  return () => { tl.kill(); ScrollTrigger.getAll().forEach(st => st.kill()) }
}, [])
```

**NIEMALS String-Selektoren in gsap.context():** `gsap.from('.card', { stagger })` innerhalb von `gsap.context(sectionRef)` findet oft nicht alle Elemente oder animiert sie falsch. Immer `querySelectorAll` + Element-Refs.

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `gsap.from()` in React | Elements invisible, StrictMode breaks | **IMMER** `gsap.set()` + `gsap.to()` |
| String-Selektoren (`.card`, `[data-x]`) in gsap.from/to | Elements not found in context scope | `querySelectorAll` auf Ref |
| GSAP outside `useEffect` | SSR crash | Always inside `useEffect` |
| No cleanup (kill/revert) | Memory leaks, StrictMode flicker | Always return cleanup function |
| `registerPlugin` inside component | Re-registers every render | Once at module level |
| Mixing GSAP + Framer Motion | Conflicts | One library per scope |
| `once: true` ohne gsap.set() Fallback | Element bleibt unsichtbar wenn Trigger nicht feuert | Immer gsap.set() VOR ScrollTrigger |
