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
// ❌ createBrowserClient in Server Component → runtime error
import { createBrowserClient } from "@supabase/ssr"
export default async function Page() {
  const supabase = createBrowserClient(url, key)  // breaks
}

// ✅ Two files: server.ts and client.ts
// server.ts: createServerClient (Server Components, Route Handlers, Server Actions)
// client.ts: createBrowserClient ("use client" components only)
// Both pass <Database> type, always use getUser() server-side
```

**Rule:** Server Components → `createServerClient`. Client Components → `createBrowserClient`. Always `getUser()` server-side — never `getSession()`.

---

## Realtime — Always removeChannel

```typescript
// ❌ No cleanup → memory leak
useEffect(() => {
  supabase.channel("room").on(...).subscribe()
}, [messages])

// ✅ Dedup in Strict Mode, cleanup required
useEffect(() => {
  const channel = supabase.channel("messages-channel")
    .on("postgres_changes", { event: "INSERT", table: "messages" }, (payload) => {
      setMessages((prev) =>
        prev.find((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]
      )
    }).subscribe()
  return () => { supabase.removeChannel(channel) }
}, [supabase])
```

**Rule:** Always `removeChannel()` in cleanup. Deduplication check required for Strict Mode.

---

## Storage — RLS + User-Scoped Paths

```sql
-- ✅ RLS on storage.objects — check first folder = user ID
CREATE POLICY "Users can upload/view own files" ON storage.objects
FOR ALL TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK ((storage.foldername(name))[1] = auth.uid()::text);
```

```typescript
// ✅ Upload with user scope: ${userId}/${filename}
const path = `${userId}/${Date.now()}.${ext}`
await supabase.storage.from("uploads").upload(path, file)
```

**Rule:** Every file scoped by user ID folder. RLS checks `(storage.foldername(name))[1]`.

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
