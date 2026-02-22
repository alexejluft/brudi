# Brudi v3.0 — Agent Build Process: Visuell Korrekt ab Zeile 1

> Dieses Dokument definiert den kompletten Prozess, damit ein KI-Agent Webseiten nicht nur "codet", sondern von Anfang an eine visuell korrekte, produktreife UI liefert.

---

## Das Kernproblem (Warum v2 "komplett durchgefallen" ist)

**Bisheriger Ablauf:** Skeleton zuerst → Styles später → Animationen irgendwann → Fertig melden ohne Browser-Check.

**Resultat:** Schwarze Platzhalter-Boxen, null Animationen, flaches Design, keine visuelle Tiefe — eine Seite die kompiliert aber visuell tot ist.

**Root Causes (7 identifiziert):**

1. **Phasen-Trennung statt Vertical Slices** — Phase 1 = Skeleton, Phase 2 = Polish. Problem: Phase 1 sieht immer schlecht aus.
2. **"On Demand" Skill-Loading** — Kritische visuelle Skills (Visual Depth, GSAP, Placeholders) werden nie geladen weil sie "Phase 2" sind.
3. **Keine Dependency-Entscheidung** — GSAP + Lenis stehen im Spec, werden aber nie installiert weil kein Step das explizit verlangt.
4. **Subjektive Quality Bar** — "Würde das auf AntiGravity passen?" ist keine prüfbare Bedingung.
5. **Kein Browser-Check** — Agent meldet "fertig" ohne je die Seite im Browser gesehen zu haben.
6. **Fehlende Placeholder-Strategie** — Wenn keine Bilder da sind, entstehen schwarze Löcher statt visuell ansprechender Platzhalter.
7. **Keine Blocking Gates** — Kein Quality Check verhindert Weiterarbeit bei schlechtem Ergebnis.

---

## Die Lösung: Vertical-Slice-Architektur mit Quality Gates

### Grundprinzip: "Jede Section vollständig, bevor die nächste beginnt"

Statt "erst alles aufbauen, dann alles animieren":
→ Baue den Hero **komplett** (Layout + Depth + Animation + Responsive)
→ Dann Services **komplett**
→ Dann Case Studies **komplett**

**Jede Section hat beim Abschluss:**
- ✅ Korrektes Layout (Grid, Spacing, Responsive)
- ✅ Visuelle Tiefe (Shadows, Surface-Layers, Gradients)
- ✅ Animationen (Entrance, Hover, Scroll-Trigger)
- ✅ Realistische Inhalte (Unsplash-Bilder oder Gradient-Placeholders)
- ✅ Mobile-Version getestet

---

## Phasen-Architektur (3 Phasen, nicht 4)

### Phase 0: Foundation (einmalig, ~15 Min)

**Ziel:** Alles installiert, alles konfiguriert, Design-System steht.

**Steps:**
1. `create-next-app` (wie bisher)
2. **Dependency-Decision (NEU, BLOCKING):**
   ```
   Award-Level Site? → npm install gsap lenis lucide-react
   3D-Erlebnis?     → npm install three @react-three/fiber @react-three/drei
   SaaS App?        → npm install @supabase/supabase-js
   ```
3. Fonts kopieren + konfigurieren
4. `globals.css` mit vollständigem Token-System:
   - 4 Dark-Layer: `--bg` (#09090B), `--bg-elevated` (#111113), `--surface` (#18181B), `--surface-high` (#222226)
   - Accent, Muted, Text Farben
   - Fluid Typography Scales
   - GSAP Easing Tokens
   - Z-Index System
5. Lenis initialisieren (wenn installiert)
6. Base Layout mit Navigation + Footer

**Quality Gate 0:**
```bash
npm run dev
# Prüfe im Browser:
□ Hintergrund ist NICHT reines Schwarz (#000) — muss #09090B oder custom sein
□ Navigation sichtbar mit korrektem Font
□ 4 verschiedene Hintergrund-Farben in DevTools verifizierbar
□ Lenis smooth scroll funktioniert (wenn installiert)
□ Keine Console-Errors
```

**Skills zu lesen:** `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`

---

### Phase 1: Vertical Slices — Sections bauen (Hauptarbeit)

**Ziel:** Jede Section der Seite wird KOMPLETT gebaut — Layout, Inhalt, Tiefe, Animation, Responsive.

**Reihenfolge:**

#### Slice 1: Preloader (wenn Award-Level)
- FORMA/Logo Letter-Reveal Animation
- Fade-out nach 2-3 Sekunden
- Quality Gate: Animation spielt ab, Seite erscheint danach korrekt

#### Slice 2: Hero Section
- Layout: Full-viewport, fluid Typography, CTAs
- Depth: Animierter Hintergrund (Noise, Gradient, oder GLSL)
- Animation: Headline entrance (split-text oder stagger)
- Scroll-Indicator mit Animation
- Mobile: Stack-Layout, kleinere Typo, Touch-CTAs
- **Quality Gate Hero:**
  ```
  □ Headline animiert rein (nicht statisch)
  □ Hintergrund ist NICHT flat black (Gradient/Noise/Texture sichtbar)
  □ CTAs haben Hover-State mit sichtbarem Feedback
  □ Scroll-Indicator bewegt sich
  □ 375px: Kein Text-Overflow, CTAs klickbar
  ```

#### Slice 3: Services/Features Section
- Layout: Cards mit Grid, asymmetrisches Layout bevorzugt
- Depth: Cards haben `--surface` BG (heller als Seiten-BG), Layered Shadows
- Animation: Stagger-Entrance bei Scroll (ScrollTrigger)
- Hover: Card-Lift + Accent-Color-Reveal
- **Quality Gate Services:**
  ```
  □ Cards sind visuell unterscheidbar vom Hintergrund (min. 2 Layer-Stufen)
  □ Hover-State sichtbar und smooth
  □ Scroll-Entrance funktioniert
  □ Nummern/Icons vorhanden (nicht nur Text)
  ```

#### Slice 4: Portfolio/Case Studies Section
- Layout: Grid mit unterschiedlichen Card-Größen
- Content: **Unsplash-Bilder (spezifische IDs)** oder Gradient-Placeholders — NIEMALS leere schwarze Boxen
- Depth: Image-Hover mit Scale + Overlay
- Animation: Stagger, Parallax auf Images
- **Quality Gate Portfolio:**
  ```
  □ JEDE Card hat visuellen Inhalt (Bild ODER Gradient — NICHT schwarz)
  □ Image-Hover: Scale-Effect sichtbar
  □ Text-Overlay lesbar über dem Bild
  □ Mobile: Cards stacken sauber
  ```

#### Slice 5: CTA/Contact Section
- Layout: Centered, große Typo
- Animation: Headline-Entrance
- Button: Prominent mit Hover-Feedback

#### Slice 6: Footer
- Layout: Grid mit Logo, Nav, Contact, Legal
- Links: Alle funktional

**Quality Gate Phase 1 (GESAMT):**
```
□ JEDE Section hat sichtbare Entrance-Animation
□ JEDE Card/Box hat visuelle Tiefe (Shadow ODER Gradient ODER Elevation)
□ Scroll ist smooth (Lenis)
□ Mobile (375px): Alle Sections lesbar, keine Overflows
□ Console: 0 Errors, 0 Warnings
□ Lighthouse Accessibility: > 90
□ KEIN einziger schwarzer Platzhalter-Block sichtbar
```

---

### Phase 2: Pages & Polish

**Ziel:** Restliche Seiten, Feinschliff, Interaktionen.

- About-Page mit Team-Section (Bilder!)
- Work/Portfolio-Page mit vollständiger Case-Study-Liste
- Contact-Page mit funktionalem Formular
- Impressum + Datenschutz
- Page-Transitions (GSAP)
- 404-Page
- Meta/SEO für alle Pages

**Quality Gate Phase 2:**
```
□ Alle internen Links funktionieren
□ Page-Transitions smooth
□ Formular hat Validation + Submit-Handler
□ Meta-Tags auf allen Seiten
□ Lighthouse Performance: > 80
```

---

## Die Agent-Audit-Checkliste: 25 häufigste KI-Fehler

### Kategorie A: Visuelle Fehler (Sofort sichtbar)

| # | Fehler | Prüfmethode | Lösung |
|---|--------|-------------|--------|
| A1 | Schwarze/leere Platzhalter-Boxen | Screenshot: Gibt es Bereiche ohne visuellen Inhalt? | Unsplash-IDs oder CSS-Gradient Placeholders |
| A2 | Flaches Design ohne Tiefe | DevTools: Haben Cards box-shadow? | 5-Layer Shadow System aus `creating-visual-depth` |
| A3 | Nur 1-2 Hintergrund-Farben statt 4 Layers | DevTools: Verschiedene bg-Colors prüfen | 4 Dark-Layers: bg, bg-elevated, surface, surface-high |
| A4 | Sections verschmelzen visuell | Screenshot: Kann man Section-Grenzen erkennen? | Alternating bg-Layers, Spacing ≥96px |
| A5 | Generische System-Fonts sichtbar | DevTools: Computed Font-Family prüfen | Font-Variable auf `<html>`, `font-display: swap` |
| A6 | Text-Overflow auf Mobile | 375px Viewport: Horizontaler Scroll? | `overflow-x: hidden` auf body, fluid Typography |
| A7 | Buttons ohne Hover-Feedback | Hover über jeden Button: Visuell Änderung? | `transition: all 0.3s ease`, scale/color/shadow |

### Kategorie B: Animations-Fehler

| # | Fehler | Prüfmethode | Lösung |
|---|--------|-------------|--------|
| B1 | GSAP spezifiziert aber nicht installiert | `package.json`: gsap vorhanden? | Dependency-Decision in Phase 0 |
| B2 | Animations-Code ohne Library | Grep nach `gsap.` → Import vorhanden? | GSAP import + Registration in Layout |
| B3 | ScrollTrigger nicht registriert | Console: "ScrollTrigger is not defined"? | `gsap.registerPlugin(ScrollTrigger)` |
| B4 | Entrance-Animations fehlen komplett | Scrollen: Faden Sections rein? | ScrollTrigger auf jeder Section |
| B5 | Lenis nicht initialisiert | Scroll-Verhalten: Smooth oder nativ? | Lenis-Provider im Root-Layout |
| B6 | Animationen brechen nach Navigation | Seite wechseln + zurück: Funktioniert noch? | GSAP cleanup in useEffect return |
| B7 | `margin`/`width` animiert statt `transform` | DevTools Performance: Layout-Shifts? | Nur `transform`, `opacity`, `clip-path` animieren |

### Kategorie C: Struktur-Fehler

| # | Fehler | Prüfmethode | Lösung |
|---|--------|-------------|--------|
| C1 | Keine semantische HTML-Struktur | DOM: `<div>` Suppe statt `<section>`, `<article>`? | Semantic HTML mit landmarks |
| C2 | Z-Index Chaos | DevTools: Überlappende Elemente? | Z-Index Token System (nav: 100, modal: 200, etc.) |
| C3 | Keine Responsive Navigation | 375px: Menu benutzbar? | Mobile-first Hamburger mit aria-expanded |
| C4 | Container ohne max-width | Desktop: Content über 1440px? | `max-w-[1440px] mx-auto px-6` |
| C5 | Fehlende Loading/Error States | Netzwerk throtteln: Was passiert? | 4 States: Loading, Error, Empty, Content |

### Kategorie D: Integrations-Fehler

| # | Fehler | Prüfmethode | Lösung |
|---|--------|-------------|--------|
| D1 | CSS + GSAP Konflikt | Animiert CSS und GSAP dasselbe Property? | Ein Owner pro Property (CSS ODER GSAP) |
| D2 | Lenis + ScrollTrigger nicht synced | Scroll-Animations: Ruckeln? | `lenis.on('scroll', ScrollTrigger.update)` |
| D3 | Fonts laden nicht auf Production | Build + Serve: Fonts im Network-Tab? | Static font files in `public/fonts/` |
| D4 | Tailwind v4 Klassen fehlen | Build: Klassen in Output? | `@theme` Block in globals.css korrekt |
| D5 | Images ohne Optimization | Lighthouse: Image-Warnings? | `next/image` mit sizes + priority |
| D6 | Form ohne Handler | Button klicken: Passiert was? | API Route oder Server Action |

---

## Verifikationsroutine: Automatische Browser-Prüfung

### Wann wird geprüft?

1. **Nach Phase 0** — Foundation steht
2. **Nach jedem Vertical Slice** — Section komplett
3. **Nach Phase 1 komplett** — Gesamtbild
4. **Nach Phase 2 komplett** — Finales Ergebnis

### Was wird geprüft? (Verification Protocol)

```
VERIFICATION PROTOCOL
=====================

1. SERVER STARTEN
   npm run dev (falls nicht bereits laufend)
   Warte 5 Sekunden auf Compilation

2. HOMEPAGE PRÜFEN (http://localhost:3000)
   a) Screenshot aufnehmen
   b) Scroll durch gesamte Seite (3-4 Screenshots)
   c) Prüfe gegen Quality Gate der aktuellen Phase

3. MOBILE PRÜFEN (375px Viewport)
   a) Viewport resizen oder DevTools
   b) Screenshot aufnehmen
   c) Horizontal scroll prüfen

4. INTERAKTIONEN PRÜFEN
   a) Hover über Navigation Links
   b) Hover über CTAs/Buttons
   c) Mobile Menu öffnen/schließen
   d) Scroll-Animationen auslösen (wenn Phase 1+)

5. CONSOLE PRÜFEN
   DevTools Console: 0 Errors erlaubt

6. ERGEBNIS DOKUMENTIEREN
   - Pass: Alle Checks bestanden → Weiter
   - Fail: Spezifische Fehler auflisten → Fixen → Erneut prüfen
```

### Automatisierung für Claude Code Agent

Der Agent MUSS nach jedem Vertical Slice:

```bash
# 1. Dev Server prüfen (starten wenn nötig)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# 2. Build prüfen (keine Compile-Errors)
npm run build 2>&1 | tail -5

# 3. Console Errors prüfen (wenn Browser-Tool verfügbar)
# Screenshot nehmen und visuell prüfen
```

**KRITISCH:** Der Agent darf NIEMALS "fertig" melden ohne mindestens einen Screenshot der Seite gesehen zu haben. Wenn kein Browser verfügbar: `npm run build` MUSS erfolgreich sein UND der Agent muss explizit dokumentieren: "Visuelle Verifikation ausstehend — kein Browser-Zugang."

---

## Die 7 Agenten-Rollen

### Rolle 1: UX/Perception Lead
**Verantwortung:** Definiert was "visuell korrekt" bedeutet für jede Section.
**Wann aktiv:** Vor und nach jedem Vertical Slice.
**Deliverable:** User-Success-Kriterien pro Section.
**Skill-Mapping:** `designing-for-awards`, `designing-visual-hierarchy`, `narrating-web-experiences`
**Konkret prüft dieser Agent:**
- Ist die visuelle Hierarchie klar? (H1 > H2 > Body)
- Gibt es einen klaren Focal Point pro Section?
- Ist die Leserichtung eindeutig?
- Fühlt sich die Seite "lebendig" an (Motion) oder "tot" (statisch)?

### Rolle 2: Design System Agent
**Verantwortung:** Token-System, Dark-Layers, Typography-Scale, Spacing-System.
**Wann aktiv:** Phase 0 (setup) und bei jedem neuen Component.
**Deliverable:** Vollständiges Token-System in `globals.css`.
**Skill-Mapping:** `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`
**Konkret prüft dieser Agent:**
- Werden NUR Token-Werte verwendet (keine magic numbers)?
- Sind alle 4 Dark-Layers definiert UND im Einsatz?
- Stimmen Fluid-Typography-Werte (clamp() korrekt)?
- Sind alle Farben als CSS Custom Properties definiert?

### Rolle 3: Layout/Architecture Agent
**Verantwortung:** Grid, Responsive, Semantic HTML, DOM-Hierarchie.
**Wann aktiv:** Bei jedem Vertical Slice (Struktur zuerst).
**Deliverable:** Saubere Section-Layouts die auf 375px + 1440px funktionieren.
**Skill-Mapping:** `building-layouts`, `designing-award-layouts-core`, `designing-for-mobile`, `building-with-nextjs`
**Konkret prüft dieser Agent:**
- 12-Column Grid konsistent verwendet?
- Container: `max-w-[1440px] mx-auto px-6`?
- Section-Spacing: ≥96px (Desktop), ≥64px (Mobile)?
- Semantic HTML: `<section>`, `<article>`, `<header>`, `<footer>`?
- Mobile-first: Funktioniert 375px ohne horizontal scroll?

### Rolle 4: Interaction/Motion Agent
**Verantwortung:** GSAP, Lenis, ScrollTrigger, Hover/Focus States, Micro-Interactions.
**Wann aktiv:** Innerhalb jedes Vertical Slice (nach Layout steht).
**Deliverable:** Animierte Sections mit smooth Entrance, Hover, Scroll-Verhalten.
**Skill-Mapping:** `animating-interfaces`, `orchestrating-gsap-lenis`, `orchestrating-react-animations`, `scrolling-with-purpose`, `designing-award-motion`, `designing-motion-timing`
**Konkret prüft dieser Agent:**
- Hat jede Section eine Entrance-Animation?
- Sind Hover-States auf ALLEN interaktiven Elementen?
- Lenis smooth scroll aktiv?
- GSAP cleanup in useEffect return vorhanden?
- Werden NUR transform/opacity/clip-path animiert (kein margin/width)?

### Rolle 5: Assets/Content Agent
**Verantwortung:** Bilder, Placeholders, Dummy-Texte, realistische Daten.
**Wann aktiv:** Innerhalb jedes Vertical Slice (gleichzeitig mit Layout).
**Deliverable:** Visuell realistische Inhalte — keine schwarzen Löcher.
**Skill-Mapping:** `optimizing-images`, `designing-award-layouts-core`
**Konkret prüft dieser Agent:**
- Hat JEDE Card/Box visuellen Inhalt (Bild ODER Gradient)?
- Sind Unsplash-IDs spezifisch (nicht random)?
- Sind Texte realistisch (nicht "Lorem ipsum")?
- Sind leere States designt (nicht nur ausgeblendet)?
- Sind alle Icons vorhanden (Lucide/Custom)?

**Placeholder-Strategie (BLOCKING RULE):**
```
Wenn keine Client-Bilder vorhanden:
  1. ERSTE WAHL: Unsplash spezifische Photo-IDs
     → https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
  2. ZWEITE WAHL: CSS Gradient Placeholders
     → background: linear-gradient(135deg, var(--surface) 0%, var(--surface-high) 100%)
  3. VERBOTEN: Leere Boxen mit nur bg-color
     → NIEMALS eine Box ohne visuellen Inhalt stehen lassen
```

### Rolle 6: QA/Verification Agent
**Verantwortung:** Browser-Tests, Verification Protocol, Regression Checks.
**Wann aktiv:** Nach JEDEM Vertical Slice und am Ende jeder Phase.
**Deliverable:** Pass/Fail Report mit spezifischen Fehlern.
**Skill-Mapping:** `testing-accessibility`, `testing-user-interfaces`, `optimizing-performance`
**Konkret prüft dieser Agent:**
- Dev Server läuft + keine Console Errors?
- Screenshots aufgenommen und gegen Quality Gate geprüft?
- Mobile (375px) visuell korrekt?
- Lighthouse Accessibility > 90?
- Alle interaktiven Elemente haben :hover + :focus?
- Keine visuellen Regressionen seit letztem Check?

### Rolle 7: Integrator/Build Agent
**Verantwortung:** Alles zusammenführen, Konflikte lösen, "läuft & sieht gut aus" sicherstellen.
**Wann aktiv:** Zwischen Vertical Slices und am Ende jeder Phase.
**Deliverable:** Funktionierender Build ohne Konflikte.
**Skill-Mapping:** `orchestrating-css-gsap-conflicts`, `orchestrating-will-change`, `maintaining-quality`
**Konkret prüft dieser Agent:**
- `npm run build` erfolgreich?
- Keine TypeScript-Errors?
- Keine CSS-Konflikte (CSS vs GSAP ownership)?
- Bundle-Size akzeptabel?
- Alle Imports korrekt?

---

## Handoff-Protokoll zwischen Rollen

```
Für jeden Vertical Slice:

1. UX Lead       → Definiert Success-Kriterien für Section
2. Design System → Stellt sicher, dass Tokens für Section existieren
3. Layout Agent  → Baut Struktur (Grid, Semantic HTML, Responsive)
4. Assets Agent  → Fügt realistische Inhalte ein (Bilder, Texte)
5. Motion Agent  → Fügt Animations + Interactions hinzu
6. QA Agent      → Verifiziert gegen Quality Gate
7. Integrator    → Löst Konflikte, stellt Build sicher

Wenn QA FAIL → zurück zu der Rolle die den Fehler verursacht hat.
```

---

## Implementierung als Single-Agent (Claude Code)

Da Claude Code ein einzelner Agent ist, werden die 7 Rollen als **mentale Checkpoints** implementiert:

```markdown
## Vor jedem Vertical Slice frage dich:

### [UX Lead] Was ist das Ziel dieser Section?
- Welchen Eindruck soll der User haben?
- Was ist der Focal Point?

### [Design System] Sind alle Tokens bereit?
- Brauche ich neue Farben/Spacings?
- Stimmen die Dark-Layers?

### [Layout] Wie ist die Struktur?
- Grid: Wie viele Columns?
- Responsive: Stack-Order auf Mobile?

### [Assets] Welche Inhalte brauche ich?
- Bilder: Welche Unsplash-IDs?
- Texte: Realistisch oder Placeholder?

### [Motion] Welche Animationen?
- Entrance: Fade + Y-Translate
- Hover: Scale/Color/Shadow
- Scroll: ScrollTrigger-Timing

### [QA] Ist die Section komplett?
- Screenshot → Entspricht Quality Gate?
- Mobile → Kein Overflow?
- Console → 0 Errors?

### [Integrator] Funktioniert alles zusammen?
- Build → Keine Errors?
- Keine Regressions in anderen Sections?
```

---

## Änderungen am Skill-System (konkrete Dateien)

### 1. `CLAUDE.md` — Neues Phase-System

**Alt:**
```
Phase 1: Project Setup → Phase 2: Core Build → Phase 3: Polish → Phase 4: Launch
```

**Neu:**
```
Phase 0: Foundation (Setup + Dependencies + Tokens)
Phase 1: Vertical Slices (Jede Section komplett)
Phase 2: Pages & Polish (Restliche Seiten + Feinschliff)
```

### 2. `starting-a-project/SKILL.md` — Dependency Decision + Phase 0 Gate

**Hinzufügen nach Step 1:**
```markdown
## Step 1.5: Dependency Decision (BLOCKING)

Prüfe das Projekt-Profil:
- Award-Level Website? → npm install gsap lenis lucide-react
- 3D-Erlebnisse? → npm install three @react-three/fiber @react-three/drei
- SaaS App? → npm install @supabase/supabase-js zod

Dies ist NICHT optional. Installiere jetzt oder du wirst sie später brauchen
und die gesamte Architektur muss umgebaut werden.
```

**Hinzufügen nach Step 5:**
```markdown
## Step 6: Phase 0 Quality Gate (BLOCKING)

Starte den Dev Server und verifiziere:
□ Hintergrund ist custom dark (NICHT #000000)
□ Navigation zeigt Custom Font
□ DevTools: 4 verschiedene Background-Farben definiert
□ Lenis smooth scroll funktioniert (wenn installiert)
□ Console: 0 Errors

WENN IRGENDEIN CHECK FEHLSCHLÄGT → Nicht weitermachen. Erst fixen.
```

### 3. Neuer Skill: `verifying-ui-quality/SKILL.md`

Enthält:
- Verification Protocol (Browser-Check Ablauf)
- Quality Gates pro Phase
- Die 25-Punkte Audit-Checkliste
- Screenshot-basierte Verifikation
- Regressions-Prüfung

### 4. Neuer Skill: `building-portfolio-cards/SKILL.md`

Enthält:
- Award-Level Card Pattern (HTML + CSS + Animation)
- Unsplash-Placeholder-Strategy
- 5-Layer Shadow System
- Hover-Patterns (Scale + Overlay)
- Responsive Image Handling

### 5. Neuer Skill: `building-preloaders/SKILL.md`

Enthält:
- Letter-by-letter Reveal Pattern
- GSAP Timeline für Preloader
- Fade-out + Page-Reveal Sequenz
- Performance-Tipps

### 6. Aktualisierte Skills mit Prerequisite-Blöcken

Jeder Phase-2 Skill bekommt einen **Prerequisites**-Block:
```markdown
## Prerequisites (MUST READ FIRST)
- designing-award-layouts-core
- creating-visual-depth
- [weitere je nach Skill]
```

---

## Zusammenfassung: Was sich ändert

| Vorher (v2) | Nachher (v3) |
|-------------|-------------|
| Skeleton zuerst, Polish später | Vertical Slices — jede Section komplett |
| Dependencies "on demand" | Dependency Decision in Phase 0 (blocking) |
| Subjektive Quality Bar | 25-Punkte Audit-Checkliste mit messbaren Kriterien |
| Kein Browser-Check | Verification Protocol nach jedem Slice |
| Schwarze Platzhalter erlaubt | Placeholder-Strategy (Unsplash/Gradients) — Schwarze Boxen verboten |
| Skills "on demand" ohne Reihenfolge | Prerequisites pro Skill + Skill-Loading-Order |
| 4 lose Phasen | 3 klare Phasen mit Quality Gates |
| Keine Rollen-Trennung | 7 mentale Checkpoints pro Slice |
| "Fertig" = kompiliert | "Fertig" = Screenshot besteht Quality Gate |
