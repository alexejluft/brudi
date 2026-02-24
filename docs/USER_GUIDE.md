# Brudi — Vollständige Benutzeranleitung

Willkommen bei Brudi. Diese Anleitung erklärt alles was du wissen musst — ausführlich, ohne Fachbegriffe, mit Beispielen.

**Für den schnellen Einstieg:** Lies zuerst `START_HERE.md` im Root-Ordner.

---

## Teil 1: Was ist Brudi?

### Das Konzept in einem Satz

Brudi ist ein System das dem KI-Agenten (z.B. Claude) beibringt, wie **du** arbeitest und auf welchem Qualitätsniveau — damit er nicht generisch baut, sondern auf deinem Standard.

### Die Metapher

Stell dir vor, du bestellst einen Handwerker für dein neues Haus:
- Der Handwerker ist sehr fähig, hat aber noch nie für dich gearbeitet
- Bevor er anfängt, musst du ihm erklären: Welcher Stil? Welche Materialien? Welche Qualität?
- Ohne das Briefing baut er generisch. Mit dem Briefing baut er genau deiner Vorstellung entsprechend

Brudi ist dein **Briefing-Dokument für den KI-Agenten**.

### Was Brudi automatisch macht

Brudi sorgt automatisch für:
- **Award-Level Design** — Tiefe, Schatten, visuele Hierarchie
- **Animationen** — Entrance, Hover, Scroll-Trigger (du musst sie nicht beschreiben)
- **Mobile-Optimierung** — Funktioniert perfekt auf 375px Bildschirmen
- **Konsistente Navigation** — Scroll-Indikator, smooth Scrolling, Menü-Strukturen
- **Page Transitions** — Elegante Übergänge zwischen Seiten
- **Sicherheit** — Git-basierte Versionskontrolle, automatische Backups, Qualitätsgates

### Was Brudi NICHT ist

- ❌ Keine Design-Software (kein Figma-Ersatz)
- ❌ Keine Code-IDE (kein VS Code-Ersatz)
- ❌ Keine "magische Lösung" — du musst dein Projekt noch beschreiben
- ❌ Nicht für reine HTML-Seiten ohne Animationen
- ❌ Nicht für Anfänger die erste Schritte mit Webentwicklung lernen

---

## Teil 2: Architektur — Wie Brudi strukturiert ist

### Das große Bild

```
Dein Computer (~/)
│
├── Brudi/                          ← Das System (installiert, nicht ändern)
│   ├── CLAUDE.md                   ← Alex's Identität und Standards
│   ├── skills/                     ← Spezialisiertes Wissen für verschiedene Tasks
│   │   ├── building-layouts/
│   │   ├── designing-award-motion/
│   │   ├── orchestrating-gsap-lenis/
│   │   └── ... (150+ Skills)
│   ├── assets/                     ← Wiederverwendbare Komponenten und Token
│   │   ├── fonts/                  ← Variable Schriftarten
│   │   ├── tokens/                 ← Design Tokens (Farben, Abstände, Schatten)
│   │   └── templates/              ← Code-Vorlagen
│   ├── orchestration/              ← Sicherheitssystem
│   │   └── brudi-gate.sh           ← Gate Runner für Quality Control
│   ├── templates/                  ← Vorlagen für neue Projekte
│   └── use.sh                      ← Setup-Script für neue Projekte
│
└── projects/                       ← Deine Arbeitsbereiche
    ├── studio-noir/                ← Beispiel: Projekt 1
    │   ├── CLAUDE.md               ← Projektbeschreibung (DU schreibst)
    │   ├── TASK.md                 ← Aufgabenliste (DU schreibst)
    │   ├── PROJECT_STATUS.md       ← Fortschritt (Agent schreibt)
    │   ├── AGENTS.md               ← Agenten-Startup-Instruktionen
    │   ├── screenshots/            ← Beweise und Screenshots
    │   ├── .brudi/
    │   │   └── state.json          ← Projektstatus (Agent verwaltet)
    │   ├── src/                    ← Dein Code (erstellt in Phase 0)
    │   ├── node_modules/           ← Abhängigkeiten (automatisch)
    │   └── package.json            ← Projekt-Konfiguration
    │
    └── fairsplit-app/              ← Beispiel: Projekt 2
        ├── (gleiche Struktur...)
        └── ...
```

### Die wichtige Abgrenzung

- **~/Brudi/** — Das Framework. Gehört dir, wird von dir aber nicht verändert. Wird aktualisiert mit `git pull`.
- **~/projects/dein-projekt/** — Dein Arbeitsbereich. Hier entscheidest du was gebaut wird.

---

## Teil 3: Installation und Projekt-Setup

### Schritt 1: Voraussetzungen prüfen

Öffne das Terminal und prüfe ob Git installiert ist:

```bash
git --version
```

Wenn du `git version 2.x.x` (oder höher) siehst — alles gut.

Falls nicht, installiere es:
```bash
xcode-select --install
```

Folge den Anweisungen. Das dauert ein paar Minuten und Git wird automatisch mitinstalliert.

### Schritt 2: Brudi überprüfen

Prüfe ob Brudi installiert ist:

```bash
ls ~/Brudi
```

Du solltest folgende Ordner sehen: `skills/`, `assets/`, `orchestration/`, `templates/`.

Falls Brudi nicht existiert, installiere es:

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

Das lädt Brudi in dein Home-Verzeichnis.

### Schritt 3: Neues Projekt erstellen

#### 3a. Projektordner erstellen

Erstelle einen neuen Ordner für dein Projekt. Am besten unter `~/projects/`:

**Im Finder:**
- Öffne Finder
- Gehe zu Home (⌘K → tippe `~/`)
- Erstelle einen Ordner namens `projects` (falls nicht existiert)
- Darin: Erstelle einen Ordner für dein Projekt, z.B. `studio-noir`

**Namensregeln für Projektordner:**
- ✅ Nur Kleinbuchstaben
- ✅ Bindestriche (`studio-noir`) oder Unterstriche (`studio_noir`)
- ❌ Keine Leerzeichen
- ❌ Keine Umlaute oder Sonderzeichen
- ❌ Nicht mit Zahlen anfangen

**Gute Beispiele:**
```
studio-noir
my-awesome-app
fairsplit-v2
brand-website
```

#### 3b. Terminal öffnen und navigieren

Öffne das Terminal (Spotlight: ⌘ Leertaste → "Terminal" tippen → Enter).

Navigiere zu deinem Projektordner:

```bash
cd ~/projects/studio-noir
```

**Tipp — Drag & Drop statt tippen:**
- Tippe `cd ` (mit Leerzeichen dahinter)
- Ziehe deinen Projektordner aus dem Finder ins Terminal-Fenster
- Der Pfad wird automatisch eingefügt
- Drücke Enter

Du erkennst, dass du im richtigen Ordner bist, wenn der Ordnername in der Terminal-Zeile angezeigt wird.

#### 3c. Git initialisieren

Git ist ein Versionskontrollsystem. Es protokolliert alle Änderungen an deinen Dateien — wie ein Backup-System mit Zeitstempel.

```bash
git init
```

Das erstellt einen unsichtbaren Ordner `.git/` in deinem Projekt. Du brauchst dich nicht darum zu kümmern — Git macht alles automatisch.

#### 3d. Brudi mit deinem Projekt verbinden

```bash
sh ~/Brudi/use.sh
```

Das erstellt automatisch alle notwendigen Dateien für dein Projekt. Die Ausgabe sieht so aus:

```
  Brudi — Projekt verbinden (Tier-1)
  ────────────────────────────────────
  Projektordner: /Users/deinname/projects/studio-noir

  ✓ .brudi/state.json erstellt (Mode: BUILD, Phase: 0, Brudi: v3.3.2)
  ✓ screenshots/ Verzeichnis bereit
  ✓ CLAUDE.md aus Template erstellt
  ✓ TASK.md aus Template erstellt
  ✓ PROJECT_STATUS.md aus Template erstellt
  ✓ Pre-commit Hook installiert (Sicherheit aktiviert)
```

### Schritt 4: Dein Projektordner jetzt

Öffne deinen Projektordner im Finder. Du siehst folgende Dateien:

```
studio-noir/
├── CLAUDE.md              ← DU füllst das aus (Projektbeschreibung)
├── TASK.md                ← DU füllst das aus (Aufgabenliste)
├── PROJECT_STATUS.md      ← Agent füllt das aus (Fortschritt)
├── AGENTS.md              ← Agenten-Instruktionen (nicht ändern)
├── screenshots/           ← Ordner für Screenshots (Agent füllt)
├── src/                   ← Dein Code (wird in Phase 0 erstellt)
├── package.json           ← Projekt-Konfiguration
├── node_modules/          ← Abhängigkeiten (wird automatisch erstellt)
└── .brudi/                ← System (versteckt, nicht anfassen)
    └── state.json         ← Projektstatus
```

---

## Teil 4: Die wichtigsten Dateien — was du ausfüllen musst

### CLAUDE.md — Das Herzstück

Dies ist die wichtigste Datei. Sie erklärt dem Agenten alles über dein Projekt.

#### Wie du sie ausfüllst

Öffne `CLAUDE.md` in einem Texteditor (TextEdit, VS Code, oder beliebig).

Du siehst viele Platzhalter in `[eckigen Klammern]`. Diese ersetzt du mit deinen Angaben.

#### Alle Felder erklärt

**1. Was ist das Projekt?**

```markdown
[Hier beschreiben: Was wird gebaut und für wen?]
```

Ersetze durch eine 2-3 Satz Beschreibung:

```
Eine Portfolio-Website für Studio Noir, eine Berliner Designagentur.
Die Website zeigt die wichtigsten Projekte, Leistungen, das Team
und ein Kontaktformular.
```

**2. Zielgruppe**

```markdown
[Hier beschreiben: Wer sind die Nutzer?]
```

Ersetze durch z.B.:

```
Unternehmen ab 50 Mitarbeitern die eine neue Brand-Identity suchen.
Primär Visitoren vom Desktop, aber Mobile muss einwandfrei funktionieren.
```

**3. Brand Identity — Farben**

Du brauchst mindestens 2 Farben:

```markdown
- **Accent:** [#D4AF37]           ← deine Hauptfarbe
- **Background dark:** [#0A0A0A]  ← dunkler Hintergrund
```

Hex-Codes sind 6-stellige Farb-Codes (z.B. `#D4AF37` = Gold).

Wenn du keine Farben hast:
1. Öffne [coolors.co](https://coolors.co)
2. Klick "Generate" mehrmals bis dir Paletten gefallen
3. Kopiere die Hex-Codes

Beispiele:
```
#D4AF37 = Gold (Luxus)
#FF6B9D = Pink (modern)
#1F2937 = Dunkelgrau (professionell)
#0F766E = Teal (tech-freundlich)
```

**4. Typografie — Schriftarten**

Wähle eine Schrift für Headlines und eine für Fließtext:

| Schrift | Charakter | Wann verwenden |
|---------|-----------|----------------|
| **Clash Display** | Modern, geometrisch | Tech-Startups, Agenturen |
| **Satoshi** | Sauber, vielseitig | Fast alles (Universal) |
| **General Sans** | Neutral, professionell | B2B, SaaS, Fintech |
| **Cabinet Grotesk** | Charakterstark, retro | Kreative Agenturen, Mode |
| **Switzer** | Elegant, schlank | Luxury-Brands, Mode |

Trage die Namen ein:

```markdown
Headline-Font: Clash Display
Body-Font: Satoshi
```

**5. Welche Seiten soll die Website haben?**

Liste alle Seiten auf:

```markdown
- `/`           — Home: Hero, Services, Portfolio, CTA
- `/about`      — Team: 4 Mitglieder mit Bios
- `/contact`    — Kontaktformular mit Validierung
- `/impressum`  — Pflichtseite (Deutsch)
- `/datenschutz`— DSGVO-konforme Privacy Policy
```

**Was du NICHT anfassen musst:**

Alle Abschnitte unter „Tier-1 Orchestrierung", „Mode Control", „Hard Gates" sind technische Anweisungen für den Agenten. Lass sie unverändert.

### TASK.md — Die Aufgabenliste

Diese Datei sagt dem Agenten **was er Schritt für Schritt bauen soll**.

Brudi unterteilt jedes Projekt in 4 Phasen:

- **Phase 0:** Technische Grundlage (Agent macht das selbst)
- **Phase 1:** Homepage bauen, Abschnitt für Abschnitt
- **Phase 2:** Unterseiten bauen
- **Phase 3:** Veröffentlichung und Launch

#### Phase 1 — Homepage-Abschnitte nennen

In der Datei findest du Platzhalter wie:

```markdown
- [ ] Slice 3: [Section Name] — [Beschreibung]
- [ ] Slice 4: [Section Name] — [Beschreibung]
- [ ] Slice 5: [Section Name] — [Beschreibung]
```

Ersetze sie durch deine Abschnitte:

```markdown
- [ ] Slice 3: Services — Drei Leistungskarten (Branding, Web, Print) mit Icons
- [ ] Slice 4: Portfolio — 6 Projekt-Cards mit Bild, Titel und Hover-Overlay
- [ ] Slice 5: Team — 4 Mitglieder mit Foto, Name, Rolle und Mini-Bio
- [ ] Slice 6: Testimonials — 3 Kundenstimmen mit Zitat, Name, Foto
- [ ] Slice 7: CTA — "Lass uns sprechen" — Button + Newsletter-Signup
```

**Regeln für Beschreibungen:**
- Sei präzise (nicht zu kurz, nicht zu lang)
- Beschreibe die visuelle Form, nicht die Technologie
- Nenne die Anzahl der Elemente (3 Karten, 6 Cards, etc.)

#### Phase 2 — Unterseiten auflisten

Ersetze die Platzhalter mit deinen Seiten:

```markdown
- [ ] /about — Team-Seite mit 4 Mitgliedern, Firmenggeschichte (Timeline), Mission
- [ ] /contact — Kontaktformular (Name, Email, Nachricht) + Google Maps
- [ ] /impressum — Standard-Impressum (legal, nicht designt)
- [ ] /datenschutz — DSGVO-konforme Datenschutzerklärung
```

### PROJECT_STATUS.md — Nur lesen, nicht bearbeiten

Diese Datei wird automatisch vom Agenten aktualisiert. Nach jedem Arbeitsschritt trägt er ein:
- Was er gebaut hat
- Welche Screenshots er gemacht hat
- Ob Qualitätsprüfungen bestanden sind

Du kannst sie lesen um den Fortschritt zu verfolgen. Aber:
- ❌ Nicht selbst bearbeiten
- ❌ Nicht Werte ändern
- ❌ Nicht Dateien löschen

### .brudi/state.json — Systemintern

Diese Datei speichert den aktuellen Projektstatus:

```json
{
  "mode": "BUILD",
  "phase": 0,
  "slices": {
    "slice-1": "completed",
    "slice-2": "in_progress"
  }
}
```

Du wirst sie nie direkt öffnen müssen. Falls du neugierig bist:

```bash
cat .brudi/state.json
```

---

## Teil 5: Den Agenten starten

### Checkliste vor dem Start

- [ ] Projektordner erstellt (`~/projects/studio-noir`)
- [ ] `git init` ausgeführt
- [ ] `sh ~/Brudi/use.sh` ausgeführt
- [ ] `CLAUDE.md` vollständig ausgefüllt (keine `[Platzhalter]` mehr)
- [ ] `TASK.md` angepasst (Abschnitte und Seiten benannt)

Wenn alle 5 Punkte erfüllt sind — du bist bereit.

### Der erste Befehl

Öffne Claude (oder dein KI-Interface) und stelle sicher dass es auf deinen Projektordner zugreifen kann.

Schreibe genau das:

```
Lies zuerst CLAUDE.md und TASK.md in diesem Projektordner vollständig.
Dann prüfe den State mit: cat .brudi/state.json
Dann starte mit Phase 0.
```

### Was der Agent dann macht

Der Agent folgt diesem Ablauf:

1. Liest `~/Brudi/CLAUDE.md` (sein Regelwerk)
2. Liest deine `CLAUDE.md` (dein Projekt)
3. Liest `TASK.md` (deine Aufgaben)
4. Prüft `.brudi/state.json` (aktueller Status)
5. Führt Sicherheitschecks durch
6. Startet Phase 0 (Technische Einrichtung)

Nach Phase 0 baut er die Homepage Abschnitt für Abschnitt (Slice 1, Slice 2, etc.).

Nach jedem Slice:
- Macht der Agent Screenshot (Desktop und Mobile)
- Prüft ob alles korrekt ist (Quality Gate)
- Aktualisiert `PROJECT_STATUS.md`

---

## Teil 6: Während der Arbeit — Wie du eingreifst

### Wenn dir etwas nicht gefällt

Schreib direkt dem Agent:

```
Die Services-Section gefällt mir nicht. Mach die Karten größer
und füge Icons hinzu.
```

Der Agent stoppt, nimmt die Änderung vor und zeigt dir Screenshots.

### Wenn du den Agenten stoppen möchtest

```
STOP
```

Der Agent stoppt sofort. Dann kannst du neue Anweisungen geben.

### Wenn du den Modus wechseln möchtest

```
Wechsle in den AUDIT Modus und prüfe die komplette Homepage
auf Fehler und fehlende States.
```

Die 4 Modi sind: **BUILD** (bauen), **AUDIT** (prüfen), **FIX** (beheben), **RESEARCH** (analysieren).

### Häufige Anweisungen

```
// Bereich neu bauen
Baue die Services-Section um. Ich möchte 4 Karten statt 3.

// Farbe ändern
Änder die Accentfarbe von Gold zu Teal (#0F766E).

// Animation hinzufügen / entfernen
Die Portfolio-Cards sollen bei Hover leicht nach oben schwimmen.

// Detailänderung
Der CTA-Button ist zu klein. Mach ihn größer.

// Phase springen (selten)
Wir sind mit Phase 1 fertig. Starte Phase 2 (/about Seite).
```

---

## Teil 7: Creative DNA — Was Brudi automatisch macht

Brudi bauen nicht wie generische KI-Tools. Es folgt einem System namens „Creative DNA". Das sind Standards die automatisch in jedes Projekt fließen.

### 1. Visuelle Tiefe (4-Layer System)

Jeder Bereich wird mit 4 visuellen Schichten gestaltet:

```
Layer 1: Hintergrund (dunkel)
Layer 2: Oberfläche (etwas heller)
Layer 3: Oberflächenhigh (noch heller)
Layer 4: Akzent (deine Brandfarbe)
```

Das erzeugt automatisch Tiefe — ohne dass du "Schatten" schreiben musst.

### 2. Automatische Animationen

Du musst Animationen **nicht beschreiben**. Brudi bauen sie für:

- **Entrance:** Elemente faden beim Laden ein (GSAP Timeline)
- **Hover:** Buttons und Cards reagieren auf Mausbewegung
- **Scroll-Trigger:** Große Bereiche animieren beim Scrollen
- **Page Transitions:** Elegante Übergänge zwischen Seiten

Beispiel: Wenn du nichts sagst, bekommt jede Services-Card automatisch einen Hover-Effekt und eine Entrance-Animation.

### 3. Automatische Navigation

Brudi bauen ein vollständiges Navigations-System:

- **Scroll-Indikator** — zeigt wo der User gerade ist
- **Smooth Scrolling** — elegant, nicht abrupt
- **Mobile-Menü** — auf 375px automatisch eingeklappt
- **Focus Management** — accessible Tastatur-Navigation

### 4. Mobile-First Design

Jeder Bereich wird zuerst auf 375px (iPhone) entworfen, dann auf größere Screens skaliert.

Keine schwarzen Kästchen statt Bilder. Keine verschobenen Layouts. Keine Hover-States die auf Mobile nicht funktionieren.

### 5. 4 UI-States (automatisch geprüft)

Jede Komponente hat 4 States:

- **Loading:** z.B. Spinner während Daten laden
- **Error:** z.B. "Formular konnte nicht gesendet werden"
- **Empty:** z.B. "Keine Projekte gefunden"
- **Content:** Der normale Zustand

Brudi prüft automatisch ob alle 4 States gebaut sind.

### So nutzt du Creative DNA: Reduktion statt Beschreibung

Du brauchst **nicht alles aufzuschreiben**. Wenn etwas automatisch passieren soll, musst du nur sagen, wenn es **nicht** passieren soll:

```
// Statt: "Baue einen Hover-Effekt auf den Services-Cards"
Mach: "Keine Hover-Effekte auf Services-Cards"

// Statt: "Implementiere Dark Mode"
Mach: "Wir brauchen keinen Dark Mode"

// Statt: "Baue Scroll-Animationen"
Mach: "Ich möchte keine Scroll-Animationen"
```

Reduktion ist einfacher als Beschreibung.

---

## Teil 8: Glossar — Fachbegriffe einfach erklärt

| Begriff | Erklärung |
|---------|-----------|
| **Git** | Programm das alle Änderungen protokolliert (wie ein Undo für ganze Projekte) |
| **Terminal** | Das schwarze Fenster in das du Befehle eintippst |
| **Repository** | Ein Projektordner der von Git verwaltet wird |
| **State** | Der aktuelle Status des Projekts (Phase, Modus, was ist fertig) |
| **Slice** | Ein einzelner, vollständig fertiger Abschnitt einer Seite |
| **Gate** | Kontrollpunkt den der Agent bestehen muss bevor er weitermacht |
| **Hook** | Automatischer Prüfmechanismus (z.B. vor Git Commit) |
| **Phase 0** | Technische Grundlage (Dependencies, Design System) |
| **Phase 1** | Homepage bauen (Slice für Slice) |
| **Phase 2** | Unterseiten bauen |
| **Phase 3** | Launch und Veröffentlichung |
| **Evidence** | Beweis dass ein Schritt fertig ist (z.B. Screenshots) |
| **Hero** | Großer visueller Startbereich (typisch ganz oben) |
| **CTA** | Call-to-Action (Button der eine Aktion auslöst) |
| **Overlay** | Transparente Schicht über Bild (z.B. bei Hover) |

---

## Teil 9: Fehlerbehebung — Häufige Probleme

### "git: command not found"

Git ist nicht installiert.

```bash
xcode-select --install
```

Folge den Anweisungen (dauert ca. 5 Min.). Git wird automatisch mitinstalliert.

### "Brudi ist noch nicht installiert"

Installiere Brudi:

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

### "use.sh: No such file or directory"

Das Script wurde nicht gefunden. Prüfe ob Brudi existiert:

```bash
ls ~/Brudi
```

Falls nicht → Brudi installieren (siehe oben).

### "state.json existiert bereits"

Das ist normal. Du hast `use.sh` bereits in diesem Ordner ausgeführt. Einfach weitermachen.

### "The project uses an unsupported Node version"

Node.js ist nicht installiert oder veraltete Version. Installiere die neueste LTS Version:

```bash
curl https://nodejs.org/dist/latest-v20.x/node-v20.x.x-darwin-x64.tar.xz | tar xJ
```

Oder besuche [nodejs.org](https://nodejs.org).

### Agent sagt "Gate nicht bestanden"

Das ist kein Fehler — das Sicherheitssystem funktioniert. Der Agent erklärt was fehlt. Häufige Gründe:

- Screenshot fehlt
- Mobile-Verfizierung fehlt
- Console zeigt Fehler

Der Agent sagt dir genau was zu tun ist.

### "Your local changes would be overwritten by merge"

Das passiert wenn du Dateien verändert hast die Git nicht überschreiben darf.

```bash
git stash
```

Das speichert deine Änderungen und setzt alles zurück.

### Screenshots funktionieren nicht

Agent kann Dateien nicht speichern → Ordner `screenshots/` prüfen ob er existiert.

Falls nicht:

```bash
mkdir screenshots
```

Dann Agent nochmal versuchen.

---

## Teil 10: Brudi aktualisieren

Wenn eine neue Version von Brudi erscheint:

```bash
cd ~/Brudi && git pull
```

Das war's. Keine Neuinstallation, kein Konfigurieren.

Deine bestehenden Projekte sind davon nicht betroffen — jedes hat seine eigenen Dateien.

---

**Brudi v3.3.2 — Vollständige Benutzeranleitung**
*Letzte Aktualisierung: Februar 2026*

Wenn du noch Fragen hast → öffne Claude und frag den Agent direkt. Er kennt das System und beantwortet alles.
