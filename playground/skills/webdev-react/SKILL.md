---
name: webdev-react
description: Master modern React with Server Components, hooks, state management, and composition patterns. Deep understanding of RSC wire format, client/server boundaries, and performance optimization. Use when building React applications or components.
version: 0.1.0
---

# WebDev React — Modern React Mastery

Build React applications with deep understanding of Server Components, hooks, and composition patterns. This skill covers RSC architecture, state management, and performance.

## Core Mental Models

### React's Job

React's job is to **synchronize UI with state**. Everything else builds on this:

1. State changes
2. React re-renders affected components
3. React updates the DOM (minimal changes)

### Components Are Functions

```jsx
// A component is just a function that returns JSX
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Which compiles to:
function Greeting({ name }) {
  return React.createElement('h1', null, `Hello, ${name}`);
}
```

---

## React Server Components (RSC)

### The Big Misconception

> "RSC is Server-Side Rendering 2.0" — **WRONG**

SSR and RSC are **orthogonal**. They solve different problems.

| SSR | RSC |
|-----|-----|
| React → **HTML** → Browser | React → **Serialized React Tree** → Browser |
| Browser loads **ALL code** | Browser loads **only Client Component code** |
| Hydration (attach event handlers) | Reconstruct React tree from stream |
| "Hydration Tax" | No code for Server Components |

### What RSC Actually Outputs

RSC outputs a **serialized React tree**, not HTML:

```
# RSC Wire Format
M1:{"id":"./Button.client.js","chunks":["client1"]}
J0:["$","@1",null,{"children":["$","span",null,{"children":"Hello"}]}]
```

- `M` lines = Module References (Client Components)
- `J` lines = React Element Trees
- `@1` = Reference to Client Component M1

**Why not HTML?** With this format, React can **reconstruct** the tree — state is preserved, updates are minimal, it's a normal React update!

### The Bundler Magic

When a Server Component imports a Client Component:

```jsx
// What you write
import Button from './Button'

// What the bundler creates
{
  $$typeof: Symbol(react.module.reference),
  filename: "./Button.client.js",
  name: "default"
}
```

Not the function — just a **reference**. The server doesn't know the client code, it just knows it exists.

### Why No Hooks in Server Components?

| Hook | Why It Can't Work |
|------|-------------------|
| useState | Where would state live? Server Components run **once** and are done. No browser to hold state. |
| useEffect | Which DOM? There is none! Effects run **after rendering in the browser**. |
| useRef | Same problem — no persistent instance on server. |

**Server Components are stateless and effectless by design.** Not a limitation — a feature!

### Props Must Be Serializable

At the Server → Client boundary, props must be JSON-serializable:

```jsx
// ❌ WRONG — Functions can't be serialized
function ServerPage() {
  return <ClientButton onClick={() => alert('hi')} />
}

// ✅ RIGHT — Handler lives in Client Component
'use client'
function ClientButton() {
  return <button onClick={() => alert('hi')}>Click</button>
}
```

**But:** Client Components can pass functions to **other Client Components**. The restriction only applies at the Server→Client boundary.

### The Composition Pattern

Client Components can't **import** Server Components. But they can receive them as **children**:

```jsx
// ServerPage.js (Server Component)
import ClientWrapper from './ClientWrapper'
import ServerContent from './ServerContent'

function ServerPage() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* ✅ Passed as children! */}
    </ClientWrapper>
  )
}
```

The trick: `ServerContent` is rendered by the server **before** being sent to the client. The client only sees the finished output as props.

### Streaming with Suspense

```jsx
import { Suspense } from 'react'

async function SlowComponent() {
  const data = await fetchSomeData()  // Takes 2 seconds
  return <div>{data}</div>
}

function Page() {
  return (
    <div>
      <h1>Page Title</h1>  {/* Sent immediately */}
      
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />  {/* Streamed when ready */}
      </Suspense>
    </div>
  )
}
```

The shell streams immediately. Slow parts arrive later.

### When to Use "use client"

```jsx
// Server Component (default) — NO directive needed
function StaticContent() {
  return <p>No interactivity needed</p>
}

// Client Component — needs directive
'use client'
function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Rule:** Push "use client" as far down the tree as possible. Only the interactive leaves need it.

---

## Hooks

### The Two Rules

1. **Only call hooks at the top level** — never in loops, conditions, or nested functions
2. **Only call hooks from React functions** — components or custom hooks

### Built-in Hooks Reference

| Hook | Purpose |
|------|---------|
| useState | Local component state |
| useEffect | Side effects (subscriptions, DOM manipulation) |
| useContext | Access context without prop drilling |
| useRef | Mutable value that persists across renders |
| useMemo | Memoize expensive calculations |
| useCallback | Memoize functions |
| useReducer | Complex state logic |
| useId | Generate unique IDs for accessibility |

### useState Patterns

```jsx
// Basic
const [count, setCount] = useState(0)

// With updater function (when new state depends on old)
setCount(prev => prev + 1)

// Lazy initialization (expensive initial value)
const [data, setData] = useState(() => computeExpensiveValue())

// Object state
const [form, setForm] = useState({ name: '', email: '' })
setForm(prev => ({ ...prev, name: 'Alex' }))
```

### useEffect Patterns

```jsx
// Run on every render (rare)
useEffect(() => {
  console.log('Rendered')
})

// Run once on mount
useEffect(() => {
  fetchData()
}, [])

// Run when dependency changes
useEffect(() => {
  fetchUser(userId)
}, [userId])

// With cleanup
useEffect(() => {
  const handler = () => {}
  window.addEventListener('resize', handler)
  
  return () => window.removeEventListener('resize', handler)
}, [])
```

### Custom Hooks

#### useDebounce

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 300)
```

#### useLocalStorage

```typescript
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark')
```

#### useOnClickOutside

```typescript
function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }

    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

// Usage
const dropdownRef = useRef(null)
useOnClickOutside(dropdownRef, () => setIsOpen(false))
```

#### useFetch

```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function fetchData() {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (isMounted) {
          setData(json)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    
    fetchData()
    return () => { isMounted = false }
  }, [url])

  return { data, loading, error }
}
```

---

## State Management

### When to Use What

| Complexity | Solution |
|------------|----------|
| Local component state | useState |
| Shared between few components | Lift state up + props |
| Deeply nested, many consumers | Context |
| Complex logic, many actions | useReducer |
| Global, persisted, complex | Zustand/Jotai |

### Lifting State Up

```jsx
// ❌ State duplicated
function Parent() {
  return (
    <>
      <ChildA />  {/* Has own count state */}
      <ChildB />  {/* Has own count state */}
    </>
  )
}

// ✅ State lifted to parent
function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <ChildA count={count} setCount={setCount} />
      <ChildB count={count} />
    </>
  )
}
```

### Context Pattern

```jsx
// 1. Create context
const ThemeContext = createContext<{
  theme: string
  setTheme: (t: string) => void
} | null>(null)

// 2. Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Custom hook for consuming
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

// 4. Usage
function ThemedButton() {
  const { theme, setTheme } = useTheme()
  return <button className={theme}>Toggle</button>
}
```

### useReducer for Complex State

```typescript
type State = {
  items: Item[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; items: Item[] }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'ADD_ITEM'; item: Item }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.items }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] }
  }
}

// Usage
const [state, dispatch] = useReducer(reducer, initialState)
dispatch({ type: 'ADD_ITEM', item: newItem })
```

---

## Performance

### React.memo

Prevents re-render if props haven't changed:

```jsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Only re-renders if `data` changes
  return <div>{/* expensive rendering */}</div>
})
```

### useMemo

Memoize expensive calculations:

```jsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])  // Only recalculate when items change
```

### useCallback

Memoize functions (prevents child re-renders):

```jsx
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])  // Only recreate when id changes

return <ExpensiveChild onClick={handleClick} />
```

### When to Optimize

**Don't optimize prematurely.** Only use memo/useMemo/useCallback when:

1. You've measured a performance problem
2. Component re-renders are actually slow
3. The optimization benefit outweighs the complexity

---

## Component Patterns

### Compound Components

```jsx
// API
<Tabs>
  <Tabs.List>
    <Tabs.Tab>One</Tabs.Tab>
    <Tabs.Tab>Two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel>Content 1</Tabs.Panel>
    <Tabs.Panel>Content 2</Tabs.Panel>
  </Tabs.Panels>
</Tabs>

// Implementation
const TabsContext = createContext(null)

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.Tab = function Tab({ children, index }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext)
  return (
    <button 
      onClick={() => setActiveIndex(index)}
      data-active={activeIndex === index}
    >
      {children}
    </button>
  )
}
```

### Render Props

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  
  return render(position)
}

// Usage
<MouseTracker render={({ x, y }) => (
  <div>Mouse at {x}, {y}</div>
)} />
```

### Controlled vs Uncontrolled

```jsx
// Controlled — parent owns state
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />
}

// Uncontrolled — component owns state
function UncontrolledInput({ defaultValue }) {
  const inputRef = useRef(null)
  return <input ref={inputRef} defaultValue={defaultValue} />
}
```

---

## Anti-Patterns

### ❌ Prop Drilling

```jsx
// BAD — passing props through many levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserProfile user={user} />
    </Sidebar>
  </Layout>
</App>

// GOOD — use context
const UserContext = createContext(null)
// ...
const user = useContext(UserContext)
```

### ❌ Using Index as Key

```jsx
// BAD — breaks on reorder/filter
{items.map((item, index) => (
  <Item key={index} {...item} />
))}

// GOOD — use stable unique ID
{items.map((item) => (
  <Item key={item.id} {...item} />
))}
```

### ❌ Mutating State Directly

```jsx
// BAD — mutation
const [items, setItems] = useState([])
items.push(newItem)  // ❌
setItems(items)       // Won't trigger re-render!

// GOOD — new array
setItems([...items, newItem])
```

### ❌ useEffect for Derived State

```jsx
// BAD — unnecessary effect
const [items, setItems] = useState([])
const [total, setTotal] = useState(0)

useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0))
}, [items])

// GOOD — calculate during render
const total = items.reduce((sum, i) => sum + i.price, 0)
```

### ❌ Over-using useMemo/useCallback

```jsx
// BAD — premature optimization
const value = useMemo(() => a + b, [a, b])  // Addition is cheap!

// GOOD — only for expensive operations
const sortedItems = useMemo(() => {
  return [...items].sort(complexSort)
}, [items])
```

---

## Quick Reference

### Server vs Client Components

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Directive | none (default) | `'use client'` |
| Hooks | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| async/await | ✅ | ❌ (use useEffect) |
| Database access | ✅ | ❌ |
| In bundle | ❌ | ✅ |

### Hook Dependencies

```jsx
useEffect(() => {
  // Effect code
}, dependencies)

// dependencies = []        → runs once on mount
// dependencies = undefined → runs every render
// dependencies = [a, b]    → runs when a or b change
```

---

**Remember:** React is simple at its core — state triggers renders, renders return UI. Everything else is just patterns built on this foundation.
