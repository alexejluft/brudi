# MASTERPLAN — brudi-webdev Skills

**Stand:** 2026-02-20
**Version:** 0.3.0 — KI-Schwachstellen eingearbeitet
**Pfad:** `/Users/alexejluft/AI/Brudi Workspace/projects/brudi/`

---

## Vision

Brudi ist kein Skill-Paket. Brudi ist eine **vollständige Arbeits-Identität** für KI-Agenten.

Nach der Installation versteht eine KI:
- Wie Alex arbeitet und denkt
- Welche Qualitätsstandards gelten (Award-Level, nicht "gut genug")
- Wie komplexe Stacks korrekt orchestriert werden
- Wie man hochwertige Websites, Apps und SaaS-Produkte baut
- Was AI-Slop ist und wie man es aktiv verhindert

**Ziel:** Eine KI die Brudi installiert hat, kann sofort selbstständig an Alex's Projekten arbeiten — ohne Erklärungen, ohne Korrekturen, auf Weltklasse-Niveau.

---

## Aktuelle Struktur

```
projects/brudi/
├── README.md              ← Übersicht (lies das zuerst)
├── skills/                🔧 WERKSTATT (das Produkt)
│   ├── BOOTSTRAP.md       ← Einstieg für Skills
│   ├── skills/            ← installierbare Skills
│   └── docs/              ← Pläne, Tests, Philosophy
└── playground/            🎮 SPIELWIESE (wo experimentiert wird)
    └── src/pages/
        ├── duo/           ← Alex & Brudi Website
        └── [learning-pages]
```

---

## Die dokumentierten KI-Schwachstellen

Recherche-basiert. Diese Fehler treten bei KI-generiertem Code global und wiederholt auf:

**Visuell & Design:**
- Generische, sichere Defaults — KI wählt was niemanden beleidigt, nicht was auffällt
- Desktop-First Bias — Mobile wird als Nachgedanke behandelt
- Kein Verständnis für emotionale Wahrnehmung (Timing, Kontrast, Tiefe)

**UX & States:**
- Nur der "Happy Path" wird gebaut — Loading, Error, Empty States fehlen
- Kein Feedback, keine Micro-Interactions
- Formulare ohne Validation, ohne Fehlerbehandlung

**Architektur & Code:**
- Business Logic landet in UI-Komponenten
- Infinite Re-renders durch falsche useEffect Dependencies
- Unnötige Abstraktionen die Wartung erschweren
- Context Drift — bei langen Sessions vergisst KI frühere Entscheidungen

**Integration & Stack:**
- Libraries werden isoliert korrekt eingesetzt — ihr Zusammenspiel ist kaputt
- Falsche Initialisierungs-Reihenfolge (GSAP + Lenis, React + Animations)
- Veraltete oder halluzinierte APIs

**Performance:**
- Fehlende Code Splits und Lazy Loading
- Animierung von Layout-Properties statt transform/opacity
- Race Conditions in Data Fetching

**Sicherheit:**
- 62% von KI-generiertem Code enthält Sicherheitslücken
- API-Keys in Scaffolding-Code exposed
- Fehlende Input Sanitization

**Regel:** Jeder Brudi-Skill adressiert mindestens eine dieser Schwachstellen direkt.

---

## Das Orchestrierungs-Prinzip

**Das größte Problem von KI-generiertem Code:** Libraries werden isoliert korrekt eingesetzt, aber ihr Zusammenspiel ist kaputt.

Beispiele:
- GSAP Animations existieren, aber werden nie getriggert
- Lenis und ScrollTrigger laufen gegeneinander
- CSS Transitions überschreiben GSAP
- React `useEffect` cleanup zerstört GSAP-Contexts nicht
- `will-change` und `transform` kollidieren
- Animations starten bevor DOM bereit ist

**Regel:** Jeder Skill der Libraries kombiniert, muss die **Initialisierungs-Reihenfolge** und **Konflikte** explizit dokumentieren.

---

## Skill-Kategorien

### Kategorie 1: Foundation (bereits vorhanden, zu verbessern)
Grundlegende Web-Entwicklungs-Skills. Basis für alles andere.

### Kategorie 2: Award-Level Craft (neu)
Was eine Website von "gut" zu "Award-worthy" macht. Visuell, animiert, emotional.

### Kategorie 3: Stack-Orchestrierung (neu, kritisch)
Wie Libraries korrekt zusammenarbeiten. Das Herzstück.

### Kategorie 4: Produkt & SaaS (neu)
Wie man echte Produkte baut — nicht nur Websites.

### Kategorie 5: Alex's Arbeitsweise (neu, Meta-Layer)
Wie Alex Projekte startet, Entscheidungen trifft, Qualität definiert.

---

## Vollständiger Skill-Plan

### Kategorie 1: Foundation

| # | Skill | Status | Priorität |
|---|-------|--------|-----------|
| 1 | building-layouts | ✅ v0.1 | Verbessern |
| 2 | designing-for-awards | ✅ v0.1 | Verbessern |
| 3 | animating-interfaces | ✅ v0.1 | Verbessern |
| 4 | developing-with-react | ✅ v0.1 | Verbessern |
| 5 | typing-with-typescript | ✅ v0.1 | TDD fehlt |
| 6 | testing-user-interfaces | ✅ v0.1 | TDD fehlt |
| 7 | optimizing-performance | ✅ v0.1 | TDD fehlt |
| 8 | building-accessibly | ✅ v0.1 | TDD fehlt |

### Kategorie 2: Award-Level Craft (neu)

| # | Skill | Beschreibung |
|---|-------|--------------|
| 9 | creating-visual-depth | Schichtung, Schatten-Systeme, Glassmorphism, Bento-Grids — wie echte Tiefe entsteht |
| 10 | crafting-typography | Nicht nur "gute Fonts" — Hierarchie, Fluid Type, Variable Fonts, Kinetic Type |
| 11 | designing-for-mobile | Touch-Targets, Thumb-Zonen, Touch-Feedback, Parallax deaktivieren, Mobile-First |
| 12 | building-interactions | Custom Cursor, Hover-States, Microinteractions, Page Transitions — joy of exploration |
| 13 | scrolling-with-purpose | Scrollytelling, Narrative Arc, Pinning, Horizontal Scroll — Scroll als Story |
| 14 | designing-with-perception | Wie Menschen visuell & emotional wahrnehmen: Animation-Timing, Fluid Type, Kontrast, Ersteindruck |

### Kategorie 3: Stack-Orchestrierung (neu, kritisch)

| # | Skill | Beschreibung |
|---|-------|--------------|
| 15 | orchestrating-gsap-lenis | Korrekte Integration: autoRaf, ticker, cleanup, Reihenfolge, Konflikte |
| 16 | orchestrating-react-animations | GSAP/Framer Motion in React: Lifecycle, cleanup, SSR-Konflikte, Context |
| 17 | orchestrating-css-js-animations | Wann CSS, wann JS? Wie vermeidet man Überschreibungen? will-change, transform |
| 18 | building-with-nextjs | Next.js App Router: RSC, Client Boundaries, Data Fetching, Route Transitions |

### Kategorie 3.5: Robustheit (neu, aus KI-Schwachstellen-Analyse)

| # | Skill | Beschreibung |
|---|-------|--------------|
| 19 | handling-ui-states | Loading, Error, Empty States — der Happy Path reicht nicht. Alle 4 States immer. |
| 20 | fetching-data-correctly | Race Conditions, AbortController, stale Data, TanStack Query Patterns |

### Kategorie 4: Produkt & SaaS (neu)

| # | Skill | Beschreibung |
|---|-------|--------------|
| 21 | architecting-saas | Projekt-Struktur, Multi-tenancy, Auth-Flows, Subscription-Logik |
| 22 | integrating-supabase | Auth, Realtime, RLS, Storage — korrekte Patterns, häufige Fehler |
| 23 | handling-data-sync | PowerSync, Offline-first, Conflict Resolution, Optimistic Updates |
| 24 | designing-saas-ux | Onboarding, Billing-UI, Empty States, Error States, Loading States |

### Kategorie 5: Alex's Arbeitsweise (Meta-Layer)

| # | Skill | Beschreibung |
|---|-------|--------------|
| 25 | starting-a-project | PRD → Stack → Struktur → was zuerst gebaut wird. Alex's Prozess. |
| 26 | maintaining-quality | Was ist "fertig"? Qualitäts-Checkliste. Was ist AI-Slop und wie verhindert man es. |
| 27 | making-tech-decisions | Welche Library wann? Wie trifft Alex Entscheidungen? Kriterien. |

---

## Prioritäten-Reihenfolge

```
Phase 1 — Kritische Lücken (sofort, höchste Wirkung)
  ✅ designing-with-perception      ← FERTIG
  ✅ handling-ui-states             ← FERTIG
  ✅ orchestrating-gsap-lenis       ← FERTIG
  ✅ orchestrating-react-animations ← FERTIG

Phase 2 — Award Craft (visueller Anspruch)
  → creating-visual-depth
  ✅ designing-for-mobile           ← FERTIG
  → crafting-typography
  → building-interactions

Phase 3 — Robustheit & Data
  → fetching-data-correctly
  → orchestrating-css-js-animations
  → building-with-nextjs

Phase 4 — Meta-Layer (Arbeitsweise)
  ✅ starting-a-project             ← FERTIG
  → maintaining-quality
  → making-tech-decisions

Phase 5 — SaaS & Produkt
  → architecting-saas
  → integrating-supabase
  → handling-data-sync
  → designing-saas-ux

Phase 6 — Foundation verbessern
  → Bestehende 8 Skills: TDD vervollständigen, Orchestrierungs-Hinweise ergänzen
```

---

## Workflow

```
playground/  →  Experimentieren, Learning Page bauen
     ↓
skills/      →  Wenn verstanden: Skill erstellen, TDD testen
     ↓
/duo         →  Skill praktisch anwenden
```

### Skill-Entwicklung (TDD)

```
1. Pressure Scenario schreiben
2. Testen OHNE Skill — was geht schief?
3. Skill schreiben der das löst
4. Testen MIT Skill — funktioniert es?
5. Lücken schließen
```

---

## Regeln

- **< 120 Zeilen** pro Skill
- **"Use when..."** Descriptions
- **Verb-first** Naming (building-, designing-, orchestrating-)
- **Testen vor Pushen**
- **Planen vor Bauen**
- **Orchestrierungs-Reihenfolge** bei Library-Kombinationen immer dokumentieren
- **Kein AI-Slop** — jedes Pattern aus echten Projekten

---

## Bei Gedächtnisverlust

Alex sagt: "Lies `projects/brudi/README.md`"

Dann:
1. `brudi/skills/BOOTSTRAP.md` für Skills-Kontext
2. `brudi/skills/docs/internal/MASTERPLAN.md` (dieses Dokument) für den Plan
3. `brudi/skills/docs/internal/SKILL_LEARNINGS.md` für kritische Erkenntnisse

---

*Logik > Laune. Testen > Pushen. Planen > Bauen. Orchestrierung > Isolation.*
