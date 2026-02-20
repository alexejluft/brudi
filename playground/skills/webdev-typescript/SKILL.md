---
name: webdev-typescript
description: Master TypeScript with utility types, generics, type guards, and advanced patterns. Covers Partial, Pick, Omit, discriminated unions, and React-specific types. Use when writing typed JavaScript, defining APIs, or improving type safety.
version: 0.1.0
---

# WebDev TypeScript — Type System Mastery

Write safer, more maintainable code with TypeScript. This skill covers utility types, generics, type guards, and patterns that make TypeScript powerful.

## Core Insight

> **Utility Types have zero runtime cost.**

TypeScript types exist only at compile-time. After the build, there's no TypeScript code left — just plain JavaScript. Type safety is free.

---

## Built-in Utility Types

### Partial<T>

Makes all properties optional. Perfect for update functions.

```typescript
interface User {
  id: string
  name: string
  email: string
}

// All fields optional
function updateUser(id: string, updates: Partial<User>) {
  // ...
}

updateUser('123', { name: 'Alex' })  // ✅ Only name required
```

### Required<T>

Makes all properties required. Opposite of Partial.

```typescript
interface Config {
  host?: string
  port?: number
}

// Now both are required
const config: Required<Config> = {
  host: 'localhost',
  port: 3000
}
```

### Readonly<T>

Makes all properties read-only. Immutability.

```typescript
const user: Readonly<User> = {
  id: '1',
  name: 'Alex',
  email: 'alex@example.com'
}

user.name = 'Bob'  // ❌ Error: Cannot assign to 'name'
```

### Pick<T, K>

Create a type with only selected properties.

```typescript
type UserPreview = Pick<User, 'id' | 'name'>
// { id: string; name: string }

// Useful for API responses
type UserListItem = Pick<User, 'id' | 'name' | 'avatar'>
```

### Omit<T, K>

Create a type without specified properties.

```typescript
type CreateUserInput = Omit<User, 'id'>
// { name: string; email: string }

// Useful for forms
type EditableUser = Omit<User, 'id' | 'createdAt'>
```

### Record<K, T>

Create an object type with specified keys and value type.

```typescript
// String keys, User values
type UsersById = Record<string, User>

// Enum keys, specific values
type Status = 'pending' | 'active' | 'error'
type StatusColors = Record<Status, string>

const colors: StatusColors = {
  pending: '#f59e0b',
  active: '#10b981',
  error: '#ef4444'
}
```

### Extract<T, U> & Exclude<T, U>

Filter union types.

```typescript
type Status = 'pending' | 'active' | 'error' | 'deleted'

// Only these
type ActiveStatus = Extract<Status, 'active' | 'pending'>
// 'active' | 'pending'

// All except these
type VisibleStatus = Exclude<Status, 'deleted'>
// 'pending' | 'active' | 'error'
```

### NonNullable<T>

Remove null and undefined.

```typescript
type MaybeUser = User | null | undefined
type DefiniteUser = NonNullable<MaybeUser>
// User
```

### ReturnType<T> & Parameters<T>

Extract types from functions.

```typescript
function createUser(name: string, age: number): User {
  // ...
}

type CreateUserReturn = ReturnType<typeof createUser>
// User

type CreateUserParams = Parameters<typeof createUser>
// [string, number]
```

---

## Generics

### Basic Generic Function

```typescript
function identity<T>(value: T): T {
  return value
}

const num = identity(42)      // Type: number
const str = identity('hello') // Type: string
```

### Generic Constraints

```typescript
// T must have a length property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length)
}

logLength('hello')     // ✅
logLength([1, 2, 3])   // ✅
logLength(42)          // ❌ Error: number has no length
```

### Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type UsersResponse = ApiResponse<User[]>
type UserResponse = ApiResponse<User>

async function fetchUsers(): Promise<UsersResponse> {
  // ...
}
```

### Multiple Generics

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const result = pair('hello', 42)  // [string, number]
```

### Generic Defaults

```typescript
interface PaginatedResponse<T, M = { total: number }> {
  data: T[]
  meta: M
}

// Uses default meta type
type UserList = PaginatedResponse<User>

// Custom meta type
type SearchResults = PaginatedResponse<User, { total: number; query: string }>
```

---

## Discriminated Unions

The most powerful pattern for type-safe state management.

### Basic Pattern

```typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function render(state: RequestState<User[]>) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return <Spinner />
    case 'success':
      return <UserList data={state.data} />  // ✅ data exists here
    case 'error':
      return <Error message={state.error} />  // ✅ error exists here
  }
}
```

### Exhaustive Checking

```typescript
// Ensure all cases are handled
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

function render(state: RequestState<User[]>) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return <Spinner />
    case 'success':
      return <UserList data={state.data} />
    case 'error':
      return <Error message={state.error} />
    default:
      return assertNever(state)  // ❌ Error if case missed
  }
}
```

### Action Types (Redux-style)

```typescript
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; value: number }
  | { type: 'RESET' }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'SET':
      return action.value  // ✅ value exists
    case 'RESET':
      return 0
  }
}
```

---

## Type Guards

### typeof Guards

```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // ✅ TypeScript knows it's string
  }
  return value * 2  // ✅ TypeScript knows it's number
}
```

### instanceof Guards

```typescript
class Dog {
  bark() { console.log('Woof!') }
}

class Cat {
  meow() { console.log('Meow!') }
}

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // ✅
  } else {
    animal.meow()  // ✅
  }
}
```

### in Guards

```typescript
interface Bird {
  fly(): void
}

interface Fish {
  swim(): void
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly()  // ✅ TypeScript knows it's Bird
  } else {
    animal.swim()  // ✅ TypeScript knows it's Fish
  }
}
```

### Custom Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  )
}

// Usage
const data: unknown = await fetchData()

if (isUser(data)) {
  console.log(data.name)  // ✅ TypeScript knows it's User
}
```

### Array Type Guards

```typescript
function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every(item => typeof item === 'string')
}
```

---

## React-Specific Types

### Component Props

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function Button({ variant, size = 'md', children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>
}
```

### Extending HTML Elements

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary'
}

function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      {...props}
    />
  )
}
```

### Children Types

```typescript
// Any renderable content
children: React.ReactNode

// Only elements (no strings)
children: React.ReactElement

// Single element
children: React.ReactElement

// Function as child
children: (data: Data) => React.ReactNode
```

### Event Types

```typescript
// Click event
onClick: (event: React.MouseEvent<HTMLButtonElement>) => void

// Change event (input)
onChange: (event: React.ChangeEvent<HTMLInputElement>) => void

// Form submit
onSubmit: (event: React.FormEvent<HTMLFormElement>) => void

// Keyboard event
onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
```

### Ref Types

```typescript
const inputRef = useRef<HTMLInputElement>(null)
const divRef = useRef<HTMLDivElement>(null)

// Forward ref
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />
})
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}

// Usage
<List
  items={users}
  renderItem={(user) => <li key={user.id}>{user.name}</li>}
/>
```

---

## Advanced Patterns

### Template Literal Types

```typescript
type EventName = 'click' | 'focus' | 'blur'
type Handler = `on${Capitalize<EventName>}`
// 'onClick' | 'onFocus' | 'onBlur'

type Route = '/users' | '/posts' | '/comments'
type ApiEndpoint = `https://api.example.com${Route}`
// 'https://api.example.com/users' | ...
```

### Mapped Types

```typescript
// Make all properties optional
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// Make all properties readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Change all values to boolean
type Flags<T> = {
  [K in keyof T]: boolean
}

type UserFlags = Flags<User>
// { id: boolean; name: boolean; email: boolean }
```

### Conditional Types

```typescript
// If T extends U, return X, else Y
type IsString<T> = T extends string ? 'yes' : 'no'

type A = IsString<string>  // 'yes'
type B = IsString<number>  // 'no'

// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never

type UserArrayElement = ArrayElement<User[]>  // User
```

### infer Keyword

```typescript
// Get promise resolved type
type Awaited<T> = T extends Promise<infer R> ? R : T

type A = Awaited<Promise<string>>  // string
type B = Awaited<string>            // string

// Get function return type (like built-in ReturnType)
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

---

## Common Patterns

### Result Type (Error Handling)

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: 'Division by zero' }
  }
  return { success: true, data: a / b }
}

const result = divide(10, 2)
if (result.success) {
  console.log(result.data)  // ✅ data exists
} else {
  console.log(result.error)  // ✅ error exists
}
```

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private filters: Record<string, unknown> = {}

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.filters[key as string] = value
    return this
  }

  build(): Record<string, unknown> {
    return this.filters
  }
}

const query = new QueryBuilder<User>()
  .where('name', 'Alex')      // ✅ Type-safe
  .where('email', 'a@b.com')  // ✅
  .where('foo', 'bar')        // ❌ Error: 'foo' not in User
  .build()
```

### Strict Object Keys

```typescript
// Ensure object has exact keys
function createConfig<T extends Record<string, unknown>>(config: {
  [K in keyof T]: T[K]
}): T {
  return config as T
}
```

---

## Anti-Patterns

### ❌ Using `any`

```typescript
// BAD
function process(data: any) {
  return data.foo.bar  // No type safety!
}

// GOOD — use unknown and narrow
function process(data: unknown) {
  if (isUser(data)) {
    return data.name
  }
  throw new Error('Invalid data')
}
```

### ❌ Type Assertions Without Checks

```typescript
// BAD
const user = data as User  // Might fail at runtime!

// GOOD — validate first
if (isUser(data)) {
  const user = data  // Type is already User
}
```

### ❌ Overusing Non-null Assertion

```typescript
// BAD
const name = user!.name  // Might be null!

// GOOD — check first
if (user) {
  const name = user.name
}

// Or use optional chaining
const name = user?.name
```

### ❌ Complex Inline Types

```typescript
// BAD — hard to read
function process(data: { users: { id: string; name: string; email: string }[]; meta: { total: number } }) {}

// GOOD — extract types
interface User {
  id: string
  name: string
  email: string
}

interface PaginatedUsers {
  users: User[]
  meta: { total: number }
}

function process(data: PaginatedUsers) {}
```

---

## Quick Reference

### Utility Types

| Type | Purpose |
|------|---------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties read-only |
| `Pick<T, K>` | Only selected properties |
| `Omit<T, K>` | All except selected properties |
| `Record<K, T>` | Object with key type K and value type T |
| `Extract<T, U>` | Types in T that are in U |
| `Exclude<T, U>` | Types in T that are not in U |
| `NonNullable<T>` | Remove null and undefined |
| `ReturnType<T>` | Return type of function T |
| `Parameters<T>` | Parameter types of function T |

### Type Narrowing

| Method | Syntax |
|--------|--------|
| typeof | `if (typeof x === 'string')` |
| instanceof | `if (x instanceof Date)` |
| in | `if ('prop' in obj)` |
| Custom guard | `if (isUser(x))` |
| Truthiness | `if (x)` |
| Equality | `if (x === null)` |

---

**Remember:** TypeScript's job is to catch bugs at compile-time. The stricter your types, the fewer runtime errors you'll encounter.
