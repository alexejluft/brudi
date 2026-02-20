---
name: building-interactions
description: Use when building hover states, button interactions, focus styles, or any CSS transitions. AI skips :active states, uses transition:all (performance bug), ignores prefers-reduced-motion (WCAG violation), and confuses :focus with :focus-visible.
---

# Building Interactions

## The Rule

AI produces flat interactions: `opacity: 0.8` on hover, no `:active` state,
`transition: all` everywhere, no `prefers-reduced-motion`. None of these are
acceptable in a polished product.

---

## The Complete Button Pattern

```css
.button {
  background: #2563eb;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  /* Explicit properties only — never transition: all */
  transition:
    transform 0.15s ease-out,
    box-shadow 0.15s ease-out,
    background-color 0.2s ease;
}

.button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* :active MUST come after :hover (LVHA rule) */
.button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: transform 0.05s ease;   /* faster than hover */
}

/* Remove outline on mouse click */
.button:focus {
  outline: none;
}

/* Show outline only on keyboard navigation */
.button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Respect user's motion preference */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: background-color 0.2s ease, opacity 0.2s ease;
  }
  .button:hover,
  .button:active {
    transform: none;
  }
}
```

---

## transition: all — Never Use It

```css
/* ❌ Forces browser to evaluate every animatable property */
.button { transition: all 0.3s ease; }

/* ✅ Explicit — browser optimizes specifically */
.button {
  transition:
    transform 0.15s ease-out,
    opacity 0.15s ease-out,
    background-color 0.2s ease;
}
```

**Animate only GPU-accelerated properties when possible:**
- `transform` — GPU, no layout
- `opacity` — GPU, no layout
- `background-color`, `color` — acceptable
- `box-shadow` — acceptable in moderation
- `width`, `height`, `margin`, `padding` — trigger layout recalculation. Avoid.

---

## prefers-reduced-motion — Always

```css
/* Progressive Enhancement — motion as an enhancement */
.card {
  transition: box-shadow 0.3s ease;  /* feedback without motion */
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover {
    transform: translateY(-8px);
  }
}
```

**Not all animation must be removed** — fade and opacity transitions are
acceptable. Remove: translate, scale, rotate. Keep: opacity, color, shadow.

WCAG SC 2.3.3: motion animations must be disableable. `prefers-reduced-motion`
is the W3C-recommended technique. Vestibular disorders affect 70M+ people —
movement triggers dizziness and nausea.

---

## :focus vs :focus-visible

```css
/* ❌ Shows outline on mouse clicks too — irritates mouse users */
.button:focus { outline: 2px solid blue; }

/* ✅ Keyboard gets outline, mouse does not */
.button:focus { outline: none; }
.button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

**The browser decides:** keyboard navigation → `:focus-visible` applies.
Mouse click → does not apply. Input fields → always applies (user needs to
know where they're typing, regardless of input device).

**Never `outline: none` without `:focus-visible`** — keyboard users lose
all navigation feedback.

---

## Asymmetric Transitions

Different timing for enter vs exit creates more natural feel:

```css
.tooltip {
  opacity: 0;
  transition: opacity 0.15s ease-out;   /* fast appear */
}

.trigger:hover .tooltip {
  opacity: 1;
  transition: opacity 0.3s ease-in;     /* slow disappear */
}
```

Enter fast, leave slow — matches how attention works. Snappy arrival,
relaxed departure.
