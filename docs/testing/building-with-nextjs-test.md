# Pressure Test: building-with-nextjs

Evidenz-Basis: Vercel "Common Mistakes" Blog, GitHub Issues #52914, #58754,
#42408, Next.js Discussions #54075, #59857, #68187.

---

## Scenario 1: Veraltetes Muster

**Prompt:**
"Hole Produktdaten serverseitig für eine Produktdetailseite in Next.js."

**Expected WITHOUT skill:**
```tsx
// AI generiert Pages Router Pattern im app/ Verzeichnis
export async function getServerSideProps(context) {
  const res = await fetch(`/api/products/${context.params.id}`)
  const product = await res.json()
  return { props: { product } }
}
export default function ProductPage({ product }) {
  return <div>{product.name}</div>
}
```
- Wirft Error: `getServerSideProps is not supported in app/`
- Halluziniert Pages Router Syntax
- Versteht App Router Data Fetching nicht

**Expected WITH skill:**
```tsx
export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await fetch(`/api/products/${id}`, {
    cache: 'no-store'
  }).then(r => r.json())
  return <div>{product.name}</div>
}
```
- Async Server Component, kein getServerSideProps
- Explizites `cache: 'no-store'` für dynamische Daten
- `await params` (Next.js 15+)

---

## Scenario 2: "use client" Übernutzung

**Prompt:**
"Baue eine Produktseite mit einer Bildergalerie, Beschreibung und einem Like-Button."

**Expected WITHOUT skill:**
```tsx
'use client' // gesamte Seite als Client Component
import { useState } from 'react'

export default function ProductPage({ params }) {
  const [liked, setLiked] = useState(false)
  // Alles client-seitig, obwohl nur der Button Interaktion braucht
  return (
    <div>
      <ProductGallery />
      <ProductDescription />
      <button onClick={() => setLiked(!liked)}>Like</button>
    </div>
  )
}
```
- Gesamte Seite im Client Bundle
- Kein SEO für Produktbeschreibung
- Unnötiges JS für statische Inhalte

**Expected WITH skill:**
```tsx
// page.tsx — Server Component
import { LikeButton } from './like-button' // einziger Client Component

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductDescription text={product.description} />
      <LikeButton productId={id} /> {/* isolierter Client Component */}
    </div>
  )
}
```
- Interaktivität isoliert auf Leaf-Level
- Alles andere bleibt Server Component

---

## Scenario 3: fetch() Caching Konflikte

**Prompt:**
"Die Produktseite zeigt manchmal alte Preise. Debug das Caching-Problem."

**Expected WITHOUT skill:**
- Schaut nach useEffect (gibt keinen)
- Vermutet Browser-Cache
- Schlägt `cache: 'no-cache'` vor (falsches Attribut)
- Versteht Next.js Caching-Layer nicht

**Expected WITH skill:**
Weiß: Next.js hat mehrere Caching-Layer:
1. Request Memoization (pro Request)
2. Data Cache (persistent, serverside)
3. Full Route Cache (static rendering)
4. Router Cache (client-side, 30s)

Diagnose:
```tsx
// Problem: kein explizites cache-Setting
const res = await fetch('/api/products') // unklar ob cached

// Fix: explizit
const res = await fetch('/api/products', {
  next: { revalidate: 60 } // ISR: alle 60s aktualisieren
})
// oder für immer frisch:
const res = await fetch('/api/products', { cache: 'no-store' })
```
Weiß: `cache: 'no-store'` und `revalidate` können nicht zusammen verwendet werden

---

## Scenario 4: Metadata für SEO vergessen

**Prompt:**
"Erstelle eine Blog-Post Seite. SEO ist wichtig."

**Expected WITHOUT skill:**
```tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.id)
  return <article>{post.content}</article>
}
// Kein Metadata → alle Blog-Posts haben denselben <title>
```
- Kein `generateMetadata`
- Alle Posts haben denselben Title und Description
- Kein OpenGraph für Social Sharing
- SEO komplett ignoriert

**Expected WITH skill:**
```tsx
export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await getPost(id) // fetch() wird automatisch dedupliziert
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.ogImage }],
    },
  }
}

export default async function BlogPost({ params }) {
  const { id } = await params
  const post = await getPost(id) // kein doppelter DB-Call dank React cache()
  return <article>{post.content}</article>
}
```
- `generateMetadata` für dynamische Routes
- `await params` korrekt
- fetch()-Deduplication vermeidet doppelte API-Calls

---

## Test Results

**Scenario 1 (veraltete Muster):**
- ❌ Generiert getServerSideProps im app/ Verzeichnis → Error
- ❌ Halluziniert Pages Router API
- ❌ Versteht async Server Component nicht

**Scenario 2 ("use client" Übernutzung):**
- ❌ Markiert gesamte Seite als Client Component
- ❌ Versteht Leaf-Level Isolation nicht
- ❌ Schlechtes SEO und Performance

**Scenario 3 (Caching):**
- ❌ Kennt Next.js Caching-Layer nicht
- ❌ Falsches Attribut (`no-cache` statt `no-store`)
- ❌ Kann ISR nicht von SSR unterscheiden

**Scenario 4 (Metadata):**
- ❌ Vergisst generateMetadata komplett
- ❌ Kein OpenGraph
- ❌ Verursacht doppelte API-Calls
