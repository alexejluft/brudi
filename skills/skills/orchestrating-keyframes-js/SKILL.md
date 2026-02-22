---
name: orchestrating-keyframes-js
description: Use when CSS @keyframes with fill-mode:forwards blocks JavaScript from changing properties. Shows how to remove animations before JS updates.
---

# Orchestrating @keyframes + JavaScript

## @keyframes fill-mode: forwards Locks Properties

```css
/* ❌ fill-mode: forwards permanently locks opacity */
@keyframes fadeOut { to { opacity: 0; } }
.box { animation: fadeOut 1s forwards; }
```
```js
element.style.opacity = '1';  // No effect — CSS keyframe wins over inline styles
```

CSS `@keyframes` have higher cascade priority than inline styles. `forwards` locks the final value permanently. JavaScript cannot override it.

## Solution: Remove Animation Before Setting Value

```js
// ✅ Remove the animation first, then set the value
element.addEventListener('animationend', () => {
  element.style.animation = 'none'
  element.style.opacity   = '1'     // Now it works
})
```

After `animationend` fires, remove the animation rule and JavaScript can now take control.

## Alternative: Use fill-mode: none

```css
/* ✅ Or: use fill-mode: none, set final state via JS */
.box { animation: fadeOut 1s none; }
```

With `fill-mode: none`, the animated property reverts to its CSS-defined or default value after the animation completes. JavaScript can then set it via inline styles.

## Common Pattern: Trigger → Animate → Update

```js
button.addEventListener('click', () => {
  element.classList.add('animating')  // Triggers @keyframes
})

element.addEventListener('animationend', () => {
  element.classList.remove('animating')  // Remove @keyframes rule
  element.style.opacity = '0'  // Now JS can change it
})
```

**Key rule:** Always remove the `@keyframes` animation before JavaScript tries to change the same property.
