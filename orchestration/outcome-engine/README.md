# BRUDI Outcome Quality Engine — Layer 6

A headless Chromium-based quality analyzer that renders HTML pages, extracts DOM metrics via Playwright, and scores page quality on a 0-100 scale.

## Overview

The engine:
1. Takes a static HTML file OR a project directory
2. Renders it in headless Chromium via Playwright
3. Extracts computed styles, typography metrics, and layout data from the DOM
4. Runs heuristic analyzers on typography, layout, animations, cognitive load, and CTAs
5. Computes a 0-100 quality score
6. Blocks deployments if score < 70

## Installation

```bash
npm install
```

## Usage

```bash
# Analyze a single HTML file
node index.js path/to/page.html

# Analyze a project directory (looks for out/index.html, dist/index.html, public/index.html)
node index.js /path/to/project

# Output JSON report
node index.js path/to/page.html --json

# Pass animation count (for integration with AST engine)
node index.js path/to/page.html --animations=5
```

## Exit Codes

- `0` — PASS (score >= 70)
- `1` — BLOCK (score < 70)
- `2` — Usage error

## Architecture

### DOM Extractor (`dom-extractor.js`)
Launches headless Chromium and extracts:
- Heading hierarchy (h1–h6) with font sizes, weights, line heights
- Sections with spacing and dimensions
- Text elements (p, span, li, a, label, td, th) with font metrics
- Grid containers with column counts and child heights
- Buttons/CTAs with font sizes, padding, colors
- Total element count

### Analyzers

**Typography Analyzer** (`typography-analyzer.js`)
- Heading hierarchy must be descending (h1 > h2 > h3)
- Heading ratio ≥ 1.15 between levels
- Body text max 24px (to prevent visual hierarchy collapse)
- Max 6 different font sizes on page
- Line height ratio 1.2–2.0 for body text (readability)

**Layout Analyzer** (`layout-analyzer.js`)
- Max 8 sections per 3 viewports (2700px scroll)
- Min 48px spacing between sections
- Grid columns max 4 (beyond 4 is too dense)
- Grid child height balance (max 2x ratio)
- No hero sections back-to-back (> 80% viewport height each)

**Animation Density Analyzer** (`animation-density-analyzer.js`)
- Max 12 animations per page
- Max 3 animations per section (estimated)
- Animation ratio ≤ 30% of total elements

**Cognitive Load Analyzer** (`cognitive-load-analyzer.js`)
Computes: `(Sections × 1.5) + (Animations × 1.2) + (FontVariance × 1.0) + (GridVariance × 1.0) + (ColorVariance × 1.2)`
- Score > 50 = ERROR (score_impact: -15)
- Score 30–50 = WARNING (score_impact: -5)

**CTA Analyzer** (`cta-analyzer.js`)
- At least 1 button above fold (900px)
- CTA text size ≥ 16px
- CTA padding ≥ 20px total (clickable area)

### Scoring Engine (`scoring-engine.js`)
- Base score: 100
- Deduct violations' score impacts
- Clamp to 0–100
- Levels: BLOCK (<70), WARNING (70–85), PASS (>85)

## Test Fixtures

### Good Page
`/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/docs/internal/outcome-fixtures/good-page.html`

**Expected Result: PASS (95/100)**
- Proper heading hierarchy: h1 (48px) > h2 (32px) > h3 (24px)
- Body text: 18px with 1.6 line height
- 3 sections with 96px padding each
- 3-column grid (balanced)
- 2 CTAs above fold
- Cognitive load: 6.5 (low)

### Bad Page
`/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/docs/internal/outcome-fixtures/bad-page.html`

**Expected Result: BLOCK (22/100)**
- Inverted hierarchy: h1 (24px) < h2 (36px) < h3 (48px)
- Body text: 32px (too large)
- 10 sections (overload)
- 6-column grid (too dense)
- No CTAs
- Line height: 1.0 (too tight)
- 5 errors, 3 warnings
- Cognitive load: 17.0 (high)

## Output Format

### Console (Human-Readable)

```
🎨 BRUDI OUTCOME ENGINE — Layer 6
   HTML: /path/to/page.html
   Elements: 30
   Sections: 3
   Time: 1220ms
   Cognitive Load: 6.5
   Score: 95/100 — PASS

⛔ 5 ERROR(s)
   ❌ [RULE_NAME] Message here
   
⚠️  3 WARNING(s)
   ⚠️  [RULE_NAME] Message here

✅ OUTCOME GATE: PASS (Score 95/100)
```

### JSON Output

```json
{
  "version": "1.0.0",
  "htmlFile": "...",
  "timestamp": "2026-02-24T17:25:20.790Z",
  "analyzeTimeMs": 662,
  "metrics": {
    "headings": 6,
    "sections": 3,
    "textElements": 7,
    "grids": 1,
    "buttons": 2,
    "fontSizes": [18],
    "totalElements": 30,
    "cognitiveLoadScore": 6.5
  },
  "score": 95,
  "level": "PASS",
  "violations": [
    {
      "rule": "SECTION_SPACING",
      "severity": "warning",
      "message": "...",
      "score_impact": -5
    }
  ],
  "summary": {
    "errors": 0,
    "warnings": 1,
    "blocked": false
  }
}
```

## Integration with CI/CD

```bash
# Block on low quality
node index.js /path/to/build/output --json > report.json
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Quality gate failed"
  cat report.json
  exit 1
fi
```

## Future Enhancements

- Color contrast analysis (WCAG AA/AAA)
- Performance metrics (LCP, CLS, FID)
- Accessibility tree validation
- Responsive design breakpoint analysis
- Video/media load optimization
- Dynamic content detection (e.g., for SPA hydration)
