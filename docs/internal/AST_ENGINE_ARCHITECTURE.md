# AST ENGINE ARCHITECTURE — Layer 5

**Version:** 1.0.0
**Date:** 2026-02-24
**Status:** PRODUCTION READY

---

## System Overview

Layer 5 replaces all grep-based quality checks with AST-level structural analysis.

Technology: @babel/parser + @babel/traverse + @babel/types
Runtime: Node.js 22 (ESM)
Location: /orchestration/ast-engine/

---

## Module Map

| Module | File | Rules | Severity |
|--------|------|-------|----------|
| JSX Analyzer | jsx-analyzer.js | 9 rules | 6 error, 3 warning |
| Tailwind Analyzer | tailwind-analyzer.js | 6 rules | 4 error, 2 warning |
| TypeScript Analyzer | ts-analyzer.js | 5 rules | 2 error, 3 warning |
| Token Analyzer | token-analyzer.js | 4 rules | 3 error, 1 warning |
| Import Graph | import-graph-analyzer.js | 4 rules | 1 error, 3 warning |
| **Total** | **5 modules** | **28 rules** | **16 error, 12 warning** |

---

## Data Flow

```
brudi-gate.sh post-slice <id>
  → Layer 1-4 (existing gates)
  → node ast-engine/index.js <project-dir>
      → File discovery (recursive, excludes node_modules/.next/dist)
      → JSX Analyzer (all .tsx/.jsx files)
      → Tailwind Analyzer (all .tsx/.jsx files)
      → TypeScript Analyzer (all .ts/.tsx files)
      → Token Analyzer (all .tsx/.jsx files)
      → Import Graph Analyzer (project-wide)
      → Aggregate violations
      → EXIT 1 if errors > 0, EXIT 0 otherwise
```

---

## Rule Catalog

### JSX Analyzer (jsx-analyzer.js)
| Rule | Severity | Detects |
|------|----------|---------|
| NO_INLINE_STYLES | error | style={{...}} attributes (except display:none) |
| NO_HARDCODED_COLORS | error | Hex, RGB, HSL in style objects (except var(--...)) |
| NO_HARDCODED_PX | warning | Pixel values in style objects (except 0, 1px) |
| NO_LAYOUT_ANIMATION | error | gsap animations on width/height/margin/padding |
| NO_GSAP_FROM | error | gsap.from() calls |
| NO_TRANSITION_ALL | error | "transition: all" in strings/styles |
| SECTION_NEEDS_ID | error | Section/section without id attribute |
| MAX_CHILDREN_PER_SECTION | warning | Section with >8 direct children |
| COMPONENT_DEPTH_CHECK | warning | JSX nesting >6 levels deep |

### Tailwind Analyzer (tailwind-analyzer.js)
| Rule | Severity | Detects |
|------|----------|---------|
| MAX_CONTAINER_VARIANTS | error | >4 unique max-w-* values |
| SPACING_VARIANCE | error | >6 unique spacing values |
| TEXT_HIERARCHY_CHECK | error | Body text >text-xl, heading hierarchy inversion |
| NO_ARBITRARY_VALUES | error | Bracket notation (w-[123px]) |
| MAX_GRID_COLS | warning | grid-cols-N where N>4 |
| FONT_VARIANT_LIMIT | warning | >6 unique font sizes |

### TypeScript Analyzer (ts-analyzer.js)
| Rule | Severity | Detects |
|------|----------|---------|
| NO_ANY_TYPE | error | `any` type annotations |
| NO_UNUSED_IMPORTS | warning | Import specifiers never referenced |
| NO_DEFAULT_EXPORT_ANON | warning | Anonymous default exports |
| NO_DEEP_NESTING | warning | Functions nested >3 levels |
| STRICT_MODE_CHECK | error | tsconfig.json missing strict:true |

### Token Analyzer (token-analyzer.js)
| Rule | Severity | Detects |
|------|----------|---------|
| HARDCODED_DURATION | error | Literal numbers in gsap duration |
| HARDCODED_EASING | error | Literal strings in gsap ease |
| HARDCODED_COLOR_IN_JSX | error | Hex/RGB/HSL colors in JSX |
| TOKEN_DEFINED_NOT_USED | warning | Exported tokens never imported |

### Import Graph Analyzer (import-graph-analyzer.js)
| Rule | Severity | Detects |
|------|----------|---------|
| CIRCULAR_DEPENDENCY | error | Import cycles (DFS detection) |
| DEEP_IMPORT_CHAIN | warning | Chain depth >4 |
| PRIMITIVES_NOT_USED | warning | primitives/ dir exists but not imported |
| DUPLICATE_IMPORT | warning | Same module imported >5 files |

---

## Severity Matrix

| Level | Action | Count |
|-------|--------|-------|
| error | EXIT 1 (blocks) | 16 rules |
| warning | Logged, no block | 12 rules |
| info | Ignored | 0 rules |

---

## Integration Point

brudi-gate.sh line ~320:
```bash
local ast_engine="${brudi_dir}/orchestration/ast-engine/index.js"
if [ -f "$ast_engine" ] && command -v node &>/dev/null; then
  echo "  Running AST enforcement engine..."
  if ! node "$ast_engine" . --severity=error 2>&1; then
    die "AST enforcement gate failed for slice $slice_id"
  fi
fi
```

---

## Output Format

JSON (--json flag):
```json
{
  "version": "1.0.0",
  "projectDir": "/path/to/project",
  "timestamp": "2026-02-24T...",
  "metrics": {
    "filesAnalyzed": 51,
    "tsxFilesAnalyzed": 50,
    "analyzeTimeMs": 198
  },
  "summary": {
    "totalViolations": 3,
    "errors": 2,
    "warnings": 1,
    "blocked": true
  },
  "violations": [...]
}
```
