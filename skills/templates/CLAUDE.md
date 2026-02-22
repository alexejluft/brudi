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
Lies: `~/.brudi/CLAUDE.md`

**Schritt 2 — TASK.md lesen:**
Lies `TASK.md` in diesem Projektordner. Dort steht die aktuelle Aufgabe.

**Schritt 3 — Relevante Brudi Skills lesen:**
Lies `~/.brudi/assets/INDEX.md` für verfügbare Assets, dann die Skills die zur Aufgabe passen.

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
- **Fonts:** next/font/local — Variable Fonts aus `~/.brudi/assets/fonts/woff2/`
- **Icons:** Lucide React

Kein Astro. Kein Vite. Kein Pages Router.

---

## Brudi Skills & Assets

Das Brudi Skill Package ist installiert unter:
`~/.brudi/skills/` (Skills) und `~/.brudi/assets/` (Fonts, i18n, Legal, Configs)

Lies `~/.brudi/assets/INDEX.md` am Projektstart einmalig.
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
  Siehe ~/.brudi/assets/fonts/FONTS.md für Empfehlungen.
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

## 🚫 Hard Gates — Verbindliche Regeln

### Slice Completion Checklist (JEDER Slice)
Ein Slice gilt NICHT als abgeschlossen, wenn einer dieser Punkte fehlt:
- [ ] `verifying-ui-quality` gelesen + 3 Checks dokumentiert
- [ ] Code geschrieben und funktional
- [ ] Screenshot Desktop (Pfad in PROJECT_STATUS.md)
- [ ] Screenshot Mobile 375px (Pfad in PROJECT_STATUS.md)
- [ ] Console = 0 Errors (verifiziert)
- [ ] PROJECT_STATUS.md aktualisiert

Nächster Slice erst wenn alle 6 Punkte erfüllt.

### Anti-Pattern Guardrails (VERBOTEN)
- `gsap.from()` mit String-Selektoren → Immer `gsap.set()` + `gsap.to()` mit Element-Refs
- `* { margin: 0 }` oder eigene CSS-Resets → Tailwind v4 Preflight reicht
- `reactStrictMode: false` → Code muss Strict Mode kompatibel sein
- Batch-Screenshots am Ende statt pro Slice
- Mobile-Test ignorieren

### Run-Ende Regeln
Ein Run endet NUR wenn:
- Alle Phasen abgeschlossen, ODER
- User sagt STOP, ODER
- Echte Blockade (dokumentiert in PROJECT_STATUS.md)

Offene Phasen existieren → automatisch weitermachen.

### PROJECT_STATUS.md Pflicht
Erstelle PROJECT_STATUS.md zu Projektbeginn. Template: `~/.brudi/templates/PROJECT_STATUS.md`

### Definition of Done
- Keine schwarzen Platzhalter-Boxen
- Sichtbare Entrance-Animationen
- 4 Dark-Layer erkennbar
- Mobile 375px getestet (Screenshot mit Pfad)
- Console: 0 Errors
- PROJECT_STATUS.md aktualisiert
