# 90-Day Roadmap
## Brudi System Evolution - Mission A → Mission B → Governance

## Phase 1: Days 1-30 | Mission A - AST Enforcement Engine

### Week 1: JSX + Tailwind Analyzers
**Goal:** Close Phase 3 gap (TW class validation)
- Day 1: JSX parser baseline + test infrastructure
- Day 2-3: Tailwind analyzer (token set validation, unknown class detection)
- Day 4-5: First 5 fixtures, gate integration test
- **Exit:** TW violations detected in test project

### Week 2: TypeScript + Token Analyzers
**Goal:** Complete AST data collection
- Day 8-9: TS Compiler API integration (unused exports, circular imports)
- Day 10-11: Token analyzer (color, spacing, font validation)
- Day 12-13: Combine analyzers into single JSON report
- **Exit:** All data types in violation report

### Week 3: Import Graph + Gate Integration
**Goal:** Wired into brudi-gate.sh
- Day 15-16: Import graph analyzer (circular detection, unused modules)
- Day 17-18: Wire ast-engine into Layer 4 of brudi-gate.sh
- Day 19-20: Test gate rejection on known violations
- **Exit:** brudi-gate blocks bad code

### Week 4: Fixtures + Performance + Audit
**Goal:** 0 false positives, <3s
- Day 22-26: Build 30+ fixtures (5 per rule type)
- Day 27: Performance profiling (per file, total)
- Day 28-29: False positive audit (run against 10 reference projects)
- Day 30: Tune thresholds, close false positives
- **Exit:** 0 false positives, 100% violation detection, <3s, fully wired

---

## Phase 2: Days 31-35 | Stability Check

**Goal:** Confirm no regression in existing layers

- Day 31: Full system test (all 4 existing layers + new AST layer)
- Day 32: Run existing test suite with AST enabled
- Day 33-34: Performance regression check (measure Day 1 vs Day 33)
- Day 35: Sign-off meeting
- **Exit:** No regression, all existing tests pass, system ready for Mission B

---

## Phase 3: Days 36-65 | Mission B - Outcome Quality Engine

### Week 6: Playwright Setup + DOM + Typography Analyzers
**Goal:** Rendering pipeline established
- Day 36-37: Playwright setup in CI environment
- Day 38-39: DOM analyzer (semantic structure, accessibility)
- Day 40-41: Typography analyzer (font family, line height, contrast)
- **Exit:** Can analyze rendered DOM

### Week 7: Section Density + Grid Balance + Animation Density
**Goal:** Layout quality metrics
- Day 43-44: Section density analyzer (whitespace analysis)
- Day 45-46: Grid balance analyzer (column distribution, alignment)
- Day 47-48: Animation density analyzer (motion thresholds)
- **Exit:** Layout quality metrics computed

### Week 8: Cognitive Load + CTA + Scoring Engine
**Goal:** Complete outcome assessment
- Day 50-51: Cognitive load analyzer (visual complexity heuristics)
- Day 52-53: CTA analyzer (button/link detection, prominence)
- Day 54-55: Scoring engine (weight rules, threshold calibration)
- **Exit:** Single quality score computed

### Week 9: Fixtures + Calibration + Audit
**Goal:** ≥90% bad designs blocked, 0 false positives
- Day 57-61: Build 40+ fixtures (10 known-good, 30 known-bad)
- Day 62-63: Calibration against fixtures (tune weights)
- Day 64-65: False positive audit (run against 20 reference projects)
- **Exit:** ≥90% bad designs blocked, 0 false positives, <5s per component

---

## Phase 4: Days 66-90 | Governance

**Goal:** Complete operational framework

### Layer Governance Model (Days 66-73)
- Layer priority matrix (which layer wins on conflict)
- Layer versioning strategy
- Deprecated rule sunset timeline

### Versioned Enforcement (Days 74-79)
- Version gate/ast-engine/outcome-engine in tandem
- Backward compatibility policy for JSON schema
- Migration guide for config updates

### Failure Escalation Matrix (Days 80-85)
- Which violations → warning vs error vs block
- Severity scoring (risk per violation type)
- Escalation to security review if needed

### System Health Metrics (Days 86-90)
- Violation distribution dashboard
- False positive rate tracking
- Performance SLA monitoring
- **Exit:** Full governance documentation, metrics infrastructure deployed

---

## Critical Constraints

**No parallel fixture testing:**
- AST fixtures and Outcome fixtures modify shared test project state
- Must run sequentially (Phase 1 Week 4 → Phase 3 Week 9)

**Schema lock from Day 1:**
- JSON output format from AST engine frozen after Week 2
- Changes require both AST and Outcome team approval

**Integration gates:**
- Cannot start Outcome engine until AST produces stable output
- Cannot deploy to production until Phase 4 complete

