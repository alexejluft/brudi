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

**Ab v3.3.0:** `~/Brudi/` IST das Git-Repo. Es gibt keine Kopie, keinen Sync.
Updates laufen direkt über `cd ~/Brudi && git pull`.

---

## Schritt 1 — Brudi global installieren (einmalig)

### Option A: Automatisch (empfohlen)

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

Das Skript klont das Brudi-Repo nach `~/Brudi/`.

**Was passiert bei erneutem Ausführen?**
- Wenn `~/Brudi/` bereits ein Repo ist → `git pull` (Update)
- Wenn `~/Brudi/` existiert aber kein Repo ist (alte Version) → Backup erstellen, dann neu klonen

### Option B: Manuell

```bash
git clone https://github.com/alexejluft/brudi.git ~/Brudi
```

### Prüfen ob es funktioniert hat

```bash
ls ~/Brudi/
# Ausgabe sollte zeigen:
# AGENTS.md  CLAUDE.md  INSTALL.md  VERSION  assets/  docs/
# install.sh  orchestration/  skills/  templates/  use.sh
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
| `.brudi/state.json` | Single Source of Truth (Mode, Phase, Slices, Brudi-Version) |
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
Folgt Schritt 4: brudi-gate.sh pre-slice (Gate-Check + Version-Check)
      ↓
Arbeitet mit Mode Control, Evidence Gates, Phase Transitions
```

Bei jeder neuen Session wiederholt sich dieser Ablauf automatisch.

---

## Brudi updaten

```bash
cd ~/Brudi && git pull
```

Alle bestehenden Projekte profitieren sofort, weil sie auf `~/Brudi/` zeigen.

Bei großen Versionssprüngen prüft `brudi-gate.sh pre-slice` automatisch,
ob die installierte Version zur Projektversion passt und warnt bei Drift.

---

## Struktur nach der Installation

```
~/Brudi/                     ← Brudi global (= Git-Repo)
├── AGENTS.md                 ← Master-Identität (alle Agents)
├── CLAUDE.md                 ← Master-Identität (Claude Code)
├── INSTALL.md                ← Diese Datei
├── VERSION                   ← Aktuelle Version (z.B. 3.3.0)
├── install.sh                ← Global-Installer (git clone)
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
│   └── state.json             ← Mode, Phase, Slices, Brudi-Version (SSOT)
├── screenshots/               ← Evidence-Screenshots
└── src/...
```

---

## Breaking Change: v3.3.0

Ab v3.3.0 ist `~/Brudi/` direkt das Git-Repo. Die alte Kopier-basierte
Installation (mit `cp -r` und Sync-Hooks) wird nicht mehr unterstützt.

**Was ändert sich?**
- `install.sh` klont jetzt das Repo statt Dateien zu kopieren
- Sync-Mechanismen (post-merge Hook, LaunchAgent) sind nicht mehr nötig
- Updates laufen über `cd ~/Brudi && git pull`

**Bestehende Installationen:** Das install.sh erkennt alte Kopie-Installationen
(kein `.git/` Verzeichnis), erstellt ein Backup und installiert neu als Repo.
