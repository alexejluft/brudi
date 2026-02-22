# Pressure Test: crafting-typography

Evidenz-Basis: Smashing Magazine, web.dev font best practices,
CSS-Tricks letter-spacing guide, Kevin Powell, DigitalOcean line-height.

---

## Scenario 1: Heading-Hierarchie auf einer Landing Page

**Prompt:**
"Style die Headings und den Body-Text für eine Landing Page. Soll premium wirken."

**Expected WITHOUT skill:**
```css
h1 { font-size: 48px; font-weight: 600; }
h2 { font-size: 36px; font-weight: 600; }
h3 { font-size: 24px; font-weight: 600; }
body { font-size: 16px; line-height: 1.5; }
```
- Feste px-Werte — bricht auf Mobile
- Alle Headings gleiche font-weight
- Kein letter-spacing bei großen Headlines
- H1 ist nur 3× Body — zu wenig Kontrast

**Expected WITH skill:**
```css
h1 {
  font-size: clamp(2.5rem, 2rem + 3vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
body {
  font-size: clamp(1rem, 0.875rem + 0.5vw, 1.125rem);
  line-height: 1.6;
}
```
- Fluid scaling mit clamp()
- Negativer letter-spacing bei großen Headlines
- Unterschiedliche line-heights je Kontext

---

## Scenario 2: Variable Font einbinden

**Prompt:**
"Binde Inter als Variable Font ein. Performance ist wichtig."

**Expected WITHOUT skill:**
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-weight: 100 900;
}
```
- Kein `font-display`
- Kein Preload
- Kein `font-optical-sizing`
- Kein size-adjusted Fallback → CLS beim Laden

**Expected WITH skill:**
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  font-optical-sizing: auto;
}
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
}
body { font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif; }
```

---

## Scenario 3: All-Caps Label und große Display-Headline

**Prompt:**
"Baue einen Hero mit einer großen Headline und einem All-Caps Kategorie-Label darüber."

**Expected WITHOUT skill:**
```css
.label { text-transform: uppercase; font-size: 14px; }
.headline { font-size: 64px; }
/* Kein letter-spacing adjustment */
```
- All-caps ohne Tracking = zu eng, schwer lesbar
- Große Headline ohne negativen letter-spacing = wirkt "gestaucht"
- Kein Gewichtsunterschied zwischen Label und Headline

**Expected WITH skill:**
```css
.label {
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.08em; /* All-caps braucht positives Tracking */
  font-weight: 500;
}
.headline {
  font-size: clamp(3rem, 2rem + 4vw, 5rem);
  letter-spacing: -0.03em; /* Große Headlines brauchen negatives Tracking */
  font-weight: 700;
  line-height: 1.05;
}
```

---

## Scenario 4: "Der Text ist schwer zu lesen"

**Prompt:**
"Der Body-Text auf meiner Seite ist irgendwie anstrengend zu lesen. Was ist falsch?"

**Expected WITHOUT skill:**
- Schaut nach font-size (ist 16px, "korrekt")
- Schlägt andere Schrift vor
- Vermutet Kontrast-Problem
- Findet das eigentliche Problem nicht

**Expected WITH skill:**
Prüft systematisch:
1. `line-height` — ist es unter 1.5? → WCAG Minimum
2. `max-width` des Textblocks — über 75ch? → zu lange Zeilen
3. `letter-spacing` — zu eng für body text?
4. Kontrast-Ratio — unter 4.5:1?

Findet z.B.: `line-height: 1.3` auf 18px Body-Text = Fehler
Fix: `line-height: 1.65`, `max-width: 65ch`

---

## Test Results

**Scenario 1 (Hierarchie):**
- ❌ Feste px → bricht auf Mobile
- ❌ Kein negativer letter-spacing bei Headings
- ❌ Zu wenig Kontrast zwischen Levels

**Scenario 2 (Variable Font):**
- ❌ Kein font-display → FOIT auf langsamen Verbindungen
- ❌ Kein Preload → späte Font-Entdeckung
- ❌ Kein size-adjusted Fallback → CLS

**Scenario 3 (All-Caps):**
- ❌ All-caps ohne Tracking = schlecht lesbar
- ❌ Große Headline ohne negatives Tracking = "gestaucht"
- ❌ Kein Verständnis von optischen Korrekturen

**Scenario 4 (Lesbarkeit):**
- ❌ Kein systematischer Diagnose-Ansatz
- ❌ Verpasst line-height als häufigste Ursache
- ❌ Kein Wissen über max-width/ch-Einheit
