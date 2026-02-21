---
name: designing-award-layouts
description: Use when building any website or landing page. Defines the spacing system, dark theme layering, mobile-first composition, visual hierarchy, and motion timing required for Awwwards / FWA / CSSDA level results. Technical rules, not taste.
---

# Designing Award Layouts

## The Core Principle

Award-level design is not aesthetic judgment — it is **system control**. The agent who fails does so because they made "plausible-looking" decisions without a defined system. Every value must be deliberate.

**Before writing a single line of layout code, lock in:**
1. Spacing scale (8pt system)
2. Dark theme layers (minimum 4)
3. Section padding values (desktop / mobile)
4. Type scale (max 3 sizes per section)
5. Motion timing (enter / exit / stagger)

---

## 1. Spacing System — 8pt Grid, No Exceptions

**Base unit = 8px.** Every spacing value must be a multiple of 8.

```
Allowed values:    8   16   24   32   48   64   96   128   160   192
Tailwind classes:  2    4    6    8   12   16   24    32    40    48
```

**Never use:** 37px, 53px, 15px, or any non-8pt value. No `gap-5` (20px), no `mt-7` (28px).

**Section vertical padding — locked values:**

| Context | Desktop | Mobile |
|---------|---------|--------|
| Hero | 160–192px (py-40/py-48) | 96–128px (py-24/py-32) |
| Large section | 128–160px (py-32/py-40) | 80–96px (py-20/py-24) |
| Standard section | 96–128px (py-24/py-32) | 64–80px (py-16/py-20) |
| Small section | 64–96px (py-16/py-24) | 48–64px (py-12/py-16) |

**Rule:** If a section padding is less than 96px on desktop → the page reads as cheap.

**Internal rhythm — micro spacing:**

```
label → H1:          24–32px (mb-6/mb-8)
H1 → subline:        24–32px (mt-6/mt-8)
subline → CTA:       40–48px (mt-10/mt-12)
paragraph → paragraph: 24px (mt-6)
image → caption:     16px (mt-4)
```

---

## 2. Dark Theme Layering — Minimum 4 Levels

**The most common AI failure:** `background: #000` or `background: #09090B` used for every surface.

A premium dark theme has structural depth. Each layer reads as a distinct elevation:

```css
/* ── Token Definition (Tailwind v4 @theme) ── */
@theme {
  --color-bg:          #09090B;  /* Layer 0 — page base */
  --color-bg-elevated: #111113;  /* Layer 1 — subtle alt sections */
  --color-surface:     #18181B;  /* Layer 2 — cards, panels */
  --color-surface-high:#222226;  /* Layer 3 — dropdowns, tooltips */

  --color-border:        rgba(255,255,255,0.06);
  --color-border-subtle: rgba(255,255,255,0.04);
}
```

**Layer assignment rules:**

| Element | Layer |
|---------|-------|
| `<body>`, hero background | Layer 0 (`--color-bg`) |
| Alternating sections | Layer 1 (`--color-bg-elevated`) |
| Cards, project tiles | Layer 2 (`--color-surface`) |
| Hover states, dropdowns | Layer 3 (`--color-surface-high`) |

**Never:** Two adjacent sections with the same background. The eye needs contrast to understand structure.

**Border rule:** Use `rgba(255,255,255,0.06)` not `#2A2A32`. The alpha-based border respects every layer color automatically.

---

## 3. Typography Scale — Rhythm, Not Size

**Max 3 sizes per section.** One dominant, one medium, one small. Not 6 different sizes.

```css
/* Fluid type scale — use in global.css */
h1 {
  font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem);  /* 40px → 88px */
  letter-spacing: -0.03em;
  line-height: 1.05;
}

h2 {
  font-size: clamp(1.75rem, 3vw + 0.5rem, 3.5rem);  /* 28px → 56px */
  letter-spacing: -0.02em;
  line-height: 1.1;
}

h3 {
  font-size: clamp(1.125rem, 1.5vw + 0.25rem, 1.75rem);  /* 18px → 28px */
  letter-spacing: -0.01em;
  line-height: 1.25;
}

p {
  line-height: 1.6;
  letter-spacing: 0;
}

.label-caps {
  font-size: 0.75rem;       /* 12px — fixed, not fluid */
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
}
```

**Mobile type caps (hard rule):**
- H1 on mobile must not exceed `clamp(2rem, 8vw, 2.75rem)` → max ~44px
- H2 on mobile: max ~32px
- Body: 16–18px minimum for readability

**Line-height rule:** Headlines always `< 1.2`. Body always `> 1.5`. Never invert these.

---

## 4. Visual Hierarchy — 1 Dominance Center Per Section

**Every section has one focal point.** One element carries the weight. Everything else supports it.

**Hero — maximum allowed:**
```
1 × micro label (e.g. "Architectural Photography Studio")
1 × H1 (the ONE thing)
1 × subline (optional, max 2 sentences)
1 × primary CTA
1 × secondary CTA (optional, lower visual weight)
```

**Not allowed in hero:**
- Stats blocks mixed with headline
- 3+ text elements with similar weight
- Navigation overlapping content visually
- Hero gradient so heavy that text is unreadable without it

**Breathing room — the 1.5× rule:**
```
Every strong visual component gets ≥ 1.5× its own height as surrounding space.

Example: If H1 is 80px tall → minimum 120px of combined margin/padding above and below.
```

**Dividers:** Use `h-px bg-border` (1px line) or whitespace alone. Never decorative elements that add noise.

---

## 5. Mobile-First Composition — Redesign, Not Compress

**The failure pattern:** Desktop layout → stack columns → call it "mobile."

Mobile must be **redesigned**, not reflowed. Different hierarchy, different emphasis, different spacing logic.

```
Desktop: 12-column grid, content side-by-side, large type
Mobile:  4-column grid, content stacked, type recalibrated
```

**Mobile-specific rules:**

```
Horizontal padding:  24px (px-6) — never less
Section padding:     80–96px top/bottom
H1 maximum:          44px (on 375px viewport)
Body font:           16px minimum
CTA buttons:         full-width (w-full) on mobile
Images:              always 100% width, never overflow
```

**Breakpoint logic for Tailwind (mobile-first means: base = mobile):**
```html
<!-- CORRECT — mobile base, desktop override -->
<section class="px-6 py-20 md:px-12 md:py-32 lg:py-40">

<!-- WRONG — desktop base that breaks on mobile -->
<section class="px-16 py-40 md:px-6 md:py-20">
```

**Content priority on mobile:**
1. Headline
2. Key message (1 sentence)
3. CTA
4. Supporting visual

Everything else is secondary. Remove it or move it below the fold.

---

## 6. Grid System

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

## 7. Motion — Timing System

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

## 8. Placeholder Images — Unsplash Direct URLs

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

## The Pre-Build Checklist

Before writing layout HTML, verify:

```
□ Spacing: Only 8pt multiples used (8, 16, 24, 32, 48, 64, 96, 128, 160, 192)
□ Sections: Desktop padding ≥ 96px, hero ≥ 160px
□ Dark theme: ≥ 4 distinct background layers defined as tokens
□ Adjacent sections: Never same background color
□ Typography: Max 3 sizes per section, H1 line-height < 1.2, body > 1.5
□ Mobile: Padding px-6, section py-20 minimum, H1 ≤ 44px
□ Hero: Max 1 H1, max 1 subline, max 2 CTAs
□ Grid: 12-col desktop, asymmetric preferred, no free-floating elements
□ Motion: Single easing family, stagger multiples of 80ms
□ Images: Specific Unsplash photo IDs, no grey rectangles
```

If any box is unchecked → the layout is not award-level. Fix it before shipping.
