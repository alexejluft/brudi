---
name: implementing-i18n
description: Use when building multilingual Next.js applications with next-intl. Prevents hardcoded strings, broken locale routing, and missing SEO for international audiences.
---

# Implementing i18n

## The Rule

**next-intl for App Router. Middleware detects locale. `useTranslations` in Client, `getTranslations` in Server Components. Same keys in every locale file.**

---

## Middleware: Locale Detection

```tsx
// ✅ Correct: middleware.ts
import createMiddleware from 'next-intl/middleware'
export default createMiddleware({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always'
})
export const config = { matcher: ['/((?!_next|api).*)'] }

// ❌ WRONG: No middleware → locale detection fails, all users see defaultLocale
```

---

## Message Files

```json
// ✅ messages/en.json — identical keys across all locales
{ "homepage": { "title": "Welcome", "cta": "Get started" },
  "common": { "nav": { "home": "Home", "about": "About" } } }

// ✅ messages/de.json
{ "homepage": { "title": "Willkommen", "cta": "Loslegen" },
  "common": { "nav": { "home": "Start", "about": "Über uns" } } }

// ❌ WRONG: en.json has "title" but de.json has "heading" → runtime error
```

---

## Translations: Client vs Server

```tsx
// ✅ Client Component: useTranslations hook
'use client'
import { useTranslations } from 'next-intl'
export default function Hero() {
  const t = useTranslations('homepage')
  return <h1>{t('title')}</h1>
}

// ✅ Server Component: getTranslations (async)
import { getTranslations } from 'next-intl/server'
export default async function About() {
  const t = await getTranslations('about')
  return <h1>{t('title')}</h1>
}
// ❌ WRONG: useTranslations in Server Components, or hardcoded strings
```

---

## Dynamic Locale Layout

```tsx
// ✅ app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
const locales = ['en', 'de', 'fr']
const rtlLocales = ['ar', 'he']

export default function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'
  return <html lang={locale} dir={dir}><body>{children}</body></html>
}

// ❌ WRONG: No notFound() check → invalid locales render without error
```

---

## Formatting + SEO

```tsx
// ✅ Use Intl API — never manual formatting
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(29.99) // "29,99 €"
new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date())
// ❌ WRONG: `${amount.toFixed(2)}€` — ignores locale rules

// ✅ hreflang in generateMetadata
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations('homepage')
  return { title: t('title'), alternates: { languages: { en: '/en', de: '/de', 'x-default': '/en' } } }
}
// ❌ WRONG: No hreflang → duplicate content penalty
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Hardcoded strings | `useTranslations()` / `getTranslations()` for all text |
| No middleware | `createMiddleware()` with locales + matcher |
| `useTranslations` in Server Component | Use `getTranslations()` (async) server-side |
| Inconsistent keys across locales | Maintain identical structure in all JSON files |
| No hreflang tags | `alternates.languages` in `generateMetadata` |
| Manual date/currency formatting | Use `Intl.NumberFormat` / `Intl.DateTimeFormat` |
| No RTL support | Set `dir="rtl"` on `<html>` for RTL locales |
