# Layout Primitives for Brudi v3.4.0

**Status:** ✅ Phase 0 Foundation Implementation — Ready for Integration

**Created:** 2026-02-24

**Purpose:** Eliminate spacing chaos and prevent every section from reinventing container/grid/stack patterns from scratch.

---

## What Was Created

### 1. **Layout Primitive Components**
**File:** `/sessions/optimistic-quirky-franklin/mnt/brudi/templates/primitives/layout.tsx`

Four production-ready React components:

#### `Container`
Enforces consistent max-width and horizontal padding across all sections.
- Props: `size` ('narrow'|'default'|'wide'|'full'), className?, children`
- Handles: max-w values (4xl/6xl/7xl/none), consistent px-6 sm:px-8 lg:px-12
- TypeScript strict mode, server component compatible

#### `Section`
Wrapper for major page sections with consistent vertical spacing and semantic HTML.
- Props: `id` (REQUIRED), `spacing` ('sm'|'md'|'lg'|'xl'), `as`, `className`, `children`
- Handles: py-16/24/32/40 mappings, semantic HTML (section/article/aside/div)
- Type error if `id` is missing — intentional enforcement

#### `Stack`
Flexbox column layout with predictable gaps for vertical stacking.
- Props: `gap` ('xs'|'sm'|'md'|'lg'|'xl'), `className`, `children`
- Handles: gap-2/4/6/8/12 mappings, flex-direction: column
- Use for: form fields, text blocks, lists

#### `Grid`
Responsive multi-column layout with mobile-first defaults.
- Props: `cols` ({ sm?, md?, lg? }), `gap`, `className`, `children`
- Default: 1 column sm, 2 columns md, 3 columns lg
- Handles: Arbitrary Tailwind grid-template-columns via bracket notation
- Use for: feature cards, team members, product grids

#### `LayoutDebug` (Bonus)
Visual debugging component to verify spacing is consistent during development.

**Code Quality:**
- ✅ TypeScript strict mode
- ✅ No `any` types
- ✅ Full JSDoc comments
- ✅ Server component compatible
- ✅ Tailwind only (no CSS-in-JS)
- ✅ Mobile-first design

**File Size:** 4.8 KB (copy to any project)

---

### 2. **Teaching Skill: Building Layout Primitives**
**File:** `/sessions/optimistic-quirky-franklin/mnt/brudi/skills/building-layout-primitives/SKILL.md`

Comprehensive documentation for agents on:

#### What's Taught
- WHY layout primitives exist (prevent spacing reinvention)
- HOW to use each component (with examples)
- WHEN to use which primitive (decision tree)
- Forbidden patterns (0 tolerance)
- Common patterns (hero, cards, forms, two-column)
- TypeScript typing
- Integration with design system

#### Structure
1. **Why they exist** — The voidlab postmortem problem
2. **The 4 primitives** — Detailed documentation per component
3. **Decision tree** — Which primitive for which use case
4. **Design system integration** — How they use CSS tokens
5. **Common patterns** — 4 real-world examples
6. **Forbidden patterns** — ESLint-enforced rules
7. **Performance notes** — Safe Tailwind patterns
8. **Integration checklist** — Project setup steps
9. **FAQ** — Common questions

**Content:** 15 KB, ~450 lines of technical documentation
**Audience:** AI agents, developers new to Brudi

---

### 3. **Integration Documentation**
**File:** `/sessions/optimistic-quirky-franklin/mnt/brudi/LAYOUT_PRIMITIVES_INTEGRATION.md`

Detailed guide for Brudi maintainers on:

#### What It Covers
- Where to wire primitives into existing templates (CLAUDE.md, TASK.md)
- Phase 0 quality gate enhancements
- ESLint rule suggestions (pseudo-code)
- Post-Phase-0 usage guarantees
- Skill reading schedule
- Verification checklist
- Test case for validation
- FAQ for maintainers
- Future enhancement ideas

**Purpose:** Shows exactly how to integrate this into Brudi's existing system.

---

## Key Design Decisions

### Decision 1: Why Copy Components Instead of NPM Package?
- Components are lightweight (4.8 KB)
- Each project can customize if needed (rare but possible)
- No external dependency
- Team owns their spacing rules
- Easier to audit and modify

### Decision 2: Why `id` is Required on Section?
- Enables anchor navigation (`#features`)
- Required for analytics tracking
- Hook point for ScrollTrigger/GSAP
- Semantic importance for page structure
- TypeScript enforces it — no escape

### Decision 3: Fixed Props vs Flexible?
- `size`, `spacing`, `gap`, `cols` are locked to specific values
- Prevents infinite customization (which causes chaos)
- Aligns with Alex's principle: "Opinions over options"
- Rare exceptions document why they needed custom values

### Decision 4: Server Component Compatible?
- No `'use client'` unless content inside needs interactivity
- Keeps layout structure on server
- Smaller JavaScript bundles
- Follows Next.js App Router best practices

---

## How to Integrate Into Brudi

### For Maintainers: 3-Step Integration

**Step 1: Wire into templates/CLAUDE.md**
- Add `building-layout-primitives` to Phase 0 skills list
- Update hard gates to mention primitive patterns

**Step 2: Wire into templates/TASK.md**
- Add primitives task to Phase 0 checklist
- Include copying layout.tsx from template

**Step 3: Optional ESLint Enhancement**
- Implement suggested linting rules
- Detect hardcoded max-w-, ad-hoc px-, missing Section id

See `LAYOUT_PRIMITIVES_INTEGRATION.md` for exact line numbers and code snippets.

### For Projects: Copy & Go
```bash
# In a new Brudi project (Phase 0):
cp ~/Brudi/templates/primitives/layout.tsx src/components/primitives/layout.tsx

# Then in your layout/pages:
import { Section, Container, Stack, Grid } from '@/components/primitives/layout';

<Section id="hero" spacing="lg">
  <Container size="wide">
    {/* Content */}
  </Container>
</Section>
```

---

## Quality Checklist

Before marking implementation complete:

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ No `any` types
- ✅ Full JSDoc comments
- ✅ Props are opinion-enforced (not flexible)
- ✅ Server component compatible
- ✅ Mobile-first responsive
- ✅ Tailwind only (no CSS-in-JS)

### Documentation Quality
- ✅ SKILL.md covers all 4 components
- ✅ Decision tree included
- ✅ Common patterns with examples
- ✅ Forbidden patterns clearly marked
- ✅ Integration checklist provided
- ✅ FAQ section for common questions

### Integration Planning
- ✅ Integration guide written
- ✅ Exact line numbers for CLAUDE.md updates noted
- ✅ Exact line numbers for TASK.md updates noted
- ✅ ESLint rule pseudo-code included
- ✅ Test case scenario described
- ✅ Future enhancements documented

---

## Files Created

| File Path | Size | Purpose |
|-----------|------|---------|
| `templates/primitives/layout.tsx` | 4.8 KB | Production components |
| `skills/building-layout-primitives/SKILL.md` | 15 KB | Agent teaching skill |
| `LAYOUT_PRIMITIVES_INTEGRATION.md` | ~5 KB | Maintainer integration guide |
| `LAYOUT_PRIMITIVES_README.md` | This file | Overview and summary |

**Total:** ~30 KB of code and documentation

---

## Usage Examples

### Example 1: Homepage Hero
```tsx
<Section id="hero" spacing="lg" as="section">
  <Container size="wide">
    <Stack gap="lg" className="items-center text-center">
      <h1>Welcome to Brudi</h1>
      <p className="text-muted">Ship award-level projects faster</p>
      <button className="btn btn-primary">Get Started</button>
    </Stack>
  </Container>
</Section>
```

### Example 2: Feature Cards
```tsx
<Section id="features" spacing="md">
  <Container>
    <Stack gap="lg" className="items-center text-center mb-16">
      <h2>Our Features</h2>
      <p className="text-muted">Everything you need in one place</p>
    </Stack>
    <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
      <FeatureCard title="Fast" />
      <FeatureCard title="Reliable" />
      <FeatureCard title="Scalable" />
    </Grid>
  </Container>
</Section>
```

### Example 3: Contact Form
```tsx
<Section id="contact" spacing="md">
  <Container size="narrow">
    <Stack gap="lg" className="items-center text-center mb-12">
      <h2>Get in Touch</h2>
      <p>We'd love to hear from you</p>
    </Stack>
    <form>
      <Stack gap="sm">
        <input placeholder="Your name" />
        <input placeholder="Your email" />
        <textarea placeholder="Your message" rows={6} />
        <button>Send Message</button>
      </Stack>
    </form>
  </Container>
</Section>
```

---

## Integration Workflow for Agents

When an agent starts a new Brudi project:

1. **Phase 0, Task: "Skills"**
   - Read `~/Brudi/CLAUDE.md` (main Brudi rules)
   - Read `~/Brudi/skills/building-layout-primitives/SKILL.md` ← NEW
   - Read design tokens, typography, dark mode, etc.

2. **Phase 0, Task: "Setup"**
   - Initialize Next.js project
   - Copy layout primitives: `cp ~/Brudi/templates/primitives/layout.tsx src/components/primitives/layout.tsx` ← NEW
   - Set up fonts, colors, GSAP, Lenis

3. **Phase 0, Quality Gate**
   - Verify primitives are copied and importable
   - Verify `npm run build` succeeds

4. **Phase 1+, Every Slice**
   - Wrap sections in `<Section id="...">`
   - Wrap content in `<Container>`
   - Use `<Stack>` for vertical spacing
   - Use `<Grid>` for multi-column layouts
   - NEVER hardcode max-w-* or ad-hoc px-*

---

## Maintenance Notes for Brudi Team

### When to Update Primitives
- If Tailwind breakpoints change → Update all sm:/md:/lg: mappings
- If design token spacing values change → Update sizeMap, spacingMap, gapMap
- If React API changes → Update component signatures
- Never: Remove components or change prop names (breaking changes)

### When to Add New Sizes
- If a project truly needs a different max-width → Document in PROJECT_STATUS.md
- Don't modify the template. Instead, extend it in the project copy.
- Keep the template as the "opinionated default"

### Monitoring Usage
- Track which size/spacing/gap values are most used (can help future optimization)
- Monitor if agents are hardcoding max-w-* despite primitives existing
- That suggests the primitives don't cover a common case → document and extend

---

## Future Enhancements (Not Blocking)

1. **Storybook Stories** — Auto-generate stories for each primitive + variants
2. **Figma Integration** — Sync breakpoints and max-widths from Figma plugin
3. **Analytics Dashboard** — Track primitive usage across Brudi projects
4. **Accessibility Audit** — Auto-check Section id presence
5. **Performance Monitoring** — Warn if Grid has >20 children
6. **Dark Mode Showcase** — Document how primitives work with color tokens
7. **CLI Helper** — `brudi layout --init` to scaffold Section+Container patterns

---

## Summary

Layout primitives are the missing foundation that voidlab revealed was needed. This implementation provides:

✅ **4 production-ready components** (Container, Section, Stack, Grid)
✅ **Comprehensive teaching skill** for agents (SKILL.md)
✅ **Integration guide** for Brudi maintainers
✅ **Zero breaking changes** to existing Brudi infrastructure
✅ **TypeScript strict mode** throughout
✅ **Tailwind-only** styling (no CSS-in-JS)
✅ **Mobile-first** design
✅ **Server component compatible**

The components are ready to copy into any project. The documentation is ready for agents to read. The integration points are documented for the Brudi maintenance team.

**Next step for maintainers:** Review the integration guide and apply the suggested updates to CLAUDE.md and TASK.md.

---

## Contact & Questions

These components were designed with Alex's principles:
- "Complete sections over many half-built sections"
- "Opinions over options"
- "Ship the most-used pattern before the most complex one"

They're meant to be the shared foundation that every Brudi project uses, starting Phase 0.
