# Brudi Repository Migration Checklist

**Status:** Ready for Execution
**Date:** 2024-02-24
**Owner:** Agent 8 (Repo Hygiene)

---

## Executive Summary

This checklist provides step-by-step migration instructions to move the Brudi repository from its current mixed state to the target structure defined in `REPO_STRUCTURE_POLICY.md`.

**Expected outcome:**
- Root directory reduced from 21 files to 11 files
- All documentation organized and deduplicated
- Zero breaking changes to functionality
- All references updated automatically by Git

---

## Pre-Migration Verification

Before starting, confirm the current state:

- [ ] Current working directory: `/sessions/optimistic-quirky-franklin/mnt/brudi`
- [ ] Git status clean: `git status` shows no uncommitted changes
- [ ] Git branch: `main` (verify with `git branch`)
- [ ] No local modifications to migrate files
- [ ] Backup exists or you're willing to use `git reset --hard` if needed

**Commands to verify:**
```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
git status              # Should show "nothing to commit, working tree clean"
git branch              # Should show "* main"
git log --oneline -1   # Should show most recent commit
```

---

## Migration Phase 1: Create Supporting Infrastructure

### Task 1.1: Create `/docs/internal/INDEX.md`

This file catalogs all internal documentation.

```bash
cat > docs/internal/INDEX.md << 'EOF'
# Internal Documentation Index

This directory contains internal/audit documentation, technical references, and development artifacts.

## Planning & Reference
- `MASTERPLAN.md` — Master planning document
- `SKILL_WORKPLAN.md` — Skill development roadmap
- `SKILL_EVOLUTION.md` — Skill evolution tracking
- `SKILL_LEARNINGS.md` — Skill learnings & notes

## Technical Documentation
- `CONSTRAINT-GATE-SPEC.md` — Gate constraint specifications
- `CONSTRAINT-GATE-IMPLEMENTATION.md` — Implementation details
- `CONSTRAINT_LAYER_WIRING_MANIFEST.md` — Wiring manifest
- `README_CONSTRAINT_LAYER_IMPLEMENTATION.md` — Implementation guide
- `QUICK_REFERENCE_CONSTRAINT_LAYER.md` — Quick reference

## Integration & Patches
- `INTEGRATION-PATCH.md` — Integration patches
- `PATCHES_TEMPLATES_CLAUDE.md` — CLAUDE.md patches
- `PATCHES_TEMPLATES_TASK.md` — TASK.md patches
- `PATCHES_TEMPLATES_PROJECT_STATUS.md` — PROJECT_STATUS.md patches
- `INSTALLATIONS_INTEGRITAET.md` — Installation integrity checks

## Analysis & Reference
- `META_ANALYSE_KONSOLIDIERUNG.md` — Meta analysis consolidation
- `DELIVERY_SUMMARY.md` — Delivery summary
- `BRUDI_V32_ANALYSIS.md` — v3.2 analysis
- `STABILITY_LOCKDOWN_CHECKLIST.md` — Stability verification

## Audit Artifacts
- `audits/` — Previous audit reports and evidence
- `fixtures/` — Test fixtures for gate validation
- `archive/` — Obsolete documents (after migration)

## Organization Guidelines
- See `../internal/REPO_STRUCTURE_POLICY.md` for complete structure policy
- Use this index to discover internal documentation
- All files in this directory are for internal use only

**Last Updated:** 2024-02-24
EOF
```

**Verify:**
```bash
[ -f docs/internal/INDEX.md ] && echo "✅ INDEX.md created" || echo "❌ Failed"
```

### Task 1.2: Create `/templates/README.md`

Guide for using templates.

```bash
cat > templates/README.md << 'EOF'
# Project Templates

This directory contains reusable templates for new projects using Brudi.

## Standard Templates

### `CLAUDE.md`
The agent configuration file. Copy to your project's root as `.claude/config.txt` or root `CLAUDE.md`.

**Usage:**
```bash
cp templates/CLAUDE.md ~/MyProject/.claude/config.txt
```

### `TASK.md`
Project task definition. Defines phases, slices, and deliverables.

**Usage:**
```bash
cp templates/TASK.md ~/MyProject/TASK.md
```

### `PROJECT_STATUS.md`
Status tracking file. Updated per slice with evidence paths.

**Usage:**
```bash
cp templates/PROJECT_STATUS.md ~/MyProject/PROJECT_STATUS.md
```

### `eslint.config.brudi.js`
ESLint configuration with Brudi creative DNA rules.

**Usage:**
```bash
cp templates/eslint.config.brudi.js ~/MyProject/eslint.config.js
```

### `settings.json`
Editor settings (VS Code, etc.).

**Usage:**
```bash
cp templates/settings.json ~/MyProject/.vscode/settings.json
```

## Primitives

### `primitives/`
Pre-built layout and animation primitives for faster project startup.

**Contents:**
- `layout.tsx` — Core layout component
- `tokens.ts` — Design token system
- `use-scroll-reveal.ts` — Scroll reveal hook
- `use-stagger-entrance.ts` — Stagger entrance hook

**Usage:**
1. Copy the directory to your project: `cp -r templates/primitives ~/MyProject/src/lib/brudi`
2. Import tokens: `import { tokens } from '@/lib/brudi/tokens'`
3. Use primitives: `<Layout variant="hero">`

**For detailed setup instructions, see:** `primitives/README.md`

---

**Last Updated:** 2024-02-24
EOF
```

**Verify:**
```bash
[ -f templates/README.md ] && echo "✅ README.md created" || echo "❌ Failed"
```

### Task 1.3: Verify `/assets/INDEX.md` is Complete

```bash
ls -lh assets/INDEX.md
wc -l assets/INDEX.md
# Should show comprehensive listing of all assets
```

---

## Migration Phase 2: Move Internal Documentation

These files are currently in root (`/`) but belong in `/docs/internal/`.

### Task 2.1: Move Agent Process Documentation

```bash
git mv AGENTS.md docs/internal/AGENTS.md
# Verify
[ -f docs/internal/AGENTS.md ] && echo "✅ Moved AGENTS.md" || echo "❌ Failed"
```

### Task 2.2: Move Delivery Manifest

```bash
git mv DELIVERY_MANIFEST.md docs/internal/DELIVERY_MANIFEST.md
[ -f docs/internal/DELIVERY_MANIFEST.md ] && echo "✅ Moved DELIVERY_MANIFEST.md" || echo "❌ Failed"
```

### Task 2.3: Move Creative DNA Truth Table

```bash
git mv CREATIVE_DNA_TRUTH_TABLE.md docs/internal/CREATIVE_DNA_TRUTH_TABLE.md
[ -f docs/internal/CREATIVE_DNA_TRUTH_TABLE.md ] && echo "✅ Moved" || echo "❌ Failed"
```

---

## Migration Phase 3: Deduplicate User-Facing Documentation

These files exist in both root (`/`) and `/docs/`. Keep only the `/docs/` version.

### Task 3.1: Remove Duplicate Release Notes from Root

```bash
# Verify files exist in docs/ first
ls -l docs/RELEASE_*.md docs/VALIDATION_*.md
# Then remove from root
git rm RELEASE_CAPTAIN_SUMMARY.md
git rm RELEASE_NOTES_CREATIVE_DNA.md
git rm VALIDATION_MATRIX.md
git rm RELEASE_INDEX.md
```

**Verify:**
```bash
# These should not exist
[ ! -f RELEASE_CAPTAIN_SUMMARY.md ] && echo "✅ Removed root duplicate" || echo "❌ Still exists"
[ ! -f VALIDATION_MATRIX.md ] && echo "✅ Removed root duplicate" || echo "❌ Still exists"
```

---

## Migration Phase 4: Consolidate Layout Primitives

These 4 files in root should be consolidated into `/templates/primitives/` documentation.

### Task 4.1: Create Archive Directory

```bash
mkdir -p docs/internal/archive
```

### Task 4.2: Create Consolidated Primitives Documentation

```bash
cat > templates/primitives/README.md << 'EOF'
# Layout Primitives Guide

This directory contains pre-built layout components and hooks for award-level UI construction.

## Components

### `layout.tsx`
Core layout component with responsive grid, depth layers, and animation support.

**Features:**
- 8pt spacing system
- 4-layer depth system (--bg, --bg-elevated, --surface, --surface-high)
- Responsive grid from 375px phone to 1440px+ desktop
- GSAP animation ready
- Mobile-first approach

**Import:**
```tsx
import { Layout } from '@/lib/brudi/primitives/layout'
```

**Usage:**
```tsx
<Layout variant="hero" className="relative">
  <h1>Your Content</h1>
</Layout>
```

## Hooks

### `use-scroll-reveal.ts`
Scroll-triggered entrance animations using GSAP + ScrollTrigger.

**Features:**
- GSAP timeline integration
- ScrollTrigger with cleanup
- Stagger support
- Respects `prefers-reduced-motion`

**Import:**
```tsx
import { useScrollReveal } from '@/lib/brudi/primitives/use-scroll-reveal'
```

**Usage:**
```tsx
const { ref, trigger } = useScrollReveal({
  stagger: 0.06,
  duration: 0.8,
})
return <div ref={ref}>Content</div>
```

### `use-stagger-entrance.ts`
Staggered entrance animations for child elements.

**Features:**
- Automatic child enumeration
- Configurable delay & duration
- GSAP + CSS hybrid
- Performance optimized

**Import:**
```tsx
import { useStaggerEntrance } from '@/lib/brudi/primitives/use-stagger-entrance'
```

**Usage:**
```tsx
const containerRef = useStaggerEntrance({
  delay: 0.06,
  duration: 0.6,
})
return <ul ref={containerRef}>{items}</ul>
```

## Design Tokens

### `tokens.ts`
Centralized design system exports.

**Includes:**
- Color scales (light/dark)
- Spacing scale (8pt multiples)
- Typography scale
- Easing functions
- Animation presets

**Import:**
```tsx
import { tokens } from '@/lib/brudi/primitives/tokens'
```

**Usage:**
```tsx
const color = tokens.colors.accent
const spacing = tokens.space[4] // 16px (8pt × 4)
const easing = tokens.easing.power2Out
```

## Integration

1. Copy this entire directory to your project:
   ```bash
   cp -r ~/Brudi/templates/primitives ~/MyProject/src/lib/brudi
   ```

2. Import tokens in your base styles:
   ```css
   @import './src/lib/brudi/tokens';
   ```

3. Use components:
   ```tsx
   import { Layout } from '@/lib/brudi/layout'
   import { useScrollReveal } from '@/lib/brudi/use-scroll-reveal'
   ```

## Version

Primitives v1.0 — Brudi v3.4.0

**Last Updated:** 2024-02-24
EOF
```

**Verify:**
```bash
[ -f templates/primitives/README.md ] && echo "✅ Consolidated primitives doc" || echo "❌ Failed"
```

### Task 4.3: Archive Old Primitives Documentation

```bash
git mv LAYOUT_PRIMITIVES_README.md docs/internal/archive/
git mv LAYOUT_PRIMITIVES_DIFF.md docs/internal/archive/
git mv LAYOUT_PRIMITIVES_INDEX.md docs/internal/archive/
git mv LAYOUT_PRIMITIVES_INTEGRATION.md docs/internal/archive/
```

**Verify:**
```bash
ls -lh docs/internal/archive/LAYOUT_PRIMITIVES_*.md
```

---

## Migration Phase 5: Archive Obsolete Files

### Task 5.1: Archive Postmortem

```bash
git mv VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx docs/internal/archive/
```

**Verify:**
```bash
[ ! -f VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx ] && echo "✅ Archived" || echo "❌ Still in root"
```

---

## Migration Phase 6: Verification & Cleanup

### Task 6.1: Verify Root Directory Contents

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
ls -1 | grep -v '^[a-z]' | sort
```

**Expected output (11 files):**
```
BOOTSTRAP.md
CLAUDE.md
INSTALL.md
LICENSE
README.md
START_HERE.md
VERSION
install.sh
use.sh
.gitignore
.DS_Store (system file, ignore)
```

**Expected directories (5):**
```
orchestration
skills
templates
assets
docs
dev
```

### Task 6.2: Verify No Markdown Files in Root (Except These 6)

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
ls -1 *.md 2>/dev/null | sort
```

**Should output only:**
```
BOOTSTRAP.md
CLAUDE.md
INSTALL.md
README.md
START_HERE.md
```

If there are others, they need investigation.

### Task 6.3: Verify Duplicates Removed

```bash
# These should NOT exist in root anymore
[ ! -f RELEASE_CAPTAIN_SUMMARY.md ] && echo "✅ No duplicate" || echo "❌ Duplicate still exists"
[ ! -f RELEASE_NOTES_CREATIVE_DNA.md ] && echo "✅ No duplicate" || echo "❌ Duplicate still exists"
[ ! -f VALIDATION_MATRIX.md ] && echo "✅ No duplicate" || echo "❌ Duplicate still exists"
[ ! -f AGENTS.md ] && echo "✅ Moved to docs/internal" || echo "❌ Still in root"
```

### Task 6.4: Verify New Documentation Exists

```bash
[ -f docs/internal/REPO_STRUCTURE_POLICY.md ] && echo "✅ Policy exists" || echo "❌ Missing"
[ -f docs/internal/INDEX.md ] && echo "✅ Internal index exists" || echo "❌ Missing"
[ -f templates/README.md ] && echo "✅ Templates guide exists" || echo "❌ Missing"
[ -f templates/primitives/README.md ] && echo "✅ Primitives guide exists" || echo "❌ Missing"
```

### Task 6.5: Verify Archive Directory

```bash
ls -lh docs/internal/archive/
# Should contain:
#   LAYOUT_PRIMITIVES_README.md
#   LAYOUT_PRIMITIVES_DIFF.md
#   LAYOUT_PRIMITIVES_INDEX.md
#   LAYOUT_PRIMITIVES_INTEGRATION.md
#   VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx
```

---

## Migration Phase 7: Git Commit

After all files are moved and verified, create a single atomic commit.

### Task 7.1: Review Changes

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
git status
# Should show all the moves as M (modified) and D (deleted)
# Nothing should show as untracked
```

### Task 7.2: Commit Migration

```bash
git add -A
git commit -m "chore(repo): reorganize structure per REPO_STRUCTURE_POLICY.md

- Move internal docs from root to /docs/internal/ (AGENTS.md, DELIVERY_MANIFEST.md, etc.)
- Remove duplicate release notes from root (keep in /docs/)
- Consolidate layout primitives docs (templates/primitives/README.md)
- Archive obsolete files to /docs/internal/archive/
- Add REPO_STRUCTURE_POLICY.md and supporting documentation
- Create /docs/internal/INDEX.md and /templates/README.md

Result:
- Root directory reduced from 21 to 11 files
- All documentation organized per policy
- Zero breaking changes
- All Git references maintained

See docs/internal/REPO_STRUCTURE_POLICY.md for full policy."
```

### Task 7.3: Verify Commit

```bash
git log --oneline -1
# Should show the commit message above
git log -1 --stat | head -20
# Should show files moved/deleted with +/- counts
```

---

## Post-Migration Verification

### Checklist

- [ ] Root directory has exactly 11 files
- [ ] Root has zero `.md` files except: `README.md`, `INSTALL.md`, `START_HERE.md`, `BOOTSTRAP.md`, `CLAUDE.md`
- [ ] No release notes in root
- [ ] No audit files in root
- [ ] All duplicates removed
- [ ] `/docs/internal/REPO_STRUCTURE_POLICY.md` exists
- [ ] `/docs/internal/INDEX.md` exists
- [ ] `/templates/README.md` exists
- [ ] `/templates/primitives/README.md` exists
- [ ] `/docs/internal/archive/` contains 5 files
- [ ] `git log` shows migration commit
- [ ] `git status` shows clean working tree

### Command to Run Everything

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi

echo "=== Root directory contents ==="
ls -1 | grep -v '^[a-z]' | grep -v '^\\.' | sort

echo ""
echo "=== Markdown files in root ==="
ls -1 *.md 2>/dev/null | wc -l
echo "Expected: 5 (BOOTSTRAP.md, CLAUDE.md, INSTALL.md, README.md, START_HERE.md)"

echo ""
echo "=== Verifying moves ==="
[ ! -f AGENTS.md ] && echo "✅ AGENTS.md moved" || echo "❌ AGENTS.md still in root"
[ ! -f DELIVERY_MANIFEST.md ] && echo "✅ DELIVERY_MANIFEST.md moved" || echo "❌ Still in root"
[ ! -f CREATIVE_DNA_TRUTH_TABLE.md ] && echo "✅ CREATIVE_DNA_TRUTH_TABLE.md moved" || echo "❌ Still in root"

echo ""
echo "=== Verifying deduplication ==="
[ ! -f RELEASE_CAPTAIN_SUMMARY.md ] && echo "✅ Duplicate RELEASE notes removed" || echo "❌ Still in root"
[ ! -f VALIDATION_MATRIX.md ] && echo "✅ Duplicate VALIDATION removed" || echo "❌ Still in root"

echo ""
echo "=== Verifying new documentation ==="
[ -f docs/internal/REPO_STRUCTURE_POLICY.md ] && echo "✅ Policy created" || echo "❌ Missing"
[ -f docs/internal/INDEX.md ] && echo "✅ Internal index created" || echo "❌ Missing"
[ -f templates/README.md ] && echo "✅ Templates guide created" || echo "❌ Missing"
[ -f templates/primitives/README.md ] && echo "✅ Primitives guide created" || echo "❌ Missing"

echo ""
echo "=== Archive contents ==="
ls -1 docs/internal/archive/ 2>/dev/null | wc -l
echo "Expected: 5 files"
```

---

## Rollback Procedure (If Needed)

If something goes wrong, rollback is simple (Git handles all moves):

```bash
cd /sessions/optimistic-quirky-franklin/mnt/brudi
git reset --hard HEAD~1
# This reverts all changes to the previous state
```

---

## What This Achieves

✅ **Clear structure:** Root directory is lean and focused
✅ **Zero duplication:** Single source of truth for all documentation
✅ **Organized:** Internal vs. user-facing docs clearly separated
✅ **Maintainable:** New team members know "where things go"
✅ **Non-breaking:** All functionality preserved, all Git history intact
✅ **Policy-driven:** Rules established for future additions

---

## Next Steps

1. Run this migration checklist
2. Review changes with: `git diff --cached`
3. Commit with the provided message
4. Push to remote: `git push origin main`
5. Distribute `REPO_STRUCTURE_POLICY.md` to team
6. Establish code review rule: "New files must follow policy"

---

**Created by:** Agent 8 (Repo Hygiene)
**Date:** 2024-02-24
**Companion Document:** `docs/internal/REPO_STRUCTURE_POLICY.md`
