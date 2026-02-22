# Reduced Motion Pattern

Apply to ALL animations. No exceptions.

## CSS Media Query
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## JavaScript Detection
```js
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Skip animations
}
```

## GSAP Integration
```js
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  // Disable all animations
  return () => {}; // cleanup
});
```
