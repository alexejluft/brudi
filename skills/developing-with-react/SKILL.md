---
name: developing-with-react
description: Use when building React applications, debugging state issues, or working with Server Components. Helps understand RSC architecture, composition patterns, and common pitfalls.
---

# Developing with React

## Server Components: WHY No Hooks?

Server Components run **once** and are done. There's:
- No browser to persist state
- No DOM for effects
- No instance to re-render

**This is BY DESIGN, not a limitation.**

| Feature | Server | Client |
|---------|--------|--------|
| Hooks | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| In JS bundle | ❌ | ✅ |
| async/await | ✅ | ❌ |

## Composition Pattern (Critical)

**Problem:** Client Components can't import Server Components.

**Solution:** Pass Server Component as children.

```jsx
// ServerPage.js (Server Component)
<ClientWrapper>
  <ServerContent />  {/* Rendered on server FIRST */}
</ClientWrapper>

// ClientWrapper.js
'use client'
function ClientWrapper({ children }) {
  return <div onClick={...}>{children}</div>;
}
```

The Server Component renders on server. Only the RESULT passes to client.

## State Mutation Bug

**Symptom:** "State isn't updating"

```javascript
// ❌ MUTATION - same reference, React ignores
items.push(newItem);
setItems(items);

// ✅ NEW ARRAY - new reference, React re-renders
setItems([...items, newItem]);

// ✅ For objects
setUser({ ...user, name: 'Alex' });
```

**Why?** React uses referential equality. Same reference = no change detected.

## Derived State Anti-Pattern

**Symptom:** useEffect to calculate from other state

```javascript
// ❌ ANTI-PATTERN - unnecessary effect + re-render
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0));
}, [items]);

// ✅ CORRECT - calculate during render (simple values)
const total = items.reduce((sum, i) => sum + i.price, 0);

// ✅ useMemo — only for genuinely expensive calculations
const sortedItems = useMemo(() =>
  [...items].sort((a, b) => b.price - a.price),
  [items]
)
// Don't useMemo by default — only when profiling shows it's slow
```

## State Update Pattern

```javascript
// When new state depends on old:
setCount(prev => prev + 1);

// Not this (stale closure risk):
setCount(count + 1);
```

## Common Mistakes

```javascript
// ❌ Index as key
items.map((item, i) => <Item key={i} />)

// ✅ Stable ID
items.map(item => <Item key={item.id} />)
```
