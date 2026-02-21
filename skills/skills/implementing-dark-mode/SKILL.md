---
name: implementing-dark-mode
description: Use when adding dark mode to Next.js applications with next-themes and Tailwind CSS. Prevents flash of wrong theme, hydration mismatches, and inconsistent theming.
---

# Implementing Dark Mode

## The Rule

**next-themes with `attribute="class"`. `suppressHydrationWarning` on `<html>`. Guard `useTheme` with mounted check. Use Tailwind `dark:` variant.**

---

## ThemeProvider Setup

```tsx
// ✅ Correct: app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// ❌ WRONG: No suppressHydrationWarning → hydration mismatch warnings
// ❌ WRONG: No enableSystem → ignores user's OS preference
```

---

## CSS Custom Properties (globals.css)

```css
/* ✅ Correct: Tokens for both themes */
:root {
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
}

.dark {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  --color-surface: #1e293b;
  --color-border: #334155;
}

/* ❌ WRONG: Hardcoded bg-white/bg-black everywhere instead of tokens */
```

---

## Tailwind dark: Variant

```tsx
// ✅ Use dark: prefix — Tailwind handles everything
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">Content</div>
// ❌ WRONG: Manual className={theme === 'dark' ? 'bg-black' : 'bg-white'}
```

---

## Theme Toggle Component

```tsx
// ✅ Correct: Mounted check prevents hydration mismatch
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

// ❌ WRONG: No mounted check → renders wrong icon on server
```

---

## Image Handling

```tsx
// ✅ CSS filter for icons, or <picture> for logos
<img src="/icon.svg" className="dark:invert" alt="Icon" />
// ❌ WRONG: Single light-only image → invisible in dark mode
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No `suppressHydrationWarning` | Add to `<html>` element |
| Flash of wrong theme (FOUC) | next-themes injects script before render |
| No system preference detection | `enableSystem={true}` in ThemeProvider |
| Hardcoded colors in components | Use Tailwind `dark:` variant or CSS tokens |
| `useTheme` without mounted check | Guard with `useState` + `useEffect` |
| Theme in Server Components | Mark theme-dependent components `'use client'` |
