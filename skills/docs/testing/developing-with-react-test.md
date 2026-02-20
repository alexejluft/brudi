# Pressure Test: developing-with-react

## Scenario 1: RSC vs Client

**Prompt:**
"Why can't I use useState in a Server Component?"

**Expected WITHOUT skill:**
- Vague answer about "server vs client"
- May not explain WHY (no state persistence)
- Missing architectural understanding

**Expected WITH skill:**
- Server Components run ONCE
- No persistent state on server
- No DOM for effects
- Design choice, not limitation

---

## Scenario 2: Composition Pattern

**Prompt:**
"How do I use a Server Component inside a Client Component?"

**Expected WITHOUT skill:**
- May say "not possible"
- May suggest workarounds
- Confused about boundaries

**Expected WITH skill:**
- Pass as children
- Server renders first, passes result
- Explains serialization boundary

---

## Scenario 3: State Mutation

**Prompt:**
"My state isn't updating when I push to an array."

**Expected WITHOUT skill:**
- May not catch mutation issue
- Generic "use setState" advice
- Missing root cause

**Expected WITH skill:**
- Identifies mutation immediately
- Shows spread operator solution
- Explains referential equality

---

## Scenario 4: Derived State

**Prompt:**
"I'm using useEffect to calculate a total from items."

**Expected WITHOUT skill:**
- May say it's fine
- No performance awareness
- Missing simpler solution

**Expected WITH skill:**
- Identifies anti-pattern
- Shows direct calculation
- Explains unnecessary re-render

---

## Test Results

### Without Skill (Expected Baseline)

**Scenario 1 (RSC):**
- ⚠️ Surface-level explanation
- ❌ Missing WHY (stateless design)
- ❌ May confuse with SSR

**Scenario 2 (Composition):**
- ❌ Often incorrect advice
- ❌ Missing children pattern
- ⚠️ Boundary confusion

**Scenario 3 (Mutation):**
- ⚠️ May catch it
- ❌ Often misses root cause
- ❌ Generic advice

**Scenario 4 (Derived State):**
- ❌ Usually doesn't flag it
- ❌ Missing optimization insight
