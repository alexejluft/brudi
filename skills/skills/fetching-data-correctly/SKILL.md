---
name: fetching-data-correctly
description: Use when fetching data in React or Next.js — in useEffect, with TanStack Query, or in Server Components. Prevents race conditions, stale data, memory leaks, and broken optimistic updates.
---

# Fetching Data Correctly

## The Rule

**useEffect for data fetching = last resort.** In Next.js: async Server Component.
In React SPA: TanStack Query. Raw fetch in useEffect only when nothing else fits.

---

## Next.js: Fetch in Server Components

```tsx
// ✅ SSR — fresh every request
export default async function Page({ params }) {
  const { id } = await params                           // Next.js 15+: await params
  const data = await fetch(`/api/items/${id}`, {
    cache: 'no-store'                                   // explicit — never guess defaults
  }).then(r => r.json())
  return <div>{data.name}</div>
}

// ✅ ISR — revalidate every 60s
const data = await fetch('/api/items', { next: { revalidate: 60 } }).then(r => r.json())

// ✅ Static — cache forever
const data = await fetch('/api/config', { cache: 'force-cache' }).then(r => r.json())
```

**`cache: 'no-store'` and `next: { revalidate }` cannot be used together** — pick one.

---

## React SPA: TanStack Query

```tsx
// ✅ Correct setup — set staleTime or you'll see constant refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 }, // 5min — sane default for most data
  },
})

// ✅ Query
const { data, isLoading, error } = useQuery({
  queryKey: ['product', id],
  queryFn: () => fetch(`/api/products/${id}`).then(r => r.json()),
})

// Why staleTime matters:
// staleTime: 0 (default) = data instantly stale → background refetch on every mount/focus
// staleTime: 5min        = data fresh for 5min → no unnecessary refetches
```

---

## Race Condition Fix

```tsx
// ❌ BROKEN — older response can overwrite newer one
useEffect(() => {
  fetch(`/api/search?q=${query}`).then(r => r.json()).then(setResults)
}, [query])

// ✅ FIXED — abort previous request when query changes
useEffect(() => {
  const controller = new AbortController()
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => { if (err.name !== 'AbortError') setError(err) })
  return () => controller.abort()
}, [query])
```

**Simpler:** Use TanStack Query — it handles race conditions automatically.

---

## Optimistic Updates

```tsx
// Full pattern — all 3 handlers are required
const mutation = useMutation({
  mutationFn: (newItem) => fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) }),

  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ['items'] })   // 1. cancel in-flight refetches
    const previous = queryClient.getQueryData(['items'])        // 2. snapshot
    queryClient.setQueryData(['items'], old => [...old, newItem]) // 3. optimistic update
    return { previous }
  },

  onError: (_err, _newItem, context) => {
    queryClient.setQueryData(['items'], context.previous)       // 4. rollback on error
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] })      // 5. always sync with server
  },
})
```

**Never use optimistic updates for:** payments, deletions, anything irreversible.

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `useEffect` fetch in Next.js | Unnecessary client bundle, no SSO | Async Server Component + `cache:` |
| `staleTime: 0` (default) | Constant refetches, "why is it calling the API again?" | Set `staleTime: 5 * 60 * 1000` |
| No AbortController in useEffect | Race condition, stale results | Add controller + cleanup |
| Optimistic update without rollback | UI shows success on server error | `onMutate` + `onError` + `onSettled` |
| Missing `cancelQueries` in `onMutate` | In-flight refetch overwrites optimistic state | `await cancelQueries` first |
