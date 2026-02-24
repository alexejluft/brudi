# Token Bridge Integration Guide

How to wire the token bridge system into your Brudi project.

---

## Step 1: Copy Files to Your Project

From Brudi templates, copy these files to your project:

```bash
# Copy token system
cp ~/Brudi/templates/primitives/tokens.ts src/primitives/tokens.ts
cp ~/Brudi/templates/primitives/use-scroll-reveal.ts src/primitives/use-scroll-reveal.ts
cp ~/Brudi/templates/primitives/use-stagger-entrance.ts src/primitives/use-stagger-entrance.ts

# Verify they exist
ls -la src/primitives/
```

---

## Step 2: Update globals.css

Ensure your `src/styles/globals.css` includes all motion tokens. Compare with `~/Brudi/assets/configs/globals.css`:

**Required sections:**
```css
/* Durations */
--duration-micro: 120ms;
--duration-fast: 180ms;
--duration-normal: 350ms;
--duration-slow: 650ms;
--duration-hero: 1000ms;
--duration-stagger: 80ms;
--duration-stagger-tight: 50ms;
--duration-stagger-loose: 120ms;

/* Easings (cubic-bezier format) */
--ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
--ease-exit: cubic-bezier(0.25, 1, 0.5, 1);
--ease-smooth: cubic-bezier(0.25, 1, 0.5, 1);
--ease-dramatic: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
--ease-linear: cubic-bezier(0, 0, 1, 1);

/* Distances */
--distance-micro: 4px;
--distance-xs: 8px;
--distance-sm: 12px;
--distance-base: 24px;
--distance-md: 32px;
--distance-lg: 40px;
--distance-xl: 48px;
--distance-xxl: 64px;
--distance-xxxl: 80px;
--distance-full: 100px;
```

If any are missing, add them now. **Do not change the values** — they must match `tokens.ts`.

---

## Step 3: Install Dependencies

If not already installed:

```bash
npm install gsap
```

For scroll animations:
```bash
npm install gsap/dist/ScrollTrigger
```

---

## Step 4: Update CLAUDE.md

Add this section to your project's `CLAUDE.md`:

```markdown
## Token Bridge System

All GSAP animations use the token system in `src/primitives/tokens.ts`.

### Required Imports

Every component with animations must import tokens:

```typescript
import { duration, easing, distance, stagger } from '@/primitives/tokens'
import { useScrollReveal, useStaggerEntrance } from '@/primitives/use-scroll-reveal'
```

### Forbidden Patterns

These patterns are **NOT ALLOWED** and will block commits:

```typescript
// ❌ Hardcoded duration number
gsap.to(el, { duration: 0.8 })

// ❌ Hardcoded easing string
gsap.to(el, { ease: "power2.out" })

// ❌ Hardcoded distance
gsap.set(el, { y: 32 })

// ❌ Margin/padding animation
gsap.to(el, { marginTop: "32px" })

// ❌ Raw ScrollTrigger (use the hook instead)
gsap.to(el, { scrollTrigger: { ... } })
```

### Correct Patterns

```typescript
// ✅ Token-driven duration
gsap.to(el, { duration: duration.slow })

// ✅ Token-driven easing
gsap.to(el, { ease: easing.exit })

// ✅ Token-driven distance
gsap.set(el, { y: distance.md })

// ✅ Transform-based animation
gsap.to(el, { y: 0, x: 0 })

// ✅ Use the hook for scroll
useScrollReveal(ref, { duration: 'slow', ease: 'exit' })
```

### Read These Skills

Before building animations:
- `~/Brudi/skills/implementing-token-bridge/SKILL.md`
- `~/Brudi/skills/orchestrating-react-animations/SKILL.md`
```

---

## Step 5: Update TASK.md

Add this checklist to Phase 1 (Vertical Slices):

```markdown
### Phase 1 — Vertical Slices

#### Animation & Motion Requirements

For each section with animations:

- [ ] All durations from `duration.*` token (not hardcoded numbers)
- [ ] All easing from `easing.*` token (not hardcoded strings)
- [ ] All distances from `distance.*` token (not hardcoded pixels)
- [ ] ScrollTrigger animations use `useScrollReveal()` hook
- [ ] Staggered animations use `useStaggerEntrance()` hook
- [ ] Token bridge gate passes: `bash ~/Brudi/orchestration/brudi-gate-token-bridge.sh`
- [ ] No margin/padding/width/height animations (use transform instead)
- [ ] Screenshot shows animations playing smoothly (no jank, no jumps)

**Token Bridge is non-negotiable.** Code review will reject hardcoded values.
```

---

## Step 6: Copy Gate Script

Create the gate script for automated enforcement:

```bash
# Copy gate enforcement script
mkdir -p .brudi/gates
cp ~/Brudi/skills/implementing-token-bridge/GATE-ENFORCEMENT.md .brudi/gates/token-bridge.md
cp ~/Brudi/orchestration/brudi-gate-token-bridge.sh .brudi/gates/token-bridge.sh
chmod +x .brudi/gates/token-bridge.sh
```

Then integrate into your main gate runner (`.brudi/brudi-gate.sh` or wherever gates are run):

```bash
# Add this to your gate runner:
if [ "$PHASE" = "1" ]; then
  echo "Running Token Bridge Compliance Check..."
  bash .brudi/gates/token-bridge.sh . || {
    echo "❌ Token Bridge gate failed. Code uses hardcoded animation values."
    exit 1
  }
fi
```

---

## Step 7: Test Locally

Test the token system works:

```bash
# Verify tokens.ts can be imported
npx tsc --noEmit src/primitives/tokens.ts

# Run the gate manually
bash .brudi/gates/token-bridge.sh .

# Should output:
# ✅ Token Bridge Compliance OK
```

---

## Step 8: Update .eslintrc.cjs (Optional but Recommended)

Add a rule to warn against hardcoded motion values:

```javascript
// In .eslintrc.cjs

module.exports = {
  // ... existing config ...
  rules: {
    // ... existing rules ...

    // Warn: Duration looks hardcoded
    'no-restricted-syntax': [
      'warn',
      {
        selector: "ObjectExpression > Property[key.name='duration'][value.type='Literal']",
        message: 'Use duration.* token instead of hardcoded number. Import: import { duration } from "@/primitives/tokens"',
      },
      {
        selector: "ObjectExpression > Property[key.name='ease'][value.type='Literal']",
        message: 'Use easing.* token instead of hardcoded string. Import: import { easing } from "@/primitives/tokens"',
      },
    ],
  },
}
```

---

## Step 9: Documentation

Create a local documentation file for your team:

```bash
cat > docs/MOTION-SYSTEM.md << 'EOF'
# Motion System — Token Bridge

All animations in this project use the token bridge system.

## Quick Start

```tsx
import { duration, easing, distance } from '@/primitives/tokens'
import { useScrollReveal } from '@/primitives/use-scroll-reveal'

function MyComponent() {
  const ref = useRef(null)
  useScrollReveal(ref, {
    duration: 'normal',
    ease: 'exit',
    distance: 'md',
  })

  return <div ref={ref}>Animated content</div>
}
```

## Token Reference

See: ~/Brudi/skills/implementing-token-bridge/SKILL.md

## Common Patterns

See: ~/Brudi/skills/implementing-token-bridge/EXAMPLES.md (if available)

## Troubleshooting

Q: Animation doesn't start
A: Check useEffect cleanup, verify ref is attached, ensure element exists on mount

Q: Animation is jerky
A: Verify using transform (y, x, scale), not margin/padding

Q: ScrollTrigger doesn't trigger
A: Use useScrollReveal hook, ensure trigger element is in viewport eventually

---

For detailed info, read the skill in ~/Brudi/skills/implementing-token-bridge/SKILL.md
EOF
```

---

## Step 10: Team Communication

Share the summary with your team:

```markdown
## 📣 Token Bridge System Live

We're now using a centralized token system for all GSAP animations.

### What Changed
- All duration/easing/distance values are now in `src/primitives/tokens.ts`
- Use `useScrollReveal()` and `useStaggerEntrance()` hooks instead of raw GSAP
- Commit hooks prevent hardcoded animation values

### Why
- Single source of truth (change once, updates everywhere)
- Consistency across animations
- Easier refactoring (adjust one token value = all animations updated)
- Type safety (TypeScript catches token name typos)

### What You Need to Do

For new animations:
1. Import tokens: `import { duration, easing, distance } from '@/primitives/tokens'`
2. Use tokens, not magic numbers: `duration.normal` not `0.35`
3. Use hooks: `useScrollReveal()` instead of raw ScrollTrigger

For old code:
- Code review will request token migration
- Pattern: Find hardcoded values → Replace with token references

### Resources
- Quick guide: ~/Brudi/skills/implementing-token-bridge/SKILL.md
- Full API: src/primitives/tokens.ts (JSDoc comments)
- Examples: (Add to your docs/)

Questions? See the skill or check the inline JSDoc comments.
```

---

## Step 11: Verify Integration

Checklist to confirm everything is set up:

- [ ] `src/primitives/tokens.ts` exists and exports all token categories
- [ ] `src/primitives/use-scroll-reveal.ts` exists
- [ ] `src/primitives/use-stagger-entrance.ts` exists
- [ ] `src/styles/globals.css` has all `--duration-*`, `--ease-*`, `--distance-*` tokens
- [ ] CLAUDE.md updated with token bridge section
- [ ] TASK.md updated with Phase 1 token requirements
- [ ] Gate script copied and integrated
- [ ] `npm run lint` passes (no hardcoded motion values detected)
- [ ] `npm run build` succeeds
- [ ] Manual gate test passes: `bash .brudi/gates/token-bridge.sh .`

---

## Troubleshooting Integration

### Problem: "Cannot find module '@/primitives/tokens'"

**Solution:** Update `tsconfig.json` or `next.config.js`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Problem: GSAP import errors

**Solution:** Ensure imports are correct:
```typescript
// ✅ Correct
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ❌ Wrong
import gsap, { ScrollTrigger } from 'gsap'
```

### Problem: Gate script not executable

**Solution:**
```bash
chmod +x .brudi/gates/token-bridge.sh
```

### Problem: Tokens don't match CSS values

**Solution:** Open `tokens.ts` and compare with `globals.css` — all numeric values must match. Example:
```css
/* globals.css */
--duration-normal: 350ms;
```

```typescript
// tokens.ts
normal: 0.35, // 350ms converted to seconds
```

---

## Next Steps

1. **Phase 0:** Integrate system (you are here)
2. **Phase 1:** Build sections with token-driven animations
3. **Phase 2:** Code review enforces token compliance
4. **Phase 3:** Maintenance — change one token value, all animations update

---

## References

- **Skill:** `~/Brudi/skills/implementing-token-bridge/SKILL.md`
- **Gate Enforcement:** `~/Brudi/skills/implementing-token-bridge/GATE-ENFORCEMENT.md`
- **Token Constants:** `src/primitives/tokens.ts` (with JSDoc)
- **Hooks:** `src/primitives/use-scroll-reveal.ts` and `use-stagger-entrance.ts` (with examples)
