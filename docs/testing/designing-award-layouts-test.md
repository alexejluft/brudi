# Pressure Test — designing-award-layouts

## Scenario 1 — Spacing Violation (Luma Studio Real Bug)

**Source:** Luma Studio first build, 2026 — real failure case

**The bug:**
```html
<!-- Actual code from failed Luma Studio build -->
<section class="px-6 md:px-12 lg:px-16 py-24 md:py-40">
  <div class="mt-6 text-text-muted text-lg">
    <!-- Hero section only 96px padding on desktop (py-24 = 96px) -->
    <!-- No label → H1 rhythm — just stacked elements -->
  </div>
</section>
```

**What the skill teaches:**
- Hero section minimum = 160px desktop (`py-40`)
- `py-24` = 96px — only allowed for standard sections, never hero
- Internal rhythm: label → H1 = `mb-6` (24px), H1 → subline = `mt-6` (24px)

**Correct implementation:**
```html
<section class="px-6 md:px-12 lg:px-16 py-24 md:py-40 lg:py-48">
  <!--                                         ↑ hero minimum on desktop -->
  <p class="label-caps text-accent mb-6">Architectural Photography Studio</p>
  <h1 class="text-text">We capture the soul of architecture</h1>
  <p class="mt-6 text-text-muted">Light, structure, space.</p>
  <div class="mt-12"><!-- CTA --></div>
  <!--    ↑ 48px — extra weight given to CTA via spacing -->
</section>
```

**Verdict:** `py-24` on hero = instant fail. Must be `py-40` (160px) minimum.

---

## Scenario 2 — Dark Theme Flat Layering (Most Common AI Mistake)

**Source:** Material Design Dark Theme Codelabs + Radix UI color system docs

**The pattern that fails:**
```css
/* What AI agents produce */
:root {
  --bg: #09090B;
  --surface: #09090B;    /* ← identical to bg */
  --card: #131316;       /* ← only 1 step different */
  --border: #2A2A32;     /* ← too saturated, wrong approach */
}
```

**What the skill teaches:**
- Minimum 4 distinct background layers
- Border must use `rgba(255,255,255,alpha)` not hex — adapts to all layers
- Each layer must be visually distinct (min ~7-9 hex steps apart in lightness)

**Correct token system:**
```css
@theme {
  --color-bg:          #09090B;   /* 0 — page base */
  --color-bg-elevated: #111113;   /* 1 — alt sections, ~8 steps lighter */
  --color-surface:     #18181B;   /* 2 — cards, panels, ~14 steps lighter */
  --color-surface-high:#222226;   /* 3 — hover, dropdowns, ~20 steps lighter */

  --color-border:        rgba(255,255,255,0.06);
  --color-border-subtle: rgba(255,255,255,0.04);
}
```

**Usage in HTML:**
```html
<body class="bg-bg">
  <section class="bg-bg-elevated">      <!-- alternating section -->
    <div class="bg-surface rounded-none p-8">   <!-- card -->
      <div class="bg-surface-high p-4">  <!-- nested element -->
      </div>
    </div>
  </section>
</body>
```

**Verdict:** Two adjacent sections with `bg-bg` = visual mud. Always alternate layers.

---

## Scenario 3 — Mobile Compression vs. Mobile Composition

**Source:** Josh Comeau CSS course + web.dev Responsive Design Patterns

**The failure pattern:**
```html
<!-- What agents produce: desktop layout that collapses -->
<div class="grid grid-cols-3 gap-8 md:grid-cols-3">
  <!-- Mobile: 3 columns squeezed into 375px viewport -->
  <!-- Content reads as noise, not hierarchy -->
</div>

<!-- Section padding unchanged for mobile -->
<section class="py-40 px-16">
  <!-- py-40 = 160px — correct for desktop, crushing on mobile -->
</section>
```

**What the skill teaches:**
- Mobile = base styles (no prefix). Desktop = md: override
- Section padding: mobile `py-20` (80px), desktop `md:py-40` (160px)
- H1 on 375px viewport: max 44px. Not the desktop 88px.
- Horizontal padding: always `px-6` (24px) on mobile, never less

**Correct mobile-first structure:**
```html
<!-- Mobile base → desktop override -->
<section class="px-6 py-20 md:px-12 md:py-32 lg:py-40">
  <div class="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
    <div class="md:col-span-5">
      <!-- Mobile: full width, stacked. Desktop: 5/12 columns -->
      <h2 class="text-2xl md:text-4xl lg:text-5xl">
        <!-- Mobile: 24px. Desktop: fluid scale. Never clamp breaking mobile -->
      </h2>
    </div>
    <div class="md:col-span-6 md:col-start-7">
      <!-- Content offset: 1 empty column = intentional whitespace -->
    </div>
  </div>
</section>
```

**Typography mobile cap:**
```css
/* Enforce in global.css */
@media (max-width: 768px) {
  h1 { font-size: clamp(2rem, 8vw, 2.75rem); }   /* max ~44px */
  h2 { font-size: clamp(1.5rem, 6vw, 2rem); }    /* max ~32px */
}
```

**Verdict:** Base styles must be mobile. `py-40` as base = mobile fail.

---

## Scenario 4 — Motion Without a System

**Source:** GSAP docs + Codrops "7 Must-Know GSAP Tips" (2025)

**What fails:**
```ts
// Random easings, inconsistent durations — "AI default" animation
gsap.from(".hero-title", { opacity: 0, y: 20, duration: 0.3, ease: "ease" });
gsap.from(".hero-sub", { opacity: 0, y: 15, duration: 0.5, ease: "power1" });
gsap.from(".hero-cta", { opacity: 0, duration: 0.8, ease: "cubic-bezier(0.4,0,0.2,1)" });
// Result: 3 different easings, arbitrary durations, no relationship between elements
```

**What the skill teaches:**
- One easing family for all enter animations: `power3.out`
- Stagger is always a multiple of 80ms: `0.08`
- y-offset always 8pt value: `y: 48` not `y: 20` or `y: 15`
- Hero max duration: `1.0s`

**Correct system:**
```ts
const EASE = { enter: "power3.out", soft: "power2.out" };
const DUR  = { standard: 0.4, enter: 0.7, hero: 1.0 };

// Hero entrance — all elements same system
const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
tl.from("[data-hero='label']",       { opacity: 0, y: 24, duration: DUR.standard })
  .from("[data-hero='title']",       { opacity: 0, y: 48, duration: DUR.hero }, "-=0.2")
  .from("[data-hero='description']", { opacity: 0, y: 32, duration: DUR.enter }, "-=0.4")
  .from("[data-hero='cta']",         { opacity: 0, y: 24, duration: DUR.standard }, "-=0.3");

// ScrollTrigger — consistent pattern
gsap.fromTo("[data-animate='fade-up']",
  { opacity: 0, y: 48 },
  { opacity: 1, y: 0, duration: DUR.enter, ease: EASE.enter, stagger: 0.08,
    scrollTrigger: { trigger: section, start: "top 85%", once: true }
  }
);
```

**Verdict:** Inconsistent easing is immediately visible. One family, one stagger multiple, one y-offset from 8pt scale.
