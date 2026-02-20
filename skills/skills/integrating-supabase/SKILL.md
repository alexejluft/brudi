---
name: integrating-supabase
description: Use when setting up Supabase in Next.js, fetching data, handling realtime subscriptions, uploading files to Storage, or typing queries. AI uses browser client in Server Components (runtime error), skips removeChannel (memory leak), ignores Storage RLS, and leaves everything as any.
---

# Integrating Supabase

## The Rule

Four integration mistakes cause runtime errors, memory leaks, or security
vulnerabilities — all of which TypeScript misses without the correct setup.

---

## Client Creation — Server vs Browser

```typescript
// ❌ createBrowserClient in Server Component — uses localStorage, breaks auth
import { createBrowserClient } from "@supabase/ssr"
export default async function Page() {
  const supabase = createBrowserClient(url, key)  // Runtime error
}
```

```typescript
// utils/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/database.types"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

// utils/supabase/client.ts — browser only
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/database.types"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Rule:** `createServerClient` for Server Components, Route Handlers, Server
Actions. `createBrowserClient` for `"use client"` components only. Always
`getUser()` server-side — never `getSession()`.

---

## Realtime — Always removeChannel

```typescript
// ❌ No cleanup → memory leak + Strict Mode duplicate subscription bug
useEffect(() => {
  supabase.channel("room").on(...).subscribe()
}, [messages])  // messages in deps = new channel on every message
```

```typescript
// ✅ Correct Realtime pattern
"use client"
import type { Database } from "@/database.types"
type Message = Database["public"]["Tables"]["messages"]["Row"]

useEffect(() => {
  const channel = supabase
    .channel("messages-channel")  // unique name
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        const msg = payload.new as Message
        setMessages((prev) =>
          prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]
        )
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }  // ← required
}, [supabase])  // supabase only — stable reference
```

Realtime subscriptions only work in Client Components. Strict Mode
double-mounts require the deduplication check (`prev.find(m => m.id === msg.id)`).

---

## Storage — RLS + User-Scoped Paths

```typescript
// ❌ No RLS → "new row violates row-level security policy"
// ❌ No user scope → user A overwrites user B's "profile.jpg"
await supabase.storage.from("uploads").upload("profile.jpg", file)
```

```sql
-- ✅ RLS on storage.objects using user-scoped path
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- upsert: true requires UPDATE policy too
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

```typescript
// ✅ Upload with user-scoped path
export async function uploadFile(file: File, userId: string) {
  const ext = file.name.split(".").pop()
  const path = `${userId}/${Date.now()}.${ext}`  // "user-123/1234.jpg"

  const { error } = await supabase.storage
    .from("uploads")
    .upload(path, file, { cacheControl: "3600", upsert: true })

  if (error) throw error

  return supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl
}
```

`storage.foldername(name)[1]` = first folder segment. Public bucket bypasses
RLS for reads, but INSERT/UPDATE/DELETE still require policies.

---

## TypeScript — Generate Types, Pass Generic

```typescript
// ❌ No types → everything is any, typos undetected until runtime
const supabase = createClient(url, key)  // no <Database>
const { data } = await supabase.from("projcts").select()  // typo: no error
```

```bash
# Generate once, regenerate on schema changes
npx supabase gen types typescript --project-id "your-id" > database.types.ts
```

```typescript
// ✅ Extract row types
import type { Database } from "@/database.types"
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type InsertProject = Database["public"]["Tables"]["projects"]["Insert"]

// ✅ Typed complex queries with QueryData
import type { QueryData } from "@supabase/supabase-js"

const query = supabase
  .from("projects")
  .select("id, name, account_id, account_members(role)")

type ProjectWithRole = QueryData<typeof query>[0]

const { data } = await query
// data: Array<{ id: string; name: string; ... }> | null
```

Pass `<Database>` to both client factories. `QueryData<typeof query>`
infers join types without manual interfaces. Add `supabase gen types` to
CI to catch schema drift automatically.
