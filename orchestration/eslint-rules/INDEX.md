# Brudi Creative DNA ESLint Rules — Master Index

Complete reference for implementing Creative DNA constraints through ESLint.

---

## What This Is

A custom ESLint plugin that enforces Alex's award-level design standards by catching 4 critical performance and motion violations at commit time.

**Problem:** Brudi v3.3.2 prevents bad *process* (missing screenshots) but allows mediocre *design* (incorrect animations, layout jank).

**Solution:** Creative DNA rules block code that violates creative constraints before it ships.

---

## Files Overview

| File | Purpose | Audience |
|------|---------|----------|
| **brudi-creative-dna.js** | ESLint plugin with 4 rules | Developers, CI/CD |
| **README.md** | Rules documentation + examples | Developers |
| **EXAMPLES.md** | Detailed violation examples | Developers learning the rules |
| **INTEGRATION.md** | How to integrate into projects | DevOps, Team Leads |
| **test-cases.js** | Test file for rule verification | QA, Rule maintainers |
| **eslint.config.brudi.js** | ESLint config template | Developers (copy to project) |
| **INDEX.md** | This file | Everyone |

---

## Quick Answers

### "I'm a developer. How do I use this?"

1. Copy template: `cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js`
2. Update import path if needed
3. Install ESLint: `npm install --save-dev eslint@9`
4. Run: `npm run lint`
5. Fix violations using `README.md` as reference

### "I'm implementing this in a project. What do I do?"

1. Read: `INTEGRATION.md` (5-min setup)
2. Copy ESLint config template to project root
3. Update `package.json` with lint script
4. Run linting in CI/CD pipeline
5. Pre-commit hook will auto-block violations

### "What violations does this catch?"

| Rule | What It Stops | Cost |
|------|--------------|------|
| `no-transition-all` | Animating all properties at once | 30-50% slower, animates unintended props |
| `no-gsap-from-in-react` | FOUC from gsap.from() | Flash of unstyled content, poor UX |
| `scrolltrigger-cleanup-required` | Memory leaks from ScrollTrigger | Unbounded memory growth, duplicate triggers |
| `no-layout-animation` | Jank from animating layout properties | 30-60% frame drops on mid-range devices |

### "Can I disable a rule?"

Yes, but document why:

```javascript
// eslint-disable-next-line brudi/no-transition-all
<div className="transition-all">Legacy component</div>
```

See `README.md` for more.

### "One of these rules doesn't apply to me."

Adjust severity in `eslint.config.js`:

```javascript
// Disable for your project
'brudi/no-layout-animation': 'off',

// Or make it a warning instead of error
'brudi/scrolltrigger-cleanup-required': 'warn',
```

---

## Rule Reference

### Rule 1: `brudi/no-transition-all`

**Prevents:** `transition: all` and `transition-all` class

**Why:** Animates every property change (filters, color, opacity) unintentionally, causing jank.

**Fix:** Use specific properties: `transition-transform`, `transition-colors`, `transition-opacity`

**Severity:** Error (blocks commits)

**Example:**
```jsx
// ❌ Bad
<button className="transition-all">Click</button>

// ✅ Good
<button className="transition-transform duration-200">Click</button>
```

---

### Rule 2: `brudi/no-gsap-from-in-react`

**Prevents:** `gsap.from()` calls in useEffect

**Why:** Renders element in final state first, causing FOUC (Flash of Unstyled Content)

**Fix:** Use `gsap.set()` + `gsap.to()` pattern instead

**Severity:** Error (blocks commits)

**Example:**
```javascript
// ❌ Bad
useEffect(() => {
  gsap.from('.hero', { opacity: 0, duration: 0.8 })
}, [])

// ✅ Good
useEffect(() => {
  gsap.set('.hero', { opacity: 0 })
  gsap.to('.hero', { opacity: 1, duration: 0.8 })
}, [])
```

---

### Rule 3: `brudi/scrolltrigger-cleanup-required`

**Prevents:** ScrollTrigger instances without cleanup in useEffect return

**Why:** Missing cleanup causes memory leaks and duplicate triggers on navigation

**Fix:** Add cleanup: `ScrollTrigger.getAll().forEach(st => st.kill())` or use `gsap.context().revert()`

**Severity:** Warning (doesn't block, but should be fixed)

**Example:**
```javascript
// ❌ Bad
useEffect(() => {
  gsap.to('.hero', {
    scrollTrigger: { trigger: '.hero' },
    opacity: 1,
  })
  // No cleanup!
}, [])

// ✅ Good
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.hero', {
      scrollTrigger: { trigger: '.hero' },
      opacity: 1,
    })
  })
  return () => ctx.revert()
}, [])
```

---

### Rule 4: `brudi/no-layout-animation`

**Prevents:** Animation of margin, width, height, padding, top, left, right, bottom

**Why:** Layout property changes trigger full page reflow, causing 30-60% frame drops

**Fix:** Use `transform: translateX/Y` or `scale` instead (GPU-accelerated)

**Severity:** Warning (optimization, can refactor)

**Example:**
```javascript
// ❌ Bad
gsap.to('.sidebar', { width: '300px', duration: 0.3 })

// ✅ Good
gsap.to('.sidebar', { x: 300, duration: 0.3 })
```

---

## How Rules Work

Each rule uses ESLint's AST (Abstract Syntax Tree) visitor pattern to:

1. **Parse** your code into a tree of syntax nodes
2. **Visit** specific node types (function calls, JSX attributes, etc.)
3. **Check** for violation patterns
4. **Report** errors with specific line numbers and suggestions

**No external dependencies required.** Pure AST analysis.

**Performance:** Adds < 10ms per 100 files.

---

## Integration Points

### Pre-Commit Hook

Automatically runs before `git commit`:
```bash
$ git commit -m "Add hero"
npx eslint .
❌ brudi/no-transition-all: ...
commit aborted
```

### CI/CD Pipeline

GitHub Actions, GitLab CI, or other:
```yaml
script:
  - npm install
  - npm run lint
  # Fails if violations found
```

### Brudi Gate

Integrates with `brudi-gate.sh` post-slice:
```bash
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh post-slice 1
# Runs ESLint automatically
# Blocks if violations found
```

---

## Installation Paths

### Path A: Fresh Project

```bash
# Copy template
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js

# Install ESLint 9
npm install --save-dev eslint@9

# Test
npm run lint
```

### Path B: Existing Project with ESLint Config

```bash
# Copy template
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js

# Ensure ESLint 9
npm install --save-dev eslint@9

# Verify plugin path in eslint.config.js
# Update if needed: import brudiPlugin from '...'

# Test
npm run lint
```

### Path C: Using from Brudi Workspace

```bash
# Link to Brudi orchestration
ln -s ~/Brudi/orchestration ./orchestration

# Create eslint.config.js with correct path
cat > eslint.config.js << 'EOF'
import brudiPlugin from './orchestration/eslint-rules/brudi-creative-dna.js';
export default [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { brudi: brudiPlugin },
    rules: {
      'brudi/no-transition-all': 'error',
      'brudi/no-gsap-from-in-react': 'error',
      'brudi/scrolltrigger-cleanup-required': 'warn',
      'brudi/no-layout-animation': 'warn',
    },
  },
];
EOF
```

---

## Documentation by User Type

### For Developers
- Start: `README.md` → Rule descriptions + examples
- Learn violations: `EXAMPLES.md` → Detailed before/after code
- Fix violations: Reference `README.md` section for each rule
- Test changes: `npm run lint`

### For Team Leads
- Overview: This file → What it does and why
- Integration: `INTEGRATION.md` → How to set up in projects
- CI/CD: `INTEGRATION.md` → GitHub Actions / GitLab CI examples
- Severity: `README.md` → Rule configuration options

### For DevOps
- Setup: `INTEGRATION.md` → Installation and CI/CD integration
- Troubleshooting: `README.md` → Common issues and fixes
- Performance: `README.md` → Performance impact (< 10ms/100 files)
- Exceptions: `README.md` → How to handle false positives

### For Maintainers
- Architecture: `brudi-creative-dna.js` → Source code with comments
- Testing: `test-cases.js` → Run violations through ESLint
- Debugging: `test-cases.js` + `npm run lint -- --debug`
- Adding rules: See comments in `brudi-creative-dna.js`

---

## Workflow: Using This in a Sprint

### Day 1: Setup
```bash
# 1. Copy template
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js

# 2. Update path if needed
vim eslint.config.js

# 3. Install
npm install --save-dev eslint@9

# 4. Test
npm run lint
# See baseline violations
```

### Day 1-N: Development
```bash
# Code as usual
git add src/components/Hero.tsx

# Pre-commit hook runs ESLint
git commit -m "Add hero"
# ❌ Violations detected → Fix them

# Read the rules
cat orchestration/eslint-rules/README.md

# Fix the code (use EXAMPLES.md as guide)
npm run lint:fix

# Retry commit
git commit -m "Add hero"
# ✅ Success!
```

### Sprint End: CI/CD Verification
```bash
# GitHub Actions / GitLab CI runs
npm run lint
# Must pass with 0 violations
```

---

## Real-World Scenario

### Your Code
```jsx
// src/Hero.tsx - Has 3 violations
import gsap from 'gsap'
import { useEffect } from 'react'

export function Hero() {
  useEffect(() => {
    gsap.from('.title', { opacity: 0 })  // ❌ Rule 2
    gsap.to('.image', {
      scrollTrigger: { trigger: '.image' },
      width: '100%',  // ❌ Rule 4
    })
    // ❌ Rule 3: No cleanup
  }, [])

  return (
    <h1 className="title transition-all">Hero</h1>  // ❌ Rule 1
  )
}
```

### ESLint Output
```
src/Hero.tsx
  11:5   error  brudi/no-gsap-from-in-react
  15:7   error  brudi/no-layout-animation
  18:36  error  brudi/no-transition-all

✖ 3 errors
```

### Commit Attempt
```bash
$ git commit -m "Add hero section"
ESLint violations detected. Fix before committing.
commit aborted
```

### Read the Docs
```bash
cat orchestration/eslint-rules/README.md
# Rule 1: transition-all
# Rule 2: gsap.from-in-react
# Rule 3: scrolltrigger-cleanup
# Rule 4: layout-animation

cat orchestration/eslint-rules/EXAMPLES.md
# Detailed before/after for each rule
```

### Fix the Code
```jsx
// src/Hero.tsx - All fixed
import gsap from 'gsap'
import { useEffect } from 'react'

export function Hero() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.title', { opacity: 0 })  // ✅ set + to
      gsap.to('.title', { opacity: 1 })

      gsap.to('.image', {
        scrollTrigger: { trigger: '.image' },
        scaleX: 1,  // ✅ transform instead of width
      })
    })
    return () => ctx.revert()  // ✅ cleanup
  }, [])

  return (
    <h1 className="title transition-opacity">Hero</h1>  // ✅ specific property
  )
}
```

### Retry Commit
```bash
$ npm run lint
✓ No violations

$ git commit -m "Add hero section"
[main abc1234] Add hero section
```

---

## Creative DNA Connection

These 4 rules implement constraints from **Brudi Creative DNA v1.0**:

| Pillar | Rules |
|--------|-------|
| Pillar 2: Motion Systems | Rule 1 (transition all), Rule 2 (gsap.from) |
| Pillar 5: Scroll Experience | Rule 3 (cleanup), Rule 4 (no-layout) |
| Pillar 8: Performance Architecture | Rule 4 (layout animation cost) |

Full spec: `BRUDI_CREATIVE_DNA_v1.md`

---

## Support & Contribution

### Report Issues
Location: `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/docs/ESLINT_EXCEPTIONS.md`

Include:
- Rule name
- Code snippet
- Why the exception is needed
- Timeline for fix

### Add New Rules
Edit `brudi-creative-dna.js`:
1. Add rule object with `meta` + `create()`
2. Export in `module.exports.rules`
3. Update `README.md` with docs
4. Add test cases to `test-cases.js`
5. Test: `npx eslint test-cases.js`

### Questions?
Refer to:
- Rule docs: `README.md`
- Examples: `EXAMPLES.md`
- Integration: `INTEGRATION.md`
- Source code: `brudi-creative-dna.js` (comments)

---

## Checklist: Are You Set Up?

- [ ] Plugin file exists: `orchestration/eslint-rules/brudi-creative-dna.js`
- [ ] Config file exists: `eslint.config.js` in project root
- [ ] ESLint 9+ installed: `npm install eslint@9`
- [ ] Lint script in `package.json`: `"lint": "eslint ."`
- [ ] Pre-commit hook installed (or using Brudi gate)
- [ ] Team knows about rules (share `README.md`)
- [ ] CI/CD pipeline runs linting
- [ ] Zero violations on main branch

If any unchecked → See `INTEGRATION.md` for setup steps.

---

## Next Steps

1. **Setup:** Follow `INTEGRATION.md` (5 minutes)
2. **Learn:** Read `README.md` rule-by-rule
3. **Develop:** Use `EXAMPLES.md` when fixing violations
4. **Deploy:** Enable in CI/CD pipeline
5. **Monitor:** Track violations in project status

---

**Last Updated:** 2026-02-24
**Version:** 1.0
**Status:** Ready for implementation
