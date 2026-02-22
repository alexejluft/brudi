---
name: implementing-seo
description: Use when implementing SEO in Next.js — metadata, Open Graph, JSON-LD, sitemaps, robots.txt, and Core Web Vitals optimization.
---

# Implementing SEO

## The Rule

**Use Next.js Metadata API for all SEO.** Every page needs dynamic metadata, Open Graph, and JSON-LD structured data. Generate sitemap and robots.txt programmatically. Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) are direct ranking factors.

---

## Metadata API (Per Page)

```tsx
// ✅ Dynamic metadata per route
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  return {
    title: `${product.name} | MyStore`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `https://mystore.com/products/${params.slug}` },
    openGraph: {
      title: product.name,
      images: [{ url: product.image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

// ❌ WRONG: Hardcoded in layout (same meta for all pages)
```

---

## JSON-LD Structured Data

```tsx
// ✅ Correct — Schema.org for rich snippets
export default function ProductPage({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{product.name}</h1>
    </>
  )
}

// ❌ WRONG — no structured data (no rich snippets in search results)
// ❌ WRONG — missing @context or @type
```

---

## Sitemap & robots.txt

```tsx
// app/sitemap.ts — auto-generates /sitemap.xml
export default async function sitemap() {
  const products = await getProducts()
  return [
    { url: 'https://mystore.com', priority: 1 },
    ...products.map(p => ({ url: `https://mystore.com/products/${p.slug}` })),
  ]
}

// app/robots.ts
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: 'https://mystore.com/sitemap.xml',
  }
}

// ❌ WRONG: Static XML (stale) or no robots.txt
```

---

## Core Web Vitals Targets

```
LCP < 2.5s: priority on hero, SSR, font preload
INP < 200ms: no long tasks, defer non-critical JS
CLS < 0.1: width/height on images
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Hardcoded `<head>` tags | Same meta on all pages | `generateMetadata()` per route |
| No Open Graph images | Poor social sharing | Add `openGraph.images` (1200x630) |
| No JSON-LD | No rich snippets in search | Add `<script type="application/ld+json">` |
| Static sitemap.xml | Stale, missing new pages | Dynamic `app/sitemap.ts` |
| No canonical URL | Duplicate content penalty | Set `alternates.canonical` |
| Missing robots.txt | Uncontrolled crawling | Generate with `app/robots.ts` |
