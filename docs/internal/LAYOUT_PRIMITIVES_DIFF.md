# Layout Primitives — Exact Integration Changes

This document shows the EXACT changes needed to wire layout primitives into existing Brudi templates.

---

## Change 1: templates/CLAUDE.md

### Location: Line ~33, under "Schritt 5"

**BEFORE:**
```markdown
**Schritt 5 — Creative DNA Skills laden (PFLICHT bei GSAP-Projekten):**
Lies diese Skills VOR dem ersten Slice:
- `~/Brudi/skills/designing-award-materiality/SKILL.md` — Depth, Elevation, Materials
- `~/Brudi/skills/designing-creative-constraints/SKILL.md` — Complexity Floor pro Komponente
- `~/Brudi/skills/verifying-ui-quality/SKILL.md` — Quality Gate + Evidence
```

**AFTER:**
```markdown
**Schritt 5 — Creative DNA Skills laden (PFLICHT bei GSAP-Projekten):**
Lies diese Skills VOR dem ersten Slice:
- `~/Brudi/skills/designing-award-materiality/SKILL.md` — Depth, Elevation, Materials
- `~/Brudi/skills/designing-creative-constraints/SKILL.md` — Complexity Floor pro Komponente
- `~/Brudi/skills/verifying-ui-quality/SKILL.md` — Quality Gate + Evidence

**Schritt 5b — Layout Primitives (PFLICHT für ALLE Projekte):**
Lies diese Skill vor Phase 0 abgeschlossen:
- `~/Brudi/skills/building-layout-primitives/SKILL.md` — Container, Section, Stack, Grid (Struktur ohne Chaos)
```

---

## Change 2: templates/CLAUDE.md

### Location: Line ~98-104, under "Tech Stack"

**ADD** (after the "Kein Astro..." line):

```markdown
---

## Layout Primitives (Phase 0 Requirement)

Jedes Projekt kopiert `~/Brudi/templates/primitives/layout.tsx` in Phase 0:

```bash
cp ~/Brudi/templates/primitives/layout.tsx src/components/primitives/layout.tsx
```

Diese 4 Komponenten sind PFLICHT:
- **Container** — Consistent max-width + padding (px-6 sm:px-8 lg:px-12)
- **Section** — Every major page section (MUSS id haben)
- **Stack** — Vertical spacing (use für alles Vertikale)
- **Grid** — Multi-column layouts (mobile-first responsive)

NIEMALS: hardcoded max-w-*, ad-hoc px-*, Sections ohne id.
Lies: `~/Brudi/skills/building-layout-primitives/SKILL.md`
```

---

## Change 3: templates/CLAUDE.md

### Location: Line ~248, under "Anti-Pattern Guardrails"

**BEFORE:**
```markdown
- Kein `transition: all` (spezifische Properties nur)
- Kein `gsap.from()` in React (gsap.set() + gsap.to() mit Refs)
- Kein Animieren von margin/width/height (transform nutzen)
- Keine verwaisten ScrollTrigger (cleanup in useEffect return)
- Keine hardcodierten Farben (Token nutzen)
- Kein Hero ohne Scroll-Indicator
- Keine Section ohne gestaggerte Entrance
- Keine Card ohne Hover-Depth-Change
```

**AFTER:**
```markdown
- Kein `transition: all` (spezifische Properties nur)
- Kein `gsap.from()` in React (gsap.set() + gsap.to() mit Refs)
- Kein Animieren von margin/width/height (transform nutzen)
- Keine verwaisten ScrollTrigger (cleanup in useEffect return)
- Keine hardcodierten Farben (Token nutzen)
- Kein Hero ohne Scroll-Indicator
- Keine Section ohne gestaggerte Entrance
- Keine Card ohne Hover-Depth-Change
- Keine hardcodierten max-w-* Werte auf Sections → Container nutzen
- Keine ad-hoc px-* Padding auf Sections → Container nutzen
- Keine Vertikale Stacks ohne Stack-Komponente → Stack nutzen
- Keine Multi-Column Layouts ohne Grid → Grid nutzen
- Keine Sections ohne id Attribut → id ist PFLICHT
```

---

## Change 4: templates/TASK.md

### Location: Line ~32, under Phase 0 tasks

**BEFORE:**
```markdown
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
```

**AFTER:**
```markdown
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`, `building-layout-primitives`
```

---

## Change 5: templates/TASK.md

### Location: Line ~36, insert new task after "Fonts konfigurieren"

**ADD:**
```markdown
- [ ] Layout Primitives: Copy `~/Brudi/templates/primitives/layout.tsx` → `src/components/primitives/layout.tsx`
```

---

## Change 6: templates/TASK.md

### Location: Line ~48, under "Phase 0 → Phase 1 Transition Gate"

**BEFORE:**
```markdown
- [ ] Alle Phase 0 Tasks oben ✅
- [ ] Desktop Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] Mobile 375px Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] `npm run build` = 0 Errors
- [ ] Console = 0 Errors
- [ ] PROJECT_STATUS.md Phase 0 vollständig ausgefüllt
```

**AFTER:**
```markdown
- [ ] Alle Phase 0 Tasks oben ✅
- [ ] Desktop Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] Mobile 375px Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] `npm run build` = 0 Errors
- [ ] Console = 0 Errors
- [ ] Layout Primitives importierbar (src/components/primitives/layout.tsx existiert)
- [ ] PROJECT_STATUS.md Phase 0 vollständig ausgefüllt
```

---

## Change 7: assets/INDEX.md (Optional)

### Location: Under "Templates"

**ADD:**
```markdown
- **primitives/layout.tsx** — Container, Section, Stack, Grid components (copy to src/components/)
```

This makes layout primitives discoverable in the asset registry.

---

## Change 8: Create ESLint Rules (Optional, Future)

### File: templates/eslint.config.brudi.js

Add validation rules for:

```javascript
// Pseudo-code — exact implementation depends on ESLint plugin ecosystem

rules: {
  // Warn on hardcoded max-width on section/article
  'no-hardcoded-section-maxwidth': {
    severity: 'warn',
    message: 'Use <Container size="..."> instead of hardcoded max-w-*'
  },

  // Error on Section without id
  'section-requires-id': {
    severity: 'error',
    message: 'Section component REQUIRES id prop (anchor, analytics, structure)'
  },

  // Warn on ad-hoc gap without Stack/Grid
  'use-layout-primitives-for-gaps': {
    severity: 'warn',
    message: 'Use <Stack gap="md"> or <Grid gap="md"> instead of className="...gap-..."'
  },

  // Warn on Section without semantic as prop
  'section-should-be-semantic': {
    severity: 'warn',
    message: 'Use as="section" or as="article" for semantic HTML'
  }
}
```

---

## Before & After Comparison

### Before Layout Primitives
```tsx
// Every section looked different
<section className="py-32 px-6 sm:px-8 lg:px-12">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-col gap-8">
      <h2>Features</h2>
      <p>Description</p>
    </div>
  </div>
</section>

<div className="py-24 px-4 md:px-6">
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</div>

<section className="py-40 px-8">
  <div className="max-w-7xl mx-auto px-12">
    {/* Different again */}
  </div>
</section>
```

### After Layout Primitives
```tsx
// Consistent structure everywhere
<Section id="features" spacing="lg">
  <Container>
    <Stack gap="lg">
      <h2>Features</h2>
      <p>Description</p>
    </Stack>
  </Container>
</Section>

<Section id="cards" spacing="md">
  <Container>
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
      {/* Cards */}
    </Grid>
  </Container>
</Section>

<Section id="hero" spacing="xl">
  <Container size="wide">
    {/* Consistent naming, predictable structure */}
  </Container>
</Section>
```

---

## Summary of Changes

| File | Change Type | Lines | Complexity |
|------|------------|-------|------------|
| `templates/CLAUDE.md` | Add section + update rules | ~20 | Low |
| `templates/TASK.md` | Add tasks + update gates | ~6 | Low |
| `assets/INDEX.md` | Add entry | 1 | Low |
| `templates/eslint.config.brudi.js` | Add rules (optional) | ~25 | Medium |

**Total LOC to update:** ~50 lines (mostly in markdown)
**Breaking changes:** None
**New files created:** 3 (layout.tsx, SKILL.md, this file)

---

## Rollout Plan for Maintainers

1. **Review these docs**
   - Read LAYOUT_PRIMITIVES_README.md (overview)
   - Read LAYOUT_PRIMITIVES_INTEGRATION.md (detailed guide)
   - Read this file (exact changes)

2. **Apply changes**
   - Update templates/CLAUDE.md with changes 1-3
   - Update templates/TASK.md with changes 4-6
   - Update assets/INDEX.md with change 7 (optional)

3. **Test**
   - Start a new test project
   - Verify primitives can be copied and imported
   - Verify Phase 0 builds successfully
   - Verify a simple page (hero + features + footer) works

4. **Announce**
   - Update BRUDI.md changelog with version note
   - Add release note: "Phase 0 now requires layout primitives for all projects"
   - Point to building-layout-primitives SKILL.md

---

## Verification Checklist

Before marking integration complete:

- [ ] templates/CLAUDE.md updated (3 changes)
- [ ] templates/TASK.md updated (2 changes)
- [ ] assets/INDEX.md updated (optional)
- [ ] templates/primitives/layout.tsx exists and builds
- [ ] skills/building-layout-primitives/SKILL.md is comprehensive
- [ ] Test project created successfully with primitives
- [ ] No build errors
- [ ] Console clean (0 warnings/errors)
- [ ] Mobile 375px responsive
- [ ] All sections have ids
- [ ] No hardcoded max-w-* found

---

## Questions?

Refer back to:
- **"What?"** → LAYOUT_PRIMITIVES_README.md
- **"Where?"** → This file (LAYOUT_PRIMITIVES_DIFF.md)
- **"How?"** → LAYOUT_PRIMITIVES_INTEGRATION.md
- **"Why?"** → skills/building-layout-primitives/SKILL.md
