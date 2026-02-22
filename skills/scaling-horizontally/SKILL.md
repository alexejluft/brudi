---
name: scaling-horizontally
description: Use when building applications that must handle increased traffic across multiple instances. Prevents in-memory state issues, connection exhaustion, and single-region bottlenecks.
---

# Scaling Horizontally

## The Rule

**No in-memory state. Connection pooling always. Multi-layer caching with TTL. Rate limit with distributed Redis. Deploy to edge.**

---

## Stateless Architecture

```tsx
// ✅ Correct: State in external services (Supabase, Redis, cookies)
const { data } = await supabase.from('sessions').select().eq('user_id', userId)
const cached = await redis.get(`user:${userId}`)

// ❌ WRONG: In-memory state — lost on restart, different per instance
// const userCache = new Map<string, User>()
// let requestCount = 0
```

---

## Database Connection Pooling

```tsx
// ✅ Correct: Supavisor pooler (port 6543, not 5432)
// Connection string: postgres://...supabase.co:6543/postgres
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
// Supavisor handles connection pooling transparently

// ❌ WRONG: Direct connection without pooler → connection exhaustion under load
// const pool = new Pool({ max: 50 })  // Per-instance = wasteful
```

---

## Caching Layers

```tsx
// ✅ Layer 1: ISR (Vercel edge cache)
export const revalidate = 300  // 5 min — static pages served from CDN

// ✅ Layer 2: fetch cache
const data = await fetch(url, { next: { revalidate: 60 } })

// ✅ Layer 3: Redis for app-level cache (shared across instances)
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()
const cached = await redis.get(`products:featured`)
if (!cached) {
  const fresh = await db.products.findMany({ where: { featured: true } })
  await redis.set(`products:featured`, JSON.stringify(fresh), { ex: 300 })
}

// ❌ WRONG: In-memory Map cache — not shared, stale per instance
// ❌ WRONG: revalidate: 0 everywhere — every request hits DB
```

---

## Edge + Rate Limiting

```tsx
// ✅ Middleware at edge — no cold start, lightweight only
export const runtime = 'edge'
export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')
  // No heavy DB queries — edge has limited APIs + strict timeout
}

// ✅ Distributed rate limiting with Upstash Redis
import { Ratelimit } from '@upstash/ratelimit'
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  if (!success) return Response.json({ error: 'Rate limited' }, { status: 429 })
}
// ❌ WRONG: In-memory rate limiting — different limits per instance
```

---

## Static Generation (ISR)

```tsx
// ✅ Generate popular pages at build, revalidate periodically
export async function generateStaticParams() {
  const popular = await db.products.findMany({ take: 100, orderBy: { views: 'desc' } })
  return popular.map(p => ({ slug: p.slug }))
}
export const revalidate = 600  // 10 min
// ❌ WRONG: SSR everything → no CDN caching, every request hits origin
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| In-memory state | Use Supabase, Redis, or cookies |
| No connection pooling | Supavisor on port 6543 |
| No caching strategy | ISR + fetch cache + Redis layers |
| In-memory rate limiting | Upstash Ratelimit (distributed) |
| Single-region deploy | Vercel Edge + multi-region Supabase |
| `revalidate: 0` everywhere | Set appropriate TTL per route |
