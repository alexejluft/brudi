# Pressure Test: scrolling-with-purpose

Evidenz-Basis: GSAP Forum #35621, GitHub Issue #471, GSAP Official Docs "ScrollTrigger Tips & Mistakes",
Lenis GitHub Docs, GSAP Forum #30514 (horizontal scroll), GSAP Forum #25649 (pinSpacing).

---

## Scenario 1: ScrollTrigger in React ohne Cleanup

**Prompt:**
"Baue eine Scroll-Animation in React die eine Box nach rechts bewegt wenn sie in den Viewport kommt."

**Expected WITHOUT skill:**
```jsx
useEffect(() => {
  gsap.to(".box", {
    scrollTrigger: { trigger: ".box", start: "top center" },
    x: 200,
  });
}, []);
```
- React 18 Strict Mode mountet zweimal → doppelte ScrollTrigger-Instanz
- Kein Cleanup → Memory Leak, Animation feuert mehrfach
- GSAP Forum #35621: "Animation wird zweimal ausgelöst"

**Expected WITH skill:**
```jsx
import { useGSAP } from "@gsap/react"

const ref = useRef(null)

useGSAP(() => {
  gsap.to(".box", {
    scrollTrigger: { trigger: ".box", start: "top center" },
    x: 200,
  })
}, { scope: ref })
// useGSAP() räumt automatisch auf — kein manuelles ctx.revert() nötig
```
- `useGSAP()` ist der offizielle React-Hook — GSAP empfiehlt ihn explizit
- Cleanup passiert automatisch beim Unmount

---

## Scenario 2: ScrollTrigger + Lenis falsch integriert

**Prompt:**
"Integriere Lenis smooth scroll mit GSAP ScrollTrigger."

**Expected WITHOUT skill:**
```js
const lenis = new Lenis()

window.addEventListener('scroll', () => {
  ScrollTrigger.update()
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```
- `window.addEventListener('scroll')` feuert beim nativen Scroll, nicht beim Lenis-Scroll
- Lenis überschreibt das native Scroll-Event — ScrollTrigger bekommt falsche Positionen
- Resultat: Animationen triggern zum falschen Zeitpunkt, ruckeln

**Expected WITH skill:**
```js
const lenis = new Lenis()

// Lenis-Event statt Window-Event
lenis.on('scroll', ScrollTrigger.update)

// Lenis in GSAP Ticker einbinden
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// Lag smoothing deaktivieren — sonst doppeltes Smoothing
gsap.ticker.lagSmoothing(0)
```
- `lenis.on('scroll', ...)` → ScrollTrigger bekommt Lenis' virtuelle Position
- `gsap.ticker` = eine Schleife für beide Libraries
- Offizielle Lenis-Doku empfiehlt genau dieses Pattern

---

## Scenario 3: Horizontales Scroll mit falschen Settings

**Prompt:**
"Baue ein horizontales Scroll-Panel mit GSAP das an die Scroll-Position gebunden ist."

**Expected WITHOUT skill:**
```js
gsap.to(".panels", {
  xPercent: -100,
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: true,
    start: "top top"
  }
})

// CSS:
body { overflow-x: hidden }
```
- `scrub: true` = kein Lag → ruckelt bei schnellem Scrollen
- `body { overflow-x: hidden }` versteckt auch vertikalen Scrollbar → Layout bricht
- `end` fehlt → GSAP schätzt die Distanz falsch

**Expected WITH skill:**
```js
gsap.to(".panels", {
  xPercent: -100,
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,          // 1 Sekunde Lag = smooth
    start: "top top",
    end: () => "+=" + document.querySelector(".panels").offsetWidth
  }
})

// CSS:
.container { overflow: hidden }  /* nur Container, nicht body */
body { overflow-x: clip }        /* clip statt hidden — bricht kein Layout */
```
- `scrub: 1` = smooth, kein Ruckeln
- `end` dynamisch berechnet — funktioniert bei verschiedenen Panel-Breiten
- `overflow-x: clip` auf body — versteckt kein vertikales Scrollen

---

## Scenario 4: Mehrere ScrollTrigger auf gleicher Property — Cached Value Bug

**Prompt:**
"Baue zwei aufeinanderfolgende Scroll-Animationen die beide die X-Position einer Box verändern."

**Expected WITHOUT skill:**
```js
gsap.to(".box", {
  x: 100,
  scrollTrigger: { trigger: ".section1" }
})

gsap.to(".box", {
  x: 200,
  scrollTrigger: { trigger: ".section2" }
})
// Bug: Box animiert zu x:100, springt zurück zu x:0, animiert dann zu x:200
// GSAP cached den Starting Value der zweiten Animation beim ersten Render
```
- Offiziell dokumentierter Bug: "Animating the same property across multiple ScrollTriggers"
- Resultat: visueller Sprung — sieht kaputt aus

**Expected WITH skill:**
```js
// Option A: fromTo() mit explizitem Start
gsap.to(".box", {
  x: 100,
  scrollTrigger: { trigger: ".section1" }
})

gsap.fromTo(".box",
  { x: 100 },  // expliziter Start-Wert
  { x: 200, scrollTrigger: { trigger: ".section2" } }
)

// Option B: Eine Timeline, ein ScrollTrigger
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
})
tl.to(".box", { x: 100 })
  .to(".box", { x: 200 })
```
- `fromTo()` oder Timeline — beide verhindern den Cached-Value-Bug
- Timeline ist die sauberere Lösung wenn Sequencing sowieso geplant ist

---

## Test Results

**Scenario 1:** ❌ Kein Cleanup → doppelte Trigger, Memory Leak in Strict Mode
**Scenario 2:** ❌ `window.addEventListener` statt `lenis.on` → falsche Scroll-Positionen
**Scenario 3:** ❌ `scrub: true` ruckelt, `overflow-x: hidden` auf body bricht Layout
**Scenario 4:** ❌ Cached Starting Value → visueller Sprung zwischen Animationen
