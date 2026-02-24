# Brudi — Dein Award-Level Baukasten

## Was ist Brudi?

Brudi ist ein System, das dir hilft, großartige Websites und Apps zu bauen. Es erklärt dem KI-Agenten (z.B. Claude), wie du arbeitest, was du brauchst und welchen Qualitätsstandard du hast — damit er automatisch auf deinem Level baut, nicht generisch.

**Kurz:** Du füllst drei Dateien aus. Der Agent baut. Brudi sorgt dafür, dass es award-level ist.

## Was ist Brudi NICHT?

- ❌ Keine Design-App (kein Figma-Ersatz)
- ❌ Keine Code-IDE (kein VS Code-Ersatz)
- ❌ Keine "klick hier, Magie passiert"-Lösung
- ❌ Nicht für statische HTML-Seiten ohne Animationen

Brudi ist ein **Regelwerk für KI-Agenten** — es ermöglicht intelligente, strukturierte Zusammenarbeit zwischen dir und Claude.

## Ordnerstruktur: Was ist System, was ist dein Projekt?

```
~/ (Dein Computer)
├── Brudi/                    ← Das System (install einmalig, nicht anfassen)
│   ├── skills/              ← Dokumentation für den Agent
│   ├── assets/              ← Vorlagen und Design-Token
│   └── orchestration/        ← Sicherheitssystem
│
└── projects/                ← Deine Projekte
    └── mein-projekt/        ← DEIN Arbeitsordner
        ├── CLAUDE.md        ← Du schreibst hier: dein Projekt
        ├── TASK.md          ← Du schreibst hier: deine Aufgaben
        ├── PROJECT_STATUS.md ← Agent schreibt hier: Fortschritt
        ├── .brudi/          ← System (nicht anfassen)
        └── screenshots/     ← Beweise (Agent macht hier Screenshots)
```

**Die Regel:** Alles in `~/projects/dein-projekt/` ist DEIN Bereich. `~/Brudi/` ist System und wird nie verändert.

## Schritt-für-Schritt Anleitung

### 1. Projektordner erstellen

Erstelle einen neuen Ordner für dein Projekt. Am besten unter `~/projects/`.

Beispiel: `~/projects/studio-noir` (kein Leerzeichen, keine Umlaute)

### 2. Terminal öffnen und in den Ordner wechseln

Öffne das Terminal (Spotlight: ⌘ + Leertaste → "Terminal").

Tippe: `cd ` (mit Leerzeichen) und **ziehe dann deinen Projektordner ins Terminal-Fenster**. Das Terminal schreibt den Pfad automatisch ein. Dann Enter.

```bash
cd ~/projects/studio-noir
```

### 3. Git initialisieren

Git ist ein Versionscontrol-System. Brudi braucht es, um zu wissen wann du Code verändert hast. Tippe:

```bash
git init
```

Das erstellt einen unsichtbaren Ordner `.git/` in deinem Projektordner. Du brauchst dich nicht darum zu kümmern — Git macht den Rest automatisch.

### 4. Brudi verbinden

Jetzt verbindest du dein Projekt mit Brudi:

```bash
sh ~/Brudi/use.sh
```

Das erstellt automatisch folgende Dateien in deinem Ordner:
- `CLAUDE.md` — dein Projekt beschreiben
- `TASK.md` — deine Aufgaben auflisten
- `PROJECT_STATUS.md` — Fortschritt verfolgen
- `.brudi/state.json` — Sicherheitsstatus
- `screenshots/` — Ordner für Screenshots

## Welche Dateien sind für dich?

| Datei | Deine Aktion | Wann |
|-------|-------------|------|
| ✅ `CLAUDE.md` | Ausfüllen: Was baust du? Farben? Schriften? | Vor dem ersten Agent-Start |
| ✅ `TASK.md` | Anpassen: Homepage-Abschnitte nennen, Seiten auflisten | Vor dem ersten Agent-Start |
| 📖 `PROJECT_STATUS.md` | Nur lesen — Agent füllt es automatisch aus | Nach jedem Arbeitsschritt |

Diese Dateien **nicht anfassen:**
- ❌ `AGENTS.md` — Technische Referenz
- ❌ `.brudi/state.json` — Projektstatus (wird automatisch verwaltet)
- ❌ `.git/` — Git-Daten
- ❌ `~/Brudi/` — Das System selbst

## Creative DNA erklärt — Was Brudi automatisch macht

Brudi bauen **nicht wie generische KI-Tools**, sondern nach festen Regeln:

### 1. Automatische Tiefenwirkung

Jeder Bereich hat **4 visuellen Schichten**:
- Hintergrund (dunkel)
- Oberfläche (etwas heller)
- Oberflächenhigh (noch heller)
- Akzent (deine Farbe)

Das schafft Tiefe und visuelle Struktur automatisch.

### 2. Automatische Animationen

Du musst Animationen **nicht beschreiben**. Brudi bauen sie automatisch für:
- **Entrance** — Elemente faden beim Laden ein
- **Hover** — Buttons und Cards reagieren auf Mausbewegung
- **Scroll-Trigger** — Große Bereiche animieren beim Scrollen
- **Page Transitions** — Seitenübergänge sind elegant

### 3. Automatische Navigation

Brudi bauenvollständige Navigation mit:
- Scroll-Indikator (zeigt wo du bist)
- Smooth Scrolling (eleganter als Schnellsprung)
- Mobile-Menü wenn nötig

### 4. Automatische Mobile-Optimierung

Jeder Bereich funktioniert auf 375px Bildschirmen (iPhone 6/7/8). Keine schwarzen Kästchen statt Bilder, keine verschobenen Layouts.

### Wie du Brudi "nutzt": Reduktion statt Aufwertung

Du **brauchst nicht alles zu beschreiben**. Du musst nur sagen, was NICHT automatisch passieren soll:
- "Keine Animationen" statt "Baue diese Animationen hier"
- "Kein Dark Mode" statt "Implementiere Dark Mode"
- "Statische Buttons" statt "Baue diese Button-Effekte"

Reduzieren ist einfacher als beschreiben.

## Erste Schritte: CLAUDE.md ausfüllen

Öffne `CLAUDE.md` in einem Texteditor und ersetze die Platzhalter `[Hier: ...]`:

```markdown
## Was ist das Projekt?
[Hier beschreiben: Eine 2-3 Satz Beschreibung]
→ Beispiel: "Studio Noir ist eine Berliner Designagentur.
Die Website zeigt Portfolio, Leistungen und Kontaktformular."

## Zielgruppe?
[Hier beschreiben: Wer besucht die Website?]
→ Beispiel: "Mittelständische Unternehmen die B2B Brand Design suchen. Primär Desktop-Benutzer."

## Brand Identity — Farben
Accent:         #D4AF37    ← Deine Hauptfarbe (z.B. Gold)
Surface:        #1A1A1A    ← Hintergrund dunkel
Surface High:   #2A2A2A    ← Hintergrund hell
```

Wenn du keine Farben hast → [coolors.co](https://coolors.co) öffnen und 3 Farben generieren.

```markdown
## Typografie
Headline-Font:  Clash Display    ← Wähle eine aus dieser Liste
Body-Font:      Satoshi

[Weitere Optionen: General Sans, Cabinet Grotesk, Switzer]
```

```markdown
## Seiten deiner Website
- `/`        — Homepage mit Hero, Services, Portfolio, CTA
- `/about`   — Team und Geschichte
- `/contact` — Kontaktformular
```

## Zweite Schritte: TASK.md anpassen

Öffne `TASK.md` und ersetze die Platzhalter in Phase 1 und Phase 2:

**Phase 1 — Homepage-Abschnitte:**
```
- [ ] Slice 3: Services — Drei Leistungskarten mit Icons und Hover
- [ ] Slice 4: Portfolio — 6 Projekt-Cards mit Bild-Overlay
- [ ] Slice 5: Testimonials — 3 Kundenbewertungen in Carousel
```

**Phase 2 — Unterseiten:**
```
- [ ] /about — Team-Seite mit Fotos und Beschreibungen
- [ ] /contact — Kontaktformular mit Validierung
- [ ] /datenschutz — DSGVO-konforme Privacy Policy
```

## Den Agent starten

Wenn `CLAUDE.md` und `TASK.md` fertig sind, starte Claude (oder dein KI-Interface) und schreibe:

```
Lies zuerst CLAUDE.md und TASK.md in diesem Projektordner vollständig.
Dann prüfe den State mit: cat .brudi/state.json
Dann starte mit Phase 0.
```

Das ist alles. Der Agent liest alles, versteht die Struktur und arbeitet Schritt für Schritt durch dein Projekt.

Nach jedem Arbeitsschritt:
- Macht der Agent einen Screenshot
- Prüft ob alles korrekt ist
- Aktualisiert `PROJECT_STATUS.md` mit Fortschritt

## Wenn etwas schiefgeht

Siehe **TROUBLESHOOTING.md** in diesem Ordner (`docs/TROUBLESHOOTING.md`).

Die häufigsten Probleme:
- "git init vergessen" → Lösung
- "Agent sagt Gate blockiert" → Das ist normal, Evidenz eintragen
- "Rote Fehler im Terminal" → Nicht panikieren, Fehler kopieren, Agent zeigen

## Zusammenfassung: Die 3 Minuten Version

```
1. Brudi installieren (einmalig, dauert 1-3 Min):
   curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
2. Ordner erstellen: ~/projects/studio-noir
3. Terminal: cd ~/projects/studio-noir && git init
4. Brudi verbinden: sh ~/Brudi/use.sh
5. CLAUDE.md ausfüllen (Projekt, Farben, Schriften, Seiten)
6. TASK.md anpassen (Homepage-Abschnitte, Unterseiten)
7. Claude starten und schreiben:
   "Lies CLAUDE.md und TASK.md, dann Phase 0"
8. Zuschauen wie dein Projekt entsteht
```

> **Hinweis:** Die Installation prueft automatisch ob Git und Node.js vorhanden sind
> und installiert alle internen Abhaengigkeiten. Du musst dich darum nicht kuemmern.

---

**Du bist bereit.**

Wenn Fragen entstehen: Frag den Agent. Er kennt das System und beantwortet alles — von "Was ist Git?" bis "Warum sieht das flach aus?".
