# Final Execution Decision
## Brudi System Evolution - Phase 0 Approval

## Decision Statement

**AST Engine (Mission A) shall be built and deployed FIRST. Outcome Engine (Mission B) shall follow.**

---

## Technical Justification

### 1. DEPENDENCY ASYMMETRY
**Outcome depends on AST. AST depends on nothing from Outcome.**

Arrow is one-way:
```
AST Engine → Outcome Engine (data flow)
Outcome Engine ↛ AST Engine (no reverse dependency)
```

Logical consequence: Complete the dependency first.

**Implementation impact:** Outcome requires AST output (Tailwind class list, token metrics, import graph structure). If AST changes after Outcome is built, Outcome must refactor. Building AST first stabilizes the data contract.

---

### 2. TOOLING COMPLEXITY
**AST uses local-only tools. Outcome requires external infrastructure.**

AST Engine dependencies:
- Babel parser (local, no network)
- TypeScript Compiler API (local, no network)
- Node.js built-ins (local)

Outcome Engine dependencies:
- Babel parser (local)
- Playwright (requires browser download, ~200MB)
- Headless Chromium (requires system resources)
- External render server (potential timeout risk)

**Risk implication:** Outcome has 5x failure modes (Playwright install, Chromium crash, render timeout, memory pressure, network flakiness). Lower complexity first = higher probability of success.

---

### 3. VALIDATION DIFFICULTY
**AST rules are binary. Outcome rules are heuristic.**

AST example:
- Tailwind class validation: `tokens.includes('bg-red-500')` → YES/NO
- TS unused export: `!usageGraph.has(exportName)` → YES/NO
- Hardcoded rules, deterministic, testable against fixtures

Outcome example:
- Cognitive Load: `(visualElements / viewportArea) * tokenCount / (maxTokens * maxElements)` → 0-100 (heuristic)
- CTA Prominence: weighted combination of (size, contrast, position, color) → subjective
- Rules depend on calibration curves, baseline thresholds, domain experience

**Validation implication:** Binary rules are easier to validate (true/false pass). Heuristic rules require 40+ fixtures + domain review. Build the thing that's easier to validate first.

---

### 4. INTEGRATION COMPLEXITY
**AST plugs into existing gate with a simple `node` call. Outcome requires a build + render + analyze pipeline.**

AST integration (simple):
```bash
# In brudi-gate.sh Layer 5
ast_result=$(node ./ast-engine/index.ts "$file")
if [[ $ast_result == *"violation"* ]]; then exit 1; fi
```

Outcome integration (complex):
```bash
# In brudi-gate.sh Layer 6
# Build component in isolation
npm run build:component "$component" --output /tmp/component
# Start headless server
server=$(node ./outcome-engine/server.ts --port 3333 &)
# Wait for server health check
# Render component
curl http://localhost:3333/render?component=$component > /tmp/dom.html
# Analyze
analysis=$(node ./outcome-engine/analyze.ts /tmp/dom.html)
# Cleanup
kill $server
```

**Complexity implication:** Simple integration first. Outcome integration touches CI/build orchestration. Wait until AST proves the pattern works.

---

### 5. REFACTOR COST AVOIDANCE
**If AST schema changes after Outcome is built, Outcome must refactor.**

Example breaking change:
- Week 1: AST produces `{ violations: [ { type: "unknown-class", class: "bg-red-999" } ] }`
- Week 4: Team realizes Tailwind class name could be 50 chars; refactor to `{ violations: [ { type: "unknown-class", class: "...", context: {...} } ] }`
- **Impact:** Outcome parser breaks. Must rewrite JSON parsing logic. 2-3 days lost.

**Cost avoidance:** Lock AST JSON schema from Day 1 (end of Week 2). Code review on schema changes requires both teams' approval. Building AST first means the schema is finalized before Outcome's parser is written.

---

## What Must NEVER Run in Parallel

**AST fixture testing (Phase 1, Week 4) and Outcome fixture testing (Phase 3, Week 9) modify shared test project state.**

Conflict example:
- AST Week 4: Create test component with Tailwind class `bg-red-500`
- Outcome Week 9: Modifies same component to analyze rendered outcome
- Both write to same fixture file → merge conflict, test failure

**Constraint:** Sequential fixture testing. Phase 1 Week 4 must complete before Phase 3 Week 9 starts. Add explicit gate in sprint planning.

---

## Production Deployment Readiness

AST engine is deployable after Phase 1 (Day 30) provided:
- 0 false positives in audit
- <3s performance gate met
- All 4 existing layers still pass

Outcome engine is deployable only after Phase 4 (Day 90):
- Governance documentation complete
- Layer conflict resolution documented
- Severity scoring finalized
- Metrics infrastructure in place

---

## Sign-Off

This decision prioritizes **dependency logic** (AST first), **tooling simplicity** (local-only tools first), and **validation ease** (binary rules first). It de-risks the project by building the lower-complexity piece first and stabilizing the data contract before the dependent piece begins.

**Build start:** Phase 1, Day 1
**Decision locked:** Immediately

