# Brudi — Fortschritt & nächste Schritte

> Dieses Dokument ist für schnellen Kontext-Aufbau am Anfang einer neuen Session.
> Letzte Aktualisierung: 2026-02-21

---

## Aktueller Stand

**Version:** v0.17.0
**Skills:** 31 total
**Test-Projekt:** Luma Studio (Astro-Agentur-Website)

---

## Was ist Brudi?

Ein Skill-System für KI-Agenten. Der Agent lädt beim Start eines Projekts automatisch relevante Skills (Markdown-Dateien mit Regeln, Patterns, Codebeispielen) und baut damit deutlich bessere Websites als ohne.

**Kernprinzip:** Nicht Geschmack, sondern hart definierte Regeln. Jeder Skill dokumentiert konkrete Failure Modes die AI typischerweise falsch macht, und gibt die korrekte Lösung.

---

## Was wurde bisher gebaut & getestet

### Skills (31 total in `/skills/skills/`)

| Kategorie | Skills |
|-----------|--------|
| **Projekt-Start** | `starting-a-project` |
| **Design System** | `designing-award-layouts`, `designing-for-awards`, `designing-with-perception`, `designing-for-mobile`, `designing-saas-ux` |
| **Typografie** | `crafting-typography` |
| **Layout** | `building-layouts`, `creating-visual-depth` |
| **Komponenten** | `building-components` ← neu |
| **Interaktion** | `building-interactions`, `animating-interfaces`, `scrolling-with-purpose`, `building-page-transitions` |
| **Animation** | `orchestrating-gsap-lenis`, `orchestrating-css-js-animations`, `orchestrating-react-animations` |
| **Qualität** | `building-accessibly`, `maintaining-quality`, `testing-user-interfaces`, `handling-ui-states`, `optimizing-performance` |
| **Stack** | `making-tech-decisions`, `typing-with-typescript`, `fetching-data-correctly` |
| **React** | `developing-with-react`, `building-with-nextjs` |
| **SaaS** | `architecting-saas`, `integrating-supabase`, `handling-data-sync` |
| **Legal** | `building-legal-pages` |

### Getestete Skills (an Luma Studio)

| Skill | Test | Ergebnis |
|-------|------|---------|
| `starting-a-project` | STOP-Regel: Agent muss Briefing-Fragen stellen | ✅ Funktioniert nach Korrektur (hard STOP rule) |
| `designing-award-layouts` | Zweiter Luma Studio Build | ✅ 4 Dark Layers, 8pt Spacing, asymmetrische Grids, Unsplash IDs |
| `building-page-transitions` | GSAP Curtain auf Luma Studio | ✅ Option B (Curtain) korrekt implementiert |
| `building-legal-pages` | Impressum + Datenschutz | ✅ §5 DDG korrekt, Footer-Links |
| `designing-award-layouts` | Mobile Menu Close Button | ✅ Nach 4 Bug-Iterationen (mix-blend, listener-stacking, opacity vs visibility) |
| `building-components` | FAQ Section auf Luma Studio | ✅ CSS Grid Row Trick, Exclusive Accordion, Numbered Row Variant |

### Nicht getestete Skills

- Alle SaaS-Skills (`architecting-saas`, `integrating-supabase`, `handling-data-sync`)
- `scrolling-with-purpose` (Lenis, ScrollTrigger)
- `animating-interfaces` (komplexe GSAP Sequenzen)
- `creating-visual-depth`

---

## Wichtige Learnings aus Tests

### starting-a-project
- Agent baut sofort ohne Briefing wenn der Prompt kurz ist → **Hard STOP Regel nötig**
- 4 Required + 5 Optional Briefing-Fragen dokumentiert
- Agent muss explizit gewarnt werden: "Eine Ein-Satz-Anweisung reicht nicht"

### designing-award-layouts
- 4 Dark Theme Layer zwingend (bg → bg-elevated → surface → surface-high)
- Scroll Indicator auf min-h-screen Heroes: in Section 8 dokumentiert
- Mobile Menu Close Button: in Section 9 dokumentiert
- Unsplash URLs: spezifische Photo-IDs, nicht deprecated `source.unsplash.com`

### building-components (FAQ Accordion)
- Agent hat spontan CSS Grid Row Trick gewählt (besser als GSAP für diesen Fall)
- CSS Grid Trick (`grid-template-rows: 0fr → 1fr`) ist der beste Default — keine Dependencies
- GSAP nur wenn bereits im Projekt vorhanden
- Single `.is-active` Class steuert alles — kein inline-style toggling
- Framer Motion für React-Projekte mit `AnimatePresence initial={false}`

### Mobile Menu (Nav.astro auf Luma Studio)
- `transition:persist` hält Nav am Leben — Listeners nur EINMAL registrieren
- `mix-blend-difference` muss entfernt werden wenn Menu öffnet (dark on dark = unsichtbar)
- `opacity-0/opacity-1` → Inhalte bluten durch: besser `invisible/visible`
- Bug-Reihenfolge: mix-blend → listener stacking → opacity vs visibility

### Legal Pages
- §5 DDG (nicht TMG!) seit Mai 2024
- Unsplash hotlinks: IP-Übertragung → DSGVO Art. 13 Erwähnung nötig
- Fontsource (self-hosted): keine DSGVO-Erwähnung nötig
- Cookie Banner: nur bei nicht-essentiellem Tracking (kein Analytics = kein Banner)

---

## Offene Punkte & nächste Schritte

### Nächste Komponenten-Tests (auf Luma Studio oder neuem Projekt)
- [ ] **Testimonials** — Cards mit Avatar, Name, Firma, Rating
- [ ] **Pricing Cards** — 3 Tiers, 1 highlighted, Feature-Liste
- [ ] **Pricing Table** — Vergleichstabelle horizontal
- [ ] **Stats Section** — große Zahlen mit Counter-Animation
- [ ] **Feature Grid** — Icon + Titel + Text Karten
- [ ] **Team Section** — Fotos, Namen, Rollen
- [ ] **CTA Banner** — Vollbreite, starker Kontrast

### Skill-Lücken die auffallen werden
- `building-components` hat nur FAQ/Accordion — Tabs, Modal, Toast fehlen noch
- `scrolling-with-purpose` wurde nie getestet — Lenis + ScrollTrigger zusammen
- Preloader: in `starting-a-project` erwähnt, aber kein eigener Skill mit Code

### Mittelfristig: SaaS-Test
- Erster SaaS-Test: kleiner Link-Shortener oder Task-Manager
- Testet: `architecting-saas` + `integrating-supabase` + `designing-saas-ux` + `handling-data-sync`
- Voraussetzung: Supabase-Projekt anlegen

### Skill-Qualität verbessern
- Pressure Tests für `designing-award-layouts` ausbauen (mehr reale Szenarien)
- `building-page-transitions` testen mit Astro View Transitions Option A (bisher nur Option B getestet)
- Dark/Light Mode Skill? — Aktuell nur in `starting-a-project` erwähnt, kein Pattern dokumentiert

---

## Test-Projekte

| Projekt | Pfad | Stack | Status |
|---------|------|-------|--------|
| Luma Studio | `~/projects/luma-studio` (oder ähnlich) | Astro + Tailwind v4 + GSAP | Aktiv, mehrere Features hinzugefügt |

---

## Infrastruktur

```
~/Brudi/          ← lokale Kopie der Skills (wird von use.sh installiert)
install.sh         ← einmalig: kopiert Skills nach ~/Brudi/
use.sh             ← pro Projekt: kopiert Skills ins Projekt
```

**Skills-Update Workflow:**
1. Skill in `/skills/skills/[name]/SKILL.md` bearbeiten
2. CLAUDE.md + AGENTS.md + README.md updaten
3. `cp -r skills/ ~/Brudi/`
4. `git add -A && git commit && git push`

---

## Skill-Architektur

Jeder Skill hat:
- `---` Frontmatter mit `name` und `description`
- `description` ist der Trigger — Agent liest sie und entscheidet ob er den Skill braucht
- Konkrete Code-Patterns (kein Fließtext)
- Dokumentierte Failure Modes
- Pressure Test Szenarien

**Wichtig:** Descriptions kurz und präzise halten — Agent liest alle Descriptions
beim Start und entscheidet damit welche Skills er lädt.
