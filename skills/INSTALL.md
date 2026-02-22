# Brudi installieren und verwenden

---

## Das Konzept — lies das zuerst

Brudi funktioniert in zwei Schritten:

```
Schritt 1 (einmalig):   Brudi global auf deinen PC laden → ~/Brudi/
Schritt 2 (pro Projekt): Projekt mit Brudi verbinden → use.sh
```

**Warum zwei Schritte?**
Brudi liegt einmal auf deinem PC (`~/Brudi/`). Jedes Projekt bekommt
Startdateien (AGENTS.md, CLAUDE.md, TASK.md, state.json), die deinem
KI-Agenten sagen: "Lies Brudi und befolge die Regeln."
`~` bedeutet immer dein Home-Verzeichnis — das funktioniert auf jedem Mac,
jedem Linux-PC, ohne absoluten Pfad, ohne Anpassung.

---

## Schritt 1 — Brudi global installieren (einmalig)

### Option A: Automatisch (empfohlen)

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh
```

Brudi landet danach in: `~/Brudi/`

### Option B: Manuell (wenn du Brudi bereits heruntergeladen hast)

Du hast Brudi irgendwo auf deinem PC, z.B. unter:
`~/Downloads/brudi/` oder `/projects/brudi/`

Dann einfach den `skills/` Ordner nach `~/Brudi/` kopieren:

```bash
cp -r /pfad/zu/brudi/skills/ ~/Brudi/
```

### Prüfen ob es funktioniert hat

```bash
ls ~/Brudi/
# Ausgabe sollte zeigen:
# AGENTS.md  CLAUDE.md  INSTALL.md  assets/  docs/  install.sh
# orchestration/  skills/  templates/  use.sh
```

---

## Schritt 2 — Projekt mit Brudi verbinden (pro Projekt)

### Option A: Automatisch (empfohlen)

```bash
cd ~/projects/fairsplit      # in den Projektordner wechseln
sh ~/Brudi/use.sh           # Brudi verbinden
```

Das Skript erstellt:

| Datei | Funktion |
|-------|----------|
| `AGENTS.md` | Arbeitsanweisungen (zeigt auf ~/Brudi/) |
| `CLAUDE.md` | Projekt-Context + Tier-1 Regeln (aus Template) |
| `TASK.md` | Aufgaben-Template mit Phase 0 |
| `PROJECT_STATUS.md` | Status-Tracking mit Evidence-Tabellen |
| `.brudi/state.json` | Single Source of Truth (Mode, Phase, Slices) |
| `screenshots/` | Evidence-Verzeichnis |
| `.git/hooks/pre-commit` | Gate-Enforcement (blockiert bei Fehlern) |

### Option B: Manuell

Erstelle eine Datei `AGENTS.md` in deinem Projektordner mit diesem Inhalt:

```markdown
# Arbeitsanweisungen

Lies vor dem Start vollständig:
- ~/Brudi/AGENTS.md         ← Standards, Stack, Anti-Patterns
- ~/Brudi/CLAUDE.md         ← Dasselbe für Claude Code

Skills bei Bedarf laden aus: ~/Brudi/skills/[skill-name]/SKILL.md
```

---

## Was passiert danach?

```
KI-Agent startet im Projektordner fairsplit/
      ↓
Liest CLAUDE.md (Projekt-Context + Tier-1 Regeln)
      ↓
Folgt Schritt 1: liest ~/Brudi/CLAUDE.md (vollständige Identität)
      ↓
Folgt Schritt 2: cat .brudi/state.json (aktueller Mode + Phase)
      ↓
Folgt Schritt 3: liest TASK.md (aktuelle Aufgabe)
      ↓
Folgt Schritt 4: brudi-gate.sh pre-slice (Gate-Check)
      ↓
Arbeitet mit Mode Control, Evidence Gates, Phase Transitions
```

Bei jeder neuen Session wiederholt sich dieser Ablauf automatisch.

---

## Automatische Updates (für Brudi-Entwickler)

Wenn du am Brudi-Repo selbst arbeitest, kannst du automatische Sync einrichten:

```bash
cd /pfad/zum/brudi-repo
bash scripts/setup-brudi.sh
```

Das installiert:

| Mechanismus | Trigger | Funktion |
|-------------|---------|----------|
| `post-commit` Hook | Nach jedem Commit | Synct sofort nach ~/Brudi/ |
| `post-merge` Hook | Nach jedem `git pull` | Synct sofort nach ~/Brudi/ |
| LaunchAgent | Alle 15 Minuten | Auto `git pull` + Sync |

Alternativ nur die Git-Hooks (ohne LaunchAgent):

```bash
bash scripts/setup-hooks.sh
```

---

## Struktur nach der Installation

```
~/Brudi/                     ← Brudi global (einmalig)
├── AGENTS.md                 ← Master-Identität (alle Agents)
├── CLAUDE.md                 ← Master-Identität (Claude Code)
├── INSTALL.md                ← Diese Datei
├── install.sh                ← Global-Installer
├── use.sh                    ← Projekt-Verbinder
├── skills/                   ← Detailwissen pro Thema
│   ├── building-layouts/
│   ├── designing-for-awards/
│   ├── animating-interfaces/
│   ├── verifying-ui-quality/
│   └── ...
├── templates/                ← Projekt-Templates
│   ├── CLAUDE.md             ← Projekt-Context Template
│   ├── TASK.md               ← Aufgaben-Template
│   └── PROJECT_STATUS.md     ← Status-Template
├── orchestration/            ← Tier-1 Gate-Enforcement
│   ├── brudi-gate.sh         ← Gate Runner (5 Subcommands)
│   ├── pre-commit            ← Git Pre-Commit Hook
│   ├── state.init.json       ← Initialer State
│   └── state.schema.json     ← Schema-Validierung
├── assets/                   ← Fonts, i18n, Legal, Configs
│   └── INDEX.md
└── docs/                     ← Interne Dokumentation

~/projects/fairsplit/          ← Dein Projekt (pro Projekt)
├── AGENTS.md                  ← Zeigt auf ~/Brudi/AGENTS.md
├── CLAUDE.md                  ← Projekt-Context (aus Template)
├── TASK.md                    ← Aktuelle Aufgabe
├── PROJECT_STATUS.md          ← Status mit Evidence
├── .brudi/
│   └── state.json             ← Mode, Phase, Slices (SSOT)
├── screenshots/               ← Evidence-Screenshots
└── src/...
```

---

## Brudi updaten

```bash
# Option A: Installer erneut ausführen
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh

# Option B: Manuell (wenn du das Repo hast)
cd /pfad/zum/brudi-repo && git pull
# → post-merge Hook synct automatisch nach ~/Brudi/
```

Alle bestehenden Projekte profitieren sofort, weil sie auf `~/Brudi/` zeigen.
