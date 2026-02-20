---
name: building-with-nextjs
description: Use when building with Next.js App Router — data fetching, Server vs Client Components, caching, metadata. AI consistently generates outdated Pages Router patterns (getServerSideProps) that don't work in app/.
---

# Building with Next.js

## The Rule

AI generates Pages Router code (`getServerSideProps`, `getStaticProps`) even in
`app/` projects. These throw errors. The App Router is fundamentally different:
**data fetching happens in async Server Components, not in special functions.**

---

## Data Fetching — App Router Patterns

```tsx
// ✅ SSR — fresh on every request (replaces getServerSideProps)
export default async function Page() {
  const data = await fetch('/api/items', { cache: 'no-store' }).then(r => r.json())
  return <div>{data.name}</div>
}

// ✅ SSG — cached forever (replaces getStaticProps)
const data = await fetch('/api/config', { cache: 'force-cache' }).then(r => r.json())

// ✅ ISR — revalidate every N seconds (replaces getStaticProps + revalidate)
const data = await fetch('/api/items', { next: { revalidate: 60 } }).then(r => r.json())

// ✅ On-demand revalidation (in Server Action or Route Handler)
import { revalidateTag } from 'next/cache'
await fetch('/api/items', { next: { tags: ['items'] } }).then(r => r.json())
revalidateTag('items') // invalidates all fetches tagged 'items'
```

**Never mix `cache: 'no-store'` with `next: { revalidate }` — conflicting options are silently ignored.**

---

## Migration Map (Pages → App Router)

| Old (Pages Router) | New (App Router) |
|---|---|
| `getServerSideProps` | `fetch(..., { cache: 'no-store' })` in async Server Component |
| `getStaticProps` | `fetch(..., { cache: 'force-cache' })` in async Server Component |
| `getStaticProps + revalidate` | `fetch(..., { next: { revalidate: N } })` |
| `getStaticPaths` | `generateStaticParams()` |
| `pages/_app.js` | `app/layout.tsx` |
| `pages/api/route.ts` | `app/api/route/route.ts` (Route Handler) |

---

## Server vs Client Components

**Decision rule — use `'use client'` only when you need:**
- `useState`, `useEffect`, or any hook
- Browser events (`onClick`, `onChange`)
- Browser-only APIs (`window`, `localStorage`)

```tsx
// ✅ Correct — interactivity isolated at leaf level
// page.tsx (Server Component — no 'use client')
import { LikeButton } from './like-button'

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)   // server-side, no bundle cost
  return (
    <div>
      <ProductImage src={product.image} />    {/* Server Component */}
      <ProductDescription text={product.desc} /> {/* Server Component */}
      <LikeButton productId={id} />            {/* Only this is 'use client' */}
    </div>
  )
}
```

**Context Providers pattern:**
```tsx
// providers.tsx — extract to own file
'use client'
export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// layout.tsx — Server Component, children stay Server Components
import { Providers } from './providers'
export default function RootLayout({ children }) {
  return <html><body><Providers>{children}</Providers></body></html>
}
```

---

## Metadata (SEO)

```tsx
// ✅ Static metadata
export const metadata = {
  title: { template: '%s | My Site', default: 'My Site' },
  description: 'Default description',
}

// ✅ Dynamic metadata — for routes with params
export async function generateMetadata({ params }) {
  const { id } = await params                    // await params — Next.js 15+
  const post = await getPost(id)                 // fetch() auto-deduplicated
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [{ url: post.ogImage }] },
  }
}

export default async function BlogPost({ params }) {
  const { id } = await params
  const post = await getPost(id)                 // no duplicate DB call
  return <article>{post.content}</article>
}
```

**`metadata` only works in Server Components.** Adding it to a `'use client'` file does nothing.

---

## Common Mistakes

| Mistake | Error / Result | Fix |
|---------|---------------|-----|
| `getServerSideProps` in `app/` | Build error: not supported | Async Server Component + `cache: 'no-store'` |
| `'use client'` on entire page | Full page in JS bundle, no SEO | Isolate to leaf components only |
| `cache: 'no-store'` + `revalidate` | Silently ignored — unpredictable | Use one or the other, never both |
| `metadata` in Client Component | Does nothing, no SEO | Move to Server Component |
| Forgot `await params` (Next.js 15+) | `params.id` is undefined | `const { id } = await params` |
| `generateMetadata` calls API twice | Double cost | fetch() is auto-deduplicated, or use `cache()` from React |
