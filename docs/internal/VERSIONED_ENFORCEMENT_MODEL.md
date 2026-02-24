# VERSIONED ENFORCEMENT MODEL

## Enforcement Levels

| Level | Name | Layers Active | False Positive Tolerance |
|-------|------|---------------|-------------------------|
| 1 | Strict | All (1-6) | 0% |
| 2 | Enterprise | 1-5 (no Outcome) | ≤1% |
| 3 | Experimental | 1-4 (no AST, no Outcome) | ≤5% |

## When to Use

- **Strict**: Production deployments, award submissions
- **Enterprise**: Standard development, CI/CD
- **Experimental**: Prototyping, exploration, learning

## Configuration

Set in .brudi/state.json:
```json
{ "enforcement_level": "strict" }
```

Default: "enterprise" (Layer 5 active, Layer 6 optional).
