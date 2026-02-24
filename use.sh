#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Projekt-Verbinder (v3.3.0 + Tier-1 Orchestrierung)
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

BRUDI_DIR="${BRUDI_DIR:-${HOME}/Brudi}"
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
  echo "  curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh"
  echo ""
  exit 1
fi

# --- .brudi/ Verzeichnis + state.json ----------------------------------------

mkdir -p "${BRUDI_LOCAL}"

BRUDI_VERSION=$(cat "${BRUDI_DIR}/VERSION" 2>/dev/null || echo "unknown")

if [ -f "${STATE_FILE}" ]; then
  echo "${YELLOW}  ! state.json existiert bereits — wird nicht überschrieben.${RESET}"
else
  # Copy init state and set project name + brudi_version
  if command -v jq &>/dev/null; then
    jq --arg name "$PROJECT_NAME" --arg bv "$BRUDI_VERSION" \
      '.project = $name | .brudi_version = $bv' \
      "${BRUDI_DIR}/orchestration/state.init.json" > "${STATE_FILE}"
  else
    sed "s/\"project\": \"\"/\"project\": \"${PROJECT_NAME}\"/; s/\"brudi_version\": \"\"/\"brudi_version\": \"${BRUDI_VERSION}\"/" \
      "${BRUDI_DIR}/orchestration/state.init.json" > "${STATE_FILE}"
  fi
  echo "${GREEN}  ✓ .brudi/state.json erstellt (Mode: BUILD, Phase: 0, Brudi: v${BRUDI_VERSION})${RESET}"
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
  CLAUDE_TEMPLATE="${BRUDI_DIR}/templates/CLAUDE.md"
  if [ -f "${CLAUDE_TEMPLATE}" ]; then
    sed "s/\[Dein Projektname\]/${PROJECT_NAME}/g; s/\[Projektname\]/${PROJECT_NAME}/g" \
      "${CLAUDE_TEMPLATE}" > "${CLAUDE_FILE}"
    echo "${GREEN}  ✓ CLAUDE.md aus Template erstellt (vollständig mit Tier-1, Mode Control, Hard Gates)${RESET}"
  else
    echo "${YELLOW}  ! Template ~/Brudi/templates/CLAUDE.md nicht gefunden — erstelle Minimalversion${RESET}"
    cat > "${CLAUDE_FILE}" << EOF
# ${PROJECT_NAME} — Project Context

Lies vor dem Start vollständig: ~/Brudi/CLAUDE.md
Skills: ~/Brudi/skills/[skill-name]/SKILL.md
State: cat .brudi/state.json
Gate Runner: bash ~/Brudi/orchestration/brudi-gate.sh pre-slice
EOF
  fi
  echo "${GREEN}  ✓ CLAUDE.md erstellt${RESET}"
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

# --- Primitives (Layout + Token Bridge + Animation Hooks) --------------------

PRIMITIVES_SRC="${BRUDI_DIR}/templates/primitives"
if [ -d "${PRIMITIVES_SRC}" ]; then
  mkdir -p "${PROJECT_DIR}/src/primitives"
  for f in layout.tsx tokens.ts use-scroll-reveal.ts use-stagger-entrance.ts; do
    if [ -f "${PRIMITIVES_SRC}/${f}" ] && [ ! -f "${PROJECT_DIR}/src/primitives/${f}" ]; then
      cp "${PRIMITIVES_SRC}/${f}" "${PROJECT_DIR}/src/primitives/${f}"
      echo "${GREEN}  ✓ src/primitives/${f} kopiert${RESET}"
    fi
  done
else
  echo "${YELLOW}  ! templates/primitives/ nicht gefunden — Layout Primitives übersprungen${RESET}"
fi

# --- Problems_and_Effectivity.md (Pflicht) -----------------------------------

if [ ! -f "${PROJECT_DIR}/Problems_and_Effectivity.md" ]; then
  cat > "${PROJECT_DIR}/Problems_and_Effectivity.md" << 'PEEOF'
# Problems & Effectivity Log

Dieses Dokument ist Pflichtbestandteil jedes Brudi-Projekts.
Jeder KI-Agent MUSS hier Fehler, Fehlinterpretationen und Debugging-Schritte dokumentieren.

**Mindestens 1 Eintrag pro Slice. Leere Datei blockt. Fehlende Datei blockt.**

---

## Slice 0 — Phase 0 Setup

**Problem:** (noch kein Problem aufgetreten)
**Root Cause:** N/A
**Was habe ich falsch verstanden:** N/A
**Welche Skill war unklar:** N/A
**Warum ist es passiert:** N/A
**Wie wurde es gelöst:** N/A
**Wie hätte Brudi es verhindern können:** N/A
**Zeitverlust:** 0 min
PEEOF
  echo "${GREEN}  ✓ Problems_and_Effectivity.md erstellt (Pflichtdokument)${RESET}"
else
  echo "${YELLOW}  ! Problems_and_Effectivity.md existiert bereits — wird nicht überschrieben.${RESET}"
fi

# --- ESLint Config (Creative DNA Rules) ---------------------------------------

if [ ! -f "${PROJECT_DIR}/eslint.config.brudi.js" ]; then
  if [ -f "${BRUDI_DIR}/templates/eslint.config.brudi.js" ]; then
    cp "${BRUDI_DIR}/templates/eslint.config.brudi.js" "${PROJECT_DIR}/eslint.config.brudi.js"
    echo "${GREEN}  ✓ eslint.config.brudi.js kopiert (Creative DNA ESLint Rules)${RESET}"
  fi
else
  echo "${YELLOW}  ! eslint.config.brudi.js existiert bereits — wird nicht überschrieben.${RESET}"
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
echo "  │    → Problems_and_Effectivity.md (Lern-Log)            │"
echo "  │    → src/primitives/        (Layout+Token Bridge)      │"
echo "  │    → .git/hooks/pre-commit  (Gate-Enforcement)         │"
echo "  │                                                        │"
echo "  │  Der Agent startet mit:                                │"
echo "  │    1. CLAUDE.md lesen                                  │"
echo "  │    2. cat .brudi/state.json                            │"
echo "  │    3. brudi-gate.sh pre-slice                          │"
echo "  │    4. Arbeiten                                         │"
echo "  └───────────────────────────────────────────────────────┘"
echo ""
