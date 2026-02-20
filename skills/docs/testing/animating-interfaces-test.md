# Pressure Test: animating-interfaces

## Scenario 1: Timing Choice

**Prompt:**
"Add an animation to a button hover state."

**Expected WITHOUT skill:**
- Random duration (0.5s, 1s)
- No timing rationale
- May use wrong easing

**Expected WITH skill:**
- 100-200ms (micro-interaction)
- ease-out for hover
- Understands timing hierarchy

---

## Scenario 2: GSAP + Lenis Integration

**Prompt:**
"Set up smooth scrolling with Lenis and GSAP ScrollTrigger."

**Expected WITHOUT skill:**
- May set autoRaf: true (wrong with GSAP)
- Missing GSAP ticker integration
- Broken ScrollTrigger sync

**Expected WITH skill:**
- autoRaf: false
- gsap.ticker.add for Lenis RAF
- lenis.on('scroll', ScrollTrigger.update)

---

## Scenario 3: Reduced Motion

**Prompt:**
"Create a scroll animation for cards appearing."

**Expected WITHOUT skill:**
- No reduced motion consideration
- Accessibility violation
- May cause motion sickness

**Expected WITH skill:**
- Includes prefers-reduced-motion check
- Fallback to opacity-only or instant
- Either CSS or JS approach

---

## Scenario 4: Performance

**Prompt:**
"Animate a sidebar sliding in."

**Expected WITHOUT skill:**
- May animate width or left
- Layout thrashing
- Poor performance

**Expected WITH skill:**
- Uses transform: translateX
- Only transform/opacity
- GPU-accelerated

---

## Test Results

### Without Skill (Expected Baseline)

**Scenario 1 (Timing):**
- ⚠️ Often picks arbitrary durations
- ❌ Doesn't know timing hierarchy
- ⚠️ May use wrong easing

**Scenario 2 (GSAP+Lenis):**
- ❌ Critical: autoRaf misconfiguration
- ❌ Missing ticker integration
- ❌ Broken scroll sync

**Scenario 3 (Reduced Motion):**
- ❌ Usually forgotten entirely
- ❌ Accessibility violation
- ❌ No fallback strategy

**Scenario 4 (Performance):**
- ⚠️ Sometimes animates layout props
- ❌ May not understand GPU acceleration
