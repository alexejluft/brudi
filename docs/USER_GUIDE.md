# Brudi — Vollständige Benutzeranleitung

> Diese Anleitung erklärt alles was du über Brudi wissen musst — ausführlich, ohne Fachbegriffe, mit allen Details.
> Für den schnellen Einstieg lies zuerst `~/Brudi/START_HERE.md`.

---

## Was ist Brudi?

Stell dir vor, du hast einen sehr fähigen Handwerker, der aber noch nie in deiner Stadt gearbeitet hat. Bevor er anfängt, musst du ihm erklären: Was baust du? Wie soll es aussehen? Welche Materialien? Welche Qualität?

Brudi ist genau das — das **Briefing-Dokument für deinen KI-Agenten**. Es erklärt dem Agenten wer du bist, wie du arbeitest, was du baust und welchen Qualitätsanspruch du hast.

Ohne Brudi baut der Agent generisch. Mit Brudi baut er auf deinem Level.

---

## Wie Brudi funktioniert — das große Bild

```
~/Brudi/          ← Das Framework (einmalig installiert, nie verändert)
    CLAUDE.md     ← Alex's Identität und Standards (Regelwerk für Agenten)
    skills/       ← Spezialisiertes Wissen für verschiedene Aufgaben
    templates/    ← Vorlagen für neue Projekte
    use.sh        ← Verbindet ein neues Projekt mit Brudi

~/projects/studio-noir/    ← Dein Projekt (hier arbeitest du)
    CLAUDE.md     ← Projektbeschreibung (DU füllst das aus)
    TASK.md       ← Aufgabenliste (DU beschreibst was gebaut wird)
    PROJECT_STATUS.md  ← Fortschrittsprotokoll (Agent führt das)
    .brudi/       ← Interne Statusdaten (System verwaltet das)
```

**Die wichtige Trennung:**
- `~/Brudi/` ist das Framework — es gehört dir, aber du veränderst es nicht
- Dein Projektordner ist dein Arbeitsbereich — hier legst du fest was gebaut wird

---

## Erste Schritte nach der Installation

### Voraussetzungen prüfen

Öffne das Terminal (Mac: Programme → Dienstprogramme → Terminal) und prüfe:

```bash
git --version
```

Wenn du `git version 2.x.x` siehst — alles gut. Wenn du eine Fehlermeldung siehst:

```bash
xcode-select --install
```

### Brudi-Version prüfen

```bash
cat ~/Brudi/VERSION
```

Das zeigt dir die installierte Brudi-Version. Wenn du Brudi aktualisieren möchtest:

```bash
cd ~/Brudi && git pull
```

---

## Ein neues Projekt anlegen — vollständige Anleitung

### Schritt 1: Projektordner erstellen

Erstelle im Finder einen neuen Ordner. Empfohlener Ort: `~/projects/`

**Namensregeln:**
- Nur Kleinbuchstaben
- Bindestriche statt Leerzeichen
- Keine Sonderzeichen, Umlaute oder Ausrufezeichen

Beispiele:
```
✅ studio-noir
✅ meine_website
✅ fairsplit-app
❌ Studio Noir
❌ Meine Website!
❌ Büro-Website
```

### Schritt 2: Terminal in den Ordner bringen

```bash
cd ~/projects/studio-noir
```

**Tipp — Drag & Drop statt Tippen:**
Tippe `cd ` (mit Leerzeichen), dann ziehe den Ordner aus dem Finder direkt ins Terminal-Fenster. Der Pfad wird automatisch eingesetzt. Enter drücken.

Du erkennst, dass du im richtigen Ordner bist, wenn der Ordnername in der Terminal-Zeile steht.

### Schritt 3: Git initialisieren

```bash
git init
```

Git ist das Versionierungssystem das den Fortschritt protokolliert. Dieser Befehl erstellt einen versteckten `.git/` Ordner in deinem Projekt — das ist das „Gedächtnis" des Projekts.

Du musst `git init` nur einmal pro Projekt ausführen.

### Schritt 4: Brudi verbinden

```bash
sh ~/Brudi/use.sh
```

Dieser Befehl erstellt alle notwendigen Dateien für dein Projekt. Du siehst eine Übersicht was erstellt wurde.

---

## Die Projektdateien im Detail

### CLAUDE.md — Das Herzstück

Diese Datei ist die wichtigste. Sie erklärt dem Agenten:
- Was er bauen soll
- Für wen
- Mit welchen Farben und Schriften
- Welche Seiten die Website haben soll

**Wie du sie ausfüllst:**
Öffne `CLAUDE.md` in einem Texteditor. Du siehst viele Abschnitte mit Kommentaren in `<!-- ... -->` Klammern — das sind Erklärungen die du lesen, aber nicht behalten musst. Darunter stehen Platzhalter in `[eckigen Klammern]`. Diese Platzhalter ersetzt du.

**Abschnitt 1 — Was ist das Projekt?**

```markdown
[Hier beschreiben: Was wird gebaut und für wen?]
```

Ersetze durch z.B.:
```
Eine Portfolio-Website für Studio Noir, eine Berliner Designagentur
die sich auf Brand Identity für Luxusmarken spezialisiert hat.
```

**Abschnitt 2 — Zielgruppe**

```markdown
[Hier beschreiben: Wer sind die Nutzer?]
```

Ersetze durch z.B.:
```
Unternehmen ab 50 Mitarbeitern, die eine neue Brand-Identity suchen.
Primär auf Desktop — aber Mobile muss einwandfrei funktionieren.
```

**Abschnitt 3 — Farben**

Trage Hex-Codes ein. Wenn du keine eigenen Farben hast:
→ [coolors.co](https://coolors.co) → Palette generieren → Codes übertragen

```markdown
- **Accent:** [#D4AF37]          ← deine Hauptfarbe (z.B. Gold)
- **Background dark:** [#0A0A0A] ← kannst du so lassen
```

**Abschnitt 4 — Typografie**

Wähle eine Headline-Schrift und eine Fließtext-Schrift aus:

| Schrift | Charakter | Gut für |
|---------|-----------|---------|
| Clash Display | Geometrisch, modern | Agenturen, Tech |
| Satoshi | Sauber, universell | Fast alles |
| General Sans | Neutral, professionell | B2B, SaaS |
| Cabinet Grotesk | Charakterstark | Kreative Branchen |
| Switzer | Elegant, schlank | Luxury, Mode |

**Abschnitt 5 — Seiten**

Liste alle Seiten auf die die Website haben soll:

```markdown
- `/` — Home: Startseite mit Hero, Leistungen, Referenzen, Kontakt
- `/about` — Über uns: Team-Fotos und Geschichte
- `/work` — Portfolio: Übersicht aller Projekte
- `/contact` — Kontakt: Formular + Adresse
- `/impressum` — Pflichtseite (Deutsch)
- `/datenschutz` — Pflichtseite (DSGVO)
```

**Was du NICHT anfassen musst:**
Alles unter „Tier-1 Orchestrierung", „Mode Control", „Hard Gates" — das sind technische Anweisungen für den Agenten. Lass sie unverändert.

---

### TASK.md — Die Aufgabenliste

`TASK.md` sagt dem Agenten was er Schritt für Schritt bauen soll. Brudi unterteilt jedes Projekt in Phasen:

**Phase 0: Foundation** — technische Einrichtung (macht der Agent selbst)
**Phase 1: Homepage** — jeder Abschnitt der Startseite, einzeln und vollständig
**Phase 2: Unterseiten** — alle weiteren Seiten

Du musst in Phase 1 und Phase 2 die Platzhalter durch deine Abschnitte ersetzen.

**Phase 1 — Abschnitte der Homepage benennen:**

Vorher (Platzhalter):
```markdown
- [ ] Slice 3: [Section Name] — [Beschreibung]
- [ ] Slice 4: [Section Name] — [Beschreibung]
- [ ] Slice 5: [Section Name] — [Beschreibung]
```

Nachher (deine Abschnitte):
```markdown
- [ ] Slice 3: Services — Drei Leistungskarten: Branding, Web, Print
- [ ] Slice 4: Portfolio — 6 Projektvorschauen mit Hover-Overlay
- [ ] Slice 5: Testimonials — 3 Kundenstimmen mit Foto
```

**Phase 2 — Unterseiten eintragen:**

```markdown
- [ ] /about — Team-Seite mit 4 Mitgliedern und kurzer Bio
- [ ] /contact — Kontaktformular + Google Maps Einbindung
- [ ] /impressum — Standard-Impressum
- [ ] /datenschutz — DSGVO-konforme Datenschutzerklärung
```

---

### PROJECT_STATUS.md — Nur lesen, nicht bearbeiten

Diese Datei wird automatisch vom Agenten aktualisiert. Nach jedem Arbeitsschritt trägt der Agent ein:
- Was er gebaut hat
- Welche Screenshots er gemacht hat
- Ob alle Qualitätsprüfungen bestanden wurden

Du kannst sie lesen um den Fortschritt zu verfolgen. Aber du musst — und sollst — sie nicht selbst bearbeiten.

---

### .brudi/state.json — Systemintern

Diese Datei speichert den aktuellen Projektstatus:
- In welchem Modus der Agent arbeitet (BUILD, AUDIT, FIX)
- In welcher Phase das Projekt ist (0, 1, 2, 3)
- Welche Abschnitte bereits abgeschlossen sind

Du wirst sie nie direkt öffnen müssen. Wenn du neugierig bist, kannst du sie im Terminal anschauen:

```bash
cat .brudi/state.json
```

---

## Den KI-Agenten starten

### Vorbereitung — Checkliste

Bevor du den Agenten startest, prüfe:

- [ ] Projektordner existiert
- [ ] `git init` wurde ausgeführt
- [ ] `sh ~/Brudi/use.sh` wurde ausgeführt
- [ ] `CLAUDE.md` ist ausgefüllt (keine `[Platzhalter]` mehr)
- [ ] `TASK.md` ist angepasst (Abschnitte und Seiten benannt)

Wenn alle 5 Punkte erfüllt sind — du bist bereit.

### Der erste Auftrag

Schreibe dem Agenten genau das:

```
Lies zuerst CLAUDE.md und TASK.md in diesem Projektordner vollständig.
Dann prüfe den State mit: cat .brudi/state.json
Dann starte mit Phase 0.
```

### Was der Agent dann tut

Der Agent folgt einem festen Ablauf den Brudi vorschreibt:

1. Liest `~/Brudi/CLAUDE.md` (sein Regelwerk)
2. Liest deine `CLAUDE.md` (dein Projekt)
3. Liest `TASK.md` (die Aufgaben)
4. Prüft den aktuellen Status
5. Führt einen Sicherheitscheck durch
6. Beginnt mit Phase 0 (technische Einrichtung)

Nach Phase 0 baut er die Homepage Abschnitt für Abschnitt. Nach jedem Abschnitt:
- Macht er einen Screenshot (Desktop und Mobile)
- Prüft ob alles korrekt ist
- Dokumentiert den Fortschritt

### Wie du während der Arbeit eingreifst

**Wenn dir etwas nicht gefällt:**
Schreib direkt was du ändern möchtest. Zum Beispiel:
```
Die Farbe des Headers gefällt mir nicht. Mach ihn dunkler.
```

**Wenn du den Agenten stoppen möchtest:**
```
STOP
```

**Wenn du eine Änderung an einer bestimmten Datei möchtest:**
```
Öffne TASK.md und füge nach Slice 4 einen neuen Slice für den Newsletter hinzu.
```

**Wenn du den Modus wechseln möchtest:**
```
Wechsle in den AUDIT Modus und prüfe die Homepage auf Fehler.
```

---

## Die vier Arbeitsmodi

Brudi kennt vier verschiedene Modi in denen der Agent arbeitet:

| Modus | Was der Agent macht | Was er NICHT darf |
|-------|--------------------|--------------------|
| **BUILD** | Neues bauen, Code schreiben | Bestehenden Code prüfen ohne Auftrag |
| **AUDIT** | Bestehendes prüfen und Bericht schreiben | Code verändern |
| **FIX** | Genannte Fehler beheben | Neue Features, Umstrukturierungen |
| **RESEARCH** | Analyse erstellen | Code ändern |

Den Modus bestimmst immer du — nie der Agent alleine.

---

## Brudi aktuell halten

Wenn eine neue Version von Brudi erscheint:

```bash
cd ~/Brudi && git pull
```

Das war's. Keine Neuinstallation, kein Löschen. Git holt die neueste Version automatisch.

Deine bestehenden Projekte sind davon nicht betroffen — jedes Projekt hat seine eigenen Dateien.

---

## Glossar — Fachbegriffe einfach erklärt

| Begriff | Was es bedeutet |
|---------|-----------------|
| **Git** | Programm das alle Änderungen protokolliert, wie ein Zeitprotokoll für Dateien |
| **Terminal** | Das schwarze Fenster in das du Befehle eintippst |
| **Repository / Repo** | Ein Projektordner der von Git verwaltet wird |
| **State** | Der aktuelle Zustand des Projekts (Phase, Modus, Fortschritt) |
| **Slice** | Ein einzelner, vollständig fertiggestellter Abschnitt der Website |
| **Gate** | Ein Kontrollpunkt den der Agent bestehen muss bevor er weitermacht |
| **Hook** | Ein automatischer Prüfmechanismus der bei bestimmten Aktionen ausgelöst wird |
| **Phase 0** | Technische Grundlage: Abhängigkeiten installieren, Design-System aufsetzen |
| **Phase 1** | Homepage bauen, Abschnitt für Abschnitt |
| **Phase 2** | Unterseiten bauen |
| **Phase 3** | Veröffentlichung und Launch |
| **Evidence** | Beweise dass ein Schritt wirklich abgeschlossen ist (z.B. Screenshots) |

---

*Brudi v3.3.2 — Benutzeranleitung*
*Letzte Aktualisierung: 2026-02-23*
