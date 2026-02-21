---
name: testing-accessibility
description: Use when testing or reviewing components for WCAG 2.2 AA compliance, keyboard navigation, screen reader support, and EU EAA requirements.
---

# Testing Accessibility

## The Rule

**WCAG 2.2 AA is the minimum.** EU EAA (June 2025) makes it law. Automated tools catch ~40% of issues — always test keyboard navigation and screen readers manually. AI-generated code misses alt-text, focus styles, and ARIA patterns systematically.

---

## Alt Text

```html
<!-- ✅ Descriptive: what image communicates -->
<img src="chart.png" alt="Revenue grew 45% in Q4" />

<!-- ✅ Decorative: intentionally empty -->
<img src="divider.svg" alt="" role="presentation" />

<!-- ❌ WRONG: Generic or filename -->
<img src="chart.png" alt="image" />
```

---

## Focus Styles & Skip Links

```html
<!-- ✅ Skip link: first element in body -->
<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
<nav><!-- nav --></nav>
<main id="main"><!-- content --></main>
```

```css
/* ✅ Visible focus: never remove */
button:focus-visible { outline: 2px solid #4A90E2; }

/* ❌ WRONG: outline: none */
```

---

## ARIA Live Regions

```tsx
// ✅ Announces dynamic updates
<div aria-live="polite" aria-atomic="true">{statusMessage}</div>

// ✅ Form errors
<p role="alert">{error}</p>

// ❌ WRONG: No aria-live
```

---

## Semantic HTML Over ARIA

```tsx
// ✅ Semantic elements
<button onClick={handleClick}>Save</button>
<nav><a href="/about">About</a></nav>

// ❌ WRONG: div role="button" (no keyboard events)
```

---

## Automated Testing (axe-core + Playwright)

```tsx
import AxeBuilder from '@axe-core/playwright'

test('page is accessible', async ({ page }) => {
  await page.goto('/dashboard')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toHaveLength(0)
})

// Run on every critical page in CI
```

---

## Color Contrast & Reduced Motion

```css
/* ✅ 4.5:1 minimum for text */
body { color: #1a1a1a; background: #fafafa; }

/* ✅ Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms; transition-duration: 0.01ms; }
}

/* ❌ WRONG: Contrast < 4.5:1 or ignoring prefers-reduced-motion */
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Generic alt text ("image") | Screen readers give no context | Describe image purpose specifically |
| `outline: none` without replacement | Keyboard users can't navigate | Use `focus-visible` with visible ring |
| No skip link | Tab through entire nav every time | Add hidden skip-to-content link |
| `<div role="button">` | Missing keyboard events | Use semantic `<button>` |
| No `aria-live` on dynamic content | Screen readers miss updates | Add `aria-live="polite"` |
| Contrast < 4.5:1 | Fails WCAG AA, invisible text | Check with contrast checker |
| Ignoring `prefers-reduced-motion` | Motion sickness, vestibular | Wrap animations in media query |
| Touch targets < 24x24px | WCAG 2.2 fail, hard to tap | Minimum 24x24px (44px recommended) |
