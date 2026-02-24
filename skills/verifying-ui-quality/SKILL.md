---
description: Mandatory UI verification after every build step. Quality gates, browser checks, visual audit.
globs: ["**/page.tsx", "**/layout.tsx", "**/globals.css"]
---
# Verifying UI Quality

## ⛔ ENFORCEMENT — Dieser Skill ist PFLICHT

**Dieser Skill ist NICHT optional.** Vor JEDEM Slice musst du:
1. Diesen Skill lesen
2. 3 Checks aus der relevanten Phase-Gate-Liste auswählen
3. Diese 3 Checks in PROJECT_STATUS.md dokumentieren BEVOR du baust

**Nach JEDEM Slice musst du:**
1. Desktop-Screenshot machen (Pfad in PROJECT_STATUS.md)
2. Mobile 375px Screenshot machen (Pfad in PROJECT_STATUS.md)
3. Console = 0 Errors verifizieren
4. PROJECT_STATUS.md Slice-Zeile aktualisieren

**Ein Slice ohne diese 4 Nachweise gilt als NICHT ABGESCHLOSSEN.**

## When to Use This Skill
After EVERY vertical slice (section completion), after EVERY phase gate, and before marking ANY task "done."

---

## Verification Protocol

### Step 1: Server Check
```bash
# Ensure dev server is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# If not 200 → start with: npm run dev &
```

### Step 2: Build Check
```bash
npm run build 2>&1 | tail -20
# Must complete with NO errors
# Warnings are acceptable, errors are NOT
```

### Step 3: Visual Check (Browser Required — PFLICHT)
Take screenshots at:
1. Homepage above-the-fold (no scroll)
2. After scrolling to each major section
3. **Mobile viewport (375px width) — PFLICHT, nicht optional**

For each screenshot, verify against the current Phase Quality Gate.
**Jeden Screenshot-Pfad in PROJECT_STATUS.md dokumentieren.**

### Step 4: Console Check
Open DevTools Console:
- 0 errors allowed
- Warnings: acceptable if from third-party libs
- Check specifically for: "is not defined", "Cannot read property", GSAP/Lenis errors

### Step 5: Document Result
```
VERIFICATION RESULT: [PASS / FAIL]
Phase: [0 / 1-Slice-N / 2]
Failures: [list specific failures]
Action: [what needs fixing]
```

---

## Quality Gates by Phase

### Phase 0: Foundation
```
□ Background color is NOT #000000 (must be custom dark token)
□ Custom font loads (check DevTools → Computed → font-family)
□ 4 dark-layer CSS variables defined (--bg, --bg-elevated, --surface, --surface-high)
□ Lenis smooth scroll active (if installed — scroll should feel "buttery")
□ Console: 0 errors
□ Navigation visible with correct font and spacing
```

### Phase 1 — Per Vertical Slice:

**Slice: Preloader**
```
□ Animation plays on page load
□ Duration: 2-3 seconds
□ Page content appears after preloader completes
□ No flash of unstyled content before preloader
```

**Slice: Hero**
```
□ Headline animates in (not static appearance)
□ Background is NOT flat solid color (gradient/noise/texture visible)
□ CTA buttons have visible hover state (color, scale, or shadow change)
□ Scroll indicator animates (bounce, fade, or pulse)
□ Mobile 375px: No text overflow, CTAs are touchable (min 44x44px)
□ Typography uses fluid sizing (text shrinks on smaller viewports)
```

**Slice: Services/Features**
```
□ Cards are visually distinguishable from page background (min 2 layer steps)
□ Hover state visible and smooth (transition duration 0.3-0.5s)
□ Scroll-triggered entrance animation works
□ Numbers or icons present (not text-only cards)
□ Grid layout correct (not stacking on desktop)
□ Mobile: Cards stack cleanly with consistent spacing
```

**Slice: Portfolio/Case Studies**
```
□ EVERY card has visual content (image OR gradient — NEVER empty/black)
□ Image hover effect visible (scale, overlay, or parallax)
□ Text overlay is readable over image (contrast ratio ≥ 4.5:1)
□ Category/metadata labels visible
□ Mobile: Cards stack with maintained aspect ratios
□ Grid has asymmetric sizing (not all cards identical)
```

**Slice: CTA Section**
```
□ Large headline with accent color on key word
□ Button prominent with clear hover state
□ Centered layout with generous spacing (py-24+ on desktop)
```

**Slice: Footer**
```
□ All links functional (no dead links)
□ Grid layout responsive
□ Legal links present (Impressum, Datenschutz)
□ Contact info visible
```

### Phase 1 — Complete Gate (ALL Slices):
```
□ EVERY section has visible entrance animation
□ EVERY card/box has visual depth (shadow OR gradient OR elevation)
□ Smooth scroll active across entire page
□ Mobile (375px): All sections readable, no overflows, no horizontal scroll
□ Console: 0 errors, 0 critical warnings
□ Lighthouse Accessibility: > 90
□ ZERO empty black placeholder blocks visible anywhere
□ All hover states functional on interactive elements
□ Navigation works on desktop AND mobile
□ Page scroll from top to bottom takes 10+ seconds (enough content)
```

### Phase 2 — Complete Gate:
```
□ All internal links work (click every nav link)
□ Page transitions smooth (if GSAP page transitions implemented)
□ Contact form has validation + submit handler
□ Meta tags on all pages (check <head> in DevTools)
□ Lighthouse Performance: > 80
□ Lighthouse Accessibility: > 90
□ All pages have unique content (not copy-paste)
□ 404 page exists and looks designed
```

---

## Creative DNA Verification (Phase 1 Enhanced)

**Ab diesem Punkt zahlst du nicht in Symbolen (✅/❌) — du zahlst in Evidenz. Creative DNA ist messbar.**

### Animation Count Evidence

Zähle jeden GSAP-Aufruf pro Komponente. Verwende:
```bash
# Hero: zähle alle gsap.to(), gsap.from(), gsap.timeline() Aufrufe
grep -r "gsap\.\(to\|from\|timeline\)" src/app/page.tsx | wc -l

# Services/Features: alle Animation-Calls in diesem Component
grep -r "gsap\.\(to\|from\)" src/components/Services.tsx | wc -l
```

| Komponente | Minimum | Wie prüfen | Evidence-Format |
|-----------|---------|-----------|-----------------|
| **Hero** | 5+ Animationen | `npm run build && grep gsap src/app/page.tsx \| wc -l` | `"Hero: 7 Animationen (headline-reveal, bg-shift, scroll-indicator, CTA-scale, CTA-shadow, parallax-bg, underline-draw)"` |
| **Services/Cards** | 3+ pro Sektion | Entrance + Stagger + Hover | `"Services: 4 (grid-entrance, card-stagger@0.08s, hover-lift, hover-shadow)"` |
| **Card Hover** | 3+ Properties | Shadow + Color + Transform + Border | `"Card: shadow (md→lg), color (neutral→accent), translateY (-2px), border-opacity (0→1)"` |
| **Portfolio Cards** | 4+ | Entrance + Hover Image + Overlay + Text | `"Portfolio: 4 (card-entrance, image-scale, overlay-fade, text-slideup)"` |
| **CTA Section** | 3+ | Entrance + Button-Hover + Emphasis | `"CTA: 3 (headline-fadeIn, button-pulse, accent-glow)"` |

**Evidence-Template für PROJECT_STATUS.md:**
```
Animation Count: Hero=[7], Services=[4], Cards=[3], Portfolio=[4], CTA=[3]
Total Page Animations: 21 (Minimum für Phase 1: 15)
```

---

### Easing Variety Evidence

Nicht alle Animationen benutzen `ease: "power2.out"`. Du brauchst **3+ verschiedene Easing-Typen pro Slice**.

```bash
# Finde alle gsap Easing-Werte
grep -rE "ease:\s*\"" src/components/ src/app/page.tsx | grep -oE "ease:\s*\"[^\"]+\"" | sort | uniq -c
```

| Prüfung | Minimum | Wie | Evidence-Format |
|---------|---------|-----|-----------------|
| **Easing-Typen pro Slice** | 3+ verschiedene | grep nach `ease:`, `power`, `sine`, `expo`, `back`, `elastic` | `"Easing-Palette: power2.out (entrance), sine.inOut (scale), expo.out (reveal), back.out (bounce)"` |
| **Asymmetric Timing** | Enter ≠ Exit | Vergleiche Button Hover-In vs Hover-Out Duration | `"Button: enter 120ms (power2.out) / exit 200ms (sine.inOut)"` |
| **Stagger Variation** | 2+ unterschiedliche Stagger | `gsap.to(cards, { ... stagger: 0.08 })` vs `stagger: 0.12` | `"Stagger: 0.08s (Hero cards), 0.12s (Portfolio), 0.05s (CTA list)"` |

**Evidence-Template für PROJECT_STATUS.md:**
```
Easing Variety: power2.out, sine.inOut, expo.out, back.out (4 Typen)
Asymmetric Timing: Button [enter 120ms / exit 200ms], Card [enter 150ms / exit 300ms]
Stagger Patterns: 0.08s (Services), 0.12s (Portfolio), 0.05s (Feature-list)
```

---

### Depth Layer Evidence

Die 4 Dark-Layer-Variablen (`--bg`, `--bg-elevated`, `--surface`, `--surface-high`) sollen in 6+ verschiedenen Kontexten genutzt werden. Das ist kein ästhetisches Gefühl — es ist messbar.

```bash
# Zähle Layer-Nutzung
grep -r "bg-bg\|bg-bg-elevated\|bg-surface\|bg-surface-high" src/components src/app/page.tsx | wc -l
```

| Prüfung | Minimum | Wie | Evidence-Format |
|---------|---------|-----|-----------------|
| **--bg Nutzung** | Hero + Footer + Main BG | Wo wird `--bg` oder `bg-bg` genutzt? | `"--bg: Hero-Section, Footer, Main-Background (3 Kontexte)"` |
| **--bg-elevated Nutzung** | Services + CTA + Modal | `grep "bg-bg-elevated"` in Components | `"--bg-elevated: Services-Cards, CTA-Section, Modal-Backdrop (3 Kontexte)"` |
| **--surface Nutzung** | Cards + Inputs + Popovers | `grep "bg-surface"` count | `"--surface: Portfolio-Cards (4x), Service-Cards (3x), Form-Inputs (2x) = 9 Instanzen"` |
| **--surface-high Nutzung** | Hover-State + Active-State + Accents | `grep "bg-surface-high"` | `"--surface-high: Card-Hover (4x), Input-Focus (2x), Button-Active (1x) = 7 Instanzen"` |
| **Shadow Hierarchie** | 3+ Shadow-Level | `shadow-md`, `shadow-lg`, `shadow-xl` in verschiedenen Elementen | `"Shadows: md (cards-base, inputs), lg (cards-hover, modals), xl (floating-cta, hero-elements)"` |
| **Layer Eindeutigkeit** | 4 Schichten visuell unterscheidbar | Öffne Screenshot und vergleiche Farbtiefen | `"Visual Check: 4 distinct layer steps visible (bg<bg-elevated<surface<surface-high)"` |

**Evidence-Template für PROJECT_STATUS.md:**
```
Depth Layers Used:
  --bg: Hero, Footer, Main (3 Kontexte)
  --bg-elevated: Services, CTA, Modal (3 Kontexte)
  --surface: Portfolio-Cards×4, Service-Cards×3, Inputs×2 (9 Instanzen)
  --surface-high: Hover-States×4, Focus-States×2, Accents×1 (7 Instanzen)
Shadow-Hierarchy: md=[base-cards, inputs], lg=[hover-cards, modals], xl=[floating-cta]
Visual Differentiation: ✅ (4 distinct layers in screenshot)
```

---

### Forbidden Pattern Check

Diese Patterns sind VERBOTEN. Null Toleranz. Zähle jede Verletzung.

```bash
# Prüfe alle auf einmal
echo "=== FORBIDDEN PATTERNS ===" && \
grep -r "transition.*all" src/ && echo "❌ VIOLATION: transition:all found" || echo "✅ transition:all: 0 violations" && \
grep -r "gsap\.from" src/ && echo "❌ VIOLATION: gsap.from found" || echo "✅ gsap.from: 0 violations" && \
grep -r "margin.*animate\|width.*animate" src/ && echo "❌ VIOLATION: margin/width animation found" || echo "✅ margin/width animate: 0 violations"
```

| Pattern | Wie prüfen | Akzeptabel | Evidence |
|---------|-----------|-----------|----------|
| `transition: all` | `grep -r "transition.*all" src/` | **0 Treffer** | `"transition:all: 0 violations"` |
| `gsap.from()` | `grep -r "gsap\.from" src/` | **0 Treffer** | `"gsap.from(): 0 violations"` |
| Margin/Width Animation | `grep -rE "margin.*animate\|width.*animate" src/` | **0 Treffer** | `"margin/width-animate: 0 violations"` |
| Orphaned ScrollTrigger | Prüfe jeden `useEffect` mit `ScrollTrigger.create()` auf Cleanup | **Alle haben `return () => trigger.kill()`** | `"ScrollTrigger cleanup: 7/7 triggers have cleanup"` |
| Hardcoded Colors in Components | `grep -r "#[0-9a-f]\{3,6\}" src/components/` | **0 in strukturellen Elementen** (OK in Gradients) | `"Hardcoded colors: 0 violations (gradients use tokens)"` |
| String Selectors in GSAP | `grep -r "gsap\.to(\"\.class\"" src/` | **0 — immer Element-Refs** | `"String selectors in GSAP: 0 violations"` |

**Evidence-Template für PROJECT_STATUS.md:**
```
Forbidden Patterns Check:
  transition:all: 0 violations ✅
  gsap.from(): 0 violations ✅
  margin/width-animate: 0 violations ✅
  orphaned-ScrollTrigger: 0 violations ✅ (7/7 cleanup verified)
  hardcoded-colors: 0 violations ✅
  string-selectors-GSAP: 0 violations ✅
```

---

### Updated Quality Gate Checklist (Creative DNA)

Nachdem du die obigen 4 Checks durchführst, aktualisiere PROJECT_STATUS.md:

```markdown
## Slice [N] — Creative DNA Verification
- ✅ Animation Count Evidence: [Hero=X, Services=X, Cards=X, total=X/15min]
- ✅ Easing Variety Evidence: [types=X, asymmetric-timing=yes, stagger-patterns=X]
- ✅ Depth Layer Evidence: [--bg=X, --bg-elevated=X, --surface=X, --surface-high=X, shadows=3+]
- ✅ Forbidden Pattern Check: [transition:all=0, gsap.from=0, orphaned-trigger=0]
- ✅ Visual Verification: [Screenshot Desktop OK, Screenshot Mobile 375px OK, Console=0 errors]
```

**Diese 5 Punkte ersetzen NICHT die Standard-Quality-Gate-Checks** — sie sind ZUSÄTZLICH.

---

### Evidence Template (Copy-Paste for PROJECT_STATUS.md)

Agents kopieren-pasten das Template und füllen die Werte:

```markdown
## Slice [SLICE-NUMBER] — Creative DNA Evidence

### Animation Count
- Hero: [X] animations (list: ...)
- Services/Features: [X] animations (list: ...)
- Cards: [X] animations per card (list: ...)
- Portfolio: [X] animations (list: ...)
- CTA Section: [X] animations (list: ...)
- **Total Page**: [X] animations (Minimum Phase 1: 15)

### Easing Variety
- Easing types used: [list] (Minimum: 3)
- Asymmetric timing: Button [enter/exit], Card [enter/exit], Other [enter/exit]
- Stagger patterns: [0.08s], [0.12s], [0.05s] (Minimum: 2 different)

### Depth Layers
- --bg usage: [contexts: Hero, Footer, ...] (Minimum: 3)
- --bg-elevated usage: [contexts: Services, CTA, ...] (Minimum: 3)
- --surface usage: [instances: PortfolioCards×4, ServiceCards×3, ...] (Minimum: 6)
- --surface-high usage: [instances: Hover×4, Focus×2, ...] (Minimum: 5)
- Shadow hierarchy: [md=[contexts], lg=[contexts], xl=[contexts]]
- Visual check: [4 layers visible in screenshot?] ✅/❌

### Forbidden Patterns
- transition:all violations: [0]
- gsap.from() violations: [0]
- margin/width animate violations: [0]
- orphaned ScrollTrigger: [0/N cleanup verified]
- hardcoded colors: [0]
- string selectors in GSAP: [0]

### Summary
- Creative DNA Status: ✅ PASS / ❌ FAIL / 🟨 PARTIAL
- Quality Gate Result: [reference Desktop/Mobile/Console screenshots]
```

---

### How to Integrate This Into Your Workflow

**BEFORE Building Slice N:**
1. Read this section (Creative DNA Verification)
2. Decide: which Animation Count minimum applies? Which Easing types will you use?
3. Write them down in PROJECT_STATUS.md BEFORE coding

**AFTER Building Slice N:**
1. Run the grep commands above (Forbidden Patterns Check)
2. Count animations in your code
3. List easing types
4. Verify layer usage
5. Screenshot verification (Desktop + Mobile 375px)
6. Fill the template in PROJECT_STATUS.md
7. Submit for verification

**Keine Symbole ohne Zahlen.** ✅ PASS heißt: "Ich habe gezählt, hier sind die Werte, sie erfüllen die Minima."

Run this after Phase 1 completion. Every "NO" must be fixed.

### Visual (A1-A7)
- [ ] A1: No empty/black placeholder boxes anywhere
- [ ] A2: Cards have layered shadows (not flat)
- [ ] A3: 4 distinct background layers in use
- [ ] A4: Sections are visually separated (alternating layers, spacing ≥96px)
- [ ] A5: Custom fonts loaded (not system fonts visible)
- [ ] A6: No text overflow on mobile (375px)
- [ ] A7: All buttons have hover feedback

### Animation (B1-B7)
- [ ] B1: GSAP installed if specified in project
- [ ] B2: GSAP properly imported and registered
- [ ] B3: ScrollTrigger registered with `gsap.registerPlugin()`
- [ ] B4: Every section has entrance animation
- [ ] B5: Lenis initialized in root layout
- [ ] B6: Animations work after page navigation (cleanup in useEffect)
- [ ] B7: Only transform/opacity/clip-path animated (no margin/width)

### Structure (C1-C5)
- [ ] C1: Semantic HTML (sections, articles, headers, not div soup)
- [ ] C2: Z-index uses token system (no random values)
- [ ] C3: Mobile navigation functional (hamburger + overlay)
- [ ] C4: Container max-width set (1440px or custom)
- [ ] C5: Loading/Error/Empty states exist for dynamic content

### Integration (D1-D6)
- [ ] D1: No CSS/GSAP property conflicts
- [ ] D2: Lenis + ScrollTrigger synced
- [ ] D3: Fonts load in production build
- [ ] D4: Tailwind v4 @theme block correct
- [ ] D5: Images use next/image with sizes
- [ ] D6: Forms have submit handlers

---

## Common False-Positives

Things that look wrong but are fine:
- Tailwind v4 warning about PostCSS — expected
- Next.js hydration warning on first load — usually fine
- `useLayoutEffect` warning in SSR — expected with GSAP

Things that look fine but ARE broken:
- Page loads with no errors but no animations play — GSAP not registered
- Cards render but all same shade — dark layers not differentiated enough
- Build succeeds but fonts are system defaults — font paths wrong in production
