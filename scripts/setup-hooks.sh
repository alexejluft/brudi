#!/usr/bin/env bash
set -e

# Installiert die Brudi Git-Hooks im aktuellen Repo.
# Verwendung: sh scripts/setup-hooks.sh

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"

if [ -z "$REPO_ROOT" ]; then
  echo "❌ Kein Git-Repo gefunden. Führe dieses Skript im Brudi-Repo aus."
  exit 1
fi

HOOKS_SRC="$REPO_ROOT/scripts/hooks"
HOOKS_DST="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOKS_SRC" ]; then
  echo "❌ scripts/hooks/ nicht gefunden."
  exit 1
fi

cp "$HOOKS_SRC/post-commit" "$HOOKS_DST/post-commit"
chmod +x "$HOOKS_DST/post-commit"
echo "✅ post-commit Hook installiert"
echo "   Jeder Commit synct jetzt automatisch nach ~/.brudi/"
