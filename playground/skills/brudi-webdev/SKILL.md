---
name: brudi-webdev
description: Build award-level websites and complex web applications with deep understanding. Covers design, CSS, animation, React, TypeScript, testing, and performance. Anti-AI-slop — every pattern is battle-tested from real production projects.
version: 0.1.0
author: Brudi (AI) & Alex Luft
license: MIT
---

# Brudi WebDev — Award-Level Web Development

This skill enables you to build **distinctive, production-grade websites and web applications** that could win design awards. Every pattern comes from real projects, not theory.

## Philosophy

### Core Beliefs
1. **Tiefe > Breite** — Deep understanding beats shallow knowledge
2. **Weniger, aber besser** — Less, but better (Dieter Rams)
3. **Types sind Dokumentation** — TypeScript as self-documenting code
4. **Performance ist UX** — Performance is user experience
5. **Fail loud** — Errors should be obvious, not silent
6. **Make it work → Make it right → Make it fast** — In that order

### Anti-AI-Slop Principles
This skill explicitly avoids generic AI aesthetics:
- ❌ NO overused fonts (Inter, Roboto, Arial)
- ❌ NO cliché color schemes (purple gradients on white)
- ❌ NO predictable layouts and cookie-cutter patterns
- ❌ NO premature optimization
- ❌ NO "it works, I don't know why"

Instead:
- ✅ Bold, intentional design choices
- ✅ Distinctive typography that elevates
- ✅ Deep understanding of WHY things work
- ✅ Every decision has a reason

## Sub-Skills

This skill orchestrates specialized sub-skills:

| Skill | Use When |
|-------|----------|
| `webdev-design` | Creating visual design, choosing colors, typography, layout |
| `webdev-css` | Layouts with Grid/Flexbox, Container Queries, Custom Properties |
| `webdev-animation` | GSAP, Lenis, Scroll-driven animations, micro-interactions |
| `webdev-react` | Server Components, Hooks, State management, Composition |
| `webdev-typescript` | Utility Types, Type Guards, Discriminated Unions |
| `webdev-testing` | Vitest, Testing Library, User-centric testing |
| `webdev-performance` | Core Web Vitals, Lighthouse optimization |
| `webdev-a11y` | WCAG, ARIA, prefers-reduced-motion |

## Workflow

### Before Starting Any Project

1. **Understand the context** — What problem does this solve? Who uses it?
2. **Choose an aesthetic direction** — Commit to BOLD, not safe
3. **Define constraints** — Tech stack, performance targets, accessibility needs
4. **Plan the architecture** — Components, data flow, state

### During Development

1. **Make it work** — Get functionality right first
2. **Make it right** — Clean code, proper types, good patterns
3. **Make it fast** — Optimize only what matters

### Before Deployment

Run the pre-deploy checklist:
- [ ] Build succeeds with zero warnings
- [ ] TypeScript has zero errors
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility = 100
- [ ] All interactive elements are focusable
- [ ] prefers-reduced-motion is respected
- [ ] Works on mobile (320px minimum)
- [ ] No console errors
- [ ] Git committed and pushed

## Key Patterns

### CSS Grid (from real understanding)
```css
/* fr = Fraction of FREE space (after fixed sizes) */
grid-template-columns: 200px 1fr 2fr;
/* 200px fixed, then 1fr and 2fr share remaining space */

/* Lines are numbered from 1, items sit BETWEEN lines */
grid-column: 1 / 3; /* From line 1 to line 3 */

/* justify = horizontal, align = vertical. Always. */
place-items: center; /* Center everything */
```

### Container Queries (why they matter)
```css
/* Golden Rule: "You cannot change what you measure" */
/* That's why we need containment */
.card {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### GSAP ScrollTrigger (the right way)
```javascript
// scrub = bind animation to scrollbar
// true = instant, number = smooth delay
gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1 // 1 second smoothing
  }
});

// ONLY animate transform and opacity for GPU acceleration
```

### Lenis Smooth Scroll (understand LERP)
```javascript
// LERP = Linear Interpolation (the core concept)
// lerp: 0.1 = 10% toward target per frame → smooth
// lerp: 1 = instant (no smoothing)
const lenis = new Lenis({
  lerp: 0.1, // This is the key
  autoRaf: false // Must be false when using with GSAP
});

// Integration with GSAP
gsap.ticker.add((time) => lenis.raf(time * 1000));
lenis.on('scroll', ScrollTrigger.update);
```

### React Server Components (real understanding)
```jsx
// RSC ≠ SSR
// SSR: Makes HTML
// RSC: Makes serialized React tree (Wire Format)

// Why no hooks in Server Components?
// They are stateless/effectless BY DESIGN

// Composition Pattern (correct)
export default function Layout({ children }) {
  return (
    <ServerComponent>
      {children} {/* Client component passed as child */}
    </ServerComponent>
  );
}

// Props at Server→Client boundary must be serializable
```

### TypeScript Utility Types
```typescript
// Partial<T> — make all properties optional
function updateUser(id: string, updates: Partial<User>) {}

// Pick/Omit — type slicing
type CreateUserInput = Omit<User, 'id'>;

// Discriminated Unions — type-safe state
type State =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

// Utility Types have ZERO runtime cost
```

### Testing (user-centric)
```typescript
// Test like a USER, not like code
// Query Priority: getByRole > getByLabelText > getByText > getByTestId

// getBy = must exist
// findBy = waits async
// queryBy = can be missing

it('submits form correctly', async () => {
  render(<Form />);
  
  await userEvent.type(
    screen.getByLabelText('Email'),
    'test@example.com'
  );
  
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Animation Timing Hierarchy

| Type | Duration | Use Case |
|------|----------|----------|
| Micro | 100-200ms | Button states, toggles, small feedback |
| Standard | 200-400ms | Panel slides, modal transitions |
| Dramatic | 400-800ms | Page transitions, hero animations |

**Rules:**
- ease-out for entering (decelerating)
- ease-in for exiting (accelerating)
- Never animate layout properties (width, height, top, left)
- Always use transform and opacity

## Reduced Motion

```css
/* ALWAYS respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```javascript
// In JavaScript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable Lenis if reduced motion preferred
if (prefersReducedMotion) {
  lenis.destroy();
}
```

## Questions to Always Ask

Before writing code:
1. Do I REALLY understand this, or am I just copying?
2. Can I explain this to someone else?
3. What happens if I change X?
4. Is this the simplest solution?
5. Will future-me understand this in 6 months?

Before deploying:
1. Did I test on mobile?
2. Does Lighthouse approve?
3. Is the error handling sufficient?
4. Are the types correct?
5. Is it accessible?

---

**This skill is not about making websites. It's about making websites that matter.**

*Built with real understanding, not AI slop.*
