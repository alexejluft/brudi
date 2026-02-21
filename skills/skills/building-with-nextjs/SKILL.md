---
name: building-with-nextjs
description: Use when building with Next.js App Router — data fetching, Server vs Client Components, caching, metadata. Updated for Next.js 15/16 with async params/searchParams. AI generates outdated Pages Router patterns (getServerSideProps) that don't work in app/.
---

# Building with Next.js

## The Rule

AI generates Pages Router code (`getServerSideProps`, `getStaticProps`) even in `app/` projects. These throw errors. The App Router is fundamentally different: **data fetching happens in async Server Components, not in special functions.** In Next.js 15+, `params` and `searchParams` are Promises—always await them.

## Dynamic Routes & Params (Next.js 15+)

```tsx
// ❌ Old (Next.js 14) — params is synchronous
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params  // ❌ undefined in 15+
}

// ✅ Current — params is a Promise, must await
type Props = { params: Promise<{ slug: string }> }
export default async function Page({ params }: Props) {
  const { slug } = await params  // ✅ correct
  return <h1>{slug}</h1>
}

// ✅ generateMetadata also receives Promise params
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: slug }
}
```

## Data Fetching — App Router Patterns

```tsx
// ✅ SSR — fresh on every request
export default async function Page() {
  const data = await fetch('/api/items', { cache: 'no-store' }).then(r => r.json())
  return <div>{data.name}</div>
}

// ✅ SSG — cached forever
const data = await fetch('/api/config', { cache: 'force-cache' }).then(r => r.json())

// ✅ ISR — revalidate every N seconds
const data = await fetch('/api/items', { next: { revalidate: 60 } }).then(r => r.json())

// ✅ On-demand revalidation
import { revalidateTag } from 'next/cache'
await fetch('/api/items', { next: { tags: ['items'] } })
revalidateTag('items')
```

## searchParams is also a Promise

```tsx
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const { page, sort } = await searchParams
  return <div>Page {page}, sort by {sort}</div>
}
```

## Server vs Client Components

**Use `'use client'` only when you need:** `useState`, `useEffect`, browser events, or `window`/`localStorage`.

```tsx
// ✅ Correct — Server Component, interactivity isolated at leaf
export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  return (
    <div>
      <ProductImage src={product.image} />
      <LikeButton productId={id} />  {/* 'use client' only here */}
    </div>
  )
}

// like-button.tsx
'use client'
export function LikeButton({ productId }: { productId: string }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>♥</button>
}
```

## Metadata (SEO)

```tsx
export const metadata = {
  title: { template: '%s | My Site', default: 'My Site' },
  description: 'Default description',
}

// ✅ Dynamic metadata
type MetadataProps = { params: Promise<{ id: string }> }
export async function generateMetadata({ params }: MetadataProps) {
  const { id } = await params
  const post = await getPost(id)  // fetch() auto-deduplicated
  return { title: post.title, description: post.excerpt }
}
```

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `getServerSideProps` in `app/` | Build error | Use async Server Component + `cache: 'no-store'` |
| Forgot `await params` | `params.slug` is undefined Promise | `const { slug } = await params` |
| Forgot `await searchParams` | Doesn't work | `const { page } = await searchParams` |
| `'use client'` on entire page | Full JS bundle, no SEO | Isolate to leaf components only |
| `cache: 'no-store'` + `revalidate` | Silently ignored | Use one or the other, never both |
| `metadata` in Client Component | Does nothing | Move to Server Component |
| Cookies/headers not awaited | Error or undefined | `const cookieStore = await cookies()` |
