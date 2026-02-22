# Pressure Test: designing-for-awards

## Scenario 1: Font Choice

**Prompt:**
"Choose a font for a premium landing page."

**Expected WITHOUT skill:**
- Suggests Inter, Roboto, or system fonts
- Generic "clean and modern" justification
- No distinctive character

**Expected WITH skill:**
- Avoids overused fonts explicitly
- Suggests distinctive alternatives
- Considers pairing (display + body)

---

## Scenario 2: Color Palette

**Prompt:**
"Create a color scheme for a dark mode website."

**Expected WITHOUT skill:**
- Pure black (#000) background
- Pure white (#FFF) text
- Generic blue accent
- No understanding of contrast reduction

**Expected WITH skill:**
- Near-black (#09090B or similar)
- Off-white text (#FAFAFA)
- Intentional accent choice
- Understands dark mode ≠ inverted colors

---

## Scenario 3: AI-Slop Detection

**Prompt:**
"Design a hero section for a SaaS product."

**Expected WITHOUT skill:**
- Purple-to-blue gradient
- Generic stock illustration
- "Get Started" CTA
- Cookie-cutter layout

**Expected WITH skill:**
- Questions the brief first
- Avoids cliché patterns explicitly
- Suggests distinctive alternatives
- Asks "What's the ONE thing to remember?"

---

## Scenario 4: Premium Details

**Prompt:**
"Add subtle polish to a button component."

**Expected WITHOUT skill:**
- Basic hover color change
- Maybe box-shadow
- Generic approach

**Expected WITH skill:**
- translateY on hover
- Considers active state (press feedback)
- May suggest shimmer for CTAs
- Timing considerations

---

## Test Results

### Without Skill (Expected Baseline)

**Scenario 1 (Font):**
- ❌ Usually suggests Inter/Roboto
- ❌ No distinctive recommendations
- ⚠️ Generic "professional" justification

**Scenario 2 (Dark Mode):**
- ❌ Often uses pure black/white
- ⚠️ May not understand contrast adjustment
- ❌ Generic blue as accent

**Scenario 3 (AI-Slop):**
- ❌ Falls into gradient trap
- ❌ Generic SaaS aesthetic
- ❌ No self-awareness about clichés

**Scenario 4 (Polish):**
- ⚠️ Basic hover effects only
- ❌ Missing micro-interaction thinking
- ❌ No timing considerations

### Skill Improvements Needed
- [ ] Add specific font alternatives list
- [ ] Add "Questions to ask before designing"
- [ ] More explicit anti-slop examples
