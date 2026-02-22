# [Projektname] — Project Status

**Letztes Update:** [Datum]
**Commit:** [Hash oder "uncommitted"]
**Modus:** BUILD

---

## Status-Symbole (NUR diese 4 erlaubt)

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Abgeschlossen — Evidenz vorhanden |
| ❌ | Nicht begonnen |
| 🟨 | In Arbeit |
| ⬜ | Nicht anwendbar für diesen Kontext |

**"—" (Dash) und leere Zellen sind VERBOTEN.**

---

## Phasen-Übersicht

| Phase | Status | Completion | Gate bestanden |
|-------|--------|------------|----------------|
| Phase 0: Foundation | ❌ | 0/8 | ❌ |
| Phase 1: Vertical Slices (Homepage) | ❌ | 0/X Slices | ❌ |
| Phase 2: Restliche Seiten | ❌ | 0/X | ❌ |

---

## Skill-Log

| Datum | Phase/Slice | Skill gelesen | Dateiname |
|-------|-------------|---------------|-----------|
| | Phase 0 | starting-a-project | SKILL.md |
| | Phase 0 | crafting-brand-systems | SKILL.md |
| | Slice 1 | verifying-ui-quality | SKILL.md |

<!--
  Jeder Skill-Read wird hier dokumentiert.
  "Skill gelesen" ohne Eintrag hier = NICHT gelesen.
-->

---

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

### Phase 0 → Phase 1 Transition Gate

| Bedingung | Status |
|-----------|--------|
| Alle Phase 0 Tasks ✅ | ❌ |
| Desktop Screenshot Dateipfad dokumentiert | ❌ |
| Mobile 375px Screenshot Dateipfad dokumentiert | ❌ |
| `npm run build` = 0 Errors | ❌ |
| Console = 0 Errors | ❌ |

**Gate-Status: ❌ — Phase 1 darf NICHT beginnen**

---

## Phase 1: Vertical Slices

| # | Slice | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | verifying-ui-quality | Quality Gate |
|---|-------|------|---------|--------------------|-------------|-----------|---------------------|-------------|
| 1 | Navigation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 2 | Hero | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 4 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 5 | [Section] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 6 | CTA | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 7 | Footer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Screenshot-Evidenz Phase 1

| # | Slice | Desktop Dateipfad | Mobile Dateipfad |
|---|-------|-------------------|------------------|
| 1 | Navigation | | |
| 2 | Hero | | |
| 3 | [Section] | | |
| 4 | [Section] | | |
| 5 | [Section] | | |
| 6 | CTA | | |
| 7 | Footer | | |

<!--
  PFLICHT: Jede Zelle muss einen Dateipfad enthalten, z.B.:
  screenshots/slice-1-nav-desktop.png
  screenshots/slice-1-nav-mobile-375.png

  Leere Zellen = Slice NICHT abgeschlossen.
  "Code Audit" oder "responsive Code" ist KEIN Ersatz.
-->

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

---

## Phase 2: Restliche Seiten

| Seite | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | verifying-ui-quality | Quality Gate |
|-------|------|---------|--------------------|-------------|-----------|---------------------|-------------|
| [/seite-1] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| [/seite-2] | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| /impressum | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| /datenschutz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Screenshot-Evidenz Phase 2

| Seite | Desktop Dateipfad | Mobile Dateipfad |
|-------|-------------------|------------------|
| [/seite-1] | | |
| [/seite-2] | | |
| /impressum | | |
| /datenschutz | | |

### Phase 2 → Abschluss Transition Gate

| Bedingung | Status |
|-----------|--------|
| Alle Seiten ✅ | ❌ |
| Definition of Done ✅ | ❌ |
| Finaler `npm run build` = 0 Errors | ❌ |

**Gate-Status: ❌ — Projekt NICHT abgeschlossen**

---

## Bekannte Issues

| Issue | Severity | Status | Blocker für |
|-------|----------|--------|------------|

<!--
  Severity: CRITICAL / HIGH / MEDIUM / LOW
  Status: ✅ ❌ 🟨
  Blocker für: z.B. "Phase 1 Gate" oder "Slice 3"
-->

---

## Definition of Done — Checklist

| Kriterium | Status | Evidenz |
|-----------|--------|---------|
| Keine schwarzen Platzhalter-Boxen | ❌ | <!-- Finale Screenshots prüfen --> |
| Sichtbare Entrance-Animationen | ❌ | <!-- Video/GIF oder Screenshot-Serie --> |
| 4 Dark-Layer erkennbar | ❌ | <!-- DevTools-Screenshot mit Werten --> |
| Mobile 375px getestet (alle Seiten) | ❌ | <!-- Dateipfade in Screenshot-Evidenz --> |
| Console: 0 Errors | ❌ | <!-- Finaler Build-Output --> |
| PROJECT_STATUS.md vollständig | ❌ | <!-- Alle Zeilen ✅, keine "—" --> |

---

## Nächster Task

1. [Was als nächstes zu tun ist]
