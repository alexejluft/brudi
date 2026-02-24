# Strategic Execution Map
## Brudi System Evolution - Layer Architecture

### Layer Dependency Diagram

```
Layer 1 (Process/brudi-gate.sh)
         ↓
Layer 2 (Evidence/brudi-gate.sh)
         ↓
Layer 3 (Complexity/brudi-gate-complexity.sh)
         ↓
Layer 4 (Constraints/brudi-gate-constraints.sh)
         ↓
Layer 5 (AST/ast-engine NEW)
         ↓
Layer 6 (Outcome/outcome-engine NEW)
```

### Critical Dependencies

**Layer 6 depends on Layer 5 data:**
- Tailwind class parsing results
- Token usage metrics
- Import graph analysis
- Violation report structure

**Layer 5 is dependency-free:**
- Uses local-only tools: Babel, TypeScript Compiler API
- No external rendering or headless browser required
- Zero transitive dependencies on Layer 6

### Integration Architecture

**Entry point:** `brudi-gate.sh` (Layer 1-4 handler)

**Flow:**
1. Layers 1-4 execute existing gate checks
2. Call `ast-engine/index.ts` via `node` command
   - Parses JSX, Tailwind, TypeScript, tokens
   - Returns structured violation JSON
3. Call `outcome-engine/index.ts` via `node` command
   - Receives AST violation data
   - Analyzes rendered DOM via Playwright
   - Returns quality score + blocking decisions

**Sequence requirement:** AST FIRST, Outcome SECOND
- AST has zero external dependencies
- Outcome requires Playwright + headless Chromium setup
- Lower risk / higher probability of success first

### Data Flow

```
Source Code → AST Engine → Violation Report (JSON)
                              ↓
                         Outcome Engine → Quality Score + Decisions
                              ↓
                         Gate Decision (PASS/FAIL/WARN)
```

**JSON schema stability:** Locked from Day 1 to prevent Outcome refactoring if AST changes.

### Build + Runtime Assumptions

- Node.js 18+ available in CI/gate environment
- Playwright can install @playwright/browser in CI environment
- AST processing: <3s per file
- Outcome processing: <5s per component
- Both engines fail gracefully (fallback to existing layers if either engine unavailable)

