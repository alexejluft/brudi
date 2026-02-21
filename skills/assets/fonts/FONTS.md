# Brudi Font Pairings

## Included Fonts (ready to use — no download needed)

All woff2 files are in `/assets/fonts/woff2/`. Copy into project with:
```bash
cp ~/.brudi/assets/fonts/woff2/*.woff2 ./public/fonts/
```

**License:** ITF Free Font License (FFL) — free for personal and commercial use in end projects.

| File | Family | Weights | Best for |
|------|--------|---------|----------|
| `ClashDisplay-Variable.woff2` | Clash Display | 200–700 | Display/Headlines |
| `Satoshi-Variable.woff2` | Satoshi | 300–900 | Body text |
| `GeneralSans-Variable.woff2` | General Sans | 300–700 | Display + Body |
| `CabinetGrotesk-Variable.woff2` | Cabinet Grotesk | 100–800 | Display/Headlines |
| `Switzer-Variable.woff2` | Switzer | 100–900 | Display + Body |

---

## Pairings by Project Type

### A — Agency / Portfolio / Award-level
**Clash Display** (headlines) + **Satoshi** (body)
- Bold, geometric, premium feel
- Tight tracking, strong personality

### B — SaaS / Startup / Product
**General Sans** (headlines + body — use one font only)
- Clean, versatile, highly readable
- Works at any size — UI labels to hero text

### C — Corporate / B2B / Professional
**Switzer** (headlines + body — use one font only)
- Neutral, serious, trust-building
- Ideal for finance, legal, consulting

### D — Luxury / Fashion / Editorial
**Cabinet Grotesk** (headlines) + **General Sans** (body)
- Geometric with personality, slightly playful
- High-end without being aggressive

---

## How to Load with next/font/local

```tsx
import localFont from 'next/font/local'

// Pairing A — Agency
const clashDisplay = localFont({
  src: [{ path: '../fonts/ClashDisplay-Variable.woff2', weight: '200 700' }],
  variable: '--font-display',
  display: 'swap',
})
const satoshi = localFont({
  src: [{ path: '../fonts/Satoshi-Variable.woff2', weight: '300 900' }],
  variable: '--font-body',
  display: 'swap',
})

// Pairing B or C — single font
const generalSans = localFont({
  src: [{ path: '../fonts/GeneralSans-Variable.woff2', weight: '300 700' }],
  variable: '--font-sans',
  display: 'swap',
})
```

```tsx
// In layout.tsx:
<html className={`${clashDisplay.variable} ${satoshi.variable}`}>

// In tailwind.config.ts:
fontFamily: {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
}
```

---

## Rules
- Always `display: 'swap'` — prevents invisible text during load
- Always CSS `variable` — never hardcode font-family in components
- Neon accents on light backgrounds need darkened variant (see `crafting-brand-systems`)
- If unsure → Pairing A for portfolio/agency, B for SaaS, C for corporate, D for luxury
