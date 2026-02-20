---
name: maintaining-quality
description: Use when writing TypeScript, handling errors, accessing environment variables, or managing imports. AI produces any-typed code, swallows errors silently, accesses process.env directly (string | undefined), and imports unused dependencies.
---

# Maintaining Quality

## The Rule

Four failure modes appear in every TypeScript project. Each is silent at
authoring time and breaks at runtime or in CI. Fix them at the source.

---

## JSON.parse Always Returns any — Use Zod

```typescript
// ❌ any infects everything downstream
const data = JSON.parse(response)        // any
const name = data.user.name              // no-unsafe-member-access
name.toUpperCase()                       // no-unsafe-call
// @typescript-eslint/recommended-type-checked breaks the build
```

```typescript
// ✅ Validate at the boundary — correct type guaranteed
import { z } from "zod"

const UserSchema = z.object({
  user: z.object({ name: z.string() })
})

const parsed = UserSchema.parse(JSON.parse(response))
parsed.user.name.toUpperCase()  // string — safe
```

`JSON.parse`, `fetch` responses, `localStorage.getItem` — every external
boundary needs a schema. Zod throws at runtime on mismatch and returns the
correct TypeScript type.

---

## Error Handling — Typed tryCatch

```typescript
// ❌ Generic message, no context, no logging
try {
  await saveFormData(data)
} catch (error) {
  setError("Something went wrong")
}
```

```typescript
// ✅ Theo's tryCatch — typed { data, error } union
async function tryCatch<T>(
  promise: Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: Error }> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

const { data: result, error } = await tryCatch(saveFormData(data))

if (error) {
  if (error instanceof NetworkError) {
    setError("Verbindungsfehler. Bitte erneut versuchen.")
    logError({ type: "network", error, context: { formData: data } })
  } else if (error instanceof ValidationError) {
    setError(`Ungültige Daten: ${error.message}`)
  } else {
    setError("Unbekannter Fehler. Unser Team wurde informiert.")
    logError({ type: "unknown", error })
  }
  return
}

onSuccess(result)  // result is T here — guaranteed non-null
```

---

## Environment Variables — T3 Env

```typescript
// ❌ string | undefined — TypeError at runtime, not build time
const db = createClient(process.env.DATABASE_URL)
const api = new ApiClient(process.env.API_KEY)
```

```typescript
// ✅ src/env.ts — validated once at startup
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})

// env.DATABASE_URL → string, guaranteed
// env.DATABASE_URL in a client component → TypeScript error at build time
```

Missing variable = app won't start, clear message. Server secret in client
component = build-time error, not a production leak.

---

## Imports — Only What You Use

```typescript
// ❌ eslint-plugin-unused-imports breaks the build
import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import type { User, Post, Comment, Settings } from '@/types'

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

```typescript
// ✅ Import only what the component actually uses
import type { User } from '@/types'

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

`.eslintrc` config to enforce:
```json
{
  "plugins": ["unused-imports"],
  "rules": {
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

ESLint `--fix` removes unused imports automatically on save.
