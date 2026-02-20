# Plan: Klare Installationsstrategie für Brudi

## Das eigentliche Problem

Das aktuelle install.sh hat einen Denkfehler:
- Es läuft "wo man es ausführt" — das ist nicht definiert
- Es versucht Agent-Erkennung, Global-Install und Projekt-Setup gleichzeitig
- Kein Nutzer versteht danach wirklich was passiert ist

## Zwei unvermeidbare Schritte (immer)

```
Schritt 1 (einmalig, global):   Brudi auf den PC laden → ~/.brudi/
Schritt 2 (pro Projekt):        Projekt-Ordner mit Brudi verbinden → CLAUDE.md / AGENTS.md
```

Diese Trennung ist die Lösung. Zwei Skripte, zwei klare Aufgaben.

## Was gebaut wird

### 1. install.sh — Nur globale Installation

Macht genau eine Sache: klont Brudi nach `~/.brudi/`

```bash
curl -fsSL .../install.sh | sh
# → Brudi liegt danach in ~/.brudi/
# → Fertig. Kein Projekt berührt.
```

### 2. ~/.brudi/use.sh — Projekt verbinden

Man läuft dieses Skript IM Projektordner:

```bash
cd ~/projects/fairsplit
sh ~/.brudi/use.sh
# → Legt CLAUDE.md und/oder AGENTS.md an
# → Fertig.
```

### 3. INSTALL.md — Klartext-Anleitung

Ersetzt alle Installations-Erklärungen in README.md mit einer einzigen, ehrlichen Anleitung die alle 3 Szenarien abdeckt:

- Szenario A: Noch kein Agent → Global installieren, später verbinden
- Szenario B: Claude Code / OpenClaw / Cursor vorhanden
- Szenario C: KI-Agent soll selbst installieren (Anweisung die man dem Agent gibt)

### 4. install.sh vereinfachen

Altes install.sh: 159 Zeilen, verwirrt.
Neues install.sh: ~40 Zeilen, macht nur eine Sache.

## Was NICHT gemacht wird

- Kein Auto-detect von Agents (zu fragil, zu verwirrend)
- Kein Versuch alles in einem Skript zu lösen
- Keine Annahmen darüber wo ein Projekt liegt

## Ergebnis

Nach dieser Änderung kann Alex einem KI-Agenten sagen:
"Wir starten FairSplit. Installiere Brudi und dann fang an."

Der Agent führt aus:
1. `curl ... | sh`  → Brudi global installiert
2. `sh ~/.brudi/use.sh` → Projekt verbunden
3. Liest CLAUDE.md → Weiß alles
