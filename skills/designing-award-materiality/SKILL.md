# Designing Award Materiality

## Warum dieser Skill existiert

Flaches UI ist der häufigste AI-Slop-Fehler. Dieser Skill definiert ein deterministisches Materialitäts-System, das Tiefe, Interaktivität und visuelle Hierarchie durchgehend kommuniziert. Jede Oberfläche muss durch ihre Material-Eigenschaften ihre Funktion verraten.

---

## Das 4-Material-System

Jede Komponente hat EINEN primären Material-Typ. Ein Card kann nicht gleichzeitig "Matte" und "Frosted" sein — Material-Wechsel bedeutet Funktionswechsel.

### 1. Matte (Standard, Opaque)
- **Charakteristik:** Volle Deckkraft, reichhaltig an Detail und Textur
- **Einsatz:** Daten-Karten, analytische Oberflächen, Content-Container
- **Licht:** Direkte Top-Left Ausleuchtung (135°), starke Shadows
- **Beispiel:** Portfolio-Karte mit Bild, Text, Buttons
- **Opacity:** `bg-opacity-100`
- **Shadow Level:** RAISED oder FLOATING

```css
/* Matte Material Base */
.material-matte {
  background-color: var(--surface);
  opacity: 1;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### 2. Glossy (Interaktiv, Semi-opaque)
- **Charakteristik:** Leichte Transparenz mit Glanzlichtern, erzeugt "Tippe mich"-Gefühl
- **Einsatz:** CTA Buttons, interaktive Karten, Hover-Zustände
- **Licht:** Glanz von oben (0-50px Halo), klarer fokussierter Schatten
- **Beispiel:** "Get Started" Button, Hauptnavigation
- **Opacity:** `bg-opacity-90` mit `backdrop-blur-sm`
- **Shadow Level:** FLOATING auf Hover

```css
/* Glossy Material Base */
.material-glossy {
  background-color: var(--surface-gloss);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 50%
  );
  opacity: 0.9;
  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.2);
}

.material-glossy:hover {
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.3);
}
```

### 3. Frosted (Modern, Transluzent)
- **Charakteristik:** Tiefe Transluzenz mit Blur, moderner Glasmorphismus
- **Einsatz:** Navigations-Header, Modal-Overlays, Modals, Sticky-Container
- **Licht:** Subtile Top-Lighting mit diffusem Glanz
- **Beispiel:** Header bei Scroll, Semi-Modal Backdrop
- **Opacity:** `bg-opacity-60-80` mit `backdrop-blur-xl`
- **Shadow Level:** RAISED bis FLOATING

```css
/* Frosted Material Base */
.material-frosted {
  background-color: rgba(var(--surface-rgb), 0.7);
  background-image:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 40%
    );
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 4. Metallic (Premium, Opaque + Gradient)
- **Charakteristik:** Volle Deckkraft mit Gradient-Tiefe, Premium-Signal
- **Einsatz:** Premium-Badges, High-Status-Karten, Pricing-Highlights
- **Licht:** Diagonal-Gradient mit Accent-Color-Touch
- **Beispiel:** "Pro Badge", Featured Item, Limited Edition
- **Opacity:** `bg-opacity-100` mit Gradient
- **Shadow Level:** FLOATING (hoverable Highlights)

```css
/* Metallic Material Base */
.material-metallic {
  background: linear-gradient(
    135deg,
    var(--accent-dark) 0%,
    var(--accent) 50%,
    var(--accent-light) 100%
  );
  opacity: 1;
  box-shadow:
    0 4px 12px rgba(var(--accent-rgb), 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.material-metallic:hover {
  box-shadow:
    0 8px 20px rgba(var(--accent-rgb), 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.25),
    inset 0 -2px 4px rgba(0, 0, 0, 0.15);
}
```

---

## Card Elevation System (4 Level)

Elevation ist nicht nur Shadow — es ist das Verhältnis zwischen Distanz, Opacity und Motion.

### Level 1: FLAT
- **Wann:** Disabled States, Background Elements, Separators
- **Shadow:** Kein Shadow oder `shadow-sm` (0.5px nur)
- **Z-Index:** `z-0`
- **Interaktiv:** Nein
- **Beispiel:** Deaktivierter Button, Hintergrund-Linie

```css
.elevation-flat {
  box-shadow: none;
  /* oder: box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.05); */
}
```

### Level 2: RAISED
- **Wann:** Base Cards, Standard Buttons, Navigation Items
- **Shadow Stack:** 3-fach Shadow für Tiefe
  - Layer 1 (Nähe): `0 1px 2px rgba(0, 0, 0, 0.05)`
  - Layer 2 (Schatten): `0 2px 4px rgba(0, 0, 0, 0.1)`
  - Layer 3 (Kern): `0 4px 8px rgba(0, 0, 0, 0.15)`
- **Z-Index:** `z-10`
- **Interaktiv:** Ja, kann zu FLOATING hovern
- **Beispiel:** Portfolios-Karte, Standard Button

```css
.elevation-raised {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### Level 3: FLOATING
- **Wann:** Hover States, Active Cards, Focussed Elements
- **Shadow Stack:** 4-fach Shadow mit erweiterte Wirkung
  - Layer 1: `0 2px 4px rgba(0, 0, 0, 0.05)`
  - Layer 2: `0 4px 8px rgba(0, 0, 0, 0.1)`
  - Layer 3: `0 8px 16px rgba(0, 0, 0, 0.15)`
  - Layer 4: `0 16px 32px rgba(0, 0, 0, 0.2)`
- **Z-Index:** `z-20`
- **Motion:** Transition 200ms `cubic-bezier(0.4, 0, 0.2, 1)`
- **Beispiel:** Gehoverter Card, Focus State

```css
.elevation-floating {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.2);
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Level 4: HOVERING
- **Wann:** Modals, Dropdown Menus, Maximum Lift (Dialoge)
- **Shadow Stack:** 5-fach + Drama
  - Layer 1: `0 4px 8px rgba(0, 0, 0, 0.05)`
  - Layer 2: `0 8px 16px rgba(0, 0, 0, 0.1)`
  - Layer 3: `0 16px 32px rgba(0, 0, 0, 0.15)`
  - Layer 4: `0 32px 64px rgba(0, 0, 0, 0.2)`
  - Layer 5: `0 64px 128px rgba(0, 0, 0, 0.1)`
- **Z-Index:** `z-50` (Modal-Level)
- **Backdrop:** `backdrop-blur-md` + `bg-black/30`
- **Beispiel:** Modal, Toast, Dropdown

```css
.elevation-hovering {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.05),
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.15),
    0 32px 64px rgba(0, 0, 0, 0.2),
    0 64px 128px rgba(0, 0, 0, 0.1);
}
```

---

## Light Direction Overlays

Lichtrichtung ist eine *Design-Entscheidung*, nicht Zufall. Alle Komponenten auf einer Seite teilen die gleiche Lichtquelle.

### Light Direction: Top-Left (135°) — Standard
- **Winkel:** 135 Grad (von oben-links)
- **Einsatz:** Standard für alle award-level UIs
- **Glanz:** Oben-links wird hell, unten-rechts dunkel

```css
/* Light Direction Gradient: Top-Left */
.light-direction-135 {
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    transparent 70%
  );
}

/* Auf Dark Background */
.dark-bg .light-direction-135 {
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 50%
  );
}
```

### Light Direction: Top-Center (180°) — Symmetrisch
- **Winkel:** 180 Grad (von oben)
- **Einsatz:** Buttons, Badges, zentrierte Komponenten
- **Glanz:** Symmetrisch oben

```css
/* Light Direction Gradient: Top-Center */
.light-direction-180 {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
}
```

### Light Direction: Top-Right (225°) — Dramatisch
- **Winkel:** 225 Grad (von oben-rechts)
- **Einsatz:** Premium Features, Featured Content, Highlights
- **Glanz:** Oben-rechts wird hell, unten-links dramatisch dunkel

```css
/* Light Direction Gradient: Top-Right */
.light-direction-225 {
  background-image: linear-gradient(
    225deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 35%,
    transparent 70%
  );
}
```

**Konsistenz-Regel:** Wähle eine Lichtrichtung pro Page. Ändere sie nur wenn ein neuer Abschnitt beginnt, NICHT innerhalb eines Abschnitts.

---

## Border Intelligence (5 Level)

Borders sind keine Dekorationn — sie sind Struktur-Signale.

### Level 1: NONE
- **Wann:** Solid-Background-Karten, hochkontrast Elemente
- **Rendering:** Kein Border

```css
.border-none {
  border: none;
}
```

### Level 2: SUBTLE
- **Wann:** Sanfte Separation zwischen Elementen
- **Farbe:** Weiß bei 2% Opacity `rgba(255, 255, 255, 0.02)`
- **Breite:** `1px`
- **Beispiel:** Zwischen zwei gleichwertigen Cards

```css
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.02);
}
```

### Level 3: LIGHT-EDGE
- **Wann:** Oberkanten von Karten (simulates Licht)
- **Rendering:** Nur `border-top` + `border-left`
- **Farbe:** Gradient von Weiß (oben) zu Transparent
- **Beispiel:** Oberseite einer Card

```css
.border-light-edge {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  border-right: 1px solid rgba(255, 255, 255, 0);
}
```

### Level 4: GRADIENT
- **Wann:** Feature-Karten, Hover-States, interaktive Elemente
- **Rendering:** Voller 135°-Gradient Border
- **Farbe:** Von `rgba(255, 255, 255, 0.2)` zu `rgba(255, 255, 255, 0.02)`
- **Breite:** `2px`
- **Beispiel:** Gehoverter Button, Premium-Card

```css
.border-gradient {
  position: relative;
  border: 2px solid transparent;
  background-image:
    linear-gradient(
      var(--surface),
      var(--surface)
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

### Level 5: GLOW
- **Wann:** Focus States, Active States, Call-to-Action Highlights
- **Rendering:** Border + Shadow-Glow in Accent-Farbe
- **Farbe:** Accent-Color mit Shadow-Blur
- **Beispiel:** Focus Button, Active Navigation Item

```css
.border-glow {
  border: 2px solid var(--accent);
  box-shadow:
    0 0 8px var(--accent-color-rgba-0.3),
    inset 0 0 8px var(--accent-color-rgba-0.1);
}
```

---

## Do / Don't (Bestanden / Nicht bestanden)

### ✅ DO — Award-Level Materialität

- **Jede Card hat mindestens RAISED Elevation**
  ```css
  /* ✅ */
  .card {
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.05),
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.15);
  }
  ```

- **Hover ändert Elevation (RAISED → FLOATING)**
  ```css
  /* ✅ */
  .card:hover {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.05),
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 8px 16px rgba(0, 0, 0, 0.15),
      0 16px 32px rgba(0, 0, 0, 0.2);
  }
  ```

- **Borders nutzen RGBA oder Gradients (nie solid #ccc)**
  ```css
  /* ✅ */
  .card {
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  ```

- **Light Direction konsistent pro Seite**
  ```css
  /* ✅ Alle Overlays nutzen 135° */
  .card, .button, .input {
    background-image: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
  }
  ```

- **4 Depth Layer auf dunklem Hintergrund**
  ```css
  /* ✅ Dark Theme Stack */
  :root {
    --surface: #0f0f0f;           /* Layer 1 - Background */
    --surface-high: #1a1a1a;      /* Layer 2 - Cards */
    --surface-higher: #2a2a2a;    /* Layer 3 - Hover */
    --surface-highest: #3a3a3a;   /* Layer 4 - Focus */
  }
  ```

### ❌ DON'T — AI-Slop Materialität

- **Flat Cards ohne Shadow ⛔**
  ```css
  /* ❌ VERBOTEN */
  .card {
    background-color: #1a1a1a;
    /* Kein Shadow! */
  }
  ```

- **Einheitliche 1px Borders überall ⛔**
  ```css
  /* ❌ VERBOTEN */
  .card, .button, .input {
    border: 1px solid #333;
  }
  ```

- **Nur Color-Change auf Hover ⛔**
  ```css
  /* ❌ VERBOTEN */
  .button:hover {
    background-color: #0066ff; /* nur Farbe */
  }
  /* ✅ RICHTIG */
  .button:hover {
    background-color: #0066ff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  ```

- **Keine Glassmorphism-Fallbacks ⛔**
  ```css
  /* ❌ VERBOTEN */
  .modal {
    backdrop-filter: blur(16px);
    /* Kein Fallback für alte Browser */
  }
  /* ✅ RICHTIG */
  .modal {
    background-color: rgba(15, 15, 15, 0.7);
    @supports (backdrop-filter: blur(16px)) {
      backdrop-filter: blur(16px);
    }
  }
  ```

- **Gleiche Shadow auf Base und Hover ⛔**
  ```css
  /* ❌ VERBOTEN */
  .card {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  .card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* identisch! */
  }
  ```

---

## Minimal Recipe — Copy-Paste

### 1. CSS Variablen Setup

```css
:root {
  /* Dark Theme Base */
  --surface: #0f0f0f;
  --surface-high: #1a1a1a;
  --surface-higher: #2a2a2a;
  --surface-highest: #3a3a3a;

  /* Accent */
  --accent: #0066ff;
  --accent-dark: #0052cc;
  --accent-light: #4d94ff;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(0, 0, 0, 0.2);
}
```

### 2. Material Classes

```css
/* Matte */
.material-matte {
  background-color: var(--surface-high);
  box-shadow: var(--shadow-sm), var(--shadow-md), var(--shadow-lg);
}

/* Glossy */
.material-glossy {
  background-color: rgba(var(--surface-high), 0.9);
  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.1),
    var(--shadow-md);
}

/* Frosted */
.material-frosted {
  background-color: rgba(var(--surface), 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Metallic */
.material-metallic {
  background: linear-gradient(
    135deg,
    var(--accent-dark) 0%,
    var(--accent) 50%,
    var(--accent-light) 100%
  );
  box-shadow:
    0 4px 12px rgba(var(--accent), 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}
```

### 3. Elevation States

```css
/* RAISED */
.elevation-raised {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.15);
}

/* FLOATING (für Hover) */
.elevation-floating {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.2);
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* HOVERING (für Modals) */
.elevation-hovering {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.05),
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.15),
    0 32px 64px rgba(0, 0, 0, 0.2),
    0 64px 128px rgba(0, 0, 0, 0.1);
}
```

### 4. Tailwind Integration

```javascript
/* tailwind.config.js */
export default {
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f0f0f',
          high: '#1a1a1a',
          higher: '#2a2a2a',
          highest: '#3a3a3a',
        },
      },
      boxShadow: {
        'material-raised': `
          0 1px 2px rgba(0, 0, 0, 0.05),
          0 2px 4px rgba(0, 0, 0, 0.1),
          0 4px 8px rgba(0, 0, 0, 0.15)
        `,
        'material-floating': `
          0 2px 4px rgba(0, 0, 0, 0.05),
          0 4px 8px rgba(0, 0, 0, 0.1),
          0 8px 16px rgba(0, 0, 0, 0.15),
          0 16px 32px rgba(0, 0, 0, 0.2)
        `,
        'material-hovering': `
          0 4px 8px rgba(0, 0, 0, 0.05),
          0 8px 16px rgba(0, 0, 0, 0.1),
          0 16px 32px rgba(0, 0, 0, 0.15),
          0 32px 64px rgba(0, 0, 0, 0.2),
          0 64px 128px rgba(0, 0, 0, 0.1)
        `,
      },
    },
  },
};
```

### 5. React Component Beispiel

```jsx
export function PortfolioCard({ project }) {
  return (
    <div className="material-matte elevation-raised hover:elevation-floating
                    border border-subtle light-direction-135
                    rounded-xl p-6 transition-all duration-200">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{project.description}</p>

      <button className="material-glossy elevation-raised hover:elevation-floating
                         w-full py-2 rounded-lg font-medium text-white
                         transition-all duration-200">
        View Project
      </button>
    </div>
  );
}
```

---

## Anti-Patterns (VERBOTEN)

1. **Card mit nur `bg-gray-800` ohne Shadow**
   ```css
   /* ❌ */
   .card { background-color: #1f1f1f; }
   /* Result: FLAT UI, keine Tiefe */
   ```

2. **Button mit nur `hover:bg-blue-600`**
   ```css
   /* ❌ */
   .button:hover { background-color: #0066ff; }
   /* Result: Keine Elevation, keine Motion */
   ```

3. **Modal ohne `backdrop-blur` + `backdrop-brightness`**
   ```css
   /* ❌ */
   .modal-backdrop { background-color: rgba(0, 0, 0, 0.5); }
   /* Result: Flaches Modal, keine Premium-Feel */
   ```

4. **Section ohne Layer-Differenzierung**
   ```css
   /* ❌ */
   .section { background-color: #0f0f0f; }
   .card { background-color: #0f0f0f; } /* identisch! */
   /* Result: Keine visuelle Hierarchie */
   ```

5. **Borders mit solid #333 überall**
   ```css
   /* ❌ */
   * { border: 1px solid #333; }
   /* Result: Billig, monoton, keine Intelligenz */
   ```

---

## Evidence Requirements (für PROJECT_STATUS.md)

Wenn ein Slice mit Materialität abgeschlossen wird, dokumentiere:

1. **Desktop Screenshot** — Zeigt:
   - Shadow-Hierarchie (FLAT, RAISED, FLOATING erkennbar)
   - Border-Intelligenz (nicht nur 1px überall)
   - Material-Unterscheidung (Matte vs Glossy erkennbar)
   - Light Direction konsistent

2. **Mobile 375px Screenshot** — Zeigt:
   - Gleiches Shadow-System wie Desktop
   - Borders nicht ausgequetscht
   - Material-Effekte noch sichtbar (kein Shadow-Collapse)

3. **Hover State Screenshot** — Zeigt:
   - Elevation ändert sich (RAISED → FLOATING)
   - Shadow wird größer/dramatischer
   - Border kann Glow zeigen

4. **Console = 0 Errors** — DevTools zeigt keine Warnings zu:
   - `backdrop-filter` (sollte fallback haben)
   - CSS-Parsing-Fehler

5. **Quality Gate Check** — Mindestens 3 von:
   - Jede Card hat Shadow (nicht flat)
   - Hover zeigt Elevation-Change
   - Borders nutzen RGBA oder Gradient (nicht solid #333)
   - Light Direction konsistent
   - 4 Dark-Layer erkennbar

---

## Fazit

Materialität ist das Unterscheidungsmerkmal zwischen award-level und AI-Slop. Jeder Pixel muss eine Funktion haben — Shadows sind nicht Dekoration, Borders sind nicht optional, und Hover-States müssen Tiefe zeigen.

Baue mit Material-Bewusstsein: **Flat ist Tod.**
