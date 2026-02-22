# Pressure Test: building-accessibly

---

## Scenario 1: Icon-Button ohne Label

**Prompt:**
"Baue einen Close-Button für ein Modal."

**Expected WITHOUT skill:**
```html
<button class="close-btn">✕</button>
<!-- oder -->
<button><svg>...</svg></button>
```
- Screen Reader liest: "Button" oder "times" oder gar nichts
- Tastatur-User weiß nicht was der Button tut

**Expected WITH skill:**
```html
<button aria-label="Modal schließen">✕</button>
<!-- oder für SVG -->
<button>
  <svg aria-hidden="true" focusable="false">...</svg>
  <span class="sr-only">Modal schließen</span>
</button>
```
- Screen Reader: "Modal schließen, Button"
- Visuell gleich — funktional zugänglich

---

## Scenario 2: Formular ohne Labels

**Prompt:**
"Baue ein Login-Formular."

**Expected WITHOUT skill:**
```html
<input type="email" placeholder="E-Mail-Adresse">
<input type="password" placeholder="Passwort">
<button>Anmelden</button>
```
- Placeholder verschwindet beim Tippen
- Screen Reader hat keine Zuordnung Input → Bedeutung
- Fehlermeldungen nicht mit Input verknüpft

**Expected WITH skill:**
```html
<label for="email">E-Mail-Adresse</label>
<input id="email" type="email" aria-describedby="email-error">
<p id="email-error" role="alert" aria-live="polite"></p>

<label for="password">Passwort</label>
<input id="password" type="password">

<button type="submit">Anmelden</button>
```
- `for`/`id` verknüpft Label mit Input
- `aria-describedby` verbindet Fehlermeldung mit Input
- `role="alert"` + `aria-live` kündigt Fehler an

---

## Scenario 3: Focus-State entfernt

**Prompt:**
"Der Standard-Focus-Ring sieht hässlich aus. Entferne ihn."

**Expected WITHOUT skill:**
```css
* { outline: none; }
/* oder */
button:focus { outline: none; }
```
- Tastatur-Navigation komplett unsichtbar
- WCAG 2.4.7 Violation: Focus muss sichtbar sein

**Expected WITH skill:**
```css
/* Nur für Maus-User unsichtbar — Tastatur-User behalten sichtbaren Focus */
button:focus:not(:focus-visible) { outline: none; }

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 2px;
}
```
- `:focus-visible` — modern, unterscheidet Maus von Tastatur
- Design-konform UND zugänglich

---

## Scenario 4: Dynamischer Content ohne Ankündigung

**Prompt:**
"Zeige eine Erfolgsmeldung nachdem ein Formular abgeschickt wurde."

**Expected WITHOUT skill:**
```tsx
{success && <p className="success">Gespeichert!</p>}
```
- Erscheint visuell — Screen Reader bemerkt es nicht
- User mit Sehbehinderung erhält kein Feedback

**Expected WITH skill:**
```tsx
{/* Live Region — immer im DOM, Inhalt ändert sich */}
<p role="status" aria-live="polite" aria-atomic="true">
  {success ? 'Änderungen gespeichert.' : ''}
</p>

{/* Fehler — assertive unterbricht sofort */}
<p role="alert" aria-live="assertive">
  {error ? 'Fehler beim Speichern. Bitte versuche es erneut.' : ''}
</p>
```
- `aria-live="polite"` → kündigt an wenn User nicht gerade tippt
- `aria-live="assertive"` → unterbricht sofort (nur für Fehler)
- `role="status"` / `role="alert"` für Semantik

---

## Test Results

**Scenario 1:** ❌ Icon-Button ohne Label — Screen Reader nutzlos
**Scenario 2:** ❌ Placeholder statt Label, keine Fehler-Verknüpfung
**Scenario 3:** ❌ `outline: none` global → Tastatur nicht nutzbar
**Scenario 4:** ❌ Dynamischer Content ohne aria-live → unsichtbar für Screen Reader
