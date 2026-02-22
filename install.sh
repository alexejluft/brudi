#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Global Installer (v3.3.0+)
#
# Was dieses Skript macht:
#   Installiert Brudi als Git-Repo nach ~/Brudi/
#   ~/Brudi/ IST das Repo — Updates via: cd ~/Brudi && git pull
#
# Verwendung:
#   curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
#
# Danach für jedes neue Projekt:
#   cd ~/projects/mein-projekt && sh ~/Brudi/use.sh
# -----------------------------------------------------------------------------

REPO_URL="https://github.com/alexejluft/brudi.git"
INSTALL_DIR="${HOME}/Brudi"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo "  Brudi — Award-level working identity for AI agents"
echo "  ---------------------------------------------------"
echo ""

# --- 1. Git-Verfuegbarkeit pruefen -------------------------------------------

if ! command -v git >/dev/null 2>&1; then
  echo "${RED}  x Git ist nicht installiert.${RESET}"
  echo ""
  echo "  Installiere Git zuerst:"
  echo "    macOS:  xcode-select --install"
  echo "    Linux:  sudo apt install git"
  echo ""
  exit 1
fi

# --- 2. Bestehende Installation pruefen --------------------------------------

if [ -d "${INSTALL_DIR}" ]; then
  if [ -d "${INSTALL_DIR}/.git" ]; then
    # Fall A: Bereits als Repo installiert -> Dirty-Check + Update
    cd "${INSTALL_DIR}"

    # Dirty-Check: Lokale Aenderungen verhindern sauberes Pull
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
      echo "${RED}  x ~/Brudi/ enthält lokale Aenderungen.${RESET}"
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

    echo "${BLUE}  > Brudi ist bereits installiert. Aktualisiere...${RESET}"
    if git pull --quiet; then
      VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")
      echo "${GREEN}  v Brudi aktualisiert auf v${VERSION}${RESET}"
    else
      echo "${RED}  x git pull fehlgeschlagen.${RESET}"
      echo "    Pruefe Internetverbindung oder fuehre manuell aus:"
      echo "    cd ~/Brudi && git pull"
      exit 1
    fi
    echo ""
    echo "  Update: cd ~/Brudi && git pull"
    echo "  Docs:   ~/Brudi/INSTALL.md"
    echo ""
    exit 0
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
  fi
fi

# --- 3. Neuinstallation (Clone) ----------------------------------------------

echo "${BLUE}  > Klone Brudi nach ${INSTALL_DIR}/ ...${RESET}"

if git clone --depth=1 --quiet "${REPO_URL}" "${INSTALL_DIR}"; then
  chmod +x "${INSTALL_DIR}/use.sh" 2>/dev/null || true
  chmod +x "${INSTALL_DIR}/orchestration/brudi-gate.sh" 2>/dev/null || true
  chmod +x "${INSTALL_DIR}/orchestration/pre-commit" 2>/dev/null || true
else
  echo "${RED}  x git clone fehlgeschlagen.${RESET}"
  echo "    Pruefe Internetverbindung und URL: ${REPO_URL}"
  exit 1
fi

VERSION=$(cat "${INSTALL_DIR}/VERSION" 2>/dev/null || echo "unknown")

echo "${GREEN}  v Brudi v${VERSION} installiert in ${INSTALL_DIR}/${RESET}"
echo "${GREEN}  v Tier-1 Orchestrierung verfuegbar (brudi-gate.sh, pre-commit)${RESET}"

# --- Fertig -------------------------------------------------------------------

echo ""
echo "  Brudi v${VERSION} ist jetzt auf deinem PC"
echo ""
echo "  Naechster Schritt:"
echo "    cd ~/projects/mein-projekt"
echo "    sh ~/Brudi/use.sh"
echo ""
echo "  Update:  cd ~/Brudi && git pull"
echo "  Docs:    ~/Brudi/INSTALL.md"
echo ""
