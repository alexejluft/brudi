# Risk Matrix
## Brudi System Evolution - Phase 0 Risk Assessment

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|-----------|
| 1 | AST false positives on edge cases | M | H | Fixture testing per rule (10+ fixtures per rule) |
| 2 | Babel parser version mismatch with project TS version | L | H | Pin @babel/parser to LTS, test against 5 TS versions |
| 3 | Performance regression: AST adds >3s | M | H | Parallel file processing, early exit on first violation |
| 4 | Playwright install fails in CI/agent env | H | M | Fallback to static analysis only, skip Outcome layer |
| 5 | Outcome scoring too subjective | M | H | Calibrate on 40+ fixtures, document thresholds with rationale |
| 6 | Layer conflict: AST blocks but Outcome passes | M | M | AST blocking takes precedence (fail-fast policy) |
| 7 | Layer conflict: Outcome blocks but AST passes | M | M | Both layers independent, union of violations reported |
| 8 | Scope explosion in Tailwind analyzer | H | M | Limit analyzer to defined token set only, reject unknown classes |
| 9 | TypeScript Compiler API memory usage on large projects | M | M | Incremental compilation, file-by-file analysis, memory profiling |
| 10 | Import graph analyzer circular detection false positive | M | H | Whitelist known circular patterns, test on real monorepo |
| 11 | Cognitive Load score miscalibrated | M | H | Test against 10 known-good, 10 known-bad projects, establish baseline |
| 12 | CTA detection in dynamic content | M | L | Analyze static JSX only, skip dynamic rendering analysis |
| 13 | Heading hierarchy false positive with decorative text | M | M | Only analyze semantic heading tags (h1-h6), skip aria-label |
| 14 | Grid column analysis misses responsive breakpoints | L | M | Analyze default breakpoint only in Phase 1, defer responsive to Phase 2 |
| 15 | Dead module accumulation over time | L | M | Module registry with usage tracking, purge unused every 90 days |
| 16 | Agent coordination merge conflicts | M | M | Agent isolation + sequential integration, no parallel fixture testing |
| 17 | Refactor cost if AST schema changes after Outcome built | L | H | Lock JSON output schema from Day 1, versioned changes require both engines |

### High-Priority Mitigations

**Probability=H:**
- Risk 4: Playwright CI failures → Test in actual CI env during Week 1 (Day 5)
- Risk 8: Tailwind scope explosion → Whitelist design tokens config before analyzer built

**Impact=H:**
- Risk 2: Parser mismatch → Create version matrix test before building rules
- Risk 3: Performance → Establish <3s baseline with empty project before rule implementation
- Risk 5: Outcome subjectivity → Build calibration fixture set in parallel with scoring engine
- Risk 10: Import circular detection → Run against actual import graph, not mock
- Risk 11: Cognitive Load miscalibration → Establish baseline with 20 reference projects
- Risk 17: AST schema change → Code review lock on JSON schema changes, require both teams approval

