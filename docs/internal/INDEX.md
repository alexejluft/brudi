# Verification Harness Index

## Quick Start

To run the complete test suite:

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
bash docs/internal/fixtures/run-tests.sh
```

Expected: All 4 tests pass, exit code 0.

---

## Documentation Files

| File | Purpose |
|------|---------|
| `/docs/internal/VERIFICATION_HARNESS.md` | Complete harness documentation with test details, troubleshooting, and extension guide |
| `/docs/internal/HARNESS_SUMMARY.md` | Build summary with files created, test results, and design decisions |
| `/docs/internal/INDEX.md` | This file - quick navigation |

---

## Test Fixtures

### Constraint Gate Fixtures

#### `docs/internal/fixtures/constraint-PASS/`

**Purpose:** Demonstrates a project passing all 5 constraint checks.

**Files:**
- `.brudi/state.json` - Valid project state
- `src/app/page.tsx` - Homepage with sections
- `src/components/Container.tsx` - Layout primitive component
- `src/components/hero.tsx` - Hero section using Container
- `src/components/features.tsx` - Features section using Container
- `src/lib/tokens.ts` - Token bridge file
- `src/styles/globals.css` - 4-layer tokens + motion tokens

**Passes Checks:**
- A: Container Primitive Usage (2 unique max-w-* values)
- B: Text Wrapping (all text in Container context)
- C: Spacing Consistency (3 unique py-*/gap-* values)
- D: Section IDs (sections have id attributes)
- E: Token Adoption (100% - 8 tokens defined, 8+ used)

**Test Command:**
```bash
cd docs/internal/fixtures/constraint-PASS
bash ../../../../orchestration/brudi-gate-constraints.sh check-all
# Expected exit code: 0
```

---

#### `docs/internal/fixtures/constraint-FAIL/`

**Purpose:** Demonstrates violations of all 5 constraint checks.

**Files:**
- `.brudi/state.json` - Valid state
- `src/app/page.tsx` - Homepage without proper sections
- `src/components/hero.tsx` - Direct HTML without Container
- `src/components/features.tsx` - 8 different spacing values
- `src/styles/globals.css` - Minimal tokens

**Fails Checks:**
- A: Container Inconsistency (10 different max-w-* values, limit 4)
- B: Text Wrapping (no padding context, no Container)
- C: Spacing Variance (11 different py-*/gap-* values, limit 6)
- D: No Section IDs (uses raw divs, no id attributes)
- E: Token Adoption (0% - 2 tokens defined, 0 used)

**Test Command:**
```bash
cd docs/internal/fixtures/constraint-FAIL
bash ../../../../orchestration/brudi-gate-constraints.sh check-all
# Expected exit code: 1 (failure)
```

---

### Complexity Gate Fixtures

#### `docs/internal/fixtures/complexity-PASS/`

**Purpose:** Demonstrates a project passing complexity/creativity gates.

**Files:**
- `.brudi/state.json` - Valid state with phase 1
- `src/app/page.tsx` - Homepage
- `src/components/hero.tsx` - Hero with 5+ GSAP animations
- `src/styles/globals.css` - 4-layer color tokens + motion tokens
- `src/styles/materiality-tokens.css` - Shadow/blur tokens

**Passes Checks:**
- Token completeness: 4-layer colors, motion tokens present
- Creative metrics: 5+ GSAP calls, 3+ easing types, 4 depth layers
- No forbidden patterns

**Test Command:**
```bash
cd docs/internal/fixtures/complexity-PASS
BRUDI_STATE_FILE=.brudi/state.json bash ../../../../orchestration/brudi-gate.sh pre-slice
# Expected exit code: 0
```

---

#### `docs/internal/fixtures/complexity-FAIL/`

**Purpose:** Demonstrates complexity gate violations.

**Files:**
- `.brudi/state.json` - Valid state (phase 0)
- `src/components/hero.tsx` - Has forbidden pattern (transition: all)
- `src/styles/globals.css` - Incomplete 4-layer tokens

**Fails Checks:**
- Token completeness: Missing materiality-tokens.css
- Incomplete 4-layer color tokens (missing elevated, surface, surface-high)
- No motion tokens (--duration-*, --easing-*)
- Forbidden pattern: `transition: all` in CSS

**Test Command:**
```bash
cd docs/internal/fixtures/complexity-FAIL
BRUDI_STATE_FILE=.brudi/state.json bash ../../../../orchestration/brudi-gate.sh pre-slice
# Expected exit code: 1 (failure)
```

---

## Test Runner

### `docs/internal/fixtures/run-tests.sh`

Automated test harness runner.

**Usage:**
```bash
# Quick run (summary only)
bash run-tests.sh

# Verbose output (shows all gate output)
bash run-tests.sh verbose
```

**What It Does:**
1. Runs constraint-PASS, expects exit 0
2. Runs constraint-FAIL, expects exit 1
3. Runs complexity-PASS, expects exit 0
4. Runs complexity-FAIL, expects exit 1
5. Reports summary with pass/fail count

**Exit Codes:**
- 0 = All tests passed as expected
- 1 = At least one test had unexpected outcome
- 2 = Setup error (missing files)

**Output Format:**
```
✅ constraint-PASS + brudi-gate-constraints.sh check-all
✅ constraint-FAIL + brudi-gate-constraints.sh check-all
✅ complexity-PASS (pre-slice via brudi-gate) + brudi-gate.sh pre-slice
✅ complexity-FAIL (pre-slice via brudi-gate) + brudi-gate.sh pre-slice

Total Tests: 4
Passed: 4
Failed: 0

✅ All tests passed!
```

---

## Gate Scripts Reference

### `orchestration/brudi-gate-constraints.sh`

**Checks:**
- `check-all` - Runs all 5 checks (A-E)
- `check-containers` - Container max-w-* consistency
- `check-text-wrapping` - Text element padding context
- `check-spacing-tokens` - Py-*/gap-* variance
- `check-section-ids` - Homepage section id attributes
- `check-token-adoption` - Token definition vs usage

**Usage:**
```bash
PROJECT_ROOT=/path/to/project bash orchestration/brudi-gate-constraints.sh check-all
```

---

### `orchestration/brudi-gate-complexity.sh`

**Checks (pre-slice):**
- Token completeness (globals.css, materiality-tokens.css)
- Motion token definitions (--duration-*, --easing-*)

**Checks (post-slice):**
- Forbidden patterns (transition: all, gsap.from(), etc.)
- Creative metrics (5+ GSAP, 3+ easings, 3+ depth layers)

**Usage (via brudi-gate.sh):**
```bash
BRUDI_STATE_FILE=.brudi/state.json bash orchestration/brudi-gate.sh pre-slice
```

---

## Directory Structure

```
mnt/brudi/
├── orchestration/
│   ├── brudi-gate.sh              # Main gate runner
│   ├── brudi-gate-complexity.sh   # Complexity checks (sourced)
│   └── brudi-gate-constraints.sh  # Constraint checks
└── docs/internal/
    ├── INDEX.md                   # This file
    ├── VERIFICATION_HARNESS.md    # Full documentation
    ├── HARNESS_SUMMARY.md         # Build summary
    └── fixtures/
        ├── run-tests.sh           # Test runner (executable)
        ├── constraint-PASS/       # Passing constraint test
        │   ├── .brudi/state.json
        │   └── src/
        ├── constraint-FAIL/       # Failing constraint test
        │   ├── .brudi/state.json
        │   └── src/
        ├── complexity-PASS/       # Passing complexity test
        │   ├── .brudi/state.json
        │   └── src/
        └── complexity-FAIL/       # Failing complexity test
            ├── .brudi/state.json
            └── src/
```

---

## Test Matrix

| Fixture | Gate | Expected Outcome | Status |
|---------|------|------------------|--------|
| constraint-PASS | brudi-gate-constraints.sh | Exit 0 | ✅ PASS |
| constraint-FAIL | brudi-gate-constraints.sh | Exit 1 | ✅ PASS |
| complexity-PASS | brudi-gate.sh (pre-slice) | Exit 0 | ✅ PASS |
| complexity-FAIL | brudi-gate.sh (pre-slice) | Exit 1 | ✅ PASS |

---

## Development Notes

### Minimal Design
- Each fixture contains only the patterns gates check
- No build dependencies (no npm install required)
- Portable across systems (bash, grep, find only)
- Fast execution (~1 second total)

### Both Directions
- Tests prove gates work for both PASS and FAIL
- Intentional violations document gate behavior
- Exit codes validated (0 vs 1)

### Extensible
- Adding new tests: Copy fixture template, update run-tests.sh
- New gates: Create fixture pair (PASS/FAIL), add test case
- See VERIFICATION_HARNESS.md for detailed extension guide

---

## Next Steps

### For Testing
1. Run `bash docs/internal/fixtures/run-tests.sh`
2. Verify all 4 tests pass
3. Run in verbose mode if debugging: `bash run-tests.sh verbose`

### For Documentation
- Full details: See `VERIFICATION_HARNESS.md`
- Build summary: See `HARNESS_SUMMARY.md`
- This quick reference: Index.md (this file)

### For Extension
- Add new fixture following templates
- Update run-tests.sh with new test case
- See VERIFICATION_HARNESS.md for detailed instructions

---

**Brudi Version:** 3.4.0  
**Last Updated:** 2026-02-24  
**Status:** Production-Ready
