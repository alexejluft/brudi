---
name: crafting-typography
description: Use when styling text, headings, or setting up fonts with Tailwind v4. Prevents fixed px sizes, FOIT/CLS, flat hierarchy, and incorrect spacing.
---

# Crafting Typography (Tailwind v4)

## The Rule

Fixed `px` font sizes, missing `font-display`, and uniform letter-spacing are the
three fastest ways to make a design look AI-generated. Tailwind v4 fluid types with
`@theme` sub-properties solve this.

---

## Fluid Type Scale with Tailwind v4

```css
/* ❌ AI default — breaks on mobile, ignores zoom */
h1 { font-size: 48px; }

/* ✅ Fluid in globals.css via @theme */
@theme {
  --text-fluid-display: clamp(3rem, 1rem + 5vw, 8rem);
  --text-fluid-display--line-height: 0.95;
  --text-fluid-display--letter-spacing: -0.03em;

  --text-fluid-lg: clamp(1.75rem, 1.5rem + 1.5vw, 2.5rem);
  --text-fluid-lg--line-height: 1.2;
  --text-fluid-lg--letter-spacing: -0.01em;

  --text-fluid-base: clamp(1rem, 0.875rem + 0.5vw, 1.125rem);
  --text-fluid-base--line-height: 1.6;
}

/* Use: className="text-fluid-display" or "text-fluid-lg" */
```

See `~/.brudi/assets/configs/globals.css` for the complete fluid scale.

---

## Variable Font Loading

**Always use Variable Fonts** (`-Variable.woff2`) — one file covers all weights.

```css
/* ✅ next/font automatically prevents FOIT with font-display: swap */
/* In lib/fonts.ts with next/font/local */

/* ❌ WRONG: static font files per weight — cannot animate */
```

**Brudi ships 5 variable fonts** (`~/.brudi/assets/fonts/woff2/`): Clash Display, Satoshi, etc.

---

## Font Variation Animations with GSAP

```tsx
// ✅ Animate font-variation-settings on variable fonts
gsap.to('.headline', {
  fontVariationSettings: '"wght" 700',
  duration: 0.4,
  ease: 'power2.out'
})

// ✅ Scroll-driven: text weight increases as user scrolls
gsap.to('.hero-title', {
  fontVariationSettings: '"wght" 800',
  scrollTrigger: { trigger: '.hero', start: 'top center', scrub: true }
})

// ❌ WRONG: animating font-weight (steps only)
// ❌ WRONG: fontVariationSettings on static fonts
```

---

## Optical Corrections with @theme

```css
/* ✅ Sub-properties control line-height & letter-spacing per size */
@theme {
  --text-2xl: clamp(1.5rem, 1.375rem + 0.75vw, 2rem);
  --text-2xl--line-height: 1.3;
  --text-2xl--letter-spacing: -0.01em;

  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-sm--line-height: 1.5;
  /* body text: omit letter-spacing adjustment */
}

/* ✅ All-caps always positive tracking */
.label-caps {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

/* ❌ WRONG: same letter-spacing for all sizes */
/* ❌ WRONG: positive tracking on body text */
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Fixed `px` font sizes | Use `clamp()` in `@theme` with `--text-*` |
| No `font-display: swap` | `next/font` handles this automatically |
| Flat heading scale | Sub-properties: `--text-2xl--line-height: 1.3` |
| No letter-spacing on headlines | `-0.01em` to `-0.03em` via `--text-*--letter-spacing` |
| Same spacing everywhere | H1: 0.95, H2: 1.2, body: 1.6 line-height |
| Uppercase too tight | `+0.06em` to `+0.1em` for all-caps only |
| Static fonts | Use `-Variable.woff2` for GSAP animations |
