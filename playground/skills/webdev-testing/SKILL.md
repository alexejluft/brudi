---
name: webdev-testing
description: Master React testing with Vitest and Testing Library. User-centric testing, query priority, async patterns, and mocking. Use when writing tests, setting up test infrastructure, or debugging test failures.
version: 0.1.0
---

# WebDev Testing — User-Centric Testing

Write tests that catch bugs without being brittle. This skill covers Vitest, Testing Library, and patterns that make testing effective.

## Core Principle

> **"Test like a USER, not like a developer."**

Your test shouldn't know HOW your code works. It should know what the USER sees and does.

```typescript
// ❌ BAD — testing implementation
expect(component.state.count).toBe(1)

// ✅ GOOD — testing user experience
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

---

## The Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Test runner (faster than Jest, native ESM) |
| **Testing Library** | DOM queries (finds elements like a user) |
| **jest-dom** | Better DOM assertions |
| **user-event** | Simulates real user interactions |
| **MSW** | Mocks API calls |

### Setup (5 minutes)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

---

## Query Priority

Use queries in this order. Higher = more accessible, more resilient.

### 1. getByRole (Best)

```typescript
// Accessibility-first. How screen readers navigate.
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { level: 1 })
screen.getByRole('link', { name: /home/i })
screen.getByRole('checkbox', { name: /accept terms/i })
```

### 2. getByLabelText

```typescript
// For form inputs. How users read labels.
screen.getByLabelText(/email address/i)
screen.getByLabelText(/password/i)
```

### 3. getByPlaceholderText

```typescript
// If no label (not ideal, but sometimes necessary)
screen.getByPlaceholderText(/search/i)
```

### 4. getByText

```typescript
// For visible text content
screen.getByText(/welcome/i)
screen.getByText(/no results found/i)
```

### 5. getByTestId (Last Resort)

```typescript
// Only when nothing else works
screen.getByTestId('custom-element')
```

**Why this order?** getByRole tests what users actually experience (accessibility). getByTestId only tests that an element exists — it doesn't prove the UI is usable.

---

## Query Variants

### getBy* — Must Exist

```typescript
// Throws error if not found
const button = screen.getByRole('button')
```

Use when: Element should be visible immediately.

### findBy* — Will Exist (Async)

```typescript
// Waits up to 1000ms, returns Promise
const message = await screen.findByText(/success/i)
```

Use when: Element appears after async operation (API call, loading).

### queryBy* — Might Not Exist

```typescript
// Returns null if not found, doesn't throw
const error = screen.queryByText(/error/i)
expect(error).not.toBeInTheDocument()
```

Use when: Asserting element is NOT present.

### Memory Aid

| Query | Element State |
|-------|---------------|
| getBy | "Must be there now" |
| findBy | "Will be there soon" |
| queryBy | "Might not be there" |

---

## User Events

Use `userEvent` instead of `fireEvent`. It simulates real user behavior.

### Setup

```typescript
import userEvent from '@testing-library/user-event'

test('example', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  // Use user.* methods
})
```

### Common Interactions

```typescript
// Click
await user.click(screen.getByRole('button'))

// Type
await user.type(screen.getByLabelText(/email/i), 'test@example.com')

// Clear and type
await user.clear(screen.getByLabelText(/email/i))
await user.type(screen.getByLabelText(/email/i), 'new@example.com')

// Select option
await user.selectOptions(screen.getByRole('combobox'), 'option-value')

// Check/uncheck
await user.click(screen.getByRole('checkbox'))

// Hover
await user.hover(screen.getByText(/menu/i))

// Tab navigation
await user.tab()

// Keyboard
await user.keyboard('{Enter}')
await user.keyboard('{Escape}')
```

---

## Common Assertions

### Element Presence

```typescript
expect(screen.getByText(/hello/i)).toBeInTheDocument()
expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
```

### Element State

```typescript
expect(button).toBeEnabled()
expect(button).toBeDisabled()
expect(checkbox).toBeChecked()
expect(input).toHaveValue('test')
expect(input).toHaveFocus()
```

### Element Content

```typescript
expect(element).toHaveTextContent(/welcome/i)
expect(element).toHaveAttribute('href', '/home')
expect(element).toHaveClass('active')
expect(element).toHaveStyle({ color: 'red' })
```

### Visibility

```typescript
expect(element).toBeVisible()
expect(element).not.toBeVisible()
```

---

## Testing Patterns

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

test('increments count on click', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  
  // Initial state
  expect(screen.getByText('Count: 0')).toBeInTheDocument()
  
  // User action
  await user.click(screen.getByRole('button', { name: /increment/i }))
  
  // Result
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### Form Testing

```typescript
test('validates email format', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginForm onSubmit={onSubmit} />)
  
  // Enter invalid email
  await user.type(screen.getByLabelText(/email/i), 'invalid')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Should show error, not submit
  expect(screen.getByText(/valid email/i)).toBeInTheDocument()
  expect(onSubmit).not.toHaveBeenCalled()
})

test('submits valid form', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginForm onSubmit={onSubmit} />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  })
})
```

### Async Data Loading

```typescript
test('shows loading then data', async () => {
  render(<UserProfile userId="123" />)
  
  // Loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for data (findBy is async)
  expect(await screen.findByText('John Doe')).toBeInTheDocument()
  
  // Loading should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

### Error States

```typescript
test('shows error when fetch fails', async () => {
  // Mock API failure
  server.use(
    rest.get('/api/user', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )
  
  render(<UserProfile userId="123" />)
  
  expect(await screen.findByText(/error/i)).toBeInTheDocument()
})
```

---

## Mocking

### Mock Functions

```typescript
// Create mock
const handleClick = vi.fn()
render(<Button onClick={handleClick} />)

// Trigger
await user.click(screen.getByRole('button'))

// Assert
expect(handleClick).toHaveBeenCalled()
expect(handleClick).toHaveBeenCalledTimes(1)
expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
```

### Mock Modules

```typescript
// Mock entire module
vi.mock('./api', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: 1, name: 'Test' }]))
}))

// In test
import { fetchUsers } from './api'

test('calls fetchUsers', async () => {
  render(<UserList />)
  expect(fetchUsers).toHaveBeenCalled()
})
```

### Spy on Methods

```typescript
const consoleSpy = vi.spyOn(console, 'log')
// ... do something
expect(consoleSpy).toHaveBeenCalledWith('expected message')
consoleSpy.mockRestore()
```

### MSW for API Mocking

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    )
  })
]

// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// src/test/setup.ts
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter())
  
  expect(result.current.count).toBe(0)
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

---

## Testing with Context

```typescript
// Create wrapper
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <UserProvider>
        {ui}
      </UserProvider>
    </ThemeProvider>
  )
}

// Use in tests
test('component with context', () => {
  renderWithProviders(<MyComponent />)
  // ...
})
```

---

## Debugging

### screen.debug()

```typescript
test('debugging example', () => {
  render(<Component />)
  
  screen.debug()  // Prints DOM to console
  screen.debug(screen.getByRole('button'))  // Print specific element
})
```

### logRoles

```typescript
import { logRoles } from '@testing-library/dom'

test('what roles exist?', () => {
  const { container } = render(<Component />)
  logRoles(container)  // Shows all ARIA roles
})
```

### Testing Playground

```typescript
// Add this to any test, opens browser with element picker
screen.logTestingPlaygroundURL()
```

---

## Common Mistakes

### ❌ Using Implementation Details

```typescript
// BAD
expect(component.state.isOpen).toBe(true)

// GOOD
expect(screen.getByRole('dialog')).toBeVisible()
```

### ❌ Not Waiting for Async

```typescript
// BAD — may pass or fail randomly
render(<AsyncComponent />)
expect(screen.getByText(/loaded/i)).toBeInTheDocument()

// GOOD — waits for element
render(<AsyncComponent />)
expect(await screen.findByText(/loaded/i)).toBeInTheDocument()
```

### ❌ Testing Styles

```typescript
// BAD — brittle, tests implementation
expect(button).toHaveStyle({ backgroundColor: '#3b82f6' })

// GOOD — test behavior, not appearance
expect(button).toBeEnabled()
expect(button).toHaveClass('btn-primary')  // If necessary
```

### ❌ Too Many Assertions Per Test

```typescript
// BAD — hard to debug when it fails
test('everything works', () => {
  expect(a).toBe(1)
  expect(b).toBe(2)
  expect(c).toBe(3)
  // ... 20 more assertions
})

// GOOD — one concept per test
test('count starts at zero', () => {
  expect(screen.getByText('Count: 0')).toBeInTheDocument()
})

test('count increments on click', async () => {
  await user.click(button)
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### ❌ Testing Third-Party Code

```typescript
// BAD — testing library behavior
test('useState works', () => {
  const [state] = useState(0)
  expect(state).toBe(0)
})

// GOOD — test YOUR code that uses the library
test('counter starts at zero', () => {
  render(<Counter />)
  expect(screen.getByText('0')).toBeInTheDocument()
})
```

---

## Test Structure (AAA)

```typescript
test('descriptive name', async () => {
  // ARRANGE — setup
  const user = userEvent.setup()
  render(<Component />)
  
  // ACT — perform action
  await user.click(screen.getByRole('button'))
  
  // ASSERT — verify result
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})
```

---

## Coverage

```typescript
// vite.config.ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['**/*.d.ts', 'src/test/**']
  }
}
```

```bash
npm run test -- --coverage
```

**Target:** 80% coverage is good. 100% is often not worth the effort.

---

## Quick Reference

### Query Cheat Sheet

| Need | Query |
|------|-------|
| Button | `getByRole('button', { name: /text/i })` |
| Link | `getByRole('link', { name: /text/i })` |
| Input with label | `getByLabelText(/label/i)` |
| Heading | `getByRole('heading', { level: 1 })` |
| Checkbox | `getByRole('checkbox')` |
| Image | `getByRole('img', { name: /alt text/i })` |
| Generic text | `getByText(/text/i)` |

### Common ARIA Roles

| Role | Elements |
|------|----------|
| button | `<button>`, `<input type="submit">` |
| link | `<a href>` |
| textbox | `<input type="text">`, `<textarea>` |
| checkbox | `<input type="checkbox">` |
| radio | `<input type="radio">` |
| combobox | `<select>` |
| heading | `<h1>` - `<h6>` |
| list | `<ul>`, `<ol>` |
| listitem | `<li>` |
| dialog | `<dialog>`, elements with `role="dialog"` |

---

**Remember:** Tests should give you confidence to refactor. If changing implementation (not behavior) breaks tests, the tests are too coupled to implementation details.
