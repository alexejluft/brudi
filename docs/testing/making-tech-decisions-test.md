# Pressure Test: making-tech-decisions

Evidenz-Basis: TanStack Query Docs "Does this replace client state?", Kent C. Dodds AHA Programming,
Dan Abramov "Goodbye, Clean Code", Next.js App Router Docs (Rendering Strategies),
Webpack Tree Shaking Docs, Bundle Analyzer research.

---

## Scenario 1: Falsches State Management

**Prompt:**
"Hole User-Daten von der API und zeige sie in der Komponente an."

**Expected WITHOUT skill:**
```typescript
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => { setUser(data); setLoading(false) })
    .catch(err => { setError(err); setLoading(false) })
}, [userId])
```
- Kein Caching — jedes Mount = neuer Fetch
- Race Conditions bei schnellem userId-Wechsel
- Manuelles Loading/Error-Management
- Stale Data wenn User zurücknavigiert

**Expected WITH skill:**
```typescript
import { useQuery } from "@tanstack/react-query"

const { data: user, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000,
})
```
- TanStack Query: automatisches Caching, Deduplication, Background Refetch
- Entscheidungsregel: Server/API-Daten → TanStack Query, UI-State → useState, Shared UI → Zustand

---

## Scenario 2: Premature Abstraction

**Prompt:**
"Baue Resize-Handler für Rectangle und Oval — sie teilen sich ähnliche Logik."

**Expected WITHOUT skill:**
```typescript
// AI abstrahiert sofort bei erster Ähnlichkeit
function createResizeHandler(shape: Shape, direction: Direction) {
  return (position, size, preserveAspect, dx, dy) => {
    // Generische Logik die für alle Shapes "funktioniert"
    // Aber Sonderfälle für Oval vs Rectangle via if/switch
    if (shape.type === "oval") { /* ... */ }
    else if (shape.type === "rectangle") { /* ... */ }
  }
}
// → Abstraction erhöht Komplexität statt sie zu reduzieren
```
- Dan Abramov: "My code traded ability to change requirements for reduced duplication"
- Wenn Anforderungen sich ändern: Abstraktion wird 3x komplizierter als Duplikation

**Expected WITH skill:**
```typescript
// ✅ Duplizieren bis das Muster klar ist (Rule of Three)
const Rectangle = {
  resizeTopLeft(position, size, preserveAspect, dx, dy) {
    // 10 Zeilen spezifisch für Rectangle top-left
  },
  resizeTopRight(position, size, preserveAspect, dx, dy) {
    // 10 Zeilen spezifisch für Rectangle top-right
  },
}

const Oval = {
  resizeLeft(position, size, preserveAspect, dx, dy) {
    // 10 Zeilen spezifisch für Oval left
  },
}
// Erst beim 3. identischen Pattern abstrahieren — nicht vorher
```
- Kent C. Dodds: "Prefer duplication over the wrong abstraction"
- AHA = Avoid Hasty Abstractions

---

## Scenario 3: Falsches Rendering

**Prompt:**
"Baue eine Blog-Post-Seite mit Next.js."

**Expected WITHOUT skill:**
```typescript
// AI macht alles Client-Side
"use client"
export default function BlogPost({ slug }) {
  const [post, setPost] = useState(null)
  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(r => r.json()).then(setPost)
  }, [slug])
  if (!post) return <div>Loading...</div>
  return <article>{post.content}</article>
}
// → Kein SEO, langsames Initial Render, unnötiger Loading State
```
- Blog-Content ändert sich selten → CSR ist die falsche Wahl
- Google crawlt Client-rendered Content schlechter

**Expected WITH skill:**
```typescript
// ✅ Entscheidungsbaum anwenden:
// Content ändert sich selten (docs, blog, marketing) → SSG
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)  // Build-Zeit
  return <article>{post.content}</article>
}
// Kein Loading State nötig — fertig beim Build

// Content ändert sich periodisch (Produkte, Kurse) → ISR
export const revalidate = 3600  // stündlich neu bauen

// Personalisierter Content (Dashboard, Profil) → SSR (Default Server Component)
// Interaktiv, nicht SEO-kritisch → CSR ('use client')
```

---

## Scenario 4: Bundle Size — volle Library importieren

**Prompt:**
"Formatiere ein Datum mit Moment.js und debounce mit Lodash."

**Expected WITHOUT skill:**
```typescript
import moment from 'moment'               // ~300 KB
import { debounce } from 'lodash'         // ~180 KB (kein Tree-Shaking bei lodash CommonJS!)

const formatted = moment().format('YYYY-MM-DD')
const debouncedFn = debounce(handleInput, 300)
// Bundle: ~480 KB für 2 Funktionen
```
- `lodash` (non-es) nutzt CommonJS → Bundler kann nicht tree-shaken
- `moment` ist gar nicht tree-shakable — immer 300 KB

**Expected WITH skill:**
```typescript
// ✅ Tree-shakable Alternativen
import { format } from 'date-fns'           // ~5 KB
import { debounce } from 'lodash-es'        // ~46 Bytes (!)

const formatted = format(new Date(), 'yyyy-MM-dd')
const debouncedFn = debounce(handleInput, 300)
// Bundle: ~5 KB statt ~480 KB

// ✅ Oder direkter Path-Import (für lodash CommonJS)
import debounce from 'lodash/debounce'      // ~2-5 KB
```
- `date-fns` statt `moment`: vollständig tree-shakable
- `lodash-es` statt `lodash`: ES Modules, einzelne Imports = Bytes statt KB
- Nie `import _ from 'lodash'` oder `import * as X` — besiegt Tree-Shaking

---

## Test Results

**Scenario 1:** ❌ `useState + useEffect` für Server-Daten — kein Cache, Race Conditions, Boilerplate
**Scenario 2:** ❌ Sofortige Abstraktion — Änderungen werden 3x schwieriger statt leichter
**Scenario 3:** ❌ CSR für Blog-Posts — kein SEO, langsam, unnötiger Loading State
**Scenario 4:** ❌ `moment` + `lodash` CommonJS — ~480 KB für 2 Funktionen
