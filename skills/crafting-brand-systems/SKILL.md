---
name: crafting-brand-systems
description: Use when implementing a cohesive brand identity system in code. Ensures consistent typography, colors, spacing, and micro-interactions across the entire product using Tailwind v4.
---
# Crafting Brand Systems (Tailwind v4)
## The Rule
**Tokens → Components → Compositions. next/font + `@theme inline` eliminates FOUT. Name colors by purpose. 8px grid. Brand applies to ALL states.**
---
## Font Loading
```tsx
// ✅ lib/fonts.ts
import localFont from 'next/font/local'
export const display = localFont({ src: '../../public/fonts/Display.woff2', variable: '--font-display', display: 'swap' })
// ✅ layout.tsx — wire to <html>
export default function Layout({ children }) {
  return <html className={display.variable}><body>{children}</body></html>
}
```
```css
/* ✅ globals.css — map via @theme inline */
@theme inline { --font-display: var(--font-display); }
```
---
## Color System
```css
/* ✅ Define :root/.dark, wire with @theme inline */
:root { --color-primary: #0052CC; --color-accent: #8AB200; }
.dark { --color-accent: #C8FF00; }
@theme inline { --color-primary: var(--color-primary); --color-accent: var(--color-accent); }
/* ❌ #C8FF00 on white = illegible */
```
---
## Spacing + Components
```css
/* ✅ 8px grid */
@theme { --spacing-1: 0.5rem; --spacing-2: 1rem; --spacing-4: 2rem; }
```
```tsx
// ✅ Branded button with focus ring
export function Button({ variant = 'primary', ...props }) {
  const styles = { primary: 'bg-primary text-white hover:bg-primary/90', ghost: 'text-primary hover:bg-primary/5' }
  return <button className={`px-4 py-2 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${styles[variant]}`} {...props} />
}
/* ❌ No variants or focus states */
```
---
## Common Mistakes
| Mistake | Fix |
|---------|-----|
| Font FOUT | Use `next/font` + `@theme inline` |
| `tailwind.config.ts` in v4 | Use `@theme` in CSS |
| Scattered colors | Define `:root`, wire via `@theme inline` |
| Neon on light mode | Darkened variant in `:root` |
| Random spacing | 8px grid, no `[20px]` |
| Brand missing states | Apply to ALL states |
