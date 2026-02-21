// Brudi Reference: next-intl v4 Config Template
// Copy and adapt for your project

// === src/i18n/config.ts ===
export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const localeNames: Record<Locale, string> = { en: 'English', de: 'Deutsch' }

// === src/i18n/request.ts ===
// import { getRequestConfig } from 'next-intl/server'
// import { locales, defaultLocale } from './config'
// export default getRequestConfig(async ({ requestLocale }) => {
//   let locale = await requestLocale
//   if (!locale || !locales.includes(locale as any)) locale = defaultLocale
//   return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
// })

// === next.config.mjs ===
// import createNextIntlPlugin from 'next-intl/plugin'
// export default createNextIntlPlugin('./src/i18n/request.ts')({ /* config */ })

// === middleware.ts ===
// import createMiddleware from 'next-intl/middleware'
// import { locales, defaultLocale } from '@/i18n/config'
// export default createMiddleware({
//   locales, defaultLocale,
//   localePrefix: { mode: 'always' }  // v4: object, NOT string
// })
