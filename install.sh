#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Global Installer (v3.5.0+)
#
# Was dieses Skript macht:
#   1. Prueft Voraussetzungen (Git, Node >= 18, npm)
#   2. Installiert Brudi als Git-Repo nach ~/Brudi/
#   3. Installiert Engine-Dependencies (AST Engine, Outcome Engine)
#   4. Installiert Playwright Chromium
#   5. Verifiziert: Alles lauffaehig
#
# Verwendung:
#   curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
#
# Danach fuer jedes neue Projekt:
#   cd ~/projects/mein-projekt && sh ~/Brudi/use.sh
# -----------------------------------------------------------------------------

REPO_URL="https://github.com/alexejluft/brudi.git"
INSTALL_DIR="${HOME}/Brudi"
MIN_NODE_MAJOR=18

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo "  Brudi — Award-level working identity for AI agents"
echo "  ---------------------------------------------------"
echo ""

# =============================================================================
# PHASE 1: VORAUSSETZUNGEN (HARD FAIL)
# =============================================================================

# --- 1a. Git ---

if ! command -v git >/dev/null 2>&1; then
  echo "${RED}  x FEHLER: Git ist nicht installiert.${RESET}"
  echo ""
  echo "  Installiere Git zuerst:"
  echo "    macOS:  xcode-select --install"
  echo "    Linux:  sudo apt install git"
  echo ""
  exit 1
fi

# --- 1b. Node.js >= 18 ---

if ! command -v node >/dev/null 2>&1; then
  echo "${RED}  x FEHLER: Node.js ist nicht installiert.${RESET}"
  echo ""
  echo "  Brudi benoetigt Node.js >= ${MIN_NODE_MAJOR} fuer die AST- und Outcome-Engines."
  echo ""
  echo "  Installiere Node.js:"
  echo "    macOS:  brew install node"
  echo "    Linux:  curl -fsSL https://deb.nodesource.com/setup_${MIN_NODE_MAJOR}.x | sudo -E bash - && sudo apt install -y nodejs"
  echo "    Oder:   https://nodejs.org/"
  echo ""
  exit 1
fi

NODE_VERSION_FULL=$(node --version 2>/dev/null | sed 's/^v//')
NODE_MAJOR=$(echo "$NODE_VERSION_FULL" | cut -d. -f1)

if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ] 2>/dev/null; then
  echo "${RED}  x FEHLER: Node.js v${NODE_VERSION_FULL} ist zu alt. Minimum: v${MIN_NODE_MAJOR}.${RESET}"
  echo ""
  echo "  Aktualisiere Node.js:"
  echo "    macOS:  brew upgrade node"
  echo "    Oder:   https://nodejs.org/"
  echo ""
  exit 1
fi

# --- 1c. npm ---

if ! command -v npm >/dev/null 2>&1; then
  echo "${RED}  x FEHLER: npm ist nicht installiert.${RESET}"
  echo ""
  echo "  npm wird mit Node.js mitgeliefert. Installiere Node.js neu:"
  echo "    https://nodejs.org/"
  echo ""
  exit 1
fi

echo "${GREEN}  v Voraussetzungen: Git, Node.js v${NODE_VERSION_FULL}, npm $(npm --version 2>/dev/null)${RESET}"

# =============================================================================
# PHASE 2: REPO INSTALLIEREN / AKTUALISIEREN
# =============================================================================

if [ -d "${INSTALL_DIR}" ]; then
  if [ -d "${INSTALL_DIR}/.git" ]; then
    # Fall A: Bereits als Repo installiert -> Dirty-Check + Update
    cd "${INSTALL_DIR}"

    # Dirty-Check: Lokale Aenderungen verhindern sauberes Pull
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
      echo "${RED}  x ~/Brudi/ enthaelt lokale Aenderungen.${RESET}"
      echo ""
      echo "  Brudi ist ein Framework-Repo. Lokale Aenderungen sind nicht vorgesehen."
      echo "  Projektspezifische Anpassungen gehoeren ins Projekt (CLAUDE.md, TASK.md)."
      echo ""
      echo "  Loesung:"
      echo "    1. mv ~/Brudi ~/Brudi_backup_\$(date +%Y%m%d_%H%M%S)"
      echo "    2. git clone --depth=1 ${REPO_URL} ~/Brudi"
      echo ""
      exit 1
    fi

    # Detached HEAD Check
    if ! git symbolic-ref HEAD >/dev/null 2>&1; then
      echo "${RED}  x ~/Brudi/ ist in Detached-HEAD-Zustand.${RESET}"
      echo ""
      echo "  Loesung:"
      echo "    cd ~/Brudi && git checkout main"
      echo "  Oder Neuinstallation:"
      echo "    mv ~/Brudi ~/Brudi_backup_\$(date +%Y%m%d_%H%M%S)"
      echo "    git clone --depth=1 ${REPO_URL} ~/Brudi"
      echo ""
      exit 1
    fi

    # Branch Check: Nur main ist erlaubt
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo "${RED}  x ~/Brudi/ ist auf Branch '${CURRENT_BRANCH}' statt 'main'.${RESET}"
      echo ""
      echo "  Brudi ist ein Framework-Repo. Nur der main-Branch wird unterstuetzt."
      echo ""
      echo "  Loesung:"
      echo "    cd ~/Brudi && git checkout main"
      echo ""
      exit 1
    fi

    echo "${BLUE}  > Brudi ist bereits installiert. Aktualisiere...${RESET}"
    if git pull --quiet; then
      VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")
      echo "${GREEN}  v Repo aktualisiert auf v${VERSION}${RESET}"
    else
      echo "${RED}  x git pull fehlgeschlagen.${RESET}"
      echo "    Pruefe Internetverbindung oder fuehre manuell aus:"
      echo "    cd ~/Brudi && git pull"
      exit 1
    fi

    # KEIN exit 0 hier — weiter zu Phase 3 (Engine Bootstrap)

  else
    # Fall B: Alte Kopie-Installation (pre-3.3.0) -> Backup + Neuinstallation
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="${HOME}/Brudi_backup_${TIMESTAMP}"

    # Sicherheit: Backup-Pfad darf nicht existieren
    COUNTER=0
    while [ -d "${BACKUP_DIR}" ]; do
      COUNTER=$((COUNTER + 1))
      BACKUP_DIR="${HOME}/Brudi_backup_${TIMESTAMP}_${COUNTER}"
    done

    mv "${INSTALL_DIR}" "${BACKUP_DIR}"
    echo "${YELLOW}  ! Alte Installation gesichert: ${BACKUP_DIR}${RESET}"
    echo "    (Kann nach erfolgreicher Neuinstallation geloescht werden)"
    echo ""

    # Fall-through zu Neuinstallation unten
    echo "${BLUE}  > Klone Brudi nach ${INSTALL_DIR}/ ...${RESET}"

    if git clone --depth=1 --quiet "${REPO_URL}" "${INSTALL_DIR}"; then
      chmod +x "${INSTALL_DIR}/use.sh" 2>/dev/null || true
      chmod +x "${INSTALL_DIR}/orchestration/brudi-gate.sh" 2>/dev/null || true
      chmod +x "${INSTALL_DIR}/orchestration/pre-commit" 2>/dev/null || true
      VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")
      echo "${GREEN}  v Repo geklont (v${VERSION})${RESET}"
    else
      echo "${RED}  x git clone fehlgeschlagen.${RESET}"
      echo "    Pruefe Internetverbindung und URL: ${REPO_URL}"
      exit 1
    fi
  fi
else
  # --- Neuinstallation (kein ~/Brudi/ vorhanden) ---

  echo "${BLUE}  > Klone Brudi nach ${INSTALL_DIR}/ ...${RESET}"

  if git clone --depth=1 --quiet "${REPO_URL}" "${INSTALL_DIR}"; then
    chmod +x "${INSTALL_DIR}/use.sh" 2>/dev/null || true
    chmod +x "${INSTALL_DIR}/orchestration/brudi-gate.sh" 2>/dev/null || true
    chmod +x "${INSTALL_DIR}/orchestration/pre-commit" 2>/dev/null || true
    VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")
    echo "${GREEN}  v Repo geklont (v${VERSION})${RESET}"
  else
    echo "${RED}  x git clone fehlgeschlagen.${RESET}"
    echo "    Pruefe Internetverbindung und URL: ${REPO_URL}"
    exit 1
  fi
fi

# =============================================================================
# PHASE 3: ENGINE BOOTSTRAP (shared — laeuft nach Clone UND Update)
# =============================================================================

bootstrap_engines() {
  local install_dir="$1"
  local ast_dir="${install_dir}/orchestration/ast-engine"
  local outcome_dir="${install_dir}/orchestration/outcome-engine"

  echo ""
  echo "${BLUE}  > Installiere Engine-Dependencies...${RESET}"

  # --- 3a. AST Engine ---

  if [ ! -f "${ast_dir}/package.json" ]; then
    echo "${RED}  x FEHLER: AST Engine package.json fehlt: ${ast_dir}/package.json${RESET}"
    echo "    Installation ist beschaedigt. Neuinstallation empfohlen:"
    echo "    rm -rf ~/Brudi && git clone ${REPO_URL} ~/Brudi"
    exit 1
  fi

  if [ ! -f "${ast_dir}/package-lock.json" ]; then
    echo "${RED}  x FEHLER: AST Engine lockfile fehlt: ${ast_dir}/package-lock.json${RESET}"
    echo "    Installation ist beschaedigt. Neuinstallation empfohlen:"
    echo "    rm -rf ~/Brudi && git clone ${REPO_URL} ~/Brudi"
    exit 1
  fi

  echo "${BLUE}    > AST Engine (Layer 5)...${RESET}"
  if (cd "${ast_dir}" && npm ci --silent 2>&1); then
    echo "${GREEN}    v AST Engine: Dependencies installiert${RESET}"
  else
    echo "${RED}  x FEHLER: npm ci fehlgeschlagen in ${ast_dir}${RESET}"
    echo "    Pruefe ob package-lock.json aktuell ist."
    echo "    Manuell versuchen: cd ${ast_dir} && npm ci"
    exit 1
  fi

  # --- 3b. Outcome Engine ---

  if [ ! -f "${outcome_dir}/package.json" ]; then
    echo "${RED}  x FEHLER: Outcome Engine package.json fehlt: ${outcome_dir}/package.json${RESET}"
    echo "    Installation ist beschaedigt. Neuinstallation empfohlen:"
    echo "    rm -rf ~/Brudi && git clone ${REPO_URL} ~/Brudi"
    exit 1
  fi

  if [ ! -f "${outcome_dir}/package-lock.json" ]; then
    echo "${RED}  x FEHLER: Outcome Engine lockfile fehlt: ${outcome_dir}/package-lock.json${RESET}"
    echo "    Installation ist beschaedigt. Neuinstallation empfohlen:"
    echo "    rm -rf ~/Brudi && git clone ${REPO_URL} ~/Brudi"
    exit 1
  fi

  echo "${BLUE}    > Outcome Engine (Layer 6)...${RESET}"
  if (cd "${outcome_dir}" && npm ci --silent 2>&1); then
    echo "${GREEN}    v Outcome Engine: Dependencies installiert${RESET}"
  else
    echo "${RED}  x FEHLER: npm ci fehlgeschlagen in ${outcome_dir}${RESET}"
    echo "    Pruefe ob package-lock.json aktuell ist."
    echo "    Manuell versuchen: cd ${outcome_dir} && npm ci"
    exit 1
  fi

  # --- 3c. Playwright Chromium ---

  echo "${BLUE}    > Playwright Chromium Browser...${RESET}"
  if (cd "${outcome_dir}" && npx playwright install chromium 2>&1); then
    echo "${GREEN}    v Playwright Chromium installiert${RESET}"
  else
    echo "${RED}  x FEHLER: Playwright Chromium Installation fehlgeschlagen.${RESET}"
    echo "    Manuell versuchen: cd ${outcome_dir} && npx playwright install chromium"
    exit 1
  fi

  # --- 3d. Sanity Check ---

  echo ""
  echo "${BLUE}  > Verifiziere Engines...${RESET}"

  # AST Engine: node_modules muss existieren
  if [ ! -d "${ast_dir}/node_modules" ]; then
    echo "${RED}  x FEHLER: AST Engine node_modules fehlt nach npm ci.${RESET}"
    exit 1
  fi

  # AST Engine: Kann geladen werden (teste Sub-Modul, da index.js auto-ausfuehrt)
  if (cd "${ast_dir}" && node -e "import('./ts-analyzer.js').then(() => process.exit(0)).catch(() => process.exit(1))" 2>/dev/null); then
    echo "${GREEN}    v AST Engine: Modul laedt erfolgreich${RESET}"
  else
    echo "${RED}  x FEHLER: AST Engine kann nicht geladen werden.${RESET}"
    echo "    Manuell pruefen: cd ${ast_dir} && node -e \"import('./ts-analyzer.js')\""
    exit 1
  fi

  # Outcome Engine: node_modules muss existieren
  if [ ! -d "${outcome_dir}/node_modules" ]; then
    echo "${RED}  x FEHLER: Outcome Engine node_modules fehlt nach npm ci.${RESET}"
    exit 1
  fi

  # Outcome Engine: Kann geladen werden (import check, nicht ausfuehren)
  if (cd "${outcome_dir}" && node -e "import('./dom-extractor.js').then(() => process.exit(0)).catch(() => process.exit(1))" 2>/dev/null); then
    echo "${GREEN}    v Outcome Engine: Modul laedt erfolgreich${RESET}"
  else
    echo "${RED}  x FEHLER: Outcome Engine dom-extractor.js kann nicht geladen werden.${RESET}"
    echo "    Manuell pruefen: cd ${outcome_dir} && node -e \"import('./dom-extractor.js')\""
    exit 1
  fi
}

# Ausfuehren
bootstrap_engines "${INSTALL_DIR}"

# =============================================================================
# PHASE 4: ERFOLG
# =============================================================================

VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")

echo ""
echo "${GREEN}  ==============================================${RESET}"
echo "${GREEN}  v Brudi v${VERSION} — Installation erfolgreich${RESET}"
echo "${GREEN}  ==============================================${RESET}"
echo ""
echo "  Alle Komponenten verifiziert:"
echo "    v Git-Repo:        ~/Brudi/"
echo "    v Layer 4:         Constraint Gate (Bash)"
echo "    v Layer 5:         AST Engine (Node.js)"
echo "    v Layer 6:         Outcome Engine (Playwright)"
echo ""
echo "  Naechster Schritt:"
echo "    cd ~/projects/mein-projekt"
echo "    sh ~/Brudi/use.sh"
echo ""
echo "  Update:  sh ~/Brudi/install.sh"
echo "  Docs:    ~/Brudi/INSTALL.md"
echo ""
