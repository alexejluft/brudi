# Brudi — Fehlerbehebung (Troubleshooting)

Hier findest du Lösungen für die häufigsten Probleme bei der Arbeit mit Brudi.

**Schnelle Navigation:**
- [Installation & Setup](#installation--setup)
- [Git & Terminal Fehler](#git--terminal-fehler)
- [Agent-Verhalten](#agent-verhalten)
- [Sicherheitssystem (Gates)](#sicherheitssystem-gates)
- [Dateiprobleme](#dateiprobleme)
- [Visuelle Probleme](#visuelle-probleme)

---

## Installation & Setup

### Problem: "Brudi ist noch nicht global installiert"

**Fehler im Terminal:**
```
sh: ~/Brudi/use.sh: No such file or directory
```

**Ursache:** Brudi wurde nicht installiert oder nicht im richtigen Ordner.

**Lösung:**

Installiere Brudi:
```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

Das script lädt Brudi in `~/Brudi/` herunter. Dann versuche nochmal:
```bash
sh ~/Brudi/use.sh
```

### Problem: "command not found: git"

**Fehler im Terminal:**
```
command not found: git
```

**Ursache:** Git ist nicht installiert.

**Lösung:**

Installiere Git und andere Developer Tools:
```bash
xcode-select --install
```

Ein Dialog erscheint. Klick "Install" und warte 5-10 Minuten. Git wird automatisch mitinstalliert.

Danach prüfe:
```bash
git --version
```

Du solltest `git version 2.x.x` (oder höher) sehen.

### Problem: "Initialisert empty Git repository in ..."

**Das ist KEIN Fehler** — das ist die erwartete Meldung von `git init`:

```
Initialized empty Git repository in /Users/deinname/projects/studio-noir/.git/
```

Das bedeutet Git hat funktioniert. Weitermachen mit:
```bash
sh ~/Brudi/use.sh
```

### Problem: "state.json existiert bereits — wird nicht überschrieben"

**Fehlermeldung:**
```
.brudi/state.json existiert bereits. Wird nicht überschrieben.
```

**Das ist NORMAL und KEIN Fehler.**

Das bedeutet du hast `use.sh` bereits einmal in diesem Ordner ausgeführt. Die Datei existiert bereits. Du kannst einfach weitermachen und deinen Agent starten.

---

## Git & Terminal Fehler

### Problem: "fatal: not a git repository"

**Fehler im Terminal:**
```
fatal: not a git repository (or any of the parent directories): .git
```

**Ursache:** Du hast `git init` vergessen.

**Lösung:**

Führe `git init` aus:
```bash
git init
```

Dann:
```bash
sh ~/Brudi/use.sh
```

### Problem: "Your local changes to the following files would be overwritten by merge"

**Fehler:**
```
error: Your local changes to the following files would be overwritten by merge:
  CLAUDE.md
  TASK.md
Please commit your changes or stash them before you merge.
```

**Ursache:** Du hast Dateien verändert die Git mergen möchte.

**Lösung — Option 1 (Änderungen behalten):**

Speichert deine Änderungen und setzt dann zurück:
```bash
git stash
```

Deine Änderungen sind gespeichert. Danach kannst du sie wieder einspielen:
```bash
git stash pop
```

**Lösung — Option 2 (Alles zurücksetzen):**

Falls deine Änderungen nicht wichtig sind:
```bash
git reset --hard
```

**Lösung — Option 3 (Den Agent um Hilfe bitten):**

Schreib dem Agent:
```
Ich habe einen Git-Merge-Fehler. Behebe ihn.
```

Der Agent weiß wie man das löst.

### Problem: "The path does not exist" beim Navigieren

**Fehler:**
```
cd: no such file or directory: ~/projects/studio-noir
```

**Ursache:** Der Ordner existiert nicht oder der Pfad ist falsch.

**Lösung:**

Prüfe ob der Ordner existiert:
```bash
ls ~/projects/
```

Falls die Ausgabe leer ist oder der Ordner nicht existiert → erstelle ihn im Finder:
1. Öffne Finder
2. Drücke ⌘K (Go to Folder)
3. Tippe `~/projects`
4. Klick "Go"
5. Rechtsklick → "Neuer Ordner" → nenne ihn wie dein Projekt
6. Öffne Terminal nochmal und versuche es

**Alternative — Drag & Drop:**
```bash
cd
```
(Leerzeichen nicht vergessen!)

Ziehe dann deinen Projektordner aus dem Finder ins Terminal. Der Pfad wird automatisch eingefügt.

---

## Agent-Verhalten

### Problem: "Agent macht nichts / antwortet nicht"

**Symptom:** Der Agent startet nicht oder bleibt hängen.

**Mögliche Ursachen und Lösungen:**

**1. TASK.md oder CLAUDE.md hat Fehler**

Prüfe beide Dateien auf Platzhalter (eckige Klammern):
```markdown
[Hier beschreiben: ...]
```

Falls noch welche existieren → ausfüllen.

**2. State ist beschädigt**

Prüfe `.brudi/state.json`:
```bash
cat .brudi/state.json
```

Falls die Ausgabe kryptisch aussieht oder Fehler zeigt → Siehe „state.json ist beschädigt" unten.

**3. Falsche Modus-Anweisung**

Stelle sicher dass du den Agent richtig startest:
```
Lies CLAUDE.md und TASK.md vollständig.
Dann prüfe den State: cat .brudi/state.json
Dann starte mit Phase 0.
```

**4. Agent wartet auf Eingabe**

Der Agent erwartet vielleicht noch Input von dir. Antworte auf seine Frage oder schreib:
```
Weitermachen.
```

### Problem: "Agent bauen Fehler oder sieht schlecht aus"

**Symptom:** Code hat Fehler, Design sieht flach aus, oder etwas funktioniert nicht.

**Lösung:**

Schreib dem Agent:
```
AUDIT: Prüfe die komplette Homepage auf Fehler, fehlende States und visuelle Probleme.
```

Der Agent wechselt in AUDIT Modus und prüft alles. Er erstellt einen Bericht mit allen Problemen.

Dann kannst du:
```
FIX: Behebe alle Probleme die du in der AUDIT aufgelistet hast.
```

### Problem: "Agent sagt 'Phase blockiert' oder 'Slice blockiert'"

**Fehler:**
```
Phase-Transition-Gate nicht bestanden.
Screenshot Desktop fehlt.
```

**Das ist NORMAL und GEWOLLT.**

Das Sicherheitssystem hat angeschlagen. Der Agent erklärt dir genau was fehlt. Häufige Gründe:

- **Screenshot Desktop fehlt** → Agent muss einen Screenshot machen
- **Screenshot Mobile 375px fehlt** → Agent muss Mobile-Version verfizieren
- **Console zeigt Fehler** → Build hat Probleme
- **Quality Gate nicht bestanden** → Visuelle Kriterien nicht erfüllt

**Lösung:**

Lies die Fehlermeldung genau. Der Agent sagt dir was zu tun ist. Meistens:

1. Agent macht einen Screenshot
2. Agent prüft die Mobile-Version (375px)
3. Agent behebt die genannten Fehler
4. Versucht nochmal

Falls das nicht hilft → frag den Agent:
```
Gate blockiert. Was brauche ich tun um das zu beheben?
```

---

## Sicherheitssystem (Gates)

### Problem: "Pre-commit Hook blockiert meinen Commit"

**Fehler beim Commit:**
```
Brudi Gate Runner: PRE-SLICE CHECK FAILED
Evidence missing: screenshots/slice-2-desktop.png
```

**Das ist GEWOLLT.**

Das Sicherheitssystem verhindert dass unvollständige Arbeit committed wird. Das ist eine gute Sache.

**Lösung:**

Der Agent führt automatisch folgende Checks durch:
1. Hat jeder Slice einen Desktop-Screenshot?
2. Hat jeder Slice einen Mobile-Screenshot (375px)?
3. Funktioniert der Build ohne Fehler?
4. Gibt es Console-Fehler?

Falls etwas fehlt → Agent macht es automatisch.

**Falls du manuell committen möchtest (nicht empfohlen):**

```bash
git commit --no-verify -m "deine nachricht"
```

Das umgeht den Hook. Aber das ist riskant — lasse den Agent das machen.

### Problem: ".brudi/state.json ist beschädigt"

**Symptom:** JSON-Fehler, Agent kann nicht weitermachen, oder komische Meldungen.

**Prüfe die Datei:**
```bash
cat .brudi/state.json
```

Falls die Ausgabe kryptisch aussieht (nicht lesbar, Fehler, etc.) → Datei ist beschädigt.

**Lösung:**

Löschen und neu erstellen:
```bash
rm .brudi/state.json
sh ~/Brudi/use.sh
```

Das erstellt eine neue, saubere `state.json`.

Dann starte den Agent neu:
```
Lies CLAUDE.md und TASK.md vollständig.
Dann prüfe den State: cat .brudi/state.json
Starte mit Phase 0.
```

---

## Dateiprobleme

### Problem: "CLAUDE.md oder TASK.md verschwunden"

**Symptom:** Dateien sind weg.

**Lösung:**

Keine Panik — Git speichert alles. Stelle die Dateien wieder her:

```bash
git checkout CLAUDE.md TASK.md
```

Das holt die Dateien aus Git zurück.

### Problem: "screenshots/ Ordner existiert nicht"

**Fehler:**
```
mkdir: cannot create directory `screenshots': File exists
```

Oder Agent kann Screenshots nicht speichern.

**Lösung:**

Erstelle den Ordner manuell:
```bash
mkdir screenshots
```

Falls er bereits existiert aber nicht funktioniert → lösche und erstelle neu:
```bash
rm -r screenshots
mkdir screenshots
```

### Problem: "Zu viele Dateien in node_modules löschen"

**Symptom:** Projekt braucht Platz, oder node_modules ist kaputt.

**Lösung:**

Lösche node_modules (wird automatisch neu erstellt):
```bash
rm -r node_modules
npm install
```

Das löscht den Ordner und installiert alles neu.

### Problem: "package.json ist beschädigt oder weg"

**Symptom:** `npm install` funktioniert nicht, oder Agent baut nicht.

**Lösung:**

Wenn `package.json` weg ist → Agent muss sie neu erstellen. Schreib:
```
Erstelle package.json neu und installiere alle Dependencies.
```

Wenn `package.json` beschädigt ist:
```bash
git checkout package.json
npm install
```

---

## Visuelle Probleme

### Problem: "Projekt sieht flach aus, keine Tiefe, keine Animationen"

**Symptom:** Design ist langweilig, alles ist grau, keine Bewegung.

**Ursache:** Creative DNA Skills wurden nicht geladen.

**Lösung:**

Das Agent muss die richtigen Skills laden. Schreib:
```
Baue Phase 1 neu mit vollständiger Creative DNA:
Lade Skills "creating-visual-depth", "designing-award-motion",
"designing-award-layouts-core" bevor du weiterbaust.
```

Der Agent lädt dann:
- 4-Layer Tiefensystem (Shadows, Gradients)
- Automatische Animationen (Entrance, Hover, Scroll)
- Visuelle Hierarchie und Navigation

### Problem: "Mobile-Version funktioniert nicht"

**Symptom:** Layout ist kaputt auf 375px, Text zu klein, Elements überlappen sich.

**Lösung — Option 1 (Agent hilft):**

```
Mobile-Version ist kaputt. Baue die [Section Name] für 375px neu.
Verifiziere mit Screenshots.
```

**Lösung — Option 2 (Prüfungsmoodus):**

```
AUDIT: Prüfe die komplette Homepage auf 375px (iPhone 6/7/8).
Melde alle Layout-Probleme.
```

### Problem: "Bilder laden nicht oder sind schwarz"

**Symptom:** Statt Bildern sieht man schwarze Kästchen.

**Ursache:** Placeholder-Images werden nicht geladen.

**Lösung:**

Sag dem Agent:
```
Die Portfolio-Section zeigt schwarze Kästchen statt Bilder.
Verwende Unsplash-IDs für realistische Platzhaltter oder CSS-Gradients.
Keine leeren schwarzen Boxen.
```

Der Agent ersetzt die Schwarzen Boxen durch echte Bilder (von Unsplash) oder Gradients.

### Problem: "Hover-Effekte funktionieren nicht"

**Symptom:** Buttons und Cards reagieren nicht auf Mausbewegung.

**Lösung:**

```
Die Services-Cards haben keine Hover-Effekte. Baue sie:
- Leicht nach oben schwimmen (transform: translateY)
- Schatten verstärken
- Hintergrundfarbe ändern
```

Der Agent baut die Effekte mit GSAP.

### Problem: "Animationen hakeln oder sind zuckrig"

**Symptom:** Entrance-Animationen sind nicht smooth, Scroll-Animationen ruckeln.

**Lösung:**

Das ist meist ein Performance-Problem. Sag:
```
FIX: Optimiere alle Animationen auf Performance:
- Verwende transform statt margin/width
- Nutze will-change für häufig animierte Elemente
- Reduziere die Anzahl simultaner Animationen
- Prüfe auf Console-Fehler
```

---

## Allgemeine Tipps

### "Ich bin verwirrt, wo fange ich an?"

1. Lies `START_HERE.md` (5 Min)
2. Führe die 4 Setup-Schritte aus (10 Min)
3. Fülle `CLAUDE.md` aus (15 Min)
4. Fülle `TASK.md` aus (10 Min)
5. Starte den Agent (s.o.)

Total: 40 Minuten bis zur ersten Version.

### "Ich weiß nicht was ich dem Agent sagen soll"

Nutze diese Vorlagen:

```
// Neue Phase starten
Starte Phase [1/2/3] der TASK.md.

// Einzelner Slice
Baue Slice 3 (Services) neu, komplett mit Animationen.

// Fehlersuche
AUDIT: Prüfe den gesamten Code auf Fehler und fehlende States.

// Spezifische Änderung
Änder die Accentfarbe von [alt] zu [neu].

// Seite überarbeiten
Baue die /about Seite komplett neu.
```

### "Agent sagt etwas was ich nicht verstehe"

Frag nach:
```
Was bedeutet das? Erklärs mir einfacher.
```

Der Agent erklärt mit einfachen Worten.

### "Brudi wird aktualisiert und ich weiß nicht ob mein Projekt noch kompatibel ist"

Mach einfach:
```bash
cd ~/Brudi && git pull
```

Dein Projekt ist davon nicht betroffen. Jedes Projekt hat seine eigene Kopie der Regeln.

### "Ich möchte die Brudi-Dateien NICHT antippen"

Das brauchst du nicht. Die einzigen Dateien die du veränderst sind:
- `CLAUDE.md` (einmal ausfüllen)
- `TASK.md` (einmal anpassen)

Alles andere macht der Agent automatisch.

---

## Wenn alles sonst nicht hilft

**Schreib dem Agent:**

```
Ich bin stuck. Hier ist das Problem: [beschreibe genau was nicht funktioniert]

Hier ist der aktuelle Status:
cat .brudi/state.json

[kopiere die Ausgabe]

Was kann ich tun?
```

Der Agent kennt das System und hilft dir. Er hat Zugriff auf:
- Deine `CLAUDE.md` (Projektbeschreibung)
- Deine `TASK.md` (Aufgaben)
- `PROJECT_STATUS.md` (Fortschritt)
- Alle Skills in `~/Brudi/skills/`
- Das komplette Regelwerk in `~/Brudi/CLAUDE.md`

Mit diesen Infos kann der Agent fast alles beheben.

---

**Brudi v3.3.2 — Troubleshooting Guide**
*Letzte Aktualisierung: Februar 2026*

Wenn etwas immer noch nicht klappt → öffne ein Issue auf [GitHub](https://github.com/alexejluft/brudi/issues) oder schreib an den Agent.
