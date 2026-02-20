---
name: creating-visual-depth
description: Use when adding shadows, gradients, glass effects, or z-index layering. AI consistently produces flat, generic results — single-layer shadows, smooth gradients without grain, unlimited backdrop-filter blur.
---

# Creating Visual Depth

## The Rule

AI outputs flat UI. The tell: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` on every
card, smooth gradients with banding, `z-index: 9999` without system. None of
these look designed.

---

## Layered Shadows

```css
/* ❌ AI default — one layer, generic */
.card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

/* ✅ Layered — each layer doubles, same opacity per layer */
.card {
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.075),
    0 2px 2px rgba(0, 0, 0, 0.075),
    0 4px 4px rgba(0, 0, 0, 0.075),
    0 8px 8px rgba(0, 0, 0, 0.075),
    0 16px 16px rgba(0, 0, 0, 0.075);
}

/* ✅ On colored backgrounds: match shadow hue to background */
.card-on-blue {
  box-shadow:
    0 1px 2px rgba(37, 99, 235, 0.1),
    0 4px 8px rgba(37, 99, 235, 0.15),
    0 8px 16px rgba(37, 99, 235, 0.08);
}
```

**Rule:** Each layer doubles the y-offset and blur-radius. Keep opacity low per
layer — they stack. Pure black shadows desaturate color backgrounds. Match the
hue instead.

---

## Glassmorphism — With Limits

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);          /* 12px = sweetspot */
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Mobile: reduce blur, increase opacity to compensate */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.15);
  }
}
```

**Hard limits:**
- Max **2–3 glass elements per viewport** — each one costs GPU
- Max **12px blur** — above 16px: visible jank on mid-range devices
- Always include mobile fallback — battery drain is real
- Check text contrast against the blurred background (WCAG 4.5:1)

---

## Grainy Gradients

```css
.hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* SVG noise layer — no external file needed */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.35;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

Smooth gradients band on large surfaces. The grain layer prevents banding and
adds tactile depth — the difference between a developer gradient and a designer
gradient. `mix-blend-mode: overlay` keeps it subtle.

---

## Elevation System

```css
/* Define once in :root — never use magic numbers */
:root {
  --z-base:     0;
  --z-raised:   10;    /* cards, floating elements */
  --z-dropdown: 100;   /* dropdowns, tooltips, popovers */
  --z-sticky:   200;   /* sticky headers, sidebars */
  --z-overlay:  300;   /* modals, dialogs, drawers */
  --z-toast:    400;   /* notifications — always on top */
}

/* Usage */
.header   { z-index: var(--z-sticky); }
.dropdown { z-index: var(--z-dropdown); }
.modal    { z-index: var(--z-overlay); }
.toast    { z-index: var(--z-toast); }
```

**Never** `z-index: 9999`. It's not a system, it's a guess. Token-based
elevation means every developer understands the hierarchy on first read.
Pattern from Material Design, Radix UI, Salt Design System.

---

## Contact Shadows (Ambient Occlusion)

```css
/* Simulate objects resting on a surface */
.card {
  position: relative;
}

.card::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 5%;
  width: 90%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%);
  filter: blur(6px);
  z-index: -1;
}
```

Use when elements should feel like they're physically resting on the page —
product cards, modals, floating buttons. Adds perceived weight without
increasing `box-shadow` complexity.
