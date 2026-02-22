---
name: securing-applications
description: Use when building APIs, handling user input, or deploying Next.js/React apps to production. Prevents XSS, CSRF, injection, and secret exposure.
---

# Securing Applications

## The Rule

**Never trust client input.** Server-validate everything with Zod. Sanitize HTML. Set security headers. Rate-limit endpoints. Keep secrets server-only.

---

## Input Validation & Sanitization

```tsx
// ❌ WRONG: No validation
export async function POST(req: Request) {
  const { content } = await req.json()
  await supabase.from('posts').insert({ body: content })
}

// ✅ Correct: Zod + DOMPurify
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

const PostSchema = z.object({ content: z.string().min(1).max(5000) })

export async function POST(req: Request) {
  const validated = PostSchema.parse(await req.json())
  const sanitized = DOMPurify.sanitize(validated.content)
  await supabase.rpc('create_post', { post_content: sanitized, user_id: session.user.id })
  return Response.json({ success: true })
}
```

---

## XSS Prevention

```tsx
// ❌ WRONG: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Correct: DOMPurify.sanitize(userContent) or render text as text
<div>{userContent}</div>
```

---

## Security Headers (next.config.js)

```tsx
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
    ],
  }]
}
```

---

## Rate Limiting

```tsx
import { Ratelimit } from '@upstash/ratelimit'
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) return Response.json({ error: 'Too many' }, { status: 429 })
  // process
}
// ❌ WRONG: No rate limiting
```

---

## Secrets: Server-Only

```tsx
// ❌ WRONG: NEXT_PUBLIC_API_SECRET visible in browser DevTools

// ✅ Correct: Server-only env (no NEXT_PUBLIC_ prefix)
// DATABASE_URL and API_SECRET in app/api/route.ts only
const secret = process.env.API_SECRET
```

---

## CSRF + Cookie Security

```tsx
// ✅ Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Strict
// ❌ WRONG: Missing HttpOnly/Secure/SameSite
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `dangerouslySetInnerHTML` unsanitized | DOMPurify or avoid entirely |
| No server-side validation | Zod `.parse()` on every route |
| Missing security headers | CSP, X-Frame-Options, nosniff |
| `NEXT_PUBLIC_` for secrets | Server-only env variables |
| No rate limiting | `@upstash/ratelimit` |
| `Access-Control-Allow-Origin: *` | Whitelist specific domains |
| Raw SQL / cookies without HttpOnly | `.rpc()` parameterized; `HttpOnly; Secure; SameSite=Strict` |
