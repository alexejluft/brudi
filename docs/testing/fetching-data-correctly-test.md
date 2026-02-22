# Pressure Test: fetching-data-correctly

Evidenz-Basis: React official docs, GitHub Issue #15006 (500+ comments),
TanStack Query Discussion #735, Next.js Discussion #54075.

---

## Scenario 1: Race Condition in Suchfeld

**Prompt:**
"Baue eine Suchkomponente die bei jeder Eingabe Ergebnisse von einer API lädt."

**Expected WITHOUT skill:**
```tsx
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(setResults)
}, [query])
// Kein Cleanup — ältere Antworten überschreiben neuere
```
- User tippt "hello" schnell → 5 Requests feuern
- Antwort für "hell" kommt nach "hello" an → falsche Ergebnisse
- React: "Can't perform a state update on an unmounted component"

**Expected WITH skill:**
- AbortController cleanup in useEffect return
- Oder: TanStack Query mit debounce — kein useEffect
- Versteht: Race Condition = nicht wenn, sondern wann

---

## Scenario 2: TanStack Query — ständige Refetches

**Prompt:**
"Die App macht ständig API-Calls obwohl sich die Daten nicht geändert haben. Finde das Problem."

**Expected WITHOUT skill:**
- Schaut in useEffect nach
- Vermutet einen Loop
- Findet nichts offensichtliches
- Schlägt vor: `refetchOnWindowFocus: false` (behandelt Symptom, nicht Ursache)

**Expected WITH skill:**
- Erkennt: `staleTime: 0` (Default) macht alle Daten sofort stale
- Fix: `staleTime: 5 * 60 * 1000` für die meisten Queries
- Erklärt stale-while-revalidate: Cache wird trotzdem genutzt, aber Hintergrund-Refetch passiert
- Weiß: `refetchOnWindowFocus` ist Feature, nicht Bug

---

## Scenario 3: Optimistic Update ohne Rollback

**Prompt:**
"Implementiere einen Like-Button der sofort reagiert, auch bevor der Server antwortet."

**Expected WITHOUT skill:**
```tsx
const handleLike = async () => {
  setLiked(true) // optimistisch
  await fetch('/api/like', { method: 'POST' })
  // Kein Rollback wenn fetch fehlschlägt
}
```
- UI zeigt "geliked" auch wenn Server 500 zurückgibt
- Bei schnellen Klicks: Race Condition, falscher State

**Expected WITH skill:**
- `onMutate`: vorherigen State snapshotten + `cancelQueries`
- `onError`: Rollback auf Snapshot
- `onSettled`: immer `invalidateQueries` — Server-Truth ist final
- Weiß: Optimistic Updates nie für irreversible Aktionen (Bezahlung, Löschen)

---

## Scenario 4: useEffect für Datenabruf in Next.js

**Prompt:**
"Hole Produktdaten aus der API und zeige sie auf der Produktseite."

**Expected WITHOUT skill:**
```tsx
'use client'
export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(setProduct)
  }, [params.id])
  return product ? <div>{product.name}</div> : <div>Loading...</div>
}
```
- Unnötiger Client Component
- Kein SEO
- Waterfall: HTML → JS → Fetch → Render
- Kein Loading/Error State

**Expected WITH skill:**
```tsx
// Server Component — kein useEffect, kein 'use client'
export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await fetch(`/api/products/${id}`, {
    cache: 'no-store'
  }).then(r => r.json())
  return <div>{product.name}</div>
}
```
- Weiß: useEffect für Datenabruf = letztes Mittel, nicht erster Griff

---

## Test Results

**Scenario 1 (Race Condition):**
- ❌ Kein cleanup → Race Condition garantiert bei schneller Eingabe
- ❌ Memory leak auf unmounted component
- ❌ Kein Hinweis auf TanStack Query als richtige Lösung

**Scenario 2 (staleTime):**
- ❌ Behandelt Symptom statt Ursache
- ❌ Versteht stale-while-revalidate nicht
- ⚠️ Kann zufällig auf `staleTime` kommen

**Scenario 3 (Optimistic Update):**
- ❌ Kein Rollback-Pattern
- ❌ Kein `cancelQueries` vor optimistischem Update
- ❌ Kein `onSettled` für Server-Sync

**Scenario 4 (useEffect in Next.js):**
- ❌ Greift standardmäßig zu useEffect + useState
- ❌ Macht unnötig Client Component
- ❌ Kein SEO, schlechte Performance
