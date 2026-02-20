# Pressure Test: orchestrating-css-js-animations

Evidenz-Basis: GSAP Forum #18629 (CSS/GSAP Konflikt), MDN will-change, MDN animation-composition,
Stefan Judis "Keyframe animations in CSS cascade", Smashing Magazine GPU Animation,
web.dev Compositor-Only Properties.

---

## Scenario 1: CSS transition + GSAP auf gleicher Property

**Prompt:**
"Animiere eine Box mit GSAP nach rechts. Die Box hat bereits CSS-Transitions."

**Expected WITHOUT skill:**
```css
.box {
  transition: transform 0.5s ease;  /* CSS transition bleibt */
}
```
```js
gsap.to(".box", { x: 200, duration: 1, ease: "power2.out" })
// AI lässt CSS transition stehen und fügt GSAP hinzu
```
- CSS transition fängt die Property-Änderung ab — GSAP's Easing wird ignoriert
- Die Animation läuft mit CSS `ease`, nicht mit GSAP `power2.out`
- GSAP Forum: "transition CSS & GSAP conflict" — häufigste Support-Frage

**Expected WITH skill:**
```css
.box {
  /* Kein transition auf Properties die GSAP animiert */
}

/* ODER: CSS transition NUR für Hover, GSAP für alles andere */
.box:hover {
  /* Hover-States ohne transform wenn GSAP transform nutzt */
  background-color: var(--hover-bg);
  transition: background-color 0.2s ease;
}
```
```js
gsap.to(".box", { x: 200, duration: 1, ease: "power2.out" })

// Nach der Animation Kontrolle an CSS zurückgeben:
gsap.to(".box", {
  x: 200,
  duration: 1,
  clearProps: "transform"  // Entfernt inline-style danach
})
```
- Regel: Ein System pro Property — entweder CSS oder GSAP, nie beide
- `clearProps` gibt nach GSAP-Animation die Kontrolle zurück an CSS

---

## Scenario 2: CSS @keyframes mit fill-mode: forwards — JS kann nicht überschreiben

**Prompt:**
"Blende eine Box aus mit CSS Animation. Dann zeige sie wieder per JavaScript."

**Expected WITHOUT skill:**
```css
@keyframes fadeOut {
  to { opacity: 0; }
}
.box {
  animation: fadeOut 1s forwards;  /* forwards = locked */
}
```
```js
// Nach der Animation versucht JS die Box wieder sichtbar zu machen:
element.style.opacity = '1';  // Hat keine Wirkung!
// animation-fill-mode: forwards schlägt inline-styles
```
- CSS `@keyframes` haben höhere Cascade-Priorität als inline-styles
- `fill-mode: forwards` lockt den finalen Zustand — JS wird ignoriert
- Resultat: Box bleibt unsichtbar obwohl JS `opacity: 1` setzt

**Expected WITH skill:**
```js
// JS entfernt die Animation zuerst, dann setzt den Wert
element.addEventListener('animationend', () => {
  element.style.animation = 'none'   // Animation entfernen
  element.style.opacity = '1'        // Jetzt funktioniert es
})

// Oder: fill-mode: none + finalen Zustand manuell setzen
```
```css
@keyframes fadeOut {
  to { opacity: 0; }
}
.box {
  animation: fadeOut 1s none;  /* none statt forwards */
}
```
- `fill-mode: none` = nach Animation springt Element zurück
- JS setzt dann den finalen Zustand explizit
- Klare Ownership: CSS animiert, JS steuert finalen Zustand

---

## Scenario 3: will-change auf allen Elementen

**Prompt:**
"Optimiere die Animation-Performance der Karten im Grid."

**Expected WITHOUT skill:**
```css
.card {
  will-change: transform;  /* Auf allen Karten gleichzeitig */
}
```
- 50 Karten × ~2 MB GPU-Memory = 100 MB nur für will-change
- Browser erstellt für jede Karte sofort einen GPU-Compositing-Layer
- Smashing Magazine: "Can cause serious performance problems"
- Performance wird schlechter, nicht besser

**Expected WITH skill:**
```js
// will-change dynamisch — nur vor der Animation, sofort danach entfernen
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.willChange = 'transform'
  })

  card.addEventListener('mouseleave', () => {
    card.style.willChange = 'auto'
  })
})
```
- `will-change` maximal auf 1–3 Elementen gleichzeitig aktiv
- Nur über JavaScript setzen und entfernen — nie im Stylesheet
- MDN: "Only use it as a last resort"

---

## Scenario 4: Welches Tool — CSS, GSAP oder Web Animations API?

**Prompt:**
"Baue eine Seite mit: Button-Hover, einer Intro-Animation mit 3 Elementen in Sequenz, und einem Scroll-getriebenen Parallax."

**Expected WITHOUT skill:**
- Alles mit GSAP — auch der simple Button-Hover
- Oder: alles mit CSS `@keyframes` — auch die komplexe Timeline
- AI wählt ein Tool und wendet es auf alles an

**Expected WITH skill:**
```
Button-Hover:
  → CSS transition — simpel, kein JS, kein Bundle-Cost
  .button { transition: transform 0.15s ease-out; }
  .button:hover { transform: translateY(-2px); }

Intro-Sequenz mit 3 Elementen:
  → GSAP timeline — Sequencing, Stagger, genaues Timing
  gsap.timeline()
    .to(".heading", { opacity: 1, y: 0, duration: 0.6 })
    .to(".image",   { scale: 1, duration: 0.4 }, "-=0.2")
    .to(".text",    { x: 0, stagger: 0.1 })

Scroll-Parallax:
  → GSAP ScrollTrigger — komplexe scroll-getriebene Logik
  gsap.to(".bg", { yPercent: -30, ease: "none",
    scrollTrigger: { trigger: ".section", scrub: 1 } })
```
- CSS für Deklaratives (Hover, States)
- GSAP für Imperatives (Sequenzen, Timelines, Scroll)
- Web Animations API: wenn GSAP zu viel, aber JS-Kontrolle nötig

---

## Test Results

**Scenario 1:** ❌ CSS transition + GSAP auf gleicher Property → CSS-Easing überschreibt GSAP-Easing
**Scenario 2:** ❌ `fill-mode: forwards` → JS kann Property nicht mehr ändern
**Scenario 3:** ❌ `will-change` auf allen Elementen → GPU-Memory-Overflow, schlechtere Performance
**Scenario 4:** ❌ Ein Tool für alles → GSAP für Hover (Overkill) oder CSS für Timelines (unmöglich)
