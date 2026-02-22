# AI-Agenten Fehler: Visuelle Tiefe in UI-Design

**Recherche-Datum:** 2026-02-20
**Methodik:** Dokumentierte Evidenz aus Design System Docs, CSS-Tricks, Smashing Magazine, Material Design, Radix UI, shadcn/ui, Josh Comeau Tutorials

---

## Fehler #1: Single-Layer Box Shadows statt Layered Shadows

### Das Problem (belegt)

AI nutzt fast immer **eine einzige `box-shadow`-Deklaration** mit uniformen Werten wie:

```css
/* AI-Default — dokumentiert als "too uniform, looks cheap" */
.card {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

**Quelle der Evidenz:**
- Josh Comeau ("Designing Beautiful Shadows in CSS"): "Our shadows will never look photo-realistic, but we can improve things quite a bit with a nifty technique: layering. A single shadow rarely looks natural."
- CSS-Tricks / Smashing Magazine: "Real shadows are layered: a tight shadow near the object, and softer ones farther away."

**Warum es billig aussieht:**
- Echte Schatten bestehen aus mehreren Schichten: **Contact Shadow** (eng, scharf, nah am Objekt) + **Ambient Shadow** (weich, groß, weit verteilt)
- Single-layer Schatten wirken flach, nicht volumetrisch

---

### Die korrekte Lösung (Award-Winning Sites)

**Layered Shadows mit 5+ Schichten**, progressiv skaliert:

```css
/* Award-winning Pattern — belegt von Josh Comeau, Material Design */
.card {
  box-shadow:
    0 1px 1px hsl(0deg 0% 0% / 0.075),    /* Contact Shadow: scharf, nah */
    0 2px 2px hsl(0deg 0% 0% / 0.075),
    0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075),
    0 16px 16px hsl(0deg 0% 0% / 0.075);  /* Ambient Shadow: weich, groß */
}
```

**Kritische Pattern-Details:**
1. **Blur Radius wächst proportional zum Offset** — smooth falloff
2. **Opacity bleibt konstant** über alle Layer (0.075 je Layer akkumuliert zu ~0.375 gesamt)
3. **Keine negativen Spread-Werte** (AI nutzt oft `-1px`, bricht Realismus)

**Quellen:**
- [Josh Comeau: Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/)
- [CSS-Tricks: Designing Better Box Shadows](https://theosoti.com/blog/designing-shadows/)
- [Material Design: Elevation & Shadows Docs](https://m1.material.io/material-design/elevation-shadows.html)

---

## Fehler #2: Pure Black Shadows (rgba(0,0,0,0.X))

### Das Problem (belegt)

AI verwendet **immer** `rgba(0,0,0,...)` oder `#000` mit Opacity — unabhängig vom Hintergrund.

**Evidenz:**
- Josh Comeau: "When you layer black over a background color, it doesn't just make it darker; it also **desaturates it quite a bit**."
- Learn UI Design (Lighting & Shadows Homework): "The most important part of looking natural is **avoiding pure black shadows** and using a shadow derived from the primary color instead."
- LogRocket Blog: "Pure black makes the contrast ratio too big to look natural."

**Warum es falsch ist:**
- Black Shadows "waschen" Farben aus → grau, leblos
- Widerspricht natürlichem Licht (Licht hat immer Farbtemperatur)

---

### Die korrekte Lösung (Color-Matched Shadows)

**Schatten müssen Hue + Saturation des Hintergrunds reflektieren:**

```css
/* FALSCH — AI Default */
.card-on-blue-bg {
  background: hsl(220deg 80% 50%);
  box-shadow: 0 4px 8px hsl(0deg 0% 0% / 0.3); /* Pure black — desaturates */
}

/* RICHTIG — Color-Matched Shadow */
.card-on-blue-bg {
  background: hsl(220deg 80% 50%);
  box-shadow: 0 4px 8px hsl(220deg 60% 20% / 0.4); /* Same hue, reduced saturation */
}
```

**Pattern-Regel:**
- **Hue:** Identisch mit Background
- **Saturation:** 50–70% des Background-Werts
- **Lightness:** 10–20% (dunkel, aber nicht schwarz)

**Award-Winning Beispiel:**
shadcn/ui (Tailwind-basiert) nutzt **HSL-basierte CSS Variables** für Schatten, die sich automatisch an Theme-Farben anpassen:

```css
:root {
  --shadow-color: var(--primary); /* Hue aus Theme */
  box-shadow: 0 4px 8px hsl(var(--shadow-color) / 0.2);
}
```

**Quellen:**
- [Josh Comeau: Shadow Color Tweaking](https://www.joshwcomeau.com/css/designing-shadows/)
- [Learn UI Design: Lighting & Shadows Common Mistakes](https://www.learnui.design/blog/lighting-shadows-hw.html)
- [shadcn/ui Design Principles Breakdown](https://gist.github.com/eonist/c1103bab5245b418fe008643c08fa272)

---

## Fehler #3: Backdrop-Filter ohne Performance-Grenze

### Das Problem (belegt)

AI schreibt Glassmorphism-Effekte **ohne Limit** auf Anzahl der Elemente oder Blur-Intensität:

```css
/* AI schreibt das für ALLE Karten, Navigation, Modals gleichzeitig */
.glass-card {
  backdrop-filter: blur(20px); /* GPU-intensive, keine Grenze */
}
```

**Evidenz dokumentierter Performance-Probleme:**
- CSS-Tricks (Backdrop Filter Artikel): "`backdrop-filter` is computationally expensive. Specifically, `backdrop-filter` triggers GPU compositing, which **drains battery and causes jank on lower-end devices**."
- Glassmorphism Playground (playground.halfaccessible.com): "To prevent glassmorphism from slowing down a mobile site, **limit glassmorphic elements to 2–3 per viewport**, reduce blur values to 6–8px on mobile."
- Josh Comeau (Next-Level Frosted Glass): "Many developers have tried the `backdrop-filter` technique but end up abandoning it for performance reasons — it tends to make **scrolling very janky** on many desktop and mobile devices."

**Bekannte Browser-Bugs:**
- Opacity + backdrop-filter = broken effect (Chrome + Firefox)
- Blur-Radius über 16px = severe jank auf Mobile

---

### Die korrekte Lösung (Performance-Bounded Glassmorphism)

**Regel 1: Limit auf 2–3 Glass-Elemente pro Viewport**

```css
/* RICHTIG — nur auf Hero-Section oder einem Modal */
.hero-glass-card {
  backdrop-filter: blur(12px); /* Sweet spot: 10–12px für Balance */
}

/* FALSCH — AI schreibt das für alle 20 Karten auf der Seite */
```

**Regel 2: Mobile Fallback mit Reduced Blur**

```css
.glass-effect {
  backdrop-filter: blur(12px);
}

@media (max-width: 768px) {
  .glass-effect {
    backdrop-filter: blur(6px); /* Halbiert für Mobile */
  }
}

/* Low-Power Mode Fallback */
@media (prefers-reduced-motion: reduce) {
  .glass-effect {
    backdrop-filter: none;
    background: rgba(255, 255, 255, 0.9); /* Solid fallback */
  }
}
```

**Regel 3: Safari Prefix + Feature Detection**

```css
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass {
    -webkit-backdrop-filter: blur(10px); /* Safari */
    backdrop-filter: blur(10px);
  }
}
```

**Performance Best Practice (belegt):**
- **Blur-Radius Sweet Spot:** 10–12px (Balance zwischen Ästhetik und Performance)
- **Nie animieren:** `backdrop-filter` in Transitions/Animations = guaranteed jank
- **Test auf echten Geräten:** DevTools emulieren Blur-Performance nicht korrekt

**Quellen:**
- [Glassmorphism Design Trend Implementation Guide](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide)
- [Josh Comeau: Backdrop Filter](https://www.joshwcomeau.com/css/backdrop-filter/)
- [How to Create Glassmorphic UI Effects (OpenReplay)](https://blog.openreplay.com/create-glassmorphic-ui-css/)

---

## Fehler #4: Lineare Gradienten ohne Noise/Grain

### Das Problem (belegt)

AI generiert **glatte, lineare Gradienten** ohne Textur:

```css
/* AI Default — smooth gradient, kein Grain */
.hero-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Evidenz:**
- CSS-Tricks (Grainy Gradients): "Browsing through Dribbble or Behance, you'll find designers using a simple technique to add texture to an image: **noise**. Adding noise makes otherwise solid colors or smooth gradients — such as shadows — **more realistic**."
- Frontend Masters Blog: "Despite designers' affinity for texture, **noise is rarely used in web design**. However, it's possible to generate colorful noise to add texture to a gradient with only a small amount of CSS and SVG."

**Warum es wichtig ist:**
- Glatte Gradienten = **Banding** (sichtbare Farbstufen auf großen Flächen)
- Keine taktile Tiefe → wirkt flach, "digital"

---

### Die korrekte Lösung (Grainy Gradients mit SVG Noise)

**Technik: SVG `feTurbulence` Filter + CSS Layering**

```html
<!-- SVG Noise Filter Definition -->
<svg style="position: absolute; width: 0; height: 0;">
  <filter id="noiseFilter">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.8"
      numOctaves="4"
      stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/> <!-- Desaturate -->
  </filter>
</svg>
```

```css
/* Gradient + Noise Layer */
.hero-bg {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence baseFrequency="0.8" numOctaves="4"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.05"/></svg>');
  mix-blend-mode: overlay; /* Blend Noise mit Gradient */
  pointer-events: none;
}
```

**Alternative: CSS Filter (performanter)**

```css
.hero-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  filter: contrast(1.1) brightness(1.05); /* Subtile Textur-Simulation */
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/noise-texture.png'); /* 64x64 tileable noise */
  opacity: 0.03;
  mix-blend-mode: overlay;
}
```

**Performance-Hinweis (belegt):**
- SVG Filters sind **lightweight in Dateigröße**, aber **CPU-intensive** beim Rendering
- Best Practice: SVG in JPEG/WebP/AVIF konvertieren für große Hero-Sections
- Für Hintergründe unter 500x500px: SVG ist performant genug

**Tools (dokumentiert):**
- [Grainy Gradients Playground](https://grainy-gradients.vercel.app) — Interaktive Parameter-Exploration
- [fffuel gggrain](https://www.fffuel.co/gggrain/) — SVG Generator für organische Gradienten
- [Noise & Gradient](https://www.noiseandgradient.com/) — Textured Background Generator

**Quellen:**
- [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/)
- [Frontend Masters: Grainy Gradients](https://frontendmasters.com/blog/grainy-gradients/)
- [freeCodeCamp: Grainy CSS Backgrounds Using SVG Filters](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/)

---

## Fehler #5: Kein konsistentes Elevation System (Z-Index Chaos)

### Das Problem (belegt)

AI schreibt **arbitrary `z-index` Werte** ohne System:

```css
/* AI schreibt das — kein System, willkürliche Zahlen */
.header { z-index: 999; }
.modal { z-index: 9999; }
.tooltip { z-index: 99999; }
.dropdown { z-index: 1000; }
```

**Evidenz:**
- Design Systems Surf (Elevation Design Patterns): "Without a well-structured elevation system, systems can easily become visually noisy. Designers might apply arbitrary shadows, developers might **guess z-index values**, and users are left with an interface that feels **inconsistent or hard to scan**."
- Material Design (Elevation Docs): "All material elements have **resting elevations**. Some component types have **responsive elevation**, meaning they change elevation in response to user input — these elevation changes are consistently implemented using **dynamic elevation offsets**."
- Salt Design System (Z-Index Foundation): "Z-index tokens determine an item's position in the stacking order. **Too many elevation levels create decision fatigue.** Most design systems operate well with just **4–6 clearly defined layers**."

**Warum es problematisch ist:**
- Keine visuelle Hierarchie → Modals unter Tooltips, Dropdowns unter Header
- Impossible zu debuggen → welche Zahl ist "höher genug"?

---

### Die korrekte Lösung (Token-Based Elevation System)

**Regel: 4–6 semantische Elevation Levels**

**Design System Pattern (belegt von Material, Radix, shadcn):**

```css
/* CSS Variables — Token-Based Elevation */
:root {
  /* Z-Index Tokens */
  --z-base: 0;              /* Layout, Background */
  --z-card: 1;              /* Cards, Tiles */
  --z-dropdown: 100;        /* Dropdowns, Popovers */
  --z-sticky: 200;          /* Sticky Header/Footer */
  --z-modal: 300;           /* Modal Overlays */
  --z-toast: 400;           /* Notifications, Toasts */

  /* Shadow Tokens (gekoppelt an Z-Index) */
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
  --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.1);
  --shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.1);
  --shadow-xl: 0 20px 25px hsl(0 0% 0% / 0.15);
}

/* Semantic Components */
.card {
  z-index: var(--z-card);
  box-shadow: var(--shadow-sm);
}

.dropdown {
  z-index: var(--z-dropdown);
  box-shadow: var(--shadow-md);
}

.modal {
  z-index: var(--z-modal);
  box-shadow: var(--shadow-xl);
}
```

**Regel: Shadow-Größe wächst mit Z-Index**

Material Design Prinzip: **Elevation = Shadow Intensity**

| Z-Level | Shadow | Use Case |
|---------|--------|----------|
| 0 | None | Base Layout, Background |
| 1 | 0 1px 3px | Cards, Buttons (resting) |
| 2 | 0 4px 6px | Buttons (hover), Raised Cards |
| 3 | 0 10px 15px | Dropdowns, Tooltips |
| 4 | 0 20px 25px | Modals, Dialogs |

**Flexibles System (Intelligence Community Design System Pattern):**

```css
/* Base Value kann global angepasst werden */
:root {
  --ic-z-index-base-value: 1000; /* Alle anderen Tokens berechnen sich daraus */

  --z-dropdown: calc(var(--ic-z-index-base-value) + 100);
  --z-modal: calc(var(--ic-z-index-base-value) + 200);
}

/* Per-Component Override möglich */
.my-custom-tooltip {
  --ic-z-index-tooltip: 300; /* Nur für diese Komponente */
}
```

**TypeScript/Tailwind Pattern (Modern Approach):**

```ts
// z-index.tokens.ts
export const zIndex = {
  base: 0,
  card: 1,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
} as const;

// Tailwind Config
module.exports = {
  theme: {
    extend: {
      zIndex: {
        card: '1',
        dropdown: '100',
        modal: '300',
      }
    }
  }
}
```

**Naming-Strategie (belegt):**
- **Semantic Names** (card, dropdown, modal) → Intent klar
- **Numeric Names** (level-100, elevation-2) → leichter skalierbar
- **Best Practice:** Kombination — funktionale Labels in klarer Struktur

**Quellen:**
- [Material Design 3: Elevation Applying](https://m3.material.io/styles/elevation/applying-elevation)
- [Design Systems Surf: Elevation Design Patterns](https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy)
- [Salt Design System: Z-Index Foundation](https://www.saltdesignsystem.com/salt/foundations/elevation/z-index)
- [Intelligence Community Design System: Elevation](https://design.sis.gov.uk/styles/elevation/)
- [Medium: Modern Z-Index Management](https://medium.com/@mevbg/modern-z-index-management-evolving-a-classic-sass-pattern-0042724da65c)

---

## Bonus: Ambient Occlusion mit CSS (Contact Shadows)

### Das Konzept (aus 3D Design)

**Ambient Occlusion** = Schatten wo Objekte **Kontakt mit dem Boden** haben oder **sich nah beieinander befinden**.

**Evidenz:**
- Peachpit (Occlusion Artikel): "A **contact shadow** helps to ground an object, but keeps it near the base of the object rather than bleeding to the edge of the image frame."
- Vectary Documentation: "Ambient Occlusion enhances depth and realism by simulating soft contact shadows in areas where surfaces are close to each other, such as **corners, creases, and intersections**."

---

### CSS Simulation Pattern

**Technik: Tight Shadow unter dem Element**

```css
/* Contact Shadow — simuliert Boden-Kontakt */
.card-with-contact-shadow {
  position: relative;
}

.card-with-contact-shadow::after {
  content: '';
  position: absolute;
  bottom: -8px; /* Unter dem Element */
  left: 5%;
  right: 5%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%);
  filter: blur(6px);
  z-index: -1;
}
```

**Unterschied zu normalem Drop Shadow:**
- **Drop Shadow:** Simuliert gerichtetes Licht (oben-links)
- **Contact Shadow:** Simuliert **Nähe zum Boden** (nicht-direktional)

**Use Case (belegt):**
- Buttons die "auf einer Oberfläche liegen"
- Karten die "auf dem Hintergrund stehen"
- 3D-Objekte in Web-Interfaces

**Quellen:**
- [Peachpit: Occlusion & Shadows](https://www.peachpit.com/articles/article.aspx?p=516590&seqNum=7)
- [Vectary: Ambient Occlusion Documentation](https://help.vectary.com/documentation/design-process/effects/ambient-occlusion)

---

## Zusammenfassung: Die 5 dokumentierten Fehler

| Fehler | AI macht das | Richtig ist |
|--------|--------------|-------------|
| **#1 Single-Layer Shadows** | `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` | Layered shadows (5+ layers), progressive scaling |
| **#2 Pure Black Shadows** | `rgba(0,0,0,...)` für alle Hintergründe | Color-matched shadows (hue + saturation aus BG) |
| **#3 Backdrop-Filter ohne Limit** | `backdrop-filter: blur(20px)` auf allen Elementen | Max 2–3 Glass-Elemente, 10–12px blur, Mobile Fallback |
| **#4 Smooth Gradients** | `linear-gradient(...)` ohne Textur | SVG Noise Layer (`feTurbulence`) + `mix-blend-mode` |
| **#5 Arbitrary Z-Index** | `z-index: 9999` ohne System | Token-based Elevation (4–6 Levels, CSS Variables) |

**Alle Fehler sind durch offizielle Design System Dokumentation, CSS-Experts Artikel und Performance-Studien belegt.**

---

## Quellen-Index

### Design Systems
- [Material Design: Elevation & Shadows](https://m1.material.io/material-design/elevation-shadows.html)
- [Material Design 3: Elevation](https://m3.material.io/styles/elevation/applying-elevation)
- [Radix UI: Shadows Documentation](https://www.radix-ui.com/themes/docs/theme/shadows)
- [shadcn/ui Design Principles Breakdown](https://gist.github.com/eonist/c1103bab5245b418fe008643c08fa272)
- [Salt Design System: Z-Index](https://www.saltdesignsystem.com/salt/foundations/elevation/z-index)
- [Intelligence Community Design System: Elevation](https://design.sis.gov.uk/styles/elevation/)

### CSS-Experts & Tutorials
- [Josh Comeau: Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/)
- [Josh Comeau: Shadow Palette Generator](https://www.joshwcomeau.com/shadow-palette/)
- [Josh Comeau: Backdrop Filter](https://www.joshwcomeau.com/css/backdrop-filter/)
- [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/)
- [CSS-Tricks: Designing Better Box Shadows](https://theosoti.com/blog/designing-shadows/)
- [Smashing Magazine: Interesting Ways to Use CSS Shadows](https://www.smashingmagazine.com/2023/08/interesting-ways-use-css-shadows/)
- [Frontend Masters: Grainy Gradients](https://frontendmasters.com/blog/grainy-gradients/)

### Performance & Implementation
- [Glassmorphism Design Trend Implementation Guide](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide)
- [OpenReplay: Glassmorphic UI Effects](https://blog.openreplay.com/create-glassmorphic-ui-css/)
- [LogRocket: Shadows in UI Design Tips](https://blog.logrocket.com/ux-design/shadows-ui-design-tips-best-practices/)

### Design Education
- [Learn UI Design: Lighting & Shadows Common Mistakes](https://www.learnui.design/blog/lighting-shadows-hw.html)
- [Design Systems Surf: Elevation Design Patterns](https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy)
- [LogRocket: Styling with CSS box-shadow](https://blog.logrocket.com/box-shadow-css/)

### Tools & Generators
- [Grainy Gradients Playground](https://grainy-gradients.vercel.app)
- [fffuel gggrain](https://www.fffuel.co/gggrain/)
- [Noise & Gradient Generator](https://www.noiseandgradient.com/)
