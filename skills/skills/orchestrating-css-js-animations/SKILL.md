---
name: orchestrating-css-js-animations
description: Use when combining CSS animations/transitions with GSAP or Framer Motion on the same page or element. AI consistently creates conflicts — CSS transition overrides GSAP easing, fill-mode:forwards blocks JS, will-change on everything kills performance.
---

# Orchestrating CSS + JS Animations

## The Rule

CSS and JS animation systems fight over the same properties. The result is
silent — animations run, but with wrong easing, or JS can't change state
anymore. These bugs only appear at runtime.

---

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

**Rule:** CSS or GSAP per property — never both. `clearProps` hands control
back to CSS after a GSAP animation completes.

---

## @keyframes fill-mode: forwards Locks Properties

```css
/* ❌ fill-mode: forwards permanently locks opacity */
@keyframes fadeOut { to { opacity: 0; } }
.box { animation: fadeOut 1s forwards; }
```
```js
element.style.opacity = '1';  // No effect — CSS keyframe wins over inline styles
```

CSS `@keyframes` have higher cascade priority than inline styles. `forwards`
locks the final value permanently. JavaScript cannot override it.

```js
// ✅ Remove the animation first, then set the value
element.addEventListener('animationend', () => {
  element.style.animation = 'none'
  element.style.opacity   = '1'     // Now it works
})
```

```css
/* ✅ Or: use fill-mode: none, set final state via JS */
.box { animation: fadeOut 1s none; }
```

---

## will-change — Only Dynamically, On 1–3 Elements

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

**Hard limits:**
- Never in a stylesheet — always via JavaScript
- Max 1–3 elements active simultaneously
- Remove immediately after the animation ends (`transitionend`, `animationend`)
- Only as a last resort after profiling confirms a problem

MDN: "will-change is intended as a last resort. Avoid using it too much."

---

## Decision Rule: CSS vs GSAP vs WAAPI

```
Simple hover, state transition, no JS control needed
  → CSS transition / @keyframes
  .button:hover { transform: scale(1.05); }

Complex timeline, sequence, scroll-driven, SVG
  → GSAP
  gsap.timeline().to(...).to(...).to(...)

JS control needed, no library budget
  → Web Animations API
  element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 })
```

### On the same page — each in its lane

```js
// Button hover → CSS (zero JS cost)
// .button { transition: transform 0.15s ease-out; }

// Intro sequence → GSAP timeline
const tl = gsap.timeline()
tl.to(".heading", { opacity: 1, y: 0, duration: 0.6 })
  .to(".image",   { scale: 1,   duration: 0.4 }, "-=0.2")
  .to(".text",    { x: 0, stagger: 0.1 })

// Scroll parallax → GSAP ScrollTrigger
gsap.to(".bg", {
  yPercent: -30,
  ease: "none",
  scrollTrigger: { trigger: ".section", scrub: 1 }
})
```

CSS and GSAP can coexist — as long as they don't both own the same property
on the same element at the same time.

---

## Framer Motion + CSS Conflict

Same rule applies. Framer Motion sets transforms via inline styles.
CSS `transition: transform` interferes with Framer's physics.

```css
/* ❌ Conflicts with Framer Motion spring physics */
.card { transition: transform 0.3s ease-out; }
```

```jsx
// ✅ All transition logic inside Framer Motion
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 100 }}
/>
```

```css
/* ✅ CSS only on properties Framer doesn't animate */
.card {
  transition: background-color 0.2s ease;
}
```
