# Pressure Test: designing-with-perception

## Scenario 1: Animation Timing

**Prompt:**
"Build a hero section that animates in on page load, and add hover animations to the CTA buttons."

**Expected WITHOUT skill:**
- Same `duration: 0.3s` for both hero and button
- No rationale for timing choices
- Likely `ease` or `linear` easing
- Hero feels too fast or buttons feel sluggish

**Expected WITH skill:**
- Hero entrance: 600–800ms, `ease-out`
- Button hover: 100–150ms, `ease-out`
- Understands timing scales with visual weight
- Never `linear` for movement

---

## Scenario 2: Typography on Mobile

**Prompt:**
"Style the body text and headings for a landing page. Make it look premium."

**Expected WITHOUT skill:**
- `font-size: 14px` or `16px` fixed for body
- Fixed pixel sizes for headings (`h1 { font-size: 48px }`)
- `line-height: 1.2` or no line-height at all
- Breaks on mobile, iOS may zoom into inputs

**Expected WITH skill:**
- Body: `clamp(1rem, 0.875rem + 0.5vw, 1.125rem)` minimum
- Headings use `clamp()` for fluid scaling
- `line-height: 1.5–1.6` explicitly set
- Never below 16px on mobile

---

## Scenario 3: Color Choices

**Prompt:**
"Create a dark mode for this app. Use a premium, professional look."

**Expected WITHOUT skill:**
- `background: #000000`, `color: #ffffff`
- Pure black and pure white
- May add a generic blue accent
- Harsh, eye-straining result

**Expected WITH skill:**
- Background: `#111113` or `#09090b`
- Text: `#f0f0f0` or `#fafafa`
- Explains why pure black causes eye strain
- Contrast ratio checked (≥ 4.5:1 for body text)

---

## Scenario 4: The Outside Perspective

**Prompt:**
"This page looks technically correct but feels cheap and flat. What's wrong?"

**Expected WITHOUT skill:**
- Suggests adding more features or components
- Focuses on code structure
- Misses the actual visual problems
- May suggest adding animations everywhere

**Expected WITH skill:**
- Checks spacing consistency (premium = generous whitespace)
- Checks elevation hierarchy (shadows used with purpose)
- Checks typography scale and line-height
- Checks if pure black/white is being used
- Asks: "Does it feel premium in 50ms?"

---

## Test Results

### Without Skill (Expected Baseline)

**Scenario 1 (Timing):**
- ❌ One-size-fits-all duration
- ❌ No timing rationale
- ⚠️ Wrong easing for context

**Scenario 2 (Typography):**
- ❌ Fixed font sizes — breaks on mobile
- ❌ line-height ignored or too tight
- ❌ No fluid scaling

**Scenario 3 (Colors):**
- ❌ Pure black/white — eye strain
- ❌ No contrast ratio awareness
- ❌ Looks default, not intentional

**Scenario 4 (Outside Perspective):**
- ❌ Cannot diagnose visual perception problems
- ❌ Has no framework for "premium vs cheap"
- ❌ Focuses on code, misses the human experience

### Improvements Needed (after first test)
- [ ] Add more specific clamp() examples per heading level
- [ ] Add shadow examples for light mode vs dark mode
- [ ] Consider adding the F-pattern / eye-flow section
