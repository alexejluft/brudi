#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Brudi — Global Installer
#
# Was dieses Skript macht:
#   Installiert Brudi einmalig global nach ~/Brudi/
#   Das ist ALLES. Kein Projekt wird berührt.
#
# Verwendung:
#   curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh
#
# Danach für jedes neue Projekt:
#   Lies ~/Brudi/INSTALL.md — dort steht der nächste Schritt.
# -----------------------------------------------------------------------------

REPO_URL="https://github.com/alexejluft/brudi.git"
INSTALL_DIR="${HOME}/Brudi"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo "  Brudi — Award-level working identity for AI agents"
echo "  ---------------------------------------------------"
echo ""

# --- Bereits installiert? -----------------------------------------------------

if [ -d "${INSTALL_DIR}" ]; then
  echo "${YELLOW}  Brudi ist bereits installiert in ${INSTALL_DIR}${RESET}"
  echo ""
  printf "  Neu installieren (überschreiben)? [j/N]: "
  read -r ANSWER
  if [ "${ANSWER}" != "j" ] && [ "${ANSWER}" != "J" ]; then
    echo ""
    echo "  Abgebrochen. Brudi bleibt unverändert."
    echo ""
    echo "${BLUE}  Nächster Schritt: Lies ${INSTALL_DIR}/INSTALL.md${RESET}"
    echo ""
    exit 0
  fi
  rm -rf "${INSTALL_DIR}"
fi

# --- Brudi klonen -------------------------------------------------------------

echo "${BLUE}  ▶ Klone Brudi nach ${INSTALL_DIR}/ ...${RESET}"

TMP_DIR="$(mktemp -d)"
git clone --depth=1 --quiet "${REPO_URL}" "${TMP_DIR}/brudi"

# Nur den skills/ Ordner global installieren (das ist das Paket)
mkdir -p "${INSTALL_DIR}"
cp -r "${TMP_DIR}/brudi/skills/." "${INSTALL_DIR}/"
rm -rf "${TMP_DIR}"

chmod +x "${INSTALL_DIR}/use.sh" 2>/dev/null || true

echo "${GREEN}  ✓ Brudi installiert in ${INSTALL_DIR}/${RESET}"

# --- Fertig -------------------------------------------------------------------

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  Brudi ist jetzt global auf deinem PC           │"
echo "  │                                                  │"
echo "  │  Nächster Schritt:                               │"
echo "  │  Gehe in deinen Projektordner und führe aus:     │"
echo "  │                                                  │"
echo "  │    sh ~/Brudi/use.sh                            │"
echo "  │                                                  │"
echo "  │  Das verbindet Brudi mit deinem Projekt.         │"
echo "  │  Mehr Infos: ~/Brudi/INSTALL.md                 │"
echo "  └─────────────────────────────────────────────────┘"
echo ""
