---
name: implementing-auth-properly
description: Use when setting up Supabase authentication in Next.js App Router. Prevents client-only auth checks, missing RLS policies, and insecure token handling.
---

# Implementing Auth Properly

## The Rule

**Auth must be validated server-side. RLS secures data. Sessions refresh automatically.**

---

## Browser + Server Clients

```tsx
// ✅ Correct: Separate clients for each environment
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createClient = () => {
  const cookieStore = cookies()
  return createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll() }
  })
}

// ❌ WRONG: Browser client in Server Components — no cookie access
```

---

## Middleware: Server-Side Auth Gate

```tsx
// ✅ Correct: Validate session in middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
export const config = { matcher: ['/dashboard/:path*', '/api/protected/:path*'] }

// ❌ WRONG: Client-only check — bypassed via direct URL or fetch
// 'use client'
// const { data: { user } } = useAuth()
// if (!user) return null
```

---

## Auth Callback Route

```tsx
// ✅ Correct: Exchange code for session (PKCE flow)
// app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (code) {
    const supabase = createServerClient(request)
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

// ❌ WRONG: No callback route → OAuth silently breaks
```

---

## Row Level Security (RLS)

```sql
-- ✅ Correct: Policies use auth.uid()
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- ❌ WRONG: No RLS → anon key holders access ALL data
```

---

## OAuth + Session Security

```tsx
// ✅ Correct: PKCE flow with redirect
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
// Sessions use httpOnly cookies (Supabase SSR default) — invisible to XSS

// ❌ WRONG: No redirectTo, or localStorage tokens (XSS-vulnerable)
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Client-only auth check | Validate in middleware + Server Components |
| No RLS policies | `ENABLE RLS` + policies with `auth.uid()` |
| Tokens in localStorage | Use httpOnly cookies (Supabase SSR default) |
| Missing `/auth/callback` | Create route handler for code exchange |
| No middleware matcher | Add protected paths to `config.matcher` |
| Service role key in client | Server-only — never `NEXT_PUBLIC_` |
