---
name: starting-a-project
description: Use at the very beginning of any new project — website, app, or SaaS. Defines the correct order of decisions before writing a single line of code. Skipping this order creates technical debt from day one.
---

# Starting a Project

## The Order of Operations

**Wrong order = expensive corrections later. Always follow this sequence.**

```
1. Understand the goal       (what problem does this solve?)
2. Define the user           (who uses this, on what device?)
3. Choose the stack          (based on requirements, not habit)
4. Plan the structure        (folders, data model, routes)
5. Set up quality gates      (linting, formatting, types)
6. Build the first screen    (not the most complex — the most used)
```

---

## Step 1: Understand Before Building

Before any code, answer these:

```
- What is the ONE thing this product does?
- Who is the primary user? What device do they use?
- What does success look like? (metric, feeling, behavior)
- What is the MVP? What is NOT the MVP?
```

A PRD (Product Requirements Document) answers these. If there is no PRD, write one first — even one page.

**Red flag:** Starting to code before these are answered = building the wrong thing correctly.

---

## Step 2: Stack Decision

```
Is it content-heavy with little interactivity?
  → Astro (fastest, best SEO, ships zero JS by default)

Is it a full app with auth, data, user state?
  → Next.js App Router (RSC, API routes, Supabase integration)

Is it a highly interactive single-page experience?
  → Vite + React (no SSR overhead)
```

**Styling:** Tailwind CSS always. No CSS-in-JS, no styled-components.
**Animation:** GSAP for complex scroll/sequences. Framer Motion for component transitions.
**Database/Auth:** Supabase. No custom auth.
**Deployment:** Vercel (frontend). Supabase handles backend.

---

## Step 3: Project Structure

```
src/
├── app/              ← Next.js App Router pages
│   ├── (auth)/       ← Route groups (no URL segment)
│   └── (dashboard)/
├── components/
│   ├── ui/           ← Primitive components (Button, Input, Card)
│   └── features/     ← Feature-specific (DashboardHeader, InvoiceList)
├── lib/
│   ├── supabase/     ← Supabase client + queries
│   └── utils/        ← Pure utility functions
├── hooks/            ← Custom React hooks
├── types/            ← TypeScript types and interfaces
└── styles/           ← Global CSS, Tailwind config
```

**Rules:**
- `components/ui/` = reusable, no business logic
- `components/features/` = business-aware, not reusable
- Business logic never in UI components — belongs in `hooks/` or `lib/`

---

## Step 4: Quality Gates (Set Up Day One)

```json
// package.json — non-negotiable setup
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

```json
// tsconfig.json — strict mode always
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Rule:** TypeScript strict mode from day one. Turning it on later is painful.

---

## Step 5: First Screen — Not First Feature

Build the most-used screen first, not the most complex.

```
❌ Wrong: Start with admin dashboard (complex, rarely used)
✅ Right: Start with the main user flow (what they do every day)

❌ Wrong: Build auth before the core feature
✅ Right: Build core feature with mock data, add auth after
```

This validates the architecture with real UI before it's too late to change.

---

## Step 6: Placeholder Images — Never Empty, Never Grey

When no real images are provided, the site must still be evaluable from the first build. Grey rectangles and `<div>` placeholders block design judgment.

**Use specific Unsplash photo URLs — not random:**

```html
<!-- CORRECT — specific photo ID, consistent across reloads -->
<img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=1080&fit=crop&q=80" />

<!-- WRONG — deprecated API, changes on reload, can't evaluate design -->
<img src="https://source.unsplash.com/random/1920x1080?architecture" />
```

**URL pattern:**
```
https://images.unsplash.com/photo-[PHOTO_ID]?w=[WIDTH]&h=[HEIGHT]&fit=crop&q=80
```

**Process:** Search unsplash.com → find a thematic photo → copy its ID from the URL → construct the direct image URL.

Hotlinking Unsplash is permitted for demos and non-commercial projects.

---

## Alex's Non-Negotiables

Every project starts with these in place:

- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS configured
- [ ] Folder structure from Step 3 created (even if empty)
- [ ] `.env.local` template committed (without values)
- [ ] Supabase project created if needed
- [ ] Mobile-first mindset confirmed — first breakpoint is phone
- [ ] Placeholder images: specific Unsplash photo URLs, not grey boxes

---

## Common Mistakes

| Mistake | Cost | Fix |
|---------|------|-----|
| No PRD before coding | Build the wrong thing | One-page PRD first, always |
| Copy-paste folder structure from last project | Wrong architecture for this product | Design structure for THIS project |
| Skip TypeScript strict mode | Pain at scale | `"strict": true` day one |
| Build features before core flow | Wrong priorities, wasted work | Core user journey first |
| Auth before core feature | No validation of core idea | Mock data first, auth later |
| No `.env` template | Broken setup for collaborators | Commit `.env.example` immediately |
