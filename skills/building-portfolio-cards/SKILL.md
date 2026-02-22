---
description: Award-level portfolio/case study card sections. Visual depth, proper images, animation stagger, responsive.
globs: ["**/work/**", "**/portfolio/**", "**/case-stud*/**", "**/projects/**"]
---
# Building Portfolio Cards

## Prerequisites (READ FIRST)
- `designing-award-layouts-core` — spacing, dark layers, grid
- `creating-visual-depth` — shadows, elevation, gradients
- `animating-interfaces` — timing, easing, performance
- `orchestrating-gsap-lenis` — if using GSAP animations

---

## The #1 Rule

**NEVER leave a portfolio card as an empty black box.**

If no client images exist, you MUST use one of:
1. Unsplash specific photo IDs (preferred)
2. CSS gradient placeholders (acceptable)
3. SVG pattern backgrounds (acceptable)

Empty `bg-surface` boxes without visual content = instant fail.

---

## Card Pattern: Award-Level

```tsx
// components/case-study-card.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'

interface CaseStudyCardProps {
  title: string
  category: string
  location: string
  metric: string
  image: string
  href: string
  size?: 'large' | 'default'
}

export function CaseStudyCard({ title, category, location, metric, image, href, size = 'default' }: CaseStudyCardProps) {
  return (
    <Link href={href} className="group block">
      <article className={`relative overflow-hidden rounded-lg ${size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {/* Image with hover scale */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={size === 'large' ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            {category} — {location}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-accent)] font-medium">
            {metric}
          </p>
        </div>

        {/* Hover border accent */}
        <div className="absolute inset-0 rounded-lg border border-white/0 transition-colors duration-500 group-hover:border-white/10" />
      </article>
    </Link>
  )
}
```

---

## Grid Layout: Asymmetric (NOT uniform)

```tsx
// Award-level sites NEVER use identical card sizes
<section className="py-24 md:py-32">
  <div className="max-w-[1440px] mx-auto px-6">
    <h2 className="text-fluid-h1 font-display font-bold uppercase mb-16">
      Selected Work
    </h2>

    {/* Asymmetric grid — NOT all same size */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Large card: spans 7 columns */}
      <div className="md:col-span-7">
        <CaseStudyCard {...projects[0]} size="large" />
      </div>
      {/* Small card: spans 5 columns */}
      <div className="md:col-span-5">
        <CaseStudyCard {...projects[1]} />
      </div>
      {/* Small card: spans 5 columns */}
      <div className="md:col-span-5">
        <CaseStudyCard {...projects[2]} />
      </div>
      {/* Large card: spans 7 columns */}
      <div className="md:col-span-7">
        <CaseStudyCard {...projects[3]} size="large" />
      </div>
    </div>
  </div>
</section>
```

---

## Shadow System: 5-Layer (from creating-visual-depth)

```css
.card-shadow {
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.075),
    0 2px 2px rgba(0, 0, 0, 0.075),
    0 4px 4px rgba(0, 0, 0, 0.075),
    0 8px 8px rgba(0, 0, 0, 0.075),
    0 16px 16px rgba(0, 0, 0, 0.075);
}

/* NOT this generic shadow: */
/* box-shadow: 0 4px 6px rgba(0,0,0,0.1); ← AI-slop */
```

---

## Animation: GSAP Stagger Entrance

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const heading = section.querySelector('[data-animate="heading"]')
    const cards = section.querySelectorAll('[data-animate="card"]')

    // ✅ set() Startzustand BEVOR ScrollTrigger erstellt wird
    gsap.set(heading, { opacity: 0, y: 48 })
    gsap.set(cards, { opacity: 0, y: 64 })

    // Heading entrance
    const headingTween = gsap.to(heading, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    })

    // Cards stagger entrance
    const cardsTween = gsap.to(cards, {
      opacity: 1, y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      headingTween.kill()
      cardsTween.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef}>
      <h2 data-animate="heading">Selected Work</h2>
      <div className="grid ...">
        {projects.map(p => (
          <div key={p.title} data-animate="card">
            <CaseStudyCard {...p} />
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Placeholder Images: Unsplash Strategy

```typescript
// Use SPECIFIC Unsplash photo IDs — not random
const PLACEHOLDER_IMAGES = {
  fashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80',
  architecture: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
  music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80',
  nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80',
  abstract: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop&q=80',
} as const
```

If Unsplash is not suitable, use CSS gradient:
```css
.placeholder-gradient {
  background: linear-gradient(
    135deg,
    var(--color-surface) 0%,
    var(--color-surface-high) 50%,
    var(--color-accent, #C8FF00) 150%
  );
}
```

---

## Responsive Rules

```
Desktop (1440px): Asymmetric grid, 16:10 and 4:3 aspect ratios
Tablet (768px):   2-column grid, all cards same aspect ratio
Mobile (375px):   Single column stack, 16:9 aspect ratio
```

Image aspect ratios per breakpoint:
```css
.card-image {
  aspect-ratio: 4/3;
}
@media (min-width: 768px) {
  .card-image-large { aspect-ratio: 16/10; }
  .card-image-default { aspect-ratio: 4/3; }
}
```

---

## Checklist Before Shipping

```
□ Every card has visual content (image or gradient — NOT empty black)
□ 5-layer shadow system applied (or gradient border for dark themes)
□ Hover: Image scale 1.05 + border/overlay transition
□ Mobile: Cards stack cleanly with consistent spacing
□ Animation: Stagger 100ms, ease power3.out, duration 0.7s
□ Grid: Asymmetric (mix of large + default sizes)
□ Text: Readable over image (gradient overlay present)
□ Links: All cards link to detail page (or placeholder /work)
```
