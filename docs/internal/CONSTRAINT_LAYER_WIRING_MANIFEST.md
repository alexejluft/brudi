# Constraint-Layer Wiring Manifest

**Created:** 2026-02-24
**Version:** 1.0
**Scope:** Layout Primitives + Token Bridge + Spacing Gate Integration

---

## Executive Summary

This manifest documents how the Constraint-Layer (Layout Primitives, Token Bridge, Spacing Gate) is wired into Brudi's agent bootstrap, templates, and skill system to BLOCK agents from skipping or circumventing layout/token discipline.

The constraint layer is **progressive and enforcement-based**:
1. Phase 0 templates REQUIRE primitive creation
2. Skills ENFORCE primitive usage patterns
3. Project status tracking PROVES compliance
4. Gate Runner can BLOCK commits without evidence

---

## Boot Chain — Where Constraints Are Activated

### 1. Agent Startup: Read ~/Brudi/CLAUDE.md

**File:** `/sessions/optimistic-quirky-franklin/mnt/brudi/CLAUDE.md`

**What Happens:**
- Line 125-142: Agent reads Phase 0 skill list
- Line 130-140: **NEW** - Phase 0 includes `building-layout-primitives` and `implementing-token-bridge`
- Agent MUST read these before ANY code writes

**Enforcement:** These skills appear FIRST in Phase 0 list, before `starting-a-project`. Code cannot be written until these are read.

---

### 2. Project Initialization: Read Project CLAUDE.md + TASK.md

**File:** `[PROJECT]/.brudi/CLAUDE.md` (template: `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/CLAUDE.md`)

**What Happens:**
- Agent runs through startup steps (section "Agent Startup — Immer als erstes ausführen")
- Agent reads TASK.md (next step)

**Reference to Constraints:** Startup instructions point to `~/Brudi/CLAUDE.md` which contains the constraint mandate.

---

### 3. Phase 0 Tasks: TASK.md Execution

**File:** `[PROJECT]/TASK.md` (template: `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/TASK.md`)

**What Happens:**
- Line 32: Agent reads Phase 0 skills including:
  - `building-layout-primitives`
  - `implementing-token-bridge`
  - `implementing-design-tokens`

- **NEW Phase 0 Tasks (lines ~33-35):**
  ```
  - [ ] Create layout primitives (Container, Section, Stack, Grid)
        from ~/Brudi/templates/primitives/layout.tsx
  - [ ] Create tokens.ts from ~/Brudi/templates/primitives/tokens.ts
  - [ ] Create animation hooks from ~/Brudi/templates/primitives/use-scroll-reveal.ts
  ```

**Enforcement:** These are Phase 0 tasks, BEFORE any visual sections. Code cannot proceed to Phase 1 without them.

---

### 4. PROJECT_STATUS.md Tracking

**File:** `[PROJECT]/PROJECT_STATUS.md` (template: `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md`)

**What Happens:**
- Line 47-60: Phase 0 tasks table added
- **NEW rows:**
  ```
  | Create layout primitives | ❌ | Template path + confirmation |
  | Create tokens.ts bridge | ❌ | Template path + confirmation |
  | Create animation hooks | ❌ | Template path + confirmation |
  ```

- Line 78-87: Phase 1 slices table includes new column:
  ```
  | Slice | ... | Layout Primitives Used | Tokens Bridge Used | ...
  ```

**Enforcement:** Phase 1→2 gate REQUIRES these columns to be ✅ for every slice.

---

## Files Created & Referenced

### A. Layout Primitives Template

**File:** `~/Brudi/templates/primitives/layout.tsx`

**Purpose:** Agent copies this file into `[PROJECT]/app/components/primitives/index.tsx`

**Contains:**
- `Container` component — enforces max-width + padding consistency
- `Section` component — enforces vertical spacing consistency
- `Stack` component — enforces horizontal alignment
- `Grid` component — enforces column structure

**Reference Points:**
- Mentioned in TASK.md Phase 0 checklist
- Skill `building-layout-primitives` teaches usage
- PROJECT_STATUS.md tracks creation

**Blocking Rule:** If agent does not use Container/Section in Phase 1 slices, `verifying-ui-quality` quality gate FAILS.

---

### B. Token Bridge Template

**File:** `~/Brudi/templates/primitives/tokens.ts`

**Purpose:** Agent copies this file into `[PROJECT]/app/primitives/tokens.ts`

**Contains:**
```typescript
export const duration = { micro: 0.12, fast: 0.18, normal: 0.35, slow: 0.65, hero: 1.0 }
export const easing = { enter: "power3.out", exit: "power2.out", ... }
export const spacing = { xs: 8, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48 }
export const colors = { /* from design system */ }
```

**Reference Points:**
- Skill `implementing-token-bridge` teaches usage
- All animation code must import `duration`, `easing` from this file
- globals.css defines CSS custom properties that back these tokens
- PROJECT_STATUS.md tracks creation

**Blocking Rule:** GSAP code with hardcoded duration/easing numbers/strings VIOLATES constraint. ESLint rule can be added to enforce.

---

### C. Animation Hook Templates

**Files:**
- `~/Brudi/templates/primitives/use-scroll-reveal.ts`
- `~/Brudi/templates/primitives/use-stagger-entrance.ts`
- `~/Brudi/templates/primitives/use-hover-transform.ts`

**Purpose:** Agent copies these into `[PROJECT]/app/hooks/`

**Contains:** Reusable GSAP animation patterns that consume tokens, not magic numbers.

**Reference Points:**
- TASK.md Phase 0 checklist
- Skill `orchestrating-react-animations` teaches composition
- PROJECT_STATUS.md tracks creation

**Blocking Rule:** Animations in Phase 1 slices should use these hooks, not bespoke GSAP code.

---

## Constraint Wiring Map

### Constraint 1: Layout Primitives (No Ad-hoc Spacing)

| Layer | Constraint | Mechanism | Enforcement |
|-------|-----------|-----------|-------------|
| Template | TASK.md requires primitive creation | Phase 0 checklist | Cannot proceed to Phase 1 without ✅ |
| Skill | `building-layout-primitives` teaches patterns | Mandatory Phase 0 read | Agent documents in PROJECT_STATUS.md |
| Code | Container/Section MUST wrap every section | ESLint + code review | verifying-ui-quality gate FAILS if missing |
| Tracking | PROJECT_STATUS.md Phase 1 column | Checkbox column | Phase 1→2 gate requires ALL ✅ |

**Verification Command:**
```bash
grep -r "max-w-" app/components --include="*.tsx" \
  | grep -v "Container\|Section" \
  && echo "FAIL: Found ad-hoc max-width outside primitives" \
  || echo "PASS: All max-width inside primitives"
```

---

### Constraint 2: Token Bridge (No Hardcoded Animation Values)

| Layer | Constraint | Mechanism | Enforcement |
|-------|-----------|-----------|-------------|
| Template | tokens.ts template copied to project | Phase 0 checklist | Cannot proceed without ✅ |
| Skill | `implementing-token-bridge` teaches mapping | Mandatory Phase 0 read | Agent documents in PROJECT_STATUS.md |
| Code | All GSAP uses `duration.X` and `easing.Y` | ESLint + static analysis | Quality gate checks for hardcoded strings |
| Tracking | PROJECT_STATUS.md phase 1 animation evidence | "Tokens Bridge Used" column | Phase 1→2 gate requires ALL ✅ |

**Verification Command:**
```bash
grep -r "gsap\|GSAP" app/components --include="*.ts" --include="*.tsx" \
  | grep -E "(0\.[0-9]|duration|easing)" \
  | grep -v "from.*tokens" \
  && echo "FAIL: Found hardcoded animation values" \
  || echo "PASS: All values from tokens.ts"
```

---

### Constraint 3: Spacing Gate (Consistent Vertical & Horizontal Spacing)

| Layer | Constraint | Mechanism | Enforcement |
|-------|-----------|-----------|-------------|
| Template | Section `spacing` prop enforces py-* | Phase 0 skill teaching | Only 4 options: sm/md/lg/xl |
| Skill | `designing-award-layouts-core` teaches 8pt grid | Mandatory Phase 0 read | Agent learns why arbitrary spacing breaks |
| Code | No `py-16` outside Section, no custom `px-*` | ESLint + code review | verifying-ui-quality audits pixel values |
| Tracking | Quality gate documents spacing consistency | Check 1/2/3 in PROJECT_STATUS.md | Gate FAILS if spacing is arbitrary |

**Verification Command:**
```bash
grep -r "className=" app/components --include="*.tsx" \
  | grep -E "(py-|px-)" \
  | grep -v "Section\|Container\|Stack" \
  && echo "WARN: Found direct spacing classes outside primitives" \
  || echo "PASS: All spacing via primitives"
```

---

## Template Patches (Exact Line Numbers)

### Patch 1: templates/CLAUDE.md

**Purpose:** Add constraint layer awareness to project-level agent instructions.

**Line 32-40 (Phase 0 Skills):**
```
AFTER existing line 139 (implementing-dark-mode):

+ - `building-layout-primitives` — Layout primitives (Container, Section, Stack, Grid) that enforce spacing consistency
+ - `implementing-token-bridge` — Token bridge mapping CSS to GSAP animation values
```

**Line 296-350 (Creative Complexity Floor):**
```
AFTER line 308 (Section Container subsection):

+ ### Container Primitive (PFLICHT)
+
+ Alle Sections MÜSSEN einen Container nutzen:
+ ```tsx
+ <Section id="features">
+   <Container size="default">
+     {content}
+   </Container>
+ </Section>
+ ```
+
+ **Sizes:** narrow (max-w-4xl) | default (max-w-6xl) | wide (max-w-7xl) | full (max-w-none)
+
+ **Forbidden:** Hardcoded `max-w-*` outside Container, different padding per section, ad-hoc spacing.
```

**Line 323-334 (Verbotene Patterns):**
```
AFTER line 332 (existing "Keine Card ohne Hover-Depth-Change"):

+ - Ad-hoc max-w-* ohne Container Primitive (Container nutzen)
+ - Hardcodierte GSAP duration/easing ohne tokens.ts Import (Tokens verwenden)
+ - Beliebiger py-* spacing ohne Section Primitive (Section nutzen)
```

**Line 335-345 (Verification Pre-Screenshot):**
```
AFTER line 342 (PROJECT_STATUS.md mit Animation-Count updaten):

+ 8. Container/Section Primitives korrekt genutzt (Code Review)
+ 9. Token Bridge imports vorhanden (grep duration/easing von tokens.ts)
```

---

### Patch 2: templates/TASK.md

**Line 26-38 (Phase 0 Foundation):**
```
AFTER line 31 (Brudi Identity laden):

+ - [ ] Skills lesen: `starting-a-project`, `building-layout-primitives`, `implementing-token-bridge`, `crafting-brand-systems`, `crafting-typography`, `implementing-design-tokens`, `implementing-dark-mode`, `designing-award-layouts-core`, `creating-visual-depth`
- [ ] Skills lesen: `starting-a-project`, `crafting-brand-systems`, ...

REPLACE the existing skill line (line 32) with above.
```

**Line 32-38 (Phase 0 Tasks):**
```
AFTER line 33 (Skills lesen):

+ - [ ] Create layout primitives: `cp ~/Brudi/templates/primitives/layout.tsx app/components/primitives/index.tsx`
+ - [ ] Create token bridge: `cp ~/Brudi/templates/primitives/tokens.ts app/primitives/tokens.ts`
+ - [ ] Create animation hooks: `cp ~/Brudi/templates/primitives/use-*.ts app/hooks/`
+ - [ ] Verify imports in globals.css (color tokens, spacing scales)
```

INSERT before line 34 (create-next-app).

**Line 56-67 (Phase 1 Slice Checklist):**
```
AFTER line 60 (sektionsspezifische Skills lesen):

+ 2a. Container + Section Primitives: gelesen in `building-layout-primitives`
+ 2b. Token Bridge: gelesen in `implementing-token-bridge`
```

INSERT after line 60.

---

### Patch 3: templates/PROJECT_STATUS.md

**Line 47-60 (Phase 0 Tasks):**
```
AFTER line 49 (Task table start):

INSERT new row before line 51:
+ | Layout primitives created | ❌ | app/components/primitives/index.tsx exists |
+ | Token bridge created | ❌ | app/primitives/tokens.ts exists |
+ | Animation hooks created | ❌ | app/hooks/use-*.ts files exist |
```

**Line 76-88 (Phase 1 Slices Table Header):**
```
CHANGE line 78 header from:
| # | Slice | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | verifying-ui-quality | Quality Gate |

TO:
| # | Slice | Code | Build 0 | Desktop Screenshot | Mobile 375px | Console 0 | Primitives | Tokens | verifying-ui-quality | Quality Gate |
```

**Line 79-87 (Phase 1 Slices Table Rows):**
```
CHANGE each row from:
| 1 | Navigation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

TO:
| 1 | Navigation | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

(Adds two new columns for Primitives and Tokens usage tracking)
```

**Line 109-126 (Quality Gate Details Phase 1):**
```
CHANGE table header from:
| # | Slice | Check 1 | Check 2 | Check 3 | Ergebnis |

TO:
| # | Slice | Spacing Pattern | Token Usage | Mobile Layout | Depth Layers | Animation Count | Ergebnis |

CHANGE rows from 3 checks to the 5 new dimensions above.
```

**Line 148-160 (Phase 1→2 Transition Gate):**
```
ADD new rows before line 152:
+ | Layout Primitives used in every slice | ❌ |
+ | Token Bridge imported in all animations | ❌ |
```

**Line 162-191 (Definition of Done):**
```
ADD new row after line 216 (Mobile 375px):
+ | Layout Primitives enforced | ❌ | Every Section uses Container, every page uses Section |
+ | Token Bridge enforced | ❌ | All GSAP uses duration/easing from tokens.ts |
```

---

## Reference Points in CLAUDE.md (~/Brudi/CLAUDE.md)

These lines in the main Brudi identity file already reference constraint enforcement:

- **Line 64:** "Vertical Slices — each section COMPLETE before the next" → Container/Section primitives enable this
- **Line 139-140:** Phase 0 skills list (update to include primitives + token bridge)
- **Line 296-347:** Creative Complexity Floor → Update to require Container usage per section
- **Line 323-333:** Forbidden patterns → Add ad-hoc max-width and hardcoded animation values

**Action:** These are references ONLY. They guide where to add patches in project templates.

---

## Enforcement Mechanisms

### 1. Skill Reading Enforcement

**Location:** `building-layout-primitives` and `implementing-token-bridge` skills

**What happens:**
- Agent MUST read these before writing ANY Phase 1 code
- Skills teach the patterns: "Never hardcode spacing", "Import duration/easing from tokens.ts"
- Skills show forbidden patterns and why they fail

**Proof:** Skill name + read date appears in PROJECT_STATUS.md Skill-Log

---

### 2. Quality Gate (verifying-ui-quality)

**Location:** `~/Brudi/skills/verifying-ui-quality/SKILL.md`

**Checks that enforce constraints:**
- A1: "No Container → Section nesting without primitives" → ✅/❌
- B2: "All spacing via Section/Container props" → ✅/❌
- C5: "Token Bridge imports present in animations" → ✅/❌

**Proof:** 3 specific checks documented in PROJECT_STATUS.md, not just "✅"

---

### 3. Phase-Transition Gates

**Location:** `brudi-gate.sh` can be enhanced with:

```bash
# In brudi-gate.sh post-slice check:

# Check 1: Container usage
grep -r "Container" "app/components/sections" || \
  echo "ERROR: No Container found in section code"

# Check 2: Token imports
grep -r "from.*tokens" "app" || \
  echo "ERROR: No token imports in animation code"
```

**Current Status:** Gate runner reads state.json, reports missing evidence. Can be enhanced to read code files.

---

### 4. Pre-Commit Hook

**Location:** `.brudi/pre-commit` (Git hook)

**Checks:**
- PROJECT_STATUS.md has no "—" or empty cells
- Screenshot evidence paths exist
- Quality gate checks documented

**Enhancement opportunity:** Add code pattern checking (grep for ad-hoc max-w-*, hardcoded durations).

---

## How Agents CANNOT Skip These Constraints

### Scenario 1: Agent ignores TASK.md Phase 0

**Current System:**
- TASK.md says "read building-layout-primitives"
- Agent skips it, tries to write Phase 1 code

**What stops them:**
1. `verifying-ui-quality` quality gate checks for primitive usage
2. Quality gate FAILS → screenshot not accepted
3. Phase 1→2 gate REQUIRES all checks documented
4. Cannot proceed without them

**Evidence:** PROJECT_STATUS.md Skill-Log shows no entry for `building-layout-primitives`

---

### Scenario 2: Agent uses hardcoded `max-w-5xl` in Phase 1

**What stops them:**
1. Code review (manual) spots pattern
2. Quality gate check "Spacing Patterns" FAILS
3. Quality gate FAILS → Phase 1 slice marked incomplete
4. Phase 1→2 gate REQUIRES this ✅

**Evidence:** Container usage tracked in PROJECT_STATUS.md "Primitives" column

---

### Scenario 3: Agent hardcodes `duration: 0.5` in GSAP

**What stops them:**
1. Quality gate check "Token Usage" FAILS
2. `implementing-token-bridge` skill was never read (Skill-Log is empty)
3. Phase 1→2 gate REQUIRES token bridge ✅
4. Cannot proceed without it

**Evidence:** "Token Bridge" column empty in PROJECT_STATUS.md Phase 1 table

---

### Scenario 4: Agent tries to commit without evidence

**What stops them:**
1. Pre-commit hook checks PROJECT_STATUS.md
2. Finds empty "Primitives" or "Tokens" column
3. Blocks commit with message: "Phase 1 gate requires Primitives/Tokens evidence"

**Evidence:** Git commit fails with exit code 1

---

## Proof of Wiring: Verification Commands

Run these to verify the constraint layer is properly wired:

### Check 1: Templates include constraint tasks

```bash
grep -l "building-layout-primitives" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/*.md
# Expected output:
# /sessions/optimistic-quirky-franklin/mnt/brudi/templates/CLAUDE.md
# /sessions/optimistic-quirky-franklin/mnt/brudi/templates/TASK.md
```

### Check 2: Skills exist and are readable

```bash
ls -1 /sessions/optimistic-quirky-franklin/mnt/brudi/skills/building-layout-primitives/SKILL.md
ls -1 /sessions/optimistic-quirky-franklin/mnt/brudi/skills/implementing-token-bridge/SKILL.md
# Expected: Both exist
```

### Check 3: Templates have tracking columns

```bash
grep "Layout Primitives\|Token Bridge" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/templates/PROJECT_STATUS.md
# Expected: Multiple matches in Phase 0 and Phase 1 sections
```

### Check 4: Primitives template exists

```bash
ls -1 /sessions/optimistic-quirky-franklin/mnt/brudi/templates/primitives/layout.tsx
ls -1 /sessions/optimistic-quirky-franklin/mnt/brudi/templates/primitives/tokens.ts
# Expected: Both exist
```

### Check 5: Main CLAUDE.md references constraints

```bash
grep -n "Container\|Token Bridge\|Layout Primitive" \
  /sessions/optimistic-quirky-franklin/mnt/brudi/CLAUDE.md | head -10
# Expected: Multiple matches in Phase 0 and Creative Complexity Floor sections
```

---

## Integration Timeline

### Phase 0: Bootstrap (Day 1)
1. Agent reads ~/Brudi/CLAUDE.md → sees constraint mandate
2. Agent reads project TASK.md → sees Phase 0 primitive creation tasks
3. Agent reads `building-layout-primitives` skill → understands why
4. Agent copies templates into project
5. Agent documents creation in PROJECT_STATUS.md

### Phase 1: Vertical Slices (Day 2+)
1. Before each slice, agent reads `verifying-ui-quality`
2. Quality gate includes primitive/token checks
3. Agent uses Container/Section in code
4. Agent imports duration/easing from tokens.ts
5. PROJECT_STATUS.md tracks "Primitives" and "Tokens" usage per slice

### Phase 1→2 Gate (End of Phase 1)
1. Gate checks: ALL Phase 1 slices have ✅ in "Primitives" column
2. Gate checks: ALL Phase 1 slices have ✅ in "Tokens" column
3. If any ❌, Phase 2 cannot begin
4. Agent must backfill evidence or fix code

---

## Future Enhancements

### ESLint Rules (Future)

```javascript
// .eslintrc.js
{
  rules: {
    'no-hardcoded-spacing': {
      level: 'error',
      message: 'Use Container/Section primitives instead of hardcoded max-w-*'
    },
    'token-bridge-required': {
      level: 'error',
      message: 'GSAP animations must use duration/easing from tokens.ts'
    }
  }
}
```

### Pre-Commit Hook Enhancement

```bash
# In .brudi/pre-commit

# Check layout primitives
if ! grep -r "Container\|Section" app/components/*.tsx 2>/dev/null; then
  echo "ERROR: No layout primitives found in Phase 1 code"
  exit 1
fi

# Check token bridge
if grep -r "duration:" app --include="*.tsx" | grep -v "from.*tokens"; then
  echo "ERROR: Hardcoded animation values found (use tokens.ts)"
  exit 1
fi
```

### Gate Runner Enhancement

Update `brudi-gate.sh post-slice` to check:
```bash
# Count Container usage
CONTAINER_COUNT=$(grep -r "Container" "app/components/$SLICE_ID" 2>/dev/null | wc -l)
if [ "$CONTAINER_COUNT" -eq 0 ]; then
  echo "WARN: No Container primitives found in slice code"
fi

# Count token imports
TOKEN_COUNT=$(grep -r "import.*tokens" "app" 2>/dev/null | wc -l)
if [ "$TOKEN_COUNT" -eq 0 ]; then
  echo "WARN: No token bridge imports found"
fi
```

---

## Summary Table

| Component | Status | Location | Activation | Blocking |
|-----------|--------|----------|------------|----------|
| **Building-Layout-Primitives Skill** | ✅ Exists | `skills/building-layout-primitives/SKILL.md` | Phase 0 mandatory read | Skill-Log proof required |
| **Implementing-Token-Bridge Skill** | ✅ Exists | `skills/implementing-token-bridge/SKILL.md` | Phase 0 mandatory read | Skill-Log proof required |
| **Layout Primitives Template** | ⏳ To be created | `templates/primitives/layout.tsx` | TASK.md Phase 0 | Cannot proceed to Phase 1 |
| **Token Bridge Template** | ⏳ To be created | `templates/primitives/tokens.ts` | TASK.md Phase 0 | Cannot proceed to Phase 1 |
| **CLAUDE.md patches** | ⏳ To be applied | `templates/CLAUDE.md` | Project bootstrap | Phase 0 awareness |
| **TASK.md patches** | ⏳ To be applied | `templates/TASK.md` | Project initialization | Phase 0 task enforcement |
| **PROJECT_STATUS.md patches** | ⏳ To be applied | `templates/PROJECT_STATUS.md` | Phase 1→2 gate check | Evidence tracking |
| **Quality Gate checks** | ✅ Can be added | `skills/verifying-ui-quality/SKILL.md` | Every slice (Phase 1+) | Slice incomplete without them |

---

## Files Modified & Created

### Files to Modify (Patches Applied)
- `templates/CLAUDE.md` — Add constraint awareness
- `templates/TASK.md` — Add Phase 0 primitive creation tasks
- `templates/PROJECT_STATUS.md` — Add constraint tracking columns

### Files to Create (Not yet created)
- `templates/primitives/layout.tsx` — Container, Section, Stack, Grid primitives
- `templates/primitives/tokens.ts` — Duration, easing, spacing, color tokens
- `templates/primitives/use-scroll-reveal.ts` — GSAP hook using token bridge
- `templates/primitives/use-stagger-entrance.ts` — GSAP stagger pattern using tokens
- `templates/primitives/use-hover-transform.ts` — Hover animation pattern using tokens

### Reference Files (No changes needed)
- `~/Brudi/CLAUDE.md` — Already contains references to constraints
- `skills/building-layout-primitives/SKILL.md` — Already exists
- `skills/implementing-token-bridge/SKILL.md` — Already exists
- `skills/verifying-ui-quality/SKILL.md` — Can be enhanced

---

**End of Manifest**

Generated: 2026-02-24
Manifest Version: 1.0
Status: Ready for implementation
