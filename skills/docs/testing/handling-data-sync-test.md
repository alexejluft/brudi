# Pressure Test: handling-data-sync

Evidenz-Basis: TanStack Query v5 Docs (Optimistic Updates, Query Invalidation, Infinite Queries, Mutations),
TkDodo "React Query and Forms" (offizieller Maintainer), GitHub Discussions #1325 (Cache Mutation Bug),
#2468 (refetch vs invalidateQueries), #8328 (Optimistic Update Docs), Issue #407 (Cursor Invalidation).

---

## Scenario 1: Optimistic Updates — Cache direkt mutieren

**Prompt:**
"Aktualisiere ein Todo optimistisch — zeige die Änderung sofort, bevor die API antwortet."

**Expected WITHOUT skill:**
```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    const previousTodo = queryClient.getQueryData(["todos", newTodo.id])

    previousTodo.title = newTodo.title  // ❌ direkte Mutation des Cache-Objekts
    queryClient.setQueryData(["todos", newTodo.id], previousTodo)

    return { previousTodo }  // previousTodo ist bereits mutiert!
  },
  onError: (err, newTodo, context) => {
    // ❌ Rollback schlägt fehl — previousTodo ist schon verändert
    queryClient.setQueryData(["todos", newTodo.id], context.previousTodo)
  },
  onSettled: (newTodo) => {
    queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] })  // ❌ Parent fehlt
  },
})
```
- GitHub Discussion #1325: "The bug: it works until the API throws — then rollback fails"
- Direct Mutation: `previousTodo` referenziert dasselbe Objekt → Snapshot ist schon verändert

**Expected WITH skill:**
```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] })

    // Snapshot VOR der Änderung — neues Objekt, nicht Referenz
    const previousTodo = queryClient.getQueryData(["todos", newTodo.id])

    queryClient.setQueryData(["todos", newTodo.id], newTodo)  // neues Objekt setzen

    return { previousTodo: structuredClone(previousTodo) }  // Deep Clone für Rollback
  },
  onError: (_err, newTodo, context) => {
    queryClient.setQueryData(["todos", newTodo.id], context?.previousTodo)
  },
  onSettled: (newTodo) => {
    // Parent UND Child invalidieren
    queryClient.invalidateQueries({ queryKey: ["todos"] })
    queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] })
  },
})
```

---

## Scenario 2: Cache Invalidation — zu breit oder falsch

**Prompt:**
"Nach dem Erstellen eines Todos soll die Liste aktualisiert werden."

**Expected WITHOUT skill:**
```typescript
const { data: todos, refetch } = useQuery({ queryKey: ["todos"], queryFn: getTodos })

const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    queryClient.invalidateQueries()  // ❌ alle Queries — cascading refetch
    refetch()                         // ❌ refetch() skaliert nicht über Komponenten
  },
})
```
- `invalidateQueries()` ohne Key: ALLE Queries der App werden refetched
- `refetch()` funktioniert nur in der Komponente die den Query-Hook hält

**Expected WITH skill:**
```typescript
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    // Gezielter Prefix-Match — erfasst ["todos"] und ["todos", id]
    queryClient.invalidateQueries({ queryKey: ["todos"] })
    // Nicht exact: true — sonst werden ["todos", id] nicht erfasst
  },
})

// Wann refetch() statt invalidateQueries():
// - User klickt "Refresh"-Button (manuell, sofort)
// - Query ist disabled und soll einmalig getriggert werden
// Für alle anderen Fälle: invalidateQueries()
```

---

## Scenario 3: Infinite Scroll — getNextPageParam gibt 0 zurück

**Prompt:**
"Baue einen Feed mit Infinite Scroll — mehr Posts laden wenn User nach unten scrollt."

**Expected WITHOUT skill:**
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam = 0 }) =>
    fetch(`/api/posts?cursor=${pageParam}`).then(r => r.json()),
  getNextPageParam: (lastPage) => {
    return lastPage.nextCursor  // ❌ wenn nextCursor = 0, bleibt hasNextPage true!
  },
  initialPageParam: 0,
})

// onClick={fetchNextPage}  ❌ übergibt Event-Objekt als pageParam
```
- `hasNextPage` ist `true` wenn getNextPageParam IRGENDETWAS außer `null`/`undefined` zurückgibt
- `0` (Zahl) ist ein valider Cursor-Wert → Infinite Loop
- GitHub Discussion #6874: "hasNextPage returns false even when returning value"

**Expected WITH skill:**
```typescript
const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam }) =>
    fetch(`/api/posts?cursor=${pageParam}`).then(r => r.json()),
  getNextPageParam: (lastPage) => {
    // undefined oder null = keine weiteren Seiten
    if (!lastPage.nextCursor || lastPage.data.length === 0) return undefined
    return lastPage.nextCursor
  },
  initialPageParam: 0,
})

// onClick als Arrow Function — kein Event-Objekt als pageParam
<button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetching}
>
  Mehr laden
</button>

// Intersection Observer Guard
useEffect(() => {
  if (inView && hasNextPage && !isFetching) fetchNextPage()
}, [inView, hasNextPage, isFetching, fetchNextPage])
```

---

## Scenario 4: Formular-Submission — useState + fetch statt useMutation

**Prompt:**
"Baue ein Formular das ein neues Projekt erstellt und danach die Liste aktualisiert."

**Expected WITHOUT skill:**
```typescript
const [name, setName] = useState("")
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    await fetch("/api/projects", { method: "POST", body: JSON.stringify({ name }) })
    // ❌ Kein Cache-Invalidierung → Liste veraltet
    // ❌ Kein Double-Submit-Schutz während fetch läuft
    setLoading(false)
  } catch (err) {
    setError(err.message)  // ❌ Stale Closure — könnte nach Unmount feuern
    setLoading(false)
  }
}
```

**Expected WITH skill:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const ProjectSchema = z.object({ name: z.string().min(1) })
type ProjectForm = z.infer<typeof ProjectSchema>

export function CreateProjectForm() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(ProjectSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: ProjectForm) =>
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => { if (!r.ok) throw new Error("Failed"); return r.json() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })  // Cache aktualisiert
      reset()                                                      // Formular leeren
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Erstelle..." : "Projekt erstellen"}
      </button>
      {mutation.isError && <p>Fehler: {mutation.error.message}</p>}
    </form>
  )
}
```
- `mutation.isPending` verhindert automatisch Double-Submit
- `onSuccess` invalidiert Cache zuverlässig — nie vergessen
- Kein `useState` für loading/error/data — alles in `mutation`

---

## Test Results

**Scenario 1:** ❌ Direkte Cache-Mutation → Rollback bricht bei API-Error
**Scenario 2:** ❌ `invalidateQueries()` ohne Key → alle Queries der App refetchen
**Scenario 3:** ❌ `getNextPageParam` gibt `0` zurück → `hasNextPage` bleibt `true`, Infinite Loop
**Scenario 4:** ❌ `useState + fetch` → kein Double-Submit-Schutz, fehlende Cache-Invalidierung
