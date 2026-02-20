---
name: handling-data-sync
description: Use when writing TanStack Query mutations, optimistic updates, cache invalidation, infinite scroll, or form submissions. AI mutates cache directly (breaks rollback), invalidates everything, returns 0 from getNextPageParam (infinite loop), and uses useState+fetch instead of useMutation.
---

# Handling Data Sync

## The Rule

Four TanStack Query mistakes are invisible at authoring time — they only fail
when an API errors, the list updates, the scroll reaches end, or the user
submits twice.

---

## Optimistic Updates — Never Mutate the Cache Object

```typescript
// ❌ Direct mutation — rollback fails on error (previousTodo is already changed)
const previousTodo = queryClient.getQueryData(["todos", id])
previousTodo.title = newTitle  // mutates in place!
queryClient.setQueryData(["todos", id], previousTodo)
return { previousTodo }  // this snapshot is already mutated
```

```typescript
// ✅ Snapshot before, set new object, deep clone for rollback
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] })

    const previousTodo = queryClient.getQueryData(["todos", newTodo.id])
    queryClient.setQueryData(["todos", newTodo.id], newTodo)  // new object

    return { previousTodo: structuredClone(previousTodo) }  // deep clone
  },
  onError: (_err, newTodo, context) => {
    queryClient.setQueryData(["todos", newTodo.id], context?.previousTodo)
  },
  onSettled: (newTodo) => {
    queryClient.invalidateQueries({ queryKey: ["todos"] })          // parent
    queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] })  // child
  },
})
```

`structuredClone` prevents the snapshot from sharing a reference with the
cache object. `cancelQueries` prevents race conditions with in-flight refetches.

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
// ❌ Manual state — no double-submit protection, easy to forget invalidation
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
  setLoading(true)
  await fetch("/api/projects", { method: "POST", body: JSON.stringify(data) })
  // no cache invalidation → list stays stale
}
```

```typescript
// ✅ react-hook-form + useMutation + Zod
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const Schema = z.object({ name: z.string().min(1) })
type FormData = z.infer<typeof Schema>

export function ProjectForm() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(Schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error("Failed"); return r.json() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      reset()
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
      {mutation.isError && <p>{mutation.error.message}</p>}
    </form>
  )
}
```

`mutation.isPending` blocks double-submit automatically. No `useState` for
loading, error, or response data — all of it lives in `mutation`.

TkDodo: "Rigorously separate the states: keep Server State in React Query,
and only track user changes with Client State."
