---
name: designing-for-mobile
description: Use when building any UI — not just when "making it responsive". Mobile is the primary context, not a breakpoint. Covers touch targets, thumb zones, touch feedback, and disabling desktop-only effects. Updated for Tailwind CSS v4 and Next.js 15/16.
---
# Designing for Mobile
Build for mobile first. Enhance for desktop. 60%+ of traffic is mobile.
---
## Touch Targets
```css
button, a { min-height: 48px; min-width: 48px; padding: 12px 16px; -webkit-tap-highlight-color: transparent; }
.action-list > * + * { margin-top: 8px; }
```
---
## Thumb Zones & Positioning
```
┌─────────────────┐
│  ❌ Hard reach  │  ← avoid primary actions
│  ⚠️ Stretch     │  ← secondary ok
│  ✅ Easy reach  │  ← CTAs, nav, main actions
└─────────────────┘
```
```css
.bottom-nav { position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom); }
.fab { position: fixed; bottom: 24px; right: 24px; }
```
---
## Touch Feedback & Breakpoints
```css
button:active, a:active { transform: scale(0.97); opacity: 0.85; transition: transform 80ms ease-out, opacity 80ms ease-out; }
@theme { --breakpoint-xs: 30rem; }
@media (hover: none) { .card:hover { transform: none; } }
```
---
## Typography & Safe Areas
```css
body { font-size: 1rem; line-height: 1.6; }
h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }
input { font-size: 1rem; } /* iOS zooms if < 16px */
.fixed-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
```
---
## Mobile Navigation
Hamburger below `md` breakpoint. Close on route change, escape key, outside click.

## Common Mistakes

| Mistake | Why wrong | Fix |
|---------|-----------|-----|
| `padding: 4px 8px` on buttons | ~28px — too small to tap | `min-height: 48px` |
| Hover as only feedback | No feedback on touch | `:active` states |
| Parallax everywhere | Janky on mobile | `(hover: none)` guard |
| `font-size: 14px` on inputs | iOS zooms in | `font-size: 1rem` |
| No safe area padding | Content behind notch | `env(safe-area-inset-*)` |
| No mobile hamburger menu | Nav links inaccessible | Hamburger below `md` breakpoint |
| Custom breakpoints in `tailwind.config.ts` | File doesn't exist in v4 | Use `@theme` in CSS |
