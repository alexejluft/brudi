---
name: designing-resilient-apis
description: Use when building or reviewing APIs — REST, tRPC, or GraphQL. Prevents inconsistent errors, missing idempotency, broken pagination, and unversioned contracts.
---

# Designing Resilient APIs

## The Rule

Version every API. Idempotency keys for mutations. RFC 7807 errors. Cursor pagination. Zod validation at boundary.

---

## API Versioning

```tsx
// ✅ URL: /api/v2/users/123 or Header: Api-Version: 2
// ❌ WRONG: No versioning
```

---

## Idempotency Keys

```tsx
// ✅ Client sends UUID, server caches result
export async function POST(req: Request) {
  const key = req.headers.get('Idempotency-Key')
  if (!key) return Response.json({ error: 'Key required' }, { status: 400 })

  const cached = await redis.get(`idem:${key}`)
  if (cached) return Response.json(JSON.parse(cached))

  const result = await processPayment(await req.json())
  await redis.set(`idem:${key}`, JSON.stringify(result), { ex: 86400 })
  return Response.json(result)
}
// ❌ WRONG: No idempotency → retry = double payment
```

---

## Error Responses (RFC 7807)

```tsx
// ✅ Consistent Problem Details format
return Response.json({
  type: 'https://api.example.com/errors/validation',
  title: 'Validation Error',
  status: 422,
  errors: { email: ['Must be valid'] },
}, { status: 422 })

// ❌ WRONG: Inconsistent errors (string, object, wrong status)
```

---

## Pagination

```tsx
// ✅ Cursor-based (stable with inserts/deletes)
export async function GET(req: Request) {
  const cursor = new URL(req.url).searchParams.get('cursor')
  const limit = 20

  const items = await db.items.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({
    data: items.slice(0, limit),
    nextCursor: items.length > limit ? items[limit - 1].id : null,
  })
}
// ❌ WRONG: No pagination or offset-based
```

---

## Input Validation at Boundary

```tsx
// ✅ Zod at API entry point
import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
})

export async function POST(req: Request) {
  const result = CreateUserSchema.safeParse(await req.json())
  if (!result.success) {
    return Response.json({ type: 'validation_error', status: 400,
      errors: result.error.flatten().fieldErrors }, { status: 400 })
  }
}
// ❌ WRONG: Raw req.body to database
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No versioning | URL `/v1/` or header versioning |
| POST for everything | Use correct HTTP methods |
| No idempotency keys | UUID header + server cache |
| Inconsistent errors | RFC 7807 Problem Details |
| No pagination | Cursor-based pagination |
| No input validation | Zod at API boundary |
| No OpenAPI spec | Generate from spec |
