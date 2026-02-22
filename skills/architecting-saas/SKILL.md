---
name: architecting-saas
description: Use when structuring a Next.js SaaS app, protecting routes with Supabase auth, designing multi-tenant schemas, or deciding where business logic lives. AI uses getSession() (insecure), puts business logic in Server Actions (untestable), and misses multi-tenancy entirely.
---

# Architecting SaaS

## The Rule

Four architectural decisions determine whether a SaaS is production-ready or a security incident waiting to happen.

---

## Auth Middleware — getUser(), Not getSession()

```typescript
// ❌ getSession() reads cookie without validation — spoofable
const { data: { session } } = await supabase.auth.getSession()

// ✅ Use getUser() in middleware — validates against Auth server
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.redirect(new URL('/login', request.url))
```

See integrating-supabase for full middleware setup.

**Rule:** `getUser()` for all server auth checks. `getSession()` only for non-sensitive client data.

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
