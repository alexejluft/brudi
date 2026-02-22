---
name: orchestrating-will-change
description: Use when optimizing animations with will-change. Covers memory limits, dynamic activation patterns, and GPU constraints.
---

# Orchestrating Animations — will-change Performance Pattern

## Memory Limits: Only Dynamically, On 1–3 Elements

```css
/* ❌ On every card — 50 cards × ~2MB GPU memory = 100MB just for will-change */
.card { will-change: transform; }
```

```js
// ✅ Set just before animation, remove immediately after
card.addEventListener('mouseenter', () => {
  card.style.willChange = 'transform'
})
card.addEventListener('mouseleave', () => {
  card.style.willChange = 'auto'
})
```

## Hard Limits

- Never in a stylesheet — always via JavaScript
- Max 1–3 elements active simultaneously
- Remove immediately after the animation ends (`transitionend`, `animationend`)
- Only as a last resort after profiling confirms a problem

MDN: "will-change is intended as a last resort. Avoid using it too much."

## GPU Memory Constraint

Each element with `will-change: transform` reserves ~2MB of GPU memory for a "compositing layer." With 50 cards, that's 100MB — enough to slow down or crash lower-end devices.

```js
// Dynamic activation — only when needed
elements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.willChange = 'transform'
  })

  el.addEventListener('mouseleave', () => {
    el.style.willChange = 'auto'
  })

  el.addEventListener('transitionend', () => {
    el.style.willChange = 'auto'  // Clean up immediately
  })
})
```

## Decision Pattern

1. **Profile first** — use DevTools Performance tab to measure
2. **Apply will-change only if needed** — after confirming a real bottleneck
3. **Dynamic only** — set via JavaScript, remove on animation end
4. **Monitor on lower-end devices** — GPU memory is limited

Use will-change as a tuning knob for high-performance animations, not as a default optimization.
