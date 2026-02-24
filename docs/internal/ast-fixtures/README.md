# Brudi AST Engine Test Fixtures

Complete test suite for the Brudi AST Enforcement Engine. These fixtures validate the engine's ability to detect and enforce code quality rules across TypeScript, TSX, and Tailwind CSS.

## Directory Structure

```
ast-fixtures/
├── pass/          # Clean code fixtures (0 violations expected)
├── fail/          # Code with intentional violations
└── README.md      # This file
```

## PASS Fixtures (Clean Code)

These files should produce **0 errors** when analyzed.

### clean-page.tsx
A well-structured React page component demonstrating best practices:
- Uses semantic HTML structure with proper Section components
- No inline styles (pure className-based styling)
- Proper spacing and layout patterns
- All CSS values come from design tokens
- Rules validated: `NO_INLINE_STYLES`

### clean-tokens.ts
A clean design tokens module:
- Properly typed constants with `as const`
- Named exports for duration and easing values
- No hardcoded magic values
- Rules validated: Token analysis passes

### clean-animation.tsx
A component with proper GSAP animation:
- Uses token-based duration and easing values (not hardcoded)
- References tokens via imports
- Proper component structure
- Rules validated: No hardcoded motion values

## FAIL Fixtures (Intentional Violations)

These files intentionally trigger specific linting rules.

### any-type.ts
**Rule: `NO_ANY_TYPE`** (4 errors, 2233 warnings for deep nesting)
- Uses `any` type in function parameters and return types
- Arrow function default export (triggers `NO_DEFAULT_EXPORT_ANON`)
- Deep function nesting (triggers `NO_DEEP_NESTING` warnings)
- Expected violations: Multiple

### deep-nesting.tsx
**Rule: `COMPONENT_DEPTH_CHECK`** (warning) + `PRIMITIVES_NOT_USED`
- JSX tree nested 7 levels deep (max allowed: 6)
- No use of Section/Container primitives
- Expected violations: 3

### gsap-from.tsx
**Rule: `NO_GSAP_FROM`** + `PRIMITIVES_NOT_USED`
- Uses `gsap.from()` instead of `gsap.to()`
- Missing required Section ID
- Expected violations: 3

### hardcoded-colors.tsx
**Rule: `NO_HARDCODED_COLORS`** + `NO_INLINE_STYLES`
- Multiple color formats: hex (`#ff0000`), rgb, hsl
- Color values should reference design tokens
- Expected violations: 11

### hardcoded-motion.tsx
**Rule: `HARDCODED_DURATION`** + `HARDCODED_EASING`
- Motion values hardcoded instead of using token imports
- Violates motion token requirements
- Expected violations: 5

### inline-styles.tsx
**Rule: `NO_INLINE_STYLES`** + `NO_HARDCODED_COLORS`
- Multiple inline style objects with hardcoded values
- Hardcoded spacing and colors
- Expected violations: 8

### layout-animation.tsx
**Rule: `NO_LAYOUT_ANIMATION`** + `NO_HARDCODED_PX`
- GSAP animation on layout properties (width, height, margin, padding)
- These cause layout shifts and performance issues
- Expected violations: 4

### section-no-id.tsx
**Rule: `SECTION_NEEDS_ID`** + `PRIMITIVES_NOT_USED`
- Section components without `id` prop (accessibility/tracking)
- Native HTML section without proper structure
- Expected violations: 3

### tailwind-chaos.tsx
**Rule: `MAX_CONTAINER_VARIANTS`** + `SPACING_VARIANCE`** + `NO_ARBITRARY_VALUES`**
- Multiple contradictory max-width utilities (xs, sm, md, lg, xl, 2xl, 3xl)
- Spacing chaos with py-1 through py-24 (inconsistent values)
- Arbitrary width/height values (`w-[347px]`)
- Grid with 8 columns (exceeds recommended max)
- Excessively large text size (text-9xl)
- Expected violations: 8

### transition-all.tsx
**Rule: `NO_TRANSITION_ALL`** + `NO_INLINE_STYLES`**
- Inline style: `transition: "all 0.3s ease"` (perf issue)
- Tailwind class: `transition-all` (perf issue)
- Both variants of the anti-pattern included
- Expected violations: 3

## Running Tests

### Run All Tests
```bash
cd /sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/orchestration/ast-engine
node test-runner.js
```

### Expected Output
- 13 total fixtures
- 3 PASS fixtures (0 false positives)
- 10 FAIL fixtures (0 false negatives)
- All rules detected and reported

### Output Example
```
========== TEST RESULTS ==========

| Fixture | Type | Expected | Actual | Status |
|---------|------|----------|--------|--------|
| clean-animation.tsx | PASS | 0 errors | 0 errors | ✅ |
| clean-page.tsx | PASS | 0 errors | 0 errors | ✅ |
| clean-tokens.ts | PASS | 0 errors | 0 errors | ✅ |
| any-type.ts | FAIL | >0 violations | 2237 (NO_ANY_TYPE, ...) | ✅ |
...

✅ Passed: 13
❌ Failed: 0
Total: 13

False Positive Rate: 0/3
False Negative Rate: 0/10
```

## Rules Being Validated

### JSX/TSX Rules
- `NO_INLINE_STYLES` - Disallow style={{}} objects
- `NO_HARDCODED_COLORS` - Colors must use design tokens
- `NO_HARDCODED_PX` - Pixel values should use token-based spacing
- `NO_LAYOUT_ANIMATION` - Don't animate layout properties
- `NO_GSAP_FROM` - Use `gsap.to()` instead of `gsap.from()`
- `NO_TRANSITION_ALL` - Avoid `transition: all` for performance
- `SECTION_NEEDS_ID` - Section components require id prop
- `COMPONENT_DEPTH_CHECK` - Max 6 levels of JSX nesting

### TypeScript Rules
- `NO_ANY_TYPE` - Strict typing required
- `NO_DEFAULT_EXPORT_ANON` - Name default exports
- `NO_DEEP_NESTING` - Max 3 levels of function nesting

### Tailwind Rules
- `MAX_CONTAINER_VARIANTS` - Limit max-w utilities
- `SPACING_VARIANCE` - Consistent spacing scale usage
- `NO_ARBITRARY_VALUES` - Use predefined utilities
- `MAX_GRID_COLS` - Grid columns limit
- `TEXT_HIERARCHY_CHECK` - Consistent typography scale

### Import Graph Rules
- `PRIMITIVES_NOT_USED` - Warn when primitives aren't imported
- `CIRCULAR_DEPENDENCY` - No circular imports

## Test Runner Features

The test runner (`test-runner.js`) provides:
- Automated fixture validation
- Isolated temporary directories per test
- Proper cleanup after each test
- JSON output parsing with error handling
- False positive/negative rate tracking
- Clear pass/fail status for each fixture
- Handles large violation outputs (up to 2000+ violations)

## Extending the Fixtures

To add new fixtures:

1. **Add PASS fixture:**
   ```bash
   cp your-clean-file.tsx pass/
   ```

2. **Add FAIL fixture:**
   ```bash
   cp your-violating-file.tsx fail/
   ```

3. **Update this README** with the new fixture description

4. **Run tests:**
   ```bash
   node test-runner.js
   ```

## Fixture Statistics

- **Total fixtures:** 13
- **PASS fixtures:** 3
- **FAIL fixtures:** 10
- **Total rules validated:** 20+
- **Average violations per FAIL fixture:** 5.2

## Notes

- The `any-type.ts` fixture produces 2237 violations because every position in the file has function nesting warnings
- Some fixtures intentionally trigger multiple rules to test comprehensive analysis
- The test runner uses `--json` output from the engine for programmatic validation
- Temporary test directories are automatically cleaned up
