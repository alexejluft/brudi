# Pressure Test: architecting-saas

Evidenz-Basis: Next.js App Router Docs (Route Groups, Colocation), Supabase Auth Docs
(Server-Side Auth, getUser vs getSession security), Supabase RLS Best Practices,
Vercel "Common mistakes with the Next.js App Router".

---

## Scenario 1: Route Groups Struktur

**Prompt:**
"Baue eine Next.js SaaS App mit Marketing-Seiten, Auth und einem Dashboard."

**Expected WITHOUT skill:**
```
app/
├── about/page.tsx          # Marketing-Seite
├── login/page.tsx          # Auth
├── register/page.tsx
├── dashboard/page.tsx      # App
├── settings/page.tsx
└── layout.tsx              # Eine Layout für alles
```
- Keine Trennung von Marketing vs Auth vs App
- Ein globales Layout muss alle 3 Bereiche bedienen
- Marketing-Header erscheint im Dashboard

**Expected WITH skill:**
```
app/
├── (marketing)/            # Public, SEO-optimiert
│   ├── layout.tsx          # Mit Header/Footer
│   ├── page.tsx            # Landing: /
│   └── pricing/page.tsx    # /pricing
├── (auth)/                 # Zentriertes Auth-Layout
│   ├── layout.tsx
│   ├── login/page.tsx      # /login
│   └── register/page.tsx   # /register
└── (app)/                  # Authenticated, Sidebar-Layout
    ├── layout.tsx
    ├── dashboard/page.tsx  # /dashboard
    └── settings/page.tsx   # /settings
```
- Route Groups sind URL-unsichtbar: `(auth)/login` → `/login`
- Jeder Bereich hat sein eigenes Layout ohne Konflikte
- Navigation zwischen Gruppen = Full-Page-Reload nur bei separaten Root-Layouts

---

## Scenario 2: getSession() vs getUser() — Sicherheitslücke

**Prompt:**
"Schütze das Dashboard mit Supabase Auth in Next.js Middleware."

**Expected WITHOUT skill:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect('/login')
  }
  // session.user.id ist NICHT server-verifiziert — kann gefälscht werden!
}
```
- `getSession()` liest nur aus dem Cookie — ohne Server-Validierung
- Angreifer kann Cookie manipulieren um andere User IDs zu spoofen
- Supabase GitHub Issue #898: dokumentiertes Sicherheitsproblem

**Expected WITH skill:**
```typescript
// middleware.ts
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(url, key, {
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
  })

  // getUser() validiert gegen Supabase Auth Server — fälschungssicher
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
- `getUser()` sendet Request an Auth-Server — kryptografisch verifiziert
- Middleware erneuert auch den Session-Cookie (Token Refresh)

---

## Scenario 3: Multi-Tenancy Schema

**Prompt:**
"Baue eine SaaS mit Teams — mehrere User pro Account, jeder sieht nur seine Daten."

**Expected WITHOUT skill:**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),  -- nur ein Owner
  name TEXT
);

CREATE POLICY "Users own their projects"
ON projects FOR SELECT
USING (user_id = auth.uid());
-- Team-Mitglieder können nicht zugreifen!
```
- `user_id` = persönliche Ownership, nicht Team-Zugriff
- Kein `account_id` Konzept — kein Multi-Tenancy möglich

**Expected WITH skill:**
```sql
-- Accounts und Membership
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE account_members (
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  UNIQUE(account_id, user_id)
);

-- Data tables haben account_id, nicht user_id
CREATE TABLE projects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  name       TEXT NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS: Membership-Check statt user_id-Check
CREATE POLICY "Members can access account projects"
ON projects FOR SELECT
USING (
  account_id IN (
    SELECT account_id FROM account_members WHERE user_id = auth.uid()
  )
);

-- Performance-Indexes für RLS-Queries
CREATE INDEX idx_projects_account_id ON projects(account_id);
CREATE INDEX idx_account_members_user_id ON account_members(user_id);
```
- `account_id` statt `user_id` auf allen Tenant-Tabellen
- RLS prüft Membership — nicht Ownership
- `app_metadata` (server-controlled) für JWT Claims — nie `user_metadata`

---

## Scenario 4: Business Logic in Server Actions

**Prompt:**
"Baue eine Funktion die ein Projekt erstellt und validiert."

**Expected WITHOUT skill:**
```typescript
// app/dashboard/actions.ts
'use server'

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  if (!name || name.length < 3) return { error: 'Name too short' }

  const supabase = createClient()
  const { data, error } = await supabase.from('projects').insert({ name })
  revalidatePath('/dashboard')
  return { data, error }
}
// Nicht unit-testbar — braucht Next.js Runtime und Supabase
```

**Expected WITH skill:**
```typescript
// lib/services/project-service.ts — reines Business Logic (testbar)
import { z } from "zod"

const ProjectSchema = z.object({
  name: z.string().min(3),
  account_id: z.string().uuid(),
})

export async function createProject(input: unknown) {
  const validated = ProjectSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .insert(validated)
    .select()
    .single()
  if (error) throw error
  return data
}

// app/(app)/dashboard/actions.ts — dünner Wrapper (Next.js-spezifisch)
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
- Service Layer (lib/services/) = pure Logik, unit-testbar mit gemocktem Supabase
- Server Actions = dünner Next.js-Wrapper (nur revalidatePath, redirect etc.)

---

## Test Results

**Scenario 1:** ❌ Flat structure — ein Layout für Marketing + Auth + Dashboard
**Scenario 2:** ❌ `getSession()` — Cookie-Spoofing möglich, keine Server-Validierung
**Scenario 3:** ❌ `user_id` statt `account_id` — kein echtes Multi-Tenancy möglich
**Scenario 4:** ❌ Business Logic direkt in Server Actions — nicht testbar
