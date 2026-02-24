# Integration Patch: Spacing Consistency Gate

This document shows exactly how to integrate `brudi-gate-constraints.sh` into the main `brudi-gate.sh` orchestrator.

## File Affected
`orchestration/brudi-gate.sh`

## Changes Required

### 1. Load the Constraints Module (similar to Complexity Module)

**Location:** After line 98 (after `brudi-gate-complexity.sh` is sourced)

**Add this code:**

```bash
# ── Load Constraints Check Module ─────────────────────────────────────────────
CONSTRAINTS_MODULE="$(dirname "$0")/brudi-gate-constraints.sh"
if [ -f "$CONSTRAINTS_MODULE" ]; then
  source "$CONSTRAINTS_MODULE"
fi
```

### 2. Call Constraint Checks in `cmd_post_slice()`

**Location:** In the `cmd_post_slice()` function, after line 275 (after Complexity Floor check)

**Add this code:**

```bash
  # 8. Spacing Consistency Constraints (blocking)
  if type check_containers &>/dev/null && type check_all &>/dev/null; then
    # Run all constraint checks for this slice
    echo ""
    echo "Running Spacing Consistency Gate checks..."
    bash "$CONSTRAINTS_MODULE" check-all || die "Spacing Consistency Gate failed for slice $slice_id"
  fi
```

**Updated `cmd_post_slice()` section (lines 272-276):**

```bash
  # 7. Creative DNA Complexity Floor (forbidden patterns + creative metrics)
  if type run_complexity_check &>/dev/null; then
    run_complexity_check "post-slice" "$slice_id" || die "Creative DNA Complexity Floor Violations in slice $slice_id"
  fi

  # 8. Spacing Consistency Constraints (blocking)
  if type check_containers &>/dev/null && type check_all &>/dev/null; then
    echo ""
    echo "Running Spacing Consistency Gate checks..."
    bash "$CONSTRAINTS_MODULE" check-all || die "Spacing Consistency Gate failed for slice $slice_id"
  fi

  pass "Post-slice check passed for slice $slice_id. All evidence complete."
```

## Why This Integration Pattern

1. **Lazy Loading:** Only sources if the file exists (graceful degradation)
2. **Function Detection:** Checks if constraint functions are available before calling
3. **Blocking Gate:** Uses `||` pattern with `die()` to block on violations
4. **Staged Execution:** Runs AFTER Complexity Floor check, allowing creative checks to pass before layout discipline is enforced
5. **Clear Output:** Echoes before running so users see which gate is executing

## Exit Code Behavior

- **Exit 0:** All constraint checks pass, slice continues to completion
- **Exit 1:** Any constraint check fails, `die()` is called with detailed error message
- **No change to state:** If this is the first time constraints are checked, the state.json remains valid (no schema update needed)

## Testing Integration

After applying the patch:

```bash
# Test with FAIL fixture
cd docs/internal/fixtures/constraint-gate-FAIL
BRUDI_STATE_FILE=.brudi/state.json bash orchestration/brudi-gate.sh post-slice 1
# Should fail on constraints

# Test with PASS fixture
cd docs/internal/fixtures/constraint-gate-PASS
BRUDI_STATE_FILE=.brudi/state.json bash orchestration/brudi-gate.sh post-slice 1
# Should pass constraints
```

## Backward Compatibility

- Existing projects without `src/` directory are safe (early exit in `check_src_exists()`)
- Projects without tokens/spacing are warned, not blocked (non-critical for pre-phase-0)
- The module loads silently if the file doesn't exist
- No state.json schema changes required

## Performance Impact

- Each constraint check runs ~100-500ms (depend on codebase size)
- Uses shell builtins (`find`, `grep`) — no external dependencies beyond what Brudi already requires
- No Node.js or build tool invocation
- Total time for all 5 checks: ~2 seconds on typical project

## Failure Messages

When constraints fail, users see:

```
❌ GATE FAILED: Spacing Consistency Gate failed for slice 1
  Check A: Container inconsistency: 5 different max-w-* values found (max allowed: 4)
  Check B: Text wrapping issue in ./src/app/page.tsx
  Check C: Spacing variance too high: 8 different py-*/gap-*/space-y-* values found (max: 6)
  Check D: Section IDs missing: 0/2 sections have id attributes
```

Users then fix the issues and re-run `post-slice` to verify constraints pass.
