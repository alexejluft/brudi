---
name: building-button-states
description: Use when implementing button hover states, active states, focus states, and CSS transitions. Covers the complete pattern, avoiding transition:all, asymmetric transitions, and state machine approach.
---

# Building Button States

## The Rule

AI produces flat interactions: `opacity: 0.8` on hover, no `:active` state,
`transition: all` everywhere. None of these are acceptable in a polished product.

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
