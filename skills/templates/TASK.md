# [Projektname] — Aktuelle Aufgabe

<!--
  Diese Datei steuert den KI-Agenten: Was als nächstes zu tun ist.
  Passe die Phasen und Aufgaben an dein Projekt an.
  Der Agent aktualisiert die Checkboxen selbstständig.

  MODUS: Dieser Task ist ein [BUILD / AUDIT / FIX] Task.
  Der Agent darf NICHT eigenmächtig den Modus wechseln.
-->

## Modus: BUILD

<!--
  Ändere den Modus nur wenn nötig:
  BUILD = Projekt aufbauen
  AUDIT = Bestehendes prüfen (kein Code ändern)
  FIX = Spezifische Issues beheben (nur genannte)

  Der Modus wird in .brudi/state.json gespeichert.
  Moduswechsel NUR durch User-Anweisung.
-->

---

## Phase 0: Foundation

- [ ] State prüfen: `cat .brudi/state.json` (Modus, Phase, Slice-Status)
- [ ] Gate Runner pre-check: `BRUDI_STATE_FILE=.brudi/state.json bash ~/Brudi/orchestration/brudi-gate.sh pre-slice`
- [ ] Brudi Identity laden (`~/Brudi/CLAUDE.md`)
- [ ] `~/Brudi/assets/INDEX.md` lesen
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
- [ ] `create-next-app` + Abhängigkeiten installieren
- [ ] globals.css mit 4 Dark-Layers + Tokens + Brand Colors
- [ ] Fonts konfigurieren: [Display-Font] + [Body-Font]
- [ ] Lenis + GSAP Ticker initialisieren (SmoothScroll-Komponente)
- [ ] Phase 0 Quality Gate: Browser öffnen, Screenshot Desktop + Mobile 375px, alle Checks bestätigt

### ⛔ Phase 0 → Phase 1 Transition Gate

ALLE folgenden Bedingungen müssen ✅ sein bevor Phase 1 beginnen darf:

- [ ] Alle Phase 0 Tasks oben ✅
- [ ] Desktop Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] Mobile 375px Screenshot existiert (Dateipfad in PROJECT_STATUS.md)
- [ ] `npm run build` = 0 Errors
- [ ] Console = 0 Errors
- [ ] PROJECT_STATUS.md Phase 0 vollständig ausgefüllt

**Wenn eine Bedingung ❌ → Slice 1 darf NICHT beginnen.**

---

## Phase 1: Vertical Slices — Homepage

Jede Section KOMPLETT (Layout + Tiefe + Content + Animation + Mobile) bevor die nächste beginnt.

**Pro Slice — Pflicht-Ablauf:**
1. `verifying-ui-quality` SKILL.md lesen (in Skill-Log dokumentieren)
2. Sektionsspezifische Skills lesen
3. Code schreiben
4. `npm run build` — muss 0 Errors haben
5. Screenshot Desktop machen → Dateipfad in PROJECT_STATUS.md
6. Screenshot Mobile 375px machen → Dateipfad in PROJECT_STATUS.md
7. Console prüfen → 0 Errors
8. PROJECT_STATUS.md Slice-Zeile aktualisieren (alle Spalten)

- [ ] **Slice 1: Navigation** — Sticky, backdrop blur, mobile hamburger, GSAP entrance
- [ ] **Slice 2: Hero** — Full-viewport, Headline-Stagger, CTAs
- [ ] **Slice 3: [Section Name]** — [Beschreibung]
- [ ] **Slice 4: [Section Name]** — [Beschreibung]
- [ ] **Slice 5: [Section Name]** — [Beschreibung]
- [ ] **Slice 6: CTA Section** — Große Typo, animated border
- [ ] **Slice 7: Footer** — Links, Kontakt, Legal

### ⛔ Phase 1 → Phase 2 Transition Gate

ALLE folgenden Bedingungen müssen ✅ sein bevor Phase 2 beginnen darf:

- [ ] Alle Phase 1 Slices oben ✅
- [ ] JEDER Slice hat Desktop Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Mobile 375px Screenshot-Dateipfad in PROJECT_STATUS.md
- [ ] JEDER Slice hat Console = 0
- [ ] JEDER Slice hat Quality Gate mit 3 benannten Checks
- [ ] Kein Slice hat "—" oder leere Zellen in PROJECT_STATUS.md

**Wenn eine Bedingung ❌ → Keine neue Seite darf begonnen werden.**

---

## Phase 2: Restliche Seiten

Pro Seite gilt derselbe Pflicht-Ablauf wie in Phase 1.

- [ ] [/seite-1] — [Beschreibung]
- [ ] [/seite-2] — [Beschreibung]
- [ ] `/impressum` + `/datenschutz` — Legal (Deutsch, DSGVO)

### ⛔ Phase 2 → Abschluss Transition Gate

- [ ] Alle Seiten ✅
- [ ] Definition of Done Checklist ✅
- [ ] `npm run build` = 0 Errors (finaler Build)

---

## Hard Gates — Zusammenfassung

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

### Anti-Pattern (VERBOTEN)

| Pattern | Status |
|---------|--------|
| `gsap.from()` mit String-Selektoren | ⛔ VERBOTEN |
| `* { margin: 0 }` oder eigene CSS-Resets | ⛔ VERBOTEN |
| `reactStrictMode: false` | ⛔ VERBOTEN |
| Batch-Screenshots am Ende | ⛔ VERBOTEN |
| Mobile-Test ignorieren | ⛔ VERBOTEN |
| Evidenz substituieren | ⛔ VERBOTEN |
| Eigenmächtiger Moduswechsel | ⛔ VERBOTEN |
| "—" als Status-Symbol | ⛔ VERBOTEN |

### Status-Symbole (NUR diese 4)

✅ = Abgeschlossen mit Evidenz | ❌ = Nicht begonnen | 🟨 = In Arbeit | ⬜ = Nicht anwendbar

### Run-Ende Regeln

Ein Run endet NUR wenn:
- Alle Phasen abgeschlossen + Definition of Done ✅, ODER
- User sagt STOP, ODER
- Echte Blockade (dokumentiert in PROJECT_STATUS.md mit Begründung)

"Weitermachen" gilt NUR innerhalb des aktuellen Modus und der aktuellen Phase.
Phasen-Übergang erfordert Phase-Transition-Gate.
Modus-Wechsel erfordert User-Anweisung.

---

## Definition of Done

| Kriterium | Akzeptierte Evidenz |
|-----------|---------------------|
| Keine schwarzen Platzhalter-Boxen | Desktop + Mobile Screenshots zeigen keine leeren schwarzen Bereiche |
| Sichtbare Entrance-Animationen | Screenshots zeigen animierte Elemente (oder Video/GIF) |
| 4 Dark-Layer erkennbar | DevTools-Screenshot mit 4 verschiedenen Background-Werten |
| Mobile 375px getestet | Screenshot-DATEIPFAD für jede Seite |
| Console: 0 Errors | Finaler Build-Output |
| PROJECT_STATUS.md vollständig | Alle Zeilen ✅ mit Evidenz, keine "—" oder leere Zellen |
