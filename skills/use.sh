#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Projekt-Verbinder (v3.2 + Tier-1 Orchestrierung)
#
# Was dieses Skript macht:
#   1. Legt AGENTS.md + CLAUDE.md im Projektordner an (zeigen auf ~/Brudi/)
#   2. Erstellt .brudi/ mit state.json (Single Source of Truth)
#   3. Erstellt screenshots/ Verzeichnis für Evidence
#   4. Installiert pre-commit Hook (blockiert Commits bei Gate-Fehlern)
#   5. Kopiert Templates (TASK.md, PROJECT_STATUS.md) wenn nicht vorhanden
#
# Verwendung:
#   cd ~/projects/fairsplit
#   sh ~/Brudi/use.sh
# -----------------------------------------------------------------------------

BRUDI_DIR="${HOME}/Brudi"
PROJECT_DIR="${PWD}"
PROJECT_NAME="$(basename "${PROJECT_DIR}")"
AGENTS_FILE="${PROJECT_DIR}/AGENTS.md"
CLAUDE_FILE="${PROJECT_DIR}/CLAUDE.md"
BRUDI_LOCAL="${PROJECT_DIR}/.brudi"
STATE_FILE="${BRUDI_LOCAL}/state.json"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo "  Brudi — Projekt verbinden (Tier-1)"
echo "  ────────────────────────────────────"
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

# --- .brudi/ Verzeichnis + state.json ----------------------------------------

mkdir -p "${BRUDI_LOCAL}"

if [ -f "${STATE_FILE}" ]; then
  echo "${YELLOW}  ! state.json existiert bereits — wird nicht überschrieben.${RESET}"
else
  # Copy init state and set project name
  if command -v jq &>/dev/null; then
    jq --arg name "$PROJECT_NAME" '.project = $name' \
      "${BRUDI_DIR}/orchestration/state.init.json" > "${STATE_FILE}"
  else
    sed "s/\"project\": \"\"/\"project\": \"${PROJECT_NAME}\"/" \
      "${BRUDI_DIR}/orchestration/state.init.json" > "${STATE_FILE}"
  fi
  echo "${GREEN}  ✓ .brudi/state.json erstellt (Mode: BUILD, Phase: 0)${RESET}"
fi

# --- screenshots/ Verzeichnis ------------------------------------------------

mkdir -p "${PROJECT_DIR}/screenshots"
echo "${GREEN}  ✓ screenshots/ Verzeichnis bereit${RESET}"

# --- AGENTS.md anlegen --------------------------------------------------------

AGENTS_DONE=""
if [ -f "${AGENTS_FILE}" ]; then
  if grep -qiF "brudi" "${AGENTS_FILE}" 2>/dev/null; then
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

## Tier-1 Orchestrierung (PFLICHT)

Dieses Projekt nutzt Brudi Tier-1 Orchestrierung:

- **State:** .brudi/state.json ist die Single Source of Truth (Modus, Phase, Slice-Status, Evidence)
- **Gate Runner:** Vor jedem Slice: \`bash ~/Brudi/orchestration/brudi-gate.sh pre-slice\`
- **Gate Runner:** Nach jedem Slice: \`bash ~/Brudi/orchestration/brudi-gate.sh post-slice <id>\`
- **Mode Check:** Vor jeder Aktion: \`bash ~/Brudi/orchestration/brudi-gate.sh mode-check <action>\`
- **Pre-Commit:** Git-Commits werden automatisch blockiert wenn Gates nicht bestanden sind.

**REGELN:**
- state.json muss nach JEDEM Slice aktualisiert werden
- Modus-Wechsel NUR durch User-Anweisung (mode_set_by: "user")
- AUDIT darf NIEMALS zu FIX eskalieren ohne User-Befehl
- Screenshots müssen als Dateien in screenshots/ existieren

## Projektname

${PROJECT_NAME}

## Wichtig

Dieses Projekt folgt den Brudi-Standards. Kein AI-Slop. Award-Level oder nichts.
EOF
  echo "${GREEN}  ✓ AGENTS.md erstellt (mit Tier-1 Referenzen)${RESET}"
fi

# --- CLAUDE.md anlegen (für Claude Code) --------------------------------------

CLAUDE_DONE=""
if [ -f "${CLAUDE_FILE}" ]; then
  if grep -qiF "brudi" "${CLAUDE_FILE}" 2>/dev/null; then
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

## Tier-1 Orchestrierung (PFLICHT)

Dieses Projekt nutzt imperatives Gate-Enforcement:

1. **State lesen:** \`cat .brudi/state.json\` — zeigt aktuellen Modus, Phase, Slice-Status
2. **Vor jedem Slice:** \`bash ~/Brudi/orchestration/brudi-gate.sh pre-slice\`
3. **Nach jedem Slice:** state.json aktualisieren, dann \`bash ~/Brudi/orchestration/brudi-gate.sh post-slice <id>\`
4. **Phase-Wechsel:** \`bash ~/Brudi/orchestration/brudi-gate.sh phase-gate 0_to_1\`
5. **Mode-Check:** \`bash ~/Brudi/orchestration/brudi-gate.sh mode-check <action>\`

**VERBOTEN:** Modus eigenmächtig wechseln. AUDIT→FIX ohne User. Gates überspringen.

Projektname: ${PROJECT_NAME}
EOF
  echo "${GREEN}  ✓ CLAUDE.md erstellt (mit Tier-1 Referenzen)${RESET}"
fi

# --- TASK.md + PROJECT_STATUS.md Templates ------------------------------------

if [ ! -f "${PROJECT_DIR}/TASK.md" ]; then
  if [ -f "${BRUDI_DIR}/templates/TASK.md" ]; then
    sed "s/\[Projektname\]/${PROJECT_NAME}/g" "${BRUDI_DIR}/templates/TASK.md" > "${PROJECT_DIR}/TASK.md"
    echo "${GREEN}  ✓ TASK.md aus Template erstellt${RESET}"
  fi
fi

if [ ! -f "${PROJECT_DIR}/PROJECT_STATUS.md" ]; then
  if [ -f "${BRUDI_DIR}/templates/PROJECT_STATUS.md" ]; then
    sed "s/\[Projektname\]/${PROJECT_NAME}/g; s/\[Datum\]/$(date +%Y-%m-%d)/g" \
      "${BRUDI_DIR}/templates/PROJECT_STATUS.md" > "${PROJECT_DIR}/PROJECT_STATUS.md"
    echo "${GREEN}  ✓ PROJECT_STATUS.md aus Template erstellt${RESET}"
  fi
fi

# --- Pre-Commit Hook ----------------------------------------------------------

if [ -d "${PROJECT_DIR}/.git" ]; then
  HOOKS_DIR="${PROJECT_DIR}/.git/hooks"
  mkdir -p "$HOOKS_DIR"

  if [ -f "${BRUDI_DIR}/orchestration/pre-commit" ]; then
    cp "${BRUDI_DIR}/orchestration/pre-commit" "${HOOKS_DIR}/pre-commit"
    chmod +x "${HOOKS_DIR}/pre-commit"
    echo "${GREEN}  ✓ Pre-commit Hook installiert (blockiert Commits bei Gate-Fehlern)${RESET}"
  else
    echo "${YELLOW}  ! Pre-commit Hook nicht gefunden in ~/Brudi/orchestration/${RESET}"
  fi
else
  echo "${YELLOW}  ! Kein .git/ Verzeichnis — Pre-commit Hook wird erst nach 'git init' installiert.${RESET}"
  echo "${YELLOW}    Führe danach erneut aus: sh ~/Brudi/use.sh${RESET}"
fi

# --- .gitignore Ergänzung -----------------------------------------------------

if [ -f "${PROJECT_DIR}/.gitignore" ]; then
  if ! grep -qF ".brudi/state.json" "${PROJECT_DIR}/.gitignore" 2>/dev/null; then
    echo "" >> "${PROJECT_DIR}/.gitignore"
    echo "# Brudi: state.json is local, not committed (each dev has own state)" >> "${PROJECT_DIR}/.gitignore"
    echo "# Remove this line if you want to share state across team members" >> "${PROJECT_DIR}/.gitignore"
    echo "# .brudi/state.json" >> "${PROJECT_DIR}/.gitignore"
  fi
fi

# --- Fertig -------------------------------------------------------------------

echo ""
echo "  ┌───────────────────────────────────────────────────────┐"
echo "  │  Projekt verbunden! (Tier-1 Orchestrierung aktiv)     │"
echo "  │                                                        │"
echo "  │  Erstellt:                                             │"
echo "  │    → AGENTS.md / CLAUDE.md  (Brudi-Referenz)          │"
echo "  │    → .brudi/state.json      (Mode, Phase, Evidence)   │"
echo "  │    → screenshots/           (Evidence-Verzeichnis)     │"
echo "  │    → TASK.md                (Aufgaben-Template)        │"
echo "  │    → PROJECT_STATUS.md      (Status-Tracking)          │"
echo "  │    → .git/hooks/pre-commit  (Gate-Enforcement)         │"
echo "  │                                                        │"
echo "  │  Der Agent startet mit:                                │"
echo "  │    1. CLAUDE.md lesen                                  │"
echo "  │    2. cat .brudi/state.json                            │"
echo "  │    3. brudi-gate.sh pre-slice                          │"
echo "  │    4. Arbeiten                                         │"
echo "  └───────────────────────────────────────────────────────┘"
echo ""
