# brudi

Brudi is a Git repo installed at `~/Brudi/`. It provides AI coding agents with a versioned, project-aware runtime context: enforced build standards, phase gates, and domain-specific skill files that persist across sessions and projects.

**Not** a plugin. **Not** an MCP server. **Not** a per-session prompt. The agent reads files on demand — nothing is injected dynamically.

---

> **⚠️ Breaking Change: v3.3.0**
>
> Ab v3.3.0 ist `~/Brudi/` direkt das Git-Repo (vorher: Kopie mit Sync).
> Die alte Kopier-basierte Installation wird nicht mehr unterstützt.
> Bei bestehender Installation: `install.sh` erneut ausführen — erstellt automatisch
> ein Backup und installiert als Repo. Details: [INSTALL.md](INSTALL.md#breaking-change-v330)

---

## What Is Brudi?

Brudi is a repo-based runtime framework for AI coding agents working on web projects.

**What it is:**
- A Git repo at `~/Brudi/` — one install per machine, one `use.sh` per project
- A structured set of standards and skill files the agent reads when it needs them
- An enforcement layer: `brudi-gate.sh` runs checks before each build slice, requiring real evidence (screenshots, build output, console status) — not self-reported completion

**What it is not:**
- A general-purpose prompt or system message
- A tool for non-web projects
- Something that improves the model — it enforces structure around the model's output

**Why repo-based:** A file copy has no version tracking and no deterministic update path. `~/Brudi/` is the Git repo itself. `git pull` is the entire update mechanism, protected by a three-step integrity check before every pull.

**Why deterministic:** `install.sh` enforces a protection chain on every run: dirty-check → detached-HEAD-check → branch=main-check. Any inconsistency exits 1 with a specific message. Each project records its Brudi version in `.brudi/state.json`. Version drift is detected and reported at build time.

---

## Installation

Two steps. That's it.

### Step 1 — Install Brudi globally (once per machine)

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/install.sh | sh
```

Brudi lands in `~/Brudi/` — one fixed location on your machine.

**Already have Brudi downloaded?** Clone it manually:
```bash
git clone https://github.com/alexejluft/brudi.git ~/Brudi
```

### Step 2 — Connect a project (once per project)

```bash
cd ~/projects/fairsplit
sh ~/Brudi/use.sh
```

This creates `AGENTS.md` and `CLAUDE.md` in your project folder.
Both point to `~/Brudi/` — your agent reads Brudi on every session start.

**That's it. Your agent now works at award level.**

---

For detailed instructions and all scenarios, see [INSTALL.md](INSTALL.md).

---

## How It Works

```
Agent reads CLAUDE.md / AGENTS.md on session start
      ↓
Understands standards, stack, anti-patterns
      ↓
When working on a specific domain, loads the relevant skill:
  orchestrating-gsap-lenis/SKILL.md
  orchestrating-react-animations/SKILL.md
      ↓
Writes correct code on first attempt
```

Skills load only when needed. Initial context load is small (~150 tokens).

---

## Skills (31 total)

### Foundation

| Skill | Use When |
|-------|----------|
| `building-layouts` | Grid, Flexbox, Container Queries |
| `designing-for-awards` | Visual decisions, avoiding AI-slop |
| `animating-interfaces` | Timing, easing, performance rules |
| `developing-with-react` | RSC, hooks, state patterns |
| `typing-with-typescript` | Strict types, utility types |
| `testing-user-interfaces` | Vitest, Testing Library |
| `optimizing-performance` | Core Web Vitals, LCP, INP, CLS |
| `building-accessibly` | WCAG, keyboard nav, ARIA |

### Data & Stack

| Skill | Use When |
|-------|----------|
| `fetching-data-correctly` | Race conditions, TanStack Query, optimistic updates |
| `building-with-nextjs` | App Router, Server vs Client Components, caching, metadata |

### Code Quality

| Skill | Use When |
|-------|----------|
| `maintaining-quality` | Zod validation, typed tryCatch, T3 env, unused imports |
| `making-tech-decisions` | State management, rendering strategy, abstractions, bundle size |

### Award-Level Craft

| Skill | Use When |
|-------|----------|
| `designing-award-layouts` | 8pt spacing, dark theme layers, mobile-first, visual hierarchy, motion system |
| `designing-with-perception` | Human perception, fluid typography, contrast |
| `designing-for-mobile` | Touch targets, thumb zones, safe areas |
| `handling-ui-states` | Loading/Error/Empty/Content — all 4 states |
| `crafting-typography` | Fluid type scale, variable fonts, hierarchy |
| `creating-visual-depth` | Layered shadows, glassmorphism, grainy gradients, elevation system |
| `building-interactions` | Hover states, :active, transition:all bug, prefers-reduced-motion |
| `building-components` | FAQ accordion — GSAP height:auto, Framer Motion, numbered row variant, ARIA |

### Stack Orchestration (Critical)

| Skill | Use When |
|-------|----------|
| `orchestrating-gsap-lenis` | Combining GSAP and Lenis smooth scroll |
| `orchestrating-react-animations` | GSAP or Framer Motion in React |
| `scrolling-with-purpose` | ScrollTrigger cleanup, Lenis integration, horizontal scroll |
| `orchestrating-css-js-animations` | CSS vs GSAP ownership, fill-mode conflict, will-change limits |
| `building-page-transitions` | Page transitions — Astro native vs GSAP curtain |

### SaaS

| Skill | Use When |
|-------|----------|
| `architecting-saas` | Route groups, auth middleware, multi-tenancy, service layer |
| `integrating-supabase` | Server vs browser client, realtime, Storage uploads, typed queries |
| `handling-data-sync` | Optimistic updates, cache invalidation, infinite scroll, useMutation forms |
| `designing-saas-ux` | Onboarding, pricing page, empty states, settings architecture |

### Alex's Workflow

| Skill | Use When |
|-------|----------|
| `starting-a-project` | Beginning any new project — briefing questions, stack, structure |
| `building-legal-pages` | Any German/EU website — Impressum, DSGVO, Cookie-Banner |

---

## Philosophy

- **Depth over breadth** — Each skill is one domain, understood completely
- **Anti-AI-slop** — Every pattern solves a documented AI failure mode
- **Orchestration over isolation** — Libraries must work together correctly
- **Opinionated** — One correct way, not "you could also..."
- **TDD-tested** — Every skill has pressure test scenarios

See [docs/philosophy.md](docs/philosophy.md)

---

## Status

**v3.3.0** — 31 skills across 8 categories, all evidence-based with pressure tests. Repo-based installation, Tier-1 Orchestrierung.

## License

MIT — [LICENSE](LICENSE)

---

*Built by Brudi & Alex. Not AI slop.*
