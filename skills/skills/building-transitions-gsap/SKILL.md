---
name: building-transitions-gsap
description: Use when implementing GSAP curtain transitions for premium, cinematic page transitions. Covers full implementation, all 4 curtain variations, cleanup rules (critical), Barba.js comparison, and decision guide.
---

# Building Transitions — GSAP Curtain Transition

**The pattern:** A full-screen overlay slides in to cover the old page, the new page loads underneath, the overlay slides away. Used by AntiGravity, GSAB, Locomotive.

## Setup

The curtain lives in the Layout — it persists across all page navigations.

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'

interface Props {
  title: string
}
const { title } = Astro.props
---
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <ViewTransitions />
  </head>
  <body>
    <!-- Curtain — always present, above everything -->
    <div id="page-curtain" aria-hidden="true"></div>

    <slot />

    <script>
      import gsap from 'gsap'

      const curtain = document.getElementById('page-curtain')!
      let ctx: gsap.Context | null = null

      // Curtain slides IN — covers old page before navigation
      document.addEventListener('astro:before-preparation', () => {
        gsap.to(curtain, {
          y: '0%',
          duration: 0.5,
          ease: 'power3.inOut',
        })
      })

      // After new page DOM is in place — reveal it
      document.addEventListener('astro:after-swap', () => {
        // Kill previous page animations
        if (ctx) { ctx.revert(); ctx = null }

        // Curtain slides OUT — reveals new page
        gsap.to(curtain, {
          y: '100%',
          duration: 0.5,
          ease: 'power3.inOut',
          delay: 0.1,
          onComplete: () => {
            // Reset to above viewport for next transition
            gsap.set(curtain, { y: '-100%' })
          },
        })

        initPageAnimations()
      })

      // Initial page load — no curtain needed, just animate content
      document.addEventListener('astro:page-load', () => {
        initPageAnimations()
      }, { once: true })

      function initPageAnimations() {
        ctx = gsap.context(() => {
          // ✅ set() + to() — NIEMALS from()
          const elements = document.querySelectorAll('[data-animate="fade-up"]')
          gsap.set(elements, { opacity: 0, y: 48 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
          })
        })
      }
    </script>
  </body>
</html>

<style is:global>
  #page-curtain {
    position: fixed;
    inset: 0;
    background-color: var(--color-bg);  /* matches page background */
    transform: translateY(-100%);        /* starts above viewport */
    z-index: 9999;
    pointer-events: none;
  }
</style>
```

## Curtain Variations

**Solid color (minimal):**
```css
#page-curtain { background: var(--color-bg); }
```

**Accent stripe (branded):**
```css
#page-curtain { background: var(--color-accent); }
```

**Gradient (cinematic):**
```css
#page-curtain {
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
}
```

**Two-panel (split curtain — advanced):**
```css
/* Left panel + right panel that slide in from opposite sides */
#curtain-left  { transform: translateX(-100%); width: 50%; }
#curtain-right { transform: translateX(100%);  width: 50%; left: 50%; }
```

```ts
// Animate both panels simultaneously
gsap.to(['#curtain-left', '#curtain-right'], {
  x: '0%', duration: 0.5, ease: 'power3.inOut'
})
// Reveal: slide outward
gsap.to('#curtain-left',  { x: '-100%', duration: 0.5, ease: 'power3.inOut' })
gsap.to('#curtain-right', { x: '100%',  duration: 0.5, ease: 'power3.inOut' })
```

## Cleanup Rules (Critical)

When using transitions with GSAP and Lenis, cleanup must happen in the right order:

```ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null
let ctx: gsap.Context | null = null

function init() {
  lenis = new Lenis({ autoRaf: false }) // ⚠️ CRITICAL: must be false
  const rafCallback = (time: number) => lenis!.raf(time * 1000)
  gsap.ticker.add(rafCallback)
  gsap.ticker.lagSmoothing(0)

  ctx = gsap.context(() => {
    // ScrollTrigger animations here
    ScrollTrigger.refresh()
  })
}

function destroy() {
  if (ctx) { ctx.revert(); ctx = null }
  if (lenis) { lenis.destroy(); lenis = null }
  ScrollTrigger.getAll().forEach(t => t.kill())
}

document.addEventListener('astro:page-load', init)
document.addEventListener('astro:before-swap', destroy)
```

**Order matters:**
1. `astro:before-swap` → destroy all (ScrollTrigger, Lenis, GSAP context)
2. `astro:after-swap` → curtain out + start page animations
3. `astro:page-load` → final init (Lenis running, ScrollTrigger refreshed)

## Barba.js — Not Recommended

Barba.js works, but has a critical limitation: **it cannot update `<head>` tags** between pages. This breaks meta titles, descriptions, and canonical URLs. For Astro projects, native View Transitions + GSAP is always the better choice.

Use Barba.js only if you need its specific hooks and are managing head updates manually.

## Decision Guide

```
Building a portfolio or agency site?
  → GSAP curtain — premium feel, defines the experience

Building a SaaS or content site?
  → Astro native View Transitions — clean, fast, no extra JS

User says "same as AntiGravity / GSAB"?
  → GSAP curtain with var(--color-bg) as background

User says "keep it simple"?
  → Astro native, fade with 0.3s duration

No preference stated?
  → Ask. Do not choose for the user.
```
