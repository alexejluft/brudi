---
description: How to start a new Next.js project with Brudi
globs: ["**/package.json", "**/next.config.*"]
---
# Starting a Project

## Step 0: Bash Permissions
Check if Bash is allowed via `.claude/settings.json`:
✅ If `bash_allowed: true`, proceed to Step 1.
❌ If missing/false, use Write tool fallback (Step 1B).
---
## Step 1: Project Setup
### Approach A: create-next-app (if Bash available)
Move CLAUDE.md/TASK.md to `/tmp` first (create-next-app fails in non-empty dirs):
```bash
mv CLAUDE.md TASK.md /tmp/ && npx create-next-app@latest . --yes --typescript --tailwind --eslint --app --src-dir --use-npm && mv /tmp/CLAUDE.md /tmp/TASK.md . && rm README.md
```
### Approach B: Manual (if Bash blocked)
Write: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, + dirs.
---
## Step 2: PostCSS Config
```javascript
export default { plugins: { "@tailwindcss/postcss": {} } }
```
---
## Step 3: Copy Brudi Assets
Copy from `~/.brudi/assets/`: `configs/globals.css` → `src/styles/`, `fonts/woff2/*` → `public/fonts/`. Edit globals.css to set `:root` colors, `.dark` colors, and font vars in `@theme inline`.
---
## Step 4: Configure Fonts + Layout
```typescript
import { localFont } from 'next/font/local'
const displayFont = localFont({ src: [{ path: '../fonts/your-font.woff2' }], variable: '--font-display' })
export default function RootLayout({ children }) {
  return <html lang="en" className={displayFont.variable}><ThemeProvider attribute="class"><body>{children}</body></ThemeProvider></html>
}
```
⚠️ Font variable on `<html>`, not `<body>`.
---
## Step 5: Verify Everything
```bash
npm run dev
```
✅ Fonts load, dark mode works, colors visible, no warnings.
---
## Common Mistakes
| Mistake | Fix |
|---------|-----|
| `create-next-app` fails | Move CLAUDE.md/TASK.md to /tmp first |
| Interactive prompts | Use `--yes` flag |
| Writing `tailwind.config.ts` | Tailwind v4 uses `@theme` in CSS |
| Font on `<body>` | Must be on `<html>` |
| Missing PostCSS | Needs `postcss.config.mjs` |
| Fonts not loading | Check paths in `localFont()` |
