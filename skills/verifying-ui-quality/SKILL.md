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

## 25-Point Audit Checklist

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
