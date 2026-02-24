# BRUDI — SYNC INVENTORY
Date: 2026-02-24
Base Commit: cfc6f66 (v3.4.0)
Branch: main

---

## TRACKED MODIFICATIONS (4 files, +157/-9)

| File | Insertions | Deletions | Description |
|------|-----------|-----------|-------------|
| orchestration/brudi-gate.sh | +103 | -6 | Hard gates L5/L6, QG-prefix validation, TS strict, P&E check |
| orchestration/pre-commit | +13 | -2 | Problems_and_Effectivity.md enforcement |
| templates/CLAUDE.md | +2 | -0 | Skill refs (layout-primitives, token-bridge) |
| use.sh | +48 | -1 | BRUDI_DIR flex, primitives copy, P&E setup |

## UNTRACKED FILES (188 total)

| Kategorie | Pfade | #Files | Risk | Commit-Plan |
|-----------|-------|--------|------|-------------|
| Root-Level Loose Docs | `*.md`, `*.docx` in `/` | 11 | Med | Commit 5 (move to docs/internal first) |
| docs/internal/ Reports | `docs/internal/*.md` | 45 | Low | Commit 5 |
| docs/internal/ast-fixtures/ | `docs/internal/ast-fixtures/**` | 56 | Low | Commit 2 |
| docs/internal/fixtures/ | `docs/internal/fixtures/**` | 27 | Low | Commit 2 |
| docs/internal/outcome-fixtures/ | `docs/internal/outcome-fixtures/**` | 2 | Low | Commit 3 |
| docs/internal/backups/ | `docs/internal/backups/*.tar.gz` | 1 | Low | EXCLUDE (.gitignore) |
| orchestration/ast-engine/ | `orchestration/ast-engine/**` | 20 | High | Commit 2 |
| orchestration/outcome-engine/ | `orchestration/outcome-engine/**` | 11 | High | Commit 3 |
| orchestration/ (other) | `brudi-gate-constraints.sh`, `CONSTRAINTS-README.md` | 2 | Med | Commit 1 |
| skills/ | `skills/**` | 7 | Med | Commit 4 |
| templates/primitives/ | `templates/primitives/**` | 4 | Med | Commit 4 |

## COMMIT PLAN

| Commit | Scope | Content |
|--------|-------|---------|
| 1 | Core Orchestration | Modified: brudi-gate.sh, pre-commit, use.sh, CLAUDE.md + New: brudi-gate-constraints.sh, CONSTRAINTS-README.md |
| 2 | AST Engine (Layer 5) | orchestration/ast-engine/** + docs/internal/ast-fixtures/** + docs/internal/fixtures/** |
| 3 | Outcome Engine (Layer 6) | orchestration/outcome-engine/** + docs/internal/outcome-fixtures/** |
| 4 | Skills + Primitives | skills/** + templates/primitives/** |
| 5 | Docs + Reports | docs/internal/*.md (reports) + root-level loose files (moved to docs/internal/) |

## EXCLUSIONS

| Path | Reason |
|------|--------|
| docs/internal/backups/*.tar.gz | Backup artifact, add to .gitignore |
| orchestration/ast-engine/node_modules/ | Dependencies, already in .gitignore |
| orchestration/outcome-engine/node_modules/ | Dependencies, already in .gitignore |
