# OUTCOME SCORE MODEL

## Formula

Score = 100 + sum(violation.score_impact)

Clamped to [0, 100].

## Cognitive Load Sub-Score

CL = (Sections × 1.5) + (Animations × 1.2) + (FontVariance × 1.0) + (GridVariance × 1.0) + (ColorVariance × 1.2)

## Decision Matrix

| Score | Level | Action |
|-------|-------|--------|
| 0-69 | BLOCK | Exit 1 — cannot proceed |
| 70-85 | WARNING | Exit 0 — proceed with caution |
| 86-100 | PASS | Exit 0 — quality confirmed |

## Calibration Evidence

| Fixture | Score | Level | Correct? |
|---------|-------|-------|----------|
| good-page.html | 95 | PASS | ✅ |
| bad-page.html | 22 | BLOCK | ✅ |

Thresholds calibrated on 2 reference fixtures. Production calibration requires 40+ fixtures.
