# Patch: templates/TASK.md — Add Constraint Phase 0 Tasks

**Filename:** `templates/TASK.md`
**Version:** 1.0
**Date:** 2026-02-24

---

## Patch 1: Update Phase 0 Skills List

**Location:** Line 32 (the long skills line)

**Current Code (line 32):**
```markdown
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `designing-for-mobile`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
```

**Action:** Replace the entire skills line with EXPANDED version:

```diff
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `designing-for-mobile`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`

+ [ ] Skills lesen (PFLICHT, in dieser Reihenfolge):
+   1. `starting-a-project` — Setup, dependency decisions, Phase 0 quality gate
+   2. `building-layout-primitives` — Layout primitives for consistent spacing (BLOCKADE: Phase 1 needs this)
+   3. `implementing-token-bridge` — Token bridge for GSAP animations (BLOCKADE: Phase 1 needs this)
+   4. `crafting-brand-systems` — Design system foundations
+   5. `crafting-typography` — Fluid type scales, variable fonts
+   6. `implementing-design-tokens` — CSS custom properties
+   7. `implementing-dark-mode` — Light/dark theme layering
+   8. `designing-award-layouts-core` — 8pt spacing, dark layers
+   9. `creating-visual-depth` — Shadows, glassmorphism, gradients
```

**Rationale:**
- Skills 2-3 (layout-primitives + token-bridge) are now EXPLICITLY listed first after starting-a-project
- Numbered list makes order clear
- Comment "(BLOCKADE: Phase 1 needs this)" signals that skipping them blocks Phase 1
- Grouped into logical order: foundation → constraints → design

---

## Patch 2: Add Primitive Creation Tasks

**Location:** After line 32 (skills line) and BEFORE line 33 (`create-next-app`)

**Current Code (lines 33-36):**
```markdown
- [ ] `create-next-app` + Abhängigkeiten installieren
- [ ] globals.css mit 4 Dark-Layers + Tokens + Brand Colors
- [ ] Fonts konfigurieren: [Display-Font] + [Body-Font]
- [ ] Lenis + GSAP Ticker initialisieren (SmoothScroll-Komponente)
```

**Action:** Insert THREE new tasks BEFORE `create-next-app`:

```diff
+ [ ] Create layout primitives from template:
+   - `mkdir -p app/components/primitives`
+   - `cp ~/Brudi/templates/primitives/layout.tsx app/components/primitives/index.tsx`
+   - Verify: Container, Section, Stack, Grid exported + typed
+ [ ] Create token bridge from template:
+   - `mkdir -p app/primitives`
+   - `cp ~/Brudi/templates/primitives/tokens.ts app/primitives/tokens.ts`
+   - Verify: duration, easing, spacing, colors exported
+ [ ] Create animation hooks from templates:
+   - `mkdir -p app/hooks`
+   - `cp ~/Brudi/templates/primitives/use-*.ts app/hooks/`
+   - Verify: use-scroll-reveal, use-stagger-entrance, use-hover-transform exist
- [ ] `create-next-app` + Abhängigkeiten installieren
```

**Result (lines 33-45):**
```markdown
- [ ] Create layout primitives from template:
  - `mkdir -p app/components/primitives`
  - `cp ~/Brudi/templates/primitives/layout.tsx app/components/primitives/index.tsx`
  - Verify: Container, Section, Stack, Grid exported + typed
- [ ] Create token bridge from template:
  - `mkdir -p app/primitives`
  - `cp ~/Brudi/templates/primitives/tokens.ts app/primitives/tokens.ts`
  - Verify: duration, easing, spacing, colors exported
- [ ] Create animation hooks from templates:
  - `mkdir -p app/hooks`
  - `cp ~/Brudi/templates/primitives/use-*.ts app/hooks/`
  - Verify: use-scroll-reveal, use-stagger-entrance, use-hover-transform exist
- [ ] `create-next-app` + Abhängigkeiten installieren
- [ ] globals.css mit 4 Dark-Layers + Tokens + Brand Colors
- [ ] Fonts konfigurieren: [Display-Font] + [Body-Font]
- [ ] Lenis + GSAP Ticker initialisieren (SmoothScroll-Komponente)
```

---

## Patch 3: Update Phase 1 Slice Checklist Instructions

**Location:** After line 58 (Pro Slice — Pflicht-Ablauf:) and BEFORE line 60 (Sektionsspezifische Skills)

**Current Code (lines 59-66):**
```markdown
**Pro Slice — Pflicht-Ablauf:**
1. `verifying-ui-quality` SKILL.md lesen (in Skill-Log dokumentieren)
2. Sektionsspezifische Skills lesen
3. Code schreiben
4. `npm run build` — muss 0 Errors haben
5. Screenshot Desktop machen → Dateipfad in PROJECT_STATUS.md
6. Screenshot Mobile 375px machen → Dateipfad in PROJECT_STATUS.md
7. Console prüfen → 0 Errors
8. PROJECT_STATUS.md Slice-Zeile aktualisieren (alle Spalten)
```

**Action:** Expand step 2 and add new step 2a-b:

```diff
**Pro Slice — Pflicht-Ablauf:**
1. `verifying-ui-quality` SKILL.md lesen (in Skill-Log dokumentieren)
2. Sektionsspezifische Skills lesen
+ 2a. Verify: `building-layout-primitives` gelesen + documented in Skill-Log
+ 2b. Verify: `implementing-token-bridge` gelesen + documented in Skill-Log (for animations)
3. Code schreiben
```

**Result:**
```markdown
**Pro Slice — Pflicht-Ablauf:**
1. `verifying-ui-quality` SKILL.md lesen (in Skill-Log dokumentieren)
2. Sektionsspezifische Skills lesen
2a. Verify: `building-layout-primitives` gelesen + documented in Skill-Log
2b. Verify: `implementing-token-bridge` gelesen + documented in Skill-Log (for animations)
3. Code schreiben
...
```

---

## Patch 4: Add Constraint Enforcement Note to Phase 1→2 Gate

**Location:** After line 85 ("Wenn eine Bedingung ❌ → Keine neue Seite darf begonnen werden.")

**Current Code (lines 76-88):**
```markdown
### ⛔ Phase 1 → Phase 2 Transition Gate

ALLE folgenden Bedingungen müssen ✅ sein bevor Phase 2 beginnen darf:

- [ ] Alle Phase 1 Slices oben ✅
- [ ] JEDER Slice hat Desktop Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Mobile 375px Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Console = 0
- [ ] JEDER Slice hat Quality Gate mit 3 benannten Checks
- [ ] Kein Slice hat "—" oder leere Zellen in PROJECT_STATUS.md

**Wenn eine Bedingung ❌ → Keine neue Seite darf begonnen werden.**
```

**Action:** Add THREE new conditions:

```diff
- [ ] JEDER Slice hat Quality Gate mit 3 benannten Checks
- [ ] Kein Slice hat "—" oder leere Zellen in PROJECT_STATUS.md

+ - [ ] JEDER Slice hat "Primitives" ✅ in PROJECT_STATUS.md (Layout Primitives wurden genutzt)
+ - [ ] JEDER Slice hat "Tokens" ✅ in PROJECT_STATUS.md (Token Bridge wurde importiert in animations)
+ - [ ] Kein Slice hat "—" oder leere Zellen in PROJECT_STATUS.md
```

**Result:**
```markdown
### ⛔ Phase 1 → Phase 2 Transition Gate

ALLE folgenden Bedingungen müssen ✅ sein bevor Phase 2 beginnen darf:

- [ ] Alle Phase 1 Slices oben ✅
- [ ] JEDER Slice hat Desktop Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Mobile 375px Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Console = 0
- [ ] JEDER Slice hat Quality Gate mit 3 benannten Checks
- [ ] JEDER Slice hat "Primitives" ✅ in PROJECT_STATUS.md (Layout Primitives wurden genutzt)
- [ ] JEDER Slice hat "Tokens" ✅ in PROJECT_STATUS.md (Token Bridge wurde importiert in animations)
- [ ] Kein Slice hat "—" oder leere Zellen in PROJECT_STATUS.md

**Wenn eine Bedingung ❌ → Keine neue Seite darf begonnen werden.**
```

---

## Patch 5: Update Hard Gates Slice Completion Checklist (Optional Enhancement)

**Location:** After line 119 (existing Slice Completion Checklist section)

**Current Code (lines 109-121):**
```markdown
### Slice Completion Checklist (JEDER Slice)

| # | Gate | Akzeptierte Evidenz |
|---|------|---------------------|
| 1 | `verifying-ui-quality` gelesen | Skill-Name + Datum im Skill-Log |
| 2 | Code funktional | `npm run build` = 0 Errors |
| 3 | Desktop Screenshot | Datei existiert + Pfad in PROJECT_STATUS.md |
| 4 | Mobile 375px Screenshot | Datei existiert + Pfad in PROJECT_STATUS.md |
| 5 | Console = 0 Errors | DevTools-Screenshot ODER Build-Output |
| 6 | PROJECT_STATUS.md aktualisiert | Alle Spalten gefüllt, keine "—" oder leere Zellen |

**Nächster Slice erst wenn alle 6 Punkte ✅. "Code Audit stattdessen" ist KEINE akzeptierte Evidenz.**
```

**Action (OPTIONAL):** Add TWO new gates:

```diff
| 6 | PROJECT_STATUS.md aktualisiert | Alle Spalten gefüllt, keine "—" oder leere Zellen |

+ | 7 | Layout Primitives genutzt | Container/Section in PROJECT_STATUS.md Primitives-Spalte = ✅ |
+ | 8 | Token Bridge importiert | duration/easing imports in PROJECT_STATUS.md Tokens-Spalte = ✅ |
```

---

## Summary of Changes to templates/TASK.md

| Line | Change | Type | Impact |
|------|--------|------|--------|
| 32 | Expand skills list: add building-layout-primitives + implementing-token-bridge as numbered items 2-3 | Replace 1 line with ~10 | Visibility of constraint skills |
| ~33-44 | Insert 3 new Phase 0 tasks: create-primitives, create-token-bridge, create-hooks | Insert 15 lines | BLOCKADE: Phase 1 cannot start without these |
| ~60-62 | Add verification steps 2a-b: check that primitives + tokens skills were read | Insert 2 lines | Skill-Log proof required |
| ~85-87 | Add 2 new Phase 1→2 gate conditions: Primitives ✅, Tokens ✅ | Insert 2 lines | Blocks Phase 2 unless both tracked |
| ~119-121 | Add 2 new gates to Slice Completion Checklist (OPTIONAL) | Insert 2 lines | Reinforces 8-gate system |

**Total additions:** ~31 lines
**Total deletions:** 0 lines (1 line replaced with expanded version)
**Result:** Constraint enforcement wired into Phase 0 task pipeline

---

## How to Apply These Patches

### Option 1: Manual Application (Recommended)

1. Open `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/TASK.md`
2. Find each "Location:" and "Current Code:" section above
3. Make the exact change described in "Action:"
4. Verify the "Result:" shows intended output
5. Save file

### Option 2: Using Edit Tool

Apply patches in sequence. Example for Patch 1:

```
File: templates/TASK.md
old_string: "- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `designing-for-mobile`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`"

new_string: "- [ ] Skills lesen (PFLICHT, in dieser Reihenfolge):
  1. `starting-a-project` — Setup, dependency decisions, Phase 0 quality gate
  2. `building-layout-primitives` — Layout primitives for consistent spacing (BLOCKADE: Phase 1 needs this)
  3. `implementing-token-bridge` — Token bridge for GSAP animations (BLOCKADE: Phase 1 needs this)
  4. `crafting-brand-systems` — Design system foundations
  5. `crafting-typography` — Fluid type scales, variable fonts
  6. `implementing-design-tokens` — CSS custom properties
  7. `implementing-dark-mode` — Light/dark theme layering
  8. `designing-award-layouts-core` — 8pt spacing, dark layers
  9. `creating-visual-depth` — Shadows, glassmorphism, gradients"
```

---

**End of Patch Document**

Verification: All patches maintain markdown structure and are additive (no destructive changes).
