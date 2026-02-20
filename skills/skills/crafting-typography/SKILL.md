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

## Variable Font Loading

```html
<!-- Preload critical fonts — discovered before CSS is parsed -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* ❌ AI default — causes FOIT (invisible text) on slow connections */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-weight: 100 900;
}

/* ✅ Correct — immediate fallback text, minimal layout shift */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;        /* Show fallback immediately, swap when loaded */
  font-optical-sizing: auto; /* Variable font optical adjustments */
}

/* Size-adjusted fallback — prevents layout shift when font swaps */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
}

body { font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif; }
```

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

## Line-Height by Context

```css
h1, h2 { line-height: 1.1; }  /* Large text — tight */
h3, h4  { line-height: 1.3; }  /* Medium — moderate */
body    { line-height: 1.6; }  /* Body — comfortable (WCAG min: 1.5) */
button  { line-height: 1.0; }  /* UI elements — compact */
```

**Always unitless** (`1.6` not `24px`) — scales automatically with font-size.

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
