---
name: orchestrating-css-gsap-conflicts
description: Use when combining CSS transitions with GSAP on the same element. Explains the "one system per property" rule and how to use clearProps to avoid conflicts.
---

# Orchestrating CSS + GSAP — Avoiding Property Conflicts

## The Rule

CSS and JS animation systems fight over the same properties. The result is silent — animations run, but with wrong easing, or JS can't change state anymore. These bugs only appear at runtime.

## One System Per Property

```css
/* ❌ Both systems own transform — CSS wins, GSAP easing is ignored */
.box {
  transition: transform 0.5s ease;
}
```
```js
gsap.to(".box", { x: 200, ease: "power2.out" })
// Runs at CSS 'ease', not GSAP 'power2.out'
```

```css
/* ✅ CSS owns only what GSAP doesn't touch */
.box:hover {
  background-color: #1d4ed8;
  transition: background-color 0.2s ease;  /* not transform */
}
```
```js
gsap.to(".box", { x: 200, ease: "power2.out" })

// After GSAP animation: return control to CSS
gsap.to(".box", { x: 200, clearProps: "transform" })
```

**Rule:** CSS or GSAP per property — never both. `clearProps` hands control back to CSS after a GSAP animation completes.

## How clearProps Works

When you use `clearProps`, GSAP removes the inline style it set, returning the property to CSS-driven behavior:

```js
// GSAP animates transform
gsap.to(".box", {
  x: 200,
  duration: 0.5,
  ease: "power2.out",
  clearProps: "transform"  // Removes inline transform after animation
})
```

After the animation, `.box` no longer has `style="transform: ..."`, so any CSS `transition: transform` now works again.

## Multi-Property Conflicts

```js
// Specify multiple properties to clear
gsap.to(".box", {
  x: 200,
  opacity: 0.5,
  duration: 0.5,
  clearProps: "transform, opacity"  // Clear both
})

// Or clear all GSAP properties
gsap.to(".box", {
  x: 200,
  duration: 0.5,
  clearProps: "all"  // Removes everything GSAP set
})
```
