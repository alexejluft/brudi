---
name: building-components-core
description: Use when architecting FAQ sections, accordions, tabs, or disclosure components. Tells the agent WHICH pattern to use and WHAT ARIA attributes are required. Does not contain implementation code.
---

# Building Components — Core Decision Making

## The Core Problem

AI generates accordions that look correct but fail on:
- `<div onClick>` instead of `<button>` — not keyboard accessible
- `max-height: 999px` — slow animation, layout jumps at start/end
- No `aria-expanded` — screen readers don't know the state
- No keyboard support — Enter, Space, Arrow keys missing
- `opacity` fade only — space doesn't collapse, layout broken

## Animation Technique Decision Tree

```
Astro / Vanilla, no GSAP installed → use `building-accordion-patterns` Pattern 1
Astro / Vanilla, GSAP installed    → use `building-accordion-patterns` Pattern 2
React / Next.js                    → use `building-accordion-patterns` Pattern 3
Premium agency variant (numbered)  → use `building-accordion-patterns` Pattern 4
Tabs / custom dropdown / disclosure → use `building-disclosure-patterns`
```

## ARIA Requirements Checklist

Every accordion must have these — no exceptions.

```html
<!-- Header button -->
<button
  aria-expanded="false"          <!-- required: true/false on toggle -->
  aria-controls="panel-id"       <!-- required: ID of the content panel -->
  id="header-id"                 <!-- required: referenced by panel -->
>
  Question text
</button>

<!-- Content panel -->
<div
  id="panel-id"                  <!-- required: matches aria-controls -->
  role="region"                  <!-- use if ≤ 6 items total on page -->
  aria-labelledby="header-id"    <!-- required: links back to header -->
>
  Answer text
</div>
```

**Keyboard behavior (W3C spec):**

| Key | Behavior |
|-----|----------|
| Enter / Space | Toggle open/close (native on `<button>`) |
| Tab | Move to next focusable element |
| Arrow Down | Move focus to next accordion header |
| Arrow Up | Move focus to previous accordion header |

**Only add Arrow Up/Down if you have a true accordion list.**
Single FAQ items don't need them.

## AI Failure Modes (What to Never Do)

```
❌ <div onClick={toggle}> instead of <button>
   → No keyboard access, no semantic role
   Fix: Always <button>

❌ max-height: 999px transition
   → Slow start, instant end — feels broken
   Fix: CSS grid-template-rows: 0fr → 1fr, or GSAP height:auto

❌ opacity fade only, no height change
   → Panel disappears but space stays — layout broken
   Fix: Animate height + opacity together

❌ Missing aria-expanded
   → Screen readers announce nothing on toggle
   Fix: Update aria-expanded on every state change

❌ <div> not hidden, just opacity: 0
   → Hidden content is still tab-navigable
   Fix: Use height: 0 + overflow: hidden, or conditional render

❌ transition: all on the panel
   → Animates every property including width, color, etc.
   Fix: Explicit properties: height, opacity only

❌ All items open by default
   → Defeats the purpose of an accordion
   Fix: Start closed (height: 0, aria-expanded="false")

❌ role="tab" and role="tabpanel" on accordion
   → Wrong ARIA pattern — tabs ≠ accordions
   Fix: aria-expanded + aria-controls on button

❌ No prefers-reduced-motion
   → Forces animation on users with vestibular disorders
   Fix: See `building-accordion-patterns` for pattern

❌ Hardcoded pixel height
   → Breaks when content changes length
   Fix: Pre-measure with offsetHeight, or use GSAP height:auto
```

## Design Rules

```
□ Icon: plus/minus preferred over chevron (more premium)
□ One item open at a time (unless justified)
□ Content inside panel: pb-6 minimum, text-text-muted
□ Divider: border-color rgba token, not solid hex
□ Hover state on question: text-accent transition
□ Arrow keys navigate between items
□ Numbered variant: image panel sticky, cross-fade on hover
□ No transition:all — explicit properties only
□ prefers-reduced-motion: disable height animation, keep opacity
```

## Pressure Test Scenarios

**Scenario 1 — GSAP height:auto bug**
Problem: `gsap.to(el, { height: 'auto' })` animates to wrong value
if the element was never rendered at full height.
Fix: Use `gsap.fromTo(el, { height: 0 }, { height: 'auto' })` —
GSAP resolves `auto` at animation time, not at definition time.

**Scenario 2 — AnimatePresence flashes on load**
Problem: Content animates out on initial render.
Fix: `<AnimatePresence initial={false}>` — disables the exit animation
on mount.

**Scenario 3 — Layout jump when other items close**
Problem: Opening one item shifts others down without animation.
Fix: Add `layout` prop to item container + wrap in `<LayoutGroup>`.

**Scenario 4 — Keyboard focus lost after closing**
Problem: User closes an item, focus disappears.
Fix: Keep focus on the trigger button — it opened, it stays focused.
Only move focus INTO the panel if the user pressed Tab (not Enter/Space).
