#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# run-tests.sh — Verification Harness Test Runner
#
# Executes all fixtures against the relevant gate scripts and reports results.
#
# Usage:
#   bash run-tests.sh
#   bash run-tests.sh verbose  # Show all output, not just summary
#
# Exit codes:
#   0 = All tests passed as expected
#   1 = At least one test failed or unexpected outcome
# ─────────────────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
FIXTURES_DIR="$(cd "$(dirname "$0")" && pwd)"
GATE_CONSTRAINTS="$REPO_ROOT/orchestration/brudi-gate-constraints.sh"
GATE_COMPLEXITY="$REPO_ROOT/orchestration/brudi-gate-complexity.sh"
GATE_MAIN="$REPO_ROOT/orchestration/brudi-gate.sh"

VERBOSE="${1:-}"
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# ── Helper functions ───────────────────────────────────────────────────────

print_header() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BLUE}  $1${RESET}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
}

run_test() {
  local fixture_name="$1"
  local fixture_path="$2"
  local gate_script="$3"
  local gate_check="${4:-check-all}"
  local expected_exit="$5"

  TOTAL_TESTS=$((TOTAL_TESTS + 1))

  local test_name="${fixture_name} + $(basename "$gate_script") ${gate_check}"

  # Run the gate check in the fixture directory
  local exit_code=0
  local output=""

  if [ -n "$VERBOSE" ]; then
    echo -e "${YELLOW}Running: $test_name${RESET}"
    echo "Command: cd $fixture_path && bash $gate_script $gate_check"
    echo ""
  fi

  cd "$fixture_path"
  set +e
  output=$(BRUDI_STATE_FILE=.brudi/state.json bash "$gate_script" "$gate_check" 2>&1)
  exit_code=$?
  set -e
  cd - > /dev/null

  # Check if result matches expected
  if [ "$exit_code" -eq "$expected_exit" ]; then
    if [ -n "$VERBOSE" ]; then
      echo -e "${GREEN}✅ PASS${RESET} — Exit code $exit_code (expected $expected_exit)"
      echo "Output:"
      echo "$output" | sed 's/^/  /'
      echo ""
    else
      echo -e "${GREEN}✅${RESET} $test_name"
    fi
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    if [ -n "$VERBOSE" ]; then
      echo -e "${RED}❌ FAIL${RESET} — Exit code $exit_code (expected $expected_exit)"
      echo "Output:"
      echo "$output" | sed 's/^/  /'
      echo ""
    else
      echo -e "${RED}❌${RESET} $test_name (got exit $exit_code, expected $expected_exit)"
    fi
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# ── Verify dependencies ────────────────────────────────────────────────────

verify_files() {
  if [ ! -f "$GATE_CONSTRAINTS" ]; then
    echo -e "${RED}ERROR: brudi-gate-constraints.sh not found at $GATE_CONSTRAINTS${RESET}" >&2
    exit 2
  fi

  if [ ! -f "$GATE_COMPLEXITY" ]; then
    echo -e "${RED}ERROR: brudi-gate-complexity.sh not found at $GATE_COMPLEXITY${RESET}" >&2
    exit 2
  fi

  if [ ! -d "$FIXTURES_DIR/constraint-PASS" ]; then
    echo -e "${RED}ERROR: Fixture constraint-PASS not found${RESET}" >&2
    exit 2
  fi
}

# ── Run all tests ──────────────────────────────────────────────────────────

main() {
  verify_files

  print_header "BRUDI VERIFICATION HARNESS — TEST SUITE"

  if [ -n "$VERBOSE" ]; then
    echo "Repo Root:        $REPO_ROOT"
    echo "Fixtures Dir:     $FIXTURES_DIR"
    echo "Gate Constraints: $GATE_CONSTRAINTS"
    echo "Gate Complexity:  $GATE_COMPLEXITY"
    echo ""
  fi

  # ── Constraint Gate Tests ──────────────────────────────────────────────────

  print_header "Constraint Gate Tests"

  run_test \
    "constraint-PASS" \
    "$FIXTURES_DIR/constraint-PASS" \
    "$GATE_CONSTRAINTS" \
    "check-all" \
    0

  run_test \
    "constraint-FAIL" \
    "$FIXTURES_DIR/constraint-FAIL" \
    "$GATE_CONSTRAINTS" \
    "check-all" \
    1

  # ── Complexity Gate Tests ──────────────────────────────────────────────────

  print_header "Complexity Gate Tests"

  # Test via brudi-gate.sh pre-slice (which calls complexity checks)
  run_test \
    "complexity-PASS (pre-slice via brudi-gate)" \
    "$FIXTURES_DIR/complexity-PASS" \
    "$GATE_MAIN" \
    "pre-slice" \
    0

  run_test \
    "complexity-FAIL (pre-slice via brudi-gate)" \
    "$FIXTURES_DIR/complexity-FAIL" \
    "$GATE_MAIN" \
    "pre-slice" \
    1

  # ── Summary ────────────────────────────────────────────────────────────────

  print_header "TEST SUMMARY"

  echo "Total Tests: $TOTAL_TESTS"
  echo -e "Passed:      ${GREEN}$TESTS_PASSED${RESET}"
  echo -e "Failed:      ${RED}$TESTS_FAILED${RESET}"
  echo ""

  if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${RESET}"
    echo ""
    return 0
  else
    echo -e "${RED}❌ $TESTS_FAILED test(s) failed${RESET}"
    echo ""
    return 1
  fi
}

main "$@"
