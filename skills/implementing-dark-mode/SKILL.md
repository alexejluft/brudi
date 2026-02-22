---
name: implementing-dark-mode
description: Use when adding dark mode to Next.js with next-themes and Tailwind CSS v4. Prevents flash of wrong theme, hydration mismatches, and inconsistent theming.
---
# Implementing Dark Mode
**next-themes with `attribute="class"`. `suppressHydrationWarning` on `<html>`. `@custom-variant dark` in CSS v4. Guard `useTheme` with mounted check.**
---

## ThemeProvider Setup (Next.js v4)

```tsx
// ✅ Correct: app/layout.tsx with Tailwind v4
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fonts}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// ❌ WRONG: No suppressHydrationWarning → hydration mismatch warnings
// ❌ WRONG: Using darkMode config in tailwind.config.ts (doesn't exist in v4)
```

---

## Dark Mode Variant (@custom-variant in CSS)

```css
/* ✅ Correct: globals.css with Tailwind v4 */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *)) {
  @media (prefers-color-scheme: dark) {
    @slot;
  }
}

@theme {
  --color-background: #ffffff;
  --color-foreground: #1f2937;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
}

.dark {
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
  --color-surface: #1e293b;
  --color-border: #334155;
}

/* ❌ WRONG: darkMode: 'class' in tailwind.config.ts (v3 syntax) */
/* ❌ WRONG: Hardcoded bg-white/bg-black instead of tokens */
```

---

## Usage with Dark Mode

```tsx
/* ✅ Use dark: prefix with token-backed classes */
<div className="bg-background text-foreground dark:bg-background dark:text-foreground">
  Content auto-adapts when .dark class is added
</div>

/* Or with component tokens */
<button className="bg-accent dark:bg-accent text-surface dark:text-foreground">
  Theme switching works automatically
</button>

/* ❌ WRONG: Manual className={theme === 'dark' ? 'bg-black' : 'bg-white'} */
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

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Setting `darkMode` in tailwind.config.ts | Use `@custom-variant dark` in CSS v4 |
| No `suppressHydrationWarning` on `<html>` | Add to prevent mismatch warnings |
| Flash of unstyled content (FOUC) | next-themes injects script before render |
| Hardcoded colors instead of tokens | Define in `:root`/`.dark`, use via `@theme` |
| `useTheme` without mounted check | Guard with `useState` + `useEffect` |
| Using Tailwind `dark:` without variant defined | Define `@custom-variant dark` first |
