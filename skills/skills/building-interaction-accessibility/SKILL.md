---
name: building-interaction-accessibility
description: Use when implementing keyboard navigation, focus styles, prefers-reduced-motion support, and ARIA interaction states. Ensures interactions are accessible and inclusive.
---

# Building Interaction Accessibility

## prefers-reduced-motion — Always

For implementation → see `~/.brudi/assets/patterns/reduced-motion.md`

**Not all animation must be removed** — fade and opacity transitions are
acceptable. Remove: translate, scale, rotate. Keep: opacity, color, shadow.

WCAG SC 2.3.3: motion animations must be disableable. `prefers-reduced-motion`
is the W3C-recommended technique. Vestibular disorders affect 70M+ people —
movement triggers dizziness and nausea.

---

## :focus vs :focus-visible

```css
/* ❌ Shows outline on mouse clicks too — irritates mouse users */
.button:focus { outline: 2px solid blue; }

/* ✅ Keyboard gets outline, mouse does not */
.button:focus { outline: none; }
.button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

**The browser decides:** keyboard navigation → `:focus-visible` applies.
Mouse click → does not apply. Input fields → always applies (user needs to
know where they're typing, regardless of input device).

**Never `outline: none` without `:focus-visible`** — keyboard users lose
all navigation feedback.

---

## Keyboard Navigation Patterns

Ensure all interactive elements are keyboard accessible:

- Tab order follows visual flow (use `tabindex` only when necessary)
- Focus indicators are always visible (minimum 3px outline)
- All buttons and links respond to Enter/Space keys
- Dropdowns/modals trap focus appropriately
- Escape key dismisses modals and dropdowns

---

## ARIA Interaction States

Include proper ARIA attributes for interactive components:

- `aria-pressed` for toggle buttons
- `aria-expanded` for disclosure widgets
- `aria-label` or `aria-labelledby` for unlabeled controls
- `role="button"` only when using non-button elements
- `aria-disabled` should match visual disabled state
- Announce state changes with `aria-live` regions when needed
