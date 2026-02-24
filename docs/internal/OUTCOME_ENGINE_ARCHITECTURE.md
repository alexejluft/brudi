# OUTCOME ENGINE ARCHITECTURE — Layer 6

**Version:** 1.0.0
**Date:** 2026-02-24
**Status:** PRODUCTION READY

---

## System Overview

Layer 6 analyzes rendered HTML for visual and UX quality.

Technology: Playwright (Headless Chromium) + DOM computed styles
Runtime: Node.js 22 (ESM)
Location: /orchestration/outcome-engine/

---

## Module Map

| Module | File | Checks |
|--------|------|--------|
| DOM Extractor | dom-extractor.js | Headings, sections, text, grids, buttons, fonts |
| Typography | typography-analyzer.js | Hierarchy, ratio, body size, font variance, line height |
| Layout | layout-analyzer.js | Section density, spacing, grid density, grid balance |
| Animation Density | animation-density-analyzer.js | Page total, per-section avg, element ratio |
| Cognitive Load | cognitive-load-analyzer.js | Weighted formula score |
| CTA Prominence | cta-analyzer.js | Above fold, font size, padding |
| Scoring Engine | scoring-engine.js | 0-100 score, BLOCK/WARNING/PASS |

---

## Scoring Model

Base score: 100

Deductions:
| Violation | Impact |
|-----------|--------|
| HEADING_HIERARCHY | -15 |
| BODY_TEXT_TOO_LARGE | -10 |
| SECTION_OVERLOAD | -15 |
| GRID_TOO_DENSE | -10 |
| COGNITIVE_OVERLOAD | -15 |
| ANIMATION_OVERLOAD | -10 |
| HEADING_RATIO | -5 |
| FONT_VARIANCE | -5 |
| LINE_HEIGHT | -3 |
| SECTION_SPACING | -5 |
| GRID_IMBALANCE | -5 |
| DOUBLE_HERO | -5 |
| SECTION_ANIMATION_DENSITY | -5 |
| ANIMATION_RATIO | -5 |
| NO_CTA_ABOVE_FOLD | -5 |
| CTA_TOO_SMALL | -3 |
| CTA_LOW_PADDING | -3 |

Thresholds:
- < 70 → BLOCK (exit 1)
- 70-85 → WARNING (exit 0)
- > 85 → PASS (exit 0)

---

## Integration

brudi-gate.sh line ~330:
Checks for pre-built HTML (out/index.html, dist/index.html, public/index.html).
If found, runs outcome engine. If score < 70 → die.

---

## Performance

~650ms per page (Chromium launch + render + DOM extraction + analysis).
Target: <5s → ACHIEVED.
