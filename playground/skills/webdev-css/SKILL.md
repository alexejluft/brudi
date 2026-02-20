---
name: webdev-css
description: Master CSS layouts with Grid, Container Queries, Flexbox, and modern features. Deep understanding of fr units, containment, logical properties, and responsive patterns without media queries. Use when building layouts, making components responsive, or implementing design systems.
version: 0.1.0
---

# WebDev CSS — Modern Layout Mastery

Build layouts that work everywhere with deep understanding, not copy-paste. This skill covers Grid, Container Queries, Flexbox, Custom Properties, and modern CSS features.

## Mental Models First

Before any code, understand these concepts:

### CSS Grid: The 2D System

Grid is about **lines**, not boxes.

```
      Line 1   Line 2   Line 3   Line 4
         |       |        |        |
         v       v        v        v
         +-------+--------+--------+
         | Track | Track  | Track  |
         |   1   |   2    |   3    |
         +-------+--------+--------+
```

- **Lines** are numbered starting at 1
- **Tracks** are the spaces BETWEEN lines
- Items position themselves by referencing lines

### The fr Unit — Really Understood

`fr` = **Fraction of FREE space** (not total space!)

```
Container: 400px
Columns: 100px 1fr 2fr

Step 1: Fixed sizes first → 400px - 100px = 300px FREE
Step 2: Sum fr values → 1fr + 2fr = 3fr  
Step 3: Calculate → 1fr = 300px ÷ 3 = 100px
Result: 100px | 100px | 200px
```

**Key insight:** Fixed sizes are ALWAYS satisfied first. fr divides what's left.

---

## CSS Grid

### Basic Grid Setup

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
  gap: 2rem;                               /* Gutters */
}
```

### Common Column Patterns

```css
/* 3 equal columns */
grid-template-columns: 1fr 1fr 1fr;
grid-template-columns: repeat(3, 1fr);  /* Same, shorter */

/* Fixed + flexible */
grid-template-columns: 250px 1fr;       /* Sidebar + main */
grid-template-columns: 200px 1fr 200px; /* Fixed | flex | fixed */

/* Responsive without media queries */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

/* Min width with flexible max */
grid-template-columns: minmax(200px, 1fr) 2fr;
```

### auto-fit vs auto-fill

```css
/* auto-fit: Stretches items to fill space */
repeat(auto-fit, minmax(200px, 1fr))
/* 3 items in 1200px = each item stretches to 400px */

/* auto-fill: Creates empty tracks if space available */
repeat(auto-fill, minmax(200px, 1fr))
/* 3 items in 1200px = 6 tracks of 200px, 3 empty */
```

**Use auto-fit** in 99% of cases. Use auto-fill only when you need placeholder tracks.

### Grid Areas (Visual Layout)

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**Bonus:** Lines get automatic names: `header-start`, `header-end`, etc.

### Justify vs Align (Never Forget)

```
justify-* = HORIZONTAL (inline axis) →
align-*   = VERTICAL (block axis) ↓
```

| Property | Affects |
|----------|---------|
| `justify-items` | All items within their cells (horizontal) |
| `align-items` | All items within their cells (vertical) |
| `justify-content` | The entire grid within container (horizontal) |
| `align-content` | The entire grid within container (vertical) |
| `justify-self` | One item (horizontal) |
| `align-self` | One item (vertical) |

**Shorthand:** `place-items: center` = `align-items: center` + `justify-items: center`

### Item Positioning

```css
/* By line numbers */
.item {
  grid-column: 1 / 3;    /* From line 1 to line 3 (spans 2 columns) */
  grid-row: 2 / 4;       /* From line 2 to line 4 (spans 2 rows) */
}

/* Span syntax */
.item {
  grid-column: span 2;   /* Span 2 columns from current position */
}

/* Negative lines (count from end) */
.full-width {
  grid-column: 1 / -1;   /* First to last line = full width */
}

/* Named area */
.item {
  grid-area: main;
}
```

---

## Container Queries

### The Problem Container Queries Solve

Media Queries ask the **viewport**. But a component doesn't know where it is in the layout.

```
Same viewport width:
├── Sidebar (narrow) → Card should be stacked
└── Main area (wide) → Card should be horizontal

Media Queries can't distinguish. Container Queries can.
```

### The Golden Rule

> **"You cannot change what you measure."**

If you query the container's **width**, you cannot change the container's width. Only **children** can be styled.

### Why It Was "Impossible" for 20 Years

The endless loop problem:

1. Container is 100px wide
2. `@container (max-width: 150px)` matches → font-size increases
3. Bigger text → container grows to 200px
4. Condition no longer matches → font-size decreases
5. Container shrinks → condition matches again...
6. **INFINITE LOOP**

**Solution: Containment API** — The container does NOT react to its content. Size is "contained".

### container-type Values

```css
/* inline-size (USE THIS 90% of the time) */
.wrapper {
  container-type: inline-size;
}
/* Query WIDTH, height grows naturally with content */

/* size */
.wrapper {
  container-type: size;
}
/* Query BOTH width and height, but height must be explicit */

/* normal (default) */
/* Only style queries, no size queries */
```

### Basic Syntax

```css
/* 1. Define container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;  /* Optional, for targeting */
}

/* Shorthand */
.card-wrapper {
  container: card / inline-size;
}

/* 2. Write query */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}

/* Without name — matches ANY ancestor container */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Container Query Units

```css
cqw  /* 1% of container width */
cqh  /* 1% of container height */
cqi  /* 1% of container inline-size (= width in LTR) */
cqb  /* 1% of container block-size (= height in LTR) */
cqmin /* Smaller of cqi/cqb */
cqmax /* Larger of cqi/cqb */
```

**Practical use:**

```css
.card-title {
  font-size: clamp(1rem, 5cqi, 2rem);  /* Scales with container */
}
```

### Style Queries (Experimental)

Query CSS custom property values, not size:

```css
.card {
  --theme: dark;
}

@container style(--theme: dark) {
  .card-content {
    background: #1a1a1a;
    color: white;
  }
}
```

---

## Flexbox

### When Grid, When Flexbox?

| Use Grid | Use Flexbox |
|----------|-------------|
| 2D layouts | 1D layouts (row OR column) |
| Known structure | Unknown number of items |
| Page layouts | Component internals |
| Asymmetric designs | Even distribution |

**Rule of thumb:** If you're thinking "rows AND columns", use Grid. If "items in a line", use Flexbox.

### Flexbox Fundamentals

```css
.flex-container {
  display: flex;
  flex-direction: row;      /* row | column | row-reverse | column-reverse */
  justify-content: center;  /* Main axis alignment */
  align-items: center;      /* Cross axis alignment */
  gap: 1rem;                /* Modern spacing (no margin hacks) */
}
```

### flex Property Demystified

```css
flex: 1;
/* Expands to: */
flex-grow: 1;    /* Take available space */
flex-shrink: 1;  /* Shrink if needed */
flex-basis: 0;   /* Start from 0 width */

flex: 0 0 200px;
/* Expands to: */
flex-grow: 0;     /* Don't grow */
flex-shrink: 0;   /* Don't shrink */
flex-basis: 200px; /* Fixed 200px width */
```

### Common Flex Patterns

```css
/* Spacer pushes items apart */
.nav {
  display: flex;
  gap: 1rem;
}
.nav .spacer {
  flex: 1;  /* Takes all available space */
}

/* Even distribution */
.cards {
  display: flex;
  gap: 1rem;
}
.card {
  flex: 1;  /* All cards equal width */
}

/* Minimum width with wrapping */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

---

## Custom Properties (CSS Variables)

### Theming System

```css
:root {
  /* Colors */
  --color-primary: #E8A94A;
  --color-bg: #09090B;
  --color-surface: #131316;
  --color-text: #FAFAFA;
  --color-text-muted: #A1A1AA;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
}
```

### Component-Scoped Variables

```css
.button {
  --btn-bg: var(--color-primary);
  --btn-color: white;
  --btn-padding: var(--space-sm) var(--space-md);
  
  background: var(--btn-bg);
  color: var(--btn-color);
  padding: var(--btn-padding);
}

.button--secondary {
  --btn-bg: transparent;
  --btn-color: var(--color-primary);
}
```

### Dark Mode with Variables

```css
:root {
  --color-bg: #ffffff;
  --color-text: #09090B;
}

[data-theme="dark"] {
  --color-bg: #09090B;
  --color-text: #FAFAFA;
}

/* Or with media query */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #09090B;
    --color-text: #FAFAFA;
  }
}
```

---

## Modern CSS Features

### Logical Properties (RTL-Ready)

```css
/* Instead of margin-left/right */
margin-inline-start: 1rem;
margin-inline-end: 2rem;

/* Instead of padding-top/bottom */
padding-block-start: 1rem;
padding-block-end: 1rem;

/* Shorthand */
margin-inline: 1rem 2rem;  /* start | end */
padding-block: 1rem;        /* both */

/* Instead of width/height */
inline-size: 100%;  /* width in LTR */
block-size: 50vh;   /* height in LTR */
```

### :has() Parent Selector

```css
/* Style parent based on child */
.form-group:has(input:invalid) {
  border-color: red;
}

/* Body when modal is open */
body:has(.modal[open]) {
  overflow: hidden;
}

/* Card with image vs without */
.card:has(img) {
  grid-template-rows: 200px 1fr;
}
```

### clamp() for Fluid Values

```css
/* Fluid typography */
font-size: clamp(1rem, 0.5rem + 2vw, 2rem);
/*              min    preferred    max */

/* Fluid spacing */
padding: clamp(1rem, 5vw, 3rem);

/* Fluid width */
width: clamp(300px, 50%, 600px);
```

### color-mix() for Dynamic Colors

```css
/* Lighten a color */
background: color-mix(in oklch, var(--color-primary), white 20%);

/* Darken a color */
background: color-mix(in oklch, var(--color-primary), black 20%);

/* Transparency */
background: color-mix(in oklch, var(--color-primary), transparent 50%);
```

---

## Layout Patterns

### The Stack (Vertical Rhythm)

```css
.stack > * + * {
  margin-block-start: var(--space-md);
}

/* With custom spacing */
.stack[data-space="lg"] > * + * {
  margin-block-start: var(--space-lg);
}
```

### The Cluster (Horizontal Grouping)

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}
```

### The Sidebar Layout

```css
.with-sidebar {
  display: grid;
  grid-template-columns: minmax(250px, 25%) 1fr;
  gap: var(--space-lg);
}

/* Responsive: Stack on small screens */
@container (max-width: 700px) {
  .with-sidebar {
    grid-template-columns: 1fr;
  }
}
```

### The Center

```css
.center {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

/* Or with max-width */
.center-content {
  max-width: 65ch;
  margin-inline: auto;
  padding-inline: var(--space-md);
}
```

### The Cover (Full Height Hero)

```css
.cover {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  padding: var(--space-lg);
}

.cover > .centered {
  align-self: center;
}
```

---

## Anti-Patterns

### ❌ Don't: Magic Numbers

```css
/* BAD */
.element {
  margin-top: 37px;
  width: 847px;
}

/* GOOD */
.element {
  margin-top: var(--space-lg);
  width: min(100%, 60rem);
}
```

### ❌ Don't: Overusing !important

```css
/* BAD */
.button {
  background: blue !important;
}

/* GOOD - Fix specificity instead */
.button.button {
  background: blue;
}
```

### ❌ Don't: Fixed Heights on Text Containers

```css
/* BAD - Will break with different content */
.card {
  height: 200px;
}

/* GOOD */
.card {
  min-height: 200px;
}
```

### ❌ Don't: Mixing Layout Concerns

```css
/* BAD - Card knows about its container */
.card {
  width: 33.33%;
  margin-right: 20px;
}

/* GOOD - Container handles layout */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.card {
  /* Only internal styles */
}
```

### ❌ Don't: Media Query for Everything

```css
/* BAD */
@media (max-width: 768px) {
  .cards { grid-template-columns: 1fr; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1025px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

/* GOOD - One rule, works everywhere */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
```

---

## Quick Reference

### Grid Container

```css
display: grid;
grid-template-columns: ...;
grid-template-rows: ...;
grid-template-areas: ...;
gap: ...;
place-items: ...;
place-content: ...;
```

### Grid Item

```css
grid-column: start / end;
grid-row: start / end;
grid-area: name;
place-self: ...;
```

### Flexbox Container

```css
display: flex;
flex-direction: ...;
flex-wrap: ...;
justify-content: ...;
align-items: ...;
gap: ...;
```

### Flexbox Item

```css
flex: grow shrink basis;
align-self: ...;
order: ...;
```

---

**Remember:** Understanding WHY something works is more valuable than memorizing syntax. When you understand fr, containment, and the box model, everything else becomes logical.
