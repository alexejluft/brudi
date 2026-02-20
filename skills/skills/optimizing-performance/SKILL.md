---
name: optimizing-performance
description: Use when improving page speed, fixing Core Web Vitals, or diagnosing performance issues. Covers LCP, INP, CLS and practical optimization techniques.
---

# Optimizing Performance

## Core Web Vitals

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** | < 2.5s | Largest content visible |
| **INP** | < 200ms | Interaction to visual feedback |
| **CLS** | < 0.1 | Unexpected layout shifts |

## LCP: Largest Contentful Paint

**Usually caused by:** Hero images, slow server, render-blocking resources

```html
<!-- Optimize LCP image -->
<img 
  src="hero.webp"
  width="1200" 
  height="600"
  fetchpriority="high"
  alt="Hero"
>
```

**Key actions:**
- Preload LCP image
- Use WebP/AVIF format
- Set fetchpriority="high"

## CLS: Cumulative Layout Shift

**Caused by:** Images without dimensions, injected content, fonts

```html
<!-- ❌ Causes layout shift -->
<img src="photo.jpg">

<!-- ✅ Space reserved -->
<img src="photo.jpg" width="800" height="600">
```

**Key actions:**
- Always set width/height on images
- Reserve space for dynamic content
- Use font-display: swap

## Image Optimization Checklist

- [ ] WebP/AVIF format (30-50% smaller)
- [ ] width + height attributes (prevents CLS)
- [ ] loading="lazy" for below-fold
- [ ] fetchpriority="high" for LCP image

```html
<img 
  src="photo.webp"
  width="800" height="600"
  loading="lazy"
  alt="Description"
>
```

## Font Optimization

```css
@font-face {
  font-family: 'Custom';
  src: url('/font.woff2') format('woff2');
  font-display: swap;  /* Show fallback immediately */
}
```

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/font.woff2" as="font" crossorigin>
```

## JavaScript

- **defer** for app scripts (runs after parsing)
- **async** for independent scripts (analytics)
- Check bundle size: bundlephobia.com

```javascript
// ❌ Giant dependency
import moment from 'moment'  // 300KB

// ✅ Lighter alternative
import { format } from 'date-fns'  // 20KB
```

## Quick Wins

1. Use WebP images with dimensions
2. Preload LCP image and fonts
3. Add font-display: swap
4. Remove unused JavaScript
5. Enable compression (gzip/brotli)
