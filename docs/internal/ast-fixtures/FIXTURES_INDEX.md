# AST Engine Test Fixtures - Complete Index

**Status:** ✅ COMPLETED
**Total Fixtures:** 54 (34 fail + 20 pass)
**Requirement:** Minimum 30 ✓ Exceeded by 24 fixtures
**Last Updated:** 2026-02-24

## Quick Stats

| Category | Count | Rules Covered |
|----------|-------|----------------|
| FAIL Fixtures | 34 | TypeScript, React, Tailwind, GSAP, Security |
| PASS Fixtures | 20 | Best practices across all domains |
| **TOTAL** | **54** | **25+ rules** |

---

## FAIL Fixtures (34 - Intentional Violations)

### TypeScript & Language Rules (9 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `any-type.ts` | NO_ANY_TYPE | Uses `any` in function params and returns |
| `implicit-any.ts` | NO_IMPLICIT_ANY | Function parameters without type annotations |
| `duplicated-types.ts` | NO_DUPLICATED_TYPES | UserInfo and PersonData have identical structure |
| `anon-default-export.ts` | NO_DEFAULT_EXPORT_ANON | `export default () => {}` anonymous arrow function |
| `deep-nesting-functions.ts` | NO_DEEP_NESTING | 5 levels of function nesting (max 3) |
| `nested-generic-types.ts` | COMPLEX_GENERICS | Excessive generic type nesting |
| `unused-variables.ts` | NO_UNUSED_VARS | Variables declared but never referenced |
| `inconsistent-naming.ts` | INCONSISTENT_NAMING | Mixed camelCase, snake_case, PascalCase |
| `excessive-comments.ts` | EXCESSIVE_COMMENTS | Over-commented, redundant comments |

### React/JSX Rules (3 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `prop-drilling.tsx` | NO_PROP_DRILLING | Props passed through 4+ component levels |
| `missing-null-check.tsx` | NULL_REFERENCE | Operations on null/undefined without checks |
| `memory-leak-pattern.tsx` | MEMORY_LEAK | Event listeners not cleaned up in useEffect |

### Import & Dependency Rules (2 fixtures + references)

| File | Rule | Violation |
|------|------|-----------|
| `circular-import-a.ts` | NO_CIRCULAR_IMPORTS | Circular dependency (imports b) |
| `circular-import-b.ts` | NO_CIRCULAR_IMPORTS | Circular dependency (imports a) |
| `import-primitives-override.tsx` | PRIMITIVES_OVERWRITTEN | Wrapping primitive components |
| `token-unused-defined.ts` | Token unused exports | Exports never imported |

### Tailwind CSS Rules (3 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `tailwind-chaos.tsx` | MAX_CONTAINER_VARIANTS | Multiple contradictory max-w utilities |
| `tailwind-stacked-variants.tsx` | Variant complexity | sm:hover:bg-blue-500 (stacked variants) |
| `tailwind-arbitrary-values.tsx` | NO_ARBITRARY_VALUES | w-[123px], h-[456px], p-[17px] |

### GSAP/Animation Rules (4 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `gsap-layout-animation.tsx` | NO_LAYOUT_ANIMATION | gsap.to({width, height, margin, padding}) |
| `layout-animation.tsx` | NO_LAYOUT_ANIMATION | GSAP on layout properties |
| `gsap-from.tsx` | NO_GSAP_FROM | Uses gsap.from() instead of gsap.to() |
| `hardcoded-motion.tsx` | HARDCODED_DURATION | Motion values hardcoded, not from tokens |

### CSS/Style Rules (4 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `hardcoded-colors.tsx` | NO_HARDCODED_COLORS | #ff0000, rgb(), hsl() inline |
| `inline-styles.tsx` | NO_INLINE_STYLES | style={{}} objects with hardcoded values |
| `token-hardcoded-in-ast.tsx` | NO_HARDCODED_COLORS | Colors in StringLiteral (not comments) |
| `transition-all.tsx` | NO_TRANSITION_ALL | transition: all property |

### Section Component Rules (2 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `section-no-id.tsx` | SECTION_NEEDS_ID | Section without id prop |
| `section-overcrowded.tsx` | SECTION_CHILDREN_LIMIT | 12 direct children (exceeds limit) |

### Component Structure Rules (3 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `deep-nesting.tsx` | COMPONENT_DEPTH_CHECK | 7 levels of JSX nesting (max 6) |
| `component-depth-extreme.tsx` | COMPONENT_DEPTH_CHECK | 8 levels of JSX nesting |
| `mixed-violations.tsx` | Multiple | 9 different violations in 1 file |

### Security/Performance Rules (2 fixtures)

| File | Rule | Violation |
|------|------|-----------|
| `string-concatenation-sql.ts` | SQL_INJECTION_RISK | String concatenation for SQL queries |
| `exponential-algorithm.ts` | EXPONENTIAL_COMPLEXITY | O(2^n) fibonacci, no memoization |

---

## PASS Fixtures (20 - Clean Code Examples)

### TypeScript Best Practices (3 fixtures)

| File | Demonstrates |
|------|--------------|
| `clean-typescript.ts` | Strict typing, no 'any', interface contracts |
| `clean-imports.ts` | No circular deps, proper module boundaries |
| `clear-naming-conventions.ts` | Consistent camelCase/CONSTANT_CASE/PascalCase |

### React/JSX Best Practices (3 fixtures)

| File | Demonstrates |
|------|--------------|
| `proper-prop-pattern.tsx` | React Context to avoid prop drilling |
| `clean-page.tsx` | Semantic HTML, clean structure |
| `clean-section-structure.tsx` | Section with proper id, limited children |

### Tailwind CSS Best Practices (3 fixtures)

| File | Demonstrates |
|------|--------------|
| `clean-tailwind.tsx` | Token-based classes, proper hierarchy |
| `tailwind-responsive.tsx` | Mobile-first, single variant per breakpoint |
| `clean-no-arbitrary-classes.tsx` | Only predefined Tailwind utilities |

### Animation/GSAP Best Practices (3 fixtures)

| File | Demonstrates |
|------|--------------|
| `clean-animation.tsx` | Token-based duration/easing |
| `clean-gsap.tsx` | Transform-only animations (performance safe) |
| `clean-tokens.tsx` | All tokens used, proper imports |

### Code Quality Best Practices (5 fixtures)

| File | Demonstrates |
|------|--------------|
| `clean-function-nesting.ts` | Max 3 levels of function nesting |
| `clean-used-imports.ts` | All imports are actually referenced |
| `clean-no-circular.ts` | One-directional dependency flow |
| `clean-tokens.ts` | As const typed tokens, proper exports |
| `clean-effect-cleanup.tsx` | Proper useEffect cleanup (listeners/timers) |

### Error Handling & Safety (3 fixtures)

| File | Demonstrates |
|------|--------------|
| `proper-error-handling.ts` | Null checks, safe operations |
| `optimized-algorithm.ts` | Memoized fibonacci O(n), efficient algorithms |
| `parameterized-queries.ts` | Safe database queries (no SQL injection) |

---

## Rules Coverage Matrix

### ts-analyzer (9 rules)
- ✅ NO_ANY_TYPE - `any-type.ts`
- ✅ NO_IMPLICIT_ANY - `implicit-any.ts`
- ✅ NO_DUPLICATED_TYPES - `duplicated-types.ts`
- ✅ NO_DEFAULT_EXPORT_ANON - `anon-default-export.ts`
- ✅ NO_DEEP_NESTING - `deep-nesting-functions.ts`
- ✅ NO_UNUSED_VARS - `unused-variables.ts`
- ✅ INCONSISTENT_NAMING - `inconsistent-naming.ts`
- ✅ EXCESSIVE_COMMENTS - `excessive-comments.ts`
- ✅ COMPLEX_GENERICS - `nested-generic-types.ts`

### tailwind-analyzer (5 rules)
- ✅ MAX_CONTAINER_VARIANTS - `tailwind-chaos.tsx`
- ✅ SPACING_VARIANCE - `tailwind-chaos.tsx`
- ✅ NO_ARBITRARY_VALUES - `tailwind-arbitrary-values.tsx`
- ✅ TEXT_HIERARCHY_CHECK - `tailwind-chaos.tsx`
- ✅ MAX_GRID_COLS - `tailwind-chaos.tsx`

### token-analyzer (3 rules)
- ✅ NO_HARDCODED_COLORS - `hardcoded-colors.tsx`, `token-hardcoded-in-ast.tsx`
- ✅ NO_HARDCODED_PX - `inline-styles.tsx`
- ✅ HARDCODED_DURATION/EASING - `hardcoded-motion.tsx`

### import-graph (4 rules)
- ✅ PRIMITIVES_NOT_USED - Multiple fixtures
- ✅ CIRCULAR_DEPENDENCY - `circular-import-a.ts`, `circular-import-b.ts`
- ✅ PRIMITIVES_OVERWRITTEN - `import-primitives-override.tsx`
- ✅ NULL_REFERENCE - `missing-null-check.tsx`

### jsx-analyzer (6+ rules)
- ✅ NO_INLINE_STYLES - `inline-styles.tsx`
- ✅ NO_LAYOUT_ANIMATION - `gsap-layout-animation.tsx`, `layout-animation.tsx`
- ✅ NO_PROP_DRILLING - `prop-drilling.tsx`
- ✅ SECTION_NEEDS_ID - `section-no-id.tsx`
- ✅ COMPONENT_DEPTH_CHECK - `deep-nesting.tsx`, `component-depth-extreme.tsx`
- ✅ NO_GSAP_FROM - `gsap-from.tsx`

### Security/Performance (4 rules)
- ✅ SQL_INJECTION_RISK - `string-concatenation-sql.ts`
- ✅ MEMORY_LEAK - `memory-leak-pattern.tsx`
- ✅ EXPONENTIAL_COMPLEXITY - `exponential-algorithm.ts`
- ✅ NO_TRANSITION_ALL - `transition-all.tsx`

---

## File Organization

```
ast-fixtures/
├── README.md                    (Original documentation)
├── FIXTURES_INDEX.md            (This file)
├── fail/                        (34 violation fixtures)
│   ├── TypeScript violations     (9 files)
│   ├── React/JSX violations      (3 files)
│   ├── Import violations         (4 files)
│   ├── Tailwind violations       (3 files)
│   ├── GSAP violations           (4 files)
│   ├── CSS/Style violations      (4 files)
│   ├── Section violations        (2 files)
│   ├── Component structure       (3 files)
│   └── Security/Performance      (2 files)
└── pass/                        (20 clean code examples)
    ├── TypeScript practices      (3 files)
    ├── React/JSX practices       (3 files)
    ├── Tailwind practices        (3 files)
    ├── Animation practices       (3 files)
    ├── Code quality practices    (5 files)
    └── Error handling            (3 files)
```

---

## Testing Integration

### Running Tests
```bash
cd /sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/orchestration/ast-engine
node test-runner.js
```

### Expected Results
- **PASS fixtures:** 0 errors each (20 × 0 = 0 total)
- **FAIL fixtures:** >0 violations each (34 fixtures with violations)
- **False positive rate:** 0/20 (no issues with clean code)
- **False negative rate:** 0/34 (all violations detected)
- **Total test files:** 54

---

## Notable Fixtures

### Most Complex
- **mixed-violations.tsx** - Demonstrates 9 different violations in a single file for comprehensive testing

### Best Contrasts (Before/After)
- **prop-drilling.tsx** vs **proper-prop-pattern.tsx** - Shows problem and solution
- **clean-gsap.tsx** vs **gsap-layout-animation.tsx** - Safe vs unsafe animations
- **tailwind-chaos.tsx** vs **clean-tailwind.tsx** - Messy vs clean Tailwind
- **string-concatenation-sql.ts** vs **parameterized-queries.ts** - Unsafe vs safe queries

### Edge Cases
- Circular imports (2-file pair)
- 5-level function nesting
- 8-level JSX nesting
- Memory leaks with event listeners
- SQL injection vulnerabilities
- Exponential algorithms
- Type duplication detection

---

## Adding New Fixtures

To extend the test suite:

1. **Create fail fixture** (demonstrates violation):
   ```bash
   touch fail/my-violation.ts
   ```
   Add comment header explaining what it tests.

2. **Create pass fixture** (demonstrates best practice):
   ```bash
   touch pass/my-clean-code.ts
   ```
   Add comment header explaining best practice.

3. **Update this index** with new entries

4. **Run tests** to verify:
   ```bash
   node test-runner.js
   ```

---

## Fixture Quality Checklist

- ✅ All files have descriptive headers
- ✅ Each targets specific rules for isolated testing
- ✅ Pass fixtures show clear best practices
- ✅ Fail fixtures show realistic violation patterns
- ✅ Consistent naming (fail/ and pass/ subdirectories)
- ✅ Valid TypeScript/TSX syntax
- ✅ Token references match design system
- ✅ Component structures align with project patterns
- ✅ GSAP examples follow best practice format
- ✅ Security examples show real vulnerabilities

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Fixtures | 54 |
| FAIL Fixtures | 34 (63%) |
| PASS Fixtures | 20 (37%) |
| Rules Covered | 25+ |
| Analyzers | 5 |
| New Rules Covered | 4+ (from recent rebuild) |
| Estimated Violations | 100+ across all fail fixtures |
| Expected False Positive Rate | 0% |
| Expected False Negative Rate | 0% |

---

## Version History

| Date | Changes |
|------|---------|
| 2026-02-24 | Initial comprehensive fixture suite (54 total) |
| - | 34 fail fixtures covering 25+ rules |
| - | 20 pass fixtures demonstrating best practices |
| - | Coverage for all new ts-analyzer rules |
| - | Coverage for tailwind-analyzer tokenizer |
| - | Coverage for import-graph primitives rules |

---

Generated: 2026-02-24
Next Review: After AST Engine test runner execution
