---
name: designing-award-motion
description: Use when implementing animations, motion timing systems, and grid layouts. Covers GSAP easing, duration scales, stagger patterns, asymmetric grids, and placeholder image rules.
---

# Designing Award Layouts — Motion & Grid Systems

## 1. Motion — Timing System

**All animations must use the same easing family.** Mixing easings randomly is a tell.

```ts
/* ── Master easing — use this everywhere ── */
const EASE = {
  enter: "power3.out",      // Elements entering — dramatic
  exit:  "power2.in",       // Elements leaving — quick
  soft:  "power2.out",      // Subtle movements
}

/* ── Duration scale ── */
const DUR = {
  micro:    0.15,   // hover states
  standard: 0.4,    // standard reveals
  enter:    0.7,    // page / section entrances
  hero:     1.0,    // hero animations (max)
}

/* ── Stagger delays — use multiples of 0.08 ── */
const STAGGER = 0.08   // 80ms between elements: 0 / 80 / 160 / 240ms
```

**ScrollTrigger entrances — correct pattern:**
```ts
gsap.fromTo(elements,
  { opacity: 0, y: 48 },           // 48px = 3 × 8pt units
  {
    opacity: 1,
    y: 0,
    duration: DUR.enter,
    ease: EASE.enter,
    stagger: STAGGER,
    scrollTrigger: {
      trigger: container,
      start: "top 85%",
      once: true,              // never replay
    }
  }
);
```

**Never:** `animation-duration: 0.3s` for a full section reveal. Never `ease: "linear"` for entrances. Never replay animations on scroll-up.

---

## 2. Placeholder Images — Unsplash Direct URLs

**When no images are provided, never use grey rectangles or `<div>` placeholders.** The design must be evaluable from the first build.

**Use Unsplash direct photo URLs — specific IDs, not random:**

```html
<!-- CORRECT — specific photo, consistent, thematic -->
<img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=1080&fit=crop&q=80" />

<!-- WRONG — random, changes on reload, can't evaluate design -->
<img src="https://source.unsplash.com/random/1920x1080?architecture" />
```

**The keyword-random URL API is deprecated — don't use it.** Use specific photo IDs from `unsplash.com`.

**Process:** Search unsplash.com for thematic images → copy photo URL → extract `photo-[ID]` → construct URL:
```
https://images.unsplash.com/photo-[PHOTO_ID]?w=[WIDTH]&h=[HEIGHT]&fit=crop&q=80
```

**Hotlinking Unsplash is permitted** under their terms for non-commercial use and demos.

**Curated architecture/design photo IDs (use as fallbacks):**
```
Architectural exterior:  photo-1487958449943-2429e8be8625
Modern interior:         photo-1600585154340-be6161a56a0c
Concrete structure:      photo-1486718448742-163732cd1544
Glass facade:            photo-1511818966892-d7d671e672a2
Minimal space:           photo-1519710164239-da123dc03ef4
Urban architecture:      photo-1486325212027-8081e485255e
```

**For other topics:**
- Food/Restaurant: Search unsplash.com for "restaurant interior" or "food photography"
- SaaS/Tech: Search for "desk setup" or "minimal workspace"
- Fashion: Search for "studio photography" or "editorial fashion"

---

## 3. Grid System

**Desktop:** 12-column conceptual grid. Max content width `1280px–1440px`. Horizontal padding `48px–64px` (px-12/px-16).

**Asymmetric layouts beat symmetric ones.** Award sites rarely use equal columns.

```html
<!-- Common award-level split — 7/5 or 8/4 -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-12 md:col-span-7">  <!-- hero image or content --></div>
  <div class="col-span-12 md:col-span-5">  <!-- supporting content --></div>
</div>

<!-- Content offset — intentional whitespace as design element -->
<div class="grid grid-cols-12 gap-8">
  <div class="col-span-12 md:col-span-4">  <!-- label --></div>
  <div class="col-span-12 md:col-span-6 md:col-start-7">  <!-- text --></div>
</div>
```

**No element may float outside the grid.** Every element is intentionally placed.

---

## Pre-Build Checklist for Motion & Grid

Before shipping, verify:

```
□ Motion: Single easing family, stagger multiples of 80ms
□ Images: Specific Unsplash photo IDs, no grey rectangles
□ Grid: 12-col desktop, asymmetric preferred, no free-floating elements
```

---

See also: `designing-award-layouts-core`, `designing-award-navigation`
