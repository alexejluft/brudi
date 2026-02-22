# [Dein Projektname] — Project Context

<!--
  Diese Datei beschreibt dein Projekt für den KI-Agenten.
  Fülle die Platzhalter [...] mit deinen eigenen Angaben aus.

  💡 Tipp: Schau dir die Beispiel-Datei CLAUDE.example.md an,
  um zu sehen wie eine ausgefüllte Version aussieht.

  💡 Tipp: Du kannst auch ChatGPT oder einen anderen KI-Assistenten
  bitten, dir beim Ausfüllen zu helfen — beschreib einfach dein
  Projekt und lass dir die Felder ausfüllen.
-->

## ⚡ Agent Startup — Immer als erstes ausführen

Egal was der Nutzer schreibt — führe beim Start diese Schritte aus:

**Schritt 1 — Brudi Identity laden:**
Lies: `~/Brudi/CLAUDE.md`

**Schritt 2 — State prüfen:**
Lies `.brudi/state.json` — dort steht der aktuelle Modus, die Phase und der Slice-Status.
Wenn die Datei nicht existiert: `bash ~/Brudi/use.sh` im Projektordner ausführen.

**Schritt 3 — TASK.md lesen:**
Lies `TASK.md` in diesem Projektordner. Dort steht die aktuelle Aufgabe.

**Schritt 4 — Gate Runner pre-check:**
Führe aus: `BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh pre-slice`
Bei Exit-Code 1 → Fehler beheben bevor du loslegst.

**Schritt 5 — Relevante Brudi Skills lesen:**
Lies `~/Brudi/assets/INDEX.md` für verfügbare Assets, dann die Skills die zur Aufgabe passen.

## 🔧 Tier-1 Orchestrierung (PFLICHT)

Dieses Projekt nutzt imperatives Gate-Enforcement via `brudi-gate.sh`:

```bash
# Vor jedem Slice:
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh pre-slice

# Nach jedem Slice (state.json vorher aktualisieren!):
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh post-slice <id>

# Phase-Wechsel:
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh phase-gate 0_to_1

# Modus-Check vor Aktionen:
BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh mode-check write_code
```

**REGELN:**
- `.brudi/state.json` ist die Single Source of Truth — nach JEDEM Slice aktualisieren
- Modus-Wechsel NUR durch User-Anweisung
- AUDIT→FIX ohne User-Befehl ist VERBOTEN
- Pre-Commit Hook blockiert Commits automatisch bei fehlender Evidence

---

## Was ist das Projekt?

<!--
  Beschreibe in 2-3 Sätzen: Was baust du? Für wen? Was ist das Ziel?
  Beispiel: "Eine Marketing-Website für eine Design-Agentur aus Berlin."
-->

[Hier beschreiben: Was wird gebaut und für wen?]

---

## Zielgruppe

<!--
  Wer besucht die Website? Desktop oder Mobile zuerst?
  Beispiel: "Luxury Brands und innovative Startups. Primär Desktop."
-->

[Hier beschreiben: Wer sind die Nutzer?]

---

## Tech Stack

<!--
  Für die meisten Projekte kannst du das so lassen wie es ist.
  Ändere nur etwas wenn du weißt was du tust.
-->

- **Framework:** Next.js (App Router)
- **Sprache:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Animationen:** GSAP + Lenis (Smooth Scroll)
- **Fonts:** next/font/local — Variable Fonts aus `~/Brudi/assets/fonts/woff2/`
- **Icons:** Lucide React

Kein Astro. Kein Vite. Kein Pages Router.

---

## Brudi Skills & Assets

Das Brudi Skill Package ist installiert unter:
`~/Brudi/skills/` (Skills) und `~/Brudi/assets/` (Fonts, i18n, Legal, Configs)

Lies `~/Brudi/assets/INDEX.md` am Projektstart einmalig.
Brudi ist dein Regelwerk. Improvisieren ohne Brudi ist nicht erlaubt.

---

## Brand Identity

<!--
  Das Herzstück deines Projekts! Hier definierst du wie es aussehen soll.
  Die Farben, Schriftarten und den Ton deiner Marke.
-->

**Name:** [Projektname]
**Tagline:** [Ein kurzer Slogan — optional]
**Ton:** [Wie soll die Website klingen? z.B. "Selbstbewusst, minimalistisch"]

### Farben

<!--
  Trage deine Farben als Hex-Codes ein (#RRGGBB).
  Mindestens: eine Akzentfarbe und eine Hintergrundfarbe.
  💡 Tipp: Nutze coolors.co wenn du Inspiration brauchst.
-->

- **Accent:** [#DEINE_AKZENTFARBE]
- **Background dark:** [#0A0A0A]
- **Background light:** [#F5F5F0]
- **Text dark mode:** [#EDEDED]
- **Text light mode:** [#111111]
- **Muted:** [#666666]

### Typografie

<!--
  Brudi hat 5 professionelle Schriftarten vorinstalliert.
  Wähle eine für Headlines und eine für Fließtext:

  Verfügbar: Clash Display, Satoshi, General Sans, Cabinet Grotesk, Switzer
  Siehe ~/Brudi/assets/fonts/FONTS.md für Empfehlungen.
-->

- **Display (Headlines):** [z.B. Clash Display]
- **Body (Fließtext):** [z.B. Satoshi]

---

## Seiten

<!--
  Welche Seiten soll die Website haben?
  Trage hier die gewünschten Seiten mit einer kurzen Beschreibung ein.
-->

- `/` — Home: [Was soll auf der Startseite sein?]
- `/about` — Über uns: [Team, Geschichte, Philosophie?]
- `/contact` — Kontakt: [Kontaktformular?]
- [Weitere Seiten nach Bedarf]

---

## Content

<!--
  Hier kannst du Inhalte für die Website eintragen.
  Der Agent nutzt diese Texte beim Bauen der Seiten.
  Du kannst diesen Bereich auch später ausfüllen.
-->

[Hier optional: Headlines, Texte, Team-Mitglieder, etc.]

---

## Qualitätsanspruch

Jede Entscheidung muss verteidigbar sein.
Kein Generic SaaS Look. Kein Inter als Font. Kein purple-to-blue Gradient.
Wenn es nach einem Template aussieht — neu anfangen.

---

## 🔒 Mode Control — Modus-Steuerung

Du arbeitest IMMER in genau EINEM Modus. Der Modus wird aus TASK.md abgeleitet oder vom User zugewiesen.

| Modus | Erlaubt | Verboten |
|-------|---------|----------|
| **BUILD** | Code schreiben, Screenshots, Quality Gates | Fremden Code auditieren, Bugs fixen die nicht zum Slice gehören |
| **AUDIT** | Lesen, Screenshots, Analyse schreiben | Code ändern, Dateien erstellen/löschen |
| **FIX** | NUR genannte Issues fixen | Neue Features, eigenmächtige "Verbesserungen" |

**Moduswechsel NUR durch explizite User-Anweisung.** AUDIT-Ergebnisse → dokumentieren und User informieren, NICHT automatisch fixen.

---

## 🚫 Hard Gates — Verbindliche Regeln

### Pre-Conditions (VOR jedem Slice)

1. Vorheriger Slice: Alle 6 Post-Conditions ✅ (oder es ist Slice 1)
2. Skill geladen: `verifying-ui-quality` gelesen (in PROJECT_STATUS.md dokumentiert)
3. Phase-Gate: Wenn neuer Slice zu neuer Phase gehört → Phase-Transition-Gate bestanden

**Pre-Condition ❌ → STOPP. Zuerst erfüllen.**

### Slice Completion Checklist — Post-Conditions (JEDER Slice)

Ein Slice gilt NICHT als abgeschlossen, wenn einer dieser Punkte fehlt:

- [ ] `verifying-ui-quality` gelesen + 3 Checks dokumentiert
- [ ] Code geschrieben und funktional (`npm run build` = 0 Errors)
- [ ] Screenshot Desktop — DATEIPFAD in PROJECT_STATUS.md
- [ ] Screenshot Mobile 375px — DATEIPFAD in PROJECT_STATUS.md
- [ ] Console = 0 Errors (Screenshot oder Build-Output als Nachweis)
- [ ] PROJECT_STATUS.md Slice-Zeile mit allen Spalten aktualisiert

Nächster Slice erst wenn alle 6 Punkte ✅. Kein "Code Audit stattdessen", kein "später nachholen".

### Evidence-Spezifikation

| Gate | Akzeptiert | NICHT akzeptiert |
|------|-----------|------------------|
| Screenshot | Datei existiert + Pfad dokumentiert | "Sieht gut aus", "Code ist responsive" |
| Console 0 | DevTools-Screenshot ODER Build-Output | "Keine Fehler bemerkt" |
| Quality Gate | 3 benannte Checks + Ergebnis | "Quality Gate: ✅" ohne Details |

### Phase-Transition-Gates

| Übergang | Bedingung |
|----------|-----------|
| Phase 0 → 1 | ALLE Phase 0 Tasks ✅ mit Evidenz |
| Phase 1 → 2 | ALLE Slices ✅ mit vollständiger Evidenz |
| Phase 2 → 3 | ALLE Seiten ✅ + Definition of Done ✅ |

**Phase-Gate = JEDE Zeile in PROJECT_STATUS.md ✅ mit Evidenz.**

### Anti-Pattern Guardrails (VERBOTEN)

- `gsap.from()` mit String-Selektoren → `gsap.set()` + `gsap.to()` mit Element-Refs
- `* { margin: 0 }` oder eigene CSS-Resets → Tailwind v4 Preflight reicht
- `reactStrictMode: false` → Code muss Strict Mode kompatibel sein
- Batch-Screenshots am Ende statt pro Slice
- Mobile-Test ignorieren
- Evidenz substituieren ("Code Audit" statt Screenshot)
- Eigenmächtiger Moduswechsel
- Status-Symbol "—" oder leere Zellen

### Status-Symbole (NUR diese 4 erlaubt)

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Abgeschlossen mit Evidenz |
| ❌ | Nicht begonnen |
| 🟨 | In Arbeit |
| ⬜ | Nicht anwendbar |

### Run-Ende Regeln

Ein Run endet NUR wenn:
- Alle Phasen abgeschlossen + Definition of Done ✅, ODER
- User sagt STOP, ODER
- Echte Blockade (dokumentiert in PROJECT_STATUS.md)

"Weitermachen" gilt NUR innerhalb des aktuellen Modus und der aktuellen Phase.

### PROJECT_STATUS.md Pflicht

Erstelle PROJECT_STATUS.md zu Projektbeginn. Template: `~/Brudi/templates/PROJECT_STATUS.md`
- Wird nach JEDEM Slice aktualisiert
- Enthält Screenshot-DATEIPFADE (nicht nur ✅/❌)
- Enthält Skill-Log
- Verwendet NUR definierte Status-Symbole

### Definition of Done

- Keine schwarzen Platzhalter-Boxen
- Sichtbare Entrance-Animationen
- 4 Dark-Layer erkennbar
- Mobile 375px getestet (Screenshot-DATEIPFAD dokumentiert)
- Console: 0 Errors
- PROJECT_STATUS.md vollständig mit Evidenz
