---
name: testing-end-to-end
description: Use when writing E2E tests with Playwright. Prevents fragile selectors, flaky waits, test coupling, and missing CI configuration.
---

# Testing End to End

## The Rule

**Test user behavior, not implementation.** Use semantic locators (role > label > text > data-testid). Let Playwright auto-wait. Isolate every test. Mock network for stability.

---

## Semantic Locators & Auto-Waiting

```tsx
// ✅ Correct: role → label → text → data-testid
await page.getByRole('button', { name: /submit/i }).click()
await page.getByLabel('Email').fill('user@test.com')

// ✅ Auto-waits for actionability — never use waitForTimeout
await expect(page.getByText('Saved!')).toBeVisible()

// ❌ WRONG: CSS classes, ID, timeouts
```

---

## Test Isolation

```tsx
// ✅ Correct: Fresh page per test, no shared state
test('signup', async ({ page }) => {
  await page.goto('/signup')
  await page.getByLabel('Email').fill('new@test.com')
})

// ❌ WRONG: Global state + test order dependency
let token: string
test('dashboard', async ({ page }) => { /* fails if login skipped */ })
```

---

## Network Mocking

```tsx
// ✅ Mock API to test error handling
await page.route('**/api/user/me', route =>
  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
)
await page.goto('/profile')
await expect(page.getByText('Unable to load')).toBeVisible()

// ❌ WRONG: No mocking → flaky
```

---

## Visual Regression + Accessibility

```tsx
// ✅ Screenshot assertion
await expect(page).toHaveScreenshot('login.png')

// ✅ Accessibility check
import AxeBuilder from '@axe-core/playwright'
const results = await new AxeBuilder({ page }).analyze()
expect(results.violations).toHaveLength(0)
```

---

## Page Object Model

```tsx
class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: /sign in/i }).click()
  }
}

test('user login', async ({ page }) => {
  await new LoginPage(page).login('test@test.com', 'pwd123')
})
// ❌ WRONG: Raw selectors scattered across tests
```

---

## CI/CD Config (playwright.config.ts)

```tsx
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: { headless: true, trace: 'on-first-retry' },
  webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: !process.env.CI },
})

// ❌ WRONG: headless: false (CI hangs), no trace, no retries
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| CSS selectors (`.btn-primary`) | `getByRole()`, `getByLabel()`, `getByText()` |
| `waitForTimeout(3000)` | Auto-wait with `expect()` |
| Shared state between tests | Fresh `page` per test |
| No API mocking | `page.route('**/api/**', ...)` |
| No screenshot assertions | `expect(page).toHaveScreenshot()` |
| No accessibility checks | `@axe-core/playwright` |
| Raw selectors / `headless: false` | Page Object Model; always `headless: true` + `trace` |
