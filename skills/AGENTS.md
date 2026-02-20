# Brudi — Alex's Working Identity for AI Agents

You are working with Alex Luft on a web project.

**Read this file completely before writing a single line of code.**

---

## Who Alex Is

Alex is a developer building at award level. He works on:
- **Websites** — Astro, GSAP, Lenis, Three.js
- **Apps** — Next.js App Router, React, TypeScript
- **SaaS** — Next.js + Supabase + Tailwind

His reference points: Apple, AntiGravity, Framer, Revolut, GSAB.
His standard: Not "good enough" — world-class or nothing.

---

## Alex's Non-Negotiables

```
TypeScript strict mode — always
Tailwind CSS — always (no CSS-in-JS, no styled-components)
Mobile-first — first breakpoint is phone
4 UI states — Loading, Error, Empty, Content (never skip)
```

**Stack decisions:**
- Content site → Astro
- Full app with auth + data → Next.js App Router
- Highly interactive SPA → Vite + React
- Database + Auth → Supabase (no custom auth)
- Deployment → Vercel

---

## What AI-Slop Looks Like (Avoid All of This)

- Generic blue buttons and system fonts
- Desktop-first CSS that breaks on mobile
- Components with only happy-path state (no loading, no error, no empty)
- GSAP animations that never trigger, or break after navigation
- `useEffect` for things that should be derived state
- `margin` or `width` being animated instead of `transform`
- Arrays mutated instead of spread: `items.push(x)` instead of `[...items, x]`
- Emoji-heavy UI that looks cheap
- Flat, shadow-less, depth-less design

---

## The Orchestration Principle

**The #1 AI failure:** Libraries work in isolation, but break when combined.

When using multiple libraries together — always look for the relevant
orchestration skill before writing code.

Critical combinations:
- GSAP + Lenis → `orchestrating-gsap-lenis`
- GSAP + React → `orchestrating-react-animations`
- CSS + JS animations → `orchestrating-css-js-animations`

---

## Available Skills

These skills contain the exact patterns to use. **Load the relevant skill
before working on that domain.**

### Foundation
- `building-layouts` — Grid, Flexbox, Container Queries
- `designing-for-awards` — Visual decisions, avoiding AI-slop
- `animating-interfaces` — Timing, easing, performance rules
- `developing-with-react` — RSC, hooks, state patterns
- `typing-with-typescript` — Strict types, utility types
- `testing-user-interfaces` — Vitest, Testing Library
- `optimizing-performance` — Core Web Vitals, LCP, INP, CLS
- `building-accessibly` — WCAG, keyboard nav, ARIA

### Data & Stack
- `fetching-data-correctly` — Race conditions, TanStack Query, AbortController, optimistic updates
- `building-with-nextjs` — App Router, Server vs Client Components, caching, metadata

### Award-Level Craft
- `designing-with-perception` — Human perception, fluid type, contrast
- `designing-for-mobile` — Touch targets, thumb zones, safe areas
- `handling-ui-states` — All 4 states, skeleton, form states
- `crafting-typography` — Fluid type scale, variable fonts, hierarchy
- `creating-visual-depth` — Layered shadows, glassmorphism limits, grainy gradients, z-index system
- `building-interactions` — Hover states, :active feedback, transition:all bug, prefers-reduced-motion, :focus-visible

### Stack Orchestration (Critical)
- `orchestrating-gsap-lenis` — GSAP + Lenis: autoRaf, ticker, cleanup
- `orchestrating-react-animations` — GSAP/Framer in React lifecycle
- `scrolling-with-purpose` — ScrollTrigger cleanup, Lenis integration, horizontal scroll, sequential animations
- `orchestrating-css-js-animations` — CSS vs GSAP ownership, fill-mode conflict, will-change limits

### Alex's Workflow
- `starting-a-project` — PRD → stack → structure → first screen

---

## How to Use Skills

When working on a task, identify which skills apply, then read them:

```
User asks to animate something with GSAP in React →
  Load: animating-interfaces + orchestrating-gsap-lenis + orchestrating-react-animations
  Then write code.
```

Skills are in: `skills/skills/[skill-name]/SKILL.md`

---

## Quality Bar

Before marking anything done, ask:
1. Does it work on mobile (375px screen, one thumb)?
2. Are all 4 UI states handled?
3. Would this fit on AntiGravity or Framer's website?
4. Is there any AI-slop (generic design, missing states, broken animations)?

If any answer is "no" — it's not done.

---

## When in Doubt

Alex prefers:
- Less code over more code
- Opinions over options
- One right way over "you could also..."
- Shipping the most-used screen before the most complex one

**If something has a correct way to do it — do it that way. Don't suggest alternatives.**
