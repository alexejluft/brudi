---
name: building-components
description: Use when building FAQ sections, accordions, tabs, or any interactive disclosure component. AI produces broken accordions: div instead of button, hardcoded heights, missing ARIA, no keyboard navigation, jerky animations.
---

# Building Components

## The Core Problem

AI generates accordions that look correct but fail on:
- `<div onClick>` instead of `<button>` — not keyboard accessible
- `max-height: 999px` — slow animation, layout jumps at start/end
- No `aria-expanded` — screen readers don't know the state
- No keyboard support — Enter, Space, Arrow keys missing
- `opacity` fade only — space doesn't collapse, layout broken

---

## 1. Accordion — GSAP Pattern (Astro / Vanilla)

The correct technique for animating `height: auto` with GSAP.

**Why not `max-height`:** Animation starts immediately but content appears
to "lag" — the visible change is not linear. Layout jumps when max-height
is much larger than actual height.

**Why not CSS `height: 0 → auto`:** CSS cannot animate to `auto`. It's not
a valid transition target.

**GSAP solution:** Animate `from: 0` after setting the element to its
natural height. GSAP captures the computed height internally.

```astro
<!-- FAQ.astro -->
<section class="py-24 md:py-40">
  <div class="max-w-3xl mx-auto px-6">
    <p class="label-caps mb-4">FAQ</p>
    <h2 class="mb-16">Häufige Fragen</h2>

    <div class="faq-list divide-y divide-border">
      {faqs.map((faq, i) => (
        <div class="faq-item">
          <button
            class="faq-trigger w-full flex items-center justify-between
                   py-6 text-left group"
            aria-expanded="false"
            aria-controls={`faq-panel-${i}`}
            id={`faq-header-${i}`}
          >
            <span class="font-display text-lg font-semibold
                         group-hover:text-accent transition-colors duration-200">
              {faq.question}
            </span>

            <!-- Plus/minus icon — more premium than chevron -->
            <span class="faq-icon relative w-5 h-5 flex-shrink-0 ml-8"
                  aria-hidden="true">
              <span class="absolute inset-y-1/2 left-0 right-0 h-px bg-text
                           transition-transform duration-300 ease-out"></span>
              <span class="absolute inset-x-1/2 top-0 bottom-0 w-px bg-text
                           transition-transform duration-300 ease-out"></span>
            </span>
          </button>

          <div
            id={`faq-panel-${i}`}
            role="region"
            aria-labelledby={`faq-header-${i}`}
            class="faq-panel overflow-hidden"
            style="height: 0"
          >
            <div class="pb-6 text-text-muted leading-relaxed">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap'

  const items = document.querySelectorAll<HTMLElement>('.faq-item')

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('.faq-trigger')!
    const panel   = item.querySelector<HTMLElement>('.faq-panel')!
    const iconH   = item.querySelector<HTMLElement>('.faq-icon span:last-child')!

    let isOpen = false

    // Pre-build the open animation (height: 0 → auto)
    const openTween = gsap.fromTo(
      panel,
      { height: 0 },
      {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.out',
        paused: true,
      }
    )

    trigger.addEventListener('click', () => {
      isOpen = !isOpen
      trigger.setAttribute('aria-expanded', String(isOpen))

      // Icon: vertical bar disappears when open (plus → minus)
      gsap.to(iconH, {
        scaleY: isOpen ? 0 : 1,
        duration: 0.25,
        ease: 'power2.out',
      })

      if (isOpen) {
        openTween.play()
      } else {
        openTween.reverse()
      }
    })

    // Keyboard support: Enter and Space are native on <button>
    // Arrow navigation between items
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = item.nextElementSibling?.querySelector<HTMLElement>('.faq-trigger')
        next?.focus()
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = item.previousElementSibling?.querySelector<HTMLElement>('.faq-trigger')
        prev?.focus()
      }
    })
  })
</script>
```

**Rules:**
- One item open at a time (close others when one opens) — see extended pattern below
- `<button>` not `<div>` — keyboard focus is built-in
- `aria-expanded` updates on every toggle
- `height: 0` set inline to prevent flash of open content on load

### Single-Open (Close Others on Open)

```ts
// Replace the toggle handler with:
trigger.addEventListener('click', () => {
  const willOpen = !isOpen

  // Close all other items first
  items.forEach((otherItem) => {
    if (otherItem === item) return
    const otherTrigger = otherItem.querySelector<HTMLButtonElement>('.faq-trigger')!
    const otherPanel   = otherItem.querySelector<HTMLElement>('.faq-panel')!
    const otherIconH   = otherItem.querySelector<HTMLElement>('.faq-icon span:last-child')!
    otherTrigger.setAttribute('aria-expanded', 'false')
    gsap.to(otherIconH, { scaleY: 1, duration: 0.25, ease: 'power2.out' })
    gsap.to(otherPanel, { height: 0, duration: 0.3, ease: 'power2.in' })
  })

  isOpen = willOpen
  trigger.setAttribute('aria-expanded', String(isOpen))
  gsap.to(iconH, { scaleY: isOpen ? 0 : 1, duration: 0.25, ease: 'power2.out' })
  gsap.to(panel, {
    height: isOpen ? 'auto' : 0,
    duration: 0.4,
    ease: isOpen ? 'power2.out' : 'power2.in',
  })
})
```

---

## 2. Accordion — Framer Motion Pattern (React)

```tsx
'use client'
import { useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'

interface FaqItem {
  question: string
  answer: string
}

interface FaqProps {
  items: FaqItem[]
}

export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 md:py-40">
      <div className="max-w-3xl mx-auto px-6">
        <p className="label-caps mb-4">FAQ</p>
        <h2 className="mb-16">Häufige Fragen</h2>

        {/* LayoutGroup syncs layout animations across all items */}
        <LayoutGroup>
          <div className="divide-y divide-border">
            {items.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div layout className="faq-item">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-header-${index}`}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-display text-lg font-semibold
                         group-hover:text-accent transition-colors duration-200">
          {item.question}
        </span>

        {/* Animated plus/minus */}
        <motion.span
          className="relative w-5 h-5 flex-shrink-0 ml-8"
          aria-hidden="true"
        >
          <span className="absolute inset-y-1/2 left-0 right-0 h-px bg-text" />
          <motion.span
            className="absolute inset-x-1/2 top-0 bottom-0 w-px bg-text"
            animate={{ scaleY: isOpen ? 0 : 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </motion.span>
      </button>

      {/* AnimatePresence handles mount/unmount animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-header-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-6 text-text-muted leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

**Why `initial={false}` on AnimatePresence:** Prevents the exit animation
from running on initial render. Without it, content flashes on page load.

**Why `layout` on the item div:** When one item opens, others shift down.
`layout` makes that shift animate smoothly instead of jumping.

---

## 3. Numbered Row Variant (Premium / Agency)

The pattern from award-winning agency sites: numbered list on the left,
large image reveal on the right. Hover expands the row with context.

Used by: Linear, AntiGravity, GSAB.

```astro
<!-- ServiceList.astro -->
<section class="py-24 md:py-40 bg-bg-elevated">
  <div class="max-w-7xl mx-auto px-6 md:px-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

      <!-- Left: Numbered rows -->
      <div class="service-list divide-y divide-border">
        {services.map((service, i) => (
          <div
            class="service-row group cursor-pointer"
            data-index={i}
          >
            <div class="flex items-start gap-6 py-8">
              <!-- Number -->
              <span class="label-caps text-text-subtle w-8 flex-shrink-0 pt-1">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div class="flex-1">
                <!-- Title -->
                <div class="flex items-center justify-between">
                  <h3 class="font-display text-xl font-semibold
                             group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </h3>
                  <!-- Arrow: rotates on hover -->
                  <svg
                    class="w-5 h-5 text-text-subtle flex-shrink-0 ml-4
                           transition-transform duration-300
                           group-hover:translate-x-1 group-hover:-translate-y-1"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>

                <!-- Description: reveals on hover -->
                <div class="service-desc overflow-hidden" style="height: 0">
                  <p class="text-text-muted mt-3 pr-8 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <!-- Right: Image panel (sticky) -->
      <div class="hidden md:block relative">
        <div class="sticky top-32">
          <div class="aspect-[4/3] rounded-lg overflow-hidden bg-surface">
            {services.map((service, i) => (
              <img
                src={service.image}
                alt={service.title}
                class="service-img absolute inset-0 w-full h-full object-cover
                       transition-opacity duration-500"
                style={i === 0 ? 'opacity: 1' : 'opacity: 0'}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap'

  const rows  = document.querySelectorAll<HTMLElement>('.service-row')
  const imgs  = document.querySelectorAll<HTMLElement>('.service-img')
  let activeIndex = 0

  rows.forEach((row, i) => {
    const desc = row.querySelector<HTMLElement>('.service-desc')!

    // Pre-measure height
    gsap.set(desc, { height: 'auto' })
    const height = desc.offsetHeight
    gsap.set(desc, { height: 0 })

    row.addEventListener('mouseenter', () => {
      if (activeIndex === i) return

      // Close previous
      const prevDesc = rows[activeIndex]?.querySelector<HTMLElement>('.service-desc')
      if (prevDesc) gsap.to(prevDesc, { height: 0, duration: 0.3, ease: 'power2.in' })

      // Cross-fade image
      gsap.to(imgs[activeIndex], { opacity: 0, duration: 0.3 })
      gsap.to(imgs[i], { opacity: 1, duration: 0.3 })

      // Open new
      gsap.to(desc, { height, duration: 0.4, ease: 'power2.out' })

      activeIndex = i
    })
  })
</script>
```

**Notes:**
- Image panel is `sticky top-32` — stays in view as user scrolls through rows
- Cross-fade uses opacity toggle, not src swap — smoother and avoids re-fetching
- Pre-measure height before animating — avoids the `height: auto` animation problem

---

## 4. ARIA Requirements (Complete)

Every accordion must have these — no exceptions.

```html
<!-- Header button -->
<button
  aria-expanded="false"          <!-- required: true/false on toggle -->
  aria-controls="panel-id"       <!-- required: ID of the content panel -->
  id="header-id"                 <!-- required: referenced by panel -->
>
  Question text
</button>

<!-- Content panel -->
<div
  id="panel-id"                  <!-- required: matches aria-controls -->
  role="region"                  <!-- use if ≤ 6 items total on page -->
  aria-labelledby="header-id"    <!-- required: links back to header -->
>
  Answer text
</div>
```

**Keyboard behavior (W3C spec):**

| Key | Behavior |
|-----|----------|
| Enter / Space | Toggle open/close (native on `<button>`) |
| Tab | Move to next focusable element |
| Arrow Down | Move focus to next accordion header |
| Arrow Up | Move focus to previous accordion header |

**Only add Arrow Up/Down if you have a true accordion list.**
Single FAQ items don't need them.

---

## 5. AI Failure Modes (What to Never Do)

```
❌ <div onClick={toggle}> instead of <button>
   → No keyboard access, no semantic role
   Fix: Always <button>

❌ max-height: 999px transition
   → Slow start, instant end — feels broken
   Fix: GSAP height:auto or Framer Motion AnimatePresence

❌ opacity fade only, no height change
   → Panel disappears but space stays — layout broken
   Fix: Animate height + opacity together

❌ Missing aria-expanded
   → Screen readers announce nothing on toggle
   Fix: Update aria-expanded on every state change

❌ <div> not hidden, just opacity: 0
   → Hidden content is still tab-navigable
   Fix: Use height: 0 + overflow: hidden, or conditional render

❌ transition: all on the panel
   → Animates every property including width, color, etc.
   Fix: Explicit properties: height, opacity

❌ All items open by default
   → Defeats the purpose of an accordion
   Fix: Start closed (height: 0, aria-expanded="false")

❌ role="tab" and role="tabpanel" on accordion
   → Wrong ARIA pattern — tabs ≠ accordions
   Fix: aria-expanded + aria-controls on button

❌ No prefers-reduced-motion
   → Forces animation on users with vestibular disorders
   Fix: Wrap GSAP animations in matchMedia check

❌ Hardcoded pixel height
   → Breaks when content changes length
   Fix: Pre-measure with offsetHeight, or use GSAP height:auto
```

---

## 6. prefers-reduced-motion — GSAP

```ts
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Full animation
  gsap.fromTo(panel, { height: 0, opacity: 0 }, {
    height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out'
  })
})

mm.add('(prefers-reduced-motion: reduce)', () => {
  // No height animation — just show/hide instantly
  gsap.set(panel, { height: 'auto', opacity: 1 })
})
```

---

## 7. Design Rules

```
□ Icon: plus/minus preferred over chevron (more premium)
□ One item open at a time (unless justified)
□ Content inside panel: pb-6 minimum, text-text-muted
□ Divider: border-color rgba token, not solid hex
□ Hover state on question: text-accent transition
□ Arrow keys navigate between items
□ Numbered variant: image panel sticky, cross-fade on hover
□ No transition:all — explicit properties only
□ prefers-reduced-motion: disable height animation, keep opacity
```

---

## 8. Pressure Test Scenarios

**Scenario 1 — GSAP height:auto bug**
Problem: `gsap.to(el, { height: 'auto' })` animates to wrong value
if the element was never rendered at full height.
Fix: Use `gsap.fromTo(el, { height: 0 }, { height: 'auto' })` —
GSAP resolves `auto` at animation time, not at definition time.

**Scenario 2 — AnimatePresence flashes on load**
Problem: Content animates out on initial render.
Fix: `<AnimatePresence initial={false}>` — disables the exit animation
on mount. Standard initial={true} would animate all items out on first render.

**Scenario 3 — Layout jump when other items close**
Problem: Opening one item shifts others down without animation.
Fix: Add `layout` prop to item container + wrap in `<LayoutGroup>`.
Framer Motion then animates the position change.

**Scenario 4 — Keyboard focus lost after closing**
Problem: User closes an item, focus disappears.
Fix: Keep focus on the trigger button — it opened, it stays focused.
Only move focus INTO the panel if the user pressed Tab (not Enter/Space).
