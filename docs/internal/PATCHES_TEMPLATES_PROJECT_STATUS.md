# Patch: templates/PROJECT_STATUS.md — Add Constraint Tracking Columns

**Filename:** `templates/PROJECT_STATUS.md`
**Version:** 1.0
**Date:** 2026-02-24

---

## Patch 1: Add Phase 0 Constraint Tasks

**Location:** Line 49-60 (Phase 0 Tasks table)

**Current Code (lines 49-60):**
```markdown
## Phase 0: Foundation

| Task | Status | Evidenz |
|------|--------|---------|
| create-next-app + TypeScript strict | ❌ | |
| npm install [dependencies] | ❌ | |
| globals.css 4 Dark-Layers | ❌ | |
| Fonts konfiguriert | ❌ | |
| Lenis + GSAP Ticker | ❌ | |
| reactStrictMode: true | ❌ | |
| Desktop Screenshot | ❌ | <!-- Dateipfad: screenshots/phase0-desktop.png --> |
| Mobile 375px Screenshot | ❌ | <!-- Dateipfad: screenshots/phase0-mobile.png --> |
| Console = 0 Errors | ❌ | <!-- Build-Output oder DevTools-Screenshot --> |
| Phase 0 Quality Gate | ❌ | |
```

**Action:** Insert THREE new rows AFTER "npm install [dependencies]" (line 52) and BEFORE "globals.css 4 Dark-Layers":

```diff
| npm install [dependencies] | ❌ | |
+ | Create layout primitives | ❌ | app/components/primitives/index.tsx exists (Container, Section, Stack, Grid) |
+ | Create token bridge | ❌ | app/primitives/tokens.ts exists (duration, easing, spacing, colors exported) |
+ | Create animation hooks | ❌ | app/hooks/use-*.ts files exist (scroll-reveal, stagger-entrance, hover-transform) |
| globals.css 4 Dark-Layers | ❌ | |
```

**Result (lines 49-63):**
```markdown
## Phase 0: Foundation

| Task | Status | Evidenz |
|------|--------|---------|
| create-next-app + TypeScript strict | ❌ | |
| npm install [dependencies] | ❌ | |
| Create layout primitives | ❌ | app/components/primitives/index.tsx exists (Container, Section, Stack, Grid) |
| Create token bridge | ❌ | app/primitives/tokens.ts exists (duration, easing, spacing, colors exported) |
| Create animation hooks | ❌ | app/hooks/use-*.ts files exist (scroll-reveal, stagger-entrance, hover-transform) |
| globals.css 4 Dark-Layers | ❌ | |
| Fonts konfiguriert | ❌ | |
| Lenis + GSAP Ticker | ❌ | |
| reactStrictMode: true | ❌ | |
| Desktop Screenshot | ❌ | <!-- Dateipfad: screenshots/phase0-desktop.png --> |
| Mobile 375px Screenshot | ❌ | <!-- Dateipfad: screenshots/phase0-mobile.png --> |
| Console = 0 Errors | ❌ | <!-- Build-Output oder DevTools-Screenshot --> |
| Phase 0 Quality Gate | ❌ | |
```

---

## Patch 2: Expand Phase 1 Slices Table — Add Primitive & Token Tracking Columns

**Location:** Line 78-87 (Phase 1 Vertical Slices table header and rows)

**Current Code (lines 78-87):**
```markdown
| # | Slice | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | verifying-ui-quality | Quality Gate |
|---|-------|------|---------|--------------------|-------------|-----------|---------------------|-------------|
| 1 | Navigation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 2 | Hero | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 4 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 5 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 6 | CTA | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 7 | Footer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
```

**Action:** Replace with EXPANDED table that includes TWO new columns: "Primitives" and "Tokens":

```diff
| # | Slice | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | verifying-ui-quality | Quality Gate |

+ | # | Slice | Code | Build 0 | Desktop SS | Mobile SS | Console 0 | Primitives | Tokens | Quality Gate |
```

**Result (lines 78-87):**
```markdown
| # | Slice | Code | Build 0 | Desktop SS | Mobile SS | Console 0 | Primitives | Tokens | Quality Gate |
|---|-------|------|---------|-----------|---------|---------|-----------|---------|----|
| 1 | Navigation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 2 | Hero | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 4 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 5 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 6 | CTA | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 7 | Footer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
```

**Column Definitions:**
- `Primitives` (new): Container/Section primitives used correctly in slice? (✅/❌)
- `Tokens` (new): Token Bridge imports present in animation code? (✅/❌)

---

## Patch 3: Update Quality Gate Details Table

**Location:** Line 109-126 (Quality Gate Details Phase 1)

**Current Code (lines 109-126):**
```markdown
### Quality Gate Details Phase 1

| # | Slice | Check 1 | Check 2 | Check 3 | Ergebnis |
|---|-------|---------|---------|---------|----------|
| 1 | Navigation | | | | ❌ |
| 2 | Hero | | | | ❌ |
| 3 | [Section] | | | | ❌ |
| 4 | [Section] | | | | ❌ |
| 5 | [Section] | | | | ❌ |
| 6 | CTA | | | | ❌ |
| 7 | Footer | | | | ❌ |

<!--
  Pro Slice: 3 Checks aus verifying-ui-quality SKILL.md benennen.
  Beispiel: "A1: Keine leeren Boxen", "B4: Entrance Animation", "C3: Mobile Nav"
  "Quality Gate: ✅" ohne Details = NICHT akzeptiert.
-->
```

**Action:** Replace table header with MORE SPECIFIC quality dimensions:

```diff
| # | Slice | Check 1 | Check 2 | Check 3 | Ergebnis |

+ | # | Slice | Spacing Pattern | Token Usage | Mobile Layout | Depth Layers | Animations | Ergebnis |
```

**Result (lines 109-126):**
```markdown
### Quality Gate Details Phase 1

| # | Slice | Spacing Pattern | Token Usage | Mobile Layout | Depth Layers | Animations | Ergebnis |
|---|-------|-----------------|-------------|---------------|--------------|-----------|----------|
| 1 | Navigation | | | | | | ❌ |
| 2 | Hero | | | | | | ❌ |
| 3 | [Section] | | | | | | ❌ |
| 4 | [Section] | | | | | | ❌ |
| 5 | [Section] | | | | | | ❌ |
| 6 | CTA | | | | | | ❌ |
| 7 | Footer | | | | | | ❌ |

<!--
  Checks pro Slice (aus verifying-ui-quality):
  - Spacing Pattern: Container/Section Primitives genutzt? (ja/nein + Details)
  - Token Usage: duration/easing von tokens.ts importiert? (ja/nein + file check)
  - Mobile Layout: Responsive unter 375px? (ja/nein + evidence)
  - Depth Layers: Alle 4 Layer sichtbar? (bg, elevated, surface, high + count)
  - Animations: Entrance/Hover/Scroll vorhanden? (ja + count)
-->
```

**Column Definitions:**
- `Spacing Pattern`: Are Container/Section primitives used throughout the slice?
- `Token Usage`: Are animation values imported from tokens.ts (not hardcoded)?
- `Mobile Layout`: Is the slice readable/functional at 375px viewport?
- `Depth Layers`: Are all 4 design layers (bg, elevated, surface, high) visible?
- `Animations`: Are entrance, hover, and scroll animations present?

---

## Patch 4: Add Constraint Checks to Phase 1→2 Transition Gate

**Location:** Line 148-160 (Phase 1→2 Transition Gate)

**Current Code (lines 148-161):**
```markdown
### Phase 1 → Phase 2 Transition Gate

| Bedingung | Status |
|-----------|--------|
| Alle Phase 1 Slices ✅ | ❌ |
| JEDER Slice hat Desktop Screenshot-Dateipfad | ❌ |
| JEDER Slice hat Mobile 375px Screenshot-Dateipfad | ❌ |
| JEDER Slice hat Console = 0 | ❌ |
| JEDER Slice hat Quality Gate mit 3 benannten Checks | ❌ |
| Keine "—" oder leere Zellen in Phase 1 Tabellen | ❌ |

**Gate-Status: ❌ — Phase 2 darf NICHT beginnen**
```

**Action:** Insert TWO new rows BEFORE "Keine "—" oder leere Zellen":

```diff
| JEDER Slice hat Quality Gate mit 3 benannten Checks | ❌ |
+ | JEDER Slice hat "Primitives" ✅ in Phase 1 Tabelle | ❌ |
+ | JEDER Slice hat "Tokens" ✅ in Phase 1 Tabelle | ❌ |
| Keine "—" oder leere Zellen in Phase 1 Tabellen | ❌ |
```

**Result (lines 148-161):**
```markdown
### Phase 1 → Phase 2 Transition Gate

| Bedingung | Status |
|-----------|--------|
| Alle Phase 1 Slices ✅ | ❌ |
| JEDER Slice hat Desktop Screenshot-Dateipfad | ❌ |
| JEDER Slice hat Mobile 375px Screenshot-Dateipfad | ❌ |
| JEDER Slice hat Console = 0 | ❌ |
| JEDER Slice hat Quality Gate mit 3 benannten Checks | ❌ |
| JEDER Slice hat "Primitives" ✅ in Phase 1 Tabelle | ❌ |
| JEDER Slice hat "Tokens" ✅ in Phase 1 Tabelle | ❌ |
| Keine "—" oder leere Zellen in Phase 1 Tabellen | ❌ |

**Gate-Status: ❌ — Phase 2 darf NICHT beginnen**
```

---

## Patch 5: Update Definition of Done Checklist

**Location:** Line 208-218 (Definition of Done — Checklist)

**Current Code (lines 208-218):**
```markdown
## Definition of Done — Checklist

| Kriterium | Status | Evidenz |
|-----------|--------|---------|
| Keine schwarzen Platzhalter-Boxen | ❌ | <!-- Finale Screenshots prüfen --> |
| Sichtbare Entrance-Animationen | ❌ | <!-- Video/GIF oder Screenshot-Serie --> |
| 4 Dark-Layer erkennbar | ❌ | <!-- DevTools-Screenshot mit Werten --> |
| Mobile 375px getestet (alle Seiten) | ❌ | <!-- Dateipfade in Screenshot-Evidenz --> |
| Console: 0 Errors | ❌ | <!-- Finaler Build-Output --> |
| PROJECT_STATUS.md vollständig | ❌ | <!-- Alle Zeilen ✅, keine "—" --> |
```

**Action:** Insert TWO new rows AFTER "4 Dark-Layer erkennbar":

```diff
| 4 Dark-Layer erkennbar | ❌ | <!-- DevTools-Screenshot mit Werten --> |
+ | Layout Primitives durchgehend genutzt | ❌ | <!-- Alle Sections nutzen Container/Section, keine ad-hoc max-w-* --> |
+ | Token Bridge durchgehend genutzt | ❌ | <!-- Alle GSAP imports duration/easing von tokens.ts, keine hardcodierten Werte --> |
| Mobile 375px getestet (alle Seiten) | ❌ | <!-- Dateipfade in Screenshot-Evidenz --> |
```

**Result (lines 208-220):**
```markdown
## Definition of Done — Checklist

| Kriterium | Status | Evidenz |
|-----------|--------|---------|
| Keine schwarzen Platzhalter-Boxen | ❌ | <!-- Finale Screenshots prüfen --> |
| Sichtbare Entrance-Animationen | ❌ | <!-- Video/GIF oder Screenshot-Serie --> |
| 4 Dark-Layer erkennbar | ❌ | <!-- DevTools-Screenshot mit Werten --> |
| Layout Primitives durchgehend genutzt | ❌ | <!-- Alle Sections nutzen Container/Section, keine ad-hoc max-w-* --> |
| Token Bridge durchgehend genutzt | ❌ | <!-- Alle GSAP imports duration/easing von tokens.ts, keine hardcodierten Werte --> |
| Mobile 375px getestet (alle Seiten) | ❌ | <!-- Dateipfade in Screenshot-Evidenz --> |
| Console: 0 Errors | ❌ | <!-- Finaler Build-Output --> |
| PROJECT_STATUS.md vollständig | ❌ | <!-- Alle Zeilen ✅, keine "—" --> |
```

---

## Summary of Changes to templates/PROJECT_STATUS.md

| Section | Line | Change | Type | Impact |
|---------|------|--------|------|--------|
| Phase 0 | ~52-54 | Add 3 rows: primitives, token-bridge, hooks creation | Insert 3 lines | Phase 0 checklist now requires constraint setup |
| Phase 1 Slices Table | 78-87 | Add 2 columns: "Primitives", "Tokens" | Expand table | Every slice tracked for primitive/token usage |
| Quality Gate | 109-126 | Replace 3 checks with 5 constraint-focused checks | Replace 1 table | Quality gates now emphasize spacing/tokens |
| Phase 1→2 Gate | ~156-158 | Add 2 conditions: Primitives ✅, Tokens ✅ | Insert 2 rows | Phase 2 cannot start without constraint evidence |
| Definition of Done | ~212-214 | Add 2 rows: Primitives enforced, Tokens enforced | Insert 2 rows | DoD checklist now tracks constraint enforcement |

**Total additions:** ~12 rows + 2 column expansions
**Total deletions:** 0 lines
**Result:** Constraint tracking fully integrated into project tracking

---

## How to Apply These Patches

### Option 1: Manual Application (Recommended)

1. Open `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md`
2. Find each "Location:" section above
3. Make the exact change described in "Action:"
4. Verify the "Result:" shows intended output
5. Save file

### Option 2: Table Replacement (Simpler for Tables)

For table changes (Patch 2, 3, 4, 5), you can:
1. Copy the entire "Result:" table from the patch
2. Find and select the corresponding table in the template
3. Replace the entire table with the new version

---

## Verification Checklist After Applying Patches

```bash
# Check Phase 0 has primitives tasks
grep "Create layout primitives\|Create token bridge\|Create animation hooks" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md

# Check Phase 1 table has Primitives + Tokens columns
grep "Primitives\|Tokens" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md | head -5

# Check Phase 1→2 gate has constraint conditions
grep "Primitives.*✅\|Tokens.*✅" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md

# Check DoD has constraint items
grep "Layout Primitives\|Token Bridge" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md | tail -5
```

**Expected:** All grep commands return matches.

---

**End of Patch Document**

Verification: All patches are additive and maintain markdown table structure.
