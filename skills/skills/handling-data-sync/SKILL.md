---
name: handling-data-sync
description: Use when writing TanStack Query mutations, optimistic updates, cache invalidation, infinite scroll, or form submissions. AI mutates cache directly (breaks rollback), invalidates everything, returns 0 from getNextPageParam (infinite loop), and uses useState+fetch instead of useMutation.
---

# Handling Data Sync

## The Rule

Four TanStack Query mistakes fail at runtime: API errors, list updates, scroll end, double-submit.

---

## Optimistic Updates — Never Mutate the Cache Object

```typescript
// ❌ Mutate in place → rollback has already mutated reference
const prev = queryClient.getQueryData(["todos", id])
prev.title = newTitle  // ← mutates cache directly

// ✅ Create new object, deep clone for rollback
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] })
    const prev = queryClient.getQueryData(["todos", newTodo.id])
    queryClient.setQueryData(["todos", newTodo.id], newTodo)
    return { previousTodo: structuredClone(prev) }
  },
  onError: (_err, newTodo, context) => {
    queryClient.setQueryData(["todos", newTodo.id], context?.previousTodo)
  },
})
```

**Rule:** Never mutate cache. `structuredClone` for snapshot. `cancelQueries` prevents races.

---

## Cache Invalidation — Targeted, Not Broad

```typescript
// ❌ Invalidates every query in the app (cascading refetch)
queryClient.invalidateQueries()

// ❌ refetch() only works in the component holding that hook
const { data, refetch } = useQuery(...)
mutation.onSuccess = () => refetch()
```

```typescript
// ✅ Prefix match — invalidates ["todos"] and ["todos", id]
queryClient.invalidateQueries({ queryKey: ["todos"] })

// ✅ Predicate for complex cases
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === "todos" &&
    (query.queryKey.length === 1 || query.queryKey[1] === data.id),
})
```

Use `refetch()` only for user-triggered manual refresh (button click) or
disabled queries that need a one-time trigger. For post-mutation sync,
always use `invalidateQueries()`.

---

## Infinite Scroll — undefined Signals End, Not 0

```typescript
// ❌ Returns 0 → hasNextPage stays true → infinite loop
getNextPageParam: (lastPage) => lastPage.nextCursor  // 0 is a valid cursor!

// ❌ Passes event object to fetchNextPage
<button onClick={fetchNextPage}>Load More</button>
```

```typescript
// ✅ undefined or null = no more pages
const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam }) =>
    fetch(`/api/posts?cursor=${pageParam}`).then(r => r.json()),
  getNextPageParam: (lastPage) => {
    if (!lastPage.nextCursor || lastPage.data.length === 0) return undefined
    return lastPage.nextCursor
  },
  initialPageParam: 0,
})

// ✅ Arrow function — no event object passed
<button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetching}
>
  Load More
</button>

// ✅ Intersection Observer guard
useEffect(() => {
  if (inView && hasNextPage && !isFetching) fetchNextPage()
}, [inView, hasNextPage, isFetching, fetchNextPage])
```

`hasNextPage` is `true` for any return value except `undefined` and `null`.
Returning `0` is a valid cursor — it will keep fetching.

---

## Forms — useMutation, Not useState + fetch

```typescript
// ❌ Manual state — no double-submit protection
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
  setLoading(true)
  await fetch("/api/projects", { method: "POST", body: JSON.stringify(data) })
}

// ✅ useMutation with auto-invalidation
const mutation = useMutation({
  mutationFn: (data) => fetch("/api/projects", { method: "POST", body: JSON.stringify(data) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
})
<button disabled={mutation.isPending}>Submit</button>
```

**Rule:** `mutation.isPending` prevents double-submit. Never use `useState` for server state.
