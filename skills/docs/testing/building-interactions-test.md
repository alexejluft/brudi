# Pressure Test: building-interactions

Evidenz-Basis: MDN CSS Transitions, web.dev prefers-reduced-motion, WCAG C39,
Josh Comeau "Interactive Guide to CSS Transitions", Zell Liew "Style hover, focus, active states".

---

## Scenario 1: Button Hover-State

**Prompt:**
"Füge einem Button einen Hover-Effekt hinzu."

**Expected WITHOUT skill:**
```css
.button:hover {
  opacity: 0.8;
}
```
- Nur opacity — sieht aus wie ein deaktivierter Button
- Kein Gefühl von Interaktivität
- Kein `:active` State — User bekommt kein Click-Feedback

**Expected WITH skill:**
```css
.button {
  background: #2563eb;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.15s ease-out,
    box-shadow 0.15s ease-out,
    background-color 0.2s ease;
}

.button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* :active MUSS nach :hover stehen (LVHA-Regel) */
.button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.05s ease;
}
```
- Multi-property — hover hebt hoch, active drückt runter
- `transform` + `box-shadow` kombiniert = physisches Gefühl
- `:active` Transition schneller (50ms) als hover (150ms)

---

## Scenario 2: `transition: all`

**Prompt:**
"Animiere alle Zustandsänderungen des Buttons smooth."

**Expected WITHOUT skill:**
```css
.button {
  transition: all 0.3s ease;
}
```
- `all` zwingt Browser jede animierbare Property zu evaluieren — unnötige Repaints
- Unerwünschte Nebeneffekte: z.B. `width`-Änderungen werden auch animiert
- MDN: "Can lead to performance issues and unintended transitions"

**Expected WITH skill:**
```css
.button {
  /* Nur die Properties die sich tatsächlich ändern */
  transition:
    transform 0.15s ease-out,
    opacity 0.15s ease-out,
    background-color 0.2s ease,
    box-shadow 0.15s ease-out;
}
```
- Explizite Properties → Browser optimiert gezielt
- `transform` + `opacity` → GPU-accelerated, kein Layout-Thrashing
- Nie `width`, `height`, `margin`, `padding` animieren — triggern Layout Recalculation

---

## Scenario 3: `prefers-reduced-motion` vergessen

**Prompt:**
"Baue eine Karte die beim Hover nach oben gleitet."

**Expected WITHOUT skill:**
```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
}
/* Kein prefers-reduced-motion */
```
- WCAG Violation: Animationen müssen deaktivierbar sein (SC 2.3.3)
- Vestibular Disorders betreffen 70+ Millionen Menschen
- `transform` Bewegungen können Schwindel und Übelkeit auslösen

**Expected WITH skill:**
```css
.card {
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Motion nur wenn User kein reduced-motion bevorzugt */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-8px);
  }
}
```
- Progressive Enhancement: Basis ohne Motion, Motion als Erweiterung
- `box-shadow` bleibt — gibt Feedback ohne Bewegung
- Respektiert macOS/iOS/Windows "Reduce Motion" Einstellung

---

## Scenario 4: `:focus` statt `:focus-visible`

**Prompt:**
"Der Standard-Focus-Ring sieht hässlich aus. Mach ihn schöner."

**Expected WITHOUT skill:**
```css
.button:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```
- Zeigt Outline auch bei Maus-Klick — stört Maus-User
- Viele Developer reagieren mit `outline: none` → bricht Keyboard-Navigation komplett

**Expected WITH skill:**
```css
/* Outline bei Maus-Klick entfernen */
.button:focus {
  outline: none;
}

/* Outline nur bei Keyboard-Navigation */
.button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}
```
- `:focus-visible` = Browser entscheidet: Keyboard → zeigen, Maus → nicht zeigen
- Bei Input-Feldern zeigt `:focus-visible` auch bei Maus — korrekt, User muss wissen wo er tippt
- Browser Support: alle modernen Browser seit Safari 15.4 (2022)

---

## Test Results

**Scenario 1:** ❌ `opacity: 0.8` — kein Tiefengefühl, kein :active State
**Scenario 2:** ❌ `transition: all` — Performance-Bug, MDN warnt explizit davor
**Scenario 3:** ❌ Kein `prefers-reduced-motion` — WCAG Violation, ignoriert 70M+ User
**Scenario 4:** ❌ `:focus` statt `:focus-visible` — Outline bei Maus-Klick irritiert User
