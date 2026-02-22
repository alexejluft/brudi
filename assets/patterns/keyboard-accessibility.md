# Keyboard Accessibility Pattern

## CSS: Focus Visible Styling
```css
:focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
  border-radius: 4px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

## JavaScript: Key Handlers
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Tab navigation
  }
  if (e.key === ' ' || e.key === 'Enter') {
    // Space/Enter activation
  }
  if (e.key === 'Escape') {
    // Close/cancel
  }
});
```

## ARIA Patterns
```html
<!-- Semantic roles and navigation -->
<button role="button" tabindex="0" aria-label="Close">×</button>
<div role="menu" aria-label="Navigation">
  <a href="#" role="menuitem" tabindex="-1">Item</a>
</div>
```
