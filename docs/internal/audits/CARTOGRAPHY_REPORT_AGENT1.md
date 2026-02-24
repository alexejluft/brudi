# BRUDI REPOSITORY CARTOGRAPHY REPORT
**Date:** 2026-02-24  
**Agent:** Agent 1 — Repo Cartographer  
**Mission:** Map all Brudi core files and identify Creative DNA implementation targets

---

## 1. REPOSITORY ROOT STRUCTURE

### Base Path
`/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/`

### Top-Level Directories
```
brudi/
├── .brudi/              [Project state — NOT in repo template, created by use.sh]
├── .claude/             [User context directory]
├── .git/                [Git repository metadata]
├── assets/              [Pre-built templates, tokens, i18n, legal, patterns]
├── dev/                 [Development utilities]
├── docs/                [Documentation]
├── orchestration/       [Gate enforcement & motion compliance]
├── skills/              [73 SKILL.md files — knowledge base]
├── templates/           [Project bootstrap files]
└── [Root files]         [Documentation + bootstrap scripts]
```

---

## 2. CRITICAL FILES INVENTORY

### Documentation & Identity
| File | Type | Lines | Status | Purpose | Risk |
|------|------|-------|--------|---------|------|
| CLAUDE.md | Identity | 410 | ✅ READY | Agent working identity — Brudi v3.3.2 spec | HIGH |
| START_HERE.md | Onboarding | 395 | ✅ READY | Step-by-step project setup for users | MEDIUM |
| README.md | Overview | 183 | ✅ READY | Brudi feature summary | LOW |
| BRUDI_CREATIVE_DNA_v1.md | NEW SPEC | 1,239 | ✅ READY | 9-pillar framework for deterministic excellence | CRITICAL |
| VERSION | Metadata | 1 | ✅ EXISTS | Current version string | LOW |

### Bootstrap & Orchestration
| File | Type | Lines | Status | Purpose | Risk |
|------|------|-------|--------|---------|------|
| use.sh | Executable | 222 | ✅ WORKING | Project connection script — creates .brudi/ | CRITICAL |
| install.sh | Executable | 155 | ✅ WORKING | Global Brudi installer — clones to ~/Brudi | CRITICAL |
| orchestration/brudi-gate.sh | Executable | 505 | ✅ WORKING | Gate enforcement runner (Phase, Mode, Evidence) | CRITICAL |
| orchestration/pre-commit | Executable | ~100 | ✅ WORKING | Git hook — blocks commits on gate failure | HIGH |
| orchestration/motion-compliance-check.sh | Executable | ~500 | ✅ NEW | Motion protocol validation (Agent 2 deliverable) | HIGH |
| orchestration/state.init.json | Config | 336B | ✅ EXISTS | Template for .brudi/state.json | MEDIUM |
| orchestration/state.schema.json | Config | ~4.6KB | ✅ EXISTS | JSON schema for state validation | MEDIUM |

### Templates (Project Bootstrap)
| File | Type | Lines | Status | Purpose | Risk |
|------|------|-------|--------|---------|------|
| templates/CLAUDE.md | Template | 286 | ✅ READY | Project-local agent identity | HIGH |
| templates/CLAUDE.example.md | Example | ~200 | ✅ EXISTS | Example filled-in CLAUDE.md | LOW |
| templates/TASK.md | Template | 161 | ✅ READY | Project task definition | HIGH |
| templates/PROJECT_STATUS.md | Template | 200 | ✅ READY | Status tracking template | HIGH |
| templates/settings.json | Config | 321B | ✅ EXISTS | Bash settings for ~/.claude/ | LOW |

---

## 3. SKILLS INVENTORY (73 TOTAL)

### Phase 0 Foundation Skills (11)
```
✅ starting-a-project
✅ crafting-brand-systems
✅ crafting-typography
✅ designing-for-mobile
✅ implementing-design-tokens
✅ implementing-dark-mode
✅ designing-award-layouts-core
✅ creating-visual-depth                    [EXTEND with materiality per Creative DNA]
✅ verifying-ui-quality                     [EXTEND for complexity floor per Creative DNA]
✅ building-layouts
✅ building-components-core
```

### Phase 1 Vertical Slice Skills (35)
[Full list available — core ones relevant to Creative DNA]
- animating-interfaces
- orchestrating-react-animations
- orchestrating-gsap-lenis
- orchestrating-css-gsap-conflicts
- orchestrating-keyframes-js
- orchestrating-will-change
- orchestrating-motion-language
- narrating-web-experiences
- [29 more...]

### Phase 2 Pages & Polish Skills (18)
- testing-user-interfaces
- testing-accessibility
- building-accessibly
- optimizing-images
- optimizing-performance
- building-legal-pages
- testing-end-to-end
- [11 more...]

### Phase 3 Launch & Scale Skills (9)
- deploying-to-production
- scaling-horizontally
- monitoring-errors
- [6 more...]

### NEW Skills to Create (Per Creative DNA)
| Skill Name | Status | Purpose | Pillar |
|------------|--------|---------|--------|
| designing-award-materiality | ❌ NOT CREATED | Materiality tokens & material states | Pillar 4 |
| designing-creative-constraints | ❌ NOT CREATED | Visual constraint enforcement | Pillar 9 |

---

## 4. ASSETS DIRECTORY STRUCTURE

### Path
`/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/assets/`

### Contents
```
assets/
├── INDEX.md                    [Asset registry — describes all assets]
├── README.md
├── configs/
│   ├── design-tokens.css       [CSS custom properties]
│   ├── globals.css             [Tailwind v4 template + reset]
│   ├── motion.protocol.ts      [GSAP easing/duration/distance tokens]
│   ├── gsap-snippets.ts        [10 GSAP techniques]
│   ├── framer-motion-snippets.ts
│   └── next-intl-v4.ts
├── fonts/
│   ├── FONTS.md                [5 variable font pairings]
│   └── woff2/                  [5 WOFF2 fonts]
├── i18n/
│   ├── STRUCTURE.md
│   └── base.{de,en,es,fr,it,pt}.json
├── legal/
│   └── legal.{de,en,es,fr,it,pt}.json
└── patterns/
    ├── gsap-react-cleanup.md
    ├── keyboard-accessibility.md
    ├── lenis-quick-setup.md
    └── reduced-motion.md
```

---

## 5. DOCUMENTATION STRUCTURE

### Path
`/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/brudi/docs/`

### Known Contents (audit reports + support docs)
```
docs/
├── [BRUDI_ELITE_SYSTEM_AUDIT_REPORT.md]
├── [BRUDI_ENTERPRISE_AUDIT_REPORT.md]
├── [MODE_ENFORCEMENT_*.md documents]
├── [MOTION_PROTOCOL_README.md]
└── [Other support documentation]
```

---

## 6. FILE DEPENDENCY MAPPING

### Critical Execution Chain
```
use.sh (Project Setup)
  ├─> Copies templates/CLAUDE.md → PROJECT_DIR/CLAUDE.md
  ├─> Copies templates/TASK.md → PROJECT_DIR/TASK.md
  ├─> Copies templates/PROJECT_STATUS.md → PROJECT_DIR/PROJECT_STATUS.md
  ├─> Creates .brudi/state.json from orchestration/state.init.json
  └─> Installs orchestration/pre-commit → PROJECT_DIR/.git/hooks/

CLAUDE.md (Agent Identity)
  ├─> References ~/Brudi/orchestration/brudi-gate.sh
  ├─> References ~/Brudi/skills/[skill-name]/SKILL.md (73 skills)
  ├─> References ~/Brudi/assets/INDEX.md
  ├─> References ~/Brudi/templates/PROJECT_STATUS.md
  └─> Enforces MODE control (BUILD/AUDIT/FIX/RESEARCH)

brudi-gate.sh (Enforcement)
  ├─> Reads .brudi/state.json
  ├─> Validates Pre-Conditions (previous slice completion)
  ├─> Validates Post-Conditions (6 checkpoints)
  ├─> Executes Phase-Gates
  ├─> Calls motion-compliance-check.sh (NEW — motion protocol)
  └─> Returns Exit Code 0/1 (gate pass/fail)

pre-commit Hook
  └─> Called before git commit
      └─> Executes brudi-gate.sh post-slice
      └─> Blocks commit if exit code = 1
```

---

## 7. CREATIVE DNA IMPLEMENTATION TARGETS

### From BRUDI_CREATIVE_DNA_v1.md Analysis

#### A. Files to EXTEND (Not Create)

| Target File | Current State | Changes Needed | Risk | Evidence |
|-----------|---------------|-----------------|------|----------|
| **CLAUDE.md** | 410 lines | Add Section F: Creative Complexity Floor + Materiality constraints | HIGH | Lines 852–960 of Creative DNA spec |
| **verifying-ui-quality/SKILL.md** | 212 lines | Add Complexity Floor verification matrix + animation count audit | HIGH | Lines 863–873 (Quality Gate Extensions) |
| **creating-visual-depth/SKILL.md** | 2,976B | Add Materiality tokens section + material state patterns | MEDIUM | Appendix A of Creative DNA |
| **templates/PROJECT_STATUS.md** | 200 lines | Add Complexity Floor row to verification table | MEDIUM | Creative DNA matrix requirement |
| **orchestration/brudi-gate.sh** | 505 lines | Add Creative Complexity Floor validation calls | HIGH | Lines 898–950 (Gate integration) |
| **assets/configs/design-tokens.css** | Existing | Add materiality-tokens CSS (opacity, gradients, backdrops) | MEDIUM | Creative DNA Appendix |
| **assets/configs/globals.css** | Existing | Import materiality-tokens.css | LOW | Single import line |

#### B. Files to CREATE (New)

| File | Pillar | Purpose | Lines (Est.) | Risk | Prerequisite |
|------|--------|---------|--------------|------|--------------|
| **skills/designing-award-materiality/SKILL.md** | 4 | Material surface tokens, glass morphism, grain patterns, light direction | 300+ | CRITICAL | Must extend creating-visual-depth first |
| **skills/designing-creative-constraints/SKILL.md** | 9 | Complexity floor application matrix, component requirements, automation | 250+ | HIGH | Depends on materiality skill |
| **orchestration/eslint-rules/brudi-rules.js** | 8 | Custom ESLint rules (no-gsap-from, no-transition-all, etc.) | 200+ | MEDIUM | Used by gate automation |
| **orchestration/brudi-gate-complexity.sh** | 8 | Pre-commit script: animation count, color audit, layer usage check | 250+ | HIGH | Integrated into brudi-gate.sh |
| **assets/configs/materiality-tokens.css** | 4 | Material surface definitions (glossy, matte, frosted, metallic) | 150+ | MEDIUM | Referenced by design-tokens.css |

#### C. Files to DOCUMENT (Already Complete)

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| BRUDI_CREATIVE_DNA_v1.md | ✅ COMPLETE | 1,239 | Full implementation spec + 9 pillars |
| MOTION_PROTOCOL_README.md | ✅ COMPLETE | ~200 | Motion compliance explanation |
| MODE_ENFORCEMENT_*.md | ✅ COMPLETE | ~100 each | Mode enforcement audit docs |

---

## 8. RISK ANALYSIS

### CRITICAL RISK FILES (Cannot Break)

| File | Role | Consequence of Failure | Mitigation |
|------|------|------------------------|-------------|
| **use.sh** | Bootstrap | New projects cannot be created | Version control + local testing |
| **brudi-gate.sh** | Enforcement | Gates don't work, bad code ships | Comprehensive shellcheck + dry-run mode |
| **pre-commit hook** | Safety | Commits bypass gates | Hook install verification |
| **CLAUDE.md** | Identity | Agents misunderstand standards | Template validation against spec |

### MODERATE RISK FILES (Must Work Correctly)

| File | Role | Consequence of Failure | Mitigation |
|------|------|------------------------|-------------|
| templates/* | Setup | Projects start with wrong structure | Syntax validation + example verification |
| skills/*/SKILL.md | Guidance | Agents build wrong patterns | Review against checklist |
| assets/* | Resources | Projects lack required tokens | INDEX.md accuracy |

### LOW RISK (Documentation Only)

| File | Consequence of Failure | Mitigation |
|------|------------------------|-------------|
| README.md, docs/* | Users confused about features | Can be updated without affecting execution |

---

## 9. DEPENDENCY GRAPH

### Use.sh Dependencies
```
use.sh
├── orchestration/state.init.json
├── orchestration/state.schema.json
├── orchestration/pre-commit
├── templates/CLAUDE.md
├── templates/TASK.md
├── templates/PROJECT_STATUS.md
└── templates/settings.json
```

### CLAUDE.md References (Per File)
```
CLAUDE.md
├── REFERENCES: ~/Brudi/orchestration/brudi-gate.sh (7 mentions)
├── REFERENCES: ~/Brudi/skills/*/SKILL.md (73 total skills)
├── REFERENCES: ~/Brudi/assets/INDEX.md (1 mention)
├── REFERENCES: ~/Brudi/templates/PROJECT_STATUS.md (1 mention)
└── ENFORCES: Mode control (BUILD/AUDIT/FIX/RESEARCH)
```

### Orchestration Dependencies
```
brudi-gate.sh
├── READS: .brudi/state.json (single source of truth)
├── CALLS: orchestration/motion-compliance-check.sh (new)
├── CALLS: orchestration/eslint-rules/* (new)
└── CALLS: orchestration/brudi-gate-complexity.sh (new)

pre-commit hook
├── CALLS: brudi-gate.sh post-slice
└── EXITS: 0 (allow commit) or 1 (block)
```

---

## 10. SKILLS DEPENDENCY CHAIN (Phase 0 → 3)

### Phase 0 Gate Requirements
```
BEFORE Phase 1 can start:
  ✅ crafting-brand-systems (SKILL.md read)
  ✅ designing-award-layouts-core (SKILL.md read)
  ✅ creating-visual-depth (SKILL.md read + EXTENDED for materiality)
  ✅ implementing-design-tokens (SKILL.md read)
  └─> Phase 0 Quality Gate passes
```

### Phase 1 Critical Skills for Creative DNA
```
verifying-ui-quality
  ├─ MUST read before each section
  ├─ MUST execute 3-point audit per section
  ├─ MUST verify: Animation count, Layer usage, Easing variety
  └─ USES: Creative Complexity Floor matrix (NEW)

animating-interfaces
  ├─ Prerequisite: designing-award-motion
  ├─ Prerequisite: orchestrating-motion-language (NEW)
  └─ Enforces: Min 5+ animations on hero, stagger timing

orchestrating-gsap-lenis
  └─ EXTENDS: motion-compliance-check.sh validates GSAP cleanup
```

---

## 11. AUDIT CHECKLIST FOR CREATIVE DNA INTEGRATION

### Pre-Implementation Verification
- [ ] BRUDI_CREATIVE_DNA_v1.md exists and is complete (1,239 lines)
- [ ] All 9 pillars defined with measurable requirements
- [ ] Component DNA matrix populated (12 component types)
- [ ] Page DNA matrix populated (5 page types)
- [ ] Enforcement architecture section complete

### Files Requiring Modification

#### 1. CLAUDE.md (410 lines)
- [ ] Section F: Creative Complexity Floor added after Quality Bar
- [ ] Materiality requirement table added
- [ ] Animation count minimums specified
- [ ] Easing variety enforcement documented

#### 2. verifying-ui-quality/SKILL.md (212 lines)
- [ ] Complexity Floor audit section added
- [ ] Animation count verification matrix added
- [ ] Layer usage audit table added
- [ ] Easing variety check documented

#### 3. orchestration/brudi-gate.sh (505 lines)
- [ ] Call to eslint-rules validation added
- [ ] Call to brudi-gate-complexity.sh added
- [ ] Animation count pre-commit check added
- [ ] Phase-gate extension for Complexity Floor

#### 4. templates/PROJECT_STATUS.md (200 lines)
- [ ] Complexity Floor column added to status table
- [ ] Example Complexity Floor checks shown

#### 5. Assets (New Files)
- [ ] assets/configs/materiality-tokens.css created (150 lines)
- [ ] assets/configs/globals.css updated (import materiality tokens)

### Files Requiring Creation

#### 1. skills/designing-award-materiality/SKILL.md (300+ lines)
- [ ] Material surface definitions
- [ ] Glossy/matte/frosted/metallic patterns
- [ ] Light direction and depth cues
- [ ] Component materiality matrix

#### 2. skills/designing-creative-constraints/SKILL.md (250+ lines)
- [ ] How to read Creative DNA matrices
- [ ] Complexity floor application rules
- [ ] Verification checklist per component

#### 3. orchestration/brudi-gate-complexity.sh (250+ lines)
- [ ] Hero animation count validator
- [ ] Layer usage counter
- [ ] Hardcoded color detector
- [ ] Easing variety checker

#### 4. orchestration/eslint-rules/brudi-rules.js (200+ lines)
- [ ] brudi/no-gsap-from
- [ ] brudi/no-transition-all
- [ ] brudi/no-margin-width-animation
- [ ] brudi/scrolltrigger-cleanup-required
- [ ] brudi/button-hover-asymmetric-required

---

## 12. SUMMARY TABLE: File Status & Implementation Path

| Component | File | Status | Lines | Action | Priority | Risk | Owner |
|-----------|------|--------|-------|--------|----------|------|-------|
| Identity | CLAUDE.md | ✅ READY | 410 | EXTEND | P0 | HIGH | Agent 1 |
| Onboarding | START_HERE.md | ✅ READY | 395 | REVIEW | P1 | LOW | Agent 1 |
| Bootstrap | use.sh | ✅ WORKING | 222 | NO CHANGE | P0 | CRITICAL | KEEP |
| Orchestration | brudi-gate.sh | ✅ WORKING | 505 | EXTEND | P0 | CRITICAL | Agent 1 |
| Verification | verifying-ui-quality/SKILL.md | ✅ EXISTS | 212 | EXTEND | P0 | HIGH | Agent 1 |
| Materials | creating-visual-depth/SKILL.md | ✅ EXISTS | 3KB | EXTEND | P1 | MEDIUM | Agent 1 |
| **NEW** | designing-award-materiality/SKILL.md | ❌ NEW | 300+ | CREATE | P1 | CRITICAL | Agent 1 |
| **NEW** | designing-creative-constraints/SKILL.md | ❌ NEW | 250+ | CREATE | P2 | HIGH | Agent 1 |
| **NEW** | orchestration/brudi-gate-complexity.sh | ❌ NEW | 250+ | CREATE | P1 | HIGH | Agent 1 |
| **NEW** | orchestration/eslint-rules/brudi-rules.js | ❌ NEW | 200+ | CREATE | P2 | MEDIUM | Agent 1 |
| **NEW** | assets/configs/materiality-tokens.css | ❌ NEW | 150+ | CREATE | P1 | MEDIUM | Agent 1 |
| Templates | templates/*.md | ✅ READY | ~650 | EXTEND | P1 | MEDIUM | Agent 1 |
| Spec Doc | BRUDI_CREATIVE_DNA_v1.md | ✅ COMPLETE | 1,239 | REFERENCE | P0 | NONE | FROZEN |

---

## 13. IMPLEMENTATION SEQUENCE (Recommended)

### Phase A: Foundation (Prepare Orchestration)
1. Create `orchestration/brudi-gate-complexity.sh` — animation/layer audit
2. Create `orchestration/eslint-rules/brudi-rules.js` — custom rules
3. Extend `orchestration/brudi-gate.sh` — call new validation scripts
4. Test gate with dry-run mode before going live

### Phase B: Core Skill Documentation
5. Create `skills/designing-award-materiality/SKILL.md` — material tokens
6. Create `skills/designing-creative-constraints/SKILL.md` — complexity rules
7. Extend `verifying-ui-quality/SKILL.md` — complexity audit checklist

### Phase C: Templates & Assets
8. Create `assets/configs/materiality-tokens.css` — token definitions
9. Extend `assets/configs/globals.css` — import materiality tokens
10. Extend `templates/PROJECT_STATUS.md` — complexity floor tracking

### Phase D: Agent Identity Update
11. Extend `CLAUDE.md` — Creative Complexity Floor section
12. Update `START_HERE.md` if needed — reference new materiality skill
13. Smoke test: Run use.sh on test project → verify all files created

---

## CONCLUSION

**Repository Size:** 
- 73 Skills × ~2–5KB each = ~200KB skill knowledge base
- Total core repo ≈ 5–8MB (including assets, git history)

**Files to Touch:** 11 files (extend) + 5 files (create) = 16 total modifications

**Critical Path:** brudi-gate.sh → CLAUDE.md → verifying-ui-quality SKILL

**Implementation Timeline:** ~8–12 hours (sequential development + testing)

**No Breaking Changes:** All extensions are additive (new parameters, new files). Existing workflows remain functional.

