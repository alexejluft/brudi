---
name: optimizing-images
description: Use when adding images to Next.js/React apps — hero images, cards, galleries. Prevents CLS, slow LCP, and oversized payloads.
---

# Optimizing Images

## The Rule

**Always set `width`/`height` (prevents CLS).** Use `priority` for LCP images. Serve WebP/AVIF. Configure `remotePatterns` for external sources. Never skip `alt` text.

---

## Next.js Image: Dimensions & CLS

```tsx
// ✅ Explicit dimensions prevent CLS
<Image src="/hero.jpg" alt="Hero" width={1920} height={1080} />

// ✅ Fill mode with sized container
<div className="relative w-full h-[600px]">
  <Image src="/hero.jpg" alt="Hero" fill className="object-cover" />
</div>

// ❌ WRONG: No dimensions → CLS
```

---

## Priority vs. Lazy Loading

```tsx
// ✅ Above-fold (LCP): priority
<Image src="/hero.jpg" alt="Hero" width={1920} height={1080} priority />

// ✅ Below-fold: default lazy
<Image src="/card.jpg" alt="Card" width={300} height={200} />

// ❌ WRONG: LCP without priority, or priority on small icon
```

---

## Responsive Images

```tsx
// ✅ Responsive sizes per viewport
<Image src="/photo.jpg" alt="Photo" width={800} height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />

// ❌ WRONG: Desktop resolution on mobile
```

---

## Formats: AVIF > WebP > JPEG

```tsx
// ✅ HTML fallback chain (non-Next.js)
<picture>
  <source srcSet="/img.avif" type="image/avif" />
  <source srcSet="/img.webp" type="image/webp" />
  <img src="/img.jpg" alt="Photo" width={800} height={600} />
</picture>

// ✅ Next.js handles format auto — just configure:
// next.config.js
images: { formats: ['image/avif', 'image/webp'] }

// ❌ WRONG — unoptimized PNG (3-5x larger than WebP)
<Image src="/photo.png" alt="Photo" width={800} height={600} />
```

---

## Remote Patterns

```tsx
// next.config.js — required for external image optimization
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.example.com' },
    { protocol: 'https', hostname: '**.supabase.co' },
  ]
}

// ❌ WRONG — no remotePatterns → external images not optimized
```

---

## Alt Text

```tsx
// ✅ Descriptive — what the image communicates
<Image src="/chart.jpg" alt="Revenue growth 2024: 45% year-over-year" width={600} height={400} />

// ✅ Decorative — intentionally empty
<Image src="/divider.svg" alt="" width={800} height={2} />

// ❌ WRONG — generic or missing
<Image src="/chart.jpg" alt="image" width={600} height={400} />
<Image src="/chart.jpg" alt="chart.jpg" width={600} height={400} />
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| No width/height | CLS layout shift | Always set dimensions or use `fill` |
| LCP image without `priority` | Slow Largest Contentful Paint | Add `priority` to above-fold images |
| No `sizes` prop | Mobile loads desktop images | Set responsive `sizes` breakpoints |
| PNG/JPG unoptimized | 3-5x larger payload | Use WebP/AVIF or next/image auto |
| Missing `remotePatterns` | External images unoptimized | Configure in next.config.js |
| Generic alt text | Failed accessibility + SEO | Describe image purpose specifically |
