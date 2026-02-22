---
name: designing-award-navigation
description: Use when implementing mobile navigation, scroll indicators, and hero section patterns. Covers hamburger menu patterns with GSAP, scroll indicators, and related UI rules.
---

# Designing Award Layouts — Navigation & Hero Patterns

## 1. Scroll Indicator — Required on Hero Sections

**Every full-screen hero (min-h-screen) must have a scroll indicator.** Without it, the user doesn't know there is more content below.

The indicator is a UI signal — it must be subtle, not decorative noise.

```astro
<!-- Scroll indicator — bottom right of hero, or bottom center -->
<div class="absolute bottom-8 right-6 md:right-12 flex flex-col items-center gap-2">
  <span class="label-caps text-text-subtle text-[10px] rotate-90 origin-center translate-x-3">
    Scroll
  </span>
  <div class="w-px h-12 bg-gradient-to-b from-text-subtle to-transparent"></div>
</div>
```

**Or animated dot variant:**
```astro
<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
  <div class="w-[1px] h-16 overflow-hidden">
    <div
      class="w-full h-1/2 bg-accent"
      style="animation: scroll-line 1.5s ease-in-out infinite;"
    ></div>
  </div>
</div>

<style>
  @keyframes scroll-line {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(200%); }
  }
</style>
```

**Rules:**
- Position: `absolute`, never in document flow (doesn't affect layout)
- Fade it out with GSAP when user scrolls past 100px
- For users with `prefers-reduced-motion`, disable animation but keep the indicator visible. See `~/Brudi/assets/patterns/reduced-motion.md`

---

## 2. Mobile Navigation — Close Button Required

**Every mobile menu that opens must have a visible way to close.** Hamburger opens → X closes. No exceptions.

The most common failure: hamburger opens overlay, no close button, user is trapped.

```astro
<!-- Nav.astro — complete mobile menu pattern -->
<nav>
  <div class="flex items-center justify-between px-6 py-6 md:hidden">
    <a href="/" class="font-display font-bold text-lg">Studio</a>

    <!-- Hamburger — visible when menu closed -->
    <button
      id="menu-open"
      aria-label="Open navigation"
      aria-expanded="false"
      aria-controls="mobile-menu"
      class="flex flex-col gap-1.5 p-2"
    >
      <span class="w-6 h-px bg-text block transition-all duration-200"></span>
      <span class="w-6 h-px bg-text block transition-all duration-200"></span>
      <span class="w-4 h-px bg-text block transition-all duration-200"></span>
    </button>
  </div>

  <!-- Mobile overlay menu -->
  <div
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation"
    class="fixed inset-0 bg-bg z-[200] flex flex-col px-6 py-6
           translate-x-full transition-transform duration-300 ease-out md:hidden"
  >
    <!-- Close button — always visible, top right -->
    <div class="flex items-center justify-between mb-16">
      <a href="/" class="font-display font-bold text-lg">Studio</a>
      <button
        id="menu-close"
        aria-label="Close navigation"
        class="p-2 text-text-muted hover:text-text transition-colors"
      >
        <!-- X icon -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Nav links -->
    <nav class="flex flex-col gap-6">
      <a href="/"       class="text-3xl font-display font-bold">Home</a>
      <a href="/work"   class="text-3xl font-display font-bold">Work</a>
      <a href="/about"  class="text-3xl font-display font-bold">About</a>
      <a href="/contact" class="text-3xl font-display font-bold">Contact</a>
    </nav>
  </div>
</nav>

<script>
  const menuOpen  = document.getElementById('menu-open')!
  const menuClose = document.getElementById('menu-close')!
  const mobileMenu = document.getElementById('mobile-menu')!

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full')
    menuOpen.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'   // prevent scroll behind overlay
    menuClose.focus()                           // move focus into dialog
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full')
    menuOpen.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
    menuOpen.focus()                            // return focus to trigger
  }

  menuOpen.addEventListener('click', openMenu)
  menuClose.addEventListener('click', closeMenu)

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      closeMenu()
    }
  })

  // Close when navigating to a new page
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu)
  })
</script>
```

**Required behaviors:**
- X/close button always visible inside the open menu
- `Escape` key closes the menu
- Focus moves into dialog on open, returns to hamburger on close
- `overflow: hidden` on body while menu is open
- Links inside menu close it on click

---

## Pre-Build Checklist for Navigation

Before shipping, verify:

```
□ Hero: Scroll indicator present (min-h-screen heroes always)
□ Mobile menu: X/close button visible, Escape key works, focus managed
```

---

See also: `designing-award-layouts-core`, `designing-award-motion`
