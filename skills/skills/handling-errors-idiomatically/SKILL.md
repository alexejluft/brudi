---
name: handling-errors-idiomatically
description: Use when implementing error handling in Next.js App Router with React and Supabase. Prevents unhandled crashes, exposed stack traces, and silent failures.
---

# Handling Errors Idiomatically

## The Rule

**Every route gets an error.tsx. Never expose stack traces. Check Supabase `.error` on every query. Log server-side, show friendly messages client-side.**

---

## error.tsx — Route Error Boundary

```tsx
// ✅ Correct: app/dashboard/error.tsx
'use client'
export default function Error({ error, reset }: {
  error: Error & { digest?: string }; reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
// ❌ WRONG: return <pre>{error.stack}</pre> — security risk
```

---

## not-found.tsx + global-error.tsx

```tsx
// ✅ app/not-found.tsx
export default function NotFound() { return <h1>Page not found</h1> }
// Usage: if (!post) notFound()

// ✅ app/global-error.tsx — catches root layout crashes
'use client'
export default function GlobalError({ error, reset }) {
  return (<html><body><h1>Critical Error</h1><button onClick={reset}>Recover</button></body></html>)
}
```

---

## API Route Error Handling

```tsx
// ✅ Correct: Typed responses, never expose internals
export async function POST(req: Request) {
  try {
    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return Response.json({ type: 'validation_error', errors: body.error.flatten().fieldErrors }, { status: 400 })
    }
    const { data, error } = await supabase.from('posts').insert(body.data).select()
    if (error) {
      console.error('[API] Supabase:', error.code, error.message)
      return Response.json({ type: 'database_error', message: 'Save failed' }, { status: 500 })
    }
    return Response.json(data)
  } catch (err) {
    console.error('[API] Unexpected:', err)
    return Response.json({ type: 'server_error', message: 'Internal error' }, { status: 500 })
  }
}
// ❌ WRONG: return Response.json({ error: err.message, stack: err.stack })
```

---

## Supabase Error Pattern

```tsx
// ✅ Correct: Always check .error
const { data, error } = await supabase.from('items').select().limit(10)
if (error) {
  console.error(`[Supabase ${error.code}] ${error.message}`)
  throw new Error('Failed to load items')
}
// ❌ WRONG: const { data } = await supabase.from('items').select()
// return data.map(...)  // Crashes if data is null
```

---

## Client-Side: Toast for User Errors

```tsx
// ✅ Correct: Friendly messages + network handling
'use client'
async function handleSubmit(data: FormData) {
  try {
    const res = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) })
    if (!res.ok) { toast.error((await res.json()).message || 'Something went wrong'); return }
    toast.success('Saved!')
  } catch { toast.error('Network error. Check your connection.') }
}
// ❌ WRONG: alert(error.message) or silent failure
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No `error.tsx` | Create for every route segment |
| Stack traces to client | Log server-side, show generic message |
| Ignoring Supabase `.error` | Always check `if (error)` before using `data` |
| Catch and swallow | Log + re-throw or handle explicitly |
| `alert()` for errors | Use toast notifications |
| No `not-found.tsx` | Create + use `notFound()` in data fetching |
