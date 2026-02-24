# Brudi Spacing Consistency Gate

Quick reference for the layout discipline enforcement system.

## What It Does

Blocks builds when projects violate layout discipline:

| Check | Threshold | Blocks |
|-------|-----------|--------|
| **A: Container Usage** | >4 different max-w-* values | ✅ Yes |
| **B: Text Wrapping** | Text without padding context | ✅ Yes |
| **C: Spacing Tokens** | >6 different py-*/gap-*/space-y-* | ✅ Yes |
| **D: Section IDs** | Homepage sections without id= | ✅ Yes |
| **E: Token Adoption** | 0% reference ratio | ✅ Yes |

## Usage

### Run All Checks

```bash
bash orchestration/brudi-gate-constraints.sh check-all
```

### Run Single Check

```bash
bash orchestration/brudi-gate-constraints.sh check-containers
bash orchestration/brudi-gate-constraints.sh check-text-wrapping
bash orchestration/brudi-gate-constraints.sh check-spacing-tokens
bash orchestration/brudi-gate-constraints.sh check-section-ids
bash orchestration/brudi-gate-constraints.sh check-token-adoption
```

## Exit Codes

- `0` = All checks passed
- `1` = At least one check failed
- `2` = Configuration error (no src/ directory)

## Integration

Integrated into `post-slice` gate flow:

```
post-slice checks:
  ✓ Evidence (screenshots, build, console)
  ✓ Complexity Floor (tokens, patterns, animations)
  ✓ Constraints ← THIS GATE
```

If any check fails, slice cannot be marked complete.

## Common Failures & Fixes

### ❌ Check A: Too Many Max-Width Values

**Failure:**
```
❌ Container inconsistency: 5 different max-w-* values
  - max-w-2xl
  - max-w-4xl
  - max-w-5xl
  - max-w-6xl
  - max-w-7xl
```

**Fix:** Use Container primitive for all sections:

```tsx
// src/components/layout.tsx
export function Container({ children, className }) {
  return <div className={`max-w-7xl mx-auto ${className}`}>{children}</div>;
}

// Usage
<Container><h1>Always same width</h1></Container>
```

---

### ❌ Check B: Text Without Padding

**Failure:**
```
❌ Text wrapping issue in ./src/app/page.tsx
  contains text elements but no px-* padding
```

**Fix:** Add padding or Container wrapper:

```tsx
// BEFORE (fails)
<section>
  <h1>Title</h1>
</section>

// AFTER (passes)
<section className="px-4">
  <h1>Title</h1>
</section>

// OR with Container
<Container>
  <h1>Title</h1>
</Container>
```

---

### ❌ Check C: Spacing Variance

**Failure:**
```
❌ Spacing variance too high: 8 different space-y-* values found (max: 6)
  - space-y-2
  - space-y-4
  - space-y-6
  - space-y-8
  - space-y-10
  - space-y-12
  - space-y-16
  - space-y-20
```

**Fix:** Adopt a spacing scale, use only 6 values max:

```tsx
// Recommended: 8pt system
// py-4, py-6, py-8, py-12, py-16, py-20

// BEFORE (8 values)
<div className="space-y-2">
<div className="space-y-4">
<div className="space-y-6">
// ... too many

// AFTER (4 values, consistent)
<Section className="py-16">
  <Container className="space-y-6">
    <Card className="py-4" />
  </Container>
</Section>
```

---

### ❌ Check D: Missing Section IDs

**Failure:**
```
❌ Section IDs missing: 0/4 sections have id attributes
```

**Fix:** Add id to every section:

```tsx
// BEFORE (fails)
<section>
  <h1>Services</h1>
</section>

// AFTER (passes)
<section id="services">
  <h1>Services</h1>
</section>

// Or with Section component
<Section id="services">
  <h1>Services</h1>
</Section>
```

---

### ❌ Check E: Dead Tokens

**Failure:**
```
❌ Token Adoption: 0% — No token references found in code
```

**Fix:** Reference tokens in code:

```tsx
// globals.css
:root {
  --duration-base: 300ms;
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --color-bg: #ffffff;
}

// component.tsx — BEFORE (fails, hardcoded colors)
<div style={{ backgroundColor: '#ffffff' }}>

// component.tsx — AFTER (passes, uses tokens)
<div style={{
  backgroundColor: 'var(--color-bg)',
  transitionDuration: 'var(--duration-base)',
  transitionTimingFunction: 'var(--easing-out)',
}}>
```

---

## Testing

### Test with FAIL Fixture

```bash
cd docs/internal/fixtures/constraint-gate-FAIL
bash ../../../orchestration/brudi-gate-constraints.sh check-all
# Should FAIL (4 failures expected)
```

### Test with PASS Fixture

```bash
cd docs/internal/fixtures/constraint-gate-PASS
bash ../../../orchestration/brudi-gate-constraints.sh check-all
# Should PASS (all 5 checks)
```

---

## Documentation

- **Full Spec:** `docs/internal/CONSTRAINT-GATE-SPEC.md`
- **Integration:** `docs/internal/INTEGRATION-PATCH.md`
- **Script:** `orchestration/brudi-gate-constraints.sh`

---

## Performance

- **Time:** ~450ms per run
- **Scope:** Entire src/ directory
- **Blocking:** Yes (part of post-slice gate)
- **Dependencies:** Only bash, find, grep (no external tools)
