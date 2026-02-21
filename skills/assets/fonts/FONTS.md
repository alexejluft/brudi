# Brudi Font Pairings

⚠️ **License Note:** Clash Display and Satoshi are under the ITF Free Font License (FFL) — free to use in projects, but NOT redistributable. Download them yourself from Fontshare and add to your project's `/src/fonts/` folder. Do NOT commit .woff2 files to a public repo for redistribution.

OFL-licensed fonts (Space Grotesk, DM Sans, Inter, Playfair Display) can be used directly via `next/font/google` — no download needed.

---

## Recommended Pairings (use `next/font/local` with .woff2)

### Pairing A: Modern Agency / Portfolio
- **Display:** Clash Display (Fontshare) — 700 weight, tight tracking
- **Body:** Satoshi (Fontshare) — 300-700 range
- **Download:** https://www.fontshare.com/fonts/clash-display + https://www.fontshare.com/fonts/satoshi
- **Vibe:** Bold, premium, award-level

### Pairing B: Tech / SaaS / Startup
- **Display:** Space Grotesk (Google Fonts) — 500-700 weight
- **Body:** DM Sans (Google Fonts) — 400-700 range
- **Use:** `next/font/google` directly
- **Vibe:** Clean, functional, developer-friendly

### Pairing C: Editorial / Content / Blog
- **Display:** Playfair Display (Google Fonts) — 700 weight, serif
- **Body:** Inter (Google Fonts) — 400-600 range
- **Use:** `next/font/google` directly
- **Vibe:** Elegant, readable, long-form content

## How to Use with next/font/local (Fontshare)

```tsx
// 1. Download .woff2 files from Fontshare
// 2. Place in src/fonts/ or public/fonts/
// 3. Load with next/font/local:

import localFont from 'next/font/local'

const clashDisplay = localFont({
  src: [
    { path: './fonts/ClashDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})
```

## Rules
- Always use `display: 'swap'` to prevent invisible text
- Always use CSS `variable` — never hardcode font-family in components
- Fontshare = `next/font/local` (download .woff2 first)
- Google Fonts = `next/font/google` (loads automatically)
- If unsure which pairing → Pairing A for portfolio/agency, Pairing B for SaaS, Pairing C for content
