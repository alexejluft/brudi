# Pressure Test: integrating-supabase

Evidenz-Basis: Supabase @supabase/ssr Docs (Server-Side Auth, Creating a Client),
Supabase Realtime Docs, Storage Access Control + Helper Functions Docs,
Generating TypeScript Types Docs, GitHub Issues #169 (Realtime + Strict Mode),
#1846 (createBrowserClient in Server Components), #502 (Storage upsert).

---

## Scenario 1: Browser Client in Server Components

**Prompt:**
"Hole Daten aus Supabase in einem Next.js Server Component."

**Expected WITHOUT skill:**
```typescript
// app/dashboard/page.tsx (Server Component)
import { createBrowserClient } from "@supabase/ssr"

export default async function DashboardPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from("projects").select()
  return <div>{data?.length} Projekte</div>
}
```
- GitHub Issue #1846: `createBrowserClient` nutzt `localStorage` + `document.cookie`
- Server Components haben keinen Browser — Runtime-Error oder Hydration-Mismatch
- Auth-State stimmt nicht — Session wird falsch gelesen

**Expected WITH skill:**
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

// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase.from("projects").select()
  return <div>{data?.length} Projekte</div>
}
```
- `createServerClient` liest Cookies server-seitig — korrekt für App Router
- `createBrowserClient` nur in `"use client"` Komponenten
- `getUser()` validiert gegen Auth-Server — nie `getSession()` server-seitig

---

## Scenario 2: Realtime ohne Cleanup

**Prompt:**
"Zeige neue Nachrichten in Echtzeit wenn sie in Supabase ankommen."

**Expected WITHOUT skill:**
```typescript
"use client"
export default function Messages() {
  const [messages, setMessages] = useState([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .channel("room:123")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => setMessages([...messages, payload.new])
      )
      .subscribe()
    // Kein Cleanup — Memory Leak
  }, [messages]) // messages in deps → infinite re-subscriptions
}
```
- GitHub Issue #169: React 18 Strict Mode doppelt-mounted → doppelte Subscription
- GitHub Issue #1440: "subscribe can only be called a single time per channel instance"
- `messages` in deps → jede neue Nachricht erstellt neuen Channel

**Expected WITH skill:**
```typescript
"use client"
import type { Database } from "@/database.types"

type Message = Database["public"]["Tables"]["messages"]["Row"]

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("messages-channel")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) =>
            prev.find((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]
          )
        }
      )
      .subscribe()

    // Cleanup auf Unmount — verhindert Memory Leak + Strict Mode Bug
    return () => { supabase.removeChannel(channel) }
  }, [supabase]) // nur supabase in deps — stable reference
}
```

---

## Scenario 3: Storage ohne RLS und Pfad-Kollisionen

**Prompt:**
"Lass User Profilbilder hochladen und in Supabase Storage speichern."

**Expected WITHOUT skill:**
```typescript
const { data, error } = await supabase.storage
  .from("uploads")
  .upload("profile.jpg", file)
// Fehler: "new row violates row-level security policy"
// Oder: alle User überschreiben gegenseitig "profile.jpg"
```
- Kein RLS auf `storage.objects` → alle Uploads scheitern
- Kein user-scopedter Pfad → User A überschreibt User Bs Datei
- Public Bucket umgeht RLS nur für Reads — nicht für Uploads

**Expected WITH skill:**
```sql
-- Storage RLS: user-scopeter Pfad mit auth.uid()
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

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```
```typescript
// Upload mit user-scopedtem Pfad
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split(".").pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`  // z.B. "user-123/1234567.jpg"

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file, { cacheControl: "3600", upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from("uploads").getPublicUrl(filePath)

  return publicUrl
}
```
- `storage.foldername(name)[1]` = erster Ordner im Pfad = `userId`
- Jeder User hat seinen eigenen Namespace — keine Kollisionen
- `upsert: true` erfordert INSERT + SELECT + UPDATE Policy

---

## Scenario 4: Supabase ohne TypeScript-Typen

**Prompt:**
"Baue eine Funktion die Projekte aus Supabase holt."

**Expected WITHOUT skill:**
```typescript
// Kein supabase gen types — alles any
const supabase = createClient(url, key)  // kein <Database> Generic
const { data } = await supabase.from("projects").select()
// data: any — kein Autocomplete, kein Typ-Check
// Tippfehler im Tabellennamen? Kein Fehler bis Runtime
```

**Expected WITH skill:**
```bash
# Typen generieren (einmalig + bei Schema-Änderungen)
npx supabase gen types typescript --project-id "dein-project-id" > database.types.ts
```
```typescript
// Typen verwenden
import type { Database } from "@/database.types"
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type InsertProject = Database["public"]["Tables"]["projects"]["Insert"]

// Client mit Generic — vollständige Typsicherheit
const supabase = createBrowserClient<Database>(url, key)

// Typed Query mit QueryData für komplexe Selects
import type { QueryData } from "@supabase/supabase-js"
const query = supabase.from("projects").select("id, name, account_id")
type ProjectList = QueryData<typeof query>

const { data } = await query
// data: Array<{ id: string; name: string; account_id: string }> | null
```
- `<Database>` Generic: Autocomplete für Tabellennamen, Spaltennamen, Relationships
- `QueryData<typeof query>`: typsichere Joins ohne manuellen Interface-Overhead
- Schema-Änderung → `supabase gen types` neu laufen, TypeScript findet Abweichungen sofort

---

## Test Results

**Scenario 1:** ❌ `createBrowserClient` in Server Component — Runtime-Error, Auth-Mismatch
**Scenario 2:** ❌ Kein `removeChannel()` — Memory Leak, Strict Mode Duplicate-Subscription
**Scenario 3:** ❌ Kein RLS, kein user-scope — Security-Lücke + Pfad-Kollisionen
**Scenario 4:** ❌ Kein `<Database>` Generic — alles `any`, Tippfehler unentdeckt bis Runtime
