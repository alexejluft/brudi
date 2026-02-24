# Creative DNA ESLint Rules — Quick Reference Card

## Setup (Copy & Paste)

### 1. Copy Config
```bash
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js
```

### 2. Install ESLint
```bash
npm install --save-dev eslint@9
```

### 3. Add to package.json
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### 4. Test
```bash
npm run lint
```

---

## 4 Rules at a Glance

### Rule 1: `no-transition-all`
```
❌ <button className="transition-all">Bad</button>
✅ <button className="transition-transform">Good</button>

❌ <div style={{ transition: 'all 200ms' }}>Bad</div>
✅ <div style={{ transition: 'transform 200ms' }}>Good</div>
```

**Why:** 30-50% slower, animates unintended properties

---

### Rule 2: `no-gsap-from-in-react`
```
❌ useEffect(() => {
     gsap.from('.x', { opacity: 0 })
   }, [])

✅ useEffect(() => {
     gsap.set('.x', { opacity: 0 })
     gsap.to('.x', { opacity: 1 })
   }, [])
```

**Why:** FOUC (Flash of Unstyled Content)

---

### Rule 3: `scrolltrigger-cleanup-required`
```
❌ useEffect(() => {
     gsap.to('.x', { scrollTrigger: { trigger: '.x' }, y: 100 })
   }, [])

✅ useEffect(() => {
     const ctx = gsap.context(() => {
       gsap.to('.x', { scrollTrigger: { trigger: '.x' }, y: 100 })
     })
     return () => ctx.revert()
   }, [])
```

**Why:** Memory leaks without cleanup

---

### Rule 4: `no-layout-animation`
```
❌ gsap.to('.x', { width: '100px' })
✅ gsap.to('.x', { scaleX: 1.2 })

❌ gsap.to('.x', { height: '200px' })
✅ gsap.to('.x', { scaleY: 1.1 })

❌ gsap.to('.x', { margin: '16px' })
✅ gsap.to('.x', { y: 16 })
```

**Why:** 30-60% frame drops from layout recalculation

---

## Common Fixes

| Violation | Fix | Alternative |
|-----------|-----|-------------|
| `transition: all` | Use `transition: transform` | Tailwind: `transition-transform` |
| `gsap.from()` | Use `gsap.set()` + `gsap.to()` | Use `gsap.fromTo()` |
| No ScrollTrigger cleanup | Use `gsap.context().revert()` | `ScrollTrigger.getAll().forEach(st => st.kill())` |
| Animate `width` | Use `scaleX` | Use `x` (translateX) |
| Animate `height` | Use `scaleY` | Use `y` (translateY) |
| Animate `margin` | Use `x` or `y` | Use `transform` |
| Animate `padding` | Use `scale` | Use `transform` |

---

## Severity Levels

```javascript
// In eslint.config.js

// Strictest (all block commits)
'brudi/no-transition-all': 'error',
'brudi/no-gsap-from-in-react': 'error',
'brudi/scrolltrigger-cleanup-required': 'error',
'brudi/no-layout-animation': 'error',

// Balanced (performance blocks, optimization warns)
'brudi/no-transition-all': 'error',
'brudi/no-gsap-from-in-react': 'error',
'brudi/scrolltrigger-cleanup-required': 'warn',
'brudi/no-layout-animation': 'warn',

// Relaxed (all warn)
'brudi/no-transition-all': 'warn',
'brudi/no-gsap-from-in-react': 'warn',
'brudi/scrolltrigger-cleanup-required': 'warn',
'brudi/no-layout-animation': 'warn',
```

---

## Disable a Rule (Use Sparingly)

```javascript
// Single line
// eslint-disable-next-line brudi/no-transition-all
<div className="transition-all">Exception</div>

// Block
/* eslint-disable brudi/no-layout-animation */
gsap.to('.x', { width: '100px' })
/* eslint-enable brudi/no-layout-animation */

// Entire file
/* eslint-disable */
// ... code ...
```

---

## Testing Your Rules

```bash
# Test plugin directly
npx eslint orchestration/eslint-rules/test-cases.js
# Expected: ~12 violations from SHOULD FAIL sections

# Lint your project
npm run lint
# Show violations with line numbers

# Lint single file
npx eslint src/Hero.tsx

# Show rules that reported
npx eslint . --format=compact
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Plugin not found | Check path in `eslint.config.js` |
| ESLint version error | Run `npm install eslint@9` |
| Rules not triggering | Check you're using flat config (not `.eslintrc`) |
| False positive | Use `eslint-disable` comment, document in `ESLINT_EXCEPTIONS.md` |
| Slow linting | Check for slow plugins, remove unused parsers |

---

## Rule Mapping to Creative DNA

| Pillar | Rule | Why |
|--------|------|-----|
| Pillar 2: Motion | Rule 1 (transition-all) | Deterministic motion timing |
| Pillar 2: Motion | Rule 2 (gsap.from) | Motion quality in React |
| Pillar 5: Scroll | Rule 3 (cleanup) | ScrollTrigger orchestration |
| Pillar 5: Scroll | Rule 4 (layout) | Scroll performance |
| Pillar 8: Performance | Rule 4 (layout) | Frame rate preservation |

---

## Pre-Commit Hook Integration

If using pre-commit framework:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: eslint-brudi
        name: ESLint Creative DNA
        entry: npm run lint
        language: system
        types: [javascript, typescript]
```

Install: `pre-commit install`

---

## CI/CD Integration

### GitHub Actions
```yaml
- run: npm install
- run: npm run lint
# Fails if violations found
```

### GitLab CI
```yaml
lint:
  script:
    - npm install
    - npm run lint
```

---

## Documentation Files

| File | Purpose | Time |
|------|---------|------|
| **INDEX.md** | Master overview | 5 min |
| **README.md** | Rule documentation | 10 min |
| **EXAMPLES.md** | Detailed examples | 15 min |
| **INTEGRATION.md** | CI/CD setup | 20 min |
| **QUICK-REFERENCE.md** | This card | 2 min |

---

## Most Common Fixes

### Fix 1: Transition All
```javascript
// Before
<button className="transition-all hover:scale-110">Click</button>

// After
<button className="transition-transform duration-200 hover:scale-110">Click</button>
```

### Fix 2: GSAP From in React
```javascript
// Before
useEffect(() => {
  gsap.from('.hero', { opacity: 0, duration: 0.8 })
}, [])

// After
useEffect(() => {
  gsap.set('.hero', { opacity: 0 })
  gsap.to('.hero', { opacity: 1, duration: 0.8 })
}, [])
```

### Fix 3: ScrollTrigger Cleanup
```javascript
// Before
useEffect(() => {
  gsap.to('.card', {
    scrollTrigger: { trigger: '.card' },
    y: 100,
  })
}, [])

// After
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.card', {
      scrollTrigger: { trigger: '.card' },
      y: 100,
    })
  })
  return () => ctx.revert()
}, [])
```

### Fix 4: Layout Animation
```javascript
// Before
gsap.to('.sidebar', { width: '300px', duration: 0.3 })

// After
gsap.to('.sidebar', { x: 300, duration: 0.3 })
```

---

## Performance Impact

- Plugin adds: **< 10ms per 100 files**
- Safe for: **Pre-commit**, **On-save**, **CI/CD**
- No: **External dependencies**
- Uses: **Pure AST analysis**

---

## Getting Help

1. **Quick answer?** → Check this card
2. **Rule detail?** → Read `README.md`
3. **Real examples?** → See `EXAMPLES.md`
4. **Setup help?** → Follow `INTEGRATION.md`
5. **Source code?** → Look at `brudi-creative-dna.js`

---

## Quick Links

- **Plugin:** `/orchestration/eslint-rules/brudi-creative-dna.js`
- **Config template:** `/templates/eslint.config.brudi.js`
- **Full docs:** `/orchestration/eslint-rules/README.md`
- **Examples:** `/orchestration/eslint-rules/EXAMPLES.md`
- **Integration:** `/orchestration/eslint-rules/INTEGRATION.md`

---

**Last Updated:** 2026-02-24
**Version:** 1.0
**Status:** Production Ready
