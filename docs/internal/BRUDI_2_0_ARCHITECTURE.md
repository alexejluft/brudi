# BRUDI 2.0 ARCHITECTURE — Constraint-First Design Blueprint

**Date:** 2026-02-24
**Type:** Architecture Document (Design only, kein Rewrite)
**Premise:** Brudi v3.4.0 checks process. Brudi 2.0 checks outcomes.

---

## 1. Systemziele

### Outcome-First
Every gate must answer: **"Is the output good?"** not just "Did the agent do the steps?"

| v3.4.0 (Process) | 2.0 (Outcome) |
|-------------------|----------------|
| Token file exists | Tokens are referenced in ≥80% of components |
| Screenshot path recorded | Screenshot file exists and is committed |
| Quality gate has 3 items | Quality gate items start with validated prefixes |
| Animation count ≥ 5 | Animations use token constants, not hardcoded values |
| Easing variety ≥ 3 | Easing strings come from tokens.ts, not inline strings |
| Mode is BUILD | Mode is BUILD AND action matches mode |

### Deterministisch
Given the same TASK.md, two different AI agents should produce structurally identical output (same primitives, same tokens, same spacing patterns). The creative variation is in content and visual design — not in layout architecture.

### Überprüfbar
Every quality claim must have an automated check. If it can't be checked automatically, it's a guideline (documented in skills), not a rule (enforced in gates).

---

## 2. Core Abstractions

### 2.1 Layout Primitives

**Problem:** v3.4.0 has no shared layout components. Every section reinvents `max-w-*`, `px-*`, `py-*` from scratch.

**Solution:** 4 primitives that every project must create in Phase 0.

```
Container — mx-auto max-w-{size} px-6 sm:px-8 lg:px-12
    sizes: narrow (4xl), default (6xl), wide (7xl), full (none)

Section — py-{spacing} with REQUIRED id prop
    spacing: sm (16), md (24), lg (32), xl (40)

Stack — flex flex-col gap-{size}
    gap: xs (2), sm (4), md (6), lg (8), xl (12)

Grid — grid grid-cols-{responsive}
    cols: { sm: 1, md: 2, lg: 3 } (default)
```

**Constraint:** Container is the ONLY way to set horizontal padding on sections. Direct `px-*` on section-level elements is a gate violation.

**Implementation:** `templates/primitives/layout.tsx` (created, 226 lines)

### 2.2 Token Bridge

**Problem:** CSS custom properties (`--duration-slow`, `--easing-enter`) exist but are never consumed by GSAP, which uses JS strings and numbers.

**Solution:** `tokens.ts` exports all motion/timing values as TypeScript constants.

```typescript
import { duration, easing, distance, stagger } from '@/primitives/tokens'

// Instead of: gsap.to(el, { y: 32, duration: 0.8, ease: "power2.out" })
// Write:      gsap.to(el, { y: distance.md, duration: duration.slow, ease: easing.enter })
```

**Constraint:** Hardcoded duration numbers and easing strings in GSAP calls are a gate violation.

**Implementation:** `templates/primitives/tokens.ts` (created, 281 lines)

### 2.3 Animation Hooks

**Problem:** ScrollTrigger boilerplate (useRef + useEffect + gsap.set + gsap.to + cleanup) is duplicated 7+ times per project.

**Solution:** Reusable hooks that encapsulate the pattern.

```typescript
import { useScrollReveal } from '@/primitives/use-scroll-reveal'
import { useStaggerEntrance } from '@/primitives/use-stagger-entrance'

// Instead of 20 lines of boilerplate per section:
const ref = useScrollReveal({ distance: 'md', duration: 'slow' })
const listRef = useStaggerEntrance({ stagger: 'normal' })
```

**Constraint:** If ScrollTrigger boilerplate appears in 3+ components without using hooks, it's a gate warning.

**Implementation:** `templates/primitives/use-scroll-reveal.ts` (252 lines), `use-stagger-entrance.ts` (321 lines)

### 2.4 Component Contracts

**Problem:** No formal interface between "what a section must provide" and "what gates check."

**Solution:** Every homepage section implements a standard contract:

```typescript
interface SectionContract {
  id: string;                    // Required for navigation
  container: 'narrow' | 'default' | 'wide' | 'full';
  spacing: 'sm' | 'md' | 'lg' | 'xl';
  animations: {
    entrance: boolean;           // Uses useScrollReveal or equivalent
    stagger: boolean;            // Uses useStaggerEntrance or equivalent
    hover: boolean;              // Interactive elements have hover states
  };
  tokens: {
    duration: boolean;           // Uses tokens.ts durations
    easing: boolean;             // Uses tokens.ts easings
  };
}
```

This contract is not enforced at the TypeScript level (too rigid) but is checked by gates via grep heuristics.

---

## 3. Constraint Layer Spec

### What MUST be enforced (blocking gates)

| Constraint | Check Method | Gate Location | Threshold |
|------------|-------------|---------------|-----------|
| Container primitive usage | grep for max-w-* variance | brudi-gate-constraints.sh | ≤ 4 unique max-w-* values |
| Text wrapping | grep for text elements without px-*/Container | brudi-gate-constraints.sh | 0 unwrapped text blocks |
| Spacing consistency | grep for py-*/gap-* variance | brudi-gate-constraints.sh | ≤ 6 unique spacing values |
| Section IDs on homepage | grep for section/div with id= | brudi-gate-constraints.sh | All sections have id |
| Token adoption ratio | count defined vs referenced tokens | brudi-gate-constraints.sh | > 0% (BLOCK), > 50% (WARN) |
| Screenshot files exist | stat check on recorded paths | brudi-gate.sh (patched) | File must exist |
| Quality gate content valid | prefix validation on check strings | brudi-gate.sh (patched) | Must start with recognized prefix |
| TypeScript strict mode | grep tsconfig.json | brudi-gate.sh (new) | strict: true required |
| No transition: all | grep + ESLint | pre-commit + ESLint | 0 matches |
| No gsap.from() | grep + ESLint | pre-commit + ESLint | 0 matches |
| No layout property animation | grep + ESLint | pre-commit + ESLint | 0 matches (upgrade from warn) |

### What SHOULD be enforced (future, P1/P2)

| Constraint | Check Method | Complexity | Impact |
|------------|-------------|------------|--------|
| Responsive breakpoint coverage | grep per component for sm:/md:/lg: | MEDIUM | Consistent responsive behavior |
| Token-only z-index values | grep for z-\[number\] patterns | LOW | No z-index collisions |
| No hardcoded hex colors in TSX | ESLint custom rule | MEDIUM | Full token adoption |
| Component deduplication | AST analysis for repeated patterns | HIGH | Architecture quality |
| Visual regression baseline | Playwright screenshot comparison | HIGH | Outcome-level validation |

---

## 4. Enforcement Stack

### 4 Enforcement Layers (2.0 Architecture)

```
Layer 4: OUTCOME GATES (NEW)           ← brudi-gate-constraints.sh
  Spatial consistency, token adoption, container enforcement

Layer 3: CREATIVE METRICS (EXISTS)      ← brudi-gate-complexity.sh
  Animation count, easing variety, depth layers

Layer 2: PATTERN BLOCKING (EXISTS)      ← ESLint + pre-commit
  Forbidden patterns: transition:all, gsap.from(), layout animation

Layer 1: EVIDENCE COLLECTION (EXISTS, PATCHED)   ← brudi-gate.sh
  Screenshot existence, quality gate content, state.json validity

Layer 0: FILE INFRASTRUCTURE (EXISTS)   ← use.sh
  Token files exist, materiality-tokens.css exists, state.json initialized
```

### Enforcement Timeline (when each layer runs)

```
use.sh              → Layer 0 (project setup)
pre-slice           → Layer 0 + Layer 3 (token existence + creative floor)
[Agent works]
post-slice          → Layer 1 + Layer 4 (evidence + outcome)
pre-commit          → Layer 2 (pattern blocking)
phase-gate          → All layers aggregated
```

### Gates vs ESLint vs Runtime

| Mechanism | When | Speed | Scope | Blocking? |
|-----------|------|-------|-------|-----------|
| ESLint (brudi-creative-dna) | During dev, pre-commit | Fast | Pattern-level | Per-file |
| Pre-commit hook | git commit | Fast | Staged files | YES |
| brudi-gate.sh pre-slice | Before each section | Fast | State + tokens | YES |
| brudi-gate-constraints.sh | Post-slice | Fast (~450ms) | Spatial quality | YES |
| brudi-gate-complexity.sh | Pre-slice + post-slice | Fast | Creative metrics | YES |

---

## 5. Migration Strategy (Evolutionary)

### Phase A: Immediate Patches (v3.4.1) — 4.5 hours

**Goal:** Close critical enforcement gaps without restructuring.

| Patch | File | Change | Impact |
|-------|------|--------|--------|
| A1 | `brudi-gate.sh` L244,251 | `warn()` → `errors+=()` | Screenshots required |
| A2 | `brudi-gate.sh` L259-285 | Validate quality gate content | Meaningful checks |
| A3 | `brudi-gate.sh` pre-slice | Add tsconfig.json strict check | TS strict enforced |
| A4 | `brudi-gate.sh` post-slice | Call `brudi-gate-constraints.sh check-all` | Spatial enforcement |
| A5 | `templates/CLAUDE.md` | Add primitives to Phase 0 + Phase 1 | Agents build primitives |
| A6 | `templates/TASK.md` | Add primitive creation tasks | Phase 0 complete |

**Backward compatibility:** 100%. Existing projects keep working. New projects get primitives.

### Phase B: Skill Integration (v3.5.0) — 8 hours

**Goal:** Skills teach the constraint-first approach.

| Change | New Content |
|--------|-------------|
| `skills/building-layout-primitives/SKILL.md` | Layout primitive usage guide |
| `skills/implementing-token-bridge/SKILL.md` | Token bridge integration |
| `templates/CLAUDE.md` Phase 0 skills | Add both new skills |
| `templates/CLAUDE.md` Forbidden Patterns | Add ad-hoc spacing, hardcoded GSAP |

### Phase C: Repo Cleanup (v3.5.1) — 3 hours

**Goal:** Clean repository structure per REPO_STRUCTURE_POLICY.md.

- Move 7 internal docs from root to `docs/internal/`
- Remove 3 duplicate files
- Consolidate primitives documentation into 1 file
- Establish naming convention policy

### Phase D: Advanced Enforcement (v3.6.0) — 20+ hours

**Goal:** Level 3 quality gates.

- ESLint custom rule: no-hardcoded-colors
- Responsive breakpoint contract enforcement
- Token adoption ratio threshold (50% minimum)
- Component deduplication detection
- Visual regression testing with Playwright

---

## 6. Definition of Done v2 (Outcome-Based)

### Current DoD v1 (Process-Based, 6 items):

1. `verifying-ui-quality` skill read + 3 checks documented
2. Code written and functional (Build = 0 errors)
3. Screenshot Desktop — file path in PROJECT_STATUS.md
4. Screenshot Mobile 375px — file path in PROJECT_STATUS.md
5. Console = 0 errors
6. PROJECT_STATUS.md updated

### Proposed DoD v2 (Outcome-Based, 11 items):

**Unchanged (items 1-6):** All v1 items remain.

**New items (7-11):**

7. **Container primitive used** — all section content wrapped in Container component. No ad-hoc `max-w-*` + `px-*` combinations.
   - Gate: `brudi-gate-constraints.sh check-containers` PASS

8. **Token bridge active** — all GSAP durations/easings reference `tokens.ts` constants. Zero hardcoded values.
   - Gate: grep for `duration:` and `ease:` in GSAP calls matches token imports

9. **Spacing consistency** — section vertical spacing uses ≤6 unique values from spacing scale.
   - Gate: `brudi-gate-constraints.sh check-spacing-tokens` PASS

10. **Section has unique id** — every homepage section has `id` attribute for navigation.
    - Gate: `brudi-gate-constraints.sh check-section-ids` PASS

11. **Screenshot files committed** — screenshot files exist at recorded paths (not just paths in state.json).
    - Gate: `brudi-gate.sh post-slice` now blocks (not warns) on missing files

### Transition Plan

- DoD v2 applies to all projects created with Brudi ≥ v3.5.0
- Existing projects continue with DoD v1 unless explicitly upgraded
- Items 7-11 are checked by `brudi-gate-constraints.sh` which is called automatically in post-slice

---

## Appendix: Why Not a Full Rewrite?

Brudi v3.4.0 has strong foundations:
- Gate architecture works (4-layer enforcement)
- State management works (state.json + schema validation)
- Skill system works (69 skills, well-organized)
- Pre-commit hook works (forbidden pattern blocking)
- Mode system works (BUILD/AUDIT/FIX/RESEARCH)

What's missing is **one layer** (outcome gates) and **three primitives** (Container, tokens.ts, animation hooks). This is a 4.5-hour patch, not a months-long rewrite.

The 2.0 architecture is about adding Layer 4 (outcome gates) on top of v3.4.0 — not replacing it.

---

*Architecture document complete. Design only. No code was rewritten.*
