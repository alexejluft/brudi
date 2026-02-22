---
name: building-accessibly
description: Use when ensuring keyboard navigation, screen reader support, or WCAG compliance. Critical for focus states, form labels, and color contrast.
---

# Building Accessibly

## Why It Matters

- 15% of people have disabilities
- Legal requirement in many contexts
- Better UX for everyone (keyboard users, mobile)

## Semantic HTML First

```html
<!-- ❌ Screen reader can't understand -->
<div onclick="submit()">Submit</div>

<!-- ✅ Built-in accessibility -->
<button onclick="submit()">Submit</button>
```

**Use native elements:** button, a, input, nav, main, header, footer

## Focus States (Never Remove)

```css
/* ❌ NEVER DO THIS */
*:focus { outline: none; }

/* ✅ Custom but visible */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

## Color Contrast

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |

**Tool:** WebAIM Contrast Checker

## Form Labels (Required)

```html
<!-- ❌ Placeholder is NOT a label -->
<input placeholder="Email">

<!-- ✅ Proper label -->
<label for="email">Email</label>
<input id="email" type="email">
```

## ARIA Basics

**First rule:** Don't use ARIA if native HTML works.

```html
<!-- Icon button needs label -->
<button aria-label="Close menu">✕</button>

<!-- Decorative content hidden -->
<span aria-hidden="true">🎨</span> Design

<!-- Dynamic announcements -->
<div aria-live="polite">3 results found</div>
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Quick Checklist

- [ ] All images have alt text
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus states visible
- [ ] All form inputs have labels
- [ ] Keyboard navigation works
- [ ] Reduced motion respected

## Common Mistakes

```html
<!-- ❌ Color as only indicator -->
<span style="color:red">Error</span>

<!-- ✅ Icon + text -->
<span style="color:red">❌ Error: Invalid email</span>
```

```css
/* ❌ Removing focus */
button:focus { outline: none; }
```
