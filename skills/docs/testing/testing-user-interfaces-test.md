# Pressure Test: testing-user-interfaces

---

## Scenario 1: Implementation testen statt Verhalten

**Prompt:**
"Teste eine Modal-Komponente die sich öffnet und schließt."

**Expected WITHOUT skill:**
```typescript
test('modal opens', () => {
  const { rerender } = render(<Modal isOpen={false} />)
  rerender(<Modal isOpen={true} />)
  expect(component.state.isVisible).toBe(true) // ❌ Implementation
  // oder:
  expect(wrapper.find('.modal').prop('style').display).toBe('block') // ❌ Styles
})
```

**Expected WITH skill:**
```typescript
test('modal opens when trigger is clicked', async () => {
  const user = userEvent.setup()
  render(<ModalWithTrigger />)

  await user.click(screen.getByRole('button', { name: /open modal/i }))

  expect(screen.getByRole('dialog')).toBeVisible() // ✅ Was der User sieht
})
```

---

## Scenario 2: Async ohne findBy

**Prompt:**
"Teste eine Komponente die Daten lädt und dann eine Liste anzeigt."

**Expected WITHOUT skill:**
```typescript
test('shows items', () => {
  render(<ItemList />)
  expect(screen.getByText('Item 1')).toBeInTheDocument() // ❌ Daten noch nicht geladen
  // Test schlägt fehl: "Unable to find an element with the text: Item 1"
})
```

**Expected WITH skill:**
```typescript
test('shows items after loading', async () => {
  render(<ItemList />)

  // Zeige Loading-State
  expect(screen.getByRole('status')).toBeInTheDocument() // Skeleton/Spinner

  // Warte auf Daten
  const item = await screen.findByText('Item 1') // ✅ findBy wartet automatisch
  expect(item).toBeInTheDocument()

  // Loading-State weg
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
```

---

## Scenario 3: getByTestId statt semantischer Queries

**Prompt:**
"Teste einen Submit-Button in einem Formular."

**Expected WITHOUT skill:**
```typescript
render(<LoginForm />)
const button = screen.getByTestId('submit-button') // ❌ Fragil — an data-testid gebunden
await user.click(button)
```

**Expected WITH skill:**
```typescript
render(<LoginForm />)
const button = screen.getByRole('button', { name: /sign in/i }) // ✅ Wie ein User sucht
await user.click(button)
// Funktioniert auch wenn data-testid entfernt wird
// Scheitert wenn Button-Text sich ändert — das ist GEWOLLT
```

---

## Scenario 4: Formular-Test ohne Fehlerzustände

**Prompt:**
"Teste ein Login-Formular."

**Expected WITHOUT skill:**
```typescript
test('login form works', async () => {
  render(<LoginForm />)
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password')
  await user.click(screen.getByRole('button', { name: /login/i }))
  expect(screen.getByText('Welcome')).toBeInTheDocument()
})
// Nur Happy Path — kein leeres Formular, kein falsches Passwort
```

**Expected WITH skill:**
```typescript
test('shows error on empty submit', async () => {
  render(<LoginForm />)
  await user.click(screen.getByRole('button', { name: /login/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
})

test('disables button during submission', async () => {
  render(<LoginForm />)
  await user.type(screen.getByLabelText(/email/i), 'test@test.com')
  await user.click(screen.getByRole('button', { name: /login/i }))
  expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
})
```
- Testet alle relevanten States: idle, loading, error
- Nicht nur den Happy Path

---

## Test Results

**Scenario 1:** ❌ Testet State/Styles statt sichtbares Verhalten
**Scenario 2:** ❌ Kein `await findBy` → Test schlägt bei Async fehl
**Scenario 3:** ❌ `getByTestId` statt semantischer Query
**Scenario 4:** ❌ Nur Happy Path — Error/Loading States ungetestet
