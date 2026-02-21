# Brudi Font Pairings

## Included Fonts (ready to use)

The following woff2 files are included in `/assets/fonts/woff2/`:

| File | Family | Weights |
|------|--------|---------|
| `ClashDisplay-Variable.woff2` | Clash Display | 200–700 |
| `Satoshi-Variable.woff2` | Satoshi | 300–900 |

**License:** ITF Free Font License (FFL) — free for personal and commercial use in end projects. Not for resale or redistribution as standalone font files.

---

## How to Use in a Project

**Step 1:** Copy woff2 files into the project:
```bash
cp ~/.brudi/assets/fonts/woff2/*.woff2 ./public/fonts/
```

**Step 2:** Load with `next/font/local` in your layout:
```tsx
import localFont from 'next/font/local'

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

export default function RootLayout({ children }) {
  return (
    <html className={`${clashDisplay.variable} ${satoshi.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Step 3:** Use via CSS variables in Tailwind config:
```js
// tailwind.config.ts
fontFamily: {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
}
```

---

## Recommended Pairings

### Pairing A: Agency / Portfolio (included ✅)
- **Display:** Clash Display — bold, geometric, award-level
- **Body:** Satoshi — clean, versatile, 300–900 range

### Pairing B: Tech / SaaS (Google Fonts — no download needed)
- **Display:** Space Grotesk + **Body:** DM Sans
- Use `next/font/google` directly

### Pairing C: Editorial / Content (Google Fonts — no download needed)
- **Display:** Playfair Display + **Body:** Inter
- Use `next/font/google` directly

---

## Rules
- Always `display: 'swap'` — prevents invisible text during load
- Always use CSS `variable` — never hardcode font-family in components
- Neon/bright accents on light backgrounds need a darkened variant (see `crafting-brand-systems`)
