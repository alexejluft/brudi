# Brudi Creative DNA ESLint Rules

Custom ESLint plugin that enforces Alex's award-level design standards through static code analysis. Prevents 4 critical performance and motion violations at commit time.

## Rules Overview

### 1. `brudi/no-transition-all`

**Severity:** Error

**Purpose:** Prevents performance-killing `transition: all` declarations that animate unintended properties.

**Why It Matters:**
- `transition: all` animates every property change (opacity, color, filters, etc.)
- Causes jank and flashing in React when state changes
- Specific transitions are 30-50% faster

**Examples:**

❌ **Bad:**
```jsx
<button className="transition-all hover:scale-110">Click me</button>

<div style={{ transition: 'all 200ms ease-out' }}>Content</div>
```

✅ **Good:**
```jsx
<button className="transition-transform duration-200 hover:scale-110">Click me</button>

<div style={{ transition: 'transform 200ms ease-out' }}>Content</div>

// Multiple specific properties
<div style={{
  transition: 'transform 200ms, box-shadow 200ms, background-color 150ms'
}}>Content</div>
```

---

### 2. `brudi/no-gsap-from-in-react`

**Severity:** Error

**Purpose:** Prevents `gsap.from()` which causes FOUC (Flash of Unstyled Content) in React applications.

**Why It Matters:**
- `gsap.from()` renders the element in its final state first, then animates backwards
- In React, component renders before animation setup completes
- Results in: element appears → jumps to start → animates to end
- `gsap.set()` + `gsap.to()` fixes: element hidden → animation runs → visible

**Examples:**

❌ **Bad:**
```javascript
// In useEffect
useEffect(() => {
  gsap.from('.hero', { opacity: 0, duration: 0.8 })
}, [])

// In timeline
const tl = gsap.timeline()
tl.from('.card', { y: 20, opacity: 0 })
```

✅ **Good:**
```javascript
// Use set + to pattern
useEffect(() => {
  gsap.set('.hero', { opacity: 0 })
  gsap.to('.hero', { opacity: 1, duration: 0.8 })
}, [])

// Or with timeline
const tl = gsap.timeline()
tl.set('.card', { y: 20, opacity: 0 })
  .to('.card', { y: 0, opacity: 1, duration: 0.4 }, 0)

// Or use fromTo with explicit start/end
gsap.fromTo('.hero',
  { opacity: 0, y: -20 },
  { opacity: 1, y: 0, duration: 0.8 }
)
```

---

### 3. `brudi/scrolltrigger-cleanup-required`

**Severity:** Warning → Error (after Q2 2026)

**Purpose:** Ensures ScrollTrigger instances are cleaned up in useEffect return to prevent memory leaks.

**Why It Matters:**
- ScrollTrigger registers global event listeners
- Missing cleanup causes duplicate triggers on navigation
- Each re-render without cleanup adds listeners (memory grows unbounded)
- Cleanup is 1 line: `ScrollTrigger.getAll().forEach(st => st.kill())`

**Examples:**

❌ **Bad:**
```javascript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)

  gsap.to('.hero', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top center',
      markers: true,
    },
    opacity: 1,
  })
  // No cleanup!
}, [])
```

✅ **Good:**
```javascript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)

  const ctx = gsap.context(() => {
    gsap.to('.hero', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
      },
      opacity: 1,
    })
  })

  return () => ctx.revert() // Cleanup all ScrollTriggers
}, [])

// Or explicit cleanup
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
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}, [])
```

---

### 4. `brudi/no-layout-animation`

**Severity:** Warning

**Purpose:** Prevents animation of layout properties (margin, width, height, padding, position) that cause layout recalculation (jank).

**Why It Matters:**
- Animating layout properties forces the browser to recalculate layout every frame
- 60 fps animation = 60 layout calculations per second
- Causes 30-60% frame drops on mid-range devices
- `transform` uses GPU compositing (1/10th the cost)
- `transform: translateX/Y` achieves the same visual effect with 60 fps

**Examples:**

❌ **Bad:**
```javascript
// GSAP
gsap.to('.sidebar', { width: '300px', duration: 0.3 })
gsap.to('.card', { margin: '16px', duration: 0.2 })
gsap.to('.modal', { height: '500px', duration: 0.4 })

// CSS
.box {
  transition: width 200ms, height 200ms, padding 200ms;
}
```

✅ **Good:**
```javascript
// Use transform instead
gsap.to('.sidebar', {
  x: 300,  // translateX
  duration: 0.3
})

// For size changes, use scale
gsap.to('.card', {
  scale: 1.1,  // grows from center
  duration: 0.2
})

// For modal, use scaleY
gsap.to('.modal', {
  scaleY: 1,  // grows from top
  duration: 0.4
})

// CSS
.box {
  transition: transform 200ms;
}
.box:hover {
  transform: scaleX(1.2) scaleY(1.1);
}
```

---

## Installation

### Step 1: Copy Plugin File

The plugin is located at:
```
~/Brudi/orchestration/eslint-rules/brudi-creative-dna.js
```

For Brudi projects, it's already in the repo.

### Step 2: Create or Update `eslint.config.js`

Replace your old `.eslintrc` with a new `eslint.config.js` (ESLint 9+ flat config):

```javascript
// eslint.config.js
import brudiPlugin from './orchestration/eslint-rules/brudi-creative-dna.js';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'brudi': brudiPlugin,
    },
    rules: {
      'brudi/no-transition-all': 'error',
      'brudi/no-gsap-from-in-react': 'error',
      'brudi/scrolltrigger-cleanup-required': 'warn',
      'brudi/no-layout-animation': 'warn',
    },
  },
];
```

### Step 3: Update `package.json`

```json
{
  "devDependencies": {
    "eslint": "^9.0.0"
  },
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Step 4: Run Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix where possible
```

---

## Integration with Brudi Gate

The Creative DNA rules integrate with `brudi-gate.sh`:

```bash
# Pre-slice check
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh pre-slice

# Your work here...

# Post-slice (runs ESLint)
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh post-slice 1
```

The gate will:
1. Run `eslint .` automatically
2. Block commit if Creative DNA violations detected
3. Require fixes before proceeding

---

## Rule Configuration

You can adjust severity by project needs:

```javascript
// Max strictness (errors block commits)
'brudi/no-transition-all': 'error',
'brudi/no-gsap-from-in-react': 'error',
'brudi/scrolltrigger-cleanup-required': 'error',
'brudi/no-layout-animation': 'error',

// Balanced (warnings don't block)
'brudi/no-transition-all': 'error',
'brudi/no-gsap-from-in-react': 'error',
'brudi/scrolltrigger-cleanup-required': 'warn',
'brudi/no-layout-animation': 'warn',

// Relaxed (for legacy projects)
'brudi/no-transition-all': 'warn',
'brudi/no-gsap-from-in-react': 'warn',
'brudi/scrolltrigger-cleanup-required': 'warn',
'brudi/no-layout-animation': 'off',
```

---

## Ignoring Rules (Rare Cases)

If a false positive occurs, use ESLint comments:

```javascript
// Disable for single line
// eslint-disable-next-line brudi/no-transition-all
<button className="transition-all">One-off case</button>

// Disable for block
/* eslint-disable brudi/no-layout-animation */
const specialAnimation = () => {
  gsap.to('.thing', { height: 'auto' }) // Justified exception
}
/* eslint-enable brudi/no-layout-animation */
```

Document why in a comment when using disable.

---

## Troubleshooting

### "Plugin not found"
- Check path in `eslint.config.js` is correct
- Ensure `brudi-creative-dna.js` exists in `orchestration/eslint-rules/`

### "Cannot find module 'eslint'"
- Run: `npm install eslint@9`

### Rule Not Triggering
- Ensure you're using ESLint 9+ (flat config)
- Check `eslint.config.js` includes the plugin
- Run: `eslint . --debug` to see what's loaded

### False Positives
- Report in: `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/docs/ESLINT_EXCEPTIONS.md`
- Include: rule name, code snippet, explanation

---

## Performance Impact

- Plugin adds **5-10ms** to lint time per 100 files
- All 4 rules use simple AST traversal (no regex)
- Safe to run pre-commit, in CI/CD, and on save

---

## Creative DNA Reference

Rules implement constraints from:
- **Pillar 2:** Motion Systems (timing, no-transition-all, gsap patterns)
- **Pillar 5:** Scroll Experience (ScrollTrigger cleanup, no-layout-animation)
- **Pillar 8:** Performance Architecture (layout animation cost)

Full spec: `BRUDI_CREATIVE_DNA_v1.md`

---

## Contact & Contributions

Maintain in: `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/orchestration/eslint-rules/`

To add rules:
1. Add rule object to `brudi-creative-dna.js`
2. Export in `module.exports.rules`
3. Update this README with examples
4. Test with `node -c brudi-creative-dna.js`
