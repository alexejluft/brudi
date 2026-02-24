# INSTALLATION GENERATION CONTRACT

What `use.sh` generates, what agents must read, what documents are maintained.

Generated: 2026-02-24
Brudi Version: 3.4.0

---

## 1. What `use.sh` Generates

When a developer runs `sh ~/Brudi/use.sh` inside a project directory, the following files and directories are created:

### Files Created in Project Root

| File | Source | Condition | Purpose |
|------|--------|-----------|---------|
| `AGENTS.md` | Inline template in use.sh (lines 86-122) | Created if missing or no "brudi" reference | Agent startup instructions, Tier-1 orchestration rules |
| `CLAUDE.md` | `~/Brudi/templates/CLAUDE.md` (with sed substitution) | Created if missing or no "brudi" reference | Claude Code agent context file |
| `TASK.md` | `~/Brudi/templates/TASK.md` | Created only if missing | Phase-based task tracking template |
| `PROJECT_STATUS.md` | `~/Brudi/templates/PROJECT_STATUS.md` | Created only if missing | Project status tracking |
| `Problems_and_Effectivity.md` | Inline template in use.sh (lines 191-211) | Created only if missing | Mandatory error/learning log |
| `eslint.config.brudi.js` | `~/Brudi/templates/eslint.config.brudi.js` | Created only if missing | Creative DNA ESLint rules |

### Directories Created

| Directory | Purpose |
|-----------|---------|
| `.brudi/` | Local orchestration state |
| `screenshots/` | Evidence storage for gate proofs |

### State File

| File | Source | Purpose |
|------|--------|---------|
| `.brudi/state.json` | `~/Brudi/orchestration/state.init.json` (via jq or sed) | Single source of truth: mode, phase, slice status, evidence |

### Primitives Copied to `src/primitives/`

| File | Source | Condition |
|------|--------|-----------|
| `layout.tsx` | `~/Brudi/templates/primitives/layout.tsx` | Only if target missing |
| `tokens.ts` | `~/Brudi/templates/primitives/tokens.ts` | Only if target missing |
| `use-scroll-reveal.ts` | `~/Brudi/templates/primitives/use-scroll-reveal.ts` | Only if target missing |
| `use-stagger-entrance.ts` | `~/Brudi/templates/primitives/use-stagger-entrance.ts` | Only if target missing |

### Git Hook

| File | Source | Condition |
|------|--------|-----------|
| `.git/hooks/pre-commit` | `~/Brudi/orchestration/pre-commit` | Only if `.git/` exists |

### .gitignore Amendment

Appends comment about `.brudi/state.json` to existing `.gitignore` (commented out by default).

---

## 2. What Agents Must Read at Startup

### Mandatory Reading Order (from AGENTS.md)

1. `~/Brudi/AGENTS.md` — Who Alex is, stack, standards
2. `~/Brudi/CLAUDE.md` — Same, optimized for Claude Code
3. `CLAUDE.md` (project root) — Project-specific context
4. `.brudi/state.json` — Current mode, phase, slice status

### Before Working on Animations

5. `~/Brudi/skills/implementing-token-bridge/SKILL.md`
6. `~/Brudi/skills/orchestrating-react-animations/SKILL.md`

### Before Each Slice

7. Run: `bash ~/Brudi/orchestration/brudi-gate.sh pre-slice`

### After Each Slice

8. Run: `bash ~/Brudi/orchestration/brudi-gate.sh post-slice <id>`
9. Update `.brudi/state.json` with slice results
10. Add entry to `Problems_and_Effectivity.md`

---

## 3. Orchestration Layer — What Exists in `~/Brudi/orchestration/`

| File | Purpose |
|------|---------|
| `brudi-gate.sh` | Main gate runner — runs all quality checks |
| `brudi-gate-complexity.sh` | Complexity evidence checks |
| `brudi-gate-constraints.sh` | Constraint enforcement |
| `motion-compliance-check.sh` | Token bridge motion compliance |
| `pre-commit` | Git hook that runs gates before commit |
| `state.init.json` | Template for new project state |
| `state.schema.json` | JSON schema for state validation |
| `COMPLEXITY_EVIDENCE_SCHEMA.md` | Schema documentation |
| `CONSTRAINTS-README.md` | Constraints documentation |
| `ast-engine/` | Layer 5 — AST-level code enforcement (5 analyzers) |
| `outcome-engine/` | Layer 6 — Playwright-based visual quality engine (7 modules) |

### AST Engine (Layer 5) Components

| File | Rules |
|------|-------|
| `ast-engine/index.js` | Orchestrator — runs all analyzers |
| `ast-engine/ts-analyzer.js` | TypeScript: NO_ANY, NO_IMPLICIT_ANY, NO_UNUSED_IMPORTS, NO_DEFAULT_EXPORT_ANON, NO_DEEP_NESTING, NO_PROP_DRILLING, STRICT_MODE, NO_DUPLICATED_TYPES, NO_CIRCULAR_IMPORTS |
| `ast-engine/jsx-analyzer.js` | JSX: MAX_JSX_DEPTH, NO_INLINE_STYLES, REQUIRE_KEY_PROP, SEMANTIC_HTML, NO_DIV_SOUP, MAX_COMPONENT_LENGTH |
| `ast-engine/tailwind-analyzer.js` | Tailwind: class tokenization, conflict detection, responsive audit, container max-width |
| `ast-engine/token-analyzer.js` | Token bridge: CSS ↔ GSAP token compliance |
| `ast-engine/import-graph-analyzer.js` | Import graph: circular deps, orphans |

### Outcome Engine (Layer 6) Components

| File | Purpose |
|------|---------|
| `outcome-engine/index.js` | Orchestrator — launches Playwright, collects metrics |
| `outcome-engine/dom-extractor.js` | DOM analysis: font extraction, color extraction, animation detection |
| `outcome-engine/layout-analyzer.js` | Layout quality analysis |
| `outcome-engine/typography-analyzer.js` | Typography quality analysis |
| `outcome-engine/animation-density-analyzer.js` | Animation density analysis |
| `outcome-engine/cognitive-load-analyzer.js` | Cognitive load analysis |
| `outcome-engine/cta-analyzer.js` | CTA effectiveness analysis |
| `outcome-engine/scoring-engine.js` | Composite scoring engine |

---

## 4. Template Sources in `~/Brudi/templates/`

| File | Used By | Purpose |
|------|---------|---------|
| `CLAUDE.md` | use.sh → project CLAUDE.md | Full agent context with Tier-1, mode control, hard gates |
| `CLAUDE.example.md` | Reference | Example CLAUDE.md |
| `TASK.md` | use.sh → project TASK.md | Phase-based task tracking |
| `PROJECT_STATUS.md` | use.sh → project PROJECT_STATUS.md | Status document |
| `eslint.config.brudi.js` | use.sh → project root | Creative DNA ESLint rules |
| `settings.json` | Reference | Editor settings |
| `primitives/layout.tsx` | use.sh → src/primitives/ | Layout primitive components |
| `primitives/tokens.ts` | use.sh → src/primitives/ | Animation token constants |
| `primitives/use-scroll-reveal.ts` | use.sh → src/primitives/ | Scroll animation hooks |
| `primitives/use-stagger-entrance.ts` | use.sh → src/primitives/ | Stagger animation hooks |

---

## 5. Skills Directory — `~/Brudi/skills/`

74 skill directories, each containing a `SKILL.md` file. Agents load the relevant skill when working on a specific topic. Skills are NOT copied by `use.sh` — they are read directly from `~/Brudi/skills/`.

### Key Skill Categories

- **Animation**: implementing-token-bridge, orchestrating-react-animations, designing-award-motion, animating-interfaces, scrolling-with-purpose
- **Architecture**: architecting-saas, making-tech-decisions, scaling-horizontally
- **Quality**: maintaining-quality, verifying-ui-quality, testing-end-to-end
- **Design**: crafting-brand-systems, crafting-typography, designing-visual-hierarchy
- **Build**: building-with-nextjs, building-layouts, building-components-core

---

## 6. Documents Maintained During Project Lifecycle

### By the Agent (after each slice)

| Document | Update Frequency | Content |
|----------|-----------------|---------|
| `.brudi/state.json` | After every slice | Phase, mode, slice status, evidence paths |
| `Problems_and_Effectivity.md` | After every slice (mandatory) | Errors, root causes, lessons learned |
| `TASK.md` | As tasks complete | Checkbox updates, phase progression |
| `PROJECT_STATUS.md` | At phase transitions | High-level status overview |

### By the Gate System (automated)

| Check | Trigger | Output |
|-------|---------|--------|
| Pre-commit hook | Every `git commit` | Pass/fail (blocks commit on fail) |
| `brudi-gate.sh pre-slice` | Before slice work begins | Readiness check |
| `brudi-gate.sh post-slice <id>` | After slice work completes | Quality validation |
| AST Engine | During gate run | Rule violations (JSON) |
| Outcome Engine | During gate run | Visual quality scores |

---

## 7. Invariants

These must always be true:

1. `use.sh` never overwrites existing files that already contain "brudi" references
2. `state.json` is never overwritten if it already exists
3. Primitives are only copied if the target file doesn't exist
4. Mode changes in `state.json` require `mode_set_by: "user"` — agents cannot self-escalate
5. `Problems_and_Effectivity.md` must have at least 1 entry per slice — empty blocks the gate
6. All GSAP animation values must come from `tokens.ts` — hardcoded values block commits
7. Skills are read from `~/Brudi/skills/`, never copied into projects

---

## 8. Verification Commands

```bash
# Verify use.sh output exists
ls -la AGENTS.md CLAUDE.md TASK.md PROJECT_STATUS.md Problems_and_Effectivity.md .brudi/state.json

# Verify primitives
ls -la src/primitives/tokens.ts src/primitives/use-scroll-reveal.ts src/primitives/use-stagger-entrance.ts

# Verify gate works
bash ~/Brudi/orchestration/brudi-gate.sh pre-slice

# Verify pre-commit hook
ls -la .git/hooks/pre-commit

# Verify state
cat .brudi/state.json | jq .
```
