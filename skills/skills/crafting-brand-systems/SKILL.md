---
name: crafting-brand-systems
description: Use when implementing a cohesive brand identity system in code. Ensures consistent typography, colors, spacing, and micro-interactions across the entire product.
---

# Crafting Brand Systems

## The Rule

**Tokens → Components → Compositions. next/font eliminates FOUT. Name colors by purpose. 8px spacing grid. Brand applies to ALL states including errors and empty.**

---

## Typography System

```tsx
// ✅ next/font with CSS variables — zero FOUT
// Google Fonts:
import { Inter, Playfair_Display } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// Fontshare / local fonts (Clash Display, Satoshi, etc.):
import localFont from 'next/font/local'
const display = localFont({ src: './fonts/ClashDisplay-Variable.woff2', variable: '--font-display' })

export default function Layout({ children }) {
  return (
    <html className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```css
/* ✅ Type scale with consistent ratios */
h1 { font: 700 2.5rem/1.2 var(--font-playfair); }
h2 { font: 700 2rem/1.25 var(--font-playfair); }
h3 { font: 600 1.5rem/1.3 var(--font-inter); }
body { font: 400 1rem/1.6 var(--font-inter); }

/* ❌ WRONG: Random sizes, no scale, no line-height rhythm */
/* h1 { font-size: 32px; } h2 { font-size: 26px; } */
```

---

## Color System: Brand + Contextual + State

```css
/* ✅ Correct: Complete color system */
:root {
  /* Brand */
  --color-brand-primary: #0052CC;
  --color-brand-secondary: #6554C0;

  /* Contextual */
  --color-success: #2E7D32;
  --color-warning: #F57C00;
  --color-error: #C62828;

  /* State — derived from brand */
  --color-hover: rgba(0, 82, 204, 0.08);
  --color-focus-ring: 0 0 0 3px rgba(0, 82, 204, 0.2);
}

/* ✅ Accent contrast: if accent is neon/bright, provide dark variant for light backgrounds */
.dark  { --color-accent: #C8FF00; }           /* neon on dark = fine */
:root  { --color-accent: #8AB200; }           /* darkened on light = readable */
/* ❌ WRONG: same neon accent on white background → illegible text (fails WCAG AA) */
```

---

## Spacing: 8px Grid

```css
/* ✅ 8px grid: --space-1: 0.5rem, --space-2: 1rem, --space-3: 1.5rem, --space-4: 2rem */
.card { padding: var(--space-3); gap: var(--space-2); margin-bottom: var(--space-4); }
/* ❌ WRONG: .card { padding: 20px; margin: 15px; } — random values break rhythm */
```

---

## Components + Micro-Interactions

```tsx
// ✅ Branded variants with hover/focus states
export function Button({ variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90',
    ghost: 'text-brand-primary hover:bg-brand-primary/5',
  }
  return <button className={`px-4 py-2 rounded-lg transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
    ${styles[variant]}`} {...props} />
}
// ❌ WRONG: No variants, no hover/focus, inconsistent padding
```

```css
/* ✅ Brand-consistent transitions + focus rings */
button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px var(--color-hover); }
button:focus-visible { outline: 2px solid var(--color-brand-primary); outline-offset: 2px; }
/* ❌ WRONG: No transitions, browser-default focus */
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Font FOUT / layout shift | `next/font` with `variable`, preload critical |
| Scattered color values | Single source: CSS custom properties |
| Neon accent on light background | Provide darkened `--color-accent` for light mode |
| Random spacing values | 8px grid, token-based spacing only |
| Brand missing from errors/empty | Apply brand colors to ALL UI states |
| No hover/focus states | Define transition + ring for every interactive |
