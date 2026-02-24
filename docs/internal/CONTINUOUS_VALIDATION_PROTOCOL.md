# CONTINUOUS VALIDATION PROTOCOL

## When to Run

| Trigger | Layers to Run |
|--------|--------------|
| Pre-commit | 1 (mode check) + 2 (evidence) |
| Post-slice | 1-6 (full stack) |
| Phase gate | 1-6 (full stack) |
| CI/CD | 3-6 (skip process/evidence, focus on code quality) |
| On demand | Any single layer via direct script call |

## Frequency

- Full system test: After every new rule added
- AST-only test: After analyzer changes
- Outcome-only test: After heuristic threshold changes
- Performance profiling: Weekly or after optimization
- False positive audit: After every 10 new rules

## Validation Checklist

Before deploying any rule change:
1. PASS fixtures still pass (0 false positives)
2. FAIL fixtures still fail (0 false negatives)
3. Performance within target
4. No regression in other layers
