# Layout Primitives — Complete Documentation Index

**Quick Links to Everything**

---

## 🚀 Start Here

**If you have 5 minutes:**
Read `LAYOUT_PRIMITIVES_README.md` — Overview of what was created and why.

**If you have 15 minutes:**
Read `LAYOUT_PRIMITIVES_INTEGRATION.md` — Understanding where primitives fit in Brudi.

**If you have 30 minutes:**
Read `skills/building-layout-primitives/SKILL.md` — Complete agent-facing documentation.

---

## 📁 All Files Created

### Core Implementation
| File | Type | Purpose | Audience |
|------|------|---------|----------|
| `templates/primitives/layout.tsx` | Component | 4 React components (Container, Section, Stack, Grid) | Developers |
| `skills/building-layout-primitives/SKILL.md` | Documentation | Complete skill teaching | AI Agents |

### Integration & Planning
| File | Type | Purpose | Audience |
|------|------|---------|----------|
| `LAYOUT_PRIMITIVES_README.md` | Guide | Overview, decisions, examples | Everyone |
| `LAYOUT_PRIMITIVES_INTEGRATION.md` | Guide | Where to wire into Brudi | Brudi Team |
| `LAYOUT_PRIMITIVES_DIFF.md` | Reference | Exact line-by-line changes | Brudi Team |
| `LAYOUT_PRIMITIVES_INDEX.md` | Navigation | This file | Everyone |

### Final Report
| File | Type | Purpose | Audience |
|------|------|---------|----------|
| `/TASK_COMPLETION_REPORT.md` | Report | Task completion & metrics | Project Lead |

---

## 🎯 By Role

### AI Agents (First Time Using Layout Primitives)
1. Read: `skills/building-layout-primitives/SKILL.md` (comprehensive)
2. Reference: `templates/primitives/layout.tsx` (JSDoc comments)
3. Copy: `templates/primitives/layout.tsx` to your project in Phase 0
4. Use: Container, Section, Stack, Grid in your pages

### Brudi Maintainers (Integrating Into System)
1. Read: `LAYOUT_PRIMITIVES_README.md` (overview)
2. Read: `LAYOUT_PRIMITIVES_INTEGRATION.md` (detailed plan)
3. Apply: Changes from `LAYOUT_PRIMITIVES_DIFF.md` to templates
4. Test: Create sample project, verify it works
5. Announce: Update changelog, link to SKILL.md

### Developers (Using in Projects)
1. Copy: `templates/primitives/layout.tsx` to `src/components/primitives/layout.tsx`
2. Import: `import { Section, Container, Stack, Grid } from '@/components/primitives/layout'`
3. Reference: Examples in `skills/building-layout-primitives/SKILL.md`
4. Build: Every page using the 4 components

---

## 📚 Documentation Map

```
LAYOUT_PRIMITIVES_README.md
├── Overview of what was created
├── Key design decisions
├── Quality checklist
├── Usage examples (3 patterns)
└── Future enhancements

LAYOUT_PRIMITIVES_INTEGRATION.md
├── Where to wire (templates/CLAUDE.md)
├── Where to wire (templates/TASK.md)
├── Phase 0 quality gate
├── ESLint rules (pseudo-code)
├── Verification checklist
└── Maintenance notes

LAYOUT_PRIMITIVES_DIFF.md
├── Change 1: CLAUDE.md (line ~33)
├── Change 2: CLAUDE.md (line ~98)
├── Change 3: CLAUDE.md (line ~248)
├── Change 4: TASK.md (line ~32)
├── Change 5: TASK.md (line ~36)
├── Change 6: TASK.md (line ~48)
├── Change 7: assets/INDEX.md
├── Change 8: eslint.config.js
├── Before/after comparison
├── Rollout plan
└── Verification checklist

skills/building-layout-primitives/SKILL.md
├── Why layout primitives exist
├── The 4 Primitives (Container, Section, Stack, Grid)
├── Decision tree
├── Integration with design system
├── Common patterns (4 examples)
├── Forbidden patterns
├── TypeScript + Strict Mode
├── Performance notes
├── Integration checklist
└── FAQ

templates/primitives/layout.tsx
├── Container (max-width + padding)
├── Section (vertical spacing + id required)
├── Stack (flex column with gap)
├── Grid (responsive columns)
└── LayoutDebug (development helper)
```

---

## ✅ Verification Checklist

**Before marking integration complete:**

### Files Exist
- [ ] `templates/primitives/layout.tsx` ✅ 226 lines
- [ ] `skills/building-layout-primitives/SKILL.md` ✅ 526 lines
- [ ] `LAYOUT_PRIMITIVES_INTEGRATION.md` ✅ 288 lines
- [ ] `LAYOUT_PRIMITIVES_DIFF.md` ✅ 326 lines
- [ ] `LAYOUT_PRIMITIVES_README.md` ✅ 356 lines

### Code Quality
- [ ] No `any` types in TypeScript ✅
- [ ] Full JSDoc documentation ✅
- [ ] Server component compatible ✅
- [ ] Tailwind only (no CSS-in-JS) ✅
- [ ] Mobile-first responsive ✅

### Documentation Quality
- [ ] SKILL.md covers all 4 components ✅
- [ ] Decision tree included ✅
- [ ] Common patterns with examples ✅
- [ ] Forbidden patterns marked ✅
- [ ] FAQ section complete ✅

### Integration Planning
- [ ] Exact line numbers for CLAUDE.md ✅
- [ ] Exact line numbers for TASK.md ✅
- [ ] ESLint rule suggestions ✅
- [ ] Test case scenario ✅
- [ ] Rollout plan documented ✅

---

## 🔧 Quick Setup (For New Projects)

### Phase 0: Copy Primitives
```bash
cp ~/Brudi/templates/primitives/layout.tsx src/components/primitives/layout.tsx
```

### Phase 0: Verify
```bash
npm run build  # Should succeed
npm run lint   # Should pass
```

### Phase 1: Use in Pages
```tsx
import { Section, Container, Stack, Grid } from '@/components/primitives/layout';

export default function Home() {
  return (
    <Section id="hero" spacing="lg">
      <Container size="wide">
        <Stack gap="lg">
          <h1>Welcome</h1>
          <p>Description...</p>
        </Stack>
      </Container>
    </Section>
  );
}
```

---

## 🎓 Learning Path

### For Agents
1. **Understand the problem** (read: Why section of SKILL.md)
2. **Learn each component** (read: The 4 Primitives section)
3. **Learn when to use each** (read: Decision Tree)
4. **See real examples** (read: Common Patterns)
5. **Know what's forbidden** (read: Forbidden Patterns section)
6. **Copy to project** and start using

**Time:** ~30-45 minutes to full proficiency

### For Maintainers
1. **Overview** (read: LAYOUT_PRIMITIVES_README.md)
2. **Integration plan** (read: LAYOUT_PRIMITIVES_INTEGRATION.md)
3. **Apply changes** (follow: LAYOUT_PRIMITIVES_DIFF.md)
4. **Test** (create sample project)
5. **Announce** (update changelog, link to SKILL.md)

**Time:** ~2-3 hours including testing

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| Total lines of code | 226 (layout.tsx only) |
| Total lines of documentation | 1,496 |
| Total files created | 6 |
| Components exported | 5 |
| Required Phase 0 changes | ~8 |
| Breaking changes | 0 |
| TypeScript strict mode | ✅ Yes |
| Server component compatible | ✅ Yes |
| CSS-in-JS | ❌ No (Tailwind only) |

---

## 🚨 Important Notes

### For AI Agents
- **ALWAYS** read `building-layout-primitives` SKILL.md before using primitives
- **ALWAYS** add `id` prop to Section (TypeScript enforces this)
- **NEVER** hardcode `max-w-*` or ad-hoc `px-*` (use Container)
- **NEVER** use raw `<div className="gap-...">` (use Stack or Grid)

### For Brudi Maintainers
- These changes are **non-breaking**
- Primitives should be **mandatory** in Phase 0 from now on
- Consider ESLint rules **optional for now**, implement in future
- **Test thoroughly** before announcements

### For Project Developers
- Copy `layout.tsx` to your `src/components/primitives/` in Phase 0
- Use these 4 components **exclusively** for layout structure
- Never repeat spacing patterns (let components handle it)
- Reference SKILL.md if you're unsure which primitive to use

---

## 🔗 Related Skills

These skills work well with layout primitives:

- `designing-award-layouts-core` — Depth and visual hierarchy (uses primitives)
- `building-layouts` — Grid vs Flexbox decision tree (primitives implement)
- `implementing-design-tokens` — Spacing values primitives use
- `verifying-ui-quality` — Quality gates can verify primitive usage

---

## 🎯 Success Metrics (After Integration)

After Brudi team integrates these into templates:

- [ ] Every new project copies layout.tsx in Phase 0
- [ ] Every new project uses Section, Container, Stack, Grid
- [ ] No new projects have hardcoded max-w-* on sections
- [ ] No new projects have ad-hoc px-* padding
- [ ] Agent quality gates pass the primitive checks
- [ ] Mobile 375px responsive on first build (thanks to primitives)

---

## 💬 Questions?

**"Which file should I read?"**
→ Start with LAYOUT_PRIMITIVES_README.md (10-minute overview)

**"How do I use Container?"**
→ See `skills/building-layout-primitives/SKILL.md` section "1. Container"

**"Where do I make the template changes?"**
→ Follow LAYOUT_PRIMITIVES_DIFF.md line-by-line

**"Is this breaking?"**
→ No. Primitives are additive, non-breaking.

**"When do agents read the skill?"**
→ Phase 0, after reading `starting-a-project` and before building pages.

**"Can I customize the components?"**
→ Not easily (intentional). Props are locked to design system values.
   If truly needed, projects can fork the component file.

**"Do I need primitives for Astro projects?"**
→ Not yet. These are React components. Astro version is future work.

---

## 📋 Next Steps

### For Project Lead
1. Review TASK_COMPLETION_REPORT.md (in parent directory)
2. Verify all files exist and have correct content
3. ✅ Mark task complete

### For Brudi Team
1. Follow steps in LAYOUT_PRIMITIVES_INTEGRATION.md
2. Apply changes from LAYOUT_PRIMITIVES_DIFF.md
3. Test with sample project
4. Announce with link to SKILL.md

### For First Agent User
1. Read `skills/building-layout-primitives/SKILL.md` (comprehensive)
2. Copy `templates/primitives/layout.tsx` to your project
3. Use 4 components (Container, Section, Stack, Grid) everywhere
4. Reference examples in SKILL.md as needed

---

**Created:** 2026-02-24
**Status:** ✅ Complete and ready for integration
**Repository:** `/sessions/optimistic-quirky-franklin/mnt/brudi/`
