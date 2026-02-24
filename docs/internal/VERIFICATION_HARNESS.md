# BRUDI VERIFICATION HARNESS — Test Suite Documentation

## Overview

The Verification Harness is a minimal test suite that proves the new constraint gates work correctly by testing both **PASS** and **FAIL** cases. All tests are locally executable and require no external dependencies beyond bash and standard Unix tools.

**Location:** `/docs/internal/fixtures/`

---

## Fixtures

### Directory Structure

```
docs/internal/fixtures/
├── run-tests.sh                    # Main test runner
├── constraint-PASS/                # ✅ Should pass all constraint checks
│   ├── .brudi/
│   │   └── state.json
│   └── src/
│       ├── app/
│       │   └── page.tsx
│       ├── components/
│       │   ├── hero.tsx
│       │   ├── features.tsx
│       │   └── Container.tsx
│       ├── lib/
│       │   └── tokens.ts
│       └── styles/
│           └── globals.css
├── constraint-FAIL/                # ❌ Should fail all constraint checks
│   ├── .brudi/
│   │   └── state.json
│   └── src/
│       ├── app/
│       │   └── page.tsx
│       ├── components/
│       │   ├── hero.tsx
│       │   └── features.tsx
│       └── styles/
│           └── globals.css
├── complexity-PASS/                # ✅ Should pass complexity checks
│   ├── .brudi/
│   │   └── state.json
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   └── hero.tsx
│   │   └── styles/
│   │       ├── globals.css
│   │       └── materiality-tokens.css
└── complexity-FAIL/                # ❌ Should fail complexity checks
    ├── .brudi/
    │   └── state.json
    └── src/
        ├── components/
        │   └── hero.tsx
        └── styles/
            └── globals.css
```

---

## Fixture Details

### Fixture A: `constraint-PASS`

**Purpose:** Demonstrates a project that passes all 5 constraint checks.

**Tests Against:** `brudi-gate-constraints.sh check-all`

**Expected Outcome:** Exit code 0 ✅

**Key Features:**

1. **Container Usage (Check A)** ✅
   - Uses `Container` component with `max-w-*` classes
   - `max-w-5xl` and `max-w-6xl` (2 unique values, well within limit of 4)
   - Container imports present in components

2. **Text Wrapping (Check B)** ✅
   - All heading and paragraph tags wrapped in Container
   - Proper context via `px-6` padding in Container
   - No edge-to-edge text

3. **Spacing Tokens (Check C)** ✅
   - Uses `py-24`, `py-20`, `gap-8` consistently
   - Only 3 unique py-*/gap-* values (well within limit of 6)
   - Systematic spacing strategy

4. **Section IDs (Check D)** ✅
   - Homepage sections have `id` attributes
   - `<section id="hero">` and `<section id="features">`

5. **Token Adoption (Check E)** ✅
   - `globals.css` defines 8 tokens: colors, durations, easings
   - `src/lib/tokens.ts` imports and references tokens via `var(--*)`
   - Token references throughout components

---

### Fixture B: `constraint-FAIL`

**Purpose:** Demonstrates a project that fails all constraint checks intentionally.

**Tests Against:** `brudi-gate-constraints.sh check-all`

**Expected Outcome:** Exit code 1 ❌

**Violations:**

1. **Container Inconsistency (Check A)** ❌
   - Uses raw `max-w-*` on divs: `max-w-3xl`, `max-w-2xl`, `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-7xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`
   - 8 different values (exceeds limit of 4)
   - No Container component imported

2. **Text Wrapping Issues (Check B)** ❌
   - Headings used directly without Container
   - No padding context (`px-*`)
   - Text can touch viewport edges

3. **Spacing Variance (Check C)** ❌
   - Excessive gap-* values: `gap-2`, `gap-4`, `gap-6`, `gap-12`, `gap-20`, `gap-24`, `gap-32`, `gap-40`, `gap-48`
   - 8 values (exceeds limit of 6)

4. **Missing Section IDs (Check D)** ❌
   - Sections use raw `<div>` instead of `<section>`
   - No `id` attributes

5. **Token Adoption Failure (Check E)** ❌
   - `globals.css` defines 2 tokens but no motion tokens
   - Components use hardcoded colors: `#0a0a0a`, `#f5f5f5`, `blue-900`, `gray-800`
   - No token references in code

---

### Fixture C: `complexity-PASS`

**Purpose:** Demonstrates a project that passes complexity gates.

**Tests Against:** `brudi-gate-complexity.sh pre-slice`

**Expected Outcome:** Exit code 0 ✅

**Key Features:**

1. **Token Completeness** ✅
   - `src/styles/globals.css`: 4-layer color tokens (--color-bg, --color-bg-elevated, --color-surface, --color-surface-high)
   - `src/styles/materiality-tokens.css`: Exists with shadow and blur tokens
   - Motion tokens: 3 duration tokens, 3 easing tokens

2. **Forbidden Patterns** ✅
   - ✅ No `transition: all`
   - ✅ No `gsap.from()` in React
   - ✅ No layout property animations
   - ✅ Uses `gsap.set() + gsap.to()` pattern correctly

3. **Creative Metrics** ✅
   - **Animation Count:** 5+ GSAP calls detected
     1. Headline opacity/y with power2.out
     2. Button scale on hover with power3.out
     3. Scroll indicator timeline (repeating)
     4. Background shift parallax with ScrollTrigger
     5. Button shadow elevation with power2.out

   - **Easing Variety:** 3+ easing types detected
     1. `power2.out` (headline, shadow)
     2. `power3.out` (button scale enter)
     3. `sine.inOut` (button scale exit, parallax)

   - **Depth Layer Usage:** 4/4 layers used
     1. `--color-bg` (section background)
     2. `--color-bg-elevated` (parallax target)
     3. `--color-surface` (text color)
     4. `--color-surface-high` (scroll indicator)

---

### Fixture D: `complexity-FAIL`

**Purpose:** Demonstrates a project that fails complexity gates.

**Tests Against:** `brudi-gate-complexity.sh pre-slice`

**Expected Outcome:** Exit code 1 ❌

**Violations:**

1. **Missing Token Files** ❌
   - ❌ No `src/styles/materiality-tokens.css`
   - ✅ Has `src/styles/globals.css` but incomplete

2. **Forbidden Pattern Violation** ❌
   - ❌ Contains `transition: all 0.3s ease` (explicit violation)
   - Used in inline style, which gate detects

3. **Insufficient Complexity** ❌
   - ❌ No GSAP animations (`gsap.to()`, `ScrollTrigger`)
   - Only 0 GSAP calls (minimum required: 5)
   - Only 1 easing type (minimum required: 3)

4. **Missing Depth Layers** ❌
   - Uses only 1 layer: `--color-bg`
   - Missing: `--color-bg-elevated`, `--color-surface`, `--color-surface-high`

---

## Running Tests

### Quick Start

```bash
cd /path/to/brudi
bash docs/internal/fixtures/run-tests.sh
```

### Expected Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BRUDI VERIFICATION HARNESS — TEST SUITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Constraint Gate Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ constraint-PASS + brudi-gate-constraints.sh check-all
❌ constraint-FAIL + brudi-gate-constraints.sh check-all

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Complexity Gate Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ complexity-PASS (pre-slice) + brudi-gate-complexity.sh pre-slice
❌ complexity-FAIL (pre-slice) + brudi-gate-complexity.sh pre-slice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: 4
Passed:      4
Failed:      0

✅ All tests passed!
```

### Verbose Mode

For detailed output including commands and exit codes:

```bash
bash docs/internal/fixtures/run-tests.sh verbose
```

This prints:
- Full command executed
- Complete stdout/stderr from each gate
- Actual vs expected exit codes

---

## How Tests Work

### Test Execution Flow

```
run-tests.sh
├── Verify dependencies (gate files exist)
├── For each fixture:
│   ├── Change to fixture directory
│   ├── Execute gate script
│   ├── Capture exit code and output
│   ├── Compare against expected outcome
│   ├── Report result (PASS/FAIL)
│   └── Return to original directory
└── Print summary and exit with appropriate code
```

### Test Return Values

- **Exit 0:** All tests passed as expected
- **Exit 1:** At least one test had unexpected outcome
- **Exit 2:** Setup error (missing files/dependencies)

---

## Adding New Fixtures

### Template for New PASS Fixture

```bash
# 1. Create directory structure
mkdir -p docs/internal/fixtures/my-new-pass/{src/{app,components,styles},.brudi}

# 2. Create .brudi/state.json with minimal valid state
cat > docs/internal/fixtures/my-new-pass/.brudi/state.json <<'EOF'
{
  "version": "1.0",
  "brudi_version": "3.4.0",
  "mode": "BUILD",
  "phase": 1,
  "project": "My New Fixture",
  "phase_gate_passed": { "0_to_1": true },
  "slices": [],
  "gates": {
    "last_check": "2026-02-24T12:00:00Z",
    "last_check_result": "pass",
    "last_check_errors": []
  }
}
EOF

# 3. Create minimal passing src/ structure
# → Constraint fixtures need: globals.css, Container usage, Section IDs
# → Complexity fixtures need: materiality-tokens.css, GSAP animations, 3+ easings

# 4. Add test to run-tests.sh
run_test \
  "my-new-pass" \
  "$FIXTURES_DIR/my-new-pass" \
  "$GATE_CONSTRAINTS" \
  "check-all" \
  0
```

### Template for New FAIL Fixture

```bash
# Similar structure, but:
# → Create violations deliberately (wrong max-w counts, transition: all, etc.)
# → Expect exit code 1 in run_test call
run_test \
  "my-new-fail" \
  "$FIXTURES_DIR/my-new-fail" \
  "$GATE_CONSTRAINTS" \
  "check-all" \
  1
```

---

## Extending for Future Gates

### Adding a New Gate Check

1. **Create gate script** (e.g., `brudi-gate-accessibility.sh`)
2. **Create PASS fixture** demonstrating compliance
3. **Create FAIL fixture** demonstrating violations
4. **Add tests to `run-tests.sh`:**

```bash
run_test \
  "accessibility-PASS" \
  "$FIXTURES_DIR/accessibility-PASS" \
  "$GATE_ACCESSIBILITY" \
  "check-all" \
  0

run_test \
  "accessibility-FAIL" \
  "$FIXTURES_DIR/accessibility-FAIL" \
  "$GATE_ACCESSIBILITY" \
  "check-all" \
  1
```

### Testing Individual Gate Checks

Test a single check without running the whole suite:

```bash
# Test only constraint containers
PROJECT_ROOT=/path/to/brudi bash \
  /path/to/brudi/orchestration/brudi-gate-constraints.sh \
  check-containers

# Test only complexity forbidden patterns
cd /path/to/fixture && bash /path/to/brudi/orchestration/brudi-gate-complexity.sh pre-slice
```

---

## Gate Script Reference

### `brudi-gate-constraints.sh`

**Location:** `orchestration/brudi-gate-constraints.sh`

**Checks:**
- `check-containers` — Max-w-* consistency (≤4 unique values)
- `check-text-wrapping` — Text has padding/Container context
- `check-spacing-tokens` — Py-*/gap-* variance (≤6 unique)
- `check-section-ids` — Homepage sections have id attributes
- `check-token-adoption` — Token definition vs usage ratio
- `check-all` — Runs all 5 checks

**Exit Codes:**
- `0` = All checks passed
- `1` = At least one check failed

---

### `brudi-gate-complexity.sh`

**Location:** `orchestration/brudi-gate-complexity.sh`

**Checks (pre-slice):**
- Token completeness (globals.css, materiality-tokens.css)
- Motion tokens (--duration-*, --easing-*)
- 4-layer color system

**Checks (post-slice):**
- Forbidden patterns (transition: all, gsap.from(), etc.)
- Creative metrics:
  - 5+ GSAP/ScrollTrigger calls
  - 3+ unique easing types
  - 3+ depth layers used

---

## Troubleshooting

### Test Fails Unexpectedly

**Problem:** A test that should PASS fails

```
❌ constraint-PASS + brudi-gate-constraints.sh check-all (got exit 1, expected 0)
```

**Solution:**
1. Run in verbose mode: `bash run-tests.sh verbose`
2. Check the actual gate output
3. Verify fixture files against expected patterns
4. Example:
   ```bash
   cd docs/internal/fixtures/constraint-PASS
   bash ../../orchestration/brudi-gate-constraints.sh check-all
   ```

### Gate Script Not Found

```
ERROR: brudi-gate-constraints.sh not found at /path/to/orchestration/brudi-gate-constraints.sh
```

**Solution:**
- Run from repo root: `bash docs/internal/fixtures/run-tests.sh`
- Or set `REPO_ROOT` env var: `REPO_ROOT=/path/to/brudi bash run-tests.sh`

### Permission Denied

```
bash: run-tests.sh: Permission denied
```

**Solution:**
```bash
chmod +x docs/internal/fixtures/run-tests.sh
bash docs/internal/fixtures/run-tests.sh
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Verify Gates
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run verification harness
        run: bash docs/internal/fixtures/run-tests.sh
```

### Local Git Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
bash docs/internal/fixtures/run-tests.sh || exit 1
```

---

## Summary

The Verification Harness provides:

✅ **4 Comprehensive Fixtures** covering PASS/FAIL cases
✅ **Automated Test Runner** with clear pass/fail reporting
✅ **Verbose Mode** for debugging
✅ **CI-Ready** exit codes
✅ **Extensible** design for new gates

All tests are **locally executable**, require **no external dependencies**, and take **~1 second** to run.

---

**Last Updated:** 2026-02-24
**Brudi Version:** 3.4.0
**Test Coverage:** Constraint & Complexity Gates
