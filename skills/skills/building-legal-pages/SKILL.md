---
name: building-legal-pages
description: Use when building any website for a German or EU client. Covers Impressum (§5 DDG), Datenschutzerklärung (DSGVO Art. 13), Cookie rules, and copyright footer. Always create these pages — missing them creates legal risk.
---

# Building Legal Pages

## The Rule

**Every German/EU commercial website needs Impressum + Datenschutz. Build both pages immediately — never wait for client data. Use a visible `<Placeholder>` component for missing data so the client sees exactly what needs replacing.**

---

## 1 — Always Create These Pages (Without Being Asked)

```
app/[locale]/
├── impressum/page.tsx      ← Always. Full structure, placeholders for real data.
└── datenschutz/page.tsx    ← Always. Full structure, note to use generator.
```

Footer must link both:
```tsx
<Link href="/impressum">Impressum</Link>
<Link href="/datenschutz">Datenschutz</Link>
```

---

## 2 — The Placeholder Component

```tsx
// ✅ components/ui/placeholder.tsx — visible marker for missing data
export function Placeholder({ label }: { label: string }) {
  if (process.env.NODE_ENV === 'production') return <span>[{label}]</span>
  return (
    <span className="inline-block bg-yellow-200 dark:bg-yellow-900 text-yellow-900
      dark:text-yellow-200 px-2 py-0.5 rounded text-sm font-mono">
      ⚠️ {label}
    </span>
  )
}
// ❌ WRONG: HTML comments <!-- placeholder --> — invisible to user, causes confusion
// ❌ WRONG: empty page with no content — user thinks page is broken
```

---

## 3 — Impressum (§ 5 DDG)

```tsx
// ✅ app/[locale]/impressum/page.tsx — full structure with placeholders
import { Placeholder } from '@/components/ui/placeholder'
export default function ImpressumPage() {
  return (
    <main className="px-6 md:px-12 py-32 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-12">Impressum</h1>
      <section className="mb-8">
        <h2 className="label-caps mb-4">Angaben gemäß § 5 DDG</h2>
        <p><Placeholder label="Firmenname" /><br />
           <Placeholder label="Straße Hausnummer" /><br />
           <Placeholder label="PLZ Ort" /></p>
      </section>
      <section className="mb-8">
        <h2 className="label-caps mb-4">Kontakt</h2>
        <p>Telefon: <Placeholder label="+49 XXX XXXXXXX" /><br />
           E-Mail: <Placeholder label="email@example.de" /></p>
      </section>
      <section className="mb-8">
        <h2 className="label-caps mb-4">Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
           <Placeholder label="DE123456789" /></p>
      </section>
      {/* GmbH/AG only: Registergericht, HRB-Nummer, Geschäftsführer */}
    </main>
  )
}
```

**Required fields (no exceptions):** Full name/company, physical address (no P.O. box), email, phone. For GmbH/AG: register court, HRB number, managing director. Label must be "Impressum" — not "About" or "Info".

---

## 4 — Datenschutzerklärung (DSGVO Art. 13)

> 💡 Asset: `~/.brudi/assets/legal/legal.{lang}.json`

**Required sections:** Verantwortlicher, Zweck + Rechtsgrundlage, Empfänger, Speicherdauer, Betroffenenrechte (Auskunft, Löschung, Portabilität), Beschwerderecht.

Build page with same pattern: full section structure, `<Placeholder>` for provider-specific text. Add note at top: *"Endgültigen Text über datenschutz-generator.de erstellen."*

Sections to include: Hosting, Kontaktformular, Schriftarten, Bilder/CDN, Cookies, Betroffenenrechte.

---

## 5 — Cookie Banner + Footer

**No banner needed** if: self-hosted fonts + images, no analytics, no YouTube.
**Banner required** if: external Google Fonts, Unsplash CDN, analytics, embeds.
If needed: "Accept All" + "Reject All" visually equal, no tracking before consent.

```tsx
// ✅ Copyright footer with dynamic year
const start = 2024; const now = new Date().getFullYear()
<p>© {start === now ? now : `${start}–${now}`} Studio Name. Alle Rechte vorbehalten.</p>
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No Impressum at all | Always create — even with placeholders |
| Invisible placeholders (HTML comments) | Use `<Placeholder>` component — must be visible |
| Empty legal pages | Full section structure, placeholders for data |
| Impressum labeled "About" | Must be labeled "Impressum" exactly |
| External fonts without consent | Self-host via local .woff2 files |
| Only "Accept" on cookie banner | "Reject All" required, visually equal |
| Legal pages only in one language | Create in all supported locales |
