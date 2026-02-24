# BRUDI Motion Protocol — Implementation Guide

**Praktische Anwendung des BRUDI Motion Protocol in neuen Projekten**

---

## Phase 0: Setup (vor ersten Slice)

### 1. Dateien kopieren

```bash
# Motion Config
cp assets/configs/motion.protocol.ts <your-project>/src/config/motion.protocol.ts

# Updated globals.css mit Tokens
cp assets/configs/globals.css <your-project>/src/styles/globals.css
```

### 2. Package Dependencies

```bash
npm install gsap framer-motion @gsap/react
```

### 3. Environment Variable setzen

```env
# .env.local
NEXT_PUBLIC_MOTION_INTENSITY=balanced
```

### 4. Root Context erstellen (optional, für dynamische Intensity)

```tsx
// src/context/MotionContext.tsx
'use client'
import { createContext, useContext } from 'react'
import { createMotionConfig, type MotionConfig } from '@/config/motion.protocol'

const MotionContext = createContext<MotionConfig | null>(null)

export function MotionProvider({ children, intensity = 'balanced' }: any) {
  const config = createMotionConfig(intensity, false)
  return (
    <MotionContext.Provider value={config}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion(): MotionConfig {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotion must be inside MotionProvider')
  return ctx
}
```

```tsx
// app.tsx or layout.tsx
import { MotionProvider } from '@/context/MotionContext'

export default function RootLayout({ children }: any) {
  const intensity = (process.env.NEXT_PUBLIC_MOTION_INTENSITY || 'balanced') as any
  return (
    <html>
      <body>
        <MotionProvider intensity={intensity}>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}
```

---

## Phase 1: Erste Animation (GSAP Vanilla)

### Hero Section mit GSAP

```tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { motion } from '@/config/motion.protocol'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const heroRule = motion.getComponentRule('HERO')
    if (!heroRule) return

    // 1. Select elements
    const title = containerRef.current.querySelector('.hero-title') as HTMLElement
    const subtitle = containerRef.current.querySelector('.hero-subtitle') as HTMLElement
    const ctaButton = containerRef.current.querySelector('.hero-cta') as HTMLElement

    // 2. Set initial state (NIEMALS from()!)
    gsap.set([title, subtitle], { opacity: 0 })
    gsap.set(title, { y: heroRule.entrance.distance })
    gsap.set(subtitle, { y: heroRule.entrance.distance / 2 })
    gsap.set(ctaButton, { opacity: 0, scale: 0.9 })

    // 3. Create timeline
    const tl = gsap.timeline({
      defaults: {
        duration: heroRule.entrance.duration,
        ease: heroRule.entrance.ease,
      },
    })

    // 4. Animate in sequence
    tl.to(title, { opacity: 1, y: 0 })
      .to(subtitle, { opacity: 1, y: 0 }, '-=0.3')  // Overlap
      .to(ctaButton, { opacity: 1, scale: 1 }, '-=0.2')

    // 5. Cleanup
    return () => tl.kill()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center">
      <h1 className="hero-title text-6xl font-bold">
        Award-Level Motion System
      </h1>
      <p className="hero-subtitle text-2xl text-muted mt-6">
        Deterministic. Enforced. Beautiful.
      </p>
      <button className="hero-cta mt-12 px-8 py-4 bg-accent text-black rounded-lg font-semibold">
        Get Started
      </button>
    </section>
  )
}
```

**Warum dieses Muster?**
- ✅ `gsap.set()` + `gsap.to()` (NIE `from()`)
- ✅ Element-Refs statt String-Selektoren
- ✅ Timeline für Orchestration
- ✅ Cleanup mit `tl.kill()`
- ✅ Komponenten-Rule aus motion.protocol.ts

---

## Phase 1: Scroll Reveal (ScrollTrigger)

```tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from '@/config/motion.protocol'

gsap.registerPlugin(ScrollTrigger)

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.feature-card') as NodeListOf<HTMLElement>
    if (cards.length === 0) return

    const cardRule = motion.getComponentRule('CARD')
    if (!cardRule) return

    // 1. Initial state
    gsap.set(cards, { opacity: 0, y: cardRule.entrance.distance })

    // 2. ScrollTrigger animation
    gsap.to(cards, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,  // WICHTIG: Nur 1x triggern
      },
      opacity: 1,
      y: 0,
      duration: cardRule.entrance.duration,
      ease: cardRule.entrance.ease,
      stagger: motion.duration.stagger,  // 80ms between items
    })

    // 3. Cleanup
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={containerRef} className="py-24">
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="feature-card p-8 bg-surface rounded-lg shadow-lg">
            <h3>Feature {i}</h3>
            <p>Description here</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

**Wichtige Details**:
- `start: 'top 85%'` — triggert wenn Sektion 85% im Viewport oben ist
- `once: true` — Animation spielt nur 1x ab (nicht auf Scroll-up)
- `stagger: motion.duration.stagger` — 80ms zwischen Items

---

## Phase 1: Framer Motion (React Components)

```tsx
'use client'
import { motion } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

export function CardWithFramer({ title, description }: any) {
  const motionConfig = useMotion()
  const rule = motionConfig.getComponentRule('CARD')

  const containerVariants = {
    hidden: { opacity: 0, y: rule.entrance.distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: rule.entrance.duration,
        ease: rule.entrance.ease,
      },
    },
  }

  const hoverVariants = rule.hover
    ? {
        scale: rule.hover.scale,
        transition: { duration: rule.hover.duration, ease: rule.hover.ease },
      }
    : {}

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={hoverVariants}
      viewport={{ once: true, margin: '-100px' }}
      className="p-8 bg-surface rounded-lg"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-muted">{description}</p>
    </motion.div>
  )
}
```

**Framer Motion Vorteile**:
- `whileInView` — automatische ScrollTrigger-Integration
- `layout` — smooth repositioning
- `AnimatePresence` — exit animations vor unmount

---

## Phase 1: Button Interaction

```tsx
'use client'
import { motion } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function MotionButton({ children, onClick, variant = 'primary' }: ButtonProps) {
  const motionConfig = useMotion()
  const rule = motionConfig.getComponentRule('BUTTON')

  const buttonClasses = variant === 'primary'
    ? 'bg-accent text-black'
    : 'bg-surface text-foreground border border-border'

  return (
    <motion.button
      onClick={onClick}
      whileHover={
        rule.hover
          ? {
              scale: rule.hover.scale,
              transition: { duration: rule.hover.duration, ease: rule.hover.ease },
            }
          : {}
      }
      whileTap={
        rule.click
          ? {
              scale: 0.95,
              transition: { duration: rule.click.duration, ease: rule.click.ease },
            }
          : {}
      }
      className={`px-6 py-3 rounded-lg font-semibold ${buttonClasses}`}
    >
      {children}
    </motion.button>
  )
}
```

---

## Phase 1: Page Transition (Next.js)

```tsx
'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

export function PageTransition({ children }: any) {
  const motionConfig = useMotion()
  const rule = motionConfig.getComponentRule('PAGE_TRANSITION')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== 'undefined' ? window.location.pathname : ''}
        initial={{ opacity: 0, y: rule.entrance.distance }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -rule.entrance.distance }}
        transition={{
          duration: rule.entrance.duration,
          ease: rule.entrance.ease,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// In layout.tsx:
export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <MotionProvider intensity="balanced">
          <PageTransition>{children}</PageTransition>
        </MotionProvider>
      </body>
    </html>
  )
}
```

---

## Phase 1: Hover Animation (CSS-based)

```tsx
'use client'
import { motion } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

export function ImageWithHover({ src, alt }: any) {
  const motionConfig = useMotion()
  const rule = motionConfig.getComponentRule('IMAGE')

  return (
    <motion.figure
      initial={{ opacity: 0, y: rule.entrance.distance }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={rule.hover ? { scale: rule.hover.scale } : {}}
      transition={{
        initial: {
          duration: rule.entrance.duration,
          ease: rule.entrance.ease,
        },
        hover: {
          duration: rule.hover?.duration,
          ease: rule.hover?.ease,
        },
      }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-lg"
    >
      <img src={src} alt={alt} className="w-full h-auto" />
    </motion.figure>
  )
}
```

---

## Phase 1: Stagger List (Framer Motion)

```tsx
'use client'
import { motion } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

interface ListItem {
  id: string
  label: string
}

interface StaggerListProps {
  items: ListItem[]
}

export function StaggerList({ items }: StaggerListProps) {
  const motionConfig = useMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionConfig.duration.stagger,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: motionConfig.getDistance('base') },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionConfig.getDuration('normal'),
        ease: motionConfig.ease.exit,
      },
    },
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants} className="p-4 bg-surface rounded-lg">
          {item.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

---

## Phase 2: Complex Animations (GSAP Timeline)

```tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from '@/config/motion.protocol'

gsap.registerPlugin(ScrollTrigger)

export function ComplexHeroWithTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const heroRule = motion.getComponentRule('HERO')
    const sectionRule = motion.getComponentRule('SECTION')

    const title = containerRef.current.querySelector('.title') as HTMLElement
    const subtitle = containerRef.current.querySelector('.subtitle') as HTMLElement
    const image = containerRef.current.querySelector('.image') as HTMLElement
    const cta = containerRef.current.querySelector('.cta') as HTMLElement

    // Initial state
    gsap.set([title, subtitle, image], { opacity: 0 })
    gsap.set(title, { y: heroRule.entrance.distance })
    gsap.set(subtitle, { y: heroRule.entrance.distance / 2 })
    gsap.set(image, { scale: 0.8, y: sectionRule.entrance.distance })
    gsap.set(cta, { opacity: 0, scale: 0.9 })

    // Timeline
    const tl = gsap.timeline({
      defaults: { ease: heroRule.entrance.ease },
    })

    tl.to(title, { opacity: 1, y: 0, duration: heroRule.entrance.duration })
      .to(subtitle, { opacity: 1, y: 0, duration: heroRule.entrance.duration }, '-=0.3')
      .to(image, { opacity: 1, scale: 1, y: 0, duration: heroRule.entrance.duration }, '-=0.2')
      .to(cta, { opacity: 1, scale: 1, duration: motion.getDuration('normal') }, '-=0.1')

    return () => tl.kill()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen">
      <div className="grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="title text-6xl font-bold">Complex Animation</h1>
          <p className="subtitle text-xl text-muted mt-6">Using GSAP Timeline</p>
          <button className="cta mt-12 px-8 py-4 bg-accent rounded-lg font-semibold">
            Start Journey
          </button>
        </div>
        <div>
          <img className="image w-full rounded-lg" src="/hero.jpg" alt="Hero" />
        </div>
      </div>
    </section>
  )
}
```

---

## Phase 2: Validation vor Build

```bash
# Pre-build check
bash ~/Brudi/orchestration/motion-compliance-check.sh . all

# Output:
# ✓ motion.protocol.ts existiert
# ✓ DURATION_TOKENS definiert
# ✓ EASING_TOKENS definiert
# ✓ globals.css tokens complete
# ✓ prefers-reduced-motion support
# ✓ Keine gsap.from() calls
# ✓ Motion Protocol Compliance: PASSED
```

---

## Phase 3: Performance Optimization

### 1. Lazy Load GSAP (nur wenn ScrollTrigger needed)

```tsx
// src/lib/gsap-lazy.ts
let gsapInstance: any = null

export async function getGSAP() {
  if (!gsapInstance) {
    gsapInstance = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsapInstance.registerPlugin(ScrollTrigger)
  }
  return gsapInstance
}
```

### 2. Memoize Component Rules

```tsx
// src/hooks/useMotionRule.ts
import { useMemo } from 'react'
import { useMotion } from '@/context/MotionContext'

export function useMotionRule(componentType: string) {
  const motion = useMotion()
  return useMemo(() => {
    return motion.getComponentRule(componentType)
  }, [motion, componentType])
}
```

### 3. Respect Reduced Motion Globally

```tsx
// src/hooks/useShouldReduceMotion.ts
import { useEffect, useState } from 'react'

export function useShouldReduceMotion() {
  const [shouldReduce, setShouldReduce] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduce(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setShouldReduce(e.matches)
    mediaQuery.addEventListener('change', listener)

    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return shouldReduce
}
```

---

## Phase 3: Testing Animations

```tsx
// __tests__/hero.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { HeroSection } from '@/components/HeroSection'

describe('HeroSection Animations', () => {
  it('should animate title on mount', async () => {
    render(<HeroSection />)
    const title = screen.getByRole('heading')

    // Initially invisible
    expect(title).toHaveStyle({ opacity: '0' })

    // After animation
    await waitFor(() => {
      expect(title).toHaveStyle({ opacity: '1' })
    }, { timeout: 1500 }) // hero duration = 1.0s + buffer
  })

  it('should respect prefers-reduced-motion', async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    render(<HeroSection />)
    const title = screen.getByRole('heading')

    // Should be immediately visible (no animation)
    expect(title).toHaveStyle({ opacity: '1' })
  })
})
```

---

## Häufige Fehler & Lösungen

| Fehler | Symptom | Lösung |
|--------|---------|--------|
| `gsap.from()` | Invisible elements in StrictMode | Nutze `gsap.set()` + `gsap.to()` |
| Hardcoded `0.3s` | Unkonzistente Timings | Nutze `motion.getDuration('normal')` |
| Animiert `width` | Layout thrashing, jank | Nur `transform` + `opacity` |
| Keine Cleanup | Memory leaks | `useGSAP()` hook oder `tl.kill()` |
| Kein ScrollTrigger.kill() | Memory leak nach unmount | Cleanup in useEffect return |
| Falsche Distance | Bewegung sieht anders aus | Nutze `motion.getDistance('base')` |
| Keine Intensity-Anpassung | Falsche Dauer in Expressive Mode | Nutze `motionConfig.getDuration()` |
| Linear easing | Robotic feel | Nur für Spinner, sonst power-easing |

---

## Debugging

```tsx
// Debug-Komponente
export function MotionDebug() {
  const config = useMotion()

  return (
    <pre className="p-4 bg-surface rounded text-xs overflow-auto">
      {JSON.stringify({
        intensity: config.intensity,
        durations: {
          hero: config.getDuration('hero'),
          normal: config.getDuration('normal'),
          micro: config.getDuration('micro'),
        },
        distances: {
          base: config.getDistance('base'),
          xl: config.getDistance('xl'),
        },
        heroRule: config.getComponentRule('HERO'),
      }, null, 2)}
    </pre>
  )
}
```

Render in Development:
```tsx
{process.env.NODE_ENV === 'development' && <MotionDebug />}
```

---

## Checkliste pro Slice

- [ ] Komponenten-Typ identifiziert (HERO, CARD, BUTTON, etc.)
- [ ] `motion.getComponentRule(TYPE)` aufgerufen
- [ ] Durations + Easings aus Rule verwendet (nicht hardcoded)
- [ ] Distances aus `motion.getDistance()` genommen
- [ ] `gsap.set()` + `gsap.to()` (NIEMALS `from()`)
- [ ] ScrollTrigger mit `once: true` (wenn nötig)
- [ ] `prefers-reduced-motion` Check für GSAP
- [ ] Cleanup: `useGSAP()` hook oder `tl.kill()`
- [ ] Screenshot (Desktop + Mobile 375px)
- [ ] Console = 0 Errors
- [ ] `motion-compliance-check.sh . all` = PASSED

---

**BRUDI Motion Protocol — Implementation Complete**
