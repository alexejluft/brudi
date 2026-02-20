---
name: typing-with-typescript
description: Use when writing type-safe code, handling union types, or creating reusable type utilities. Especially for discriminated unions and type guards.
---

# Typing with TypeScript

## Zero Runtime Cost

TypeScript types exist ONLY at compile-time. After build = plain JavaScript.

## Discriminated Unions (Most Powerful)

**Problem:** State can be loading, success, or error. Each has different data.

```typescript
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }

function render(state: State) {
  switch (state.status) {
    case 'success':
      return state.data.name;  // ✅ TypeScript knows data exists
    case 'error':
      return state.error;       // ✅ TypeScript knows error exists
  }
}
```

## Essential Utility Types

```typescript
Partial<T>     // All optional: { name?: string }
Required<T>    // All required
Pick<T, K>     // Only selected: Pick<User, 'id' | 'name'>
Omit<T, K>     // All except: Omit<User, 'password'>
Record<K, T>   // Object type: Record<string, number>
```

### Practical Use

```typescript
// Update function - only some fields
function updateUser(id: string, updates: Partial<User>) {}

// Form input - no auto-generated fields
type CreateInput = Omit<User, 'id' | 'createdAt'>

// Status colors map
type StatusColors = Record<'pending' | 'active', string>
```

## Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.name);  // ✅ TypeScript knows it's User
}
```

## Common Mistakes

```typescript
// ❌ Using any
function process(data: any) { return data.foo; }

// ✅ Using unknown + guard
function process(data: unknown) {
  if (isUser(data)) return data.name;
}

// ❌ Type assertion without check
const user = data as User;

// ✅ Check first
if (isUser(data)) {
  const user = data;  // Already typed
}
```

## React Types

```typescript
// Props extending HTML element
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}

// Refs
const ref = useRef<HTMLInputElement>(null);

// Events
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
```
