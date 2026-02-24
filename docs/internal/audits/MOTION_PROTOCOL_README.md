# BRUDI Motion Protocol v1.0

**Deterministic Motion System for Award-Level Animations**

---

## What Is This?

The BRUDI Motion Protocol is a **centralized, enforceable specification** that standardizes all motion/animation in Brudi projects. It eliminates guesswork, ensures consistency, and enforces best practices via automated gates.

---

## Quick Start

### 1. Read the Docs (10 minutes)
- **`docs/MOTION_PROTOCOL_EXECUTIVE_SUMMARY.md`** — High-level overview
- **`docs/MOTION_PROTOCOL_v1.0.md`** — Complete specification with examples

### 2. Understand the Components (5 minutes)
Three core files power the system:

| File | Purpose |
|------|---------|
| `assets/configs/motion.protocol.ts` | TypeScript config with all tokens + helpers |
| `assets/configs/globals.css` | CSS variables for durations, easings, distances |
| `orchestration/motion-compliance-check.sh` | Automated validation script |

### 3. Implement in Your Project (5 minutes)
See **`docs/MOTION_IMPLEMENTATION_GUIDE.md`** for copy-paste examples.

---

## The Protocol at a Glance

### Duration Tokens
```
micro:  120ms  (toggles, checkboxes)
fast:   180ms  (button hover, focus)
normal: 350ms  (cards, dropdowns)
slow:   650ms  (section entrance)
hero:   1000ms (hero banner, max attention)
```

### Easing Tokens
```
ease-exit:      power2.out   (standard)
ease-enter:     power3.out   (dramatic)
ease-smooth:    power2.out   (premium)
ease-spring:    back.out(1.5) (bouncy)
```

### Component Rules (Examples)
```
HERO:    1.0s entrance, power3.out, 48px distance, 0.1s delay
CARD:    0.35s entrance, power2.out, 20px distance, 1.04x hover
BUTTON:  0.2s entrance, 0.18s hover (1.05x), 0.12s click
CTA:     0.5s entrance, power3.out, 0.2s hover (1.08x)
```

### Intensity Levels (Multipliers)
```
subtle:     0.7x duration, 0.6x distance (SaaS)
balanced:   1.0x (DEFAULT)
expressive: 1.3x duration, 1.5x distance (Award-level)
```

---

## Usage in Code

### GSAP Example
```tsx
import { motion } from '@/config/motion.protocol'

const heroRule = motion.getComponentRule('HERO')

gsap.set(title, { opacity: 0, y: heroRule.entrance.distance })
gsap.to(title, {
  opacity: 1,
  y: 0,
  duration: heroRule.entrance.duration,
  ease: heroRule.entrance.ease,
})
```

### Framer Motion Example
```tsx
import { motion } from 'framer-motion'
import { useMotion } from '@/context/MotionContext'

const motionConfig = useMotion()
const rule = motionConfig.getComponentRule('CARD')

<motion.div
  initial={{ opacity: 0, y: rule.entrance.distance }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: rule.entrance.duration,
    ease: rule.entrance.ease,
  }}
/>
```

---

## Validation

### Auto-Validation (brudi-gate.sh)
Motion compliance is checked automatically:

```bash
# Before slice starts
bash ~/Brudi/orchestration/brudi-gate.sh pre-slice
→ Validates: motion.protocol.ts exists, all tokens defined

# After slice done
bash ~/Brudi/orchestration/brudi-gate.sh post-slice
→ Validates: no hardcoded values, no gsap.from(), only transform+opacity

# Exit code 0 = PASS | 1 = FAIL (commit blocked)
```

### Manual Validation
```bash
bash ~/Brudi/orchestration/motion-compliance-check.sh <project-root> all
```

---

## Compliance Rules

| Check | PASS | FAIL |
|-------|------|------|
| `motion.protocol.ts` exists | ✓ | Missing |
| All duration tokens defined | ✓ | Any missing |
| All easing tokens defined | ✓ | Any missing |
| Component motion rules (8+) | ✓ | Types missing |
| No `gsap.from()` calls | ✓ | Found |
| Only `transform` + `opacity` | ✓ | Width/height animated |
| Reduced motion support | ✓ | Missing |
| No hardcoded `0.3` values | ✓ | Found |

---

## File Structure

```
brudi/
├── assets/configs/
│   ├── motion.protocol.ts          (TypeScript config)
│   └── globals.css                 (CSS tokens)
├── orchestration/
│   └── motion-compliance-check.sh  (Validation script)
└── docs/
    ├── MOTION_PROTOCOL_v1.0.md                   (Full spec)
    ├── MOTION_IMPLEMENTATION_GUIDE.md            (How-to)
    └── MOTION_PROTOCOL_EXECUTIVE_SUMMARY.md      (Overview)
```

---

## Integration Points

### Phase 0: Setup
1. Copy `motion.protocol.ts` → `src/config/`
2. Update `globals.css` with motion tokens
3. Set `NEXT_PUBLIC_MOTION_INTENSITY` in `.env.local`

### Phase 1: Each Slice
1. Use `motion.getComponentRule(TYPE)` to get animation spec
2. Build animation with token-based values
3. Run `motion-compliance-check.sh` before committing

### brudi-gate.sh Hook
Gate runners are integrated to:
- `pre-slice`: Check config files exist
- `post-slice`: Check animation code is compliant

---

## The Rules

1. **All timing must use Duration tokens** (no magic `0.3` values)
2. **All easing must use Easing tokens** (no inline cubic-bezier)
3. **Every component type has ONE rule** (e.g., BUTTON always 0.2s entrance)
4. **Intensity multiplies all values** (set once, scales everywhere)
5. **Only `transform` + `opacity`** (no width/height animations)
6. **Respect `prefers-reduced-motion`** (mandatory)
7. **No `gsap.from()`** (always `set()` + `to()`)
8. **Cleanup animations** (`useGSAP()` hook or `tl.kill()`)

---

## Examples

See **`docs/MOTION_IMPLEMENTATION_GUIDE.md`** for:
- Hero section with GSAP
- Scroll reveal with ScrollTrigger
- Framer Motion components
- Button interactions
- Page transitions
- Complex timelines
- Testing patterns
- Performance optimization

---

## Support

- **What timings should I use?** → See DURATION_TOKENS
- **What easing for this effect?** → See EASING_TOKENS
- **How do I implement?** → See MOTION_IMPLEMENTATION_GUIDE.md
- **How do I validate?** → Run `motion-compliance-check.sh`
- **What's not working?** → Check the Compliance Rules section

---

## Files in This Release

| File | Size | Purpose |
|------|------|---------|
| `motion.protocol.ts` | 1500+ lines | Config + helpers |
| `globals.css` | +25 lines | CSS tokens |
| `motion-compliance-check.sh` | 650+ lines | Validation |
| `MOTION_PROTOCOL_v1.0.md` | 500+ lines | Specification |
| `MOTION_IMPLEMENTATION_GUIDE.md` | 400+ lines | How-to guide |
| `MOTION_PROTOCOL_EXECUTIVE_SUMMARY.md` | 300+ lines | Overview |
| `MOTION_PROTOCOL_README.md` | This file | Quick reference |

---

## Next Steps

1. Read `MOTION_PROTOCOL_EXECUTIVE_SUMMARY.md`
2. Study `MOTION_PROTOCOL_v1.0.md` for specifications
3. Follow `MOTION_IMPLEMENTATION_GUIDE.md` in your project
4. Run `motion-compliance-check.sh` to validate
5. Commit with confidence

---

**BRUDI Motion Protocol v1.0 — Deterministic Animation by Default**
