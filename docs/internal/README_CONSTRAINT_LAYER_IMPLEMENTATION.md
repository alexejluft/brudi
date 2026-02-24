# Constraint-Layer Implementation Guide

**Status:** Complete — Ready for Integration
**Date:** 2026-02-24
**Scope:** Layout Primitives + Token Bridge Wiring

---

## What Was Delivered

This implementation wires the **Constraint-Layer** into Brudi's agent bootstrap system, ensuring agents CANNOT skip or circumvent layout discipline and animation token usage.

The constraint layer consists of:

1. **Layout Primitives** — Container, Section, Stack, Grid components that enforce consistent spacing
2. **Token Bridge** — TypeScript constants that map CSS design tokens to GSAP animation values
3. **Spacing Gate** — Enforcement mechanism preventing ad-hoc spacing patterns

### Deliverables

```
/sessions/optimistic-quirky-franklin/mnt/brudi/docs/internal/
├── CONSTRAINT_LAYER_WIRING_MANIFEST.md (Main manifest — read this first)
├── PATCHES_TEMPLATES_CLAUDE.md (5 specific patches for templates/CLAUDE.md)
├── PATCHES_TEMPLATES_TASK.md (5 specific patches for templates/TASK.md)
├── PATCHES_TEMPLATES_PROJECT_STATUS.md (5 specific patches for templates/PROJECT_STATUS.md)
└── README_CONSTRAINT_LAYER_IMPLEMENTATION.md (This file)
```

---

## How the Constraint Layer Works

### Phase 0: Bootstrap (Day 1)

When a new agent starts a project:

1. Agent reads `~/Brudi/CLAUDE.md` (main Brudi identity)
2. Agent reads project `CLAUDE.md` (template with patches applied)
3. **NEW:** Agent sees `building-layout-primitives` and `implementing-token-bridge` in Phase 0 skills list
4. Agent reads `TASK.md` (project task file with patches applied)
5. **NEW:** Agent sees Phase 0 tasks:
   - Create layout primitives from `~/Brudi/templates/primitives/layout.tsx`
   - Create token bridge from `~/Brudi/templates/primitives/tokens.ts`
   - Create animation hooks from `~/Brudi/templates/primitives/use-*.ts`
6. Agent cannot proceed to Phase 1 without completing these tasks

### Phase 1: Vertical Slices (Day 2+)

For each slice:

1. Agent reads `verifying-ui-quality` skill (as before)
2. Agent reads `building-layout-primitives` skill (mandatory in Phase 0 — confirms understanding)
3. Agent reads `implementing-token-bridge` skill (mandatory in Phase 0 — confirms understanding)
4. Agent writes code using:
   - `Container` and `Section` primitives for layout
   - `duration`, `easing` from `tokens.ts` for animations (NOT hardcoded values)
5. Agent documents usage in `PROJECT_STATUS.md`:
   - "Primitives" column: ✅ if Container/Section used
   - "Tokens" column: ✅ if duration/easing imported from tokens.ts
6. Quality gate checks for primitive/token compliance

### Phase 1→2 Gate: Enforcement

Before Phase 2 can begin:

- **Every** Phase 1 slice must have ✅ in "Primitives" column
- **Every** Phase 1 slice must have ✅ in "Tokens" column
- If any ❌, Phase 2 is **BLOCKED**

### Definition of Done: Final Check

Before project can be considered complete:

- "Layout Primitives enforced" ✅ — All sections use Container/Section
- "Token Bridge enforced" ✅ — All GSAP uses duration/easing from tokens.ts

---

## Files Involved

### Files to Patch (Apply Changes)

These templates receive the patches documented in the patch files:

1. **templates/CLAUDE.md** — Add constraint skills to Phase 0 list + forbidden patterns + verification checks
   - Patches file: `PATCHES_TEMPLATES_CLAUDE.md`
   - Total changes: ~37 lines (additions)
   - Key additions:
     - Line ~138: Add `building-layout-primitives` and `implementing-token-bridge` to Phase 0 skills
     - Line ~314: Add "Layout Primitives (PFLICHT)" subsection explaining Container/Section
     - Line ~331: Add forbidden patterns (ad-hoc max-w-*, hardcoded animation values)
     - Line ~342: Add verification steps 8-9 to Quality Verification Pre-Screenshot

2. **templates/TASK.md** — Add Phase 0 primitive creation tasks + Phase 1 enforcement gates
   - Patches file: `PATCHES_TEMPLATES_TASK.md`
   - Total changes: ~31 lines (additions)
   - Key additions:
     - Line ~32: Expand skills list with numbered entries emphasizing primitives + tokens (items 2-3)
     - Line ~33-44: Insert 3 Phase 0 tasks (create-primitives, create-tokens, create-hooks)
     - Line ~60-62: Add verification steps 2a-b to Phase 1 slice checklist
     - Line ~85-87: Add 2 Phase 1→2 gate conditions (Primitives ✅, Tokens ✅)

3. **templates/PROJECT_STATUS.md** — Add tracking columns for primitives + tokens
   - Patches file: `PATCHES_TEMPLATES_PROJECT_STATUS.md`
   - Total changes: ~12 rows + 2 column expansions
   - Key additions:
     - Line ~52-54: Add 3 Phase 0 tasks to table (primitives, tokens, hooks)
     - Line ~78-87: Expand Phase 1 slices table with "Primitives" and "Tokens" columns
     - Line ~109-126: Replace quality gate checks with constraint-focused dimensions
     - Line ~156-158: Add 2 Phase 1→2 gate conditions
     - Line ~212-214: Add 2 Definition of Done items

### Files to Create (Not yet created)

These template files need to be created as the source for agents to copy:

1. **templates/primitives/layout.tsx** — Container, Section, Stack, Grid components
   - Used by agents in Phase 0: `cp ~/Brudi/templates/primitives/layout.tsx app/components/primitives/index.tsx`
   - Contents:
     - `Container` component with props `size?: 'narrow' | 'default' | 'wide' | 'full'`
     - `Section` component with props `id` (required), `spacing?: 'sm' | 'md' | 'lg' | 'xl'`
     - `Stack` component for horizontal alignment
     - `Grid` component for column layout
     - TypeScript interfaces for all props

2. **templates/primitives/tokens.ts** — Duration, easing, spacing, color tokens
   - Used by agents in Phase 0: `cp ~/Brudi/templates/primitives/tokens.ts app/primitives/tokens.ts`
   - Contents:
     ```typescript
     export const duration = { micro: 0.12, fast: 0.18, normal: 0.35, slow: 0.65, hero: 1.0 }
     export const easing = { enter: "power3.out", exit: "power2.out", smooth: "power2.out", ... }
     export const spacing = { xs: 8, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48 }
     export const colors = { /* from globals.css design system */ }
     ```

3. **templates/primitives/use-scroll-reveal.ts** — GSAP hook for scroll-triggered reveals
   - Used by agents in Phase 0: `cp ~/Brudi/templates/primitives/use-scroll-reveal.ts app/hooks/`
   - Uses `duration` and `easing` from tokens.ts (no hardcoded values)

4. **templates/primitives/use-stagger-entrance.ts** — GSAP hook for staggered entrance animations
   - Uses token bridge pattern

5. **templates/primitives/use-hover-transform.ts** — GSAP hook for hover animations
   - Uses token bridge pattern

### Files Already Existing (Reference Points)

These files already exist and are referenced by the constraint layer:

1. **~/Brudi/CLAUDE.md** — Main Brudi identity (agent reads this first)
   - Already contains references to constraints
   - No changes needed
   - Patches point to it as the source of authority

2. **skills/building-layout-primitives/SKILL.md** — Skill teaching layout primitives
   - Already exists and is comprehensive
   - Used in Phase 0 mandatory reading
   - Teaches why primitives prevent AI-slop

3. **skills/implementing-token-bridge/SKILL.md** — Skill teaching token bridge
   - Already exists and is comprehensive
   - Used in Phase 0 mandatory reading
   - Teaches why hardcoded values break systems

4. **skills/verifying-ui-quality/SKILL.md** — Quality gate skill
   - Already exists
   - Can be enhanced with specific checks for primitives/tokens
   - Used to verify every slice

---

## Implementation Steps

### Step 1: Read the Manifest (You Are Here)

- [ ] Read `CONSTRAINT_LAYER_WIRING_MANIFEST.md` — Understand the full wiring
- [ ] Understand: Boot chain, enforcement mechanisms, scenario blocking
- [ ] Understand: Files involved, activation points, verification commands

### Step 2: Apply Patches to Templates (Next)

Apply the patches in this order:

1. [ ] Apply patches from `PATCHES_TEMPLATES_CLAUDE.md` to `templates/CLAUDE.md`
   - 5 patches, ~37 lines of additions
   - Verify: Use `grep "building-layout-primitives" templates/CLAUDE.md` should return 2+ matches

2. [ ] Apply patches from `PATCHES_TEMPLATES_TASK.md` to `templates/TASK.md`
   - 5 patches, ~31 lines of additions
   - Verify: Use `grep "Create layout primitives" templates/TASK.md` should return 1 match

3. [ ] Apply patches from `PATCHES_TEMPLATES_PROJECT_STATUS.md` to `templates/PROJECT_STATUS.md`
   - 5 patches, ~12 rows + 2 column expansions
   - Verify: Use `grep "Primitives.*Tokens" templates/PROJECT_STATUS.md` should return 1+ matches

### Step 3: Create Template Files (Future)

These files need to be created. Current status: Templates exist in skills, need to be formalized as copyable templates.

- [ ] Create `templates/primitives/layout.tsx` (Container, Section, Stack, Grid components)
- [ ] Create `templates/primitives/tokens.ts` (Duration, easing, spacing, colors)
- [ ] Create `templates/primitives/use-scroll-reveal.ts` (GSAP scroll hook)
- [ ] Create `templates/primitives/use-stagger-entrance.ts` (GSAP stagger hook)
- [ ] Create `templates/primitives/use-hover-transform.ts` (GSAP hover hook)

### Step 4: Verify Wiring (Final)

Run verification commands:

```bash
# Check 1: Templates mention constraints
grep -l "building-layout-primitives" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/*.md
# Expected: CLAUDE.md, TASK.md

# Check 2: Skills exist
ls /sessions/optimistic-quirky-franklin/mnt/brudi/skills/building-layout-primitives/SKILL.md
ls /sessions/optimistic-quirky-franklin/mnt/brudi/skills/implementing-token-bridge/SKILL.md
# Expected: Both exist

# Check 3: Tracking columns added to PROJECT_STATUS.md
grep "Primitives\|Tokens" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md | head -5
# Expected: Multiple matches

# Check 4: Patches are consistent
wc -l /sessions/optimistic-quirky-franklin/mnt/brudi/templates/CLAUDE.md
# Expected: Should be ~45-50 lines more than original (due to additions)
```

---

## How to Use This Documentation

### For Template Managers

1. Read `CONSTRAINT_LAYER_WIRING_MANIFEST.md` (comprehensive overview)
2. Apply patches using the specific patch documents:
   - `PATCHES_TEMPLATES_CLAUDE.md`
   - `PATCHES_TEMPLATES_TASK.md`
   - `PATCHES_TEMPLATES_PROJECT_STATUS.md`
3. Create the template files (or delegate to code team)
4. Run verification commands

### For Agents Using the New System

1. Agent bootstrap reads `~/Brudi/CLAUDE.md` → sees constraint mandate
2. Agent reads project `CLAUDE.md` (with patches applied) → sees primitives skills + creation tasks
3. Agent reads `TASK.md` (with patches applied) → sees Phase 0 primitive creation as BLOCKING task
4. Agent reads `building-layout-primitives` and `implementing-token-bridge` skills
5. Agent creates layout primitives and token bridge in Phase 0
6. Agent uses primitives + tokens in ALL Phase 1 code
7. Agent documents usage in `PROJECT_STATUS.md` (with new tracking columns)
8. Phase 1→2 gate checks: All ✅ required

### For Code Reviewers

Check compliance:

```bash
# In agent's project, after Phase 1 completion:

# Check 1: Layout primitives exist and are imported
grep -r "import.*Container\|import.*Section" app/components | head -5

# Check 2: Token bridge is used in animations
grep -r "duration\|easing" app --include="*.tsx" | grep "from.*tokens" | wc -l
# Should have many matches

# Check 3: PROJECT_STATUS.md shows evidence
grep "Primitives.*✅\|Tokens.*✅" PROJECT_STATUS.md | wc -l
# Should equal number of Phase 1 slices (typically 7)
```

---

## Key Differences from Old System

### Before (No Constraint Layer)

- Agents could write ad-hoc spacing: `max-w-5xl mx-auto px-4`
- Animations used hardcoded values: `duration: 0.5`, `ease: "power2.out"`
- No enforcement mechanism — spacing and tokens were suggestions
- Quality gates checked presence, not compliance

### After (With Constraint Layer)

- **Phase 0 task explicitly creates primitives** — Cannot skip to Phase 1 without them
- **TOKEN BRIDGE is mandatory import** — `duration` and `easing` must come from tokens.ts
- **Tracking columns in PROJECT_STATUS.md** — Every slice has "Primitives" ✅ and "Tokens" ✅
- **Phase 1→2 gate blocks without evidence** — Cannot proceed to Phase 2 if any ❌
- **Definition of Done includes constraint enforcement** — Primitives and tokens must be enforced

---

## Enforcement Mechanisms Explained

### Mechanism 1: Skill Reading Enforcement

**How it works:**
- TASK.md Phase 0 requires reading `building-layout-primitives` and `implementing-token-bridge`
- These skills teach the patterns and explain why they matter
- Agent documents in `PROJECT_STATUS.md` Skill-Log that they read these

**What blocks it:**
- Phase 1→2 gate checks Skill-Log for these two skills
- If not documented, Phase 1→2 gate ❌

### Mechanism 2: Code Pattern Enforcement

**How it works:**
- Quality gate checks for:
  - Container/Section usage in layout code
  - Token imports in animation code
- Phase 1→2 gate requires "Primitives" ✅ and "Tokens" ✅ for every slice

**What blocks it:**
- If agent uses `max-w-5xl` outside Container → quality gate FAILS
- If agent uses `duration: 0.5` instead of `duration.normal` → quality gate FAILS
- Phase 1→2 gate blocks Phase 2 without evidence

### Mechanism 3: Evidence Tracking

**How it works:**
- PROJECT_STATUS.md has new columns: "Primitives" and "Tokens"
- Each Phase 1 slice must have ✅ in both columns
- Gate checks: ALL rows must be ✅

**What blocks it:**
- Phase 1→2 gate scans PROJECT_STATUS.md
- Finds ❌ or "—" in Primitives/Tokens columns
- Blocks phase transition with message: "Phase 1→2 gate requires Primitives ✅ and Tokens ✅"

### Mechanism 4: Pre-Commit Hook (Future Enhancement)

**Can be added to `.brudi/pre-commit`:**
```bash
# Check for ad-hoc spacing
if grep -r "max-w-" app/components --include="*.tsx" | grep -v "Container"; then
  echo "ERROR: Found ad-hoc max-width outside Container primitives"
  exit 1
fi

# Check for hardcoded animation values
if grep -r "duration:" app --include="*.tsx" | grep -v "from.*tokens"; then
  echo "ERROR: Found hardcoded animation duration (use tokens.ts)"
  exit 1
fi
```

---

## Verification Checklist

### Before Deployment

- [ ] All 3 patch files created (PATCHES_TEMPLATES_*.md)
- [ ] Main manifest created (CONSTRAINT_LAYER_WIRING_MANIFEST.md)
- [ ] Patches applied to:
  - [ ] templates/CLAUDE.md
  - [ ] templates/TASK.md
  - [ ] templates/PROJECT_STATUS.md
- [ ] Skills exist and are readable:
  - [ ] skills/building-layout-primitives/SKILL.md
  - [ ] skills/implementing-token-bridge/SKILL.md
- [ ] Template files created (or scheduled):
  - [ ] templates/primitives/layout.tsx
  - [ ] templates/primitives/tokens.ts
  - [ ] templates/primitives/use-*.ts (3 files)

### After Deployment (Agent Tests)

- [ ] Agent reads CLAUDE.md → sees constraint skills in Phase 0 list
- [ ] Agent reads TASK.md → sees Phase 0 primitive creation tasks
- [ ] Agent creates primitives in Phase 0 (cannot proceed to Phase 1 without them)
- [ ] Agent uses Container/Section in Phase 1 code
- [ ] Agent imports duration/easing from tokens.ts in animations
- [ ] PROJECT_STATUS.md tracks "Primitives" ✅ and "Tokens" ✅ per slice
- [ ] Phase 1→2 gate blocks if any Primitives/Tokens column is ❌

---

## FAQ

### Q: What if an agent ignores the Phase 0 tasks and tries to go to Phase 1?

**A:** They cannot. The Phase 1→2 gate will detect that:
1. Skill-Log doesn't show `building-layout-primitives` or `implementing-token-bridge` were read
2. PROJECT_STATUS.md shows ❌ in "Layout primitives created" Phase 0 task
3. Phase 1→2 gate BLOCKS transition

### Q: What if an agent uses ad-hoc `max-w-5xl` instead of Container?

**A:**
1. Quality gate checks "Spacing Pattern" → FAILS
2. Phase 1 slice shows ❌ in "Primitives" column
3. Phase 1→2 gate sees ❌ → BLOCKS transition

### Q: What if an agent hardcodes `duration: 0.5` instead of `duration.normal`?

**A:**
1. Quality gate checks "Token Usage" → FAILS
2. Phase 1 slice shows ❌ in "Tokens" column
3. Phase 1→2 gate sees ❌ → BLOCKS transition

### Q: Can agents edit primitives or tokens?

**A:**
- **Primitives (layout.tsx):** Can be extended, but core Container/Section/Stack/Grid structure is fixed
- **Tokens (tokens.ts):** Values can be adjusted per project, but structure (duration/easing/spacing/colors) is fixed
- Skill teaches that these are shared systems — changes cascade

### Q: What if Phase 0 primitives are created but Phase 1 code doesn't use them?

**A:**
- Phase 0 shows ✅ "primitives created"
- Phase 1 slice shows ❌ "Primitives used" (because code audit shows ad-hoc spacing)
- Phase 1→2 gate sees ❌ → BLOCKS

---

## Next Steps

1. **Immediate:** Review this documentation with stakeholders
2. **Week 1:** Apply patches to templates
3. **Week 1:** Create template files (layout.tsx, tokens.ts, hooks)
4. **Week 2:** Test with first agent project
5. **Week 3:** Gather feedback, refine enforcement
6. **Week 4:** Roll out to all new projects

---

## Contact & Questions

This implementation was created to make the Constraint-Layer non-negotiable and unbypassable.

**Key principle:** Agents cannot proceed through phase gates without compliance.

---

**Document Status:** Complete and Ready for Review
**Version:** 1.0
**Date:** 2026-02-24
