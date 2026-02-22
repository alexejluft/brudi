# BOOTSTRAP — Wenn du hier neu bist

**Projekt:** brudi — Award-level Working Identity für AI Agents

**Pfad:** `/Users/alexejluft/AI/Brudi Workspace/projects/brudi/skills/`

**Übergeordnet:** Lies zuerst `projects/brudi/README.md` für Gesamtübersicht

---

## Was ist das?

Brudi ist kein Skill-Paket. Brudi ist eine **vollständige Arbeits-Identität** für KI-Agenten.

Nach der Installation versteht eine KI sofort: Alex's Qualitätsstandards, Tech-Stack, Workflow, und was AI-Slop ist.

## Wie es installiert wird

```bash
# Claude Code
git clone https://github.com/alexejluft/brudi.git .claude/skills/brudi
# Dann in CLAUDE.md: @.claude/skills/brudi/CLAUDE.md

# Cursor / andere Agents
git clone https://github.com/alexejluft/brudi.git .agent/brudi
# Dann in AGENTS.md oder .cursorrules referenzieren
```

## Einstiegspunkte (NEU)

```
brudi/
├── CLAUDE.md           ← Für Claude Code (liest das zuerst)
├── AGENTS.md           ← Für alle anderen Agents
├── BOOTSTRAP.md        ← DU BIST HIER
├── README.md           ← Öffentliche Beschreibung
├── LICENSE             ← MIT
├── docs/
│   ├── philosophy.md
│   ├── contributing.md
│   ├── testing/        ← Pressure Test Scenarios
│   └── internal/       ← Pläne & Learnings
│       ├── MASTERPLAN.md
│       ├── SKILL_LEARNINGS.md
│       ├── SKILL_EVOLUTION.md
│       └── SKILL_WORKPLAN.md
└── skills/             ← 14 Skills
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
```

## Quick Start

1. Lies `docs/internal/MASTERPLAN.md` für den Gesamtplan
2. Lies `docs/internal/SKILL_LEARNINGS.md` für kritische Erkenntnisse
3. Skills sind in `skills/*/SKILL.md`
4. Einstiegspunkte: `CLAUDE.md` (Claude) / `AGENTS.md` (andere)

## Status

**Version:** 0.3.0
**Stand:** 2026-02-20
**Phase:** 14 Skills, installierbar via CLAUDE.md / AGENTS.md

## Regeln

- **TDD für Skills:** Kein Skill ohne Pressure Test
- **<120 Zeilen:** Skills müssen kompakt sein
- **"Use when...":** Descriptions triggern, nicht beschreiben
- **Verb-first:** building-, designing-, orchestrating-
- **Orchestrierungs-Reihenfolge:** Bei Library-Kombinationen immer dokumentieren

---

*Alles was du über dieses Projekt wissen musst ist in diesem Ordner.*
