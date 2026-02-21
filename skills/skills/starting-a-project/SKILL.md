---
name: starting-a-project
description: Use at the very beginning of any new project. Defines questions to ask, stack decisions, folder structure, and phase communication rules. Skipping this creates technical debt from day one.
---

# Starting a Project

## STOP — Ask First, Build Second

**If the user has not answered all four required questions, do not write a single line of code.**

```
Required — cannot build without:
1. What is this product / website? (topic, name, purpose)
2. Who is the target audience? (and what device?)
3. What pages / screens are needed?
4. What is the design direction? (style, color, references, animations)
```

A one-sentence command like "build the Luma Studio website" is NOT enough. Stop and ask all four.

**Optional — propose defaults, let user decide:**

```
5. Hero style: large background image or typographic headline?
6. Preloader: loading screen before content? Default: No.
7. Dark/Light mode: SaaS → both. Portfolio → ask. Blog → system preference.
8. Legal pages (DE/EU): Always generate. Load `building-legal-pages` skill.
9. Page transitions: GSAP-based or CSS. Load `building-page-transitions` skill.
```

---

## Phase Communication — Never Leave Users in the Dark

When working in phases, the user does not know your roadmap. Unfinished pages look like bugs.

**Rule 1: After each phase → brief status report:**
```
✅ Built: Homepage, Header, Footer, Dark Mode, Design Tokens
⏳ Placeholder: Legal pages (structure ready, client data needed)
🔜 Next phase: Case study pages, animations, contact form
```

**Rule 2: Unfinished pages get a visible Dev Banner:**
```tsx
// ✅ components/ui/dev-banner.tsx — shows in development only
export function DevBanner({ phase, note }: { phase: number; note: string }) {
  if (process.env.NODE_ENV === 'production') return null
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-200 dark:bg-yellow-900
      text-yellow-900 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm shadow-lg">
      Phase {phase} — {note}
    </div>
  )
}
// ❌ WRONG: empty pages with no explanation → user thinks it's broken
```

**Rule 3: Missing content uses `<Placeholder>` component (see `building-legal-pages`).**

---

## Stack + Structure

**Stack:** Next.js App Router (content + apps), Tailwind CSS, GSAP, Supabase, Vercel. Vite + React only for pure SPAs.

```
src/
├── app/              ← Next.js App Router pages
│   └── [locale]/     ← i18n locale routing
├── components/
│   ├── ui/           ← Reusable (Button, Input, Placeholder, DevBanner)
│   └── features/     ← Page-specific (HeroSection, ServiceGrid)
├── lib/              ← Utilities, constants, Supabase client
├── hooks/            ← Custom React hooks (useGSAP, useMediaQuery)
├── i18n/             ← config.ts + request.ts (see implementing-i18n)
├── types/            ← TypeScript interfaces
└── styles/           ← globals.css with design tokens
```

`ui/` = reusable, no business logic. `features/` = page-aware, not reusable.
**Day one:** TypeScript `"strict": true`, Tailwind configured, `.env.example` committed.

---

## Placeholder Images

Never grey boxes. Use specific Unsplash photo URLs:

```
✅ https://images.unsplash.com/photo-[ID]?w=1920&h=1080&fit=crop&q=80
❌ https://source.unsplash.com/random/1920x1080 (deprecated, inconsistent)
```

Search unsplash.com → find thematic photo → copy ID → construct URL. If image 404s, pick a different photo — Unsplash IDs can expire.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Build before asking 4 required questions | STOP. Ask first, build second |
| Empty pages without explanation | `<Placeholder>` + `<DevBanner>` components |
| No phase status report | Brief ✅/⏳/🔜 summary after each phase |
| Skip TypeScript strict | `"strict": true` day one |
| Auth before core feature | Build core with mock data, add auth later |
| Grey placeholder boxes | Specific Unsplash URLs with real photos |
| No `.env` template | Commit `.env.example` immediately |
