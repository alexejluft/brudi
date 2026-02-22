---
name: building-pwa
description: Use when implementing Progressive Web Apps with Next.js. Covers manifest, service workers, caching strategies, offline support, and install prompts.
---

# Building PWA

## The Rule

**Manifest for installability. Service worker for offline. Cache-first for assets, network-first for API. Always provide offline fallback.**

---

## Manifest (Next.js Metadata API)

```tsx
// ✅ app/manifest.ts
import { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App', short_name: 'App',
    start_url: '/', display: 'standalone',
    background_color: '#ffffff', theme_color: '#0052CC',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
}

// ❌ WRONG: Missing maskable icon, no short_name → install prompt fails
```

---

## Service Worker (Serwist/next-pwa)

```tsx
// ✅ next.config.ts
import withSerwist from '@serwist/next'
export default withSerwist({
  swSrc: 'app/sw.ts', swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig)
```

---

## Caching Strategies

```tsx
// ✅ sw.ts — Cache-first for assets, Network-first for API
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

registerRoute(
  ({ request }) => ['image', 'font', 'style', 'script'].includes(request.destination),
  new CacheFirst({ cacheName: 'assets', plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })] })
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 3 })
)

// ❌ WRONG: CacheFirst for API → stale data, NetworkFirst for images → slow
```

---

## Offline Fallback

```tsx
// ✅ app/offline/page.tsx — shown when network unavailable
export default function Offline() {
  return <div className="flex flex-col items-center justify-center h-screen">
    <h1>You're offline</h1><p>Check your connection and try again.</p>
  </div>
}
// ✅ SW: serve /offline for failed navigations
// self.addEventListener('fetch', (e) => { if (e.request.mode === 'navigate') e.respondWith(fetch(e.request).catch(() => caches.match('/offline'))) })
```

---

## Install Prompt + Push

```tsx
// ✅ Capture beforeinstallprompt
'use client'
export function InstallButton() {
  const [prompt, setPrompt] = useState<any>(null)
  useEffect(() => {
    const h = (e: any) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  if (!prompt) return null
  return <button onClick={() => { prompt.prompt(); setPrompt(null) }}>Install App</button>
}

// ✅ Push: Subscribe + handle in SW
const reg = await navigator.serviceWorker.ready
await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_KEY })
// SW: self.addEventListener('push', (e) => self.registration.showNotification(...))
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No offline fallback | `/offline` page + SW navigation fallback |
| CacheFirst for API | NetworkFirst with timeout for dynamic data |
| No cache invalidation | ExpirationPlugin + versioned cache names |
| Incomplete manifest | name, icons (maskable), start_url, display |
| SW not updating | Bump cache version, reloadOnOnline |
| No install prompt | Capture `beforeinstallprompt`, show UI |
