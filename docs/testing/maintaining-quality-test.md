# Pressure Test: maintaining-quality

Evidenz-Basis: TypeScript ESLint "Avoiding anys", Theo's tryCatch Pattern (t3dotgg),
T3 Env Docs, eslint-plugin-unused-imports, Kent C. Dodds error handling.

---

## Scenario 1: TypeScript strict mode ignoriert

**Prompt:**
"Hole User-Daten von einer API und zeige den Namen an."

**Expected WITHOUT skill:**
```typescript
const data = JSON.parse(response)        // Type: any
const name = data.user.name              // no-unsafe-member-access
return name.toUpperCase()                // no-unsafe-call
```
- TypeScript ESLint wirft sofort: `no-unsafe-assignment`, `no-unsafe-member-access`
- `JSON.parse` gibt `any` zurück — infiziert alle folgenden Variablen
- In einem Projekt mit `@typescript-eslint/recommended-type-checked` bricht der Build

**Expected WITH skill:**
```typescript
import { z } from "zod"

const UserSchema = z.object({
  user: z.object({ name: z.string() })
})

const parsed = UserSchema.parse(JSON.parse(response))
return parsed.user.name.toUpperCase()    // Type: string — sicher
```
- Zod validiert zur Runtime und gibt korrekten TypeScript-Typ zurück
- Kein `any` — strict mode compliant

---

## Scenario 2: Fehler ohne Kontext verschluckt

**Prompt:**
"Speichere die Formulardaten und zeige eine Fehlermeldung wenn es schiefgeht."

**Expected WITHOUT skill:**
```typescript
try {
  await saveFormData(data)
} catch (error) {
  console.error(error)
  setError("Something went wrong")
}
// Oder noch schlimmer: leeres catch
```
- User bekommt keine nützliche Fehlermeldung
- Entwickler sieht nur `console.error` — kein strukturiertes Logging
- Kein Unterschied zwischen NetworkError und ValidationError

**Expected WITH skill:**
```typescript
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

// result ist guaranteed non-null hier
onSuccess(result)
```
- Error-Typ bestimmt die User-Message
- Strukturiertes Logging mit Kontext
- `tryCatch` utility gibt typisiertes `{ data, error }` zurück

---

## Scenario 3: Environment Variables direkt genutzt

**Prompt:**
"Verbinde die App mit der Datenbank und der externen API."

**Expected WITHOUT skill:**
```typescript
const db = createClient(process.env.DATABASE_URL)   // string | undefined
const api = new ApiClient(process.env.API_KEY)       // string | undefined

// Zur Runtime: TypeError: Cannot read properties of undefined
// Kein Fehler zur Build-Zeit
```
- `process.env.X` ist immer `string | undefined` — TypeScript weiß nicht ob sie existiert
- Fehler tritt erst zur Runtime auf, nicht beim Build
- Client-Komponenten können versehentlich Server-Secrets exposen

**Expected WITH skill:**
```typescript
// src/env.ts — einmal definieren, überall type-safe nutzen
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

// Verwendung — type-safe, validated, kein undefined möglich
const db = createClient(env.DATABASE_URL)    // string — garantiert
const api = new ApiClient(env.API_KEY)       // string — garantiert
```
- Fehlt eine Variable: App startet nicht, klare Fehlermeldung
- `env.DATABASE_URL` in Client-Komponente: TypeScript-Fehler zur Build-Zeit

---

## Scenario 4: Ungenutzte Imports und dead code

**Prompt:**
"Baue eine UserProfile-Komponente die nur Name und Avatar zeigt."

**Expected WITHOUT skill:**
```typescript
import { useState, useEffect, useCallback, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { debounce } from 'lodash'
import type { User, Post, Comment, Settings } from '@/types'

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
// 7 ungenutzte Imports — ESLint wirft Fehler in jedem konfigurierten Projekt
```

**Expected WITH skill:**
```typescript
import type { User } from '@/types'

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```
- Nur was wirklich gebraucht wird
- `eslint-plugin-unused-imports` mit `"error"` macht das zur Build-Blocke
- ESLint auto-fix entfernt ungenutzte Imports automatisch

---

## Test Results

**Scenario 1:** ❌ `JSON.parse` → any → infiziert gesamte Datenpipeline, bricht strict mode
**Scenario 2:** ❌ Leeres catch oder generisches "Something went wrong" — kein Logging, kein Kontext
**Scenario 3:** ❌ `process.env.X` direkt — undefined zur Runtime, kein Build-Zeit-Fehler
**Scenario 4:** ❌ 7 ungenutzte Imports — bricht ESLint, erhöht Bundle-Size, verwirrt Entwickler
