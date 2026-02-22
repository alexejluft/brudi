---
name: making-tech-decisions
description: Use when choosing state management, rendering strategy, libraries, or abstractions. AI defaults to useState for API data, CSR for everything, premature abstraction, and full library imports — all documented failure modes.
---

# Making Tech Decisions

## The Rule

Each wrong choice is silent at authoring time. Wrong state tool → stale data
and race conditions. Wrong rendering → no SEO. Wrong abstraction → brittle
code. Wrong import → 300KB for one function.

---

## State Management — Server vs Client

```typescript
// ❌ useState + useEffect for server data — no cache, race conditions
const [user, setUser] = useState(null)
useEffect(() => {
  fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser)
}, [userId])
```

```typescript
// ✅ TanStack Query for server data
import { useQuery } from "@tanstack/react-query"

const { data: user, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000,
})
```

**Decision:**
```
API/server data                → TanStack Query (caching, deduplication, refetch)
Shared UI state (theme, modal) → Zustand
Local component state          → useState
URL state (filters, page)      → searchParams / nuqs
```

TanStack Query docs: "For a vast majority of applications, the truly globally
accessible client state left over after migrating async code to TanStack Query
is usually very tiny."

---

## Abstraction — Wait for the Pattern

```typescript
// ❌ Abstract at first duplication (AHA violation)
function createResizeHandler(shape: Shape, direction: Direction) {
  if (shape.type === "oval") { /* ... */ }
  else if (shape.type === "rectangle") { /* ... */ }
  // When requirements change, this becomes 3x harder to modify
}
```

```typescript
// ✅ Duplicate until the pattern is clear — Rule of Three
const Rectangle = {
  resizeTopLeft(position, size, preserveAspect, dx, dy) {
    // 10 lines specific to rectangle top-left
  },
}

const Oval = {
  resizeLeft(position, size, preserveAspect, dx, dy) {
    // 10 lines specific to oval left
  },
}
// Abstract on the 3rd identical pattern — not before
```

Dan Abramov: "My code traded the ability to change requirements for reduced
duplication — and it was not a good trade."

Kent C. Dodds: AHA = Avoid Hasty Abstractions. "Prefer duplication over the
wrong abstraction."

---

## Rendering Strategy

```typescript
// Blog/docs → SSG: export async function generateStaticParams()
// Products → ISR: export const revalidate = 3600
// Dashboard → SSR: export default async function Dashboard()
// Interactive → CSR: "use client"
```

---

## Bundle Size — Tree-Shakable Imports

```typescript
// ❌ Full library imports — 480 KB for two functions
import moment from 'moment'           // 300 KB — not tree-shakable at all
import { debounce } from 'lodash'     // 180 KB — CommonJS, can't tree-shake
```

```typescript
// ✅ Tree-shakable alternatives — ~5 KB total
import { format } from 'date-fns'     // ~5 KB — fully tree-shakable
import { debounce } from 'lodash-es'  // ~46 bytes — ES modules

// Or: direct path import for CommonJS lodash
import debounce from 'lodash/debounce'  // ~2-5 KB
```

**Rules:**
- `moment` → `date-fns` (always — moment is not tree-shakable)
- `lodash` → `lodash-es` named imports, or `lodash/method` path imports
- Never `import _ from 'lodash'` or `import * as X` — defeats tree-shaking
- ES modules (`import`/`export`) are required for tree-shaking to work
