---
name: building-page-transitions
description: Use when building any multi-page Astro website. Defines two premium transition approaches: Astro View Transitions (native, minimal) and GSAP curtain transitions (custom, premium). Instant page changes feel cheap — transitions define the perceived quality of a site.
---

# Building Page Transitions

## The Two Options

Always propose both to the user before building. They have different trade-offs.

```
Option A — Astro View Transitions
  Native browser API + Astro router
  Setup: 2 lines of code
  Feel: Clean, modern, app-like
  Control: Limited (CSS-driven)
  Best for: Most projects

Option B — GSAP Curtain Transition
  Custom overlay animated by GSAP
  Setup: ~60 lines
  Feel: Cinematic, premium, agency-level
  Control: Full (timing, easing, effects)
  Best for: Award-level portfolios, agency sites
```

**Do not implement a transition without asking.** The choice changes the feel of the entire site.

---

## Option A — Astro View Transitions (Native)

**Browser support (2025):** Chrome 111+, Edge 111+, Safari 18+, Firefox 144+ — ~85%+. Astro provides automatic fallback for the rest.

### Implementation

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'
---
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <ViewTransitions />   <!-- ← This is all you need -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Default behavior:** Astro morphs between pages with a cross-fade. Works instantly.

### Customize the Transition

```css
/* In global.css — override the default animation */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out forwards;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Persist Elements Across Pages (Nav, Music Player)

```astro
<!-- Navigation stays, doesn't re-animate -->
<nav transition:persist>
  <a href="/">Home</a>
  <a href="/work">Work</a>
</nav>
```

### Link Specific Elements Between Pages (Shared Hero Image)

```astro
<!-- On /work page -->
<img src={project.image} transition:name={`project-${project.id}`} />

<!-- On /work/[slug] page — morphs between the two -->
<img src={project.image} transition:name={`project-${project.id}`} />
```

### Lifecycle Events

```ts
// astro:page-load = replaces DOMContentLoaded for View Transitions
document.addEventListener('astro:page-load', () => {
  initAnimations()   // Called on every page load including transitions
})

// astro:before-swap = fires before DOM is replaced
document.addEventListener('astro:before-swap', () => {
  destroyAnimations()   // Cleanup GSAP, ScrollTrigger, Lenis
})

// astro:after-swap = fires after DOM is replaced
document.addEventListener('astro:after-swap', () => {
  reinitAnimations()    // Reinit if needed
})
```

### Zero-JavaScript Option (Modern Browsers Only)

```css
/* In global.css — no ViewTransitions component needed */
@view-transition {
  navigation: auto;
}
```

Works in Chrome 126+, Edge 126+. No JavaScript required. Add as progressive enhancement.

---

## Option B — GSAP Curtain Transition

**The pattern:** A full-screen overlay slides in to cover the old page, the new page loads underneath, the overlay slides away. Used by AntiGravity, GSAB, Locomotive.

### Setup

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
          gsap.from('[data-animate="fade-up"]', {
            opacity: 0,
            y: 48,
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

### Curtain Variations

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

---

## Cleanup Rules (Critical)

When using transitions with GSAP and Lenis, cleanup must happen in the right order:

```ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null
let ctx: gsap.Context | null = null

function init() {
  lenis = new Lenis()
  gsap.ticker.add((time) => lenis!.raf(time * 1000))
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

---

## Barba.js — Not Recommended

Barba.js works, but has a critical limitation: **it cannot update `<head>` tags** between pages. This breaks meta titles, descriptions, and canonical URLs. For Astro projects, native View Transitions + GSAP is always the better choice.

Use Barba.js only if you need its specific hooks and are managing head updates manually.

---

## Decision Guide

```
Building a portfolio or agency site?
  → Option B (GSAP curtain) — premium feel, defines the experience

Building a SaaS or content site?
  → Option A (Astro native) — clean, fast, no extra JS

User says "same as AntiGravity / GSAB"?
  → Option B, curtain with var(--color-bg) as background

User says "keep it simple"?
  → Option A, fade with 0.3s duration

No preference stated?
  → Ask. Do not choose for the user.
```
