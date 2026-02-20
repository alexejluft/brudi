# Brudi installieren und verwenden

---

## Das Konzept — lies das zuerst

Brudi funktioniert in zwei Schritten:

```
Schritt 1 (einmalig):   Brudi global auf deinen PC laden → ~/.brudi/
Schritt 2 (pro Projekt): Projekt mit Brudi verbinden → AGENTS.md / CLAUDE.md
```

**Warum zwei Schritte?**
Brudi liegt einmal auf deinem PC (`~/.brudi/`). Jedes Projekt bekommt
eine kleine Datei (AGENTS.md), die deinem KI-Agenten sagt: "Lies Brudi."
`~` bedeutet immer dein Home-Verzeichnis — das funktioniert auf jedem Mac,
jedem Linux-PC, ohne absoluten Pfad, ohne Anpassung.

---

## Schritt 1 — Brudi global installieren (einmalig)

### Option A: Automatisch (empfohlen)

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh
```

Brudi landet danach in: `~/.brudi/`

### Option B: Manuell (wenn du Brudi bereits heruntergeladen hast)

Du hast Brudi irgendwo auf deinem PC, z.B. unter:
`~/Downloads/brudi/` oder `/projects/brudi/`

Dann einfach den `skills/` Ordner nach `~/.brudi/` kopieren:

```bash
cp -r /pfad/zu/brudi/skills/ ~/.brudi/
```

Beispiel wenn Brudi unter `/AI/Brudi Workspace/projects/brudi/` liegt:

```bash
cp -r "/AI/Brudi Workspace/projects/brudi/skills/" ~/.brudi/
```

### Prüfen ob es funktioniert hat

```bash
ls ~/.brudi/
# Ausgabe sollte zeigen: AGENTS.md  CLAUDE.md  INSTALL.md  skills/  use.sh
```

---

## Schritt 2 — Projekt mit Brudi verbinden (pro Projekt)

### Option A: Automatisch

```bash
cd ~/projects/fairsplit      # in den Projektordner wechseln
sh ~/.brudi/use.sh           # Brudi verbinden
```

Das Skript legt `AGENTS.md` und `CLAUDE.md` im Projektordner an.
Fertig. Dein KI-Agent liest diese Dateien ab jetzt automatisch.

### Option B: Manuell (du legst die Datei selbst an)

Erstelle eine Datei `AGENTS.md` in deinem Projektordner mit diesem Inhalt:

```markdown
# Arbeitsanweisungen

Lies vor dem Start vollständig:
- ~/.brudi/AGENTS.md         ← Standards, Stack, Anti-Patterns
- ~/.brudi/CLAUDE.md         ← Dasselbe für Claude Code

Skills bei Bedarf laden aus: ~/.brudi/skills/[skill-name]/SKILL.md
```

Für Claude Code zusätzlich `CLAUDE.md` im Projektordner:

```markdown
Lies vor dem Start: ~/.brudi/CLAUDE.md
Skills: ~/.brudi/skills/[skill-name]/SKILL.md
```

---

## Was passiert danach?

```
KI-Agent startet im Projektordner fairsplit/
      ↓
Liest AGENTS.md (oder CLAUDE.md)
      ↓
Folgt der Anweisung: liest ~/.brudi/AGENTS.md
      ↓
Weiß: Alex's Stack, Standards, Anti-Patterns, Workflow
      ↓
Arbeitet sofort korrekt — ohne Erklärungen, ohne Korrekturen
```

Bei jeder neuen Session wiederholt sich dieser Ablauf automatisch.
Das löst das Gedächtnis-Problem von KI-Agenten.

---

## Szenarien

### "Ich starte ein neues Projekt und will dass mein Agent sofort richtig arbeitet"

```bash
mkdir ~/projects/fairsplit
cd ~/projects/fairsplit
sh ~/.brudi/use.sh
# → Agent kann sofort starten
```

### "Mein Agent soll Brudi selbst installieren"

Sag deinem Agent:

> Installiere Brudi. Es liegt unter [Pfad zu brudi/skills/] auf diesem PC.
> Kopiere es nach ~/.brudi/ und führe dann use.sh im aktuellen Projektordner aus.

Der Agent führt diese zwei Befehle aus:
```bash
cp -r /pfad/zu/brudi/skills/ ~/.brudi/
sh ~/.brudi/use.sh
```

### "Ich habe Brudi von GitHub heruntergeladen und will es manuell einrichten"

```bash
# Brudi liegt z.B. in ~/Downloads/brudi/
cp -r ~/Downloads/brudi/skills/ ~/.brudi/
cd ~/projects/mein-projekt
sh ~/.brudi/use.sh
```

### "Ich will Brudi updaten"

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh
# Bestätigung mit "j" → Brudi wird neu installiert
# Alle Projekte profitieren sofort, weil sie auf ~/.brudi/ zeigen
```

---

## Struktur nach der Installation

```
~/.brudi/                   ← Brudi global (einmalig)
├── AGENTS.md               ← Master-Identität (alle Agents)
├── CLAUDE.md               ← Master-Identität (Claude Code)
├── INSTALL.md              ← Diese Datei
├── install.sh              ← Global-Installer
├── use.sh                  ← Projekt-Verbinder
└── skills/
    ├── building-layouts/
    ├── designing-for-awards/
    ├── animating-interfaces/
    ├── developing-with-react/
    ├── typing-with-typescript/
    ├── testing-user-interfaces/
    ├── optimizing-performance/
    ├── building-accessibly/
    ├── designing-with-perception/
    ├── designing-for-mobile/
    ├── handling-ui-states/
    ├── orchestrating-gsap-lenis/
    ├── orchestrating-react-animations/
    └── starting-a-project/

~/projects/fairsplit/       ← Dein Projekt (pro Projekt)
├── AGENTS.md               ← Zeigt auf ~/.brudi/AGENTS.md
├── CLAUDE.md               ← Zeigt auf ~/.brudi/CLAUDE.md
└── src/...
```
