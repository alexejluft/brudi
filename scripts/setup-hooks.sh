#!/usr/bin/env bash
set -e

# Installiert die Brudi Git-Hooks im aktuellen Repo.
# Canonical Quellen: scripts/hooks/post-commit + scripts/post-merge
# Verwendung: bash scripts/setup-hooks.sh

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"

if [ -z "$REPO_ROOT" ]; then
  echo "❌ Kein Git-Repo gefunden. Führe dieses Skript im Brudi-Repo aus."
  exit 1
fi

HOOKS_DST="$REPO_ROOT/.git/hooks"

# ── Post-Commit Hook (syncs nach eigenem Commit) ──
if [ -f "$REPO_ROOT/scripts/hooks/post-commit" ]; then
  cp "$REPO_ROOT/scripts/hooks/post-commit" "$HOOKS_DST/post-commit"
  chmod +x "$HOOKS_DST/post-commit"
  echo "✅ post-commit Hook installiert (syncs Skills + Orchestration nach Commit)"
else
  echo "❌ scripts/hooks/post-commit nicht gefunden."
  exit 1
fi

# ── Post-Merge Hook (syncs nach git pull) ──
if [ -f "$REPO_ROOT/scripts/post-merge" ]; then
  cp "$REPO_ROOT/scripts/post-merge" "$HOOKS_DST/post-merge"
  chmod +x "$HOOKS_DST/post-merge"
  echo "✅ post-merge Hook installiert (syncs nach git pull)"
else
  echo "❌ scripts/post-merge nicht gefunden."
  exit 1
fi

echo ""
echo "Beide Hooks aktiv. Jeder Commit und jeder Pull synct automatisch nach ~/Brudi/"
