---
name: implementing-design-tokens
description: Use when setting up a design token system with CSS custom properties and Tailwind CSS. Prevents hardcoded values, inconsistent styling, and unmaintainable themes.
---

# Implementing Design Tokens

## The Rule

**Define tokens as CSS custom properties. Extend Tailwind theme with `var()`. Name by purpose, not value. Always use rem.**

---

## Token Definition (globals.css)

```css
/* ✅ Correct: Semantic naming, rem units, organized by category */
:root {
  /* Colors — named by purpose */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-surface: #ffffff;
  --color-surface-elevated: #f9fafb;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-error: #dc2626;
  --color-success: #16a34a;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Typography */
  --font-size-sm: 0.875rem;  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;  --font-size-xl: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);

  /* Border Radius */
  --radius-sm: 0.25rem;  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;  --radius-full: 9999px;
}

/* ❌ WRONG: Non-semantic names */
/* --blue-500: #2563eb;  --gray-100: #f3f4f6; */
/* ❌ WRONG: Mixed units */
/* --spacing-sm: 8px;  --spacing-md: 1rem; */
```

---

## Tailwind Integration

```tsx
// ✅ tailwind.config.ts — extend theme with token variables
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)' },
        surface: { DEFAULT: 'var(--color-surface)', elevated: 'var(--color-surface-elevated)' },
        text: { DEFAULT: 'var(--color-text)', muted: 'var(--color-text-muted)' },
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      spacing: { xs: 'var(--spacing-xs)', sm: 'var(--spacing-sm)', md: 'var(--spacing-md)', lg: 'var(--spacing-lg)', xl: 'var(--spacing-xl)' },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', full: 'var(--radius-full)' },
      boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' },
    },
  },
}
```

---

## Usage + Dark Mode

```tsx
// ✅ Token-backed classes — consistent + themeable
<button className="bg-primary hover:bg-primary-hover text-surface px-lg py-sm rounded-md shadow-md">Save</button>
// ❌ WRONG: <button className="bg-[#2563eb] px-6 py-2"> or style={{ ... }}
```

```css
/* ✅ Override tokens in .dark — components auto-adapt, zero code changes */
.dark {
  --color-primary: #3b82f6;  --color-surface: #0f172a;
  --color-text: #f1f5f9;     --color-border: #334155;
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Hardcoded colors/spacing | Always use token variables via Tailwind |
| Non-semantic naming (`--blue-500`) | Name by purpose: `--color-primary` |
| Mixed px/rem units | Use rem for all spacing/typography |
| Tokens not in Tailwind config | `extend` theme with `var()` references |
| No dark mode tokens | Override custom properties in `.dark` class |
| Arbitrary values (`bg-[#2563eb]`) | Map to token: `bg-primary` |
