---
name: webdev-design
description: Create award-level visual design for websites and web apps. Anti-AI-slop typography, bold color choices, premium aesthetics. Use when designing layouts, choosing colors, typography, or creating visual hierarchy.
version: 0.1.0
---

# WebDev Design — Award-Level Visual Design

Create distinctive, memorable websites that could compete on Awwwards. This skill covers typography, color, layout, and the principles that separate award-winning design from generic output.

## Design Thinking Process

Before any visual work:

1. **Define the Tone** — Pick ONE direction and commit:
   - Brutally minimal
   - Maximalist/chaotic
   - Retro-futuristic
   - Organic/natural
   - Luxury/refined
   - Playful/toy-like
   - Editorial/magazine
   - Brutalist/raw
   - Art deco/geometric
   - Soft/pastel
   - Industrial/utilitarian

2. **Identify the ONE Thing** — What will someone remember about this site?

3. **Set Constraints** — These create creativity, not limitations

## Typography

### The Rules

Typography is 90% of web design. Get this right.

**Never use:**
- Inter (overused to death)
- Roboto (Android default = generic)
- Arial (Windows default = amateur)
- System fonts without intention

**Instead, consider:**
- **Display/Headlines:** Distinctive, characterful (Playfair Display, Clash Display, Cabinet Grotesk)
- **Body:** Readable but not boring (Satoshi, General Sans, Plus Jakarta Sans)
- **Monospace:** When technical (JetBrains Mono, Fira Code)

**Pairing Pattern:**
```
Display: Bold, distinctive, makes a statement
Body: Readable, comfortable, complements display
```

### Typography Scale

Use a consistent scale based on a ratio:
```css
/* Perfect Fourth (1.333) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.333rem;   /* 21px */
--text-xl: 1.777rem;   /* 28px */
--text-2xl: 2.369rem;  /* 38px */
--text-3xl: 3.157rem;  /* 51px */
--text-4xl: 4.209rem;  /* 67px */
```

### Spacing with Typography
```css
/* Headings: tighter tracking, tighter line height */
h1 {
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Body: more relaxed */
p {
  letter-spacing: 0;
  line-height: 1.6;
}

/* Uppercase: needs more tracking */
.label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: var(--text-xs);
}
```

## Color

### Building a Palette

**Start with ONE dominant color.** Everything else supports it.

```css
:root {
  /* Dominant */
  --color-primary: #E8A94A;
  
  /* Supporting - derived from primary */
  --color-primary-light: color-mix(in oklch, var(--color-primary), white 20%);
  --color-primary-dark: color-mix(in oklch, var(--color-primary), black 20%);
  
  /* Neutrals - with subtle tint toward primary */
  --color-bg: #09090B;
  --color-surface: #131316;
  --color-text: #FAFAFA;
  --color-text-muted: #A1A1AA;
  
  /* Accent - intentionally different from primary */
  --color-accent: #3B82F6;
}
```

### Dark Mode Done Right

Dark mode is not "invert colors". It's a different design.

**Principles:**
1. Never pure black (#000) or pure white (#FFF)
2. Reduce contrast slightly (text ~90% white, not 100%)
3. Shadows become glows
4. Saturate colors slightly more

```css
/* Dark mode example */
.dark {
  --color-bg: #09090B;       /* Not pure black */
  --color-text: #FAFAFA;     /* Not pure white */
  --color-surface: #131316;  /* Subtle elevation */
}

/* Card in dark mode uses subtle border, not shadow */
.card {
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Contrast Requirements

WCAG AA minimum contrast ratios:
- Normal text: 4.5:1
- Large text (18px+ or 14px+ bold): 3:1
- UI components: 3:1

**Tools:** Use WebAIM Contrast Checker or browser DevTools

## Layout

### Visual Hierarchy

Create clear hierarchy through:
1. **Size** — Bigger = more important
2. **Weight** — Bolder = more important
3. **Color** — More contrast = more important
4. **Spacing** — More space around = more important
5. **Position** — Top-left (Western) = seen first

### The Grid

Don't break the grid randomly. Break it INTENTIONALLY.

```css
/* Base grid */
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

/* Intentional break - hero spans full width */
.hero {
  grid-column: 1 / -1;
}

/* Asymmetric but intentional */
.content {
  grid-column: 2 / 8;  /* Not centered, intentionally left-heavy */
}
```

### White Space

White space is not empty space. It's breathing room.

**Common mistake:** Everything too close together
**Solution:** When in doubt, add more space

```css
/* Section spacing */
section {
  padding-block: 6rem; /* Generous vertical space */
}

/* Between elements */
.stack > * + * {
  margin-top: 1.5rem;
}
```

## Premium Details

The difference between good and great is in the details.

### Micro-Interactions

```css
/* Button with subtle depth */
.button {
  transition: all 0.2s ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active {
  transform: translateY(0);
}
```

### Shimmer Effect (Premium Feel)

```css
.shimmer {
  background: linear-gradient(
    110deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
```

### Glassmorphism (Used Sparingly)

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### Gradient Borders

```css
.gradient-border {
  position: relative;
  background: var(--color-surface);
  border-radius: 16px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #E8A94A, #D4773A);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

## Anti-Patterns (What NOT To Do)

### Generic AI Aesthetics
- ❌ Purple-to-blue gradient on white background
- ❌ Rounded corners everywhere with no variation
- ❌ Generic stock photography
- ❌ "Clean and modern" without distinctive character
- ❌ Centered everything without visual tension

### Safe Choices
- ❌ Using only neutral colors because "safe"
- ❌ Using only one font weight
- ❌ Avoiding asymmetry
- ❌ Making everything the same size

### False Sophistication
- ❌ Blur everywhere = "glassmorphism"
- ❌ Gradient on everything = "modern"
- ❌ Animations on everything = "interactive"

## Questions Before Designing

1. What's the ONE THING someone will remember?
2. Would I be proud to show this on Awwwards?
3. Does this have a distinctive character or is it generic?
4. Can I defend every design decision?
5. Would this work if I removed 30% of the elements?

## Real Examples

### Good: Bold Typography + Generous Space
```css
.hero-title {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.95;
}
```

### Good: Intentional Asymmetry
```css
.layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
}
```

### Good: Restrained Color
```css
/* One accent color, everything else neutral */
.highlight {
  color: var(--color-primary);
}
/* All other text uses neutral palette */
```

---

**Remember:** Award-winning design is not about following trends. It's about making intentional choices and executing them flawlessly.

*If it looks like everyone else's website, start over.*
