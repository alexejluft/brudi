# Patch: templates/CLAUDE.md — Add Constraint-Layer References

**Filename:** `templates/CLAUDE.md`
**Version:** 1.0
**Date:** 2026-02-24

---

## Patch 1: Add Constraint Skills to Phase 0 List

**Location:** After line 139 (`implementing-dark-mode`)

**Current Code (lines 130-140):**
```markdown
### Phase 0: Foundation
Read these FIRST when starting any project.

- `starting-a-project` — Setup, dependency decisions, Phase 0 quality gate
- `crafting-brand-systems` — Design system foundations, tokens, color scales
- `crafting-typography` — Fluid type scales, variable fonts, hierarchy
- `designing-for-mobile` — Touch targets, thumb zones, safe areas
- `implementing-design-tokens` — CSS custom properties, naming, usage patterns
- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection
- `designing-award-layouts-core` — 8pt spacing, dark theme 4-layer system, principles
- `creating-visual-depth` — Layered shadows, glassmorphism, grainy gradients
```

**Action:** Insert TWO new lines after `implementing-dark-mode` (line 138):

```diff
- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection
+ `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection
+ `building-layout-primitives` — Layout primitives (Container, Section, Stack, Grid) for consistent spacing
+ `implementing-token-bridge` — Bridge CSS tokens to GSAP: duration, easing, spacing constants
- `designing-award-layouts-core` — 8pt spacing, dark theme 4-layer system, principles
```

**Result:**
```markdown
- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection
- `building-layout-primitives` — Layout primitives (Container, Section, Stack, Grid) for consistent spacing
- `implementing-token-bridge` — Bridge CSS tokens to GSAP: duration, easing, spacing constants
- `designing-award-layouts-core` — 8pt spacing, dark theme 4-layer system, principles
```

---

## Patch 2: Add Container Primitive Section to Creative Complexity Floor

**Location:** After line 312 (Section Container subsection)

**Current Code (lines 309-315):**
```markdown
**Section Container:**
- Entrance-Reveal (fade + translateY, 0.6–0.8s)
- Stagger auf Children (0.06–0.12s zwischen Items)
- 3+ Easing-Typen auf Seite
- Card Hover: 3+ Properties (shadow, color, border) mit verschiedenen Timings
- Card Shadow: Minimum shadow-md (NIEMALS nur border)
```

**Action:** Add NEW subsection after line 314:

```diff
- Card Shadow: Minimum shadow-md (NIEMALS nur border)
+ Card Shadow: Minimum shadow-md (NIEMALS nur border)
+
+ ### Layout Primitives (PFLICHT)
+
+ Alle Sections MÜSSEN folgende Primitive nutzen. Diese erzwingen konsistente Spacing und responsive Struktur:
+
+ **Container Primitive:**
+ - Wraps content inside JEDER Section
+ - Handles: consistent horizontal padding, centered max-width, responsive width
+ - Props: `size?: 'narrow' | 'default' | 'wide' | 'full'`
+ - Mapping: narrow = max-w-4xl, default = max-w-6xl, wide = max-w-7xl, full = max-w-none
+
+ **Section Primitive:**
+ - Wraps JEDER major section (hero, features, cta, footer)
+ - Props: `id` (REQUIRED), `spacing?: 'sm' | 'md' | 'lg' | 'xl'`
+ - Spacing: sm = py-16, md = py-24, lg = py-32, xl = py-40
+
+ **Example — RICHTIG:**
+ ```tsx
+ <Section id="features" spacing="lg">
+   <Container size="default">
+     <h2>Features</h2>
+   </Container>
+   <Container size="wide">
+     <Grid cols={{ sm: 1, md: 2, lg: 3 }}>
+       {/* Cards */}
+     </Grid>
+   </Container>
+ </Section>
+ ```
+
+ **Forbidden Patterns:**
+ - Hardcoded `max-w-5xl mx-auto px-4` (use Container instead)
+ - Different `px-*` padding per section (Container enforces consistency)
+ - `py-16 md:py-24` in arbitrary places (Section enforces vertical spacing)
```

---

## Patch 3: Add Hardcoded Values to Forbidden Patterns

**Location:** After line 331 (existing "Keine Card ohne Hover-Depth-Change")

**Current Code (lines 323-333):**
```markdown
### Verbotene Patterns (ESLint enforced, 0 Toleranz)

- Kein `transition: all` (spezifische Properties nur)
- Kein `gsap.from()` in React (gsap.set() + gsap.to() mit Refs)
- Kein Animieren von margin/width/height (transform nutzen)
- Keine verwaisten ScrollTrigger (cleanup in useEffect return)
- Keine hardcodierten Farben (Token nutzen)
- Kein Hero ohne Scroll-Indicator
- Keine Section ohne gestaggerte Entrance
- Keine Card ohne Hover-Depth-Change
```

**Action:** Add TWO new lines after line 331:

```diff
- Keine Card ohne Hover-Depth-Change
+ Keine Card ohne Hover-Depth-Change
+ - Keine ad-hoc `max-w-*` außerhalb Container Primitive (Container nutzen)
+ - Keine hardcodierten GSAP `duration` oder `easing` Werte (tokens.ts importieren: `duration.normal`, `easing.enter`)
```

---

## Patch 4: Update Verification Pre-Screenshot Checklist

**Location:** After line 342 ("PROJECT_STATUS.md mit Animation-Count updaten")

**Current Code (lines 334-344):**
```markdown
### Verification Pre-Screenshot

1. `npm run lint` — 0 ESLint Violations
2. `npm run build` — Exit Code 0
3. Console: 0 Errors
4. Desktop: Alle Animationen smooth
5. Mobile 375px: Lesbar + smooth
6. Scroll: Parallax + Reveals aktiv
7. PROJECT_STATUS.md mit Animation-Count updaten

**Wenn ANY failt → Erst fixen, DANN Screenshot.**
```

**Action:** Insert TWO new lines after line 342:

```diff
7. PROJECT_STATUS.md mit Animation-Count updaten
+ 8. Layout Primitives (Container/Section) korrekt genutzt in allen Sections
+ 9. Token Bridge imports vorhanden: `import { duration, easing } from '@/primitives/tokens'`
```

**Result:**
```markdown
### Verification Pre-Screenshot

1. `npm run lint` — 0 ESLint Violations
2. `npm run build` — Exit Code 0
3. Console: 0 Errors
4. Desktop: Alle Animationen smooth
5. Mobile 375px: Lesbar + smooth
6. Scroll: Parallax + Reveals aktiv
7. PROJECT_STATUS.md mit Animation-Count updaten
8. Layout Primitives (Container/Section) korrekt genutzt in allen Sections
9. Token Bridge imports vorhanden: `import { duration, easing } from '@/primitives/tokens'`

**Wenn ANY failt → Erst fixen, DANN Screenshot.**
```

---

## Patch 5: Update Non-Negotiables Section (Optional, for Emphasis)

**Location:** After line 45 (optional enhancement)

**Current Code (lines 37-46):**
```markdown
## Alex's Non-Negotiables

```
TypeScript strict mode — always
Tailwind CSS — always (no CSS-in-JS, no styled-components)
Mobile-first — first breakpoint is phone
4 UI states — Loading, Error, Empty, Content (never skip)
Vertical Slices — each section COMPLETE before the next
Visual Verification — screenshot before marking "done"
```
```

**Action (OPTIONAL):** Add one line at the end:

```diff
Visual Verification — screenshot before marking "done"
+ Layout Primitives — Container/Section must structure every page (no ad-hoc spacing)
```

---

## Summary of Changes to templates/CLAUDE.md

| Line | Change | Type | Impact |
|------|--------|------|--------|
| ~138 | Add `building-layout-primitives` + `implementing-token-bridge` to Phase 0 skills | Insert 2 lines | Constraint visibility in bootstrap |
| ~314 | Add "Layout Primitives (PFLICHT)" subsection with examples | Insert 30 lines | Clarifies primitive usage patterns |
| ~331 | Add 2 forbidden patterns (ad-hoc max-w-*, hardcoded duration/easing) | Insert 2 lines | Prevents circumvention patterns |
| ~342 | Add steps 8-9 to verification checklist | Insert 2 lines | Forces primitive/token verification |
| ~45 | Add "Layout Primitives" to Non-Negotiables (OPTIONAL) | Insert 1 line | Sets tone for constraint importance |

**Total additions:** ~37 lines
**Total deletions:** 0 lines
**Result:** Constraint layer fully visible in project-level agent instructions

---

## How to Apply These Patches

### Option 1: Manual Application (Recommended)

1. Open `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/CLAUDE.md`
2. Find each "Location:" line above
3. Make the exact change described in "Action:"
4. Verify the "Result:" shows the intended output
5. Save file

### Option 2: Automated (Using Edit Tool)

Apply each patch in sequence using the Edit tool with the old_string and new_string.

**Example:**
```
old_string: "- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection\n- `designing-award-layouts-core`"

new_string: "- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection\n- `building-layout-primitives` — Layout primitives (Container, Section, Stack, Grid) for consistent spacing\n- `implementing-token-bridge` — Bridge CSS tokens to GSAP: duration, easing, spacing constants\n- `designing-award-layouts-core`"
```

---

**End of Patch Document**

Verification: All patches maintain markdown structure and line continuity.
