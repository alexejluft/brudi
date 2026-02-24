# LAYER GOVERNANCE MODEL

## Layer Stack

| Layer | Name | Script | Blocking | Owner |
|-------|------|--------|----------|-------|
| 1 | Process | brudi-gate.sh (mode-check) | YES | Core |
| 2 | Evidence | brudi-gate.sh (post-slice) | YES | Core |
| 3 | Complexity | brudi-gate-complexity.sh | YES | Creative DNA |
| 4 | Constraints | brudi-gate-constraints.sh | YES | Layout |
| 5 | AST | ast-engine/index.js | YES | Compiler |
| 6 | Outcome | outcome-engine/index.js | YES (score<70) | Design Quality |

## Execution Order

Layers execute sequentially: 1 → 2 → 3 → 4 → 5 → 6.
First failure → die. No subsequent layers run.

## Blocking Rights

All layers have blocking rights. The first to fail wins.

## Conflict Resolution

| Scenario | Resolution |
|----------|-----------|
| AST blocks, Outcome would pass | AST wins — structural violation is definitive |
| Outcome blocks, AST passes | Outcome wins — visual quality matters |
| Both block | Both errors reported, first die() terminates |
| Performance > threshold | Warning only, does not block |
| False positive reported | Fix rule, add exemption, re-test |

## Layer Independence

- Layers 1-4: bash-based, no Node dependency
- Layers 5-6: Node.js required
- Layer 6 requires Chromium (Playwright)
- Layers 1-4 can run without 5-6 (graceful degradation)
