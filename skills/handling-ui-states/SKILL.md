---
name: handling-ui-states
description: Use when building any UI component that fetches data, submits forms, or displays user content. Every component has 4 states — building only the content state is the most common AI mistake.
---

# Handling UI States

## The Iron Rule

**Every component that touches data has exactly 4 states. Ship all 4, always.**

```
Loading → Error → Empty → Content
```

AI builds only `Content`. That's not a UI — it's a prototype.

---

## The 4 States

### 1. Loading
Show something. Never blank screen.

```tsx
// ✅ Skeleton for page load, Spinner for actions
<button disabled={isPending}>
  {isPending ? <Spinner /> : 'Save'}
</button>
```

### 2. Error
Tell the user what went wrong. Give them a way out.

```tsx
// ✅ Actionable error — not just "Something went wrong"
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div role="alert">
      <p>{error.message ?? 'Could not load data.'}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  )
}
```

**Rules:**
- Plain language — no error codes exposed to user
- Always offer a recovery action (retry, go back, contact support)
- Use `role="alert"` for screen readers
- Never expose technical details (stack traces, SQL errors)

### 3. Empty
No data ≠ broken. Explain what would appear + give next action. Never just "No items."

### 4. Content
The actual UI. Only rendered after loading/error/empty.

---

## Pattern: Complete Component

```tsx
function DataComponent({ id }: { id: string }) {
  const { data, isLoading, error } = useData(id)

  // 1. Loading
  if (isLoading) return <DataSkeleton />

  // 2. Error
  if (error) return <ErrorState error={error} onRetry={refetch} />

  // 3. Empty
  if (!data || data.length === 0) return <EmptyState />

  // 4. Content — only now
  return <DataList items={data} />
}
```

**Order matters:** Loading → Error → Empty → Content. Always this order.

---

## Form States

```tsx
<button disabled={isPending}>
  {isPending ? 'Saving...' : 'Save'}
</button>
```

**Rule:** Disable inputs while pending. Confirm success explicitly.

---

## Common Mistakes

| AI does | Why it's wrong | Correct |
|---------|---------------|---------|
| Renders data directly | Crashes when data is undefined | Always guard with loading/error first |
| `{data && <List />}` | Silently shows nothing on empty | Explicit empty state with action |
| Generic "Error occurred" | User can't act on it | Specific message + retry button |
| Loading spinner for page load | Layout shift, disorienting | Skeleton that matches content shape |
| No `disabled` during submit | Double-submit, race conditions | Disable all form controls while pending |
