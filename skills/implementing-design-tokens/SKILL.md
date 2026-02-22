---
name: implementing-design-tokens
description: Use when setting up a design token system with CSS custom properties and Tailwind CSS v4. Prevents hardcoded values, inconsistent styling, and unmaintainable themes.
---
# Implementing Design Tokens
**Define tokens as CSS custom properties with Tailwind v4 namespaces (`--color-*`, `--spacing-*`). Use `@theme` in CSS. Name by purpose. Always use rem.**
---

## Token Definition (globals.css)

```css
/* ✅ Correct: Semantic naming, rem units, Tailwind v4 namespace */
:root {
  /* Colors — named by purpose */
  --color-accent: #2563eb;
  --color-background: #ffffff;
  --color-foreground: #1f2937;
  --color-surface: #f9fafb;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-error: #dc2626;
  --color-success: #16a34a;

  /* Spacing (8px grid) */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
}

/* ❌ WRONG: Non-semantic names */
/* --blue-500: #2563eb; --gray-100: #f3f4f6; */
/* ❌ WRONG: Mixed units or old namespace */
/* --space-sm: 8px; --padding-md: 1rem; */
```

---

## Tailwind v4 Integration (@theme in CSS)

```css
/* ✅ Correct: globals.css — @theme block exposes tokens as utilities */
@import "tailwindcss";

@theme {
  --color-accent: #2563eb;
  --color-background: #ffffff;
  --color-foreground: #1f2937;
  --color-surface: #f9fafb;
  --color-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-error: #dc2626;
  --color-success: #16a34a;

  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
}

/* ❌ WRONG: tailwind.config.ts file — no config files in v4 */
/* ❌ WRONG: Writing extend.colors in config → use @theme in CSS */
```

---

## Runtime-Switchable Tokens (Dark Mode)

```css
/* ✅ Correct: Define in :root and .dark, reference in @theme inline */
:root {
  --brand-accent: #2563eb;
  --brand-bg: #ffffff;
}

.dark {
  --brand-accent: #3b82f6;
  --brand-bg: #0f172a;
}

@theme inline {
  --color-accent: var(--brand-accent);
  --color-background: var(--brand-bg);
}

/* ❌ WRONG: Hardcoding colors in both :root and .dark separately */
/* ❌ WRONG: Mixing static @theme and runtime var() without @theme inline */
```

---

## Usage

```tsx
/* ✅ Token-backed classes generated from @theme */
<button className="bg-accent text-foreground px-6 py-4">Save</button>
<div className="space-y-4 border-b border-border">Content</div>

/* ❌ WRONG: Arbitrary values or old v3 config approach */
/* <button className="bg-[#2563eb]"> or relying on tailwind.config.ts */
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing `tailwind.config.ts` | Use `@theme` in your CSS file instead |
| Using `--bg` / `--text` namespaces | Use Tailwind v4 namespaces: `--color-*`, `--spacing-*` |
| Extending theme in config | Define tokens in CSS `@theme` block |
| Hardcoded colors/spacing | Map all values to token variables |
| Arbitrary values (`bg-[#hex]`) | Define color in `@theme`, use `bg-accent` |
| No dark mode integration | Use `:root` / `.dark` with `@theme inline` for runtime tokens |
