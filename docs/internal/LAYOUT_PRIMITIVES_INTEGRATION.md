# Layout Primitives — Integration Guide

## Overview

Layout primitives are the shared foundation for all spatial structure in Brudi projects. They prevent ad-hoc spacing patterns and ensure consistency across entire projects.

**Files created:**
- `templates/primitives/layout.tsx` — React components (Container, Section, Stack, Grid)
- `skills/building-layout-primitives/SKILL.md` — Teaching documentation
- This file — Integration checklist

---

## Where to Wire This Into Brudi

### 1. Update templates/CLAUDE.md (Section: Phase 0 Skills)

**Location:** Line ~33, under "Schritt 5 — Creative DNA Skills laden"

**Add:**
```markdown
**Schritt 6 — Layout Primitives (PFLICHT für alle Projekte):**
Lies diese Skill VOR Phase 0 abgeschlossen:
- `~/Brudi/skills/building-layout-primitives/SKILL.md` — Layout Primitives (Container, Section, Stack, Grid)
```

**Why:** Layout primitives are a Phase 0 requirement, just like design tokens and typography. Every project needs them.

---

### 2. Update templates/TASK.md (Phase 0 Tasks)

**Location:** Line ~32, under Phase 0 tasks

**Modify this line:**
```markdown
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
```

**To add:**
```markdown
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`, `building-layout-primitives`
```

**Then add a new Phase 0 task (line ~36, before Lenis setup):**
```markdown
- [ ] Layout Primitives kopieren: Copy `~/Brudi/templates/primitives/layout.tsx` to `src/components/primitives/layout.tsx`
```

**Why:** Agents need to know to copy the primitives early and track it in PROJECT_STATUS.

---

### 3. Update templates/CLAUDE.md (Hard Gates Section)

**Location:** Line ~248, under "Anti-Pattern Guardrails (VERBOTEN)"

**Add these rows to the table:**
```markdown
- Hardcoded max-w-* on sections → Container nutzen
- Ad-hoc px-* padding auf sections → Container nutzen
- Vertikale Stacks ohne Stack-Komponente → Stack nutzen
- Multi-column Layouts ohne Grid → Grid nutzen
- Section ohne id Attribut → id ist PFLICHT
```

**Why:** ESLint rules should enforce these. This documents the gate checks.

---

### 4. Create ESLint Rules (Optional Enhancement)

**File:** `templates/eslint.config.brudi.js` (already exists)

**Add validation rules for:**
- No hardcoded `max-w-*` in section/article elements
- Section elements MUST have `id` prop
- Warn on `<div className="...gap-...">` without Stack/Grid usage
- Warn on Section without semantic `as` prop

**Example ESLint plugin pattern:**
```javascript
// In templates/eslint.config.brudi.js
{
  rules: {
    'no-hardcoded-max-width': {
      // Detect <section className="max-w-4xl">
      // Force use of <Section> instead
    },
    'section-requires-id': {
      // Detect <section> without id
      // Warn: "Section elements require an id prop"
    },
    'use-stack-for-gaps': {
      // Detect <div className="...gap-...">
      // Suggest: "Use <Stack gap='md'> instead"
    }
  }
}
```

---

### 5. Update ~/Brudi/assets/INDEX.md (Optional)

**Location:** Under "Templates (`./templates/`)" section

**Add:**
```markdown
- **primitives/layout.tsx** — Container, Section, Stack, Grid components
```

This makes it discoverable in the asset registry.

---

## Phase 0 Quality Gate Enhancement

When verifying Phase 0 completion, brudi-gate.sh should check:

```bash
# Pseudo-code for Phase 0 Quality Gate

# Check 1: Layout primitives copied
if [ ! -f "src/components/primitives/layout.tsx" ]; then
  echo "FAIL: Layout primitives not copied. Copy from ~/Brudi/templates/primitives/layout.tsx"
  exit 1
fi

# Check 2: Sample usage exists
if ! grep -q "import.*Container.*from.*primitives" src/components/layout.tsx 2>/dev/null; then
  echo "WARN: Layout primitive imports not found in layout components"
fi

# Check 3: Build includes primitives
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "FAIL: Build failed. Layout primitives may not be properly exported."
  exit 1
fi
```

---

## Post-Phase-0 Usage Guarantee

After Phase 0, every slice in Phase 1 and beyond should:

1. **Use Section for every major block**
   ```tsx
   <Section id="features" spacing="md">
   ```

2. **Use Container inside Section**
   ```tsx
   <Section id="features">
     <Container>
       {/* Content here */}
     </Container>
   </Section>
   ```

3. **Use Stack for vertical stacking**
   ```tsx
   <Stack gap="md">
     <h2>Title</h2>
     <p>Description</p>
   </Stack>
   ```

4. **Use Grid for multi-column layouts**
   ```tsx
   <Grid cols={{ sm: 1, md: 2, lg: 3 }}>
     {/* Cards */}
   </Grid>
   ```

---

## Skill Integration Points

### When to Read This Skill

**Mandatory timing:**
- Phase 0: Right after `implementing-design-tokens`
- Before Phase 1 Slice 1: Always re-read before first section

**Optional timing:**
- Before any page with: forms, cards, hero sections, feature lists
- When auditing a project for spacing consistency

### What Agents Need to Know

1. **The 4 Components:** Container, Section, Stack, Grid
2. **The id requirement:** Section MUST have id
3. **Size/Spacing/Gap values:** Which props map to which Tailwind classes
4. **Decision tree:** Which primitive for which situation
5. **Forbidden patterns:** What triggers ESLint warnings

---

## Integration Verification Checklist

Before marking "Layout Primitives Integration" as complete:

- [ ] `templates/primitives/layout.tsx` created and tested
- [ ] `skills/building-layout-primitives/SKILL.md` created with complete documentation
- [ ] `templates/CLAUDE.md` updated to mention skill in Phase 0
- [ ] `templates/TASK.md` updated to include primitives in Phase 0 tasks
- [ ] `templates/CLAUDE.md` hard gates updated with primitive patterns
- [ ] This integration guide (`LAYOUT_PRIMITIVES_INTEGRATION.md`) created
- [ ] (Optional) ESLint rules drafted for future implementation
- [ ] (Optional) Phase 0 gate checks drafted in brudi-gate.sh

---

## Test Case: Sample Project

To verify integration works, a test project should:

1. Copy primitives from template
2. Build homepage with:
   - `<Section id="hero">` with hero layout
   - `<Section id="features">` with 3-column feature grid
   - `<Section id="cta">` with text stack
   - `<Section id="footer">` with footer layout
3. Verify all sections use Container, Stack, or Grid
4. Run `npm run build` — should succeed
5. Run linter — should detect hardcoded max-w-* or ad-hoc px-* if present
6. Screenshot on mobile 375px — should show responsive stacking

---

## FAQ — For Brudi Maintainers

**Q: Why are layout primitives not a package/library?**
A: They're lightweight enough to copy. Copying means each project owns them and can customize if needed (rare).

**Q: Should primitives be in every project by default?**
A: Yes. They should be copied in Phase 0 setup, before any page building.

**Q: Can agents override primitive values?**
A: Not easily. The `size`, `spacing`, `gap`, `cols` props are locked to specific values to prevent chaos. This is intentional.

**Q: What if a project has genuinely unique spacing?**
A: Update the primitive in that project's copy. Document why in PROJECT_STATUS.md. Don't modify `~/Brudi/templates/primitives/layout.tsx` itself.

**Q: How does this relate to design tokens?**
A: Design tokens (in design-tokens.css) define THE VALUES (px-6 = 1.5rem). Primitives are COMPOSABLE COMPONENTS that use those tokens. Tokens are values. Primitives are patterns.

---

## Future Enhancements

Potential future improvements (not blocking initial release):

1. **Storybook story generation** — Auto-generate stories from each primitive
2. **Figma plugin** — Sync max-width/padding from Figma to primitives
3. **Analytics integration** — Track which primitives are most-used
4. **Accessibility audit** — Auto-check that all Sections have ids
5. **Performance metrics** — Warn if Grid has too many children (>20 items)
6. **Dark mode story** — Document how primitives work with light/dark theme tokens

---

## Related Skills

These skills work closely with layout primitives:

- `~/Brudi/skills/designing-award-layouts-core/SKILL.md` — Depth and visual hierarchy (uses primitives for layout)
- `~/Brudi/skills/building-layouts/SKILL.md` — Grid vs Flexbox decision tree (primitives implement these)
- `~/Brudi/skills/implementing-design-tokens/SKILL.md` — The spacing values primitives use
- `~/Brudi/skills/verifying-ui-quality/SKILL.md` — Quality gates should verify primitive usage

---

## Summary

Layout primitives are a force multiplier for Brudi projects. By enforcing consistent structure early, they:

✅ Eliminate spacing chaos
✅ Make responsiveness predictable
✅ Speed up development (no custom max-w-* per section)
✅ Improve design system cohesion
✅ Enable quality gates (enforce via ESLint)
✅ Work across all Brudi project types (content, SaaS, interactive)

They are **not optional.** They are Phase 0, just like typography and design tokens.
