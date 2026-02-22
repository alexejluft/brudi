# Brudi v3 — Alex's Working Identity for AI Agents

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
Vertical Slices — each section COMPLETE before the next
Visual Verification — screenshot before marking "done"
```

**Stack decisions:**
- Content site → Astro
- Full app with auth + data → Next.js App Router
- Highly interactive SPA → Vite + React
- Database + Auth → Supabase (no custom auth)
- Deployment → Vercel

---

## The Vertical Slice Principle (NEW in v3)

**The #1 reason v2 failed:** Building a skeleton first, then adding animations later = the first visible result looks dead.

**The v3 rule:** Build each section COMPLETELY before moving to the next.

"Complete" means:
- ✅ Layout (Grid, Spacing, Responsive)
- ✅ Visual Depth (Shadows, Surface-Layers, Gradients)
- ✅ Content (Real images or high-quality placeholders — NEVER empty black boxes)
- ✅ Animation (Entrance, Hover, Scroll-Trigger)
- ✅ Mobile (375px verified)

**Build order for a typical homepage:**
1. Preloader (if award-level)
2. Hero Section (complete with animations)
3. Services/Features Section (complete with animations)
4. Portfolio/Case Studies (complete with images + animations)
5. CTA Section
6. Footer

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
- **Empty black placeholder boxes** where images should be
- **Static pages** when GSAP is in the tech stack
- **GSAP specified but never installed**
- **Only 1-2 background shades** instead of 4 dark layers

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

Before starting any project, read `~/Brudi/assets/INDEX.md` to discover pre-built:
- Variable font pairings with setup instructions
- Design tokens, Tailwind presets, and CSS resets
- i18n translation keys (154 UI phrases, 6 languages)
- Legal page templates (GDPR/DSGVO compliant)
- GSAP and Framer Motion code snippets

**Load only what the current phase requires.** Do NOT load all assets — they exist to be discovered when needed.

---

## Skills — Load by Phase

**How to read a skill:** `Read ~/Brudi/skills/[skill-name]/SKILL.md`
Always append `/SKILL.md` — the skill name is a directory, not a file.

### Phase 0: Foundation
Read these FIRST when starting any project.

- `starting-a-project` — Setup, dependency decisions, Phase 0 quality gate
- `crafting-brand-systems` — Design system foundations, tokens, color scales
- `crafting-typography` — Fluid type scales, variable fonts, hierarchy
- `designing-for-mobile` — Touch targets, thumb zones, safe areas
- `implementing-design-tokens` — CSS custom properties, naming, usage patterns
- `implementing-dark-mode` — Light/dark theme layering, CSS variables, system detection
- `designing-award-layouts-core` — 8pt spacing, dark theme 4-layer system, principles
- `creating-visual-depth` — Layered shadows, glassmorphism, grainy gradients

**Phase 0 ends with a Quality Gate. Do not proceed without passing it.**

### Phase 1: Vertical Slices (Build Sections)
Read the relevant skill(s) BEFORE building each section.

**Verification (READ FOR EVERY SECTION):**
- `verifying-ui-quality` — Quality gates, 25-point audit, browser verification protocol

**Layout & Components:**
- `building-layouts` — Grid, Flexbox, Container Queries
- `building-components-core` — Component fundamentals, state architecture
- `building-accordion-patterns` — Accordion mechanics, nested state, accessibility
- `building-disclosure-patterns` — Disclosure widgets, collapse patterns, animation
- `building-button-states` — Button variants, states, feedback, disabled states
- `building-interaction-accessibility` — Decision trees, ARIA, AI failure modes
- `building-portfolio-cards` — Award-level portfolio cards, image strategy, animations
- `building-preloaders` — Preloader patterns, GSAP timelines, page reveal
- `handling-ui-states` — All 4 states (Loading, Error, Empty, Content), skeletons

**Design & Perception:**
- `designing-award-navigation` — Navigation patterns, scroll indicators, hierarchy
- `designing-award-motion` — Motion systems, animation timing, choreography
- `designing-motion-timing` — Easing functions, duration rules, rhythm
- `designing-visual-hierarchy` — Visual weight, contrast, focal points, depth
- `designing-for-awards` — Visual decisions, avoiding AI-slop

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

### Phase 2: Pages & Polish
Read these when all homepage sections are complete.

- `testing-user-interfaces` — Vitest, Testing Library, component testing
- `testing-accessibility` — WCAG, aXe, keyboard navigation, screen readers
- `building-accessibly` — Semantic HTML, ARIA, focus management
- `optimizing-images` — Responsive images, WebP, srcset, lazy loading
- `optimizing-performance` — Core Web Vitals, LCP, INP, CLS, code splitting
- `building-legal-pages` — Impressum, DSGVO Privacy Policy, Cookie Banner rules
- `testing-end-to-end` — Playwright, user flow testing, CI integration

### Phase 3: Launch & Scale
Read these when deploying and scaling.

- `deploying-to-production` — Vercel setup, env secrets, preview deployments
- `scaling-horizontally` — Database replication, caching strategies, CDN
- `monitoring-errors` — Error tracking, performance monitoring, analytics

---

## Skill Loading Rules

1. **Phase 0:** Read `starting-a-project` + ALL Phase 0 skills (including `designing-award-layouts-core` + `creating-visual-depth`)
2. **Before EACH section:** Read `verifying-ui-quality` + section-relevant skills
3. **After EACH section:** Run the Verification Protocol from `verifying-ui-quality`
4. **Never skip verification** — a section is NOT done until it passes the Quality Gate
5. **Skills location:** `~/Brudi/skills/[skill-name]/SKILL.md`
6. **Orchestration principle:** If combining libraries, read the relevant orchestration skill first

---

## The 7 Mental Checkpoints (per Section)

Before and during every vertical slice, ask yourself:

1. **[UX Lead]** What impression should the user get from this section?
2. **[Design System]** Are all tokens ready (colors, spacing, typography)?
3. **[Layout]** Grid structure? Responsive stack order?
4. **[Assets]** Images: Unsplash IDs or gradient placeholders? (NEVER empty black)
5. **[Motion]** Entrance animation? Hover states? Scroll trigger?
6. **[QA]** Screenshot taken? Quality Gate passed? Mobile checked?
7. **[Integrator]** Build still works? No regressions?

---

## Placeholder Strategy (BLOCKING RULE)

When no client images are available:

```
1. FIRST CHOICE: Unsplash specific photo IDs
   → https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
2. SECOND CHOICE: CSS gradient placeholders
   → linear-gradient(135deg, var(--surface) 0%, var(--surface-high) 100%)
3. FORBIDDEN: Empty boxes with only bg-color
   → NEVER leave a card/box without visual content
```

---

## Quality Bar

Before marking anything done:
1. Does it work on mobile (375px screen, one thumb)?
2. Are all 4 UI states handled?
3. Does EVERY section have entrance animation (if GSAP is in the stack)?
4. Is there visual depth (4 dark layers, shadows, gradients)?
5. Are there ZERO empty black placeholder boxes?
6. Did you take a screenshot and verify against the Quality Gate?
7. Is there any AI-slop (generic design, missing states, broken animations)?

If any answer is "no" — it's not done.

---

## 🚫 Hard Gates — Verbindliche Regeln

### Slice Completion Checklist (JEDER Slice, JEDE Seite)

Ein Slice ist NICHT abgeschlossen ohne ALLE 6 Punkte:

1. `verifying-ui-quality` Skill gelesen + 3 Checks dokumentiert
2. Code geschrieben und funktional
3. Screenshot Desktop (Pfad in PROJECT_STATUS.md)
4. Screenshot Mobile 375px (Pfad in PROJECT_STATUS.md)
5. Console = 0 Errors (verifiziert)
6. PROJECT_STATUS.md aktualisiert

**Nächster Slice erst wenn alle 6 Punkte erfüllt.**

### Anti-Pattern Guardrails (VERBOTEN)

| Pattern | Status |
|---------|--------|
| `gsap.from()` mit String-Selektoren | ⛔ VERBOTEN — immer `gsap.set()` + `gsap.to()` mit Element-Refs |
| `* { margin: 0 }` oder eigene CSS-Resets | ⛔ VERBOTEN — Tailwind v4 Preflight reicht |
| `reactStrictMode: false` | ⛔ VERBOTEN — Code muss idempotent sein |
| Batch-Screenshots am Ende statt pro Slice | ⛔ VERBOTEN — Screenshot nach JEDEM Slice |
| Mobile-Test ignorieren | ⛔ VERBOTEN — 375px Screenshot ist PFLICHT |

### Run-Ende Regeln

Ein Run endet NUR wenn:
- Alle Phasen der TASK.md abgeschlossen, ODER
- User sagt STOP, ODER
- Echte Blockade (dokumentiert in PROJECT_STATUS.md)

Offene Phasen existieren → automatisch weitermachen. Nicht fragen, nicht warten.

### PROJECT_STATUS.md Pflicht

Jedes Projekt MUSS eine `PROJECT_STATUS.md` führen. Template: `~/Brudi/templates/PROJECT_STATUS.md`
- Wird nach JEDEM Slice aktualisiert
- Enthält Screenshot-Pfade als Evidenz
- Enthält Issue-Tracking
- Ist die einzige Wahrheitsquelle für den Projektstatus

---

## When in Doubt

Alex prefers:
- Less code over more code
- Opinions over options
- One right way over "you could also..."
- Shipping the most-used screen before the most complex one
- **Complete sections over many half-built sections**
- **Visual quality over code quantity**

**If something has a correct way to do it — do it that way. Don't suggest alternatives.**
