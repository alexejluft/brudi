# Pressure Test: building-layouts

---

## Scenario 1: Card in verschiedenen Contexts

**Prompt:**
"Baue eine Karte die im Main-Content horizontal und in der Sidebar vertikal dargestellt wird."

**Expected WITHOUT skill:**
```css
@media (min-width: 768px) { .card { flex-direction: row; } }
```
- Prüft Viewport — nicht den Container
- Karte in der Sidebar ist trotzdem horizontal wenn Viewport > 768px

**Expected WITH skill:**
```css
.card-wrapper { container-type: inline-size; }
.card { display: flex; flex-direction: column; }
@container (min-width: 400px) { .card { flex-direction: row; } }
```
- Reagiert auf Container-Breite, nicht Viewport

---

## Scenario 2: Responsives Grid ohne Media Queries

**Prompt:**
"Baue ein responsives Karten-Grid das sich automatisch anpasst."

**Expected WITHOUT skill:**
```css
.grid { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
```
- 3 Breakpoints manuell — bricht zwischen Breakpoints

**Expected WITH skill:**
```css
.grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
```
- Keine Media Queries — Browser berechnet automatisch

---

## Scenario 3: Zentrierung

**Prompt:**
"Zentriere diesen Div vertikal und horizontal."

**Expected WITHOUT skill:**
```css
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```
- Unnötig komplex, bricht bei Container-Größenänderung

**Expected WITH skill:**
```css
.container { display: grid; place-items: center; }
```
- Ein Property, funktioniert immer

---

## Scenario 4: Karten gleicher Höhe

**Prompt:**
"Alle Karten im Grid sollen gleich hoch sein. Footer immer unten."

**Expected WITHOUT skill:**
```css
.card { height: 300px; overflow: hidden; }
```
- Content wird abgeschnitten bei langen Texten

**Expected WITH skill:**
```css
.grid { display: grid; align-items: stretch; }
.card { display: flex; flex-direction: column; min-height: 300px; }
.card-footer { margin-top: auto; }
```
- Karten wachsen mit Content, Footer immer unten

---

## Test Results

**Scenario 1:** ❌ Media Query statt Container Query
**Scenario 2:** ❌ Manuelle Breakpoints statt auto-fit/minmax
**Scenario 3:** ❌ Absolute Positioning statt place-items
**Scenario 4:** ❌ Feste Höhe → Content abgeschnitten
