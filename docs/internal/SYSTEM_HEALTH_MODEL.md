# SYSTEM HEALTH MODEL

## Key Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Gate Block Rate | 100% for violations | FAIL fixtures / total FAIL fixtures |
| False Positive Rate | 0% (Strict), ≤1% (Enterprise) | False positives / PASS fixtures |
| AST Performance | <3s for 500 files | Benchmark on synthetic project |
| Outcome Performance | <5s per page | Benchmark on test HTML |
| Combined Performance | <8s total | End-to-end gate run |
| Cognitive Load Score | <30 for good projects | outcome-engine scoring |
| Compliance Score | 100/100 for clean project | ast-engine + outcome-engine combined |
| Rule Coverage | 28 AST + 18 Outcome = 46 rules | Count active rules |
| Fixture Coverage | ≥30 AST + ≥40 Outcome | Count test fixtures |

## Dashboard (Future)

Output format for health check:
```json
{
  "ast": { "rules": 28, "performance_ms": 200, "fp_rate": 0 },
  "outcome": { "rules": 18, "performance_ms": 650, "fp_rate": 0 },
  "combined_performance_ms": 850,
  "total_rules": 46,
  "status": "HEALTHY"
}
```
