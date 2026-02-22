---
description: How to start a new Next.js project with Brudi. Includes dependency decisions and Phase 0 quality gate.
globs: ["**/package.json", "**/next.config.*"]
---
# Starting a Project

## Step 0: Bash Permissions
Test Bash with: `echo "ok"`. If it returns "ok", proceed to Approach A. If blocked → Approach B.
---
## Step 1: Project Setup
### Approach A: create-next-app (if Bash available)
Move ALL existing files to `/tmp` first — create-next-app fails on ANY existing file or folder:
```bash
[ -d .claude ] && mv .claude /tmp/.claude-bak; mv CLAUDE.md TASK.md /tmp/ && npx create-next-app@latest . --yes --typescript --tailwind --eslint --app --src-dir --use-npm && mv /tmp/CLAUDE.md /tmp/TASK.md .; [ -d /tmp/.claude-bak ] && mv /tmp/.claude-bak .claude; rm README.md
```
### Approach B: Manual (if Bash blocked)
Write: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, + dirs.

---

## Step 1.5: Dependency Decision (BLOCKING)

Read the project brief (CLAUDE.md) and install dependencies NOW. Do not defer.

```bash
# Award-Level Website (GSAP animations, smooth scroll, icons)?
npm install gsap lenis lucide-react

# 3D experiences (Three.js, React Three Fiber)?
npm install three @react-three/fiber @react-three/drei

# SaaS App (Supabase, form validation)?
npm install @supabase/supabase-js zod

# All projects: (if any of these are referenced in CLAUDE.md)
# Check CLAUDE.md for: "GSAP", "Lenis", "smooth scroll", "animations", "Three.js", "3D"
# If mentioned → install NOW. Not later. NOW.
```

**Why this is blocking:** If you build the layout without GSAP installed, you'll write static code. Then adding animations later requires restructuring components to be client components, adding refs, adding useEffect. Install first, build with animations from the start.

---
## Step 2: PostCSS Config
```javascript
export default { plugins: { "@tailwindcss/postcss": {} } }
```
---
## Step 3: Copy Brudi Assets
Copy from `~/.brudi/assets/`: `configs/globals.css` → `src/styles/`, `fonts/woff2/*` → `public/fonts/`. Edit globals.css to set `:root` colors, `.dark` colors, and font vars in `@theme inline`.

**CRITICAL: Dark Theme Layers (4 required, NOT 1-2)**
Your globals.css MUST define these 4 distinct background values:
```css
:root {
  --color-bg:           #09090B;  /* Layer 0: Page background */
  --color-bg-elevated:  #111113;  /* Layer 1: Raised sections */
  --color-surface:      #18181B;  /* Layer 2: Cards, inputs */
  --color-surface-high: #222226;  /* Layer 3: Hover, active states */
}
```
These 4 layers create visual depth. If everything is the same dark shade, the site looks flat and cheap.

---
## Step 4: Configure Fonts + Layout
```typescript
import localFont from 'next/font/local'
const displayFont = localFont({ src: [{ path: '../fonts/your-font.woff2' }], variable: '--font-display' })
export default function RootLayout({ children }) {
  return <html lang="en" className={displayFont.variable}><body>{children}</body></html>
}
```
⚠️ Font variable on `<html>`, not `<body>`.

---
## Step 5: Initialize Smooth Scroll (if Lenis installed)
```tsx
// components/smooth-scroll.tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false })

    // Sync Lenis with GSAP ticker
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <>{children}</>
}
```

Add `<SmoothScroll>` to your root layout wrapping the page content.

---
## Step 6: Verify Everything (Phase 0 Quality Gate)
```bash
npm run dev
```

**BLOCKING CHECKS — do not proceed if any fail:**
```
□ Dev server starts without errors
□ Background color is NOT #000000 (must be custom dark token like #09090B)
□ Navigation shows custom font (not system font)
□ DevTools: 4 different background colors defined in :root
□ Lenis smooth scroll works (if installed — scroll should feel buttery)
□ Console: 0 errors
□ Mobile 375px: Seite lädt korrekt (Screenshot machen!)
□ reactStrictMode: true in next.config (PFLICHT)
```

**If any check fails → fix it now. Do NOT proceed to building sections.**
**Screenshot Desktop + Mobile 375px in PROJECT_STATUS.md dokumentieren.**

---
## Step 7: Plan Your Vertical Slices

Before building, decide the order of sections:
1. Preloader (if award-level)
2. Hero section
3. Services/Features
4. Portfolio/Case Studies
5. CTA
6. Footer

Each section will be built COMPLETELY (layout + content + depth + animation + responsive) before moving to the next. This is the Vertical Slice approach.

**Read the relevant skill BEFORE building each section:**
- Preloader → `building-preloaders`
- Portfolio cards → `building-portfolio-cards`
- Any section with animation → `animating-interfaces` + `orchestrating-gsap-lenis`
- Any section with depth → `creating-visual-depth`

---

## ⛔ Anti-Patterns (VERBOTEN)

Diese Fehler führen IMMER zu Problemen. Sie sind verboten — nicht "zu vermeiden", sondern **VERBOTEN**:

| Anti-Pattern | Warum verboten | Korrekte Alternative |
|--------------|----------------|---------------------|
| `gsap.from()` mit String-Selektoren | Elemente werden unsichtbar, StrictMode bricht | `gsap.set()` + `gsap.to()` mit Element-Refs |
| `gsap.from('.card', { stagger })` | Scope-Problem in gsap.context() | `querySelectorAll('[data-card]')` + `gsap.to()` |
| `* { margin: 0 }` oder eigene CSS-Resets | Überschreibt Tailwind Preflight, bricht `mx-auto` | Tailwind v4 Preflight reicht — KEINEN eigenen Reset |
| `reactStrictMode: false` | Versteckt Bugs statt sie zu fixen | Code muss idempotent sein (set/to Pattern) |
| Batch-Screenshots am Ende | Fehler werden zu spät entdeckt | Screenshot nach JEDEM Slice |
| Mobile-Test ignorieren | Responsive Bugs werden übersehen | 375px Screenshot nach JEDEM Slice |

---
## Common Mistakes
| Mistake | Fix |
|---------|-----|
| `create-next-app` fails | Move ALL files+folders to /tmp — including .claude/ |
| Interactive prompts | Use `--yes` flag |
| Writing `tailwind.config.ts` | Tailwind v4 uses `@theme` in CSS |
| Font on `<body>` | Must be on `<html>` |
| Missing PostCSS | Needs `postcss.config.mjs` |
| Fonts not loading | Check paths in `localFont()` |
| GSAP not installed | Dependency Decision in Step 1.5 — install before building |
| Only 1 dark color | Need 4 layers: bg, bg-elevated, surface, surface-high |
| Building skeleton first | Use Vertical Slices — each section complete before next |
| No browser verification | Phase 0 Quality Gate is BLOCKING |
