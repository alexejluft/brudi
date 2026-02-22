# Pressure Test: creating-visual-depth

Evidenz-Basis: Josh Comeau "Designing Beautiful Shadows in CSS", CSS-Tricks "Grainy Gradients",
Material Design Elevation Docs, Salt Design System Z-Index, Glassmorphism Implementation Guide.

---

## Scenario 1: Card Shadow

**Prompt:**
"Füge einer Karte einen Schatten hinzu damit sie sich vom Hintergrund abhebt."

**Expected WITHOUT skill:**
```css
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```
- Eine einzige Schicht — sieht flach und generisch aus
- Pure Black desaturiert die Farbe des Hintergrunds
- Jede KI-generierte Karte sieht identisch aus

**Expected WITH skill:**
```css
.card {
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.075),
    0 2px 2px rgba(0, 0, 0, 0.075),
    0 4px 4px rgba(0, 0, 0, 0.075),
    0 8px 8px rgba(0, 0, 0, 0.075),
    0 16px 16px rgba(0, 0, 0, 0.075);
}

/* Auf farbigem Hintergrund: Schatten-Farbe vom Hintergrund ableiten */
.card-on-blue {
  box-shadow:
    0 1px 1px rgba(37, 99, 235, 0.1),
    0 4px 8px rgba(37, 99, 235, 0.15),
    0 8px 16px rgba(37, 99, 235, 0.1);
}
```
- Layered shadows simulieren echte Lichtbrechung
- Jede Schicht verdoppelt den Blur-Radius und den Offset
- Jeder Schicht gleiche niedrige Opacity — zusammen entsteht Tiefe

---

## Scenario 2: Glassmorphism Card

**Prompt:**
"Baue eine Glass-Card mit Blur-Effekt für ein Dashboard."

**Expected WITHOUT skill:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
/* Auf allen Elementen auf der Page angewendet */
```
- `blur(20px)` auf vielen Elementen → GPU-Überlastung, Scrolling-Jank
- Kein Fallback für Mobile → Battery Drain, 60fps brechen
- Kein Kontrast-Check → Text auf Glass unlesbar (WCAG Violation)

**Expected WITH skill:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);         /* max 12px — über 16px zu teuer */
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  /* Solid Fallback wenn backdrop-filter nicht supported */
}

/* Mobile: reduzierter Blur */
@media (prefers-reduced-motion: reduce), (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.15); /* mehr Opacity wenn weniger Blur */
  }
}
```
- Max 2–3 Glass-Elemente pro Viewport — nie mehr
- `blur(12px)` = Sweetspot — sichtbar, aber GPU-vertretbar
- Mobile Fallback immer — battery drain ist real

---

## Scenario 3: Gradient Hintergrund

**Prompt:**
"Baue einen modernen Gradient-Hintergrund für eine Hero-Section."

**Expected WITHOUT skill:**
```css
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```
- Smooth gradient → Banding bei großen Flächen sichtbar
- Kein Grain/Noise → wirkt digital und flach
- Identisch mit tausenden anderen AI-generierten Backgrounds

**Expected WITH skill:**
```css
.hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* SVG Noise Layer über dem Gradient */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.35;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```
- SVG `feTurbulence` erzeugt Grain ohne externe Assets
- `mix-blend-mode: overlay` macht Noise subtil aber spürbar
- Verhindert Banding, erzeugt taktile organische Tiefe

---

## Scenario 4: Z-Index System

**Prompt:**
"Stell sicher dass das Modal über dem Dropdown liegt und beides über dem Header."

**Expected WITHOUT skill:**
```css
.header   { z-index: 100; }
.dropdown { z-index: 999; }
.modal    { z-index: 9999; }
.toast    { z-index: 99999; }
```
- Arbitrary Numbers — keine Logik, kein System
- Nächster Entwickler fügt `z-index: 999999` hinzu
- Konflikte zwischen Komponenten nicht vorhersagbar

**Expected WITH skill:**
```css
:root {
  --z-base:     0;
  --z-raised:   10;    /* Cards, floating elements */
  --z-dropdown: 100;   /* Dropdowns, tooltips */
  --z-sticky:   200;   /* Sticky headers */
  --z-overlay:  300;   /* Modals, dialogs */
  --z-toast:    400;   /* Notifications — always on top */
}

.header   { z-index: var(--z-sticky); }
.dropdown { z-index: var(--z-dropdown); }
.modal    { z-index: var(--z-overlay); }
.toast    { z-index: var(--z-toast); }
```
- Token-basiertes System — semantische Namen, keine Magic Numbers
- Neue Entwickler verstehen sofort die Hierarchy
- Belegt durch Material Design, Radix UI, Salt Design System

---

## Test Results

**Scenario 1:** ❌ Single-layer shadow — flach, generisch, identisch mit allen anderen KI-Outputs
**Scenario 2:** ❌ `blur(20px)` ohne Limits — GPU-Überlastung, kein Mobile Fallback
**Scenario 3:** ❌ Smooth gradient ohne Grain — Banding sichtbar, kein Designer war dabei
**Scenario 4:** ❌ `z-index: 9999` — kein System, Konflikte unvermeidbar
