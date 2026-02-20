---
name: testing-user-interfaces
description: Use when writing component tests, testing forms, or debugging test failures. Covers query priority, async patterns, and user-centric testing approach.
---

# Testing User Interfaces

## Core Principle

> Test like a USER, not like a developer.

Don't test implementation. Test what users see and do.

## Query Priority (Memorize This)

1. **getByRole** — Best. Screen reader compatible.
2. **getByLabelText** — Form inputs.
3. **getByText** — Visible content.
4. **getByTestId** — Last resort only.

```typescript
// ✅ Good
screen.getByRole('button', { name: /submit/i })

// ❌ Avoid
screen.getByTestId('submit-button')
```

## Query Variants

| Query | Element Status |
|-------|----------------|
| getBy* | Must exist NOW |
| findBy* | Will exist (async) |
| queryBy* | Might NOT exist |

```typescript
// Element exists now
screen.getByText('Hello')

// Element appears after async
await screen.findByText('Loaded')

// Assert element is gone
expect(screen.queryByText('Loading')).not.toBeInTheDocument()
```

## Basic Test Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/success/i)).toBeInTheDocument();
});
```

## Common Mistakes

```typescript
// ❌ Testing implementation
expect(component.state.isOpen).toBe(true)

// ✅ Testing user experience
expect(screen.getByRole('dialog')).toBeVisible()
```

```typescript
// ❌ Not waiting for async
render(<AsyncComponent />);
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ Wait for it
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

```typescript
// ❌ Testing styles
expect(button).toHaveStyle({ backgroundColor: 'blue' })

// ✅ Testing behavior/state
expect(button).toBeEnabled()
```

## Debugging

```typescript
screen.debug();              // Print DOM
screen.logTestingPlaygroundURL();  // Open interactive picker
```
