---
name: architecting-saas
description: Use when structuring a Next.js SaaS app, protecting routes with Supabase auth, designing multi-tenant schemas, or deciding where business logic lives. AI uses getSession() (insecure), puts business logic in Server Actions (untestable), and misses multi-tenancy entirely.
---

# Architecting SaaS

## The Rule

Four architectural decisions determine whether a SaaS is production-ready or
a security incident waiting to happen.

---

## Route Groups — Three-Section Layout

```
app/
├── (marketing)/            # Public, SEO, marketing layout
│   ├── layout.tsx
│   ├── page.tsx            → /
│   └── pricing/page.tsx    → /pricing
├── (auth)/                 # Centered auth layout
│   ├── layout.tsx
│   ├── login/page.tsx      → /login
│   └── register/page.tsx   → /register
└── (app)/                  # Authenticated, sidebar layout
    ├── layout.tsx
    ├── dashboard/page.tsx  → /dashboard
    └── settings/page.tsx   → /settings
```

Route groups are URL-invisible — `(auth)/login` resolves to `/login`.
Each section gets its own layout with no conflicts. Only use separate root
layouts (`<html><body>`) when sections need completely different HTML — this
causes full-page reload on navigation between them.

---

## Auth Middleware — getUser(), Not getSession()

```typescript
// ❌ getSession() reads cookie without server validation — spoofable
const { data: { session } } = await supabase.auth.getSession()
// Attacker modifies cookie → session.user.id is a different user's ID
```

```typescript
// ✅ middleware.ts — full Supabase SSR pattern
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // getUser() validates against Auth server — cryptographically verified
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)'],
}
```

**Rule:** `getUser()` in all server-side auth checks. `getSession()` only for
reading non-security-sensitive session data on the client.

---

## Multi-Tenancy — account_id, Not user_id

```sql
-- ❌ user_id = personal ownership — team members can't access
CREATE TABLE projects (
  user_id UUID REFERENCES auth.users(id)
);
```

```sql
-- ✅ accounts + members → proper multi-tenancy
CREATE TABLE accounts (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE account_members (
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  UNIQUE(account_id, user_id)
);

CREATE TABLE projects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,  -- not user_id
  name       TEXT NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS checks membership — not ownership
CREATE POLICY "Members can read account projects"
ON projects FOR SELECT
USING (
  account_id IN (
    SELECT account_id FROM account_members WHERE user_id = auth.uid()
  )
);

-- Index every account_id column — RLS adds WHERE clauses
CREATE INDEX idx_projects_account_id ON projects(account_id);
CREATE INDEX idx_members_user_id ON account_members(user_id);
```

**Rules:** `account_id` on every tenant-scoped table. RLS enabled on every
table. Use `app_metadata` (server-controlled) for JWT claims — never
`user_metadata` (user-editable). Test from client SDK, not SQL Editor
(SQL Editor bypasses RLS).

---

## Service Layer — Testable Business Logic

```typescript
// ❌ Business logic in Server Action — requires Next.js runtime to test
'use server'
export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  if (!name || name.length < 3) return { error: 'Name too short' }
  const { data } = await supabase.from('projects').insert({ name })
  revalidatePath('/dashboard')
  return { data }
}
```

```typescript
// ✅ lib/services/project-service.ts — pure, unit-testable
import { z } from "zod"

const ProjectSchema = z.object({
  name: z.string().min(3),
  account_id: z.string().uuid(),
})

export async function createProject(input: unknown) {
  const validated = ProjectSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects").insert(validated).select().single()
  if (error) throw error
  return data
}

// ✅ app/(app)/dashboard/actions.ts — thin Next.js wrapper only
'use server'
export async function createProjectAction(formData: FormData) {
  try {
    const result = await createProject({
      name: formData.get("name"),
      account_id: formData.get("account_id"),
    })
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

**Rule:** `lib/services/` contains pure business logic (Zod validation +
Supabase queries). Server Actions are thin wrappers that only call services
and handle Next.js concerns (`revalidatePath`, `redirect`).
