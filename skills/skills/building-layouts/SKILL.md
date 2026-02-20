---
name: building-layouts
description: Use when creating page layouts, making components responsive, or choosing between Grid, Flexbox, and Container Queries. Especially when a component needs to adapt to its container width, not viewport.
---

# Building Layouts

## Decision: Grid vs Flexbox vs Container Query

```
Is the component in different-sized containers?
├─ YES → Container Queries (component adapts to container)
└─ NO → Is it 2D (rows AND columns)?
         ├─ YES → Grid
         └─ NO → Flexbox
```

## Container Queries (Most Misunderstood)

**The Problem:** A card in main content should be horizontal. Same card in sidebar should be stacked. Viewport doesn't change — only container width differs.

**Wrong Solution:** Media queries (they check viewport, not container)

**Right Solution:** Container Queries

```css
/* 1. Parent becomes a container */
.card-wrapper {
  container-type: inline-size;
}

/* 2. Children query the container */
.card {
  display: flex;
  flex-direction: column;  /* Default: stacked */
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;   /* Wide: horizontal */
  }
}
```

**Golden Rule:** "You cannot change what you measure."
The container's size is fixed — children can query it but can't affect it.

## Grid Essentials

### fr = Fraction of FREE Space

```css
/* 400px container, columns: 100px 1fr 2fr */
/* Fixed first: 400 - 100 = 300px FREE */
/* Split: 1fr = 100px, 2fr = 200px */
```

### Responsive Without Media Queries

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
/* Cards wrap automatically based on available space */
```

### Justify (→) vs Align (↓)

```css
place-items: center;  /* Both axes */
```

## Flexbox Essentials

```css
/* Centering */
display: flex;
justify-content: center;
align-items: center;

/* Space between */
justify-content: space-between;
```

## Common Mistakes

```css
/* ❌ Media query for component layout */
@media (min-width: 768px) { .card { flex-direction: row; } }

/* ✅ Container query */
@container (min-width: 400px) { .card { flex-direction: row; } }
```

```css
/* ❌ Fixed height on text container */
.card { height: 200px; }

/* ✅ Minimum height */
.card { min-height: 200px; }
```
