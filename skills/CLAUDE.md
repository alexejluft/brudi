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
- CSS + JS animations → `orchestrating-css-gsap-conflicts`, `orchestrating-keyframes-js`, or `orchestrating-will-change`

---

## Asset Awareness

Before starting any project, read `~/.brudi/assets/INDEX.md` to discover pre-built:
- Variable font pairings with setup instructions
- Design tokens, Tailwind presets, and CSS resets
- i18n translation keys (154 UI phrases, 6 languages)
- Legal page templates (GDPR/DSGVO compliant)
- GSAP and Framer Motion code snippets

**Load only what the current phase requires.** Do NOT load all assets — they exist to be discovered when needed.

---

## Skills — Load by Phase

Read skills on demand as you work. Never load all skills at project start.

### Phase 1: Project Setup
Read these FIRST when starting any project.

- `starting-a-project` — PRD → stack → structure, mandatory briefing questions
- `crafting-brand-systems` — Design system foundations, tokens, color scales
- `crafting-typography` — Fluid type scales, variable fonts, hierarchy
- `designing-for-mobile` — Touch targets, thumb zones, safe areas
- `implementing-design-tokens` — CSS custom properties, naming, usage patterns
- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection

### Phase 2: Core Build
Read these when building features, components, and animations.

**Layout & Components:**
- `building-layouts` — Grid, Flexbox, Container Queries
- `building-components-core` — Component fundamentals, state architecture
- `building-accordion-patterns` — Accordion mechanics, nested state, accessibility
- `building-disclosure-patterns` — Disclosure widgets, collapse patterns, animation
- `building-button-states` — Button variants, states, feedback, disabled states
- `building-interaction-accessibility` — Decision trees, ARIA, AI failure modes
- `handling-ui-states` — All 4 states (Loading, Error, Empty, Content), skeletons

**Design & Perception:**
- `designing-award-layouts-core` — 8pt spacing, dark theme layering, principles
- `designing-award-navigation` — Navigation patterns, scroll indicators, hierarchy
- `designing-award-motion` — Motion systems, animation timing, choreography
- `designing-motion-timing` — Easing functions, duration rules, rhythm
- `designing-visual-hierarchy` — Visual weight, contrast, focal points, depth
- `creating-visual-depth` — Layered shadows, glassmorphism, grainy gradients, z-index systems
- `designing-for-awards` — Visual decisions, avoiding AI-slop

**React & TypeScript:**
- `developing-with-react` — RSC, hooks, state patterns, composition
- `typing-with-typescript` — Strict types, utility types, generics

**Data & APIs:**
- `building-with-nextjs` — App Router, Server vs Client Components, caching, metadata
- `fetching-data-correctly` — Race conditions, TanStack Query, AbortController, optimistic updates
- `handling-errors-idiomatically` — Error boundaries, typed error handling, fallbacks
- `validating-forms` — Form validation, Zod, submission patterns
- `implementing-auth-properly` — Session patterns, token handling, security
- `integrating-supabase` — Server vs browser client, realtime, Storage RLS, typed queries
- `handling-data-sync` — Optimistic updates, cache invalidation, infinite scroll

**Animations & Interactions:**
- `animating-interfaces` — Timing, easing, performance rules
- `orchestrating-react-animations` — GSAP/Framer in React lifecycle
- `orchestrating-gsap-lenis` — GSAP + Lenis: autoRaf, ticker, cleanup
- `orchestrating-css-gsap-conflicts` — CSS vs GSAP ownership, fill-mode conflict
- `orchestrating-keyframes-js` — @keyframes with JavaScript control, timing
- `orchestrating-will-change` — will-change optimization, performance patterns
- `orchestrating-motion-language` — Consistent motion principles, timing systems
- `orchestrating-3d-in-react` — Three.js in React, Babylon.js, performance
- `scrolling-with-purpose` — ScrollTrigger cleanup, Lenis integration, sequential animations
- `narrating-web-experiences` — Storytelling through motion, pacing, atmosphere
- `building-transitions-astro` — Astro View Transitions, page transition lifecycle
- `building-transitions-gsap` — GSAP page transitions, cleanup order, sequencing

**SaaS & Apps:**
- `architecting-saas` — Route groups, auth patterns, multi-tenancy schema, service layer
- `designing-saas-ux` — Onboarding, pricing tiers, empty states, settings architecture
- `handling-file-uploads` — File validation, progress tracking, CDN storage
- `implementing-i18n` — Routing, middleware, language switching, SEO
- `implementing-seo` — Metadata, structured data, canonicals, open graph
- `integrating-payments` — Payment gateways, PCI compliance, webhook handling, billing
- `managing-database-schemas` — Migrations, relationships, constraints, testing
- `managing-background-jobs` — Job queues, cron jobs, error recovery
- `securing-applications` — OWASP, CSRF, XSS, injection, rate limiting
- `managing-secrets` — Environment variables, key rotation, secret management

**Advanced Patterns:**
- `building-with-threejs` — Three.js setup, materials, lighting, performance
- `building-pwa` — Service workers, offline support, app manifest
- `designing-resilient-apis` — Versioning, backwards compatibility, rate limits
- `visualizing-data` — Charts, graphs, D3.js, data visualization best practices
- `monitoring-errors` — Error tracking, alerting, log aggregation
- `maintaining-quality` — Zod for JSON.parse, typed tryCatch, unused imports
- `making-tech-decisions` — State management, rendering strategy, bundle size

### Phase 3: Polish & Content
Read these when feature-complete and optimizing.

- `testing-user-interfaces` — Vitest, Testing Library, component testing
- `testing-accessibility` — WCAG, aXe, keyboard navigation, screen readers
- `building-accessibly` — Semantic HTML, ARIA, focus management
- `optimizing-images` — Responsive images, WebP, srcset, lazy loading
- `optimizing-performance` — Core Web Vitals, LCP, INP, CLS, code splitting
- `building-legal-pages` — Impressum, DSGVO Privacy Policy, Cookie Banner rules
- `testing-end-to-end` — Playwright, user flow testing, CI integration

### Phase 4: Launch & Scale
Read these when deploying and scaling.

- `deploying-to-production` — Vercel setup, env secrets, preview deployments
- `scaling-horizontally` — Database replication, caching strategies, CDN
- `monitoring-errors` — Error tracking, performance monitoring, analytics

---

## Skill Loading Rules

1. **At project start:** Read `starting-a-project` + Phase 1 skills only
2. **Before each task:** Read the relevant skill(s) for what you're building
3. **Never read all skills at once** — load on demand as work progresses
4. **Skills location:** `~/.brudi/skills/[skill-name]/SKILL.md`
5. **Orchestration principle:** If combining libraries, read the relevant orchestration skill first

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
