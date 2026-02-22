# Brudi — Public Identity Statement

**Version:** v3.3.0
**Date:** 2026-02-22
**Status:** Final

---

## What Is Brudi?

Brudi is a repo-based runtime framework for AI coding agents.

It is a Git repository installed once at `~/Brudi/` on a developer's machine. It connects to individual projects via `use.sh`, which writes `CLAUDE.md` and `AGENTS.md` pointing back to `~/Brudi/`. On every agent session, the agent reads the relevant files from that repo — standards, build rules, skill files — and operates within an enforced structure.

---

## For Whom?

Developers who:

- Use AI coding agents (Claude Code or compatible agents) for web development
- Build websites, web apps, or SaaS products
- Want consistent, enforced quality standards across projects and sessions — not suggestions

---

## For Whom Not?

Brudi has no utility for:

- Users who do not use AI coding agents
- Projects outside of web development
- Users who want a general-purpose prompt library or per-session instruction set
- Teams looking for an MCP server, plugin, or dynamic context injection system

---

## What Problem Does Brudi Solve?

AI coding agents produce inconsistent output across sessions. Without persistent, enforced context, they:

- Combine libraries incorrectly (GSAP + React, GSAP + Lenis, etc.)
- Skip loading, error, and empty UI states
- Use generic design patterns ("AI-slop") — flat, shadow-less, depth-less
- Mark sections complete without verification
- Drift in quality as context windows shrink

Brudi replaces per-session instructions with a versioned, machine-installed identity. Standards are not suggested — they are enforced at the gate level by `brudi-gate.sh` before each build slice. Evidence (screenshots, build output, console status) is required, not self-reported.

---

## What Problem Does Brudi Deliberately NOT Solve?

- **Model quality in general** — Brudi does not improve the underlying model. It enforces structure around the model's output.
- **Non-web domains** — Brudi's skill library covers web development: Astro, Next.js, React, TypeScript, Tailwind, GSAP, Supabase. It is not a generic agent framework.
- **Team collaboration or multi-user workflows** — Brudi is a single-developer, single-machine tool. It has no multi-tenancy, no shared state, no remote state sync.
- **CI/CD or automated pipeline execution** — Brudi is designed for interactive agent sessions, not automated pipelines.

---

## Architecture Summary

| Layer | What It Does |
|---|---|
| `~/Brudi/` (Git repo) | Single source of truth. One install per machine. |
| `install.sh` | Clones or updates. Pre-pull integrity check: dirty → detached-HEAD → branch=main. |
| `use.sh` | Connects a project. Writes `CLAUDE.md` + `AGENTS.md` + `.brudi/state.json`. |
| `CLAUDE.md` / `AGENTS.md` | The agent reads these on session start. They point to `~/Brudi/`. |
| `skills/` | 31 domain-specific files. Loaded on demand, not upfront. |
| `orchestration/brudi-gate.sh` | Enforces pre/post-slice checks and phase-transition gates. |
| `.brudi/state.json` | Project-local state: mode, phase, slices, gates, brudi_version. |
| `VERSION` | `3.3.0`. Read by `use.sh` at project init, checked by `brudi-gate.sh` for drift. |
