# ESLint Creative DNA Rules - Integration Guide

How to integrate Creative DNA ESLint Rules into your Brudi project and CI/CD pipeline.

---

## Quick Start (5 Minutes)

### 1. Copy ESLint Plugin
The plugin file already exists in this directory:
```
~/Brudi/orchestration/eslint-rules/brudi-creative-dna.js
```

### 2. Create `eslint.config.js` in Your Project

Copy the template and update the import path:

```bash
# From your project root
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js
```

Then update the import path if needed:
```javascript
// If you copied the orchestration folder locally:
import brudiPlugin from './orchestration/eslint-rules/brudi-creative-dna.js';

// Or if using Brudi from symlink/global location:
import brudiPlugin from '~/Brudi/orchestration/eslint-rules/brudi-creative-dna.js';
```

### 3. Install ESLint 9+

```bash
npm install --save-dev eslint@9
```

### 4. Test It

```bash
npm run lint
```

You should see Creative DNA rule violations highlighted.

---

## Integration with Brudi Gate (Production)

The Creative DNA rules integrate with `brudi-gate.sh` to block commits with violations.

### Pre-Slice Check

Before starting a slice, gates run:
```bash
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh pre-slice
```

This verifies:
- Previous slice fully complete (all Quality Gates passed)
- No outstanding ESLint violations from before

### Post-Slice Check (Automatic)

After you finish coding and run post-slice:
```bash
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh post-slice 1
```

The gate will:
1. Run `npm run lint` automatically
2. Parse ESLint output
3. **BLOCK** if any Creative DNA violations found
4. Require you to fix before proceeding

### Pre-Commit Hook (Automatic)

When you try to commit:
```bash
git commit -m "Add hero section"
```

The `.git/hooks/pre-commit` script runs:
1. ESLint check with Creative DNA rules
2. If violations → Commit blocked, shows error list
3. You must fix and re-commit

---

## Example: ESLint Blocking a Commit

### Your Code (with violation)
```typescript
// src/components/Hero.tsx
import gsap from 'gsap'
import { useEffect } from 'react'

export function Hero() {
  useEffect(() => {
    // ❌ Violation: gsap.from() causes FOUC
    gsap.from('.title', {
      opacity: 0,
      duration: 0.8,
    })
    // ❌ Violation: Missing ScrollTrigger cleanup
    gsap.to('.image', {
      scrollTrigger: { trigger: '.image' },
      y: 100,
    })
  }, [])

  return (
    <section>
      <h1 className="title transition-all">Hero Title</h1>
      {/* ❌ Violation: transition-all */}
    </section>
  )
}
```

### ESLint Output
```bash
$ npm run lint

> my-app@1.0.0 lint
> eslint .

src/components/Hero.tsx
  5:5   error  Use gsap.set() + gsap.to() instead of gsap.from(). gsap.from() causes FOUC in React.  brudi/no-gsap-from-in-react
  13:5  error  ScrollTrigger must be cleaned up in useEffect return. Add cleanup to prevent memory leaks.  brudi/scrolltrigger-cleanup-required
  22:44  error  Use specific transition properties (transform, box-shadow, background-color). 'transition: all' causes performance issues.  brudi/no-transition-all

✖ 3 problems (3 errors, 0 warnings)
```

### Commit Attempt
```bash
$ git commit -m "Add hero section with animations"

ESLint violations detected. Fix before committing:
  ❌ src/components/Hero.tsx:5 - brudi/no-gsap-from-in-react
  ❌ src/components/Hero.tsx:13 - brudi/scrolltrigger-cleanup-required
  ❌ src/components/Hero.tsx:22 - brudi/no-transition-all

commit aborted
```

### Fixed Code
```typescript
import gsap from 'gsap'
import { useEffect } from 'react'

export function Hero() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ✅ set + to pattern
      gsap.set('.title', { opacity: 0 })
      gsap.to('.title', {
        opacity: 1,
        duration: 0.8,
      })

      // ✅ ScrollTrigger with cleanup
      gsap.to('.image', {
        scrollTrigger: { trigger: '.image' },
        y: 100,
      })
    })

    return () => ctx.revert()  // ✅ Cleanup
  }, [])

  return (
    <section>
      {/* ✅ Specific transition property */}
      <h1 className="title transition-opacity duration-200">Hero Title</h1>
    </section>
  )
}
```

### Commit Succeeds
```bash
$ git commit -m "Add hero section with animations"
[main abc1234] Add hero section with animations
 1 file changed, 15 insertions(+), 5 deletions(-)
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/lint.yml`:

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - run: npm install
      - run: npm run lint

      # Fail if Creative DNA violations found
      - name: Check for Creative DNA violations
        run: |
          npx eslint . 2>&1 | grep "brudi/" && exit 1 || true
```

### GitLab CI Example

In `.gitlab-ci.yml`:

```yaml
lint:
  stage: test
  script:
    - npm install
    - npm run lint
  only:
    - merge_requests
```

### Pre-commit Framework (Optional)

Create `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: eslint-brudi
        name: ESLint (Creative DNA)
        entry: npm run lint
        language: system
        types: [javascript, typescript]
        stages: [commit]
```

Install:
```bash
pip install pre-commit
pre-commit install
```

---

## Severity Configuration by Phase

Adjust rule severity based on project phase:

### Phase 0: Foundation (All Errors)

```javascript
// In eslint.config.js
rules: {
  'brudi/no-transition-all': 'error',
  'brudi/no-gsap-from-in-react': 'error',
  'brudi/scrolltrigger-cleanup-required': 'error',
  'brudi/no-layout-animation': 'error',
}
```

**Effect:** All violations block commits.

### Phase 1: Development (Mixed)

```javascript
rules: {
  'brudi/no-transition-all': 'error',        // Performance critical
  'brudi/no-gsap-from-in-react': 'error',   // Motion quality critical
  'brudi/scrolltrigger-cleanup-required': 'warn',  // Important but less critical
  'brudi/no-layout-animation': 'warn',      // Optimization, can refactor
}
```

**Effect:** Performance rules block, optimization warns.

### Phase 2: Polish (Warnings)

```javascript
rules: {
  'brudi/no-transition-all': 'warn',
  'brudi/no-gsap-from-in-react': 'warn',
  'brudi/scrolltrigger-cleanup-required': 'warn',
  'brudi/no-layout-animation': 'warn',
}
```

**Effect:** All violations warn but don't block.

---

## Handling False Positives

### Disable for Specific File

Create `.eslintignore`:

```
# Legacy code
src/legacy/**
src/polyfills/**
```

Or use ESLint comments:

```javascript
/* eslint-disable brudi/no-transition-all */
<div className="transition-all">Legacy component</div>
/* eslint-enable brudi/no-transition-all */
```

### Document Exception

In `EXCEPTIONS.md`:

```markdown
## Exceptions to Creative DNA Rules

### no-transition-all in legacy-button.tsx (Line 42)

**Reason:** This component predates Creative DNA implementation.

**Timeline:** Refactor in Phase 2, Q2 2026

**Status:** Known limitation, low priority
```

---

## Troubleshooting

### "Cannot find module 'eslint'"
```bash
npm install --save-dev eslint@9
```

### "Plugin 'brudi' not found"
Check `eslint.config.js`:
```javascript
// ❌ Wrong path
import brudiPlugin from './brudi-creative-dna.js'

// ✅ Correct
import brudiPlugin from './orchestration/eslint-rules/brudi-creative-dna.js'
```

### Rules Not Triggering
Ensure you're using ESLint 9+ flat config:
```bash
npx eslint --version  # Should be 9.0.0+
```

### Lint Passes but Gate Fails
Check both are configured:
- `eslint.config.js` must exist in project root
- `npm run lint` must work
- `brudi-gate.sh` must find ESLint

### Performance (Lint Takes Too Long)
Rules use simple AST traversal, adding < 10ms per 100 files. If slower:
- Check for slow plugins in eslint.config.js
- Remove unused parsers (TypeScript, React)
- Run with `--profile` to identify bottleneck

---

## Next Steps

1. **Copy template:** `cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js`
2. **Install ESLint 9:** `npm install --save-dev eslint@9`
3. **Run lint:** `npm run lint`
4. **Fix violations:** Read output, use `EXAMPLES.md` as reference
5. **Commit:** Should now pass with zero violations

For detailed rule documentation: See `README.md` in this directory.

---

## Reference

- **Plugin file:** `brudi-creative-dna.js`
- **Config template:** `templates/eslint.config.brudi.js`
- **Rule docs:** `README.md`
- **Examples:** `EXAMPLES.md`
- **Creative DNA spec:** `BRUDI_CREATIVE_DNA_v1.md`
