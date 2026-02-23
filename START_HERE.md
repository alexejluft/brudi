# 🟢 Brudi — Hier starten

> Du hast Brudi erfolgreich installiert. Diese Datei zeigt dir **exakt**, was du als nächstes tun musst — Schritt für Schritt, ohne Lücken.

---

## Inhaltsverzeichnis

1. [Was ist Brudi — in einem Satz](#1-was-ist-brudi--in-einem-satz)
2. [Schritt 1 — Projektordner erstellen](#2-schritt-1--projektordner-erstellen)
3. [Schritt 2 — Terminal öffnen und in den Ordner navigieren](#3-schritt-2--terminal-öffnen-und-in-den-ordner-navigieren)
4. [Schritt 3 — Projekt mit Git initialisieren](#4-schritt-3--projekt-mit-git-initialisieren)
5. [Schritt 4 — Projekt mit Brudi verbinden](#5-schritt-4--projekt-mit-brudi-verbinden)
6. [Schritt 5 — Was jetzt in deinem Projektordner ist](#6-schritt-5--was-jetzt-in-deinem-projektordner-ist)
7. [Welche Dateien sind für dich?](#7-welche-dateien-sind-für-dich)
8. [Welche Dateien darfst du NICHT anfassen?](#8-welche-dateien-darfst-du-nicht-anfassen)
9. [Schritt 6 — CLAUDE.md ausfüllen](#9-schritt-6--claudemd-ausfüllen)
10. [Schritt 7 — TASK.md anpassen](#10-schritt-7--taskmd-anpassen)
11. [Schritt 8 — Den KI-Agenten starten](#11-schritt-8--den-ki-agenten-starten)
12. [Häufige Fehler und Lösungen](#12-häufige-fehler-und-lösungen)
13. [Quickstart-Zusammenfassung](#13-quickstart-zusammenfassung)

---

## 1. Was ist Brudi — in einem Satz

Brudi ist das Regelwerk, das dem KI-Agenten erklärt **wer du bist, wie du arbeitest und welchen Qualitätsanspruch du hast** — damit er nicht generisch baut, sondern auf deinem Level.

`~/Brudi/` ist das installierte Framework. Es wird **nie verändert**.
Dein Projekt ist ein separater Ordner auf deinem Computer. Das ist der Ort wo du arbeitest.

---

## 2. Schritt 1 — Projektordner erstellen

Erstelle einen neuen Ordner für dein Projekt. Du kannst das ganz normal im Finder machen.

**Empfohlener Ort:** `~/projects/` (ein Ordner namens „projects" in deinem Home-Verzeichnis)

**Beispiel:**
Du baust eine Website für eine Designagentur namens „Studio Noir".
Erstelle den Ordner: `~/projects/studio-noir`

> **Wichtig:** Verwende bei Ordnernamen keine Leerzeichen und keine Sonderzeichen.
> ✅ `studio-noir` oder `studio_noir`
> ❌ `Studio Noir` oder `mein projekt!`

---

## 3. Schritt 2 — Terminal öffnen und in den Ordner navigieren

Das Terminal ist das schwarze Fenster, in das du Befehle eintippst. Auf dem Mac findest du es unter:
**Programme → Dienstprogramme → Terminal**
oder: Spotlight (⌘ + Leertaste) → „Terminal" tippen → Enter

### In den Projektordner wechseln

Tippe `cd ` (mit einem Leerzeichen dahinter) und **ziehe dann den Projektordner direkt ins Terminal-Fenster**. Das Terminal schreibt den Pfad automatisch ein. Dann drücke Enter.

```
cd ~/projects/studio-noir
```

> **Was macht `cd`?**
> `cd` steht für „change directory" — auf Deutsch: Ordner wechseln. Du sagst dem Terminal damit: „Arbeite ab jetzt in diesem Ordner."

Nach dem Enter siehst du, dass der Ordnername in der Terminal-Zeile erscheint. Das bedeutet: du bist drin.

---

## 4. Schritt 3 — Projekt mit Git initialisieren

Git ist ein Programm, das alle Änderungen an deinen Dateien protokolliert. Brudi braucht Git, damit der KI-Agent strukturiert arbeiten kann.

Tippe diesen Befehl und drücke Enter:

```bash
git init
```

> **Was passiert?**
> Git erstellt einen unsichtbaren Ordner namens `.git/` in deinem Projektordner. Dieser Ordner speichert die gesamte Geschichte deines Projekts. Du wirst ihn nie direkt öffnen müssen.

**Erwartete Ausgabe im Terminal:**
```
Initialized empty Git repository in /Users/deinname/projects/studio-noir/.git/
```

---

## 5. Schritt 4 — Projekt mit Brudi verbinden

Jetzt verbindest du dein Projekt mit Brudi. Das geht mit einem einzigen Befehl:

```bash
sh ~/Brudi/use.sh
```

> **Was passiert?**
> Brudi erstellt automatisch alle Dateien, die dein Projekt und der KI-Agent brauchen:
> - Die Projektbeschreibung für den Agenten (`CLAUDE.md`)
> - Die Aufgabenliste für den Agenten (`TASK.md`)
> - Den Projektstatus (`PROJECT_STATUS.md`)
> - Eine interne Statusdatei (`.brudi/state.json`)
> - Einen Ordner für Screenshots (`screenshots/`)
> - Einen Sicherheitsmechanismus der verhindert, dass der Agent Fehler begeht (`.git/hooks/pre-commit`)

**Erwartete Ausgabe im Terminal:**
```
  Brudi — Projekt verbinden (Tier-1)
  ────────────────────────────────────
  Projektordner: /Users/deinname/projects/studio-noir

  ✓ .brudi/state.json erstellt (Mode: BUILD, Phase: 0, Brudi: v3.3.2)
  ✓ screenshots/ Verzeichnis bereit
  ✓ AGENTS.md erstellt (mit Tier-1 Referenzen)
  ✓ CLAUDE.md aus Template erstellt
  ✓ TASK.md aus Template erstellt
  ✓ PROJECT_STATUS.md aus Template erstellt
  ✓ Pre-commit Hook installiert
```

---

## 6. Schritt 5 — Was jetzt in deinem Projektordner ist

Öffne deinen Projektordner im Finder. Du siehst jetzt folgende Dateien und Ordner:

```
studio-noir/
├── CLAUDE.md              ← Projektbeschreibung für den KI-Agenten
├── TASK.md                ← Aufgabenliste für den KI-Agenten
├── PROJECT_STATUS.md      ← Fortschrittsprotokoll (wird vom Agenten geführt)
├── AGENTS.md              ← Technische Startanweisungen für den Agenten
├── screenshots/           ← Ordner für Beweise (Screenshots pro Abschnitt)
└── .brudi/                ← Systemintern (unsichtbar im Finder)
    └── state.json         ← Aktueller Projektstatus (Modus, Phase, Fortschritt)
```

> **Hinweis:** Ordner und Dateien, die mit einem Punkt beginnen (`.brudi/`, `.git/`), sind versteckt. Im Finder siehst du sie normalerweise nicht. Das ist gewollt.

---

## 7. Welche Dateien sind für dich?

Diese Dateien **musst du ausfüllen**, bevor du den KI-Agenten startest:

| Datei | Was du tust | Wann |
|-------|-------------|------|
| ✅ `CLAUDE.md` | Dein Projekt beschreiben (Was baust du? Farben, Schriften, Seiten) | Vor dem ersten Start |
| ✅ `TASK.md` | Aufgaben beschreiben und Abschnitte benennen | Vor dem ersten Start |

Diese Datei **liest du nur** (du veränderst sie nicht, der Agent füllt sie aus):

| Datei | Wer schreibt | Wann |
|-------|-------------|------|
| 📖 `PROJECT_STATUS.md` | Der KI-Agent | Automatisch nach jedem Arbeitsschritt |

---

## 8. Welche Dateien darfst du NICHT anfassen?

Diese Dateien werden automatisch verwaltet. Wenn du sie veränderst, funktioniert das System nicht mehr korrekt:

| Datei/Ordner | Warum nicht anfassen |
|--------------|----------------------|
| ❌ `AGENTS.md` | Technische Startanweisungen für den Agenten — fertig, kein Eingriff nötig |
| ❌ `.brudi/state.json` | Speichert den aktuellen Projektstatus — wird vom Agenten verwaltet |
| ❌ `.git/` | Git-Daten — werden von Git selbst verwaltet |
| ❌ `screenshots/` | Wird vom Agenten befüllt — du legst hier nichts ab |
| ❌ `~/Brudi/` | Das ist das Framework selbst — keine Änderungen darin |

> **Faustregel:** Wenn die Datei nicht in dieser Anleitung als „für dich" markiert ist — nicht anfassen.

---

## 9. Schritt 6 — CLAUDE.md ausfüllen

`CLAUDE.md` ist das wichtigste Dokument. Hier erklärst du dem KI-Agenten **was er bauen soll**.

Öffne die Datei in einem Texteditor (z.B. TextEdit, VS Code, oder einem beliebigen Editor).

### Was du ausfüllen musst

Die Datei enthält Platzhalter in eckigen Klammern: `[Hier beschreiben: ...]`
Diese Platzhalter ersetzt du durch deine eigenen Angaben.

**Pflichtfelder:**

**1. Was ist das Projekt?** (ca. 2–3 Sätze)
```
Was ist das Projekt?
→ Ersetze: "Eine Marketing-Website für Studio Noir, eine Berliner Designagentur."
```

**2. Zielgruppe** (wer besucht die Website?)
```
Zielgruppe?
→ Ersetze: "Unternehmen die hochwertige Brand-Identity suchen. Primär Desktop."
```

**3. Brand Identity — Farben**
```
Accent:            #D4AF37    ← deine Akzentfarbe (z.B. Gold)
Background dark:   #0A0A0A    ← Hintergrund im Dark Mode (kannst du so lassen)
```
> **Tipp:** Wenn du noch keine Farben hast, nutze [coolors.co](https://coolors.co) zum Generieren.

**4. Typografie** — wähle eine aus dieser Liste:
- `Clash Display` — Modern, geometrisch (gut für Headlines)
- `Satoshi` — Sauber, vielseitig (gut für Fließtext)
- `General Sans` — Neutral, professionell
- `Cabinet Grotesk` — Charakterstark, leicht retro
- `Switzer` — Elegant, minimalistisch

**5. Seiten** — welche Seiten soll die Website haben?
```
- `/` — Home: Startseite mit Hero, Leistungen, Portfolio, Kontakt
- `/about` — Über uns: Team und Geschichte
- `/contact` — Kontaktformular
```

**Was du NICHT ausfüllen musst:**
Alles was technisch ist (Tech Stack, Gate-Regeln, Modus-Steuerung) — das ist bereits korrekt eingestellt und wird vom Agenten automatisch eingehalten. Lass diese Abschnitte so wie sie sind.

---

## 10. Schritt 7 — TASK.md anpassen

`TASK.md` ist die Aufgabenliste. Der KI-Agent liest sie, um zu verstehen **was er als nächstes bauen soll**.

### Was du anpassen musst

**1. Sektionen der Homepage benennen**

In Phase 1 findest du vorausgefüllte Platzhalter:
```
- [ ] Slice 3: [Section Name] — [Beschreibung]
- [ ] Slice 4: [Section Name] — [Beschreibung]
- [ ] Slice 5: [Section Name] — [Beschreibung]
```

Ersetze die Platzhalter mit deinen Abschnitten. Beispiel:
```
- [ ] Slice 3: Services — Drei Leistungskarten mit Icons und Hover-Animation
- [ ] Slice 4: Portfolio — 6 Projekt-Cards mit Bild und Hover-Overlay
- [ ] Slice 5: Über uns — Team-Fotos mit Namen und kurzer Bio
```

**2. Seiten in Phase 2 eintragen**

```
- [ ] [/seite-1] — [Beschreibung]
```
Ersetze durch deine gewünschten Unterseiten:
```
- [ ] /about — Team-Seite mit vollständiger Geschichte der Agentur
- [ ] /contact — Kontaktformular mit Kartenansicht
- [ ] /impressum — Pflichtangaben (deutsch)
- [ ] /datenschutz — DSGVO-Datenschutzerklärung
```

**Was du NICHT verändern musst:**
Phase 0 (technische Einrichtung) und alle Gate-Regeln bleiben so wie sie sind. Der Agent weiß was er damit macht.

---

## 11. Schritt 8 — Den KI-Agenten starten

Wenn `CLAUDE.md` und `TASK.md` ausgefüllt sind, bist du bereit.

### So startest du den Agenten (am Beispiel Cowork / Claude)

1. Öffne Claude (Cowork, Claude Code, oder ein anderes Claude-Interface)
2. Stelle sicher, dass der Agent Zugriff auf deinen Projektordner hat
3. Schreibe deinen ersten Auftrag

### Der erste Auftrag — genau so formulieren:

```
Lies zuerst CLAUDE.md und TASK.md in diesem Projektordner vollständig.
Dann prüfe den State mit: cat .brudi/state.json
Dann starte mit Phase 0.
```

> **Warum diese Formulierung?**
> Brudi schreibt dem Agenten vor, zuerst alle Dateien zu lesen bevor er arbeitet. Dieser erste Satz stellt sicher, dass der Agent mit dem richtigen Kontext startet — nicht blind drauflosbaut.

### Was der Agent dann selbstständig macht:

Der Agent liest:
1. `~/Brudi/CLAUDE.md` — sein Regelwerk
2. Deine `CLAUDE.md` — dein Projekt
3. `TASK.md` — die Aufgaben
4. `.brudi/state.json` — den aktuellen Status

Dann beginnt er mit Phase 0 (technische Einrichtung) und arbeitet sich Schritt für Schritt durch alle Phasen. Nach jedem Abschnitt macht er einen Screenshot, prüft ob alles korrekt ist, und protokolliert den Fortschritt in `PROJECT_STATUS.md`.

**Du musst nichts weiter tun** — außer Antworten geben wenn der Agent Fragen stellt, und am Ende jeden Abschnitt prüfen ob er dir gefällt.

---

## 12. Häufige Fehler und Lösungen

### „command not found: git"

Git ist nicht installiert. Öffne das Terminal und tippe:
```bash
xcode-select --install
```
Folge den Anweisungen. Git wird dabei automatisch mitinstalliert.

---

### „Brudi ist noch nicht global installiert"

Das erscheint wenn du `sh ~/Brudi/use.sh` ausführst, aber Brudi noch nicht installiert ist. Installiere Brudi zuerst:
```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

---

### „state.json existiert bereits — wird nicht überschrieben"

Kein Problem. Das bedeutet du hast `use.sh` schon einmal in diesem Ordner ausgeführt. Die Datei ist bereits vorhanden. Du kannst einfach weitermachen.

---

### „Your local changes to the following files would be overwritten by merge"

Das passiert wenn du Dateien verändert hast, die Git nicht überschreiben darf. Lösung:
```bash
git stash && git pull
```
Oder: lass den Agenten helfen.

---

### Der Agent macht etwas Falsches oder baut in die falsche Richtung

Schreibe im Chat: `STOP` und erkläre was nicht stimmt. Der Agent stoppt sofort. Dann kannst du ihn neu einweisen.

---

### Der Agent sagt „Gate nicht bestanden"

Das ist normal und kein Fehler — das Sicherheitssystem hat angeschlagen. Der Agent erklärt dir was fehlt. Lies die Meldung und antworte entsprechend.

---

### Brudi aktualisieren (wenn eine neue Version erscheint)

```bash
cd ~/Brudi && git pull
```

Das war's. Kein Reinstallieren nötig.

---

## 13. Quickstart-Zusammenfassung

Die 8 Schritte auf einen Blick:

```
1. Projektordner erstellen (im Finder, z.B. ~/projects/mein-projekt)

2. Terminal öffnen
   cd ~/projects/mein-projekt

3. Git initialisieren
   git init

4. Brudi verbinden
   sh ~/Brudi/use.sh

5. CLAUDE.md ausfüllen
   → Was baust du? Zielgruppe? Farben? Schriften? Seiten?

6. TASK.md anpassen
   → Welche Abschnitte soll die Homepage haben?
   → Welche Unterseiten gibt es?

7. KI-Agenten starten (in Claude / Cowork)

8. Ersten Auftrag geben:
   "Lies CLAUDE.md und TASK.md vollständig, prüfe den State
    mit cat .brudi/state.json, dann starte mit Phase 0."
```

---

**Du bist bereit.**
Wenn etwas unklar ist oder nicht funktioniert, frage den KI-Agenten direkt — er kennt das System und hilft dir weiter.
