# Brudi v3.4.0 — Creative DNA Release

**Release Date:** February 24, 2026
**Version:** 3.4.0
**Status:** Stable, Ready for Production

---

## Executive Summary

Brudi v3.4.0 introduces **Creative DNA** — a deterministic enforcement system that eliminates AI-Slop by enforcing award-level creative standards at every level:

- **Agent Level:** New skills and updated CLAUDE.md require minimum complexity baseline
- **Gate Level:** Pre/Post-slice validation blocks sections that don't meet creative floor
- **Lint Level:** 4 custom ESLint rules prevent common motion/animation violations
- **Evidence Level:** Measurable proof of animation count, easing variety, and depth layers

---

## What's New

### 1. Creative Complexity Floor

Brudi now enforces a deterministic minimum for every section:

#### Hero Section (Absolute Minimum)
- **5+ GSAP Animations** (Staggered headline, background shift, scroll indicator, CTA scale, shadow elevation)
- **3+ Easing Types** (power2.out, power3.out, sine.inOut minimum)
- **4 Depth Layers** (--bg, --bg-elevated, --surface, --surface-high)

#### Generic Section (Any Content Block)
- **Entrance Reveal** (Fade + translateY, 0.6–0.8s)
- **Staggered Children** (0.06–0.12s delays)
- **3+ Easing Types** across the page
- **Card Hover State** (3+ property changes: shadow, color, border)

### 2. New Skills

#### `designing-award-materiality` (720 lines)
Defines the **4-Material System**:
1. **Matte** — Opaque, data-rich (portfolio cards, analytics)
2. **Glossy** — Interactive, semi-opaque (CTAs, hover states)
3. **Frosted** — Modern, translucent (headers, modals)
4. **Metallic** — Premium, gradient (badges, featured items)

#### `designing-creative-constraints` (911 lines)
Operationalizes the Complexity Floor with decision trees and measurable criteria.

### 3. Custom ESLint Rules (4)

1. **`no-transition-all`** — Force specific property transitions
2. **`no-gsap-from-in-react`** — Require Element Refs + cleanup
3. **`scrolltrigger-cleanup-required`** — Prevent memory leaks
4. **`no-layout-animation`** — Use transform instead

### 4. Gate Extensions

- **Pre-Slice:** Creative DNA Tokens check
- **Post-Slice:** Animation Evidence + Forbidden Pattern check

### 5. Documentation

- START_HERE.md (rewritten)
- docs/USER_GUIDE.md (new, 692 lines)
- docs/TROUBLESHOOTING.md (new, 591 lines)
- docs/IDENTITY.md (new)

---

## Breaking Changes

**NONE.** All changes are additive. Existing projects continue to work unchanged.

---

## Migration Guide: Upgrade Existing Projects

### Step 1: Pull Latest Brudi
```bash
cd ~/Brudi && git pull origin main
```

### Step 2: Update Project Template
```bash
cd /path/to/your/project && sh ~/Brudi/use.sh
```

### Step 3: Copy ESLint Config
```bash
cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js
```

### Step 4: Run Lint Check
```bash
npm run lint
```

### Step 5: Update PROJECT_STATUS.md
Add new columns:
- Animation Count
- Easing Variety
- Forbidden Patterns

### Step 6: Read the Skills
1. `designing-award-materiality`
2. `designing-creative-constraints`
3. `verifying-ui-quality` (updated)

---

## New Projects: Automatic Setup

If you create a new project with Brudi v3.4.0:
1. All Creative DNA enforcement is **automatically active**
2. START_HERE.md already references the new skills
3. PROJECT_STATUS.md template includes the new columns
4. ESLint config is ready to copy

---

## Evidence Requirements (New)

Every section now requires **4 pieces of evidence**:

1. **Animation Count** — Count your GSAP animations
2. **Easing Variety** — List the easing functions used (3+ types)
3. **Depth Layers** — Verify 4 CSS custom properties visible
4. **Forbidden Pattern Check** — ESLint passes with 0 violations

---

## Metrics & Measurability

| Metric | Measurement |
|--------|-------------|
| Animation Count | `gsap.timeline().getChildren().length` ≥ floor |
| Easing Variety | Unique easing strings in code ≥ 3 |
| Depth Layers | Distinct values in CSS variables ≥ 4 |
| Forbidden Patterns | ESLint exit code = 0 |

---

## FAQ

**Q: Does this mean I have to animate everything?**
A: No. Every section needs *purpose-driven* motion.

**Q: What if my hero only needs 3 animations?**
A: Ask: "What information does animation #4 and #5 reveal?" If nothing, reconsider your approach.

**Q: Can I disable the ESLint rules?**
A: You can, but you'd be removing the safety rails. The rules exist to prevent debugging hell later.

**Q: Do I have to use the 4-Material System?**
A: Yes, for consistency. This is part of "working with Alex" — opinionated, not optional.

---

## Deployment

Brudi v3.4.0 is **production-ready**:
- No database migrations
- No configuration changes required
- Full backward compatibility

---

**Brudi v3.4.0 — Ship award-level. Always.**
