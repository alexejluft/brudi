# ESLint Rule Examples - Detailed

This document shows exactly what ESLint will catch and reject.

---

## Rule 1: `brudi/no-transition-all`

### What Gets Flagged

#### Tailwind `transition-all` class
```jsx
// ❌ VIOLATION DETECTED
<button className="transition-all hover:scale-110">Click</button>

// Error message:
// Line 1: Use specific transition properties (transform, box-shadow, background-color).
//         'transition: all' causes performance issues.
```

#### Inline style with `transition: all`
```jsx
// ❌ VIOLATION DETECTED
<div style={{ transition: 'all 200ms ease-out' }}>Content</div>

// Error message at `transition` property:
// Use specific transition properties...
```

#### CSS-in-JS style object
```javascript
// ❌ VIOLATION DETECTED
const containerStyle = {
  transition: 'all 300ms',  // ← Flagged
  backgroundColor: '#fff',
}
```

### Correct Patterns

#### Specific properties
```jsx
✅ CORRECT
<button className="transition-transform duration-200 hover:scale-110">
  Click
</button>

<div style={{ transition: 'transform 200ms ease-out' }}>
  Content
</div>
```

#### Multiple specific transitions
```javascript
✅ CORRECT
const style = {
  transition: 'transform 200ms, box-shadow 150ms, background-color 100ms',
}
```

#### Tailwind specific classes
```jsx
✅ CORRECT
<button className="transition-opacity duration-200">Fade</button>
<button className="transition-colors duration-150">Color shift</button>
<button className="transition-transform duration-300">Scale</button>
```

---

## Rule 2: `brudi/no-gsap-from-in-react`

### What Gets Flagged

#### Direct gsap.from() call
```javascript
// ❌ VIOLATION DETECTED
useEffect(() => {
  gsap.from('.hero', { opacity: 0, duration: 0.8 })
  //   ^^^^
  // Error: Use gsap.set() + gsap.to() instead of gsap.from().
  //        gsap.from() causes FOUC in React.
}, [])
```

#### Timeline.from() call
```javascript
// ❌ VIOLATION DETECTED
const timeline = gsap.timeline()
timeline.from('.card', { y: 20, opacity: 0 })
//       ^^^^
// Error: Use gsap.set() + gsap.to() instead of gsap.from()...
```

#### Shorthand timeline
```javascript
// ❌ VIOLATION DETECTED
const tl = gsap.timeline()
tl.from('.item', { x: -50 })
// ^^  Flagged because name contains "tl"
```

### Correct Patterns

#### Set + To pattern
```javascript
✅ CORRECT
useEffect(() => {
  gsap.set('.hero', { opacity: 0 })
  gsap.to('.hero', { opacity: 1, duration: 0.8 })
}, [])
```

#### Timeline with set
```javascript
✅ CORRECT
const tl = gsap.timeline()
tl.set('.card', { y: 20, opacity: 0 })
  .to('.card', { y: 0, opacity: 1, duration: 0.4 }, 0)
```

#### fromTo (explicit start/end)
```javascript
✅ CORRECT - gsap.fromTo shows start and end clearly
gsap.fromTo('.hero',
  { opacity: 0, y: -20 },
  { opacity: 1, y: 0, duration: 0.8 }
)
```

#### Context method (cleanup-aware)
```javascript
✅ CORRECT
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.set('.item', { opacity: 0 })
    gsap.to('.item', { opacity: 1 })
  })
  return () => ctx.revert()
}, [])
```

---

## Rule 3: `brudi/scrolltrigger-cleanup-required`

### What Gets Flagged

#### Missing cleanup in useEffect with ScrollTrigger
```javascript
// ❌ VIOLATION DETECTED
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.to('.hero', {
    scrollTrigger: {  // ← ScrollTrigger detected
      trigger: '.hero',
      start: 'top center',
    },
    opacity: 1,
  })
  // No cleanup function!
}, [])

// Error: ScrollTrigger must be cleaned up in useEffect return.
//        Add cleanup to prevent memory leaks.
```

#### ScrollTrigger.create() without cleanup
```javascript
// ❌ VIOLATION DETECTED
useEffect(() => {
  ScrollTrigger.create({
    trigger: '.target',
    onEnter: () => console.log('enter'),
  })
  // Missing cleanup
}, [])

// Error: ScrollTrigger must be cleaned up in useEffect return...
```

### Correct Patterns

#### gsap.context() pattern (recommended)
```javascript
✅ CORRECT
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.to('.hero', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
      },
      opacity: 1,
    })
  })

  return () => ctx.revert()  // ← Cleanup
}, [])
```

#### Explicit cleanup with forEach
```javascript
✅ CORRECT
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.to('.hero', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top center',
    },
    opacity: 1,
  })

  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill())  // ← Cleanup
  }
}, [])
```

#### With stagger timeline
```javascript
✅ CORRECT
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.cards',
        start: 'top center',
      },
    })

    gsap.to('.card', {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
    })
  })

  return () => ctx.revert()  // ← Cleanup all triggers in context
}, [])
```

---

## Rule 4: `brudi/no-layout-animation`

### What Gets Flagged

#### Animating width with GSAP
```javascript
// ❌ VIOLATION DETECTED
gsap.to('.sidebar', {
  width: '300px',  // ← Flagged (layout property)
  duration: 0.3,
})

// Error: Animate transform (translateX/Y, scale) instead of
//        layout properties (margin, width, height, padding...).
//        Layout animations cause jank and repaints.
```

#### Animating margin
```javascript
// ❌ VIOLATION DETECTED
gsap.to('.card', {
  margin: '16px',  // ← Flagged
  duration: 0.2,
})
```

#### Animating padding
```javascript
// ❌ VIOLATION DETECTED
gsap.to('.container', {
  paddingTop: '24px',     // ← Flagged
  paddingBottom: '24px',  // ← Flagged
  duration: 0.3,
})
```

#### Animating height in CSS
```css
/* ❌ VIOLATION DETECTED */
.sidebar {
  transition: height 200ms, width 200ms;
  /* Both height and width trigger layout recalculation */
}
```

#### Animating position (top, left, right, bottom)
```javascript
// ❌ VIOLATION DETECTED
gsap.to('.modal', {
  top: '50px',    // ← Flagged (layout property)
  left: '100px',  // ← Flagged
  duration: 0.4,
})
```

### Correct Patterns

#### Use transform instead of width
```javascript
✅ CORRECT - Use scaleX or translateX instead
gsap.to('.sidebar', {
  x: 300,  // translateX
  duration: 0.3,
})

// Or scale outward
gsap.to('.sidebar', {
  scaleX: 1.2,
  transformOrigin: 'left center',
  duration: 0.3,
})
```

#### Replace margin animations
```javascript
✅ CORRECT - Use transform
gsap.to('.card', {
  y: 16,  // translateY instead of margin
  duration: 0.2,
})
```

#### Replace padding animations
```javascript
✅ CORRECT - Scale the content inside
gsap.to('.container', {
  scale: 1.1,  // Grows all content including visual padding
  duration: 0.3,
})

// Or animate child element position
gsap.to('.container > *', {
  y: 24,  // translateY child elements
  duration: 0.3,
})
```

#### Replace position animations
```javascript
✅ CORRECT - Use transform
gsap.to('.modal', {
  x: 100,  // translateX
  y: 50,   // translateY
  duration: 0.4,
})
```

#### Multiple transform properties (GPU accelerated)
```javascript
✅ CORRECT - Combine transforms
gsap.to('.element', {
  x: 50,        // translateX
  y: 100,       // translateY
  scale: 1.05,  // scaleX + scaleY
  rotation: 5,  // rotateZ
  opacity: 0.8,
  duration: 0.4,
})
```

#### Size changes using scale
```javascript
✅ CORRECT - Use scale instead of width/height
gsap.to('.growing-box', {
  scale: 2,  // Doubles width and height from center
  duration: 0.5,
})

// Or with transform origin
gsap.to('.box-from-top', {
  scaleY: 1.5,
  transformOrigin: 'top center',
  duration: 0.4,
})
```

#### Stagger grid without layout animation
```javascript
✅ CORRECT
gsap.to('.grid-item', {
  opacity: 1,     // No layout cost
  y: 0,           // translateY (GPU)
  rotation: 0,    // Rotated in place
  scale: 1,       // Scaled at center
  duration: 0.4,
  stagger: 0.1,
})
```

---

## Combined Example: Complete Animation Pattern

### ❌ VIOLATION-HEAVY Code

```javascript
useEffect(() => {
  gsap.from('.hero', {  // ❌ Rule 2: gsap.from()
    opacity: 0,
    width: '200px',  // ❌ Rule 4: layout animation
    duration: 0.8,
  })

  gsap.to('.card', {
    scrollTrigger: {
      trigger: '.cards',
      start: 'top center',
    },
    transition: 'all 200ms',  // ❌ Rule 1: transition-all
    height: '500px',          // ❌ Rule 4: layout animation
    duration: 0.6,
  })
  // ❌ Rule 3: Missing cleanup
}, [])

return (
  <button className="transition-all duration-200">
    {/* ❌ Rule 1: Tailwind transition-all */}
    Hover me
  </button>
)
```

### ✅ CORRECT Code

```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Set initial state
    gsap.set('.hero', { opacity: 0, scaleX: 0.8 })

    // Animate to visible
    gsap.to('.hero', {  // ✅ set + to pattern
      opacity: 1,
      scaleX: 1,        // ✅ transform instead of width
      duration: 0.8,
    })

    // ScrollTrigger animation
    gsap.to('.card', {
      scrollTrigger: {
        trigger: '.cards',
        start: 'top center',
      },
      opacity: 1,       // ✅ no transition property needed
      y: 0,             // ✅ transform instead of height
      duration: 0.6,
    })
  })

  return () => ctx.revert()  // ✅ cleanup
}, [])

return (
  <button className="transition-transform duration-200 hover:scale-110">
    {/* ✅ specific transition property */}
    Hover me
  </button>
)
```

---

## Testing Your Rules

### Run ESLint
```bash
# Lint entire project
npm run lint

# Lint specific file
npx eslint src/components/Button.tsx

# Show rule source
npx eslint src/components/Button.tsx --format=tap | grep brudi

# Fix auto-fixable violations (currently: none, all require manual fixes)
npm run lint:fix
```

### Create Test Files

Test file: `test-violations.tsx`
```typescript
// Test Rule 1: no-transition-all
<div className="transition-all">Bad</div>
<div className="transition-transform">Good</div>

// Test Rule 2: no-gsap-from-in-react
useEffect(() => {
  gsap.from('.x', { opacity: 0 })  // Bad
  gsap.set('.x', { opacity: 0 })   // Good
}, [])

// Test Rule 3: scrolltrigger-cleanup-required
useEffect(() => {
  gsap.to('.x', { scrollTrigger: { trigger: '.x' }, y: 100 })
  // Bad: no cleanup

  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
  // Good
}, [])

// Test Rule 4: no-layout-animation
gsap.to('.x', { width: '100px' })  // Bad
gsap.to('.x', { scaleX: 1.2 })     // Good
```

Run: `npx eslint test-violations.tsx`

You should see errors for all `// Bad` patterns.
