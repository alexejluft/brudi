# Pressure Test: typing-with-typescript

---

## Scenario 1: any überall

**Prompt:**
"Parse eine API-Antwort und zeige die Daten an."

**Expected WITHOUT skill:**
```typescript
async function fetchUser(id: string): Promise<any> {
  const res = await fetch(`/api/users/${id}`)
  return res.json() // any
}
const user: any = await fetchUser('1')
console.log(user.name) // Typo — kein Fehler, null in Produktion
```
- `any` schaltet TypeScript komplett aus
- Typos und fehlende Felder werden nicht erkannt

**Expected WITH skill:**
```typescript
interface User { id: string; name: string; email: string }

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  return res.json() as Promise<User>
}
```
- Kein `any` — expliziter Return-Type
- `user.name` wirft Fehler beim Build, nicht in Produktion

---

## Scenario 2: Status-State ohne Discriminated Union

**Prompt:**
"Modelliere einen Fetch-Status mit loading, success und error."

**Expected WITHOUT skill:**
```typescript
interface State {
  isLoading: boolean
  data: User | null
  error: string | null
}
// Führt zu ungültigen Kombinationen:
// { isLoading: true, data: User, error: "Fehler" } — unmöglich, aber erlaubt
```

**Expected WITH skill:**
```typescript
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }

// Switch exhaustiv — TypeScript warnt wenn ein case fehlt
switch (state.status) {
  case 'success': return state.data.name // ✅ data garantiert vorhanden
  case 'error':   return state.error     // ✅ error garantiert vorhanden
}
```

---

## Scenario 3: Prop-Types ohne HTML-Attribute

**Prompt:**
"Erstelle eine wiederverwendbare Button-Komponente die alle nativen Button-Attribute akzeptiert."

**Expected WITHOUT skill:**
```typescript
interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  // Fehlen: type, aria-*, form, name, value, ...
}
```
- Unvollständig — `type="submit"` funktioniert nicht
- Muss manuell erweitert werden

**Expected WITH skill:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary'
  isLoading?: boolean
}
// Erbt automatisch: onClick, disabled, type, aria-*, form, ...
```

---

## Scenario 4: Type Assertion ohne Guard

**Prompt:**
"Die API gibt unknown zurück. Arbeite damit."

**Expected WITHOUT skill:**
```typescript
const data = await fetchData() as User // Type Assertion ohne Check
console.log(data.name) // Runtime-Fehler wenn data kein User ist
```

**Expected WITH skill:**
```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj
}

const data = await fetchData()
if (isUser(data)) {
  console.log(data.name) // ✅ TypeScript UND Runtime sicher
}
```

---

## Test Results

**Scenario 1:** ❌ `any` als Default-Lösung für unbekannte Daten
**Scenario 2:** ❌ Boolean-Flags statt Discriminated Union — unmögliche States erlaubt
**Scenario 3:** ❌ Props manuell definiert statt HTML-Attribute extended
**Scenario 4:** ❌ Type Assertion ohne Runtime-Check
