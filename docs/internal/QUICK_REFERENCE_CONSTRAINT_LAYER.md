# Quick Reference: Constraint-Layer Wiring

**For:** Template managers, implementers, reviewers
**Time:** 5 minutes to understand the entire system

---

## The Constraint Layer in 30 Seconds

Agents cannot skip layout primitives (Container/Section) or animation token bridge because:

1. **Phase 0 BLOCKS to Phase 1** without creating primitives + tokens
2. **Every Phase 1 slice requires** ✅ in "Primitives" and "Tokens" columns
3. **Phase 1→2 gate BLOCKS** if any slice has ❌ in these columns
4. **Definition of Done requires** constraint enforcement to be ✅

---

## What Agents See (Boot Sequence)

```
Agent starts project
    ↓
Reads ~/Brudi/CLAUDE.md → sees constraint mandate
    ↓
Reads project CLAUDE.md (with patches) → sees:
  - Phase 0 skills include "building-layout-primitives" ✨ NEW
  - Phase 0 skills include "implementing-token-bridge" ✨ NEW
    ↓
Reads project TASK.md (with patches) → sees:
  - Phase 0 tasks include "Create layout primitives" ✨ NEW
  - Phase 0 tasks include "Create token bridge" ✨ NEW
  - Phase 0 tasks include "Create animation hooks" ✨ NEW
    ↓
Cannot proceed to Phase 1 without completing Phase 0 ✗
    ↓
Phase 1→2 gate checks PROJECT_STATUS.md → sees:
  - Every slice must have ✅ in "Primitives" column ✨ NEW
  - Every slice must have ✅ in "Tokens" column ✨ NEW
```

---

## Files Changed (What to Do)

### 3 Template Files to Patch

| File | Patches | Size | Action |
|------|---------|------|--------|
| `templates/CLAUDE.md` | 5 | ~37 lines | Apply patches from `PATCHES_TEMPLATES_CLAUDE.md` |
| `templates/TASK.md` | 5 | ~31 lines | Apply patches from `PATCHES_TEMPLATES_TASK.md` |
| `templates/PROJECT_STATUS.md` | 5 | ~12 rows | Apply patches from `PATCHES_TEMPLATES_PROJECT_STATUS.md` |

### 5 Template Files to Create (Future)

| File | Purpose | Agents Copy Using |
|------|---------|-------------------|
| `templates/primitives/layout.tsx` | Container, Section, Stack, Grid | `cp ~/Brudi/templates/primitives/layout.tsx app/components/primitives/index.tsx` |
| `templates/primitives/tokens.ts` | duration, easing, spacing, colors | `cp ~/Brudi/templates/primitives/tokens.ts app/primitives/tokens.ts` |
| `templates/primitives/use-scroll-reveal.ts` | GSAP scroll hook | `cp ~/Brudi/templates/primitives/use-scroll-reveal.ts app/hooks/` |
| `templates/primitives/use-stagger-entrance.ts` | GSAP stagger hook | `cp ~/Brudi/templates/primitives/use-stagger-entrance.ts app/hooks/` |
| `templates/primitives/use-hover-transform.ts` | GSAP hover hook | `cp ~/Brudi/templates/primitives/use-hover-transform.ts app/hooks/` |

---

## Enforcement Points (Where It Blocks)

### Point 1: Phase 0 Startup (Day 1)

```
TASK.md Phase 0 requires:
  □ Read building-layout-primitives skill
  □ Read implementing-token-bridge skill
  □ Create layout primitives (Container, Section, Stack, Grid)
  □ Create token bridge (duration, easing, spacing, colors)
  □ Create animation hooks

If not ✅ → Cannot proceed to Phase 1
```

### Point 2: Phase 1 Slices (Days 2+)

```
For each slice:
  □ Project_STATUS.md "Primitives" column = ✅ (Container/Section used)
  □ Project_STATUS.md "Tokens" column = ✅ (duration/easing from tokens.ts)

Quality gate fails if either ❌
```

### Point 3: Phase 1→2 Gate (End of Phase 1)

```
Phase 1→2 gate checks:
  □ EVERY slice has ✅ in "Primitives" column
  □ EVERY slice has ✅ in "Tokens" column

If ANY ❌ → Phase 2 BLOCKED
```

### Point 4: Definition of Done (Final Check)

```
Before project done:
  □ Layout Primitives enforced (all sections use Container/Section)
  □ Token Bridge enforced (all GSAP uses tokens, no hardcoded values)

If any ❌ → Project not done
```

---

## Patches at a Glance

### CLAUDE.md Patches (5 total, ~37 lines added)

1. **Line ~138:** Add `building-layout-primitives` and `implementing-token-bridge` to Phase 0 skills
2. **Line ~314:** Add "Layout Primitives (PFLICHT)" subsection explaining Container/Section
3. **Line ~331:** Add 2 forbidden patterns (ad-hoc max-w-*, hardcoded animation values)
4. **Line ~342:** Add steps 8-9 to Quality Verification Pre-Screenshot
5. **Line ~45:** (Optional) Add "Layout Primitives" to Non-Negotiables

### TASK.md Patches (5 total, ~31 lines added)

1. **Line ~32:** Expand skills list: add primitives + tokens as items 2-3
2. **Line ~33-44:** Insert 3 Phase 0 tasks (create-primitives, create-tokens, create-hooks)
3. **Line ~60-62:** Add verification 2a-b to Phase 1 slice checklist
4. **Line ~85-87:** Add 2 Phase 1→2 gate conditions
5. **Line ~119-121:** (Optional) Add 2 gates to Slice Completion Checklist

### PROJECT_STATUS.md Patches (5 total, ~12 rows added)

1. **Line ~52-54:** Add 3 Phase 0 tasks to table
2. **Line 78-87:** Expand Phase 1 table with "Primitives" + "Tokens" columns
3. **Line 109-126:** Replace quality checks with constraint-focused dimensions
4. **Line ~156-158:** Add 2 Phase 1→2 gate conditions
5. **Line ~212-214:** Add 2 Definition of Done items

---

## Blocking Scenarios (How It Works)

### Scenario 1: Agent Skips Phase 0 Primitives

```
Agent tries: "I'll skip Phase 0 and go straight to Phase 1"

Result:
  1. Phase 1→2 gate reads PROJECT_STATUS.md Phase 0
  2. Finds ❌ in "Create layout primitives" task
  3. Blocks with: "Phase 1 cannot start. Create layout primitives first."
```

### Scenario 2: Agent Uses Ad-hoc max-w-*

```
Agent writes: <div className="max-w-5xl mx-auto px-4">

Phase 1 slice result:
  1. Code review / quality gate spots hardcoded max-w
  2. "Primitives" column = ❌
  3. Phase 1→2 gate sees ❌ → BLOCKS Phase 2
```

### Scenario 3: Agent Hardcodes Animation Values

```
Agent writes: gsap.to(el, { y: 0, opacity: 1, duration: 0.5 })

Phase 1 slice result:
  1. Quality gate checks "Token Usage" → FAILS
  2. "Tokens" column = ❌
  3. Phase 1→2 gate sees ❌ → BLOCKS Phase 2
```

### Scenario 4: Partial Compliance

```
Agent has:
  ✅ Slice 1-5: Primitives ✅, Tokens ✅
  ❌ Slice 6: Primitives ✅, Tokens ❌ (forgot to import tokens)

Phase 1→2 gate:
  "Slice 6 has ❌ in Tokens column. Phase 2 blocked."
```

---

## Verification Commands

After applying patches, verify with:

```bash
# 1. Check patches were applied
grep "building-layout-primitives" templates/CLAUDE.md && echo "✅ CLAUDE.md patched"
grep "Create layout primitives" templates/TASK.md && echo "✅ TASK.md patched"
grep "Primitives.*Tokens" templates/PROJECT_STATUS.md && echo "✅ PROJECT_STATUS.md patched"

# 2. Check skills exist
ls skills/building-layout-primitives/SKILL.md && echo "✅ Skill: building-layout-primitives exists"
ls skills/implementing-token-bridge/SKILL.md && echo "✅ Skill: implementing-token-bridge exists"

# 3. Check templates to create
echo "TODO: Create these files:"
echo "  - templates/primitives/layout.tsx"
echo "  - templates/primitives/tokens.ts"
echo "  - templates/primitives/use-scroll-reveal.ts"
echo "  - templates/primitives/use-stagger-entrance.ts"
echo "  - templates/primitives/use-hover-transform.ts"
```

---

## Implementation Checklist

- [ ] **Read** `CONSTRAINT_LAYER_WIRING_MANIFEST.md` (comprehensive)
- [ ] **Read** `README_CONSTRAINT_LAYER_IMPLEMENTATION.md` (implementation guide)
- [ ] **Apply Patch 1:** CLAUDE.md using `PATCHES_TEMPLATES_CLAUDE.md`
- [ ] **Apply Patch 2:** TASK.md using `PATCHES_TEMPLATES_TASK.md`
- [ ] **Apply Patch 3:** PROJECT_STATUS.md using `PATCHES_TEMPLATES_PROJECT_STATUS.md`
- [ ] **Verify patches** using verification commands above
- [ ] **Create template files** (layout.tsx, tokens.ts, hooks)
- [ ] **Test with first agent** project
- [ ] **Document lessons learned** and update if needed

---

## Key Takeaways

1. **Agents cannot skip constraints** — Phase gates block until evidence exists
2. **Primitives are Phase 0 REQUIRED** — Not optional, blocking to Phase 1
3. **Tokens are Phase 0 REQUIRED** — Not optional, blocking to Phase 1
4. **Evidence is tracked explicitly** — PROJECT_STATUS.md Primitives + Tokens columns
5. **Phases block without compliance** — Phase 1→2 gate enforces, not just suggests

---

## Documentatio Files Delivered

```
/sessions/optimistic-quirky-franklin/mnt/brudi/docs/internal/
├── README_CONSTRAINT_LAYER_IMPLEMENTATION.md ← Start here (you are reading this concept)
├── CONSTRAINT_LAYER_WIRING_MANIFEST.md ← Complete technical reference
├── PATCHES_TEMPLATES_CLAUDE.md ← Exact patches for CLAUDE.md
├── PATCHES_TEMPLATES_TASK.md ← Exact patches for TASK.md
├── PATCHES_TEMPLATES_PROJECT_STATUS.md ← Exact patches for PROJECT_STATUS.md
└── QUICK_REFERENCE_CONSTRAINT_LAYER.md ← This file (5-min overview)
```

Read in order:
1. **This file** (5 min) — Understand the big picture
2. **README_CONSTRAINT_LAYER_IMPLEMENTATION.md** (15 min) — Implementation steps
3. **CONSTRAINT_LAYER_WIRING_MANIFEST.md** (20 min) — Complete details
4. **Specific PATCHES_* files** (as needed) — Apply changes

---

**Version:** 1.0
**Date:** 2026-02-24
**Status:** Ready for Implementation
