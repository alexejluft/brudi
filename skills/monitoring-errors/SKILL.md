---
name: monitoring-errors
description: Use when implementing error tracking, performance monitoring, and alerting in Next.js applications with Sentry, Vercel Analytics, and structured logging.
---

# Monitoring Errors

## The Rule

**Sentry for errors + performance. Vercel Analytics for Web Vitals. Source maps for readable traces. Never log PII.**

---

## Sentry Configuration

```tsx
// ✅ sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [Sentry.replayIntegration({ maskAllText: true })],
})

// ✅ sentry.server.config.ts — uses SENTRY_DSN (not NEXT_PUBLIC_)
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.2 })

// ✅ sentry.edge.config.ts — minimal for middleware
Sentry.init({ dsn: process.env.SENTRY_DSN })

// ❌ WRONG: Hardcoded DSN, no edge config, tracesSampleRate: 1.0 in prod
```

---

## Error Boundaries + User Context

```tsx
// ✅ Correct: Wrap components + set user context
import { withSentryErrorBoundary } from '@sentry/nextjs'
export default withSentryErrorBoundary(Component, { fallback: <ErrorFallback /> })

// ✅ Set user context on auth
Sentry.setUser({ id: user.id, email: user.email })
Sentry.addBreadcrumb({ category: 'auth', message: 'User logged in', level: 'info' })

// ❌ WRONG: No error boundaries, no user context → anonymous errors
```

---

## Source Maps

```tsx
// ✅ next.config.js — upload source maps for readable stack traces
const { withSentryConfig } = require('@sentry/nextjs')
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: true,
})

// ❌ WRONG: No source maps → minified stack traces, impossible to debug
```

---

## Vercel Analytics + Speed Insights

```tsx
// ✅ Correct: Add to root layout
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <Analytics />
      <SpeedInsights />
    </body></html>
  )
}
// ❌ WRONG: No analytics → blind to real user performance
```

---

## Logging + Alerts

```tsx
// ✅ Structured logging without PII
console.error(JSON.stringify({ level: 'error', component: 'checkout', userId: hashId(userId), errorCode: error.code }))
// ❌ WRONG: console.log(user.email, user.password, apiKey)

// ✅ Alerts: Threshold-based (error rate > 5% → #critical, p95 > 5s → #perf)
// ❌ WRONG: Alert on every event → fatigue → ignored
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No source maps | `withSentryConfig` + auth token |
| Missing server config | Create `sentry.server.config.ts` separately |
| No user context | `Sentry.setUser()` on auth |
| Logging PII | `beforeSend` hook to strip sensitive data |
| Alert fatigue | Threshold-based rules, not per-event |
| `tracesSampleRate: 1.0` in prod | Use 0.1-0.2 for production |
| No error boundaries | `withSentryErrorBoundary` on key components |
