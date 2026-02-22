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
/* ✅ Each layer doubles, constant opacity per layer */
.card {
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.075),
    0 2px 2px rgba(0, 0, 0, 0.075),
    0 4px 4px rgba(0, 0, 0, 0.075),
    0 8px 8px rgba(0, 0, 0, 0.075),
    0 16px 16px rgba(0, 0, 0, 0.075);
}

/* On colored: match hue, not pure black */
.on-blue { box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1), 0 4px 8px rgba(37, 99, 235, 0.15); }
```

**Rule:** Double y-offset+blur per layer. Low opacity stacks. Match hue on colors.

---

## Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
@media (max-width: 768px) {
  .glass { backdrop-filter: blur(6px); background: rgba(255, 255, 255, 0.15); }
}
```

**Rule:** Max 2–3 per viewport. Max 12px blur (>16px = jank). Mobile fallback required.

---

## Grainy Gradients

```css
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");  /* SVG noise */
  opacity: 0.35;
  mix-blend-mode: overlay;
}
```

Prevents banding, adds tactile depth. `overlay` keeps it subtle.

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
