# Token Bridge Examples — Before & After

Real-world patterns for migrating from hardcoded to token-driven animations.

---

## Example 1: Simple Scroll Reveal

### Before (❌ Hardcoded)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function FeatureCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // ❌ Magic numbers everywhere
    gsap.set(card, { opacity: 0, y: 40 })

    const tween = gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.65,              // ❌ Hardcoded 0.65
      ease: 'power2.out',          // ❌ Hardcoded easing string
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === card) st.kill()
      })
    }
  }, [])

  return (
    <div ref={cardRef} className="p-8 bg-white rounded-lg shadow-md">
      Feature content...
    </div>
  )
}
```

**Problems:**
- Hardcoded `0.65` has no semantic meaning
- Hardcoded `"power2.out"` — why this easing? Who knows
- Boilerplate ScrollTrigger setup duplicated across components
- If you want to change `0.65` globally → grep for `0.65` across 50 files

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useRef } from 'react'
import { useScrollReveal } from '@/primitives/use-scroll-reveal'

export function FeatureCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  // ✅ One line — all tokens, all cleanup automatic
  useScrollReveal(cardRef, {
    distance: 'md',        // 32px from tokens.distance
    duration: 'slow',      // 0.65s from tokens.duration
    ease: 'exit',          // power2.out from tokens.easing
  })

  return (
    <div ref={cardRef} className="p-8 bg-white rounded-lg shadow-md">
      Feature content...
    </div>
  )
}
```

**Benefits:**
- No boilerplate — hook handles everything
- Semantic token names (what do they mean?)
- Change `tokens.duration.slow = 0.8` → all animations update
- Type-safe: TypeScript catches typos in token names
- Cleanup automatic (no manual ScrollTrigger.kill)

---

## Example 2: Staggered List Reveal

### Before (❌ Hardcoded)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function FeatureList() {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const items = list.querySelectorAll('.feature-item')

    // ❌ Hardcoded values: 0 (opacity), 24 (y offset)
    gsap.set(items, { opacity: 0, y: 24 })

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.5,             // ❌ What does 0.5 mean?
      ease: 'power3.out',        // ❌ Which easing is this?
      stagger: 0.08,             // ❌ Hardcoded delay
      scrollTrigger: {
        trigger: list,
        start: 'top 80%',
        once: true,
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === list) st.kill()
      })
    }
  }, [])

  return (
    <div ref={listRef}>
      <div className="feature-item">Item 1</div>
      <div className="feature-item">Item 2</div>
      <div className="feature-item">Item 3</div>
    </div>
  )
}
```

**Problems:**
- `0.5` vs `0.65` — which is which?
- `24` vs `32` vs `40` — unclear which distance is used
- `0.08` hardcoded stagger
- Duplicates of durations across multiple files make refactoring impossible

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useRef } from 'react'
import { useStaggerEntrance } from '@/primitives/use-stagger-entrance'

export function FeatureList() {
  const listRef = useRef<HTMLDivElement>(null)

  // ✅ Semantic tokens, clear intent
  useStaggerEntrance(listRef, {
    itemSelector: '.feature-item',
    distance: 'base',        // 24px (from tokens)
    duration: 'normal',      // 0.35s (from tokens)
    ease: 'enter',           // power3.out (from tokens)
    stagger: 'normal',       // 0.08s (from tokens)
  })

  return (
    <div ref={listRef}>
      <div className="feature-item">Item 1</div>
      <div className="feature-item">Item 2</div>
      <div className="feature-item">Item 3</div>
    </div>
  )
}
```

**Benefits:**
- Clear semantic names (what does `normal` mean? Look at tokens)
- Change `stagger.normal` once → all lists update
- The hook handles cleanup, refs, everything
- Readable at a glance

---

## Example 3: Hero Headline Character Reveal

### Before (❌ Hardcoded)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function HeroHeadline() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    const text = title.textContent || ''

    // ❌ Manual character splitting, hardcoded animation
    const chars = text.split('').map(char => {
      const span = document.createElement('span')
      span.textContent = char
      title.appendChild(span)
      return span
    })

    // ❌ Hardcoded values: 1.0 (duration), 0.04 (stagger)
    gsap.set(chars, { opacity: 0, y: 8 })
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 1.0,           // ❌ What does 1.0 represent?
      ease: 'power3.out',      // ❌ Hardcoded easing string
      stagger: 0.04,           // ❌ Hardcoded character delay
    })

    // ❌ No cleanup
  }, [])

  return <h1 ref={titleRef}>Award-Winning Design</h1>
}
```

**Problems:**
- Manual DOM manipulation (fragile)
- `1.0` duration — hero timing or standard?
- `0.04` stagger — what does this mean in context?
- No error handling if ref is null
- Hardcoded `y: 8` (why 8 pixels?)

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useRef } from 'react'
import { useCharacterReveal } from '@/primitives/use-stagger-entrance'

export function HeroHeadline() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  // ✅ One hook call — DOM management automatic, tokens clear
  useCharacterReveal(titleRef, {
    duration: 'hero',        // 1.0s (maximum attention)
    ease: 'enter',           // power3.out (from tokens)
    stagger: 'tight',        // 0.04s (from tokens)
  })

  return <h1 ref={titleRef}>Award-Winning Design</h1>
}
```

**Benefits:**
- No manual DOM manipulation
- Hook handles text splitting safely
- Semantic token names clarify intent
- One source of truth for character timing

---

## Example 4: Button Hover Animation

### Before (❌ Hardcoded)

```tsx
'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function CTAButton() {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // ❌ Hardcoded enter/exit timings
    const onMouseEnter = () => {
      gsap.to(btn, {
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        duration: 0.15,         // ❌ Magic number for hover speed
        ease: 'power2.out',     // ❌ Hardcoded easing
      })
    }

    const onMouseLeave = () => {
      gsap.to(btn, {
        scale: 1,
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        duration: 0.25,         // ❌ Longer exit duration (asymmetric)
        ease: 'power2.out',     // ❌ Same easing everywhere
      })
    }

    btn.addEventListener('mouseenter', onMouseEnter)
    btn.addEventListener('mouseleave', onMouseLeave)

    // ❌ Cleanup incomplete
    return () => {
      btn.removeEventListener('mouseenter', onMouseEnter)
      btn.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <button
      ref={btnRef}
      className="px-8 py-3 bg-accent text-white rounded-lg shadow-md"
    >
      Get Started
    </button>
  )
}
```

**Problems:**
- `0.15` vs `0.25` — which is which? Why the difference?
- Hardcoded `scale: 1.05` (why 1.05? arbitrary)
- `boxShadow` values hardcoded (not tokens)
- Asymmetric timing (enter 0.15, exit 0.25) poorly documented
- No indication these values are consistent across project

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { duration, easing } from '@/primitives/tokens'

export function CTAButton() {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // ✅ Tokens document intent clearly
    const onMouseEnter = () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: duration.fast,    // 180ms (from tokens)
        ease: easing.enter,         // power3.out (from tokens)
      })
    }

    const onMouseLeave = () => {
      gsap.to(btn, {
        scale: 1,
        duration: duration.normal,  // 350ms (longer exit — from tokens)
        ease: easing.exit,          // power2.out (from tokens)
      })
    }

    btn.addEventListener('mouseenter', onMouseEnter)
    btn.addEventListener('mouseleave', onMouseLeave)

    return () => {
      btn.removeEventListener('mouseenter', onMouseEnter)
      btn.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <button
      ref={btnRef}
      className="px-8 py-3 bg-accent text-white rounded-lg shadow-md"
    >
      Get Started
    </button>
  )
}
```

**Benefits:**
- `duration.fast` → clear: quick feedback
- `duration.normal` → clear: standard interaction timing
- Asymmetric timing visible and documented
- Change project's hover speed in one place (`tokens.ts`)
- Readable at a glance

---

## Example 5: Parallax Background

### Before (❌ Hardcoded)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    // ❌ Raw ScrollTrigger boilerplate, hardcoded speed
    gsap.to(bg, {
      y: 30,                        // ❌ Magic number (30% of what?)
      ease: 'sine.inOut',           // ❌ Hardcoded easing
      scrollTrigger: {
        trigger: bg,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5,                 // ❌ Hardcoded scrub value
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === bg) st.kill()
      })
    }
  }, [])

  return (
    <div
      ref={bgRef}
      className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-900"
    />
  )
}
```

**Problems:**
- `y: 30` unclear — 30 pixels? 30% viewport height?
- `scrub: 0.5` hardcoded — what does 0.5 mean?
- Boilerplate ScrollTrigger setup
- No easy way to adjust parallax strength globally

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useRef } from 'react'
import { useParallax } from '@/primitives/use-scroll-reveal'

export function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)

  // ✅ Clear semantics: speed 0.3 = subtle parallax
  useParallax(bgRef, {
    speed: 0.3,        // Subtle parallax (recommended range: 0.1–0.5)
    direction: 'y',    // Vertical parallax
    maxDistance: 100,  // Maximum 100px movement
  })

  return (
    <div
      ref={bgRef}
      className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-900"
    />
  )
}
```

**Benefits:**
- Clear speed parameter (0.3 = subtle, 0.5 = moderate, 1.0 = aggressive)
- Hook handles all ScrollTrigger cleanup
- Easy to adjust globally (change one place, all parallax updates)
- Readable at a glance

---

## Example 6: Complex Timeline

### Before (❌ Hardcoded)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function HeroAnimation() {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // ❌ Hardcoded durations and delays scattered everywhere
    tl.from(headlineRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,      // ❌ Magic number
      ease: 'power2.out', // ❌ Hardcoded easing
    })
      .from(
        descRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,  // ❌ Different duration, unclear why
          ease: 'power2.out',
        },
        '-=0.4'           // ❌ Negative offset hardcoded
      )
      .from(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,  // ❌ Another duration value
          ease: 'power3.out',
        },
        '-=0.3'           // ❌ Another offset
      )

    return () => tl.kill()
  }, [])

  return (
    <div>
      <h1 ref={headlineRef}>Hero Title</h1>
      <p ref={descRef}>Description...</p>
      <button ref={buttonRef}>CTA</button>
    </div>
  )
}
```

**Problems:**
- `0.8` vs `0.6` vs `0.5` — what do these mean?
- `-=0.4` and `-=0.3` — why these specific overlaps?
- No semantic naming (are these fast, slow, hero durations?)
- Multiple easing strings hardcoded
- Hard to adjust timing globally

---

### After (✅ Token-Driven)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { duration, easing } from '@/primitives/tokens'

export function HeroAnimation() {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // ✅ Token-driven timeline — intent is clear
    tl.from(headlineRef.current, {
      opacity: 0,
      y: 40,
      duration: duration.hero,      // 1.0s (hero timing from tokens)
      ease: easing.enter,           // power3.out (from tokens)
    })
      .from(
        descRef.current,
        {
          opacity: 0,
          y: 30,
          duration: duration.slow,  // 0.65s (section timing from tokens)
          ease: easing.exit,        // power2.out (from tokens)
        },
        `-=${duration.fast}`         // 180ms overlap (from tokens)
      )
      .from(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: duration.normal,  // 0.35s (card timing from tokens)
          ease: easing.emphasis,      // power3.out (from tokens)
        },
        `-=${duration.micro}`         // 120ms overlap (from tokens)
      )

    return () => tl.kill()
  }, [])

  return (
    <div>
      <h1 ref={headlineRef}>Hero Title</h1>
      <p ref={descRef}>Description...</p>
      <button ref={buttonRef}>CTA</button>
    </div>
  )
}
```

**Benefits:**
- Token names clarify timing intent
- Overlaps calculated from tokens (maintainable, not magic offsets)
- Change `duration.hero` → all hero animations update
- Readable as a choreographed sequence

---

## Token Reference (Copy-Paste)

Quick values for reference:

```typescript
// Duration (seconds)
duration.micro   = 0.12   // 120ms
duration.fast    = 0.18   // 180ms
duration.normal  = 0.35   // 350ms
duration.slow    = 0.65   // 650ms
duration.hero    = 1.0    // 1000ms

// Easing
easing.enter     = "power3.out"         // Aggressive
easing.exit      = "power2.out"         // Responsive
easing.smooth    = "power2.out"         // Subtle
easing.emphasis  = "power3.out"         // Hero
easing.spring    = "back.out(1.5)"      // Bouncy
easing.inOut     = "power2.inOut"       // Symmetric
easing.linear    = "linear"             // FORBIDDEN

// Distance (pixels)
distance.micro   = 4
distance.xs      = 8
distance.sm      = 12
distance.base    = 24     // Standard entrance
distance.md      = 32
distance.lg      = 40
distance.xl      = 48
distance.xxl     = 64
distance.xxxl    = 80
distance.full    = 100    // Maximum parallax

// Stagger (seconds)
stagger.tight    = 0.04   // Dense lists
stagger.normal   = 0.08   // Standard 6-12 items
stagger.relaxed  = 0.12   // Loose spacing
stagger.dramatic = 0.2    // Hero emphasis
```

---

## Migration Checklist

Converting an existing component to token-driven:

- [ ] Import tokens: `import { duration, easing, distance } from '@/primitives/tokens'`
- [ ] Replace all numeric durations with `duration.*` constants
- [ ] Replace all easing strings with `easing.*` constants
- [ ] Replace all distances with `distance.*` constants
- [ ] For scroll reveals: Migrate to `useScrollReveal()` hook
- [ ] For stagger lists: Migrate to `useStaggerEntrance()` hook
- [ ] Remove raw ScrollTrigger setup (hook handles it)
- [ ] Test: Component works on mobile, animations smooth
- [ ] Verify: Gate passes (`npm run lint`, token bridge check)

---

## Summary

**The pattern:**
1. Find hardcoded animation value
2. Look up semantic token name
3. Replace with `tokens.fieldName`
4. Watch the code become readable and maintainable

**The benefit:**
- Change one token value → all animations update
- Clear semantic names → readable code
- Type safety → no typos
- Hooks → no boilerplate
