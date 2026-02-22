---
name: managing-background-jobs
description: Use when handling long-running tasks, scheduled operations, or async processing in Next.js. Prevents timeout crashes, duplicate processing, and blocking UI.
---

# Managing Background Jobs

## The Rule

**Never run long tasks in API routes (10-25s timeout). Use Inngest for event-driven jobs. Cron via Vercel. Always design idempotent.**

---

## Why Not API Routes?

```tsx
// ❌ WRONG: Long operation in API route → timeout crash
export async function POST(req: Request) {
  await processLargeDataset(req.body.userId)  // Dies after 25s on Vercel
  return Response.json({ done: true })
}

// ✅ Correct: Trigger background job, respond immediately
export async function POST(req: Request) {
  await inngest.send({ name: 'data.process', data: { userId: req.body.userId } })
  return Response.json({ status: 'processing' })  // Returns in <100ms
}
```

---

## Inngest: Event-Driven Jobs

```tsx
// ✅ inngest/client.ts
import { Inngest } from 'inngest'
export const inngest = new Inngest({ id: 'my-app' })

// ✅ inngest/functions.ts — with retries and step functions
export const processData = inngest.createFunction(
  { id: 'process-data', retries: 3 },
  { event: 'data.process' },
  async ({ event, step }) => {
    const data = await step.run('fetch-data', () => fetchUserData(event.data.userId))
    await step.run('send-email', () => sendEmail(data.email, 'Processing complete'))
    return { success: true }
  }
)

// ✅ app/api/inngest/route.ts — webhook endpoint
import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { processData } from '@/inngest/functions'
export const { GET, POST, PUT } = serve({ client: inngest, functions: [processData] })
```

---

## Vercel Cron Jobs

```json
// ✅ vercel.json — scheduled tasks
{
  "crons": [
    { "path": "/api/crons/cleanup", "schedule": "0 2 * * *" },
    { "path": "/api/crons/sync", "schedule": "*/15 * * * *" }
  ]
}
```

```tsx
// ✅ app/api/crons/cleanup/route.ts
export async function GET(req: Request) {
  // Verify Vercel cron header
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await cleanupExpiredSessions()
  return Response.json({ cleaned: true })
}
```

---

## Idempotency + Fan-Out

```tsx
// ✅ Idempotent: Check before processing — safe to retry
async ({ event }) => {
  const key = `order-${event.data.orderId}`
  const existing = await db.processedJobs.findUnique({ where: { key } })
  if (existing) return existing.result  // Already done — skip
  const result = await chargePayment(event.data.orderId)
  await db.processedJobs.create({ data: { key, result } })
  return result
}
// ❌ WRONG: No idempotency → retry = double charge

// ✅ Fan-out: One event triggers multiple jobs
await step.sendEvent('fan-out', [
  { name: 'email.send', data: { orderId } },
  { name: 'inventory.update', data: { orderId } },
])
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Long tasks in API routes | Use Inngest/background jobs |
| No retry logic | `retries: 3` in function config |
| No idempotency | Check-before-process with unique key |
| Blocking UI for background work | Return immediately, process async |
| Unprotected cron endpoints | Verify `CRON_SECRET` header |
| No step functions | Break jobs into steps for partial retry |
