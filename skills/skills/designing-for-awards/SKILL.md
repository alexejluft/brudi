---
name: designing-for-awards
description: Use when making visual design decisions, choosing layouts, or when design feels generic. Prevents AI-slop and creates distinctive, award-worthy aesthetics through whitespace, hierarchy, and art direction.
---

# Designing for Awards

## The Rule

**One memorable element per view. Defend every pixel. Whitespace is structure, not emptiness. Break the grid with intention. If it looks like a template, start over.**

---

## Anti-AI-Slop Checklist

```tsx
// ✅ Distinctive: Intentional constraints create identity
<section className="grid grid-cols-12 gap-0">
  <h1 className="col-span-8 col-start-3 text-[clamp(2.5rem,8vw,7rem)]
    font-bold leading-[0.9] tracking-[-0.04em]">
    Design<br/>is the<br/>silence
  </h1>
  <p className="col-span-3 col-start-9 self-end text-sm text-muted">
    Between elements.
  </p>
</section>

// ❌ WRONG: Generic centered hero — looks like every SaaS template
// <section className="flex flex-col items-center text-center py-20">
//   <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
//   <p className="text-lg text-gray-500 mt-4">The best solution for...</p>
// </section>
```

---

## Whitespace as Structure

```tsx
// ✅ Correct: Generous spacing creates visual breathing room
<article className="py-32 px-8 md:px-16 lg:px-24">
  <h2 className="text-5xl mb-16">Our Work</h2>  {/* mb-16 = intentional gap */}
  <div className="grid grid-cols-2 gap-16">      {/* gap-16 = room to breathe */}
    {projects.map(p => <ProjectCard key={p.id} {...p} />)}
  </div>
</article>

// ❌ WRONG: Cramped — everything touching, no hierarchy
// <article className="py-8 px-4">
//   <h2 className="text-2xl mb-4">Our Work</h2>
//   <div className="grid grid-cols-3 gap-4">{...}</div>
// </article>
```

---

## Visual Weight & Hierarchy

```tsx
// ✅ Correct: Size contrast creates clear reading order
<div className="grid grid-cols-12">
  <div className="col-span-7">
    <span className="text-xs uppercase tracking-[0.2em] text-muted">Case Study</span>
    <h2 className="text-6xl font-bold mt-2 leading-[1.0]">Reimagining<br/>Luxury</h2>
  </div>
  <div className="col-span-4 col-start-9 flex items-end">
    <p className="text-base leading-relaxed text-muted">
      A complete brand evolution for a heritage fashion house.
    </p>
  </div>
</div>

// ❌ WRONG: Everything same size, no contrast, no tension
// <h2 className="text-2xl font-semibold">Case Study: Reimagining Luxury</h2>
// <p className="text-base mt-2">A complete brand evolution...</p>
```

---

## Intentional Grid Breaking

```tsx
// ✅ Correct: One element breaks the grid — creates focal point
<section className="relative grid grid-cols-12 min-h-screen">
  <div className="col-span-5 col-start-2 self-center z-10">
    <h2 className="text-7xl font-bold">Break<br/>the mold</h2>
  </div>
  <div className="col-span-8 col-start-5 -mt-20">
    <Image src={hero} alt="" className="w-full h-[80vh] object-cover" />
  </div>
</section>

// ❌ WRONG: Image and text in neat equal columns — safe, forgettable
// <section className="grid grid-cols-2 gap-8 items-center">
//   <div><h2>...</h2></div><div><Image /></div>
// </section>
```

---

## Art Direction Rules

```css
/* ✅ Different crops per breakpoint — not just scaling */
.hero-image { aspect-ratio: 16/9; object-position: 70% center; }
@media (max-width: 768px) { .hero-image { aspect-ratio: 3/4; object-position: center top; } }
/* ❌ WRONG: Same crop everywhere — loses impact on mobile */
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Centered hero, generic copy | Asymmetric layout, intentional tension |
| Equal columns everywhere | Vary spans (7/5, 8/4, full-bleed) |
| Tight spacing, no breathing room | `py-32`, `gap-16` — generous whitespace |
| Same text sizes, no contrast | 6:1 ratio between heading and body |
| Purple-to-blue gradients | One bold accent, rest neutral |
