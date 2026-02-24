# OUTCOME PERFORMANCE PROFILE

**Date:** 2026-02-24

## Benchmark

| Page | Elements | Sections | Time (ms) | Target |
|------|----------|----------|-----------|--------|
| good-page.html | ~30 | 3 | ~650 | <5000ms ✅ |
| bad-page.html | ~60 | 10 | ~680 | <5000ms ✅ |

## Breakdown

| Phase | Time |
|-------|------|
| Chromium launch | ~400ms |
| Page render | ~50ms |
| DOM extraction | ~100ms |
| Analysis | ~50ms |
| Scoring | ~1ms |

## Optimization Notes

- Chromium launch dominates (~60%). Could be amortized across multiple pages.
- DOM extraction scales linearly with element count.
- Analysis is O(n) where n = extracted elements.
- For CI: consider keeping browser alive across gate runs.
