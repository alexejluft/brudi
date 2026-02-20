# brudi

Award-level working identity for AI coding agents.

Install once. Your AI immediately understands how to build at world-class level.

---

## What Is This?

Brudi is not a skill package. Brudi is a **working identity** for AI agents.

After installation, your AI understands:
- What quality standard applies (award-level, not "good enough")
- How complex stacks are correctly orchestrated
- What AI-slop is and how to actively prevent it
- How to build websites, apps, and SaaS products at a professional level

---

## Installation

Two steps. That's it.

### Step 1 — Install Brudi globally (once per machine)

```bash
curl -fsSL https://raw.githubusercontent.com/alexejluft/brudi/main/skills/install.sh | sh
```

Brudi lands in `~/.brudi/` — one fixed location on your machine.

**Already have Brudi downloaded?** Copy it manually:
```bash
cp -r /path/to/brudi/skills/ ~/.brudi/
```

### Step 2 — Connect a project (once per project)

```bash
cd ~/projects/fairsplit
sh ~/.brudi/use.sh
```

This creates `AGENTS.md` and `CLAUDE.md` in your project folder.
Both point to `~/.brudi/` — your agent reads Brudi on every session start.

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

## Skills (24 total)

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
| `designing-with-perception` | Human perception, fluid typography, contrast |
| `designing-for-mobile` | Touch targets, thumb zones, safe areas |
| `handling-ui-states` | Loading/Error/Empty/Content — all 4 states |
| `crafting-typography` | Fluid type scale, variable fonts, hierarchy |
| `creating-visual-depth` | Layered shadows, glassmorphism, grainy gradients, elevation system |
| `building-interactions` | Hover states, :active, transition:all bug, prefers-reduced-motion |

### Stack Orchestration (Critical)

| Skill | Use When |
|-------|----------|
| `orchestrating-gsap-lenis` | Combining GSAP and Lenis smooth scroll |
| `orchestrating-react-animations` | GSAP or Framer Motion in React |
| `scrolling-with-purpose` | ScrollTrigger cleanup, Lenis integration, horizontal scroll |
| `orchestrating-css-js-animations` | CSS vs GSAP ownership, fill-mode conflict, will-change limits |

### SaaS

| Skill | Use When |
|-------|----------|
| `architecting-saas` | Route groups, auth middleware, multi-tenancy, service layer |

### Alex's Workflow

| Skill | Use When |
|-------|----------|
| `starting-a-project` | Beginning any new project |

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

**v0.11.0** — 24 skills across 8 categories, all evidence-based with pressure tests.

## License

MIT — [LICENSE](LICENSE)

---

*Built by Brudi & Alex. Not AI slop.*
