---
name: webdev-a11y
description: Build accessible websites with WCAG guidelines, semantic HTML, ARIA, and keyboard navigation. Covers color contrast, focus states, screen reader support, and reduced motion. Use when building inclusive interfaces or fixing accessibility issues.
version: 0.1.0
---

# WebDev Accessibility — Web for Everyone

Build websites that work for everyone, regardless of ability. This skill covers WCAG guidelines, semantic HTML, ARIA, and testing approaches.

## Why Accessibility Matters

- **15% of world population** has a disability
- **SEO boost** — Google rewards accessible sites
- **Better UX for everyone** — keyboard users, mobile, slow connections
- **Legal requirement** — WCAG 2.1 AA often mandated

> **Accessibility is not a feature. It's a baseline.**

---

## Semantic HTML First

The foundation of accessibility. Screen readers understand semantic HTML.

### Use Native Elements

```html
<!-- ❌ BAD — Screen readers can't understand this -->
<div class="header">
  <div class="nav">
    <div onclick="navigate()">Home</div>
  </div>
</div>

<!-- ✅ GOOD — Semantic and accessible -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

### Interactive Elements

```html
<!-- ❌ BAD — No keyboard support, no role -->
<div onclick="submit()">Submit</div>

<!-- ✅ GOOD — Focusable, keyboard accessible, has role -->
<button onclick="submit()">Submit</button>
```

### Landmark Regions

```html
<header>  <!-- role="banner" implicit -->
<nav>     <!-- role="navigation" implicit -->
<main>    <!-- role="main" implicit -->
<aside>   <!-- role="complementary" implicit -->
<footer>  <!-- role="contentinfo" implicit -->
```

### Heading Hierarchy

```html
<!-- ✅ Proper hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

<!-- ❌ Skipping levels -->
<h1>Title</h1>
<h3>Subsection</h3>  <!-- Where's h2? -->
```

---

## Color Contrast

### WCAG Requirements

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+ or 14px+ bold) | 3:1 |
| UI components | 3:1 |

### Testing

```css
/* ❌ Too low contrast: 2.4:1 */
color: #666;
background: #1a1a1a;

/* ✅ Good contrast: 7.1:1 */
color: #a1a1aa;
background: #1a1a1a;
```

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (inspect element → color picker shows ratio)

### Don't Rely on Color Alone

```html
<!-- ❌ Color is the only indicator -->
<span style="color: red;">Error</span>

<!-- ✅ Icon + text + color -->
<span style="color: red;">❌ Error: Invalid email</span>
```

---

## Focus States

Keyboard users MUST see where they are. Never remove focus without alternative.

### ❌ Never Do This

```css
/* Removes all focus indication */
*:focus {
  outline: none;
}
```

### ✅ Custom Focus Styles

```css
/* Modern approach: focus-visible */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Remove outline for mouse clicks, keep for keyboard */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus Order

Elements should be focusable in logical order. Don't break this with:
- Arbitrary `tabindex` values
- CSS that changes visual order but not DOM order

```html
<!-- ❌ Confusing tab order -->
<button tabindex="3">Third</button>
<button tabindex="1">First</button>
<button tabindex="2">Second</button>

<!-- ✅ Natural order follows DOM -->
<button>First</button>
<button>Second</button>
<button>Third</button>
```

---

## Images

### Alt Text Rules

| Image Type | Alt Text |
|------------|----------|
| Informative | Describe the content |
| Decorative | `alt=""` (empty) |
| Complex (charts) | Describe + link to full description |
| Text in image | Include the text |

```html
<!-- Informative image -->
<img src="dog.jpg" alt="Golden Retriever playing in park" />

<!-- Decorative image (empty alt) -->
<img src="divider.svg" alt="" />

<!-- Image as link -->
<a href="/products">
  <img src="logo.png" alt="Company Name - Go to products" />
</a>

<!-- Complex image -->
<img src="chart.png" alt="Sales chart showing 40% growth. Full description below." />
```

### Icon Buttons

```html
<!-- ❌ No accessible name -->
<button>✕</button>

<!-- ✅ With aria-label -->
<button aria-label="Close menu">✕</button>

<!-- ✅ Or visually hidden text -->
<button>
  <span aria-hidden="true">✕</span>
  <span class="sr-only">Close menu</span>
</button>
```

---

## Forms

### Always Use Labels

```html
<!-- ❌ Placeholder is not a label -->
<input placeholder="Email" />

<!-- ✅ Explicit label -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- ✅ Implicit label (wrapping) -->
<label>
  Email
  <input type="email" />
</label>
```

### Error Messages

```html
<label for="email">Email</label>
<input 
  id="email" 
  type="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<p id="email-error" role="alert">
  Please enter a valid email address
</p>
```

### Required Fields

```html
<label for="name">
  Name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input id="name" required aria-required="true" />
```

---

## ARIA

### First Rule of ARIA

> **Don't use ARIA if you can use native HTML.**

Native HTML has built-in accessibility. ARIA is for when HTML isn't enough.

### Common ARIA Attributes

#### aria-label

Provides accessible name when visible text isn't sufficient:

```html
<button aria-label="Close dialog">✕</button>
<nav aria-label="Main navigation">...</nav>
```

#### aria-labelledby

References another element as the label:

```html
<h2 id="cart-heading">Shopping Cart</h2>
<div role="region" aria-labelledby="cart-heading">
  <!-- Cart contents -->
</div>
```

#### aria-describedby

Provides additional description:

```html
<input 
  id="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">Must be at least 8 characters</p>
```

#### aria-hidden

Hides from assistive technology:

```html
<!-- Decorative icon, text provides meaning -->
<span aria-hidden="true">🎨</span> Design
```

#### aria-live

Announces dynamic content changes:

```html
<!-- polite: waits for user pause -->
<div aria-live="polite">3 results found</div>

<!-- assertive: interrupts immediately -->
<div aria-live="assertive">Error: Connection lost</div>
```

#### aria-expanded

For expandable content:

```html
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<div id="menu" hidden>...</div>
```

---

## Keyboard Navigation

### All Interactive Elements Must Be Keyboard Accessible

```javascript
// ❌ Only works with mouse
element.addEventListener('click', handler)

// ✅ Works with keyboard too
element.addEventListener('click', handler)
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handler(e)
  }
})
```

### Focus Trapping for Modals

```javascript
// When modal opens, trap focus inside
const modal = document.querySelector('.modal')
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)
const firstElement = focusableElements[0]
const lastElement = focusableElements[focusableElements.length - 1]

// Focus first element
firstElement.focus()

// Trap focus
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
  
  // Close on Escape
  if (e.key === 'Escape') {
    closeModal()
  }
})
```

---

## Reduced Motion

Respect user preferences for reduced motion.

### CSS

```css
/* Opt-in approach */
.animated {
  /* No animation by default */
}

@media (prefers-reduced-motion: no-preference) {
  .animated {
    animation: slide 0.5s ease-out;
  }
}
```

### JavaScript

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // Disable smooth scroll
  // Disable animations
  // Use instant transitions
}
```

### What's OK with Reduced Motion

✅ **Allowed:**
- Opacity fades (subtle)
- Color transitions
- Very small movements (2-3px)

❌ **Avoid:**
- Large translations
- Rotation
- Scale animations
- Parallax
- Auto-playing content

---

## Screen Reader Only Text

Visually hide content but keep it accessible:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg>...</svg>
  <span class="sr-only">Search</span>
</button>
```

---

## Testing

### Automated Tools

| Tool | Type |
|------|------|
| **Lighthouse** | Built into Chrome DevTools |
| **axe DevTools** | Browser extension |
| **WAVE** | Browser extension |
| **eslint-plugin-jsx-a11y** | Linting |

### Manual Testing

1. **Keyboard only:** Navigate entire site with Tab, Enter, Escape
2. **Screen reader:** Test with VoiceOver (Mac) or NVDA (Windows)
3. **Zoom:** Zoom to 200%, check nothing breaks
4. **Color:** Check in grayscale mode
5. **Motion:** Enable reduced motion, check animations

### Testing Checklist

```
☐ All images have appropriate alt text
☐ Color contrast meets WCAG AA (4.5:1)
☐ Focus states are visible
☐ All form inputs have labels
☐ Semantic HTML is used
☐ Keyboard navigation works
☐ No keyboard traps
☐ Page has proper heading hierarchy
☐ ARIA is used correctly (when necessary)
☐ Dynamic content is announced
☐ Reduced motion is respected
```

---

## Quick Reference

### Common ARIA Roles

| Role | Use |
|------|-----|
| `button` | Clickable element (prefer `<button>`) |
| `link` | Navigation (prefer `<a>`) |
| `dialog` | Modal windows |
| `alert` | Important messages |
| `navigation` | Nav regions (prefer `<nav>`) |
| `region` | Landmark sections |
| `tablist`, `tab`, `tabpanel` | Tab interfaces |

### Common ARIA States

| Attribute | Use |
|-----------|-----|
| `aria-expanded` | Expandable content |
| `aria-selected` | Selected item in list |
| `aria-checked` | Checkbox state |
| `aria-disabled` | Disabled state |
| `aria-current` | Current item in set |
| `aria-invalid` | Form validation error |

---

**Remember:** Accessibility isn't just about compliance. It's about making the web work for everyone. When in doubt, test with real assistive technology.
