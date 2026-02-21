# Brudi Asset Registry

> Read this file once at project start. Load assets only when needed.

## Fonts (`./fonts/`)
- **FONTS.md** — 5 variable font pairings with next/font/local setup
- **woff2/** — ClashDisplay, Satoshi, GeneralSans, CabinetGrotesk, Switzer
- 📌 Load when: Setting up typography (Phase 1)

## Configs (`./configs/`)
- **design-tokens.css** — CSS custom properties (colors, spacing, transitions)
- **globals.css** — Tailwind v4 template with @theme blocks, CSS reset, [data-gsap] states, reduced-motion, focus styles
- **next-intl-v4.ts** — next-intl v4 config template (routing, middleware, layout)
- **gsap-snippets.ts** — 10 GSAP animation techniques (scroll, parallax, split-text, magnetic...)
- **framer-motion-snippets.ts** — 10 Framer Motion techniques (layout, gestures, AnimatePresence...)
- 📌 Load configs when: Project setup (Phase 1)
- 📌 Load GSAP snippets when: Building animations (Phase 2)
- 📌 Load Framer snippets when: Building SaaS/App UI animations (Phase 2)

## i18n (`./i18n/`)
- **base.{en,de,fr,es,it,pt}.json** — 154 pre-translated UI keys per language
- **STRUCTURE.md** — Key structure reference
- Covers: nav, footer, cta, aria, theme, errors, forms, faq, cookies, social, legal headings
- 📌 Load when: Setting up internationalization (Phase 2)

## Legal (`./legal/`)
- **legal.{en,de,fr,es,it,pt}.json** — Impressum + Privacy Policy templates
- 66 keys per language, 19 placeholders ({{COMPANY_NAME}}, {{VAT_ID}}, etc.)
- GDPR/DSGVO compliant
- 📌 Load when: Building legal pages (Phase 2-3)

## Templates (`./templates/`)
- **CLAUDE.md** — Project context template
- **CLAUDE.example.md** — Example with Forma Studio
- **settings.json** — Bash permissions template for ~/.claude/settings.json (use if Bash commands are blocked)

## Quick Decision Table

| Project Type | Load at Start | Load Later |
|---|---|---|
| Landing Page | fonts, design-tokens, globals | gsap-snippets, i18n, legal |
| SaaS App | fonts, design-tokens, globals | framer-motion-snippets, i18n |
| Multi-lang Site | fonts, design-tokens, globals, i18n | gsap-snippets, legal |

## Usage Pattern
1. Copy asset to project: `cp ./configs/design-tokens.css src/styles/`
2. Adapt to project brand (colors, fonts, spacing)
3. Never modify source assets — always copy first
