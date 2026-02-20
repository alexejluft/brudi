---
name: designing-with-perception
description: Use when making any visual design decision — font sizes, animation timing, colors, spacing, or layout. Ensures the result feels premium and human, not technically correct but emotionally wrong.
---

# Designing with Perception

## The Core Rule

**Users form opinions in 50ms. 94% of first impressions are design-related.**

Design is not code. A button with `duration: 0.3s` and a button with `duration: 0.8s` are both valid CSS. Only one feels right. This skill teaches you which one — and why.

---

## Animation Timing

### The Hierarchy (non-negotiable)

| Type | Duration | Examples |
|------|----------|---------|
| Micro | 100–200ms | Button hover, toggle, icon swap |
| Standard | 200–400ms | Card reveal, dropdown, panel slide |
| Dramatic | 400–800ms | Hero entrance, page transition, modal |

**Rule:** Duration scales with visual size and emotional weight. A hero takes longer than a checkbox. Never the reverse.

### What Wrong Timing Feels Like

- **< 100ms**: Jarring, mechanical — user misses the transition entirely
- **> 500ms**: Sluggish, unresponsive — interface feels out of control
- **Linear easing**: Robotic — nothing in nature moves at constant speed

### Easing by Context

```css
/* Elements entering → ease-out (responsive, impactful) */
transition: transform 300ms cubic-bezier(0, 0, 0.58, 1);

/* Elements leaving → ease-in (graceful exit) */
transition: transform 200ms cubic-bezier(0.42, 0, 1, 1);

/* Complex movements → ease-in-out (smooth, car-like) */
transition: transform 500ms cubic-bezier(0.42, 0, 0.58, 1);

/* Never use linear for movement — only for loaders/spinners */
```

---

## Typography: Perception-Based Sizes

```css
/* Body — never below 16px on mobile (iOS zooms in < 16px) */
body {
  font-size: clamp(1rem, 0.875rem + 0.5vw, 1.125rem); /* 16–18px */
  line-height: 1.6; /* Sweet spot: 1.5–1.6 */
  letter-spacing: 0.01em;
}

/* Headings — scale with viewport, not fixed breakpoints */
h1 { font-size: clamp(2rem, 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
```

**Line length:** 50–75 characters per line (66 is ideal). Wider = hard to find next line. Narrower = exhausting rhythm.

**What bad typography feels like:**
- Line-height < 1.4 → lines blur together, claustrophobic
- Font < 16px on mobile → cheap, inaccessible, users leave
- Fixed sizes → wrong on every device except the one you designed on

---

## Color Contrast

### The Numbers (WCAG AA — minimum)

| Context | Ratio |
|---------|-------|
| Normal text (< 24px) | 4.5:1 |
| Large text (≥ 24px) | 3:1 |
| UI components, icons | 3:1 |

### Never Use Pure Black or Pure White

```css
/* ❌ Physiologically aggressive — causes eye strain */
color: #000000;
background: #ffffff;

/* ✅ Premium, refined — same readability, less fatigue */
color: #1a1a1a;
background: #fafafa;

/* ✅ Dark mode */
color: #f0f0f0;
background: #111113;
```

**Why:** Pure black (#000) on white (#fff) = 21:1 contrast. Technically maximum, physiologically harmful. Overstimulates retinas, causes halation (text bleeds) for astigmatism sufferers. Near-black on off-white = same clarity, premium feel.

---

## Depth & Spacing: The Premium Signal

**White space is not emptiness. It is a design tool.**

Generous spacing = sophistication. Tight spacing = cheap (unless intentional tension).

```css
/* Shadow system — elevation communicates hierarchy */
.card     { box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
.modal    { box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12); }
.tooltip  { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
```

**Rules:**
- Max 4–6 elevation levels (more = visual chaos)
- Higher elevation → softer, larger shadow
- Never use shadows without purpose — every shadow signals "above"

---

## First Impression Checklist

Before any visual is shipped, answer:

- [ ] Does it feel premium at 50ms glance? (blur your eyes and look)
- [ ] Is spacing generous and consistent?
- [ ] Does text feel comfortable to read — not too small, not too tight?
- [ ] Are contrast ratios passing AA minimum?
- [ ] Are animations timed to their visual weight?
- [ ] Does it look right from outside — not just in the code?

---

## Common AI Mistakes

| AI does | Why it's wrong | Correct |
|---------|---------------|---------|
| `duration: 0.3s` everywhere | Ignores visual weight | Hero: 0.6s, button: 0.15s |
| `color: #000` on `#fff` | Eye strain, harsh | `#1a1a1a` on `#fafafa` |
| `font-size: 14px` on mobile | iOS zooms, feels cheap | min 16px, ideally 18px |
| Fixed font sizes | Wrong on all devices | `clamp()` always |
| `linear` easing on transitions | Robotic, unnatural | `ease-out` entering, `ease-in` exiting |
| Shadow on every element | No hierarchy | Shadow = elevation = purpose |
