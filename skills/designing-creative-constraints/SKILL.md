# Designing Creative Constraints

## Warum dieser Skill existiert

Brudi verhindert schlechten *Prozess* (fehlende Screenshots). Dieser Skill verhindert schlechtes *Design* durch Constraints statt Vorschläge.

**"Technically correct but boring"** ist nicht akzeptabel. Ein Button, der funktioniert, ist nicht genug. Ein Button, der 5 Interaktionen zeigt, ist Award-Level.

Dieser Skill definiert Complexity-Floors pro Komponente: Die Mindestanzahl von Animationen, Easing-Typen und Interaktionen, die eine Komponente haben MUSS, um "fertig" zu sein.

---

## Komplexitäts-Mindestanforderungen (Complexity Floor)

### Hero Section — 5+ GSAP-Animationen

Eine Hero ohne Animation ist ein statisches Bild. Eine Hero ist Award-Level wenn:

```javascript
// ✅ MINDESTANFORDERUNG: 5 Animationen
gsap.timeline()
  // 1. Preloader Fade Out
  .to('.preloader', { opacity: 0, duration: 0.8 }, 0)

  // 2. Hero Title Fade + Slide
  .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, 0.2)

  // 3. Hero Subtitle Stagger Reveal
  .from('.hero-subtitle span', {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.6,
  }, 0.4)

  // 4. Hero Image Zoom + Fade
  .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, 0.3)

  // 5. CTA Button Appear + Scale
  .from('.cta-button', {
    opacity: 0,
    scale: 0.9,
    duration: 0.6,
  }, 0.6);
```

**Anforderungen:**
- ✅ Mindestens 5 unterschiedliche Animations-Targets (Title, Subtitle, Image, Button, Decoration)
- ✅ Mindestens 3 verschiedene Easing-Typen (`ease`, `back.out`, `elastic`)
- ✅ Stagger auf Text-Elementen (min 0.05s)
- ✅ Alle 4 Dark-Layer visuell unterscheidbar
- ✅ Scroll-Indicator (z.B. "Scroll Down" Animation)
- ✅ Parallax oder Scroll-Trigger auf Image

**❌ NICHT AKZEPTABEL:**
- Hero ohne eine einzige Animation
- Nur Fade-In (alle equal duration)
- Kein Stagger (alle gleichzeitig)
- Image hat keinen visuellen Effekt (Parallax/Zoom)

---

### Section (Features, Services, Portfolio) — Entrance + 3+ Easing

Jede Standard-Section muss Entrance-Animation + Interaktivität haben:

```javascript
// ✅ MINDESTANFORDERUNG
ScrollTrigger.create({
  trigger: '.section',
  onEnter: () => {
    gsap.from('.section-content', {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power2.out', // Easing-Typ 1
    });

    gsap.staggerFrom('.section-card', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out', // Easing-Typ 2
    });
  },
});

// Hover auf Cards
gsap.utils.toArray('.section-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.03,
      duration: 0.3,
      ease: 'elastic.out(1.1)', // Easing-Typ 3
      overwrite: 'auto',
    });
  });
});
```

**Anforderungen:**
- ✅ Entrance Reveal (Fade + TranslateY)
- ✅ Stagger auf Children (min 0.08s)
- ✅ Minimum 3 verschiedene Easing-Typen pro Seite (`power2.out`, `back.out`, `elastic`)
- ✅ Card Hover: 3+ Properties (scale, shadow, border)
- ✅ Konsistente Animation Timing (Hero ≠ Section ≠ Footer)

**❌ NICHT AKZEPTABEL:**
- Abschnitt, der nur sichtbar wird (kein Fade/Slide)
- Alle Easing-Typen = `ease` (linear motion)
- Keine Stagger (alle Cards gleichzeitig)

---

### Card — Shadow + Color + Border auf Hover

```javascript
// ✅ MINDESTANFORDERUNG: 3 Properties auf Hover
const card = document.querySelector('.card');

card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    // Property 1: Shadow
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)',
    // Property 2: Color / Background
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    // Property 3: Border
    borderColor: 'rgba(255, 255, 255, 0.12)',
    duration: 0.2,
    ease: 'power1.out',
    overwrite: 'auto',
  });
});

card.addEventListener('mouseleave', () => {
  gsap.to(card, {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    duration: 0.3,
    ease: 'power1.out',
  });
});
```

**Anforderungen:**
- ✅ Base Shadow = `elevation-raised`
- ✅ Hover Shadow = `elevation-floating`
- ✅ Hover ändert mindestens 3 Properties (shadow, color, border)
- ✅ Transition max 300ms
- ✅ Backface-visibility nicht gebrochen (überprüfe auf Flicker)

**❌ NICHT AKZEPTABEL:**
- Hover ohne Shadow-Change
- Nur `opacity: 0.8` (keine echte Interaktion)
- Shadow als einziger Hover-Effekt

---

### Button — 5 States (Base/Hover/Active/Focus/Disabled)

```javascript
// ✅ MINDESTANFORDERUNG: Alle 5 States
export function Button({ children, onClick, disabled }) {
  return (
    <button
      className={`
        /* Base State */
        px-6 py-3 rounded-lg font-medium
        bg-blue-600 text-white
        shadow-md
        transition-all duration-200

        /* Hover State */
        hover:bg-blue-700
        hover:shadow-lg
        hover:-translate-y-0.5

        /* Active State */
        active:bg-blue-800
        active:shadow-sm
        active:translate-y-0

        /* Focus State */
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        focus:ring-offset-2

        /* Disabled State */
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:shadow-none
        disabled:hover:bg-blue-600
        disabled:hover:shadow-md
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**Anforderungen:**
- ✅ Base: Shadow + Font-Weight
- ✅ Hover: Transform + Shadow + Color (3+ properties)
- ✅ Active: Transform (smaller), Shadow (smaller)
- ✅ Focus: Ring (2px), Offset
- ✅ Disabled: Opacity 0.5, Cursor "not-allowed"
- ✅ Asymmetric Timing: Enter 150ms ≠ Exit 250ms

```css
/* ✅ Asymmetric Timing Example */
.button {
  transition: all 250ms ease-out; /* Exit langsamer */
}

.button:hover {
  transition: all 150ms ease-out; /* Enter schneller */
}
```

**❌ NICHT AKZEPTABEL:**
- Button nur mit `hover:bg-blue-700`
- Disabled State hat keine visuelle Unterscheidung
- Fokus-Ring fehlt (Accessibility!)
- Timing ist gleich (Enter = Exit)

---

### Input — 4 States + Focus Ring Animation

```jsx
// ✅ MINDESTANFORDERUNG
export function Input({ error, success, value, onChange }) {
  return (
    <div className="relative">
      <input
        className={`
          /* Base State */
          w-full px-4 py-2 rounded-lg
          bg-surface-high
          border border-subtle
          text-white

          /* Focus State */
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
          focus:border-blue-500

          /* Error State */
          ${error && 'border-red-500 focus:ring-red-500'}

          /* Success State */
          ${success && 'border-green-500 focus:ring-green-500'}
        `}
        value={value}
        onChange={onChange}
      />

      {/* Focus Ring Animation */}
      <style>{`
        input:focus {
          animation: focusGlow 0.3s ease-out;
        }

        @keyframes focusGlow {
          from {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          to {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>

      {/* Error State */}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <ErrorIcon /> {error}
        </p>
      )}

      {/* Success State */}
      {success && (
        <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
          <CheckIcon /> Success
        </p>
      )}
    </div>
  );
}
```

**Anforderungen:**
- ✅ Base: Subtle Border, Medium Shadow
- ✅ Focus: Ring (2px), Offset, Animation (glow keyframe)
- ✅ Error: Red Border + Red Ring + Icon
- ✅ Success: Green Border + Green Ring + Icon
- ✅ Focus Animation Duration: 200-300ms

**❌ NICHT AKZEPTABEL:**
- Input ohne Focus-State
- Nur Farbe ändert sich (kein Ring)
- Error State zeigt nur Rot (keine Error-Icon)

---

### Navigation — Sticky + Scroll Indicator + Hover Underline

```jsx
// ✅ MINDESTANFORDERUNG
export function Navigation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll Indicator Animation
      gsap.to('.scroll-indicator', {
        scaleX: window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
        duration: 0.1,
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-subtle">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex gap-8">
          {['Home', 'Services', 'Portfolio', 'Contact'].map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setActiveIndex(i)}
              className={`
                relative py-2 text-sm font-medium transition-colors duration-200
                ${activeIndex === i ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              {link}

              {/* Active Link Indicator */}
              {activeIndex === i && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{ width: '100%' }}
                />
              )}

              {/* Hover Underline */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 rounded-full
                              group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent
                      absolute bottom-0 left-0 w-full origin-left
                      scale-x-0 scale-x-[var(--scroll-progress)]" />
    </nav>
  );
}
```

**Anforderungen:**
- ✅ Position: `sticky` (bleibt beim Scrollen oben)
- ✅ Scroll Behavior: Transition smooth (150ms+)
- ✅ Active Link: Indikator mit AnimationLayout (Framer Motion) oder GSAP
- ✅ Hover Underline: Animation 200-300ms
- ✅ Scroll Progress Bar: Sichtbar am Bottom des Headers
- ✅ Touch Target: Min 48x48px auf Mobile

**❌ NICHT AKZEPTABEL:**
- Navigation ohne Sticky
- Nur Farb-Change auf Active (kein Underline)
- Kein Scroll-Indicator
- Zu kleine Touch-Ziele (< 48px)

---

## Forbidden Patterns (VERBOTEN)

### Pattern 1: Component ohne Entrance Animation

```javascript
// ❌ VERBOTEN
.card { opacity: 1; } /* Direkt sichtbar */

// ✅ RICHTIG
gsap.from('.card', {
  opacity: 0,
  y: 20,
  duration: 0.6,
});
```

**Grund:** Statische Komponenten fühlen sich tot an.

---

### Pattern 2: Nur 1-2 Easing-Typen pro Seite

```javascript
// ❌ VERBOTEN
gsap.to(el1, { ... , ease: 'power2.out' });
gsap.to(el2, { ... , ease: 'power2.out' }); // identisch!
gsap.to(el3, { ... , ease: 'power2.out' }); // identisch!

// ✅ RICHTIG
gsap.to(el1, { ... , ease: 'power2.out' });     // Smooth
gsap.to(el2, { ... , ease: 'back.out' });       // Bounce
gsap.to(el3, { ... , ease: 'elastic.out(1.2)' }); // Spring
```

**Grund:** Unterschiedliche Easing-Typen erzeugen Rhythmus.

---

### Pattern 3: Hover ändert nur eine Property

```javascript
// ❌ VERBOTEN
.button:hover { background-color: #0066ff; }

// ✅ RICHTIG
.button:hover {
  background-color: #0066ff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
```

**Grund:** Multi-Property Hover fühlt sich flüssig an.

---

### Pattern 4: Stagger == 0 (Alle gleichzeitig)

```javascript
// ❌ VERBOTEN
gsap.staggerFrom('.card', {
  opacity: 0,
  stagger: 0, // Null stagger = keine Animation!
});

// ✅ RICHTIG
gsap.staggerFrom('.card', {
  opacity: 0,
  stagger: 0.12, // 120ms Delay zwischen Cards
});
```

**Grund:** Stagger erzeugt Bewegungsfluss.

---

### Pattern 5: Asymmetric Timing vergessen

```javascript
// ❌ VERBOTEN
.button {
  transition: all 200ms; /* Gleich für Enter und Exit */
}

// ✅ RICHTIG
.button {
  transition: all 250ms; /* Exit langsamer */
}
.button:hover {
  transition: all 150ms; /* Enter schneller */
}
```

**Grund:** Asymmetrisches Timing fühlt sich natürlicher an.

---

### Pattern 6: `gsap.from()` mit String-Selektoren

```javascript
// ❌ VERBOTEN — Kann brechen
gsap.from('.hero-title', { opacity: 0 });

// ✅ RICHTIG — Explizite Refs
const heroTitleRef = useRef(null);
gsap.from(heroTitleRef.current, { opacity: 0 });
```

**Grund:** String-Selektoren können bei Re-Renders brechen. Refs sind zuverlässig.

---

### Pattern 7: Keine Scroll-Trigger Cleanup

```javascript
// ❌ VERBOTEN — Memory Leak
ScrollTrigger.create({
  trigger: '.section',
  onEnter: () => gsap.to(...),
  // Kein cleanup!
});

// ✅ RICHTIG — Mit Cleanup
useEffect(() => {
  const trigger = ScrollTrigger.create({
    trigger: '.section',
    onEnter: () => gsap.to(...),
  });

  return () => trigger.kill(); // Cleanup on unmount
}, []);
```

**Grund:** Scrolling bricht ohne Cleanup.

---

## "Zu Basic" Detection — Grep Pattern

Wenn einer dieser Patterns in Code gefunden wird, ist die Komponente zu einfach:

```bash
# Detektiere Komponenten ohne Animation
grep -r "className=.*hover:" --include="*.jsx" --include="*.tsx"
# Wenn NUR Tailwind Hover existiert (kein GSAP): TOO BASIC

# Detektiere Single-Easing pro Seite
grep -r "ease: 'power2.out'" --include="*.js" --include="*.jsx"
# Wenn mehr als 50% der Animations = power2.out: TOO BASIC

# Detektiere Stagger == 0
grep -r "stagger: 0" --include="*.js" --include="*.jsx"
# Wenn gefunden: TOO BASIC

# Detektiere fehlende Focus-States
grep -r ":focus {" --include="*.css" --include="*.scss"
# Wenn < 5 Focus-Rules: TOO BASIC auf Forms
```

---

## Komplexitäts-Floor pro Page-Type

### Landing Page — 25+ Animationen
- Hero: 5 Animationen
- Services Section: 8 Animationen (Stagger auf 4 Cards)
- Portfolio Section: 6 Animationen (Stagger auf 3 Cards)
- CTA Section: 3 Animationen
- Footer: 3 Animationen
- **Total:** 25+

**Easing-Typen:** Minimum 5 verschiedene (`power1.out`, `power2.out`, `back.out`, `elastic.out`, `expo.out`)

---

### SaaS Dashboard — 15+ Animationen
- Header Entrance: 2
- Sidebar Toggle: 2
- Data Card Load: 8 (staggered auf 4 Cards)
- Modal Open/Close: 2
- Form Submit Feedback: 1
- **Total:** 15+

**Easing-Typen:** Minimum 3 verschiedene (UI-Fokus über Motion)

---

### Portfolio — 30+ Animationen
- Hero Parallax: 4
- Case Study Scroll-Trigger: 8 (pro Section)
- Image Gallery: 4
- Hover auf 12 Portfolio-Items: 12 (1 pro Item)
- **Total:** 30+

**Easing-Typen:** Minimum 6 verschiedene (Rhythmus ist Kernfeature)

---

### Blog — 12+ Animationen
- Hero: 3
- Article List Scroll-Trigger: 4
- CTA Section: 3
- Comment Form Focus: 2
- **Total:** 12+

**Easing-Typen:** Minimum 2-3 (Content-Fokus)

---

## Do / Don't

### ✅ DO — Award-Level Komplexität

- **Jede Page hat Entrance-Animation für Sections**
  ```javascript
  /* ✅ */
  ScrollTrigger.create({
    trigger: '.section',
    onEnter: () => {
      gsap.from('.section-content', { opacity: 0, y: 40, duration: 0.8 });
    },
  });
  ```

- **3+ Easing-Typen sind REGEL, nicht Ausnahme**
  ```javascript
  /* ✅ */
  gsap.to(hero, { ease: 'power2.out' });
  gsap.to(cards, { ease: 'back.out' }); // Unterschiedlich!
  gsap.to(button, { ease: 'elastic.out(1.2)' }); // Unterschiedlich!
  ```

- **Stagger ist Standard für Listen**
  ```javascript
  /* ✅ */
  gsap.staggerFrom('.card', {
    opacity: 0,
    stagger: 0.1, // Mindestens 0.08-0.15
  });
  ```

- **Asymmetric Timing auf Hover**
  ```css
  /* ✅ */
  .button {
    transition: all 300ms ease-out; /* Exit = 300ms */
  }
  .button:hover {
    transition: all 150ms ease-out; /* Enter = 150ms */
  }
  ```

### ❌ DON'T — AI-Slop Komplexität

- **Komponente ohne Entrance-Animation ⛔**
  ```javascript
  /* ❌ */
  return <div className="card">Content</div>;
  /* Einfach sichtbar, keine Animation */
  ```

- **Alle Easing-Typen = `ease` ⛔**
  ```javascript
  /* ❌ */
  gsap.to(el1, { ease: 'ease' });
  gsap.to(el2, { ease: 'ease' });
  gsap.to(el3, { ease: 'ease' });
  /* Langweilig, keine Vielfalt */
  ```

- **Hover ohne Shadow/Transform ⛔**
  ```javascript
  /* ❌ */
  .button:hover { background-color: #0066ff; }
  /* Nur Farbe, keine Tiefe */
  ```

- **Stagger vergessen ⛔**
  ```javascript
  /* ❌ */
  gsap.from('.cards', { opacity: 0 }); // Alle gleichzeitig
  ```

---

## Minimal Recipe — Copy-Paste

### 1. Section Entrance Pattern

```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Section({ children, title }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Section Entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center+=100px',
        once: true,
      },
    });

    tl.from(sectionRef.current, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power2.out',
    })
      .from(cardsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12, // 120ms stagger
        ease: 'back.out',
      }, 0.2);

    return () => tl.kill();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <h2 className="text-4xl font-bold mb-12">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {children.map((child, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="rounded-lg bg-surface-high p-6"
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 2. Button mit 5 States

```jsx
export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
}) {
  const variantClass = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5
      active:bg-blue-800 active:shadow-sm active:translate-y-0
      focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    `,
    secondary: `
      bg-gray-700 text-white
      hover:bg-gray-600 hover:shadow-md
      active:bg-gray-800 active:shadow-sm
      focus:ring-2 focus:ring-gray-400
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };

  return (
    <button
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-150
        ${variantClass[variant]}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 3. Navigation mit Scroll Indicator

```jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Navigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef(null);

  const links = ['Home', 'About', 'Services', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      // Scroll Indicator Progress
      const scrollProgress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);

      gsap.to(indicatorRef.current, {
        scaleX: scrollProgress,
        duration: 0.1,
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex gap-12">
        {links.map((link, i) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={() => setActiveIndex(i)}
            className={`
              relative py-2 font-medium text-sm
              transition-colors duration-200
              ${activeIndex === i ? 'text-white' : 'text-gray-400 hover:text-white'}
            `}
          >
            {link}

            {/* Active Underline */}
            {activeIndex === i && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 rounded-full" />
            )}
          </a>
        ))}
      </div>

      {/* Scroll Progress */}
      <div
        ref={indicatorRef}
        className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500
                   absolute bottom-0 left-0 origin-left"
        style={{ width: '100%' }}
      />
    </nav>
  );
}
```

---

## Evidence Requirements (für PROJECT_STATUS.md)

Wenn ein Slice "Complexity Constraint Check" durchläuft:

1. **Animation Count** — Dokumentiere:
   ```
   Hero: 5 GSAP animations (title, subtitle, image, button, decoration)
   Services: 8 animations (4x card stagger + 4x entry)
   Total Page: 25+ animations
   ```

2. **Easing Diversity** — Dokumentiere:
   ```
   ✅ Easing Types Used:
   - power2.out (smooth)
   - back.out (bounce)
   - elastic.out (spring)
   - expo.out (fast)
   - power1.out (subtle)
   ✅ Total: 5 unique types (Min 3 for base level)
   ```

3. **Stagger Verification** — Dokumentiere:
   ```
   ✅ Card Lists Have Stagger:
   - Portfolio Cards: 0.12s
   - Service Cards: 0.1s
   - Team Cards: 0.08s
   ```

4. **State Coverage** — Dokumentiere:
   ```
   Button States: ✅ Base, ✅ Hover, ✅ Active, ✅ Focus, ✅ Disabled
   Input States: ✅ Base, ✅ Focus, ✅ Error, ✅ Success
   Card Hover: ✅ Shadow, ✅ Color, ✅ Border (3+ properties)
   ```

5. **Screenshot Evidence** — Zeige:
   - Desktop Screenshot mit Hover-State sichtbar
   - Mobile Screenshot mit Touch-Target-Größen sichtbar (48x48px)
   - Console: 0 Errors

---

## Fazit

Komplexität ist nicht Überengineering — es ist die Grenze zwischen Amateur und Award-Level.

**Die Mindestanforderung ist:**
- Hero: 5+ Animationen
- Sections: 3+ Easing-Typen pro Seite
- Cards: 3+ Properties auf Hover
- Buttons: Alle 5 States
- Navigation: Sticky + Scroll Indicator + Active State

Alles darunter ist zu einfach.

**"Technically correct but boring" ist NICHT akzeptabel.**
