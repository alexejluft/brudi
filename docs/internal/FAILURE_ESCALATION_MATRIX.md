# FAILURE ESCALATION MATRIX

| Condition | Action | Escalation |
|-----------|--------|------------|
| AST blocks, Outcome passes | Block. AST violation is structural. | None — correct behavior |
| Outcome blocks, AST passes | Block. Visual quality below threshold. | Review score threshold |
| Performance > 3s (AST) | Warning. Log to metrics. | Optimize if >5s |
| Performance > 5s (Outcome) | Warning. Log to metrics. | Optimize if >8s |
| Combined > 8s | Warning. Consider parallel execution. | Required optimization |
| False Positive > 2% | Pause rule. Add to exemption list. | Fix rule, re-audit |
| False Negative discovered | Add fixture. Implement check. | Immediate patch |
| Layer conflict (contradictory) | Both reported. First die() wins. | Review rule overlap |
