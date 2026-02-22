---
name: managing-secrets
description: Use when handling API keys, database credentials, or environment variables in Next.js with Vercel and Supabase. Prevents secret exposure and misconfiguration.
---

# Managing Secrets

## The Rule

**Never prefix secrets with `NEXT_PUBLIC_`. Validate env vars at startup. Scope secrets per environment.**

---

## Environment Variable Hierarchy

Next.js loads in order (first wins): `process.env` → `.env.local` → `.env.production`/`.env.development` → `.env`

```bash
# ✅ .env.local (never committed — local overrides)
DATABASE_URL=postgres://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ✅ .env.example (committed — documents required vars)
DATABASE_URL=your_database_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# ❌ WRONG: .env with real secrets committed to git
```

---

## The NEXT_PUBLIC_ Rule

```tsx
// ✅ Public data only — bundled into client JS
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  // Safe: anon key is public by design

// ❌ WRONG: Secrets with NEXT_PUBLIC_ — visible in browser DevTools
NEXT_PUBLIC_DATABASE_PASSWORD=secret123
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...  // Bypasses RLS!
```

---

## Server-Only Access

```tsx
// ✅ Correct: API routes and Server Components
// app/api/admin/route.ts
export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY  // Safe
  const supabase = createClient(process.env.SUPABASE_URL!, serviceKey!)
  return Response.json(await supabase.from('users').select())
}

// ❌ WRONG: Client Component — process.env is undefined (non-NEXT_PUBLIC_)
// 'use client'
// const key = process.env.DATABASE_PASSWORD  // Always undefined
```

---

## Supabase Keys

| Key | Scope | Purpose |
|-----|-------|---------|
| `SUPABASE_ANON_KEY` | Client + Server | Public queries, respects RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server ONLY** | Admin ops, bypasses ALL RLS — never `NEXT_PUBLIC_` |

---

## Runtime Validation

```tsx
// ✅ Correct: Fail fast on missing vars
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
// Throws at startup if any var is missing → no silent runtime failures

// ❌ WRONG: No validation → cryptic errors in production
```

---

## Vercel + .gitignore + Edge

```bash
# ✅ Vercel: Scope secrets per environment (Settings → Environment Variables)
# Production: STRIPE_KEY=sk_live_...  Preview: STRIPE_KEY=sk_test_...

# ✅ .gitignore — always ignore:
# .env.local  .env.*.local  .env.production  .env.development
# Keep: .env.example

# ✅ Edge Runtime: process.env works (injected at deploy time)
# ❌ WRONG: Same prod keys in preview, committing .env, fs.readFileSync at edge
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `NEXT_PUBLIC_` on secrets | Remove prefix, access in API routes only |
| Committing `.env` files | `.gitignore` + rotate compromised keys |
| Hardcoded API keys | Use env vars + Vercel dashboard |
| Service role key in client | Server-only, never `NEXT_PUBLIC_` |
| No env validation | Zod schema `.parse(process.env)` at startup |
| Same keys all environments | Vercel scoped variables per environment |
