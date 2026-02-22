#!/bin/bash
# ─────────────────────────────────────────────────────────
# Brudi Setup Script
# Einmalig ausführen auf dem iMac — danach ist alles automatisch.
#
# Was dieses Script macht:
#   1. Erstellt ~/Brudi/skills/ und ~/Brudi/assets/
#   2. Installiert post-commit Hook (sync nach eigenem Commit)
#   3. Installiert post-merge Hook  (sync nach git pull)
#   4. Installiert macOS LaunchAgent (auto git pull alle 15min)
#   5. Führt sofortigen ersten Sync aus
#
# Ausführen mit:
#   bash scripts/setup-brudi.sh
# ─────────────────────────────────────────────────────────

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_SKILLS="$REPO_ROOT/skills/skills"
REPO_ASSETS="$REPO_ROOT/skills/assets"
REPO_TEMPLATES="$REPO_ROOT/skills/templates"
REPO_ORCHESTRATION="$REPO_ROOT/skills/orchestration"
INSTALLED_SKILLS="$HOME/Brudi/skills"
INSTALLED_ASSETS="$HOME/Brudi/assets"
INSTALLED_TEMPLATES="$HOME/Brudi/templates"
INSTALLED_ORCHESTRATION="$HOME/Brudi/orchestration"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
PLIST_SRC="$REPO_ROOT/scripts/com.brudi.autosync.plist"
PLIST_DST="$HOME/Library/LaunchAgents/com.brudi.autosync.plist"

echo ""
echo "🚀 Brudi Setup"
echo "──────────────────────────────────────────"

# ── 1. Directories ──────────────────────────────────────
echo "📁 Creating ~/Brudi directories..."
mkdir -p "$INSTALLED_SKILLS"
mkdir -p "$INSTALLED_ASSETS"
mkdir -p "$INSTALLED_TEMPLATES"
mkdir -p "$INSTALLED_ORCHESTRATION"
echo "   ✅ ~/Brudi/skills/, ~/Brudi/assets/, ~/Brudi/templates/ und ~/Brudi/orchestration/ bereit"

# ── 2. Git Hooks ────────────────────────────────────────
echo "🔗 Installing git hooks..."

cp "$REPO_ROOT/scripts/post-merge" "$HOOKS_DIR/post-merge"
chmod +x "$HOOKS_DIR/post-merge"
echo "   ✅ post-merge hook installiert"

# Update post-commit to use dynamic REPO_ROOT
cat > "$HOOKS_DIR/post-commit" << 'HOOK'
#!/bin/bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_SKILLS="$REPO_ROOT/skills/skills"
REPO_ASSETS="$REPO_ROOT/skills/assets"
REPO_TEMPLATES="$REPO_ROOT/skills/templates"
REPO_ORCHESTRATION="$REPO_ROOT/skills/orchestration"
INSTALLED_SKILLS="$HOME/Brudi/skills"
INSTALLED_ASSETS="$HOME/Brudi/assets"
INSTALLED_TEMPLATES="$HOME/Brudi/templates"
INSTALLED_ORCHESTRATION="$HOME/Brudi/orchestration"

echo "🔄 Brudi: Syncing after commit..."

if [ -d "$INSTALLED_SKILLS" ]; then
  cp -r "$REPO_SKILLS"/. "$INSTALLED_SKILLS/"
  SKILL_COUNT=$(ls "$INSTALLED_SKILLS" | wc -l | tr -d ' ')
  echo "✅ Skills synced ($SKILL_COUNT skills)"
fi

if [ -d "$INSTALLED_ASSETS" ]; then
  cp -r "$REPO_ASSETS"/. "$INSTALLED_ASSETS/"
  echo "✅ Assets synced"
fi

if [ -d "$INSTALLED_TEMPLATES" ]; then
  cp -r "$REPO_TEMPLATES"/. "$INSTALLED_TEMPLATES/"
  echo "✅ Templates synced"
fi

if [ -d "$REPO_ORCHESTRATION" ]; then
  mkdir -p "$INSTALLED_ORCHESTRATION"
  cp -r "$REPO_ORCHESTRATION"/. "$INSTALLED_ORCHESTRATION/"
  chmod +x "$INSTALLED_ORCHESTRATION/brudi-gate.sh" 2>/dev/null || true
  chmod +x "$INSTALLED_ORCHESTRATION/pre-commit" 2>/dev/null || true
  echo "✅ Orchestration synced"
fi
HOOK
chmod +x "$HOOKS_DIR/post-commit"
echo "   ✅ post-commit hook aktualisiert"

# ── 3. LaunchAgent ──────────────────────────────────────
echo "⏰ Installing macOS LaunchAgent (auto-pull alle 15min)..."
mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST_SRC" "$PLIST_DST"

# Unload if already running, then reload
launchctl unload "$PLIST_DST" 2>/dev/null || true
launchctl load "$PLIST_DST"
echo "   ✅ LaunchAgent installiert und aktiv"
echo "   → Brudi pullt ab jetzt automatisch alle 15 Minuten"
echo "   → Log: /tmp/brudi-autosync.log"

# ── 4. Erster Sync ──────────────────────────────────────
echo "📦 Initialer Sync..."
cp -r "$REPO_SKILLS"/. "$INSTALLED_SKILLS/"
cp -r "$REPO_ASSETS"/. "$INSTALLED_ASSETS/"
cp -r "$REPO_TEMPLATES"/. "$INSTALLED_TEMPLATES/"
cp -r "$REPO_ORCHESTRATION"/. "$INSTALLED_ORCHESTRATION/"
chmod +x "$INSTALLED_ORCHESTRATION/brudi-gate.sh" 2>/dev/null || true
chmod +x "$INSTALLED_ORCHESTRATION/pre-commit" 2>/dev/null || true
SKILL_COUNT=$(ls "$INSTALLED_SKILLS" | wc -l | tr -d ' ')
echo "   ✅ $SKILL_COUNT Skills synced → ~/Brudi/skills/"
echo "   ✅ Assets synced → ~/Brudi/assets/"
echo "   ✅ Templates synced → ~/Brudi/templates/"
echo "   ✅ Orchestration synced → ~/Brudi/orchestration/"

# ── Done ────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────"
echo "✅ Brudi Setup abgeschlossen!"
echo ""
echo "Ab jetzt läuft alles automatisch:"
echo "  • Nach jedem Commit → sofortiger Sync"
echo "  • Nach jedem git pull → sofortiger Sync"
echo "  • Alle 15 Minuten → auto git pull + Sync"
echo ""
