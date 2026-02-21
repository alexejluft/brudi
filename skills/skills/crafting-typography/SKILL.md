---
name: crafting-typography
description: Use when styling text, headings, or setting up fonts. Prevents fixed px sizes, FOIT/CLS from font loading, flat heading hierarchy, and incorrect spacing — the fastest visual difference between AI-generated and professional design.
---

# Crafting Typography

## The Rule

Fixed `px` font sizes, missing `font-display`, and uniform letter-spacing are the
three fastest ways to make a design look AI-generated. All three are invisible to
untrained eyes — but immediately obvious to anyone who's seen good typography.

---

## Fluid Type Scale

```css
/* ❌ AI default — breaks on mobile, ignores user preferences */
h1 { font-size: 48px; }
body { font-size: 16px; }

/* ✅ Fluid — scales between min and max without media queries */
h1    { font-size: clamp(2.5rem, 2rem + 3vw, 4rem);       } /* 40–64px */
h2    { font-size: clamp(1.75rem, 1.5rem + 1.5vw, 2.5rem);} /* 28–40px */
h3    { font-size: clamp(1.25rem, 1.125rem + 0.75vw, 1.75rem); } /* 20–28px */
body  { font-size: clamp(1rem, 0.875rem + 0.5vw, 1.125rem); } /* 16–18px */
```

**Always `rem` for min/max** (not `px`) — respects user's browser font size settings.
**Rule:** H1 should be 2.5–4× body size. Less = flat hierarchy.

---

## Variable Font Loading + Animations

**Always use Variable Fonts** (`-Variable.woff2`) — one file covers all weights, and GSAP can animate weight/slant axes in real-time.

```css
/* ✅ Variable font — font-display: swap prevents FOIT */
@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Variable.woff2') format('woff2');
  font-weight: 200 700;
  font-display: swap;
}
/* ❌ WRONG: static font files per weight — no animation possible */
```

```tsx
// ✅ GSAP animates font-variation-settings — award-level technique
// Weight animation on hover (thin → bold)
gsap.to('.headline', {
  fontVariationSettings: '"wght" 700',
  duration: 0.4,
  ease: 'power2.out'
})

// ✅ Scroll-driven weight: text "grows" as user scrolls in
gsap.to('.hero-title', {
  fontVariationSettings: '"wght" 800',
  scrollTrigger: { trigger: '.hero', start: 'top center', scrub: true }
})

// ❌ WRONG: static font files → fontVariationSettings has no effect
// ❌ WRONG: animating font-weight (integer steps only) → use fontVariationSettings
```

**Brudi ships 5 variable fonts** (`~/.brudi/assets/fonts/woff2/`). Always prefer these over static alternatives. See `assets/fonts/FONTS.md` for pairings.

---

## Optical Corrections

```css
/* Large headlines — always negative letter-spacing */
h1 {
  letter-spacing: -0.02em; /* Tighten — default is too loose at large sizes */
  line-height: 1.1;         /* Tighter line-height for large text */
  font-weight: 700;
  font-kerning: auto;
}

h2 { letter-spacing: -0.01em; line-height: 1.2; }
h3 { letter-spacing: 0;       line-height: 1.3; }

/* All-caps — always positive letter-spacing */
.label-caps {
  text-transform: uppercase;
  letter-spacing: 0.08em;   /* Loosen — uppercase is too tight by default */
  font-weight: 500;          /* Slightly lighter — uppercase reads heavier */
}

/* Body text — never touch letter-spacing */
body { line-height: 1.6; }  /* 1.5 minimum (WCAG), 1.6–1.7 for comfort */
p    { max-width: 65ch; }   /* Optimal line length — beyond 75ch = fatigue */
```

**Rule:** Negative spacing for headlines. Positive spacing for all-caps.
**Never adjust letter-spacing on body text** — fonts are already optimized.

---

**Line-height:** Always unitless — `h1/h2: 1.1`, `h3/h4: 1.3`, `body: 1.6`, `button: 1.0`.

---

## Common Mistakes

| Mistake | Visual Result | Fix |
|---------|--------------|-----|
| Fixed `px` font sizes | Breaks on mobile, ignores zoom | `clamp(rem, rem + vw, rem)` |
| No `font-display: swap` | Text invisible 2–3s on slow connections | Add `font-display: swap` |
| No `preload` for fonts | Late font discovery, layout shift | `<link rel="preload">` in `<head>` |
| Flat heading scale (H1=48, H2=36, H3=24) | All levels look the same | Min 1.5× ratio between levels |
| No letter-spacing on headlines | "Gestaucht", template look | `-0.01em` to `-0.03em` on H1/H2 |
| Uppercase without tracking | Cramped, hard to read | `+0.06em` to `+0.1em` for all-caps |
| `line-height` same everywhere | Headlines feel disconnected | 1.1 for H1, 1.6 for body |
