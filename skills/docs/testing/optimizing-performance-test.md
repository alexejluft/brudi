# Pressure Test: optimizing-performance

---

## Scenario 1: LCP-Bild ohne Optimierung

**Prompt:**
"Die Seite lädt langsam. Das Hero-Bild ist das größte Element. Optimiere es."

**Expected WITHOUT skill:**
```html
<img src="hero.jpg" alt="Hero">
<!-- Kein Format, keine Dimensionen, kein fetchpriority -->
```
- JPEG statt WebP/AVIF (2–3× größer)
- Kein `fetchpriority="high"` → Browser priorisiert falsch
- Keine Dimensionen → CLS beim Laden
- Kein Preload → späte Entdeckung

**Expected WITH skill:**
```html
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">
<img
  src="hero.webp"
  width="1200" height="600"
  fetchpriority="high"
  alt="Hero"
>
```
- WebP Format
- `fetchpriority="high"` für Browser-Priorisierung
- Dimensionen reserviert Platz → kein CLS
- Preload im `<head>` für frühe Entdeckung

---

## Scenario 2: Layout-Properties animieren

**Prompt:**
"Animiere ein Sidebar-Menü das von links einschiebt."

**Expected WITHOUT skill:**
```css
.sidebar {
  transition: left 0.3s ease, width 0.3s ease;
}
.sidebar.open { left: 0; width: 300px; }
```
- `left` und `width` triggern Layout → Browser rechnet gesamtes Layout neu
- Jedes Frame: Recalculate Style + Layout + Paint = Jank

**Expected WITH skill:**
```css
.sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.sidebar.open { transform: translateX(0); }
```
- `transform` = nur Composite-Layer → kein Layout, kein Paint
- 60fps auch auf schwachen Geräten

---

## Scenario 3: INP — schwere Berechnung blockiert Klick

**Prompt:**
"Ein Button berechnet Statistiken und aktualisiert die UI. Er fühlt sich träge an."

**Expected WITHOUT skill:**
```javascript
button.addEventListener('click', () => {
  const stats = calculateAllStats(largeDataset) // 500ms Berechnung
  updateDisplay(stats) // User wartet 500ms auf sichtbare Reaktion
})
```
- INP: 500ms → "Poor" (Ziel: < 200ms)
- UI friert ein während Berechnung läuft

**Expected WITH skill:**
```javascript
button.addEventListener('click', () => {
  updateDisplay({ loading: true }) // sofortiges visuelles Feedback
  setTimeout(() => {
    const stats = calculateAllStats(largeDataset)
    updateDisplay(stats)
  }, 0) // defer — Browser kann erst rendern
})
```
- INP: ~16ms (sofortiges Feedback)
- Berechnung passiert nach dem ersten Paint

---

## Scenario 4: Schwere Dependency unnötig importiert

**Prompt:**
"Formatiere ein Datum für die Anzeige."

**Expected WITHOUT skill:**
```javascript
import moment from 'moment'
const formatted = moment(date).format('DD.MM.YYYY')
// moment.js: 300KB → in Bundle
```

**Expected WITH skill:**
```javascript
// Option 1: date-fns (tree-shakeable, nur was genutzt wird)
import { format } from 'date-fns'
const formatted = format(new Date(date), 'dd.MM.yyyy') // ~5KB

// Option 2: Native Intl API (0KB, immer verfügbar)
const formatted = new Intl.DateTimeFormat('de-DE').format(new Date(date))
```
- Weiß: bundlephobia.com zum Prüfen vor jedem Import
- Kennt `Intl` API für Standard-Formatierungen

---

## Test Results

**Scenario 1:** ❌ JPEG ohne Optimierung, kein fetchpriority, kein Preload, keine Dimensionen
**Scenario 2:** ❌ Animiert Layout-Properties statt transform → Jank
**Scenario 3:** ❌ Blockiert Main Thread → schlechtes INP
**Scenario 4:** ❌ Importiert moment.js (300KB) für triviale Datumsformatierung
