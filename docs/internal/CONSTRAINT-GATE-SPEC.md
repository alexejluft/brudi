# Brudi Spacing Consistency Gate — Specification

**Version:** 1.0
**Status:** Ready for Integration
**Module:** `orchestration/brudi-gate-constraints.sh`

## Problem Statement

The original Brudi gate system validates **process** (did you create tokens?) but not **outcome** (is the spacing actually consistent?). Projects pass post-slice gates with proper tokens defined but then violate layout discipline through:

- 5+ different max-width values across sections (no Container primitive adoption)
- Text elements rendered edge-to-edge without padding context
- 8+ different spacing token values (py-*, gap-*, space-y-*) with no pattern
- Homepage sections without `id` attributes (breaks scroll navigation)
- Dead token definitions with 0% code adoption

This gate enforces **layout discipline as outcome**, not just artifact existence.

## Architecture

### Module Structure

```
brudi-gate-constraints.sh
├── check_containers()           — Check A: Container Primitive Usage
├── check_text_wrapping()        — Check B: No Edge-to-Edge Text
├── check_spacing_tokens()       — Check C: Spacing Token Consistency
├── check_section_ids()          — Check D: Section ID Requirement
├── check_token_adoption()       — Check E: Token Adoption Ratio
└── check_all()                  — Run all checks with summary
```

### Execution Model

**Trigger:** Post-slice, after Complexity Floor check
**Timing:** ~2 seconds
**Blocking:** Yes (exit code 1 on failure)
**Scope:** Entire project src/ directory (not slice-specific)

## Checks: Detailed Specification

### Check A: Container Primitive Usage

**Purpose:** Enforce consistent max-width strategy across all sections

**Method:** Proxy-based heuristic

```bash
find src -type f -name "*.tsx" -exec grep -h -roE "max-w-[a-z0-9]+" {} \;
```

**Rules:**

1. Count unique `max-w-*` class values (e.g., max-w-2xl, max-w-7xl)
2. WARN if count = 0 (no max-width constraints found)
3. PASS if count ≤ 4 (reasonable variety)
4. FAIL if count > 4 (indicates lack of consistency/strategy)

**Evidence of proper use:**

- All sections use the same max-width (recommended: `max-w-7xl`)
- OR: Container primitive imported and used throughout
- OR: ≤4 distinct max-w values with documented reason

**Example PASS:**

```tsx
// All using max-w-7xl
<Container className="max-w-7xl mx-auto">
  <Section>Content</Section>
</Container>
```

**Example FAIL:**

```tsx
<div className="max-w-2xl mx-auto">Hero</div>
<div className="max-w-4xl mx-auto">Services</div>
<div className="max-w-5xl mx-auto">Portfolio</div>
<div className="max-w-6xl mx-auto">CTA</div>
<div className="max-w-7xl mx-auto">Footer</div>
// 5 different values — FAIL
```

**Fix Strategy:** Use layout primitives (Container/Section components) to enforce single max-width.

---

### Check B: No Edge-to-Edge Text

**Purpose:** Prevent text from rendering at screen edge (accessibility + spacing)

**Method:** Heuristic detection of text elements without padding context

```bash
for each TSX file:
  if contains h1-h6, p, span:
    if NOT contains px-* padding:
      if NOT imports Container:
        FAIL
```

**Rules:**

1. Find all files with heading or paragraph tags
2. Check if they have `px-*` padding or Container context
3. PASS if all text elements have proper wrapping
4. FAIL if text exists without padding/container

**Evidence of proper use:**

- All text wrapped in Container/padding context
- px-4, px-6, px-8 spacing on outer divs
- No bare `<h1>`, `<p>` without parent padding

**Example PASS:**

```tsx
<Container className="px-4">
  <h1>Title</h1>
  <p>Paragraph</p>
</Container>
```

**Example FAIL:**

```tsx
// No padding context
<section>
  <h1>Title</h1>
  <p>Edge-to-edge paragraph</p>
</section>
```

**Fix Strategy:** Wrap text in Container or add px-* padding to parent.

---

### Check C: Spacing Token Consistency

**Purpose:** Ensure vertical spacing (py-*, gap-*, space-y-*) follows a limited palette

**Method:** Count unique spacing class values

```bash
find src -type f \( -name "*.tsx" -o -name "*.css" \) \
  -exec grep -h -roE "(py|gap|space-y)-[a-z0-9]+" {} \; \
  | sort -u | wc -l
```

**Rules:**

1. Count unique `py-*`, `gap-*`, `space-y-*` values
2. PASS if count ≤ 6 (8pt scale: 4, 8, 12, 16, 20, 24)
3. FAIL if count > 6 (indicates chaos or token misuse)

**Evidence of proper use:**

- Spacing uses only: `py-4`, `py-6`, `py-8`, `py-12`, `py-16`, `py-20`
- OR: Defined spacing tokens like `--distance-*` used instead
- OR: Section wrapper handles spacing (not individual elements)

**Example PASS:**

```tsx
<Section className="py-16">  // Consistent 16 unit
  <Container className="space-y-8">  // Consistent 8 unit
    <div className="gap-6">  // Consistent 6 unit
```

**Example FAIL:**

```tsx
<div className="space-y-2">
<div className="space-y-4">
<div className="space-y-6">
<div className="space-y-8">
<div className="space-y-10">
<div className="space-y-12">
<div className="space-y-16">
// 7 different values — FAIL
```

**Fix Strategy:** Adopt a spacing scale (8pt system) and use only 4-6 distinct values.

---

### Check D: Section ID Requirement (Homepage)

**Purpose:** Ensure all sections have stable IDs for scroll anchors and navigation

**Method:** Grep for section tags and check id attributes

```bash
grep -i "<section\|<Section" src/app/page.tsx | grep "id="
```

**Rules:**

1. Find all `<section>` or `<Section>` tags in homepage
2. Count how many have `id=` attributes
3. WARN if 0 sections found
4. FAIL if sections_with_id < total_sections
5. PASS if all sections have ids

**Evidence of proper use:**

- Every section: `<Section id="hero">`
- IDs are kebab-case and descriptive
- IDs match scroll target references

**Example PASS:**

```tsx
<Section id="hero">
<Section id="services">
<Section id="portfolio">
<Section id="cta">
```

**Example FAIL:**

```tsx
<section className="py-20">  // Missing id
<section className="py-20">  // Missing id
```

**Fix Strategy:** Add `id={name}` to every section component.

---

### Check E: Token Adoption Ratio

**Purpose:** Ensure defined tokens are actually being used in code (no dead tokens)

**Method:** Compare token definitions to references

```bash
# Count definitions in globals.css
grep -c "\-\-duration-\|\-\-easing-\|\-\-color-\|--bg\|--surface" globals.css

# Count references in src/
grep -r "var(--duration-\|var(--easing-\|var(--color-" src/ | wc -l
```

**Rules:**

1. Count defined tokens (--duration-*, --easing-*, --color-*, --bg*, --surface*)
2. Count references to those tokens in src/ (var(--*) patterns)
3. Calculate adoption%: refs / definitions * 100
4. WARN if adoption < 50% (half the tokens unused)
5. FAIL if adoption = 0% (completely dead tokens)
6. PASS if adoption ≥ 50%

**Evidence of proper use:**

- Every token defined is referenced in at least one component
- Adoption ≥ 70% (most tokens in use)
- OR: Clear documentation why some tokens are reserved for future use

**Example PASS:**

```
Tokens defined: 4 duration, 4 easing, 9 color
Tokens referenced: 13
Adoption: 72% ✅
```

**Example FAIL:**

```
Tokens defined: 8 duration, 8 easing, 12 color
Tokens referenced: 0
Adoption: 0% ❌
```

**Fix Strategy:** Use defined tokens throughout code via `var(--token-name)`.

---

## Output Format

### Per-Check Output

```
ℹ️  Check A: Container Primitive Usage
✅ Container consistency: 3 max-w-* values (all within limits)
ℹ️  Found 1 Container imports
```

### Failure Output

```
ℹ️  Check A: Container Primitive Usage
❌ Container inconsistency: 5 different max-w-* values found (max allowed: 4)
  - max-w-2xl
  - max-w-4xl
  - max-w-5xl
  - max-w-6xl
  - max-w-7xl
⚠️  No Container imports found — ensure layout primitives are being used
```

### Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⛔ 2 constraint checks FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## CLI Usage

### Run All Checks

```bash
bash orchestration/brudi-gate-constraints.sh check-all
# Runs all 5 checks, exits 0 if all pass, 1 if any fail
```

### Run Individual Check

```bash
bash orchestration/brudi-gate-constraints.sh check-containers
bash orchestration/brudi-gate-constraints.sh check-text-wrapping
bash orchestration/brudi-gate-constraints.sh check-spacing-tokens
bash orchestration/brudi-gate-constraints.sh check-section-ids
bash orchestration/brudi-gate-constraints.sh check-token-adoption
```

### Help

```bash
bash orchestration/brudi-gate-constraints.sh help
```

---

## Edge Cases & Graceful Handling

| Situation | Behavior |
|-----------|----------|
| No src/ directory | Error exit (project misconfigured) |
| No TSX files in src/ | Skip check (not a React project) |
| No max-w-* values | Warn (verify Container primitives used) |
| No sections found | Warn (homepage might not exist) |
| No tokens defined | Fail (tokens required in globals.css) |
| Zero token adoption | Fail (dead tokens + dead code) |

---

## Testing

### Test Fixtures

Two complete fixtures included:

**FAIL Fixture** (`docs/internal/fixtures/constraint-gate-FAIL/`)
- 5 different max-w-* values (Check A: FAIL)
- Text without padding (Check B: FAIL)
- 8 different spacing values (Check C: FAIL)
- Sections without id attributes (Check D: FAIL)
- Expected: 4 failures

**PASS Fixture** (`docs/internal/fixtures/constraint-gate-PASS/`)
- Single max-w-7xl + Container primitive (Check A: PASS)
- All text wrapped with Container (Check B: PASS)
- 6 consistent spacing values (Check C: PASS)
- All sections have id attributes (Check D: PASS)
- 72% token adoption (Check E: PASS)
- Expected: All pass

### Running Tests

```bash
cd docs/internal/fixtures/constraint-gate-FAIL
bash ../../orchestration/brudi-gate-constraints.sh check-all
# Should fail

cd ../constraint-gate-PASS
bash ../../orchestration/brudi-gate-constraints.sh check-all
# Should pass
```

---

## Integration with brudi-gate.sh

The constraint gate integrates as a **post-slice blocking gate**, running after Complexity Floor checks:

```
post-slice flow:
  1. Evidence check (screenshots, build, console)
  2. Complexity Floor check (tokens defined, forbidden patterns, animation count)
  3. Constraint check (THIS) — spacing consistency, text wrapping, IDs
  → PASS all 3 → slice marked complete
  → FAIL any → die() with error details
```

See `docs/internal/INTEGRATION-PATCH.md` for exact integration code.

---

## Performance Characteristics

| Check | Time | Complexity |
|-------|------|-----------|
| A: Containers | 50ms | O(n files) |
| B: Text Wrapping | 100ms | O(n files) |
| C: Spacing Tokens | 75ms | O(n files) |
| D: Section IDs | 25ms | O(1) — single page file |
| E: Token Adoption | 200ms | O(n files) recursive grep |
| **Total** | **~450ms** | Fast on typical projects |

---

## Success Criteria

A project passes Spacing Consistency Gate when:

- ✅ All sections use ≤4 distinct max-width values
- ✅ All text has padding or Container context
- ✅ Spacing uses ≤6 distinct py-*/gap-*/space-y-* values
- ✅ All sections have unique id attributes
- ✅ Token adoption ≥ 50%

## Future Enhancements

- Configurable thresholds via `.brudi/constraints.json`
- Per-section violation reporting
- Suggested fixes (e.g., "convert to max-w-7xl")
- Token adoption tracking per file
- Integration with TypeScript strict types
