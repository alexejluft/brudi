---
name: deploying-to-production
description: Use when deploying Next.js applications to Vercel with Supabase. Prevents missing env vars, broken builds, and unrecoverable production failures.
---

# Deploying to Production

## The Rule

**Environment variables per scope. Preview deploys for every PR. Database migrations before code. Instant rollback always available.**

---

## Vercel Environment Variables

```bash
# ✅ Correct: Scoped per environment (Settings → Environment Variables)
# Production: STRIPE_KEY=sk_live_...  DATABASE_URL=postgres://prod...
# Preview:    STRIPE_KEY=sk_test_...  DATABASE_URL=postgres://staging...
# Development: Use .env.local

# ❌ WRONG: Same prod keys in preview → accidental real charges
# ❌ WRONG: Missing env vars → cryptic runtime errors
```

---

## next.config.js Production Settings

```tsx
// ✅ Correct: Optimized for production
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]}]
  },
}

// ❌ WRONG: No security headers, images.domains (deprecated), no standalone
```

---

## Preview Deployments + Build Checklist

```bash
# ✅ Every PR gets preview URL (auto-deployed). Review BEFORE merging.
# Configure preview-specific env vars (test Stripe, staging DB)
# Before deploy: npm run build → check bundle size → remove console.log

# ❌ WRONG: Merging without preview, using prod DB in preview
```

---

## Database Migrations Before Deploy

```bash
# ✅ Correct: Migrate → verify → deploy code
supabase migration new add_user_roles        # 1. Create migration
supabase db push --linked                     # 2. Apply to production DB
# 3. Verify: SELECT * FROM supabase_migrations
git push origin main                          # 4. Deploy app code

# ❌ WRONG: Deploy code first → app crashes on missing columns
# ❌ WRONG: No rollback migration prepared
```

---

## Edge vs Serverless

```tsx
// ✅ Edge (runtime = 'edge'): Middleware, auth checks, redirects — low latency
// ✅ Serverless (default): API routes, DB queries, heavy computation
// ❌ WRONG: Heavy DB queries in Edge (limited APIs, timeout constraints)
```

---

## Health Check + Rollback

```tsx
// ✅ app/api/health/route.ts
export async function GET() {
  try {
    const { error } = await supabase.from('_health').select('id').limit(1)
    if (error) throw error
    return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch {
    return Response.json({ status: 'error' }, { status: 500 })
  }
}
// Configure: Vercel → Settings → Monitoring → Health Check: /api/health

// ✅ Rollback: Vercel Deployments → click "Promote to Production" on previous build
// Instant rollback, no rebuild needed
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing env vars in prod | Set ALL vars in Vercel before deploy |
| No preview deploys | Enable automatic PR deployments |
| Code before DB migration | Migrate → verify → then deploy code |
| Hardcoded URLs (localhost) | Use env vars for all URLs |
| No rollback plan | Keep previous deploys, use instant rollback |
| No health check | `/api/health` endpoint + Vercel monitoring |
| `console.log` in prod | Remove or use structured logging |
