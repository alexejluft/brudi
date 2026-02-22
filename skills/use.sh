#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Projekt-Verbinder
#
# Was dieses Skript macht:
#   Legt eine AGENTS.md im aktuellen Projektordner an.
#   Diese Datei zeigt auf ~/Brudi/ und wird von jedem KI-Agenten
#   automatisch gelesen wenn er in diesem Ordner arbeitet.
#
# Verwendung:
#   cd ~/projects/fairsplit
#   sh ~/Brudi/use.sh
# -----------------------------------------------------------------------------

BRUDI_DIR="${HOME}/Brudi"
PROJECT_DIR="${PWD}"
AGENTS_FILE="${PROJECT_DIR}/AGENTS.md"
CLAUDE_FILE="${PROJECT_DIR}/CLAUDE.md"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo "  Brudi — Projekt verbinden"
echo "  -------------------------"
echo "  Projektordner: ${PROJECT_DIR}"
echo ""

# --- Brudi vorhanden? ---------------------------------------------------------

if [ ! -d "${BRUDI_DIR}" ]; then
  echo "  ✗ Brudi ist noch nicht global installiert."
  echo ""
  echo "  Installiere zuerst Brudi:"
  echo "  curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh"
  echo ""
  exit 1
fi

# --- AGENTS.md anlegen --------------------------------------------------------

if [ -f "${AGENTS_FILE}" ]; then
  if grep -qF "brudi" "${AGENTS_FILE}"; then
    echo "${YELLOW}  ! AGENTS.md enthält bereits eine Brudi-Referenz — wird nicht überschrieben.${RESET}"
    AGENTS_DONE=1
  fi
fi

if [ -z "${AGENTS_DONE}" ]; then
  cat > "${AGENTS_FILE}" << EOF
# Arbeitsanweisungen für dieses Projekt

## Brudi — Pflichtlektüre vor dem Start

Bevor du irgendetwas in diesem Projekt tust, lies folgende Dateien vollständig:

1. ~/Brudi/AGENTS.md       ← Wer Alex ist, sein Stack, seine Standards
2. ~/Brudi/CLAUDE.md       ← Dasselbe, optimiert für Claude Code

Die Skills (Detailwissen) liegen in: ~/Brudi/skills/[skill-name]/SKILL.md
Lade den passenden Skill wenn du an dem jeweiligen Thema arbeitest.

## Projektname

$(basename "${PROJECT_DIR}")

## Wichtig

Dieses Projekt folgt den Brudi-Standards. Kein AI-Slop. Award-Level oder nichts.
EOF
  echo "${GREEN}  ✓ AGENTS.md erstellt${RESET}"
fi

# --- CLAUDE.md anlegen (für Claude Code) --------------------------------------

if [ -f "${CLAUDE_FILE}" ]; then
  if grep -qF "brudi" "${CLAUDE_FILE}"; then
    echo "${YELLOW}  ! CLAUDE.md enthält bereits eine Brudi-Referenz — wird nicht überschrieben.${RESET}"
    CLAUDE_DONE=1
  fi
fi

if [ -z "${CLAUDE_DONE}" ]; then
  cat > "${CLAUDE_FILE}" << EOF
# Arbeitsanweisungen für dieses Projekt

Lies vor dem Start vollständig:
- ~/Brudi/CLAUDE.md   ← Wer Alex ist, Standards, Stack, Anti-Patterns
- Passende Skills aus ~/Brudi/skills/[skill-name]/SKILL.md laden wenn nötig

Projektname: $(basename "${PROJECT_DIR}")
EOF
  echo "${GREEN}  ✓ CLAUDE.md erstellt${RESET}"
fi

# --- Fertig -------------------------------------------------------------------

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  Projekt verbunden!                              │"
echo "  │                                                  │"
echo "  │  Wenn dein KI-Agent jetzt in diesem Ordner      │"
echo "  │  startet, liest er automatisch:                  │"
echo "  │    → AGENTS.md  (alle Agents)                   │"
echo "  │    → CLAUDE.md  (Claude Code)                   │"
echo "  │                                                  │"
echo "  │  Beide zeigen auf ~/Brudi/ — das funktioniert  │"
echo "  │  auf jedem Mac, unabhängig vom Installationspfad│"
echo "  └─────────────────────────────────────────────────┘"
echo ""
