# Brudi Assets

Reference files that the AI agent can copy and adapt for new projects.
These are NOT templates — they are starting points that save time and reduce errors.

## 👉 START HERE: INDEX.md
**Read INDEX.md first.** It's a lightweight registry that tells the agent:
- What assets exist
- When to load each asset
- Quick decision table for your project type

The agent reads INDEX.md once at project start (~50 lines), then loads specific assets only when needed.

## Asset Directories
- `/fonts/` — Variable font pairings with next/font setup
- `/configs/` — Design tokens, Tailwind presets, animation snippets
- `/i18n/` — Pre-translated UI strings (6 languages)
- `/legal/` — GDPR-compliant legal templates (6 languages)

## Usage
1. Agent reads **INDEX.md** to understand available assets
2. Agent copies needed assets to the project
3. Agent adapts them to the specific brand/requirements
4. Result: ~10 minutes saved per project, fewer setup errors
