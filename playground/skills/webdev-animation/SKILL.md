---
name: webdev-animation
description: Master web animations with GSAP ScrollTrigger, Lenis smooth scroll, CSS animations, and micro-interactions. Covers timing hierarchy, easing, stagger patterns, and accessibility (prefers-reduced-motion). Use when adding scroll animations, page transitions, or interactive feedback.
version: 0.1.0
---

# WebDev Animation — Motion That Matters

Create animations that enhance UX, not distract from it. This skill covers GSAP, Lenis, CSS animations, timing principles, and accessibility requirements.

## Core Principles

### 1. Animation Serves Purpose
Every animation must answer: **"What does this communicate?"**
- Feedback (button pressed)
- State change (tab switched)
- Spatial relationship (where did this come from?)
- Attention (look here)

### 2. Performance First
Only animate properties that don't trigger layout:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ❌ `width`, `height` (triggers layout)
- ❌ `top`, `left`, `right`, `bottom` (triggers layout)
- ❌ `margin`, `padding` (triggers layout)

### 3. Respect User Preferences
Always implement `prefers-reduced-motion`. Not optional.

---

## Timing Hierarchy

### ⚡ Micro (100-200ms) — Instant Feedback

**Use for:**
- Button hover/active states
- Toggles, checkboxes
- Icon changes
- Color transitions
- Small movements (few pixels)

```javascript
// Button press
gsap.to('.button', { scale: 0.95, duration: 0.1 });

// Toggle
gsap.to('.toggle-knob', { x: 24, duration: 0.15 });

// Hover
gsap.to('.card', { y: -4, duration: 0.2 });
```

**Why fast:** User expects immediate response. Over 200ms feels laggy.

### 🚀 Standard (200-400ms) — UI Transitions

**Use for:**
- Section reveals on scroll
- Card entrances
- List item staggers
- Navigation changes
- Modal appearances
- Content fades

```javascript
// Card reveal
gsap.from('.card', { 
  y: 40, 
  opacity: 0, 
  duration: 0.35,
  ease: 'power2.out'
});

// Section title
gsap.from('.section-title', { 
  y: 50, 
  opacity: 0, 
  duration: 0.4 
});
```

**Why medium:** Visible but doesn't make user wait.

### 🎬 Dramatic (400-800ms) — First Impressions

**Use for:**
- Hero sections (first thing user sees)
- Page transitions
- Large modals
- Onboarding sequences
- "Wow" moments

```javascript
// Hero title with character reveal
gsap.from('.hero-title .char', { 
  y: 100, 
  opacity: 0, 
  duration: 0.8,
  stagger: 0.03,
  ease: 'power4.out'
});

// Page transition
gsap.to('.page', { 
  opacity: 0, 
  duration: 0.5 
});
```

**Why slow:** Establishes atmosphere. Used sparingly.

### ❌ Too Slow (>800ms) — Avoid

- User feels blocked
- "Why is this taking so long?"
- Looks like performance problem

---

## Stagger Timing

Stagger = delay between each element in a group.

| Context | Stagger | Example |
|---------|---------|---------|
| List items | 30-50ms | Navigation links |
| Cards | 50-80ms | Grid of cards |
| Hero chars | 30-40ms | Title character reveal |
| Dramatic | 80-100ms | Hero sequence |

```javascript
// Fast stagger for lists
gsap.from('.nav-item', { 
  y: 20, 
  opacity: 0,
  duration: 0.3,
  stagger: 0.04  // 40ms between each
});

// Slower stagger for cards
gsap.from('.card', {
  y: 40,
  opacity: 0,
  duration: 0.4,
  stagger: 0.08  // 80ms between each
});
```

**Rule:** Stagger should NEVER exceed 150ms. Otherwise it drags.

---

## Easing

### When to Use What

| Situation | Easing | GSAP | CSS |
|-----------|--------|------|-----|
| Element ENTERS | ease-out | `power2.out` | `ease-out` |
| Element EXITS | ease-in | `power2.in` | `ease-in` |
| Movement within screen | ease-in-out | `power2.inOut` | `ease-in-out` |
| Playful/bouncy | back | `back.out(1.4)` | - |
| NEVER for movement | linear | ❌ | ❌ |

### GSAP Easing Reference

```javascript
// Subtle
'power1.out'   // Barely noticeable curve
'power2.out'   // Standard, professional

// Pronounced
'power3.out'   // Noticeable deceleration
'power4.out'   // Dramatic deceleration

// Special
'back.out(1.4)'  // Overshoots then settles
'elastic.out(1, 0.3)'  // Springy
'expo.out'     // Extreme deceleration
```

**My default:** `power2.out` for most things, `power3.out` for hero elements.

---

## GSAP ScrollTrigger

### Basic Setup

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Core Concepts

**trigger:** Element that activates the animation
**start/end:** When animation starts/ends relative to viewport
**scrub:** Binds animation to scroll position

```javascript
gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',    // trigger top hits viewport center
    end: 'bottom center',   // trigger bottom hits viewport center
    scrub: true             // animation follows scroll
  }
});
```

### Start/End Syntax

```
'top center'     // element top, viewport center
'top 80%'        // element top, 80% down viewport
'top top'        // element top, viewport top
'center center'  // element center, viewport center
'bottom bottom'  // element bottom, viewport bottom
```

### Scrub Values

```javascript
scrub: true      // Instant: animation jumps to scroll position
scrub: 0.5       // 0.5 second smooth delay
scrub: 1         // 1 second smooth delay (recommended)
scrub: 2         // 2 second delay (very smooth, laggy feel)
```

### Pin (Fix Element During Scroll)

```javascript
gsap.to('.hero-content', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=500',       // 500px of scroll
    pin: true,          // Fix .hero during animation
    scrub: 1
  }
});
```

### Toggle Actions

```javascript
scrollTrigger: {
  toggleActions: 'play pause resume reverse'
  //              onEnter onLeave onEnterBack onLeaveBack
}

// Common patterns:
toggleActions: 'play none none none'     // Play once, never reverse
toggleActions: 'play none none reverse'  // Reverse when scrolling back up
toggleActions: 'restart none none none'  // Restart every time
```

### Batch Animations

```javascript
ScrollTrigger.batch('.card', {
  onEnter: (elements) => {
    gsap.from(elements, {
      y: 40,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08
    });
  },
  start: 'top 85%'  // Trigger when card top hits 85% down viewport
});
```

### Performance Tips

1. **Use `will-change` sparingly** — only on elements being animated
2. **Batch similar animations** — ScrollTrigger.batch()
3. **Kill unused triggers** — ScrollTrigger.kill() on route change
4. **Reduce markers in production** — `markers: false`

```javascript
// Cleanup on page change (important for SPAs)
ScrollTrigger.getAll().forEach(trigger => trigger.kill());
```

---

## Lenis Smooth Scroll

### The Problem

Browser scroll jumps directly to target position. No weight, no inertia, no physics.

### The Solution: LERP

**LERP = Linear Interpolation** — the core concept.

```
newValue = currentValue + (targetValue - currentValue) * lerp
```

- `lerp: 0.1` = 10% of remaining distance per frame → very smooth
- `lerp: 0.3` = 30% per frame → balanced
- `lerp: 1.0` = instant (like native scroll)

### Basic Setup

```javascript
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const lenis = new Lenis({
  lerp: 0.1,           // Smooth factor (lower = smoother)
  duration: 1.2,       // IGNORED if lerp is set
  smoothWheel: true,   // Enable for wheel events
  autoRaf: true        // Automatic RAF loop
});
```

**Important:** `duration` and `easing` are OVERRIDDEN by `lerp`. Don't mix them.

### GSAP Integration (Recommended)

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  autoRaf: false  // MUST be false when using GSAP ticker
});

// Lenis informs ScrollTrigger of scroll position
lenis.on('scroll', ScrollTrigger.update);

// Lenis runs in GSAP ticker (perfect sync)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP's built-in lag smoothing
gsap.ticker.lagSmoothing(0);
```

### Useful Properties

```javascript
lenis.scroll        // Current interpolated scroll position
lenis.targetScroll  // Where user wants to go
lenis.velocity      // Scroll speed (for effects)
lenis.progress      // 0 to 1 (for progress bars)
lenis.direction     // 1 = down, -1 = up
lenis.isScrolling   // 'smooth' | 'native' | false
```

### Useful Methods

```javascript
// Programmatic scroll
lenis.scrollTo('#section', { offset: -100, duration: 2 });
lenis.scrollTo(500, { immediate: true });  // No smooth

// Pause for modals
lenis.stop();
lenis.start();

// Cleanup (important!)
lenis.destroy();
```

### Nested Scrolling

For elements that should scroll natively (modals, dropdowns):

```html
<div data-lenis-prevent>
  <!-- Native scroll inside here -->
</div>
```

---

## CSS Scroll-Driven Animations

Native CSS animations bound to scroll position — no JavaScript.

### Basic Syntax

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: reveal linear forwards;
  animation-timeline: view();  /* Binds to scroll */
  animation-range: entry 0% entry 100%;
}
```

### Timeline Types

```css
/* Scroll progress of entire page */
animation-timeline: scroll();

/* Element's visibility in viewport */
animation-timeline: view();
```

### Animation Range

```css
/* When element enters viewport */
animation-range: entry 0% entry 100%;

/* While element is fully visible */
animation-range: contain 0% contain 100%;

/* When element exits viewport */
animation-range: exit 0% exit 100%;

/* Full journey through viewport */
animation-range: cover 0% cover 100%;
```

### Scroll Progress Bar (Pure CSS)

```css
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: var(--color-primary);
  transform-origin: left;
  animation: grow-progress linear forwards;
  animation-timeline: scroll();
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

---

## Micro-Interactions

### Button States

```css
.button {
  transition: all 0.15s ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Loading States

```css
.loading-dot {
  animation: pulse 1.4s ease-in-out infinite;
}

.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
```

### Shimmer Effect

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-light) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Accessibility: prefers-reduced-motion

### Why It Matters
- Vestibular disorders → motion sickness, dizziness
- Epilepsy → flashing can trigger seizures
- Some users find motion distracting
- Battery saving on mobile

### CSS Implementation

```css
/* Opt-in approach (recommended) */
.element {
  /* No animation by default */
}

@media (prefers-reduced-motion: no-preference) {
  .element {
    animation: slide 0.5s ease-out;
  }
}
```

### Global Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### JavaScript Detection

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable Lenis
  lenis.destroy();
  
  // Use instant GSAP animations
  gsap.to('.element', { opacity: 1, duration: 0 });
}
```

### GSAP matchMedia

```javascript
let mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Full animations
  gsap.from('.hero', { y: 100, opacity: 0, duration: 1 });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Opacity only, no movement
  gsap.from('.hero', { opacity: 0, duration: 0.3 });
});
```

### What's OK with Reduced Motion

✅ **Allowed:**
- Opacity fades
- Color transitions
- Very small movements (2-3px)

❌ **Avoid:**
- Large translations
- Rotation
- Scale animations
- Parallax effects
- Smooth scroll (Lenis)
- Auto-playing anything

---

## Common Patterns

### Reveal on Scroll

```javascript
gsap.from('.section', {
  y: 60,
  opacity: 0,
  duration: 0.5,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
    toggleActions: 'play none none none'
  }
});
```

### Parallax Background

```javascript
gsap.to('.parallax-bg', {
  y: -200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  }
});
```

### Text Character Reveal

```javascript
// Split text into characters first (use SplitType or similar)
gsap.from('.title .char', {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.03,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.title',
    start: 'top 80%'
  }
});
```

### Horizontal Scroll Section

```javascript
const container = document.querySelector('.horizontal-container');
const sections = gsap.utils.toArray('.horizontal-section');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    end: () => '+=' + container.offsetWidth
  }
});
```

---

## Anti-Patterns

### ❌ Animating Layout Properties

```javascript
// BAD - triggers layout recalculation
gsap.to('.element', { width: 200, height: 100 });

// GOOD - uses transform (GPU accelerated)
gsap.to('.element', { scaleX: 1.5, scaleY: 1.2 });
```

### ❌ Too Many Simultaneous Animations

```javascript
// BAD - everything animates at once
gsap.from('.card', { y: 40, opacity: 0 });  // No stagger

// GOOD - staged reveals
gsap.from('.card', { y: 40, opacity: 0, stagger: 0.08 });
```

### ❌ Animation Blocking Content

```javascript
// BAD - user waits 2 seconds
gsap.from('.hero', { duration: 2, opacity: 0 });

// GOOD - content visible quickly, animation enhances
gsap.from('.hero', { duration: 0.6, y: 30, opacity: 0 });
```

### ❌ Ignoring Reduced Motion

```javascript
// BAD - no accessibility consideration
new Lenis({ lerp: 0.1 });

// GOOD - respects user preference
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new Lenis({ lerp: 0.1 });
}
```

---

## Quick Reference

### Timing

| Type | Duration | Stagger | Use |
|------|----------|---------|-----|
| Micro | 100-200ms | - | Buttons, toggles |
| Standard | 200-400ms | 30-80ms | Cards, sections |
| Dramatic | 400-800ms | 40-100ms | Hero, transitions |

### Easing

| Situation | GSAP |
|-----------|------|
| Entering | `power2.out` |
| Exiting | `power2.in` |
| Moving | `power2.inOut` |
| Playful | `back.out(1.4)` |

### ScrollTrigger Start Points

| Position | Meaning |
|----------|---------|
| `top top` | Element top at viewport top |
| `top center` | Element top at viewport center |
| `top 80%` | Element top at 80% down viewport |
| `center center` | Element center at viewport center |

---

**Remember:** The best animation is one the user doesn't consciously notice. It just feels *right*.
