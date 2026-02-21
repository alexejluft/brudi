---
name: building-legal-pages
description: Use when building any website for a German or EU client. Covers mandatory legal requirements: Impressum (§5 DDG), Datenschutzerklärung (DSGVO Art. 13), Cookie-Banner rules, and copyright footer. Missing these creates legal risk (Abmahnungen, fines up to €20M).
---

# Building Legal Pages

## Who Needs This

Every website operated commercially in Germany. "Commercial" includes:
- Any business website
- Freelancer / agency portfolios
- Blogs with a single ad or affiliate link
- SaaS products

**~90% of German websites require an Impressum.** When in doubt: add it.

---

## 1. Impressum (§ 5 DDG)

**Law:** Digitale-Dienste-Gesetz § 5 DDG (replaced TMG in May 2024).

**Required fields — no exceptions:**

```
- Full name or company name
- Physical address (no P.O. box)
- Email address
- Phone number
- VAT ID (Umsatzsteuer-ID), if applicable
- For GmbH/AG: legal form, register court, registration number, authorized representative
```

**Placement rules:**
- Labeled exactly "Impressum" (not "About" or "Info")
- Accessible from every page within 2 clicks (Two-Click Rule)
- Typically linked in the footer

**Consequence if missing:** Abmahnung (cease-and-desist) from competitors or lawyers — costs €1,000–€5,000 per incident. Fine up to €50,000.

**Astro implementation:**

```astro
---
// src/pages/impressum.astro
import Layout from '../layouts/Layout.astro'
---
<Layout title="Impressum">
  <main class="px-6 md:px-12 py-32 md:py-40 max-w-2xl mx-auto">
    <h1 class="mb-12">Impressum</h1>

    <section class="mb-8">
      <h2 class="text-sm font-medium uppercase tracking-widest text-text-subtle mb-4">
        Angaben gemäß § 5 DDG
      </h2>
      <p>
        [Vollständiger Name]<br />
        [Straße Hausnummer]<br />
        [PLZ Ort]
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-sm font-medium uppercase tracking-widest text-text-subtle mb-4">
        Kontakt
      </h2>
      <p>
        Telefon: [+49 ...]<br />
        E-Mail: [email@example.de]
      </p>
    </section>

    <!-- Only if VAT registered -->
    <section class="mb-8">
      <h2 class="text-sm font-medium uppercase tracking-widest text-text-subtle mb-4">
        Umsatzsteuer-ID
      </h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
        DE[123456789]
      </p>
    </section>

    <!-- Only for GmbH / AG -->
    <section class="mb-8">
      <h2 class="text-sm font-medium uppercase tracking-widest text-text-subtle mb-4">
        Registereintrag
      </h2>
      <p>
        Registergericht: Amtsgericht [Stadt]<br />
        Registernummer: HRB [12345]<br />
        Geschäftsführer: [Name]
      </p>
    </section>
  </main>
</Layout>
```

---

## 2. Datenschutzerklärung (DSGVO Art. 13)

**Law:** DSGVO (GDPR) Art. 13 — required whenever data is collected from users.

**Required sections:**

```
1. Name and address of the responsible party (Verantwortlicher)
2. Purpose and legal basis of data processing
3. Recipients of data (third-party services)
4. Storage duration
5. User rights (access, deletion, portability, withdrawal)
6. Right to complain to supervisory authority
```

**Use a generator — do not write from scratch:**
- **datenschutz-generator.de** (Dr. Thomas Schwenke) — lawyer-reviewed, used on 500,000+ sites
- **e-recht24.de** — free, regularly updated

**What to mention for the standard stack:**

### Vercel Hosting

```
Diese Website wird gehostet bei Vercel Inc., 340 S Lemon Ave #4133,
Walnut, CA 91789, USA. Vercel verarbeitet Daten auch in den USA.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
Mit Vercel wurde ein Auftragsverarbeitungsvertrag abgeschlossen.
Die Datenübertragung erfolgt auf Grundlage von Standardvertragsklauseln (SCC).
Datenschutzerklärung: https://vercel.com/legal/privacy-policy
```

### Fonts — Self-hosted (Fontsource)

```
Diese Website verwendet lokal eingebundene Schriftarten über Fontsource.
Es erfolgt keine Verbindung zu externen Font-Servern. Keine Datenübertragung an Dritte.
```

### Google Fonts — External (avoid if possible)

**Problem:** External Google Fonts transmit user IP addresses to Google before consent.
**Solution:** Self-host via Fontsource (`@fontsource-variable/[font-name]`). Then no mention needed.

If you must use external Google Fonts, you need opt-in consent first.

### Unsplash — Hotlinked

```
Diese Website bindet Bilder über die Unsplash-CDN ein (images.unsplash.com).
Dabei wird Ihre IP-Adresse an Server von Unsplash übertragen.
Anbieter: Unsplash Inc. Datenschutzerklärung: https://unsplash.com/privacy
```

**Better:** Download Unsplash images and self-host. Then no mention needed.

### Contact Form

```
Wenn Sie uns per Kontaktformular kontaktieren, werden Ihre Angaben zur
Bearbeitung der Anfrage gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
(Vertragserfüllung) oder lit. f DSGVO (berechtigtes Interesse).
Daten werden nicht an Dritte weitergegeben.
```

---

## 3. Cookie Banner

**Law:** TTDSG + DSGVO. Opt-in required for all non-essential data transfers.

**When you need a consent banner:**

| Technology | Consent Required? |
|------------|------------------|
| Self-hosted fonts (Fontsource) | ❌ No |
| Google Fonts — external | ✅ Yes (transmits IP) |
| Unsplash — hotlinked | ✅ Yes (transmits IP) |
| Unsplash — self-hosted | ❌ No |
| Google Analytics / GA4 | ✅ Yes |
| Contact form (no tracking) | ❌ No |
| YouTube embed | ✅ Yes |
| Session-only cookies (no tracking) | ❌ No |

**When you need NO banner (clean setup):**
- Self-hosted fonts (Fontsource)
- Self-hosted images
- No analytics
- Contact form without third-party processor

**Most award-level sites avoid analytics by default — clean setup, no banner needed.**

**If a banner is required — legal requirements:**

```
1. "Accept All" AND "Reject All" on the first layer — visually equal
2. No dark patterns (no green Accept + grey Reject)
3. No tracking before consent is given
4. Consent must be freely given — no cookie walls
5. Easy to withdraw consent (link in footer)
```

**Recommended tools:** Cookiebot, Usercentrics, or consentmanager.net

---

## 4. Copyright Footer

```astro
---
// In your Footer component
const currentYear = new Date().getFullYear()
const startYear = 2024
---

<footer>
  <p class="text-text-subtle text-sm">
    © {startYear === currentYear ? currentYear : `${startYear}–${currentYear}`} [Studio Name].
    Alle Rechte vorbehalten.
  </p>
  <nav aria-label="Legal links">
    <a href="/impressum">Impressum</a>
    <a href="/datenschutz">Datenschutz</a>
    <!-- Only if consent banner is active: -->
    <!-- <button id="open-cookie-settings">Cookie-Einstellungen</button> -->
  </nav>
</footer>
```

**Unsplash attribution:**
- Downloaded + self-hosted → no attribution required
- Hotlinked via API → attribution required: "Photo by [Name] on Unsplash"

---

## 5. What the Agent Always Generates

For every German/EU website — without being asked — create:

```
src/pages/
├── impressum.astro          ← Always. Placeholder content, client fills details.
└── datenschutz.astro        ← Always. Note: "Replace with generator output."
```

**Never ship a German website without these two pages.**

Add to footer automatically:
```html
<a href="/impressum">Impressum</a>
<a href="/datenschutz">Datenschutz</a>
```

**Note to client in Impressum placeholder:**
```
<!-- ⚠️ PLACEHOLDER — Replace all [brackets] with real data before going live.
     For Datenschutzerklärung: use datenschutz-generator.de or e-recht24.de
     with your specific services listed. -->
```

---

## Common Mistakes

| Mistake | Risk | Fix |
|---------|------|-----|
| No Impressum | Abmahnung, fine up to €50,000 | Always generate placeholder |
| Impressum labeled "About" | Not legally compliant | Must be labeled "Impressum" |
| External Google Fonts without consent | DSGVO violation | Self-host via Fontsource |
| Only "Accept" button on cookie banner | DSGVO violation | Equal "Reject" button required |
| Hotlinking Unsplash without mention | Minor DSGVO risk | Self-host or mention in privacy policy |
| No link to Datenschutz in footer | Legal requirement | Always in footer |
