# Pressure Test: building-layouts

## Scenario 1: Grid vs Flexbox Decision

**Prompt:**
"Create a card grid that shows 3 cards per row on desktop, 2 on tablet, 1 on mobile."

**Expected WITHOUT skill:**
- Might use media queries for each breakpoint
- Might use flexbox with percentage widths
- Might hardcode breakpoints

**Expected WITH skill:**
- Uses `repeat(auto-fit, minmax(250px, 1fr))`
- No media queries needed
- Fluid and responsive

---

## Scenario 2: Container Queries Understanding

**Prompt:**
"Make a card component that shows horizontal layout when in the main content area but stacked when in a narrow sidebar."

**Expected WITHOUT skill:**
- Might try media queries (wrong — viewport doesn't change)
- Might use JavaScript to detect container width
- Might give up and say "not possible"

**Expected WITH skill:**
- Uses `container-type: inline-size`
- Uses `@container` query
- Understands the "golden rule"

---

## Scenario 3: fr Unit Misunderstanding

**Prompt:**
"Create columns: 200px fixed, then two flexible columns where the second is twice as wide as the first."

**Expected WITHOUT skill:**
- Might write `200px 1fr 2fr` correctly but not understand WHY
- Might try percentages
- Might not understand how fr distributes FREE space

**Expected WITH skill:**
- Writes `200px 1fr 2fr`
- Can explain: "200px first, then remaining space split 1:2"

---

## Scenario 4: Justify vs Align Confusion

**Prompt:**
"Center items both horizontally and vertically in a grid."

**Expected WITHOUT skill:**
- Might confuse justify/align
- Might use flexbox instead
- Might use margin: auto hacks

**Expected WITH skill:**
- Uses `place-items: center`
- Knows justify = horizontal, align = vertical

---

## Test Results

### Without Skill (Expected Baseline)
Based on typical AI behavior without specialized training:

**Scenario 1 (Grid responsive):**
- ⚠️ Often uses media queries with fixed breakpoints
- ⚠️ Sometimes uses flexbox with flex-wrap
- ❌ Rarely uses `auto-fit` + `minmax` pattern

**Scenario 2 (Container Queries):**
- ❌ Often suggests media queries (wrong solution)
- ❌ Sometimes suggests JavaScript resize observers
- ❌ May not know Container Queries exist or how they work
- ❌ Doesn't understand "golden rule" of containment

**Scenario 3 (fr units):**
- ✅ Usually gets syntax right
- ⚠️ Often can't explain WHY it works
- ❌ May not understand "free space" concept

**Scenario 4 (justify/align):**
- ⚠️ Often confuses the two
- ✅ Usually knows `place-items: center`
- ⚠️ May over-explain with flexbox instead

### With Skill
Date: 2026-02-20
Status: PENDING — requires subagent testing when gateway available

### Skill Improvements Needed
Based on analysis:
- [ ] Add more explicit Container Queries examples
- [ ] Add flowchart: "Grid vs Flexbox vs Container Query?"
- [ ] Add "golden rule" explanation more prominently

