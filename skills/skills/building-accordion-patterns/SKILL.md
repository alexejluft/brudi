---
name: building-accordion-patterns
description: Contains all four accordion patterns with complete code examples. Pattern 1 (CSS Grid) and 2 (GSAP) for Astro/Vanilla, Pattern 3 (Framer Motion) for React, Pattern 4 (Premium) for agency layouts.
---

# Accordion Patterns — All Implementations

See `building-components-core` for decision tree and ARIA requirements.

## Pattern 1: CSS Grid Row Trick (Astro/Vanilla)

**Best default.** Zero dependencies, pure CSS, single `.is-active` class drives everything.

Why: CSS animates `grid-template-rows: 0fr → 1fr`. Inner wrapper with `overflow: hidden` collapses content. Smooth, performant, no JS height calculations.

**HTML:**
```html
<section class="faq-section">
  <div class="faq-item" data-faq-item>
    <button class="faq-item__trigger" aria-expanded="false" aria-controls="faq-panel-1" id="faq-header-1">
      <span class="faq-item__title">Your question</span>
      <div class="faq-item__content">
        <div class="faq-item__content-inner">
          <p class="faq-item__desc">Your answer.</p>
        </div>
      </div>
    </button>
  </div>
</section>
```

**CSS:**
```css
:root {
  --faq-duration: 400ms;
  --faq-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.faq-item__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--faq-duration) var(--faq-easing);
}
.faq-item__content-inner { overflow: hidden; }
.faq-item.is-active .faq-item__content { grid-template-rows: 1fr; }
```

**JS:**
```js
const items = document.querySelectorAll('[data-faq-item]')
items.forEach(item => {
  item.querySelector('.faq-item__trigger').addEventListener('click', () => {
    const isActive = item.classList.contains('is-active')
    items.forEach(other => other.classList.remove('is-active'))
    if (!isActive) item.classList.add('is-active')
    item.querySelector('.faq-item__trigger').setAttribute('aria-expanded', !isActive)
  })
})
```

Wins: No GSAP, single class, `0fr → 1fr` is the only reliable CSS height animation.

---

## Pattern 2: GSAP height:auto (Astro/Vanilla)

Correct technique for animating `height: auto` with GSAP. Use `gsap.fromTo()` — GSAP resolves `auto` at animation time, not definition time.

**HTML:**
```astro
<div class="faq-item">
  <button class="faq-trigger" aria-expanded="false" aria-controls={`faq-panel-${i}`} id={`faq-header-${i}`}>
    {faq.question}
  </button>
  <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-header-${i}`} class="faq-panel overflow-hidden" style="height: 0">
    <div class="pb-6">{faq.answer}</div>
  </div>
</div>
```

**JS:**
```astro
<script>
  import gsap from 'gsap'
  const items = document.querySelectorAll('.faq-item')

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger')
    const panel = item.querySelector('.faq-panel')
    let isOpen = false

    const openTween = gsap.fromTo(
      panel,
      { height: 0 },
      { height: 'auto', duration: 0.4, ease: 'power2.out', paused: true }
    )

    trigger.addEventListener('click', () => {
      isOpen = !isOpen
      trigger.setAttribute('aria-expanded', String(isOpen))
      isOpen ? openTween.play() : openTween.reverse()
    })

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        item.nextElementSibling?.querySelector('.faq-trigger')?.focus()
      }
      if (e.key === 'ArrowUp') {
        item.previousElementSibling?.querySelector('.faq-trigger')?.focus()
      }
    })
  })
</script>
```

**Single-open variant:** Close all other items when opening one (see original skill for full code).

Reduced-motion: See `~/.brudi/assets/patterns/reduced-motion.md` or wrap GSAP in `gsap.matchMedia()` check.

---

## Pattern 3: Framer Motion (React/Next.js)

```tsx
'use client'
import { useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'

export function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <LayoutGroup>
      <div className="divide-y">
        {items.map((item, i) => (
          <FaqItem key={i} item={item} index={i} isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
        ))}
      </div>
    </LayoutGroup>
  )
}

function FaqItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div layout className="faq-item">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-header-${index}`}
      >
        {item.question}
        <motion.span animate={{ scaleY: isOpen ? 0 : 1 }} transition={{ duration: 0.25 }} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-header-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-6">{item.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

Key: `initial={false}` prevents exit animation on first render. `layout` prop animates opening/closing smoothly.

---

## Pattern 4: Premium Numbered Row Variant

Award-winning pattern: numbered list left, large sticky image right. Hover expands row description.

```astro
<!-- ServiceList.astro -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-16">
  <div class="service-list divide-y">
    {services.map((service, i) => (
      <div class="service-row group cursor-pointer" data-index={i}>
        <div class="flex items-start gap-6 py-8">
          <span class="w-8 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
          <div class="flex-1">
            <h3 class="group-hover:text-accent transition-colors">{service.title}</h3>
            <div class="service-desc overflow-hidden" style="height: 0">
              <p class="mt-3">{service.description}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  <div class="sticky top-32">
    <div class="aspect-[4/3] rounded-lg overflow-hidden">
      {services.map((service, i) => (
        <img src={service.image} alt={service.title}
             class="service-img absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
             style={i === 0 ? 'opacity: 1' : 'opacity: 0'} />
      ))}
    </div>
  </div>
</div>

<script>
  import gsap from 'gsap'
  const rows = document.querySelectorAll('.service-row')
  const imgs = document.querySelectorAll('.service-img')
  let activeIndex = 0

  rows.forEach((row, i) => {
    const desc = row.querySelector('.service-desc')
    gsap.set(desc, { height: 'auto' })
    const height = desc.offsetHeight
    gsap.set(desc, { height: 0 })

    row.addEventListener('mouseenter', () => {
      if (activeIndex === i) return
      const prevDesc = rows[activeIndex]?.querySelector('.service-desc')
      if (prevDesc) gsap.to(prevDesc, { height: 0, duration: 0.3, ease: 'power2.in' })
      gsap.to(imgs[activeIndex], { opacity: 0, duration: 0.3 })
      gsap.to(imgs[i], { opacity: 1, duration: 0.3 })
      gsap.to(desc, { height, duration: 0.4, ease: 'power2.out' })
      activeIndex = i
    })
  })
</script>
```

Notes: Image panel sticky. Cross-fade with opacity (not src swap). Pre-measure height before animating.
