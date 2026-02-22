# [Projektname] — Aktuelle Aufgabe

<!--
  Diese Datei steuert den KI-Agenten: Was als nächstes zu tun ist.
  Passe die Phasen und Aufgaben an dein Projekt an.
  Der Agent aktualisiert die Checkboxen selbstständig.
-->

## Phase 0: Foundation

- [ ] Brudi Identity laden (`~/.brudi/CLAUDE.md`)
- [ ] `~/.brudi/assets/INDEX.md` lesen
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
- [ ] `create-next-app` + Abhängigkeiten installieren
- [ ] globals.css mit 4 Dark-Layers + Tokens + Brand Colors
- [ ] Fonts konfigurieren: [Display-Font] + [Body-Font]
- [ ] Lenis + GSAP Ticker initialisieren (SmoothScroll-Komponente)
- [ ] Phase 0 Quality Gate: Browser öffnen, Screenshot, alle Checks bestätigt

## Phase 1: Vertical Slices — Homepage

Jede Section KOMPLETT (Layout + Tiefe + Content + Animation + Mobile) bevor die nächste beginnt.
Skills lesen vor jeder Section: `verifying-ui-quality` + sektionsspezifische Skills.

- [ ] **Slice 1: Navigation** — Sticky, backdrop blur, mobile hamburger, GSAP entrance
- [ ] **Slice 2: Hero** — Full-viewport, Headline-Stagger, CTAs
- [ ] **Slice 3: [Section Name]** — [Beschreibung]
- [ ] **Slice 4: [Section Name]** — [Beschreibung]
- [ ] **Slice 5: [Section Name]** — [Beschreibung]
- [ ] **Slice 6: CTA Section** — Große Typo, animated border
- [ ] **Slice 7: Footer** — Links, Kontakt, Legal

Nach jedem Slice: Screenshot Desktop + Mobile 375px + Quality Gate.

## Phase 2: Restliche Seiten

- [ ] [/seite-1] — [Beschreibung]
- [ ] [/seite-2] — [Beschreibung]
- [ ] `/impressum` + `/datenschutz` — Legal (Deutsch, DSGVO)

## Hard Gates — Pro Slice (JEDE Seite, JEDER Slice)

Ein Slice ist NICHT abgeschlossen ohne:
1. `verifying-ui-quality` gelesen + 3 Checks dokumentiert
2. Code geschrieben
3. Screenshot Desktop (Pfad in PROJECT_STATUS.md)
4. Screenshot Mobile 375px (Pfad in PROJECT_STATUS.md)
5. Console = 0 Errors
6. PROJECT_STATUS.md aktualisiert

Nächster Slice erst wenn alle 6 Punkte erfüllt.

## Anti-Pattern (VERBOTEN)

- `gsap.from()` mit String-Selektoren → Immer `gsap.set()` + `gsap.to()` mit Element-Refs
- `* { margin: 0 }` oder eigene CSS-Resets → Tailwind v4 Preflight reicht
- `reactStrictMode: false` → Code muss Strict Mode kompatibel sein
- Batch-Screenshots am Ende statt pro Slice
- Mobile-Test ignorieren

## Run-Ende Regeln

Ein Run endet NUR wenn:
- Alle Phasen abgeschlossen, ODER
- User sagt STOP, ODER
- Echte Blockade (dokumentiert in PROJECT_STATUS.md)

Offene Phasen existieren → automatisch weitermachen.

## Definition of Done

- Keine schwarzen Platzhalter-Boxen
- Sichtbare Entrance-Animationen
- 4 Dark-Layer erkennbar
- Mobile 375px getestet (Screenshot mit Pfad)
- Console: 0 Errors
- PROJECT_STATUS.md aktualisiert
