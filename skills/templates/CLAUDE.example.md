<!--
  📋 BEISPIEL — Forma Studio

  Dies ist eine ausgefüllte Beispiel-Version der CLAUDE.md Vorlage.
  Nutze sie als Orientierung wenn du deine eigene CLAUDE.md ausfüllst.
  Diese Datei NICHT direkt verwenden — sie ist nur ein Beispiel!
-->

# Forma Studio — Project Context

## ⚡ Agent Startup — Immer als erstes ausführen

Egal was der Nutzer schreibt — führe beim Start diese Schritte aus:

**Schritt 1 — Brudi prüfen:**
```bash
ls ~/.brudi/skills/
```
- Skills vorhanden → weiter mit Schritt 2
- Ordner fehlt oder leer → **STOPP. Melde: "Brudi nicht gefunden unter ~/.brudi/skills/ — bitte installieren."**

**Schritt 2 — TASK.md lesen:**
Lies `TASK.md` in diesem Projektordner. Dort steht die aktuelle Aufgabe.

**Schritt 3 — Relevante Brudi Skills lesen:**
Lies `~/.brudi/assets/INDEX.md` für verfügbare Assets, dann die Skills die zur Aufgabe passen.

---

## Was ist das Projekt?

Eine hochmoderne Portfolio-Website für eine Kreativagentur aus Berlin. Forma Studio präsentiert digitale Arbeiten, Brand Motion und Creative Development für Luxury Brands und innovative Tech-Companies. Das Design ist bewusst minimalistisch, präzise und selbstbewusst.

---

## Zielgruppe

Luxury Brands, innovative Startups und Tech-Unternehmen die nach Premium Creative Services suchen. Primär Desktop-Fokus mit responsivem Design für Tablets und Mobile.

---

## Tech Stack

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

**Name:** Forma Studio
**Tagline:** Where form meets motion.
**Ton:** Selbstbewusst, minimalistisch, präzise — keine Floskeln, klare Botschaften

### Farben

- **Accent:** #C8FF00 (Electric Lime)
- **Background dark:** #0A0A0A
- **Background light:** #F5F5F0
- **Text dark mode:** #EDEDED
- **Text light mode:** #111111
- **Muted:** #666666

### Typografie

- **Display (Headlines):** Clash Display
- **Body (Fließtext):** Satoshi

---

## Seiten

- `/` — Home: Hero mit Projekt-Teasern, Services-Übersicht, Testimonials
- `/work` — Work: Case Studies für Arcane, Vela und Depth mit vollständigen Beschreibungen
- `/about` — About: Team-Vorstellung (Max Richter, Lea Vogel, Jonas Kraft), Company Story, Philosophy
- `/contact` — Contact: Kontaktformular, E-Mail und Location

---

## Content

### Home Hero
**Headline:** Where form meets motion.
**Subheadline:** Wir erschaffen digitale Erfahrungen für Brands, die Grenzen verschieben.

### Services
1. **Digital Experiences** — Innovative Websites und Anwendungen
2. **Brand Motion** — Video und Animation für Markenidentität
3. **Creative Development** — Konzept bis Umsetzung

### Case Studies
1. **Arcane** — Interaktive WebGL-Experience für Musikproduktion
2. **Vela** — Brand Website mit Advanced Scroll Animation
3. **Depth** — 3D-Produktvisualisierung mit GSAP

### Team
- **Max Richter** — Founder, Design & Creative Direction
- **Lea Vogel** — Frontend Engineering, Interactive Development
- **Jonas Kraft** — Motion Design & Animation

---

## Qualitätsanspruch

Jede Entscheidung muss verteidigbar sein.
Kein Generic SaaS Look. Kein Inter als Font. Kein purple-to-blue Gradient.
Wenn es nach einem Template aussieht — neu anfangen.
