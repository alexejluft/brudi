---
name: designing-for-mobile
description: Use when building any UI — not just when "making it responsive". Mobile is the primary context, not a breakpoint. Covers touch targets, thumb zones, touch feedback, and disabling desktop-only effects.
---

# Designing for Mobile

**AI builds for desktop and shrinks for mobile. That's wrong.**
Build for mobile first. Enhance for desktop. 60%+ of traffic is mobile.

## Touch Targets

```css
button, a, [role="button"] {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 16px;
}
.action-list > * + * { margin-top: 8px; } /* gap prevents accidental taps */
```

## Thumb Zones

```
┌─────────────────┐
│  ❌ Hard reach  │  ← avoid primary actions
│  ⚠️ Stretch     │  ← secondary ok
│  ✅ Easy reach  │  ← CTAs, nav, main actions
└─────────────────┘
```

```css
.bottom-nav { position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom); }
.fab        { position: fixed; bottom: 24px; right: 24px; }
```

## Touch Feedback

```css
button:active, a:active {
  transform: scale(0.97);
  opacity: 0.85;
  transition: transform 80ms ease-out, opacity 80ms ease-out;
}
button, a { -webkit-tap-highlight-color: transparent; }
```

## Disable Desktop-Only Effects

```javascript
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
if (!isTouch) { initParallax(); initCustomCursor(); }
```

```css
@media (hover: none) { .card:hover { transform: none; } }
```

## Typography & Safe Areas

```css
body    { font-size: 1rem; line-height: 1.6; }
h1      { font-size: clamp(1.75rem, 5vw, 3.5rem); }
h2      { font-size: clamp(1.4rem, 3.5vw, 2.5rem); }
input, textarea, select { font-size: 1rem; } /* iOS zooms if < 16px */

.fixed-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
.fixed-top    { padding-top: max(16px, env(safe-area-inset-top)); }
```

## Mobile Navigation (Hamburger Menu)

**Every multi-page site needs mobile nav. Desktop nav hidden, hamburger shown below `md`.**

```tsx
// ✅ Hamburger pattern — 48px tap target, ARIA labels, body scroll lock
const [open, setOpen] = useState(false)
useEffect(() => {
  document.body.style.overflow = open ? 'hidden' : ''
  return () => { document.body.style.overflow = '' }
}, [open])

<button onClick={() => setOpen(!open)} className="md:hidden w-12 h-12 flex items-center
  justify-center" aria-label={open ? 'Close menu' : 'Open menu'}>
  {open ? <X size={24} /> : <Menu size={24} />}
</button>

{open && (
  <nav className="fixed inset-0 z-40 bg-background flex flex-col items-center
    justify-center gap-8 text-2xl">
    {links.map(link => (
      <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
        {link.label}
      </Link>
    ))}
  </nav>
)}
// ❌ WRONG: no mobile nav → links inaccessible on phones
// ❌ WRONG: hamburger < 48px → fails tap target rule
```

Close menu on: route change, escape key, outside click. Animate with GSAP clipPath or opacity.

## Common Mistakes

| AI does | Wrong because | Fix |
|---------|--------------|-----|
| `padding: 4px 8px` on buttons | ~28px — too small to tap | `min-height: 48px` |
| Hover as only feedback | No feedback on touch | `:active` states |
| Parallax everywhere | Janky on mobile | `(hover: none)` guard |
| `font-size: 14px` on inputs | iOS zooms in | `font-size: 1rem` |
| No safe area padding | Content behind notch | `env(safe-area-inset-*)` |
| No mobile hamburger menu | Nav links inaccessible | Hamburger below `md` breakpoint |
| Menu stays open after nav | Stuck on overlay | Close on route change + escape |
