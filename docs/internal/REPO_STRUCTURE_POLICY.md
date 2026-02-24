# Brudi Repository Structure & Organization Policy

**Document Status:** Audit & Policy Definition
**Date:** 2024-02-24
**Scope:** Complete repo hygiene, file placement rules, naming conventions, and migration path

---

## Executive Summary

The Brudi repository contains **180+ files** across 6 primary directories and a deeply nested root. The current structure has evolved through multiple development phases and contains:

- **Critical issues:** Scattered documentation (root vs `/docs/`), duplicated files in multiple locations, large audit artifacts mixed with runtime code
- **Design debt:** Root-level files that should be in subdirectories, inconsistent naming (CAPS_SNAKE vs lowercase-kebab)
- **Success factors:** Clear core structure (skills/, orchestration/, assets/, templates/), well-organized internal audits

**This policy establishes a single source of truth for "what goes where" and provides a clear migration path.**

---

## Current State Analysis

### Root Directory Contents (21 files + 5 directories)

**Public-facing documentation (keeper):**
- `README.md` (183 lines) — project overview
- `LICENSE` — MIT license
- `VERSION` — version file
- `START_HERE.md` (235 lines) — user entry point
- `INSTALL.md` (182 lines) — installation guide
- `BOOTSTRAP.md` (87 lines) — bootstrap instructions

**Agent configuration (keeper):**
- `CLAUDE.md` (544 lines) — agent prompt/instructions (CRITICAL: keep for .claude/config.txt compatibility)

**Scripts (keeper):**
- `install.sh` — installation script
- `use.sh` — project bootstrapper script

**Internal/Audit Documents (MISPLACED — should be in docs/internal/):**
- `AGENTS.md` (153 lines) — agent process documentation
- `DELIVERY_MANIFEST.md` (586 lines) — delivery report
- `RELEASE_CAPTAIN_SUMMARY.md` (332 lines) — release summary
- `RELEASE_INDEX.md` (430 lines) — release index
- `RELEASE_NOTES_CREATIVE_DNA.md` (526 lines) — release notes
- `VALIDATION_MATRIX.md` (218 lines) — validation matrix
- `CREATIVE_DNA_TRUTH_TABLE.md` (182 lines) — truth table
- `LAYOUT_PRIMITIVES_*.md` (4 files, 1.4 KB total) — layout documentation

**Artifacts (OBSOLETE — should be archived):**
- `VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx` — postmortem analysis (old format)

### File Categorization

| Category | Count | Status | Location |
|----------|-------|--------|----------|
| Public-facing docs | 5 | ✅ Correct | `/` |
| Agent config | 1 | ✅ Correct | `/` |
| Executable scripts | 2 | ✅ Correct | `/` |
| Release notes & audits | 14 | ❌ Misplaced | Root (should be `/docs/internal/`) |
| Layout primitives docs | 4 | ❌ Misplaced | Root (should be `/templates/primitives/`) |
| Orphaned artifacts | 1 | ❌ Obsolete | Root (should be archived) |
| Internal documentation | 38+ | ✅ Correct | `/docs/internal/` |
| User-facing docs | 10 | ✅ Correct | `/docs/` |
| Testing docs | 20+ | ✅ Correct | `/docs/testing/` |
| Skills | 60+ | ✅ Correct | `/skills/` |
| Orchestration | 12+ | ✅ Correct | `/orchestration/` |
| Assets | 27+ | ✅ Correct | `/assets/` |
| Templates | 8+ | ✅ Correct | `/templates/` |
| Dev tooling | 9+ | ✅ Correct | `/dev/` |

### Duplicate/Redundant Files

| File | Location 1 | Location 2 | Status |
|------|-----------|-----------|--------|
| `VALIDATION_MATRIX.md` | `/` | `/docs/` | Keep in `/docs/`, remove from `/` |
| `RELEASE_CAPTAIN_SUMMARY.md` | `/` | `/docs/` | Keep in `/docs/`, remove from `/` |
| `RELEASE_NOTES_CREATIVE_DNA.md` | `/` | `/docs/` | Keep in `/docs/`, remove from `/` |

---

## Target Repository Structure

```
brudi/
├── README.md                          # ✅ KEEPER: Public-facing project overview
├── LICENSE                            # ✅ KEEPER: MIT license
├── VERSION                            # ✅ KEEPER: Current version tag
├── START_HERE.md                      # ✅ KEEPER: User entry point
├── INSTALL.md                         # ✅ KEEPER: Installation guide
├── BOOTSTRAP.md                       # ✅ KEEPER: Bootstrap instructions
├── CLAUDE.md                          # ✅ KEEPER: Agent config (used by .claude/config.txt)
│
├── install.sh                         # ✅ KEEPER: Installation executor
├── use.sh                             # ✅ KEEPER: Project bootstrap executor
│
├── .claude/                           # Agent context directory (read-only)
│   └── config.txt
│
├── orchestration/                     # Gate enforcement & compliance
│   ├── brudi-gate.sh                 # Main gate runner
│   ├── brudi-gate-constraints.sh     # Constraint enforcement
│   ├── brudi-gate-complexity.sh      # Complexity tracking
│   ├── motion-compliance-check.sh    # Motion protocol validation
│   ├── pre-commit                    # Git pre-commit hook
│   ├── state.schema.json             # State file schema
│   ├── state.init.json               # Initial state template
│   ├── CONSTRAINTS-README.md         # Constraint documentation
│   ├── COMPLEXITY_EVIDENCE_SCHEMA.md # Complexity schema
│   └── eslint-rules/                 # ESLint custom rules
│       ├── brudi-creative-dna.js
│       ├── README.md
│       ├── CHANGELOG.md
│       ├── EXAMPLES.md
│       ├── QUICK-REFERENCE.md
│       ├── INTEGRATION.md
│       ├── INDEX.md
│       ├── MANIFEST.txt
│       └── test-cases.js
│
├── skills/                            # Skill files (60+ skills)
│   ├── starting-a-project/
│   │   └── SKILL.md
│   ├── verifying-ui-quality/
│   │   └── SKILL.md
│   ├── crafting-brand-systems/
│   │   └── SKILL.md
│   │   (... 57 more skills ...)
│   └── visualizing-data/
│       └── SKILL.md
│
├── templates/                         # Project templates
│   ├── CLAUDE.md                     # Template: agent config
│   ├── CLAUDE.example.md             # Template example
│   ├── TASK.md                       # Template: task definition
│   ├── PROJECT_STATUS.md             # Template: status tracking
│   ├── eslint.config.brudi.js        # Template: ESLint config
│   ├── settings.json                 # Template: editor settings
│   └── primitives/                   # NEW: Layout primitives
│       ├── layout.tsx                # Core layout component
│       ├── tokens.ts                 # Token system
│       ├── use-scroll-reveal.ts      # Scroll reveal hook
│       └── use-stagger-entrance.ts   # Stagger entrance hook
│
├── assets/                            # Reusable assets
│   ├── INDEX.md                      # Asset directory
│   ├── README.md                     # Asset guide
│   ├── configs/                      # Configuration templates
│   │   ├── design-tokens.css
│   │   ├── globals.css
│   │   ├── gsap-snippets.ts
│   │   ├── framer-motion-snippets.ts
│   │   ├── motion.protocol.ts
│   │   └── next-intl-v4.ts
│   ├── fonts/                        # Variable fonts
│   │   ├── FONTS.md
│   │   └── woff2/
│   │       ├── CabinetGrotesk-Variable.woff2
│   │       ├── ClashDisplay-Variable.woff2
│   │       ├── GeneralSans-Variable.woff2
│   │       ├── Satoshi-Variable.woff2
│   │       └── Switzer-Variable.woff2
│   ├── i18n/                         # Translation assets
│   │   ├── STRUCTURE.md
│   │   ├── base.de.json
│   │   ├── base.en.json
│   │   ├── base.es.json
│   │   ├── base.fr.json
│   │   ├── base.it.json
│   │   └── base.pt.json
│   ├── legal/                        # Legal templates
│   │   ├── legal.de.json
│   │   ├── legal.en.json
│   │   ├── legal.es.json
│   │   ├── legal.fr.json
│   │   ├── legal.it.json
│   │   └── legal.pt.json
│   └── patterns/                     # Code patterns
│       ├── gsap-react-cleanup.md
│       ├── keyboard-accessibility.md
│       ├── lenis-quick-setup.md
│       └── reduced-motion.md
│
├── docs/                              # All documentation
│   ├── README.md                     # Docs index (consider adding)
│   ├── USER_GUIDE.md                 # User documentation
│   ├── TROUBLESHOOTING.md            # Troubleshooting guide
│   ├── IDENTITY.md                   # Project identity
│   ├── philosophy.md                 # Design philosophy
│   ├── contributing.md               # Contribution guidelines
│   │
│   ├── internal/                     # Internal/audit documentation
│   │   ├── INDEX.md                  # Internal docs index
│   │   ├── REPO_STRUCTURE_POLICY.md  # THIS FILE
│   │   ├── MASTERPLAN.md             # Master planning doc
│   │   ├── SKILL_WORKPLAN.md         # Skill development plan
│   │   ├── SKILL_EVOLUTION.md        # Skill evolution tracking
│   │   ├── SKILL_LEARNINGS.md        # Skill learnings
│   │   ├── STABILITY_LOCKDOWN_CHECKLIST.md
│   │   ├── QUICK_REFERENCE_CONSTRAINT_LAYER.md
│   │   ├── CONSTRAINT-GATE-SPEC.md
│   │   ├── CONSTRAINT-GATE-IMPLEMENTATION.md
│   │   ├── CONSTRAINT_LAYER_WIRING_MANIFEST.md
│   │   ├── README_CONSTRAINT_LAYER_IMPLEMENTATION.md
│   │   ├── INTEGRATION-PATCH.md
│   │   ├── INSTALLATIONS_INTEGRITAET.md
│   │   ├── META_ANALYSE_KONSOLIDIERUNG.md
│   │   ├── DELIVERY_SUMMARY.md
│   │   ├── PATCHES_TEMPLATES_CLAUDE.md
│   │   ├── PATCHES_TEMPLATES_TASK.md
│   │   ├── PATCHES_TEMPLATES_PROJECT_STATUS.md
│   │   ├── BRUDI_V32_ANALYSIS.md
│   │   │
│   │   ├── audits/                   # Audit artifacts (archived)
│   │   │   ├── AGENT1_CARTOGRAPHY_EVIDENCE.md
│   │   │   ├── CARTOGRAPHY_REPORT_AGENT1.md
│   │   │   ├── MODE_ENFORCEMENT_AUDIT_README.md
│   │   │   ├── MODE_ENFORCEMENT_SECURITY_AUDIT.md
│   │   │   ├── MODE_ENFORCEMENT_EXECUTIVE_SUMMARY.md
│   │   │   ├── MODE_ENFORCEMENT_EVIDENCE_INDEX.md
│   │   │   ├── BRUDI_CREATIVE_DNA_v1.md
│   │   │   ├── BRUDI_ENTERPRISE_AUDIT_REPORT.md
│   │   │   ├── BRUDI_ELITE_SYSTEM_AUDIT_REPORT.md
│   │   │   ├── INTEGRATION_PROOF_TRUTH_TABLE.md
│   │   │   ├── MOTION_PROTOCOL_README.md
│   │   │   └── DELIVERABLES.txt
│   │   │
│   │   └── fixtures/                 # Test fixtures
│   │       ├── constraint-gate-PASS/
│   │       │   └── src/
│   │       │       ├── app/page.tsx
│   │       │       ├── components/layout.tsx
│   │       │       └── styles/globals.css
│   │       └── constraint-gate-FAIL/
│   │           └── src/
│   │               ├── app/page.tsx
│   │               ├── components/Header.tsx
│   │               └── styles/globals.css
│   │
│   └── testing/                      # Skill testing & validation
│       ├── animating-interfaces-test.md
│       ├── architecting-saas-test.md
│       ├── building-accessibly-test.md
│       ├── building-interactions-test.md
│       ├── building-layouts-test.md
│       ├── building-with-nextjs-test.md
│       ├── crafting-typography-test.md
│       ├── creating-visual-depth-test.md
│       ├── designing-award-layouts-test.md
│       ├── designing-for-awards-test.md
│       ├── designing-saas-ux-test.md
│       ├── designing-with-perception-test.md
│       ├── developing-with-react-test.md
│       ├── fetching-data-correctly-test.md
│       ├── handling-data-sync-test.md
│       ├── integrating-supabase-test.md
│       ├── maintaining-quality-test.md
│       ├── making-tech-decisions-test.md
│       ├── optimizing-performance-test.md
│       ├── orchestrating-css-js-animations-test.md
│       ├── scrolling-with-purpose-test.md
│       ├── testing-user-interfaces-test.md
│       ├── typing-with-typescript-test.md
│       └── TESTING_PROTOCOL.md       # Consider adding
│
├── dev/                               # Development tooling (internal only)
│   ├── AGENT-PROCESS-V3.md           # Agent process documentation
│   ├── PLAN.md                       # Dev planning
│   ├── PROGRESS.md                   # Progress tracking
│   ├── BRUDI_SKILL-MAP_ROADMAP.docx  # Skill roadmap (consider migrating)
│   ├── research/
│   │   └── visual-depth-errors.md    # Research notes
│   └── scripts/
│       ├── setup-brudi.sh            # Setup script
│       ├── setup-hooks.sh            # Hook setup
│       ├── com.brudi.autosync.plist.template
│       ├── post-merge
│       └── hooks/
│           └── post-commit

└── .gitignore                         # ✅ KEEPER: Git ignore rules
```

---

## Directory Purpose Map

### Root Directory

**Purpose:** Public entry points and critical configuration
**Rule:** Only essential files that users/agents encounter first

| File | Purpose | Owner |
|------|---------|-------|
| `README.md` | Project overview | Documentation |
| `LICENSE` | Legal license | Legal |
| `VERSION` | Current version | Release |
| `INSTALL.md` | Installation instructions | Documentation |
| `START_HERE.md` | User entry point | Documentation |
| `BOOTSTRAP.md` | Bootstrap guide | Documentation |
| `CLAUDE.md` | Agent instructions | Config |
| `install.sh` | Installation executor | Ops |
| `use.sh` | Project bootstrapper | Ops |
| `.gitignore` | Git ignore rules | Version control |

**Anti-patterns:**
- ❌ No release notes here (use `/docs/internal/`)
- ❌ No audit documents here (use `/docs/internal/audits/`)
- ❌ No design documentation here (use `/docs/` or `/skills/`)

---

### `orchestration/`

**Purpose:** Gate enforcement, state management, compliance checking
**Rule:** Runtime scripts and schemas only; documentation belongs in `/docs/internal/`

| File | Purpose |
|------|---------|
| `brudi-gate.sh` | Main gate runner (pre-slice, post-slice, phase-gate) |
| `brudi-gate-constraints.sh` | Constraint enforcement layer |
| `brudi-gate-complexity.sh` | Complexity evidence tracking |
| `motion-compliance-check.sh` | Motion protocol validator |
| `pre-commit` | Git pre-commit hook |
| `state.schema.json` | JSON schema for state files |
| `state.init.json` | Initial state template |
| `CONSTRAINTS-README.md` | Constraint documentation (read by agents) |
| `COMPLEXITY_EVIDENCE_SCHEMA.md` | Complexity schema reference |
| `eslint-rules/` | Custom ESLint rules |

**Anti-patterns:**
- ❌ Do NOT store release notes here
- ❌ Do NOT store audit reports here
- ❌ Do NOT store skill documentation here

---

### `skills/`

**Purpose:** Domain-specific skill files (read on demand by agents)
**Rule:** Each skill is a directory with `SKILL.md` as the entry point

**Structure (per skill):**
```
skills/[skill-name]/
├── SKILL.md          # REQUIRED: Skill documentation
├── examples.md       # Optional: code examples
├── checklist.md      # Optional: verification checklist
└── [other files]     # Optional: resources
```

**Current count:** 60+ skills, all correctly placed

---

### `templates/`

**Purpose:** Reusable project templates (copied into new projects)
**Rule:** Each template is a starting point, not documentation

| Item | Purpose | Structure |
|------|---------|-----------|
| `CLAUDE.md` | Agent config template | Template file |
| `CLAUDE.example.md` | Example agent config | Reference |
| `TASK.md` | Task definition template | Template file |
| `PROJECT_STATUS.md` | Status tracking template | Template file |
| `eslint.config.brudi.js` | ESLint config template | Template file |
| `settings.json` | Editor settings template | Template file |
| `primitives/` | Layout primitives | Components + hooks |

**Anti-patterns:**
- ❌ Do NOT store documentation here (use `/skills/` or `/docs/`)
- ❌ Do NOT store audit files here (use `/docs/internal/`)

---

### `assets/`

**Purpose:** Reusable design & code assets (fonts, tokens, patterns)
**Rule:** Production-ready resources, indexed via `INDEX.md`

| Directory | Purpose |
|-----------|---------|
| `configs/` | CSS/TS configuration templates |
| `fonts/` | Variable font files |
| `i18n/` | Translation JSON files (6 languages) |
| `legal/` | Legal template JSON files |
| `patterns/` | Code pattern documentation |

**Discovery:** All assets indexed in `assets/INDEX.md`

---

### `docs/`

**Purpose:** User-facing and internal documentation
**Rule:** Split into `/docs/` (user-facing) and `/docs/internal/` (internal/audit)

#### `docs/` (User-Facing)

| File | Purpose |
|------|---------|
| `USER_GUIDE.md` | User documentation |
| `TROUBLESHOOTING.md` | Troubleshooting guide |
| `IDENTITY.md` | Project identity & philosophy |
| `philosophy.md` | Design philosophy |
| `contributing.md` | Contribution guidelines |

#### `docs/internal/` (Internal)

**Subdirectories:**

| Directory | Purpose |
|-----------|---------|
| `audits/` | Previous audit artifacts (archived) |
| `fixtures/` | Test fixtures for constraint gate |

**Files (planning & reference):**

| File | Purpose | Category |
|------|---------|----------|
| `MASTERPLAN.md` | Master planning document | Planning |
| `SKILL_WORKPLAN.md` | Skill development plan | Planning |
| `SKILL_EVOLUTION.md` | Skill evolution tracking | Planning |
| `SKILL_LEARNINGS.md` | Skill learnings & notes | Reference |
| `CONSTRAINT-GATE-SPEC.md` | Gate constraint specifications | Technical |
| `CONSTRAINT-GATE-IMPLEMENTATION.md` | Gate implementation details | Technical |
| `CONSTRAINT_LAYER_WIRING_MANIFEST.md` | Constraint wiring manifest | Technical |
| `INTEGRATION-PATCH.md` | Integration patches | Technical |
| `PATCHES_TEMPLATES_*.md` | Template patches | Technical |
| `STABILITY_LOCKDOWN_CHECKLIST.md` | Stability checklist | Checklist |
| `QUICK_REFERENCE_CONSTRAINT_LAYER.md` | Quick reference | Reference |
| `README_CONSTRAINT_LAYER_IMPLEMENTATION.md` | Constraint layer guide | Guide |
| `META_ANALYSE_KONSOLIDIERUNG.md` | Meta analysis | Research |
| `DELIVERY_SUMMARY.md` | Delivery summary | Summary |
| `BRUDI_V32_ANALYSIS.md` | v3.2 analysis | Analysis |

#### `docs/testing/` (Skill Testing)

All files are `-test.md` versions of skills — used for validation and testing.

---

### `dev/`

**Purpose:** Development tooling and processes (internal use only)
**Rule:** Process documentation, not user-facing

| Item | Purpose |
|------|---------|
| `AGENT-PROCESS-V3.md` | Agent process documentation |
| `PLAN.md` | Development planning |
| `PROGRESS.md` | Progress tracking |
| `research/` | Research notes |
| `scripts/` | Development scripts & hooks |

---

## File Placement Decision Tree

**When adding a new file, answer these questions in order:**

```
1. Is it a skill (domain-specific knowledge)?
   YES → /skills/[skill-name]/SKILL.md
   NO  → Continue to 2

2. Is it a template (copied into projects)?
   YES → /templates/[template-name] or /templates/[category]/
   NO  → Continue to 3

3. Is it a reusable asset (fonts, configs, patterns)?
   YES → /assets/[category]/
   NO  → Continue to 4

4. Is it a gate script, schema, or ESLint rule?
   YES → /orchestration/ (with docs in /docs/internal/)
   NO  → Continue to 5

5. Is it user-facing documentation?
   YES → /docs/[filename].md
   NO  → Continue to 6

6. Is it an audit, internal analysis, or technical reference?
   YES → /docs/internal/[filename].md
   NO  → Continue to 7

7. Is it a development process or tool?
   YES → /dev/[filename].md or /dev/scripts/
   NO  → Continue to 8

8. Is it critical infrastructure (README, LICENSE, installation)?
   YES → Root directory (/) with approval
   NO  → ERROR: Misplaced file. Review decision tree.
```

---

## Naming Convention Policy

### Directory Names

**Rule:** `lowercase-kebab-case`

| Category | Pattern | Example |
|----------|---------|---------|
| Skill directories | `[skill-name]` | `crafting-typography`, `building-layouts` |
| Feature directories | `[feature-name]` | `eslint-rules`, `constraint-gate-PASS` |
| Content directories | `[content-type]` | `audits`, `fixtures`, `testing` |

### File Names

**Rule:** Context-dependent

| File Type | Pattern | Example |
|-----------|---------|---------|
| Public docs | `UPPERCASE_WITH_UNDERSCORES` or `lowercase-kebab-case` | `README.md`, `START_HERE.md` |
| Agent instructions | `UPPERCASE.md` | `CLAUDE.md` |
| Internal docs | `UPPERCASE_WITH_UNDERSCORES` | `DELIVERY_MANIFEST.md` |
| Scripts | `lowercase-kebab-case.sh` | `brudi-gate.sh`, `setup-hooks.sh` |
| Skills | `SKILL.md` (in skill directory) | `skills/crafting-typography/SKILL.md` |
| Templates | Template name pattern | `TASK.md`, `PROJECT_STATUS.md` |
| Configs | `filename.extension` | `design-tokens.css`, `eslint.config.brudi.js` |
| JSON schemas | `filename.schema.json` | `state.schema.json` |
| Tests | `[name]-test.md` | `crafting-typography-test.md` |

### Consistency Rules

**Applied across all files:**

| Pattern | ✅ Correct | ❌ Incorrect | Reason |
|---------|-----------|-------------|--------|
| Underscores in dirs | `eslint-rules` | `eslint_rules` | Kebab case standard |
| Multi-word skills | `crafting-typography` | `CraftingTypography` | Consistency |
| Acronyms | `gsap-lenis` | `GSAP-Lenis` | Lowercase standard |
| Test files | `skill-name-test.md` | `skill-name.test.md` | Clarity |

---

## Current Violations & Migration Plan

### Critical Violations (Root Level Files)

| File | Current | Target | Reason | Action |
|------|---------|--------|--------|--------|
| `AGENTS.md` | `/` | `/docs/internal/` | Agent process doc | Move |
| `DELIVERY_MANIFEST.md` | `/` | `/docs/internal/` | Internal delivery report | Move |
| `RELEASE_CAPTAIN_SUMMARY.md` | `/` | `/docs/internal/` OR `/docs/` | Release documentation | Keep in `/docs/`, remove from `/` |
| `RELEASE_INDEX.md` | `/` | `/docs/internal/` OR `/docs/` | Release index | Keep in `/docs/internal/`, remove from `/` |
| `RELEASE_NOTES_CREATIVE_DNA.md` | `/` | `/docs/internal/` OR `/docs/` | Release notes | Keep in `/docs/`, remove from `/` |
| `VALIDATION_MATRIX.md` | `/` | `/docs/internal/` OR `/docs/` | Validation matrix | Keep in `/docs/`, remove from `/` |
| `CREATIVE_DNA_TRUTH_TABLE.md` | `/` | `/docs/internal/` | Truth table | Move |

### Documentation Duplication

| File | Current Locations | Target | Action |
|------|------------------|--------|--------|
| `VALIDATION_MATRIX.md` | `/`, `/docs/` | `/docs/` | Remove from `/` |
| `RELEASE_CAPTAIN_SUMMARY.md` | `/`, `/docs/` | `/docs/` | Remove from `/` |
| `RELEASE_NOTES_CREATIVE_DNA.md` | `/`, `/docs/` | `/docs/` | Remove from `/` |

### Layout Primitives Migration

| File | Current | Target | Status |
|------|---------|--------|--------|
| `LAYOUT_PRIMITIVES_README.md` | `/` | `/templates/primitives/README.md` | Move + consolidate |
| `LAYOUT_PRIMITIVES_DIFF.md` | `/` | `/docs/internal/PRIMITIVES_MIGRATION.md` | Archive + consolidate |
| `LAYOUT_PRIMITIVES_INDEX.md` | `/` | `/templates/primitives/INDEX.md` | Move + consolidate |
| `LAYOUT_PRIMITIVES_INTEGRATION.md` | `/` | `/templates/primitives/INTEGRATION.md` | Move + consolidate |

### Obsolete Files

| File | Current | Status | Action |
|------|---------|--------|--------|
| `VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx` | `/` | Obsolete (docx format) | Archive in `/docs/internal/archive/` |

---

## Migration Execution Plan

### Phase 1: Document Root-Level Files (No Deletions)

1. Create `/docs/internal/REPO_STRUCTURE_POLICY.md` (this file) ✅
2. Create index files in subdirectories:
   - `/docs/internal/INDEX.md` — Index of internal documentation
   - `/templates/README.md` — Templates guide
   - `/assets/INDEX.md` — Already exists, verify complete

### Phase 2: Move Misplaced Internal Documentation

**Files to move to `/docs/internal/`:**
```bash
mv AGENTS.md → docs/internal/AGENTS.md
mv DELIVERY_MANIFEST.md → docs/internal/DELIVERY_MANIFEST.md
mv CREATIVE_DNA_TRUTH_TABLE.md → docs/internal/CREATIVE_DNA_TRUTH_TABLE.md
```

**Files to keep in `/docs/` (already duplicated there):**
- `RELEASE_CAPTAIN_SUMMARY.md` — Remove root copy
- `RELEASE_NOTES_CREATIVE_DNA.md` — Remove root copy
- `VALIDATION_MATRIX.md` — Remove root copy

**After move, remove duplicates from root:**
```bash
rm RELEASE_CAPTAIN_SUMMARY.md
rm RELEASE_NOTES_CREATIVE_DNA.md
rm VALIDATION_MATRIX.md
rm RELEASE_INDEX.md (consolidate into docs/)
```

### Phase 3: Consolidate Layout Primitives

**Create `/templates/primitives/README.md`:**
- Consolidate all 4 LAYOUT_PRIMITIVES_*.md files into single guide
- Keep implementation examples (`layout.tsx`, `tokens.ts`, etc.)

**Archive old files to `/docs/internal/archive/`:**
```bash
mkdir -p docs/internal/archive
mv LAYOUT_PRIMITIVES_README.md → docs/internal/archive/
mv LAYOUT_PRIMITIVES_DIFF.md → docs/internal/archive/
mv LAYOUT_PRIMITIVES_INDEX.md → docs/internal/archive/
mv LAYOUT_PRIMITIVES_INTEGRATION.md → docs/internal/archive/
```

### Phase 4: Archive Obsolete Files

```bash
mkdir -p docs/internal/archive
mv VOIDLAB_POSTMORTEM_BRUDI_DIAGNOSIS.docx → docs/internal/archive/
```

### Phase 5: Update Root Directory

**Final root directory contents (11 files + 5 dirs):**

```
brudi/
├── README.md
├── LICENSE
├── VERSION
├── INSTALL.md
├── START_HERE.md
├── BOOTSTRAP.md
├── CLAUDE.md
├── install.sh
├── use.sh
├── .gitignore
├── orchestration/
├── skills/
├── templates/
├── assets/
├── docs/
└── dev/
```

---

## Maintenance Rules (Going Forward)

### Rule 1: Root Directory is Sacred

**Only these file types belong in root:**
- Public documentation (`README.md`, `INSTALL.md`, `START_HERE.md`)
- Agent configuration (`CLAUDE.md`)
- Executable scripts (`install.sh`, `use.sh`)
- Infrastructure files (`LICENSE`, `VERSION`, `.gitignore`)

**All other files → must go in subdirectories**

### Rule 2: Skills Are Immutable

**Each skill directory has exactly this structure:**
```
skills/[name]/
├── SKILL.md           (required)
├── examples.md        (optional)
└── [other files]      (optional)
```

New skills are added, never modified in-place. Version tracking via Git.

### Rule 3: Documentation Has a Home

**Question: Where does [new doc] go?**

- If it's about HOW to do something → `/skills/` or `/docs/`
- If it's about WHY something works → `/docs/internal/`
- If it's a process or audit → `/docs/internal/`
- If it's reusable code → `/templates/` or `/assets/`
- If it's development process → `/dev/`
- If it's user-facing → `/docs/`

**Rule:** NO documentation goes in root.

### Rule 4: Naming is Consistent

**Before adding a file, check:**
1. ✅ Directory names: `lowercase-kebab-case`
2. ✅ Script names: `lowercase-kebab-case.sh`
3. ✅ Skill dirs: `lowercase-kebab-case` + `SKILL.md`
4. ✅ Doc names: `UPPERCASE_SNAKE_CASE` or context-appropriate

### Rule 5: Duplication is Forbidden

**When creating a new file:**
1. Search for existing files with similar names
2. If duplicate exists → consolidate, don't copy
3. If it needs to exist in multiple places → use symlinks or git submodules, not copies
4. Update `INDEX.md` to reference consolidated location

---

## Verification Checklist

**After completing migration, verify:**

- [ ] Root directory has exactly 11 files + 5 directories
- [ ] No `.md` files in root except: `README.md`, `INSTALL.md`, `START_HERE.md`, `BOOTSTRAP.md`
- [ ] No release notes in root (all in `/docs/` or `/docs/internal/`)
- [ ] No audit files in root (all in `/docs/internal/audits/` or `/docs/internal/archive/`)
- [ ] No duplicated files across locations
- [ ] `/docs/internal/REPO_STRUCTURE_POLICY.md` exists
- [ ] `/docs/internal/INDEX.md` created and maintained
- [ ] `/templates/primitives/README.md` consolidates all layout docs
- [ ] `/docs/internal/archive/` contains obsolete files
- [ ] All scripts in root are executable (`install.sh`, `use.sh`)
- [ ] All directory names follow `lowercase-kebab-case`
- [ ] All skill directories have `SKILL.md` entry point
- [ ] `assets/INDEX.md` is complete and current
- [ ] `.gitignore` is present and excludes `node_modules/`, `.git/`, `*.DS_Store`

---

## Summary

| Aspect | Current | Target | Change |
|--------|---------|--------|--------|
| Root files | 21 | 11 | -45% |
| Duplicated files | 3+ | 0 | Consolidated |
| Directory structure | Mixed | Clear | Organized |
| Naming consistency | 70% | 100% | Enforced |
| Documentation locations | Scattered | Grouped | Centralized |
| Total files (non-code) | 180+ | 180+ | Reorganized only |

**Result:** A clean, maintainable repository structure with clear ownership, consistent naming, and zero duplications.

---

## Questions & Decision Log

**Q: Why keep `CLAUDE.md` in root?**
A: It's referenced by `.claude/config.txt` and is the agent's first config file. It bridges the gap between the repo and agent context.

**Q: Why not put all docs in `/docs/`?**
A: `/docs/internal/` separates user-facing docs from internal/audit docs. This makes it clear which docs are meant for external sharing.

**Q: Why consolidate instead of keep multiple?**
A: Duplication creates maintenance debt. Single source of truth reduces sync issues and confusion.

**Q: What about brand-new documentation types?**
A: Use the decision tree. If unsure, ask: "Is this user-facing?" Yes = `/docs/`. No = `/docs/internal/`. Process = `/dev/`.

---

**Document Owner:** Agent 8 (Repo Hygiene)
**Last Updated:** 2024-02-24
**Next Review:** After migration completion
