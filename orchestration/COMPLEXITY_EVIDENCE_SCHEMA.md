# Creative DNA Complexity Evidence Schema

## Overview

The `complexity_evidence` field in `.brudi/state.json` tracks quantitative metrics about design and animation complexity for each slice. This ensures that slices meet the Creative DNA Floor standards.

## Location

```json
{
  "slices": [
    {
      "id": 1,
      "name": "Hero Section",
      "phase": 0,
      "status": "completed",
      "evidence": { ... },
      "complexity_evidence": {
        "animation_count": { ... },
        "easing_variety": [ ... ],
        "depth_layers": { ... },
        "forbidden_patterns": { ... }
      }
    }
  ]
}
```

## Field Definitions

### `animation_count` (Object)

Count of animations per section or component.

```json
{
  "animation_count": {
    "hero": 7,
    "features": 4,
    "cta": 2
  }
}
```

- **Keys:** Section or component names (string)
- **Values:** Count of animations (integer, >= 0)
- **Purpose:** Verify entrance animations, hover states, scroll triggers are present
- **Guideline:** Aim for >= 1 animation per major section minimum

### `easing_variety` (Array of Strings)

List of distinct easing functions used throughout the slice.

```json
{
  "easing_variety": [
    "power2.out",
    "power3.out",
    "sine.inOut",
    "back.out"
  ]
}
```

- **Items:** Easing function names (string)
- **Purpose:** Ensure motion timing is not monotonous (avoid only `ease-out`)
- **Guideline:** Aim for >= 2 distinct easing functions per slice
- **Common values:**
  - GSAP: `power1.out`, `power2.out`, `power3.out`, `sine.inOut`, `back.out`, `elastic.out`
  - CSS: `ease-out`, `ease-in-out`, `cubic-bezier(...)`

### `depth_layers` (Object)

Count of visual depth layers per layer type (from Brudi design system).

```json
{
  "depth_layers": {
    "bg": 2,
    "bg_elevated": 3,
    "surface": 4,
    "surface_high": 3
  }
}
```

- **Keys:** Layer types (bg, bg_elevated, surface, surface_high)
- **Values:** Count of elements at each layer (integer, >= 0)
- **Purpose:** Verify use of the 4-layer dark theme system
- **Guideline:** Aim for >= 1 element at surface and surface_high layers
- **Design System Reference:**
  - `bg`: Base background color
  - `bg_elevated`: Slightly elevated background (e.g., sidebar)
  - `surface`: Cards, containers
  - `surface_high`: Modals, toasts, floating elements

### `forbidden_patterns` (Object)

Count of violations of forbidden patterns in the slice code.

```json
{
  "forbidden_patterns": {
    "transition_all": 0,
    "gsap_from": 0,
    "orphaned_triggers": 0
  }
}
```

- **Keys:** Pattern type names (string)
- **Values:** Count of violations (integer, >= 0)
- **Purpose:** Enforce Creative DNA coding standards
- **Patterns Tracked:**
  - `transition_all`: Uses of `transition: all` (should use specific properties)
  - `gsap_from`: Uses of `gsap.from()` (should use `gsap.set() + gsap.to()`)
  - `orphaned_triggers`: Unmanaged ScrollTrigger references

## Validation Rules

The `brudi-gate-complexity.sh` script enforces:

1. **Pre-Slice:**
   - materiality-tokens.css or equivalent tokens exist
   - globals.css defines 4-layer color tokens
   - Motion tokens (--duration-*, --easing-*) are defined

2. **Post-Slice:**
   - Zero forbidden patterns (`transition_all`, `gsap_from`)
   - `complexity_evidence` is populated (optional but recommended)

## Example: Complete Evidence

```json
{
  "slices": [
    {
      "id": 1,
      "name": "Hero Section",
      "phase": 1,
      "status": "completed",
      "evidence": {
        "skill_read": true,
        "build_zero_errors": true,
        "screenshot_desktop": "screenshots/slice-1-desktop.png",
        "screenshot_mobile": "screenshots/slice-1-mobile.png",
        "console_zero_errors": true,
        "quality_gate_checks": [
          "All 4 UI states implemented (Loading, Error, Empty, Content)",
          "Mobile layout verified at 375px viewport",
          "GSAP animations trigger on scroll without console errors"
        ]
      },
      "complexity_evidence": {
        "animation_count": {
          "hero_heading": 3,
          "hero_cta": 2,
          "background": 1
        },
        "easing_variety": [
          "power2.out",
          "sine.inOut",
          "back.out"
        ],
        "depth_layers": {
          "bg": 1,
          "bg_elevated": 2,
          "surface": 3,
          "surface_high": 2
        },
        "forbidden_patterns": {
          "transition_all": 0,
          "gsap_from": 0,
          "orphaned_triggers": 0
        }
      }
    }
  ]
}
```

## Populating `complexity_evidence`

### Manual Entry

Add to `.brudi/state.json` after each slice completion:

```bash
jq '.slices[0].complexity_evidence = {
  "animation_count": {"hero": 7},
  "easing_variety": ["power2.out", "sine.inOut"],
  "depth_layers": {"bg": 2, "bg_elevated": 3, "surface": 4, "surface_high": 3},
  "forbidden_patterns": {"transition_all": 0, "gsap_from": 0, "orphaned_triggers": 0}
}' .brudi/state.json > /tmp/state.json && mv /tmp/state.json .brudi/state.json
```

### Automated Detection

The `brudi-gate-complexity.sh` script analyzes:

- Animation counts from GSAP `.to()` and CSS `@keyframes`
- Easing functions from `gsap.easing` and CSS `animation-timing-function`
- Layer usage from CSS custom property assignments
- Forbidden patterns via grep in source files

**Note:** Automated detection is planned for future releases. Currently, manual logging is recommended.

## Related Files

- `.brudi/state.json` — State file containing evidence
- `orchestration/brudi-gate-complexity.sh` — Complexity enforcement script
- `orchestration/brudi-gate.sh` — Main gate runner
- `orchestration/state.schema.json` — JSON schema (includes complexity_evidence)

## References

- **Design System:** `~/Brudi/skills/creating-visual-depth/SKILL.md`
- **Motion Standards:** `~/Brudi/skills/designing-motion-timing/SKILL.md`
- **Anti-Patterns:** See CLAUDE.md "What AI-Slop Looks Like"
