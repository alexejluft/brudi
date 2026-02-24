# BRUDI MOTION PROTOCOL v1.0
**Deterministische Motion-Spezifikation für Award-Level Animationen**

---

## Überblick

Das BRUDI Motion Protocol ist ein **zentralisiertes, erzwingbares Motion-System** für alle Brudi-Projekte. Es eliminiert:
- Willkürliche Timing-Werte (0.3s überall)
- Inkonsistente Easing-Funktionen
- Hardcoded Durations in Komponenten-Code
- Accessibility-Verletzungen (prefers-reduced-motion)
- Performanz-Probleme (animierte Layout-Properties)

**Compliance wird vom brudi-gate.sh erzwungen.** Kein Commit ohne Motion Protocol Validation.

---

## 1. AKTUELLER ZUSTAND

### Was existiert
- **globals.css**: 3 Easing-Tokens (ease-out-expo, ease-out-quart, ease-in-out-quint)
- **gsap-snippets.ts**: 10 reusable GSAP-Patterns
- **framer-motion-snippets.ts**: 10 Framer Motion-Patterns
- **Skills**: designing-award-motion, designing-motion-timing, orchestrating-motion-language, animating-interfaces

### Gaps
- Keine zentralisierten Duration-Tokens (Werte sind hardcoded in Code + Skills)
- Keine Distance-Tokens (für transform-Werte)
- Keine Intensity-Multiplikatoren (jedes Projekt codiert unterschiedlich)
- Keine verbindliche Component-Rule-Matrix (was animiert wie)
- Keine Gate-Enforcement (nichts validiert automatisch)

---

## 2. DURATION TOKEN SCALE (PFLICHT)

Alle Werte in **Dezimalform (Sekunden)**. In globals.css + motion.protocol.ts **identisch**.

| Token | Wert | ms | Kontext | Formel |
|-------|------|----|---------|----|
| `micro` | 0.12 | 120 | Toggle, Checkbox, Icon-Swap | — |
| `fast` | 0.18 | 180 | Button Hover, Focus-State | — |
| `normal` / `standard` | 0.35 | 350 | Card-Reveal, Panel, Tab-Wechsel | — |
| `slow` | 0.65 | 650 | Section-Entrance, Page-Transition | — |
| `hero` | 1.0 | 1000 | Hero-Banner, grosse Icons | MAX |
| `stagger` | 0.08 | 80 | Delay zwischen stagger Items | Standard = 80ms |
| `stagger-tight` | 0.05 | 50 | Dichte Sequenzen | — |
| `stagger-loose` | 0.12 | 120 | Verteilt, spacing | — |

**Regel**: Dauer skaliert mit **visueller Grösse + emotionaler Gewichtung**.
- Micro: Imperceptible Feedback (< 200ms)
- Fast: Responsive Interaction (150–200ms)
- Normal: Standard UI (300–400ms)
- Slow: Dramatic Entrance (600–800ms)
- Hero: Max Attention (900ms+)

**NIEMALS**:
- ❌ Micro-Animation mit 400ms (sluggish)
- ❌ Hero-Entrance mit 200ms (rushed, cheap)
- ❌ Button-Hover mit 0.8s (unresponsive)

### CSV-Export (für Konfiguration)
```
token,seconds,milliseconds,context
micro,0.12,120,toggle;checkbox;icon-swap
fast,0.18,180,button-hover;focus
normal,0.35,350,card-reveal;panel;dropdown
slow,0.65,650,section-entrance;page-transition
hero,1.0,1000,hero-banner;max-attention
stagger,0.08,80,stagger-delay
stagger-tight,0.05,50,dense-sequence
stagger-loose,0.12,120,spaced-sequence
```

---

## 3. EASING TOKEN SCALE (PFLICHT)

Alle als **cubic-bezier + GSAP-Name**. In globals.css + motion.protocol.ts **identisch**.

| Token | Cubic-Bezier | GSAP-Äquivalent | Kontext | Feeling |
|-------|--------------|-----------------|---------|--------|
| `ease-exit` | `cubic-bezier(0.25, 1, 0.5, 1)` | `power2.out` | Standard Exit (am häufigsten) | Responsiv, prägnant |
| `ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | `power3.out` | Entrance, Drama | Aggressive, impactful |
| `ease-smooth` | `cubic-bezier(0.25, 1, 0.5, 1)` | `power2.out` | Subtile Bewegung | Premium, elegant |
| `ease-dramatic` | `cubic-bezier(0.16, 1, 0.3, 1)` | `power3.out` | Hero, grosse Reveal | Schwungvoll, teuer |
| `ease-spring` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | `back.out(1.5)` | Bouncy, playful | Energetisch, Spass |
| `ease-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)` | `power2.inOut` | Symmetric Movement | Smooth, auto-fahrt-like |
| `ease-linear` | `cubic-bezier(0, 0, 1, 1)` | `linear` | ⛔ ONLY Spinner/Loader | Robotic (vermeiden!) |
| `ease-quint` | `cubic-bezier(0.16, 1, 0.3, 1)` | `power5.out` | Extra aggressive Hero | Mega-dramatic |

**Regel**:
- **Entering**: `ease-out` (responsive, impactful)
- **Exiting**: `ease-in` (graceful, less jarring)
- **Movement**: `ease-in-out` (symmetric)
- **NIEMALS**: `linear` für Movement (nur Spinner!)

### GSAP String-Kompatibilität
```ts
// ✅ In GSAP verwendbar:
gsap.to(el, {
  ease: 'power2.out',        // oder 'power3.out', 'back.out(1.5)', etc.
  duration: 0.35
})

// ❌ NICHT hardcoded:
gsap.to(el, {
  ease: 'cubic-bezier(...)',  // ← Nein, GSAP-Namen verwenden
  duration: 0.35
})
```

### Tailwind v4 Integration
```css
/* globals.css @theme */
@theme {
  --ease-exit: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  /* ... rest */
}

/* In Tailwind Classes */
transition: transform duration-300 ease-exit
transition: opacity duration-650 ease-enter
```

---

## 4. MOTION INTENSITY LEVELS (3-stufig)

Jedes Projekt setzt **1 Intensitätsstufe**, die **alle Duration- + Distance-Tokens multipliziert**.

| Level | Beschreibung | Kontext | Dauer-Multiplikator | Stagger-Multiplikator | Distance-Multiplikator |
|-------|--------------|---------|--------------------|-----------------------|------------------------|
| **Subtle** (0.7x) | Corporate, B2B, SaaS, Finanzen | Konservativ | 0.7 | 0.8 | 0.6 |
| **Balanced** (1.0x) | Portfolio, Agency, Mixed | DEFAULT | 1.0 | 1.0 | 1.0 |
| **Expressive** (1.3x) | Award-Level, Showcase, Product | Dramatisch | 1.3 | 1.1 | 1.5 |

**Beispiel: Subtle (SaaS)**
```ts
// Base duration: 0.35s
// Applied: 0.35 × 0.7 = 0.245s ≈ 240ms
// Less noticeable, faster feedback loop

// Base distance: 24px
// Applied: 24 × 0.6 = 14.4px
// Subtler movement
```

**Beispiel: Expressive (Award)**
```ts
// Base duration: 0.35s
// Applied: 0.35 × 1.3 = 0.455s ≈ 455ms
// More drama, premium feel

// Base distance: 24px
// Applied: 24 × 1.5 = 36px
// Bigger, more impactful move
```

**Implementierung**:
```ts
import { createMotionConfig } from '@/config/motion.protocol'

// In App.tsx oder _document.tsx
const motionConfig = createMotionConfig('expressive', prefersReducedMotion)

// Alle Komponenten verwenden dann:
const duration = motionConfig.getDuration('normal')  // 0.35 × 1.3 = 0.455
const distance = motionConfig.getDistance('base')   // 24 × 1.5 = 36
```

---

## 5. DISTANCE TOKENS (für transform translate)

Basis-Verschiebungs-Werte für `y`, `x` in px. Werden mit Intensity-Multiplikator skaliert.

| Token | px | Kontext | Scaled (Subtle) | Scaled (Balanced) | Scaled (Expressive) |
|-------|----|---------|----|----|----|
| `micro` | 4 | Kaum wahrnehmbar | 2.4 | 4 | 6 |
| `xs` | 8 | Minimal | 4.8 | 8 | 12 |
| `sm` | 12 | Small | 7.2 | 12 | 18 |
| `base` | 24 | **Standard Entrance** | 14.4 | 24 | 36 |
| `md` | 32 | Mittlere Bewegung | 19.2 | 32 | 48 |
| `lg` | 40 | Grosse Bewegung | 24 | 40 | 60 |
| `xl` | 48 | 3×8pt units | 28.8 | 48 | 72 |
| `xxl` | 64 | Grosse Moves | 38.4 | 64 | 96 |
| `xxxl` | 80 | Sehr grosse Moves | 48 | 80 | 120 |
| `full` | 100 | MAX (Parallax) | 60 | 100 | 150 |

**Standard Entrance**: `y: distance.base` (24px) mit `ease: ease-exit`.

---

## 6. MANDATORY MOTION PROTOCOL PER COMPONENT TYPE

**Jeder Komponenten-Typ hat EINE Standard-Motion-Regel.** Keine Variationen, keine "creative freedom".

### HERO
```ts
HERO: {
  entrance: {
    duration: 1.0,       // MAX für Attention
    ease: 'power3.out',  // Aggressive
    distance: 48,        // Grosse Fallback-Verschiebung
    delay: 0.1,          // Leichte Verzögerung
  },
  hover: {
    duration: 0.35,
    ease: 'power2.out',
    scale: 1.02,         // Subtil Lift
  },
  scroll: {
    trigger: true,
    duration: 0,
    ease: 'none',
  },
}
```

**Verhalten**:
1. On Page Load: Y-Push down 48px, fade-in over 1.0s with power3.out
2. On Hover: Subtle scale (1.02) + maybe slight lift
3. On Scroll: ScrollTrigger zum sichtbar machen

---

### SECTION
```ts
SECTION: {
  entrance: {
    duration: 0.65,
    ease: 'power2.out',
    distance: 40,
  },
  scroll: {
    trigger: true,
    duration: 0.65,
    ease: 'power2.out',
  },
}
```

**Verhalten**: Fade + Y-push von 40px über 0.65s, triggered by ScrollTrigger (top 85%).

---

### CARD
```ts
CARD: {
  entrance: {
    duration: 0.35,
    ease: 'power2.out',
    distance: 20,
    delay: 0,
  },
  hover: {
    duration: 0.3,
    ease: 'power2.out',
    scale: 1.04,
  },
  scroll: {
    trigger: true,
    duration: 0.35,
    ease: 'power2.out',
  },
}
```

**Verhalten**:
- Entrance: Fade + Y 20px over 0.35s
- Hover: Scale 1.04 (subtle lift)
- Scroll: ScrollTrigger-basierter Entrance

---

### BUTTON
```ts
BUTTON: {
  entrance: {
    duration: 0.2,
    ease: 'power2.out',
    distance: 0,
  },
  hover: {
    duration: 0.18,
    ease: 'power2.out',
    scale: 1.05,
  },
  click: {
    duration: 0.12,
    ease: 'power2.in',
  },
}
```

**Verhalten**:
- Entrance: Fade in over 0.2s (schnell)
- Hover: Scale 1.05 over 0.18s
- Click: Scale down 0.95 (press-down feel) over 0.12s

---

### NAVIGATION
```ts
NAVIGATION: {
  entrance: {
    duration: 0.5,
    ease: 'power2.out',
    distance: 20,
  },
  hover: {
    duration: 0.18,
    ease: 'power2.out',
    offset: 4,  // Subtile underline/highlight Bewegung
  },
  scroll: {
    trigger: true,
    duration: 0.3,
    ease: 'power2.out',
  },
}
```

**Verhalten**:
- Entrance: Y 20px fade-in
- Hover: Underline/highlight shift 4px
- Scroll: Responsive shrink/morph (brudi-gate validiert)

---

### IMAGE
```ts
IMAGE: {
  entrance: {
    duration: 0.65,
    ease: 'power2.out',
    distance: 24,
  },
  hover: {
    duration: 0.4,
    ease: 'power2.inOut',
    scale: 1.02,
  },
  scroll: {
    trigger: true,
    duration: 0.65,
    ease: 'power2.out',
  },
}
```

**Verhalten**: Slow, photograph-appropriate reveal. Minimal scale on hover.

---

### TEXT_BLOCK
```ts
TEXT_BLOCK: {
  entrance: {
    duration: 0.6,
    ease: 'power2.out',
    distance: 20,
    delay: 0,
  },
  scroll: {
    trigger: true,
    duration: 0.6,
    ease: 'power2.out',
  },
}
```

**Verhalten**: Entrance über stagger. Für Absätze + Überschriften identisch.

---

### CTA (Call-to-Action)
```ts
CTA: {
  entrance: {
    duration: 0.5,
    ease: 'power3.out',  // Dramatic
    distance: 24,
    delay: 0.1,
  },
  hover: {
    duration: 0.2,
    ease: 'power2.out',
    scale: 1.08,  // Bigger than button
  },
  click: {
    duration: 0.15,
    ease: 'power2.in',
  },
}
```

**Verhalten**: Emphasis auf CTA. Größere Hover-Scale (1.08 vs Button 1.05).

---

### MODAL / OVERLAY
```ts
MODAL: {
  entrance: {
    duration: 0.4,
    ease: 'back.out(1.5)',  // Spring/bouncy
    distance: 0,
  },
  exit: {
    duration: 0.25,
    ease: 'power2.in',
    distance: 20,
  },
}
```

**Verhalten**:
- Entrance: Scale + fade spring-in (spring ease)
- Backdrop: Fade in parallel
- Exit: Scale down + fade out (necessary for Framer Motion exit animations)

---

### PAGE_TRANSITION
```ts
PAGE_TRANSITION: {
  entrance: {
    duration: 0.5,
    ease: 'power2.out',
    distance: 10,  // Kleine Y-Push
  },
  exit: {
    duration: 0.35,
    ease: 'power2.in',
    distance: 10,
  },
}
```

**Verhalten**:
- Ausgangsseite: Fade-out + Y-up 10px über 0.35s
- Navigation
- Zielseite: Fade-in + Y-down 10px über 0.5s

---

### ACCORDION / DISCLOSURE
```ts
ACCORDION: {
  entrance: {
    duration: 0.35,
    ease: 'power2.inOut',  // Symmetric (hin & her)
    distance: 0,
  },
  exit: {
    duration: 0.25,
    ease: 'power2.inOut',
    distance: 0,
  },
}
```

**Verhalten**:
- Expand: Smooth height 0 → auto über 0.35s
- Collapse: height auto → 0 über 0.25s
- Framer Motion `AnimatePresence` + `layout` prop

---

## 7. motion.protocol.ts — TEMPLATE

**Datei**: `/assets/configs/motion.protocol.ts`

```ts
import { createMotionConfig } from '@/config/motion.protocol'

// Export für externe Nutzung
export const motion = createMotionConfig('balanced', false)

// Runtime-seitige Konfiguration (App.tsx)
const motionConfig = createMotionConfig(
  process.env.NEXT_PUBLIC_MOTION_INTENSITY as 'subtle' | 'balanced' | 'expressive' || 'balanced',
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
)

// In Komponenten:
import { motion } from '@/config/motion.protocol'

function HeroSection() {
  const config = motion.getComponentRule('HERO')
  const duration = motion.getDuration('hero')
  const distance = motion.getDistance('xl')

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: config.entrance.duration, ease: config.entrance.ease }}
    />
  )
}
```

---

## 8. ENFORCEMENT (brudi-gate.sh Integration)

**Motion Compliance wird automatisch validiert bei**:
1. `pre-slice`: Prüft ob motion.protocol.ts + globals.css korrekt sind
2. `post-slice`: Prüft ob Animation-Code Tokens verwendet (keine Hardcodes)
3. Kommt als `motion-compliance-check.sh` bereit

### Validierungs-Gate
```bash
bash ~/Brudi/orchestration/motion-compliance-check.sh . all

# Checks:
# 1. motion.protocol.ts existiert ✅
# 2. Alle DURATION_TOKENS definiert ✅
# 3. Alle EASING_TOKENS definiert ✅
# 4. globals.css hat alle CSS-Variablen ✅
# 5. Keine gsap.from() calls (Set + To only) ✅
# 6. prefers-reduced-motion support ✅
# 7. Keine hardcoded durations/easings ✅
# 8. Nur transform + opacity animiert ✅
# 9. Stagger = 80ms Multiples ✅
# 10. Intensity Config vollständig ✅
```

**Fehler blockieren Commit:**
```
✗ motion.protocol.ts nicht gefunden
✗ DURATION_TOKENS nicht definiert
✗ Hardcoded duration: 0.3s gefunden
✗ gsap.from() verboten

→ Exit Code 1 → Git Commit BLOCKED
```

---

## 9. ANTI-PATTERN GUARDRAILS

| Pattern | Status | Grund |
|---------|--------|-------|
| `gsap.from()` mit Strings | ⛔ VERBOTEN | React StrictMode: invisible elements |
| Hardcoded `duration: 0.3` | ⛔ VERBOTEN | Zentrale Tokens verwenden |
| `ease: 'linear'` für Movement | ⛔ VERBOTEN | Robotic, unnatürlich |
| Animiert `width`, `height`, `top` | ⛔ VERBOTEN | Layout-Thrashing, jank |
| Stagger > 150ms | ⛔ VERBOTEN | Zu verteilt, fühlt sich langsam an |
| Micro-Animation > 200ms | ⛔ VERBOTEN | Unresponsive |
| Keine `prefers-reduced-motion` Check | ⛔ VERBOTEN | Accessibility-Verletzung |
| `willChange` global | ⛔ VERBOTEN | RAM-Verschwendung (max 3 Elemente) |
| Keine Cleanup (useGSAP/gsap.context) | ⛔ VERBOTEN | Memory Leaks in React |
| Motion-Werte für mehrere Komponenten-Typen | ⛔ VERBOTEN | Inkonsistenz |

---

## 10. QUICK START (für neue Projekte)

### Phase 0: Setup
```bash
# 1. Kopiere globals.css (mit Motion-Tokens)
# 2. Kopiere motion.protocol.ts zu assets/configs/
# 3. In package.json:
npm install gsap framer-motion @gsap/react
```

### Phase 1: Hero-Section
```tsx
'use client'
import { motion } from '@/config/motion.protocol'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function HeroSection() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const title = containerRef.current?.querySelector('.hero-title')
    const subtitle = containerRef.current?.querySelector('.hero-subtitle')

    const rule = motion.getComponentRule('HERO')

    // Set initial state
    gsap.set([title, subtitle], { opacity: 0, y: rule.entrance.distance })

    // Timeline
    const tl = gsap.timeline()
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: rule.entrance.duration,
      ease: rule.entrance.ease,
      delay: rule.entrance.delay
    })
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: motion.getDuration('normal'),
      ease: motion.ease.smooth
    }, '-=0.2')
  }, { scope: containerRef })

  return (
    <section ref={containerRef}>
      <h1 className="hero-title">Award-Level Motion</h1>
      <p className="hero-subtitle">Deterministic. Enforced. Consistent.</p>
    </section>
  )
}
```

### Phase 1: Scroll Reveal
```tsx
useGSAP(() => {
  const cards = containerRef.current?.querySelectorAll('.card')

  const rule = motion.getComponentRule('CARD')

  gsap.set(cards, { opacity: 0, y: rule.entrance.distance })

  gsap.to(cards, {
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
    },
    opacity: 1,
    y: 0,
    duration: rule.entrance.duration,
    ease: rule.entrance.ease,
    stagger: motion.duration.stagger,
  })
}, { scope: containerRef })
```

---

## 11. INTEGRATION MIT BRUDI SKILLS

| Skill | Integration |
|-------|-----------|
| `designing-award-motion` | Nutzt DURATION + EASING Tokens |
| `designing-motion-timing` | Defines Timing Hierarchy (micro/standard/dramatic) |
| `orchestrating-motion-language` | Nutzt COMPONENT_MOTION_RULES + motion config |
| `animating-interfaces` | Nutzt createMotionConfig + getComponentRule |
| `orchestrating-gsap-lenis` | Scroll-Trigger kompatibel mit Distance-Tokens |
| `orchestrating-react-animations` | useGSAP kompatibel |

---

## 12. ENVIRONMENT VARIABLES

```env
# .env.local
NEXT_PUBLIC_MOTION_INTENSITY=balanced    # subtle | balanced | expressive
NEXT_PUBLIC_MOTION_DEBUG=false           # Log motion config zur Konsole
```

---

## 13. DEPLOYMENT & CI/CD

Vor `git push`:
```bash
bash ~/Brudi/orchestration/motion-compliance-check.sh . all
# Exit Code 0 = OK, kann pushen
# Exit Code 1 = Motion Violations, commit blocked
```

In Vercel/CI:
```yaml
# vercel.json oder CI config
{
  "buildCommand": "npm run build && motion-compliance-check.sh . config"
}
```

---

## 14. CHECKLISTE PRE-DELIVERY

- [ ] motion.protocol.ts vorhanden + alle Tokens definiert
- [ ] globals.css: alle Duration + Easing Tokens als CSS-Variablen
- [ ] COMPONENT_MOTION_RULES für alle 8+ Komponenten-Typen
- [ ] INTENSITY_CONFIG: 3 Levels (subtle/balanced/expressive)
- [ ] Alle GSAP-Animationen nutzen `set() + to()` (NIE `from()`)
- [ ] Kein `gsap.from()` in Code
- [ ] Nur `transform` + `opacity` animiert
- [ ] `prefers-reduced-motion` global in CSS + JS-Check
- [ ] Stagger = 80ms oder 50ms oder 120ms (Multiples)
- [ ] Keine hardcoded duration/ease-Werte
- [ ] Motion Compliance Check: `bash motion-compliance-check.sh . all` = PASSED
- [ ] Screenshot der Animations (Desktop + Mobile 375px)
- [ ] Zero Console Errors

---

## 15. VERSIONING

| Version | Datum | Änderungen |
|---------|-------|-----------|
| v1.0 | 2026-02-23 | Initial Release: Duration, Easing, Intensity, Component Rules, Enforcement |

---

## Kontakt & Support

**Für Motion Protocol Fragen**: Siehe `/skills/designing-award-motion/SKILL.md` und `/skills/orchestrating-motion-language/SKILL.md`

**Für Gate-Enforcement Fragen**: Siehe `brudi-gate.sh` und `motion-compliance-check.sh`

---

**BRUDI Motion Protocol — Award-Level Motion by Default**
