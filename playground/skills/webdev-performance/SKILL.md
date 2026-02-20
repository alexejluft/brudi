---
name: webdev-performance
description: Optimize web performance with Core Web Vitals, image optimization, code splitting, and framework-specific techniques. Covers LCP, INP, CLS, and practical quick wins. Use when improving page speed, analyzing performance issues, or optimizing builds.
version: 0.1.0
---

# WebDev Performance — Speed That Matters

Make websites fast where it counts. This skill covers Core Web Vitals, optimization techniques, and the 80/20 wins that make the biggest difference.

## Core Insight

> **Performance is UX.**

A page that loads 100ms faster feels higher quality — even if users can't articulate why. Performance isn't a technical metric; it's user experience.

---

## Core Web Vitals

The three metrics Google uses for ranking and user experience.

### LCP — Largest Contentful Paint

**What:** Time until the largest content element is visible.
**Target:** < 2.5 seconds
**Typical culprits:** Hero images, slow server, render-blocking resources

```html
<!-- Optimize LCP image -->
<img 
  src="hero.webp"
  width="1200"
  height="600"
  fetchpriority="high"
  alt="Hero image"
/>
```

### INP — Interaction to Next Paint

**What:** Time from user interaction to visual feedback.
**Target:** < 200ms
**Typical culprits:** Heavy JavaScript, main thread blocking, long tasks

```javascript
// BAD — blocks main thread
button.addEventListener('click', () => {
  heavyComputation()  // 500ms
  updateUI()
})

// GOOD — defer heavy work
button.addEventListener('click', () => {
  updateUI()  // Immediate feedback
  requestIdleCallback(() => heavyComputation())
})
```

### CLS — Cumulative Layout Shift

**What:** How much the page layout shifts unexpectedly.
**Target:** < 0.1
**Typical culprits:** Images without dimensions, dynamically injected content, fonts

```html
<!-- ALWAYS include dimensions -->
<img src="photo.jpg" width="400" height="300" alt="..." />

<!-- Reserve space for dynamic content -->
<div style="min-height: 200px">
  <!-- Content loaded later -->
</div>
```

---

## Image Optimization

Images are often 50%+ of page weight. Optimize them first.

### Format Selection

| Format | Use Case |
|--------|----------|
| **WebP** | Photos, general images (30-50% smaller than JPEG) |
| **AVIF** | Best compression, but limited browser support |
| **SVG** | Icons, logos, illustrations |
| **PNG** | Only when transparency needed AND WebP fails |

### Modern Image Tag

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Fallback" width="800" height="600" />
</picture>
```

### Lazy Loading

```html
<!-- Lazy load below-the-fold images -->
<img src="photo.webp" loading="lazy" alt="..." />

<!-- Eager load above-the-fold (default) -->
<img src="hero.webp" loading="eager" fetchpriority="high" alt="..." />
```

### Responsive Images

```html
<img
  src="image-800.webp"
  srcset="
    image-400.webp 400w,
    image-800.webp 800w,
    image-1200.webp 1200w
  "
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="..."
/>
```

### Image CDN Benefits

- Automatic format conversion
- On-the-fly resizing
- Edge caching
- Quality optimization

Popular: Cloudflare Images, Cloudinary, imgix

---

## Font Optimization

### font-display: swap

```css
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;  /* Show fallback immediately */
}
```

### Preload Critical Fonts

```html
<link 
  rel="preload" 
  href="/fonts/inter-var.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
/>
```

### Only Load What You Need

```css
/* BAD — loading all weights */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900');

/* GOOD — only needed weights */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700');
```

### Self-Host > Google Fonts

Self-hosting eliminates:
- DNS lookup for fonts.googleapis.com
- Connection to fonts.gstatic.com
- Privacy concerns

---

## JavaScript Optimization

### Code Splitting

```javascript
// Instead of importing everything
import { FullLibrary } from 'huge-library'

// Import only what you need
import { specificFunction } from 'huge-library/specific'

// Or dynamic import for rare features
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### defer vs async

```html
<!-- defer: Downloads parallel, executes in order after HTML parsing -->
<script src="app.js" defer></script>

<!-- async: Downloads parallel, executes immediately (order not guaranteed) -->
<script src="analytics.js" async></script>
```

**Rule:** Use `defer` for your app, `async` for independent scripts (analytics).

### Bundle Analysis

```bash
# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer
```

Check: https://bundlephobia.com before installing packages.

### Tree Shaking

Ensure you're not shipping dead code:

```javascript
// ❌ Imports entire library
import _ from 'lodash'

// ✅ Imports only what's used
import { debounce } from 'lodash-es'

// ✅ Even better: native alternative
function debounce(fn, ms) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}
```

---

## CSS Optimization

### Critical CSS

Inline CSS needed for above-the-fold content:

```html
<head>
  <style>
    /* Critical CSS — renders immediately */
    body { margin: 0; font-family: system-ui; }
    .hero { height: 100vh; }
  </style>
  <link rel="stylesheet" href="full.css" media="print" onload="this.media='all'" />
</head>
```

### Remove Unused CSS

```bash
# PurgeCSS
npx purgecss --css styles.css --content '**/*.html' --output purged.css
```

### Avoid @import

```css
/* ❌ Sequential loading */
@import url('reset.css');
@import url('theme.css');

/* ✅ Parallel loading — use link tags instead */
```

---

## Framework-Specific

### Next.js / React

```jsx
// Use next/image for automatic optimization
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  priority  // For LCP image
  alt="Hero"
/>

// Server Components (zero client JS)
// app/page.tsx — no 'use client' = server component

// Dynamic imports for large components
const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />
})

// Suspense for streaming
<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>
```

### Astro

```astro
---
// Zero JS by default!
import { Image } from 'astro:assets'
---

<!-- Automatic optimization -->
<Image src={heroImage} alt="Hero" />

<!-- Lazy hydration -->
<InteractiveComponent client:visible />
<HeavyWidget client:idle />
<Modal client:only="react" />
```

### Vite

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  }
})
```

---

## Caching

### Cache Headers

```
# Static assets (immutable with hash)
Cache-Control: public, max-age=31536000, immutable

# HTML (revalidate)
Cache-Control: no-cache

# API responses (short cache)
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

### Service Worker (PWA)

```javascript
// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/app.js'
      ])
    })
  )
})
```

---

## Measuring Performance

### Tools

| Tool | Best For |
|------|----------|
| **Lighthouse** | Quick audits, built into DevTools |
| **PageSpeed Insights** | Real-world data + lab data |
| **WebPageTest** | Deep analysis, filmstrip view |
| **Chrome DevTools Performance** | Flame charts, main thread analysis |
| **Bundlephobia** | NPM package size before installing |

### Real User Monitoring (RUM)

```javascript
// Report Core Web Vitals
import { onCLS, onINP, onLCP } from 'web-vitals'

onCLS(console.log)
onINP(console.log)
onLCP(console.log)
```

---

## Quick Wins Checklist

### Images
- [ ] Use WebP/AVIF format
- [ ] Include width and height attributes
- [ ] Add `loading="lazy"` for below-fold images
- [ ] Add `fetchpriority="high"` for LCP image
- [ ] Use responsive images (srcset)

### Fonts
- [ ] Use `font-display: swap`
- [ ] Preload critical fonts
- [ ] Only load needed weights
- [ ] Consider self-hosting

### JavaScript
- [ ] Code split large features
- [ ] Use `defer` for scripts
- [ ] Check bundle size before adding dependencies
- [ ] Remove unused code (tree shaking)

### CSS
- [ ] Inline critical CSS
- [ ] Remove unused CSS
- [ ] Avoid CSS @import

### General
- [ ] Enable compression (gzip/brotli)
- [ ] Use a CDN
- [ ] Set proper cache headers
- [ ] Reduce server response time

---

## Anti-Patterns

### ❌ Premature Optimization

```javascript
// Don't optimize before measuring
useMemo(() => a + b, [a, b])  // Addition is fast!

// Only optimize measured bottlenecks
useMemo(() => items.sort(complexSort), [items])  // Worth it
```

### ❌ Giant Bundle

```javascript
// ❌ Importing everything
import moment from 'moment'  // 300KB!

// ✅ Use lighter alternatives
import { format } from 'date-fns'  // 20KB
```

### ❌ Unoptimized Images

```html
<!-- ❌ 4MB PNG straight from camera -->
<img src="photo.png" />

<!-- ✅ Optimized WebP with proper size -->
<img src="photo-800.webp" width="800" height="600" loading="lazy" />
```

### ❌ Layout Shift from Ads/Embeds

```html
<!-- ❌ No space reserved -->
<div id="ad"></div>

<!-- ✅ Reserve space -->
<div id="ad" style="min-height: 250px;"></div>
```

---

## Performance Budget

Set limits and enforce them:

```json
// budget.json
[
  {
    "resourceType": "script",
    "budget": 200
  },
  {
    "resourceType": "total",
    "budget": 500
  },
  {
    "metric": "lcp",
    "budget": 2500
  }
]
```

```bash
# Lighthouse CI
npx lighthouse-ci assert --budgetPath=budget.json
```

---

**Remember:** Measure first, optimize second. The fastest code is code that doesn't run. The smallest bundle is the one you didn't ship.
