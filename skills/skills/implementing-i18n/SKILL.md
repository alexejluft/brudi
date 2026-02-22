---
name: implementing-i18n
description: Use when building multilingual Next.js applications with next-intl v4+. Prevents hardcoded strings, broken locale routing, and missing SEO for international audiences.
---

# Implementing i18n

## The Rule

**next-intl v4+ for App Router. `i18n/request.ts` provides config. Middleware detects locale. `params` is always awaited. `useTranslations` Client, `getTranslations` Server.**

---

## 1 — Setup: Three Required Files

```tsx
// ✅ src/i18n/config.ts
export const locales = ['en', 'de', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
// ✅ src/i18n/request.ts — v4 REQUIRED
import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './config'
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as any)) locale = defaultLocale
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})

// ✅ next.config.mjs — plugin points to request.ts
import createNextIntlPlugin from 'next-intl/plugin'
export default createNextIntlPlugin('./src/i18n/request.ts')({ /* config */ })
// ❌ v3 BROKEN: no request.ts, no plugin — translations silently empty
```

---

## 2 — Middleware (v4 Syntax)

```tsx
// ✅ middleware.ts — localePrefix is OBJECT in v4, not string
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'
export default createMiddleware({
  locales, defaultLocale,
  localePrefix: { mode: 'always' }   // ← v4: object, NOT string 'always'
})
export const config = { matcher: ['/((?!_next|api|favicon.ico).*)'] }
// ❌ v3 BROKEN: localePrefix: 'always' → TypeError in v4
```
---
## 3 — Layout: Params is Promise in v4

```tsx
// ✅ app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params            // ← v4: MUST await
  if (!locales.includes(locale as any)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  return (
    <html lang={locale}><body>
      <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
    </body></html>
  )
}
export function generateStaticParams() { return locales.map((l) => ({ locale: l })) }
// ❌ v3 BROKEN: params: { locale } without await → build error
// ❌ v3 BROKEN: no NextIntlClientProvider → client translations undefined
```
---
## 4 — Translations + Messages

> 💡 Asset: `~/Brudi/assets/i18n/base.{lang}.json`

```tsx
// ✅ Client: useTranslations       ✅ Server: getTranslations (async)
'use client'
import { useTranslations } from 'next-intl'
function Hero() { const t = useTranslations('home'); return <h1>{t('title')}</h1> }

import { getTranslations } from 'next-intl/server'
async function About() { const t = await getTranslations('about'); return <h1>{t('title')}</h1> }
// ❌ useTranslations in Server Component → hook error
```

```json
// ✅ messages/en.json — identical keys in ALL locale files
{ "common": { "nav": { "home": "Home", "about": "About" } },
  "home": { "title": "Welcome", "cta": "Get started" } }
```
ASCII quotes `"` only (typographic `""` → JSON parse error). Identical keys across all locales.

## 5 — SEO: hreflang

```tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('home')
  return { title: t('title'), alternates: { languages: Object.fromEntries(
    locales.map(l => [l, `/${l}`])
  )}}
}
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No `i18n/request.ts` | v4 required — `getRequestConfig` with `requestLocale` |
| `localePrefix: 'always'` (string) | v4: object `{ mode: 'always' }` |
| `params: { locale }` without await | v4: Promise — always `await params` |
| No `NextIntlClientProvider` | Wrap layout children — client needs it |
| Typographic quotes `""` in JSON | ASCII `"` only — breaks JSON.parse |
| No `setRequestLocale()` | Required for static rendering |
