---
description: Award-level preloaders with GSAP. Letter reveals, progress bars, fade-to-content transitions.
globs: ["**/layout.tsx", "**/preloader*", "**/loader*"]
---
# Building Preloaders

## Prerequisites
- GSAP must be installed (`npm install gsap`)
- Read `animating-interfaces` for timing/easing rules

---

## When to Use a Preloader

- Award-level websites: ALWAYS
- SaaS dashboards: Only if heavy initial data load
- Content sites: Only if above-fold has large images/video

---

## Pattern: Letter-by-Letter Reveal

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false)
          onComplete()
        },
      })

      // Phase 1: Letters reveal (stagger) — set() + to(), NIEMALS from()
      const letters = containerRef.current?.querySelectorAll('[data-letter]')
      if (letters) gsap.set(letters, { opacity: 0, y: 40 })
      tl.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.08,
      })

      // Phase 2: Hold for recognition
      tl.to({}, { duration: 0.6 })

      // Phase 3: Fade out entire preloader
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-bg)]"
    >
      <div className="flex overflow-hidden">
        {'FORMA'.split('').map((letter, i) => (
          <span
            key={i}
            data-letter
            className="text-5xl md:text-7xl font-display font-bold text-white inline-block"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
```

---

## Integration in Layout

```tsx
// app/layout.tsx
'use client' // Only the preloader wrapper needs client
import { useState } from 'react'
import { Preloader } from '@/components/preloader'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <html lang="de" className={fontVars}>
      <body>
        <Preloader onComplete={() => setLoaded(true)} />
        <div className={loaded ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.3s' }}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

**Important:** If using App Router with Server Components, wrap the preloader logic in a client component that wraps children. Don't make the entire layout a client component.

```tsx
// Better pattern: separate client wrapper
// components/page-wrapper.tsx
'use client'
import { useState } from 'react'
import { Preloader } from './preloader'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <div
        className="transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        {children}
      </div>
    </>
  )
}

// app/layout.tsx (stays as server component)
import { PageWrapper } from '@/components/page-wrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={fontVars}>
      <body>
        <PageWrapper>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </PageWrapper>
      </body>
    </html>
  )
}
```

---

## Pattern: Progress Bar Preloader

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function ProgressPreloader({ onComplete }: { onComplete: () => void }) {
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete })
      const counter = { value: 0 }

      // Animate progress bar + counter
      tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (barRef.current) barRef.current.style.width = `${counter.value}%`
          if (counterRef.current) counterRef.current.textContent = `${Math.round(counter.value)}`
        },
      })

      // Fade out
      tl.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power3.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-bg)]">
      <span ref={counterRef} className="text-8xl font-display font-bold text-white mb-8 tabular-nums">
        0
      </span>
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div ref={barRef} className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: '0%' }} />
      </div>
    </div>
  )
}
```

---

## Timing Guidelines

| Preloader Type | Total Duration | Why |
|---|---|---|
| Letter reveal | 1.5-2.5s | Fast, elegant, brand-forward |
| Progress bar | 2-3s | Implies loading, builds anticipation |
| Logo animation | 2-4s | Brand moment, only for strong logos |

**Rules:**
- Maximum 4 seconds total — users lose patience
- Minimum 1.5 seconds — shorter feels broken
- First meaningful paint after preloader completes
- No preloader on subsequent page loads (use sessionStorage flag)

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Making entire layout a client component | Use PageWrapper pattern (separate client wrapper) |
| Preloader replays on every navigation | Check `sessionStorage.getItem('preloaded')` |
| Content visible behind preloader | Preloader needs `fixed inset-0 z-[9999]` + bg-color |
| Flash of content before preloader | Set initial page opacity to 0, preloader reveals it |
| Preloader blocks interaction forever | Always set a timeout fallback (max 5s) |

---

## Checklist

```
□ Preloader plays on first visit
□ Content hidden during preloader (opacity 0)
□ Content fades in after preloader completes
□ Duration between 1.5-4 seconds
□ No replay on subsequent page loads
□ z-index high enough (9999)
□ Background matches site background (no white flash)
□ GSAP cleanup in useEffect return
□ Works on mobile (no overflow)
```
