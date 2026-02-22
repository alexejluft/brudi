---
name: designing-motion-timing
description: Use when deciding animation durations and easing functions. Covers timing hierarchy, easing by context, what wrong timing feels like, and common AI mistakes.
---

# Designing Motion Timing

## Animation Timing Hierarchy (Non-Negotiable)

| Type | Duration | Examples |
|------|----------|---------|
| Micro | 100–200ms | Button hover, toggle, icon swap |
| Standard | 200–400ms | Card reveal, dropdown, panel slide |
| Dramatic | 400–800ms | Hero entrance, page transition, modal |

**Rule:** Duration scales with visual size and emotional weight. A hero takes longer than a checkbox. Never the reverse.

---

## What Wrong Timing Feels Like

- **< 100ms**: Jarring, mechanical — user misses the transition entirely
- **> 500ms**: Sluggish, unresponsive — interface feels out of control
- **Linear easing**: Robotic — nothing in nature moves at constant speed

---

## Easing by Context

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

## Common AI Timing Mistakes

| AI does | Why it's wrong | Correct |
|---------|---------------|---------|
| `duration: 0.3s` everywhere | Ignores visual weight | Hero: 0.6s, button: 0.15s |
| `linear` easing on transitions | Robotic, unnatural | `ease-out` entering, `ease-in` exiting |
| Micro animations take 400ms | Sluggish and unresponsive | Keep micro animations 100–200ms |
| Dramatic animations take 200ms | Feels rushed and cheap | Scale with visual weight |
