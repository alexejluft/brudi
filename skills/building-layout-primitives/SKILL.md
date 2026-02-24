---
name: building-layout-primitives
description: Use when architecting page layouts, building sections, or creating any new page. Teaches layout primitives (Container, Section, Stack, Grid) that enforce consistent spacing and structure across the entire project.
---

# Building with Layout Primitives

## Why Layout Primitives Exist

Every Brudi project reinvents the same spacing patterns over and over:
- Different max-widths per section (960px here, 1280px there)
- Inconsistent horizontal padding (px-4 vs px-6 vs px-8)
- Vertical spacing that doesn't align with the design system (py-16 vs py-20 vs py-24)
- Cards and grids built ad-hoc without shared defaults

**Result:** Project looks fractured. Spacing feels arbitrary.

**Solution:** Use the 4 layout primitives. Never build custom spacing patterns.

---

## The 4 Primitives

### 1. Container — Enforce consistent max-width + padding

**When to use:** Wrapping content inside EVERY Section. It handles:
- Consistent horizontal padding (px-6 sm:px-8 lg:px-12)
- Centered max-width (no left/right alignment issues)
- Responsive content width (mobile-first)

**Props:**
- `size?: 'narrow' | 'default' | 'wide' | 'full'` — Maps to max-w-4xl / max-w-6xl / max-w-7xl / max-w-none
- `className?: string` — For additional Tailwind classes
- `children: ReactNode` — Content inside

**Why each size exists:**
- `narrow` (max-w-4xl) — Text-heavy pages, blog articles, forms
- `default` (max-w-6xl) — Most sections, the goto default
- `wide` (max-w-7xl) — Full-width content with space, hero sections
- `full` (max-w-none) — Rare. Full-bleed backgrounds with Container children

**Example:**

```tsx
export default function HomePage() {
  return (
    <Section id="features" spacing="lg">
      <Container>
        <h2>Our Features</h2>
        <p>Three feature cards below, all centered, consistent padding.</p>
      </Container>
      <Container size="wide">
        <Grid cols={{ sm: 1, md: 2, lg: 3 }}>
          <FeatureCard />
          <FeatureCard />
          <FeatureCard />
        </Grid>
      </Container>
    </Section>
  );
}
```

**Forbidden patterns:**
```tsx
// ❌ WRONG: Hardcoding max-width
<div className="max-w-5xl mx-auto px-4">

// ❌ WRONG: Different padding per section
<section className="px-4 md:px-8">

// ✅ CORRECT: Always use Container
<Container size="default">
```

---

### 2. Section — Wrapper with vertical spacing + semantic HTML

**When to use:** Wrapping EVERY major section (hero, features, cta, footer, etc.)

**Props:**
- `id: string` (REQUIRED) — Anchor link target, analytics, navigation
- `spacing?: 'sm' | 'md' | 'lg' | 'xl'` — Controls py- padding
- `as?: ElementType` — Semantic HTML (section, article, aside, div)
- `className?: string` — Additional classes
- `children: ReactNode` — Content inside

**Spacing values:**
- `sm` = py-16 (64px, small sections like contact form)
- `md` = py-24 (96px, default, most sections)
- `lg` = py-32 (128px, featured sections, heroes)
- `xl` = py-40 (160px, rare, full-viewport sections)

**The id requirement:**
Every Section MUST have an id. This is not optional.

```tsx
// ✅ CORRECT
<Section id="hero" spacing="lg">

// ✅ CORRECT
<Section id="features" spacing="md">

// ❌ WRONG: Missing id
<Section spacing="md">
  {/* This throws an error */}
</Section>
```

**Why?**
- Navigation anchors: `<a href="#features">`
- Analytics tracking: UTM parameters, scroll depth
- Page structure and SEO
- JavaScript hook points (ScrollTrigger targeting)

**Semantic HTML:**
Use the `as` prop to communicate content type to assistive technology:

```tsx
// Homepage hero — semantic <section>
<Section id="hero" as="section" spacing="lg">

// About page — semantic <article>
<Section id="about" as="article" spacing="md">

// Sidebar — semantic <aside>
<Section id="sidebar" as="aside" spacing="sm">

// Generic fallback — <div>
<Section id="info" as="div" spacing="sm">
```

**Default spacing rules:**
- Hero sections: `spacing="lg"` (py-32 or py-40)
- Feature/service sections: `spacing="md"` (py-24)
- CTA sections: `spacing="lg"` (py-32)
- Footer: `spacing="md"` (py-24)
- Small, focused sections: `spacing="sm"` (py-16)

---

### 3. Stack — Flexbox column with consistent gap

**When to use:** Stacking items vertically with predictable spacing. Examples:
- Text blocks (h1 → p → button)
- Form fields (label → input → error message)
- List of items (card, card, card)
- Sidebar navigation

**Props:**
- `gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` — gap spacing
- `className?: string` — Additional classes (justify, align, etc.)
- `children: ReactNode` — Content

**Gap values:**
- `xs` = gap-2 (8px, form label + input)
- `sm` = gap-4 (16px, list items)
- `md` = gap-6 (24px, default, card content)
- `lg` = gap-8 (32px, section heading + paragraph)
- `xl` = gap-12 (48px, rarely used, very loose spacing)

**Examples:**

```tsx
// Text block (heading + description)
<Stack gap="lg" className="items-center">
  <h2>Our Process</h2>
  <p className="text-center text-muted">
    We follow a four-step approach...
  </p>
</Stack>

// Form (label + input + error)
<Stack gap="sm">
  <label>Email</label>
  <input type="email" />
  <span className="text-red-500">Error message</span>
</Stack>

// List of cards
<Stack gap="lg">
  <Card title="First" />
  <Card title="Second" />
  <Card title="Third" />
</Stack>
```

**Forbidden pattern:**
```tsx
// ❌ WRONG: Raw Tailwind gap on div
<div className="flex flex-col gap-6">

// ✅ CORRECT: Use Stack
<Stack gap="md">
```

---

### 4. Grid — Responsive grid with mobile-first defaults

**When to use:** Multi-column layouts that stack on mobile. Examples:
- Feature cards (3 columns on desktop, 1 on mobile)
- Team members (2 columns on tablet, 4 on desktop)
- Product grid (responsive product cards)
- Portfolio showcase (2-4 columns based on screen)

**Props:**
- `cols?: { sm?: number, md?: number, lg?: number }` — Column counts per breakpoint
- `gap?: StackGap` — Same gap values as Stack (xs-xl)
- `className?: string` — Additional classes
- `children: ReactNode` — Grid items

**Default behavior:**
```tsx
<Grid>
  {/* Default: 1 column sm, 2 columns md, 3 columns lg */}
</Grid>
```

**Custom columns:**
```tsx
// 1 column sm → 2 columns md → 4 columns lg
<Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
  <Card />
  <Card />
  <Card />
  <Card />
</Grid>

// Different ratio: 2 → 3 → 6 (for small badges/tags)
<Grid cols={{ sm: 2, md: 3, lg: 6 }} gap="sm">
  <Tag>Tag 1</Tag>
  <Tag>Tag 2</Tag>
  {/* ... */}
</Grid>

// Single column everywhere (but use Stack instead!)
<Grid cols={{ sm: 1, md: 1, lg: 1 }} gap="md">
  {/* Use Stack instead */}
</Grid>
```

**Forbidden patterns:**
```tsx
// ❌ WRONG: Hardcoded grid-cols
<div className="grid grid-cols-3">

// ❌ WRONG: Using Stack for multi-column layout
<Stack gap="md">
  {/* 3 items that should be in columns */}
</Stack>

// ✅ CORRECT: Use Grid for responsive columns
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
  <Card />
  <Card />
  <Card />
</Grid>
```

---

## Decision Tree: Which Primitive?

```
Is this wrapping an entire section?
├─ YES → Use Section
│       └─ Does it contain text + media/cards?
│           ├─ YES → Wrap content in Container inside Section
│           └─ NO → Just Section (minimal content)
│
└─ NO, Is this vertical stacking?
    ├─ YES → Is it multiple items of the same type?
    │       ├─ YES, should they be in columns? → Use Grid
    │       └─ NO (different types) → Use Stack
    │
    └─ NO, Is this setting max-width + padding?
        └─ YES → Use Container
```

---

## Integration with the Design System

### Spacing Tokens

Primitives use these Tailwind spacing tokens:

```css
/* From design-tokens.css */
--spacing-2: 8px (gap-xs)
--spacing-4: 16px (gap-sm)
--spacing-6: 24px (gap-md)
--spacing-8: 32px (gap-lg)
--spacing-12: 48px (gap-xl)

--spacing-16: 64px (py-16 / Section sm)
--spacing-24: 96px (py-24 / Section md)
--spacing-32: 128px (py-32 / Section lg)
--spacing-40: 160px (py-40 / Section xl)

--padding-x: 1.5rem (px-6 base)
--padding-x-sm: 2rem (sm:px-8)
--padding-x-lg: 3rem (lg:px-12)
```

Never hardcode these. Always use the primitive.

### Color Tokens with Sections

Sections often need background colors. Use CSS custom properties:

```tsx
<Section id="features" className="bg-surface">
  <Container>
    {/* Light/dark mode safe background */}
  </Container>
</Section>

<Section id="cta" className="bg-gradient-to-r from-accent to-accent-dark">
  {/* Gradient background behind entire section */}
</Section>
```

---

## Common Patterns

### Pattern 1: Hero with Image

```tsx
<Section id="hero" spacing="lg" as="section">
  <Container size="wide">
    <Stack gap="lg" className="md:flex-row md:items-center">
      <div className="flex-1">
        <h1>Welcome</h1>
        <p>Description...</p>
        <button>CTA</button>
      </div>
      <div className="flex-1">
        <Image src="..." alt="..." />
      </div>
    </Stack>
  </Container>
</Section>
```

### Pattern 2: Feature Cards Section

```tsx
<Section id="features" spacing="md">
  <Container>
    <Stack gap="lg" className="items-center text-center mb-12">
      <h2>Features</h2>
      <p className="text-muted">All the tools you need.</p>
    </Stack>
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
      <FeatureCard />
      <FeatureCard />
      <FeatureCard />
    </Grid>
  </Container>
</Section>
```

### Pattern 3: Form Section

```tsx
<Section id="contact" spacing="md">
  <Container size="narrow">
    <Stack gap="lg" className="items-center text-center mb-12">
      <h2>Get in Touch</h2>
      <p>We're here to help.</p>
    </Stack>
    <form className="max-w-md mx-auto">
      <Stack gap="sm">
        <input placeholder="Name" />
        <input placeholder="Email" />
        <textarea placeholder="Message" />
        <button>Send</button>
      </Stack>
    </form>
  </Container>
</Section>
```

### Pattern 4: Two-Column Layout

```tsx
<Section id="about" spacing="md">
  <Container>
    <Grid cols={{ sm: 1, lg: 2 }} gap="xl">
      <div>
        <h2>Who We Are</h2>
        <Stack gap="md">
          <p>Paragraph 1...</p>
          <p>Paragraph 2...</p>
        </Stack>
      </div>
      <Image src="..." alt="Team" />
    </Grid>
  </Container>
</Section>
```

---

## Forbidden Patterns (0 Tolerance)

These patterns are ESLint-enforced. Do not use:

| Pattern | Status | Example |
|---------|--------|---------|
| Hardcoded max-width on section | ⛔ BANNED | `<div className="max-w-6xl">` |
| Inconsistent padding | ⛔ BANNED | `<section className="px-4 md:px-8">` |
| Ad-hoc margin on sections | ⛔ BANNED | `<section className="mt-12 mb-16">` |
| Raw gap without Stack/Grid | ⛔ BANNED | `<div className="flex gap-6">` |
| Section without id | ⛔ BANNED | `<Section spacing="md">` |
| Nested Containers | ⛔ BANNED | `<Container><Container>` |
| Using Grid for single column | ⛔ BANNED | `<Grid cols={{ sm: 1, md: 1 }}>` |
| Mixing Stack gap with raw Tailwind | ⛔ BANNED | `<Stack gap="md" className="gap-4">` |

---

## When NOT to Use Primitives

Primitives are for structure. Do NOT use them for:

- **Component internal styling** — Use raw Tailwind inside component bodies
- **Micro-interactions** — Stack on a button's icon spacing is fine; Stack for a modal's children is not
- **One-off custom layouts** — If it's truly unique and not repeated, raw Tailwind is acceptable (but rare)

---

## TypeScript + Strict Mode

All primitives are fully typed with strict mode enabled:

```tsx
// ✅ CORRECT: Type-safe props
<Section id="features" spacing="lg" as="article" className="custom">
  <Container size="wide">
    <Grid cols={{ sm: 1, md: 3 }} gap="lg">
      {/* ... */}
    </Grid>
  </Container>
</Section>

// ❌ WRONG: Invalid spacing value
<Section spacing="xl">  // Only 'sm' | 'md' | 'lg' | 'xl' allowed

// ❌ WRONG: Missing id
<Section>  // Throws type error
```

---

## Performance Notes

All primitives are **server component compatible**. No `'use client'` needed unless the content inside requires interactivity.

**Grid performance:** The Grid primitive uses CSS `grid-template-columns` with repeat(), not Tailwind's numbered classes. This is safe and works with arbitrary values in bracket notation:

```tsx
// Brudi Grid — Uses arbitrary CSS:
[grid-template-columns:repeat(3,minmax(0,1fr))]

// Safe and performant — NOT the problematic pattern
```

---

## Integration Checklist

When starting a new project:

- [ ] Read this skill
- [ ] Copy `templates/primitives/layout.tsx` to your project (or import if using Brudi CLI)
- [ ] Import primitives in your layout/page components
- [ ] Every Section has an id
- [ ] No hardcoded max-w-* on sections
- [ ] No ad-hoc px-* padding on sections
- [ ] Vertical stacks use Stack component
- [ ] Multi-column layouts use Grid component
- [ ] All content wrapped in Container inside Section

---

## FAQ

**Q: Can I nest Container inside Container?**
A: No. One Container per section is the rule. If you need different max-widths, use `size` prop.

**Q: Should I use Container for every div?**
A: No. Only for section content that needs centering + padding. Component internals use raw Tailwind.

**Q: What if my section has a full-bleed background?**
A: Use `as="section"` with a background class, Container inside.
```tsx
<Section id="hero" className="bg-surface-dark" spacing="lg">
  <Container>
    {/* Content centered inside full-bleed background */}
  </Container>
</Section>
```

**Q: Can I override gap in Stack/Grid with className?**
A: Not recommended. Use the `gap` prop. If you need a custom value, consider if the design token needs updating.

**Q: When do I use Stack vs Container?**
A: Stack = vertical spacing between items. Container = horizontal centering + padding for sections. Different purposes.

**Q: Can I use Grid for a single column?**
A: No. Use Stack instead. Grid is for multi-column layouts.

**Q: What if my section needs different spacing on mobile vs desktop?**
A: Create two different Sections with different `spacing` values, or use CSS to override `py-` on a specific breakpoint (rare). Primitives handle 90% of cases.

---

## See Also

- `~/Brudi/skills/designing-award-layouts-core/SKILL.md` — Depth, spacing harmony, visual hierarchy
- `~/Brudi/skills/building-layouts/SKILL.md` — Grid vs Flexbox decision tree
- `~/Brudi/templates/primitives/layout.tsx` — Source code + JSDoc examples
