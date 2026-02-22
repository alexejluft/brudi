---
name: building-transitions-astro
description: Use when implementing native Astro View Transitions. Covers setup, CSS customization, persisting elements, linking elements between pages, lifecycle events, and the zero-JavaScript option.
---

# Building Transitions — Astro View Transitions (Native)

**Browser support (2025):** Chrome 111+, Edge 111+, Safari 18+, Firefox 144+ — ~85%+. Astro provides automatic fallback for the rest.

## Implementation

```astro
---
// src/layouts/Layout.astro
import { ViewTransitions } from 'astro:transitions'
---
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <ViewTransitions />   <!-- ← This is all you need -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Default behavior:** Astro morphs between pages with a cross-fade. Works instantly.

## Customize the Transition

```css
/* In global.css — override the default animation */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out forwards;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

## Persist Elements Across Pages (Nav, Music Player)

```astro
<!-- Navigation stays, doesn't re-animate -->
<nav transition:persist>
  <a href="/">Home</a>
  <a href="/work">Work</a>
</nav>
```

## Link Specific Elements Between Pages (Shared Hero Image)

```astro
<!-- On /work page -->
<img src={project.image} transition:name={`project-${project.id}`} />

<!-- On /work/[slug] page — morphs between the two -->
<img src={project.image} transition:name={`project-${project.id}`} />
```

## Lifecycle Events

```ts
// astro:page-load = replaces DOMContentLoaded for View Transitions
document.addEventListener('astro:page-load', () => {
  initAnimations()   // Called on every page load including transitions
})

// astro:before-swap = fires before DOM is replaced
document.addEventListener('astro:before-swap', () => {
  destroyAnimations()   // Cleanup GSAP, ScrollTrigger, Lenis
})

// astro:after-swap = fires after DOM is replaced
document.addEventListener('astro:after-swap', () => {
  reinitAnimations()    // Reinit if needed
})
```

## Zero-JavaScript Option (Modern Browsers Only)

```css
/* In global.css — no ViewTransitions component needed */
@view-transition {
  navigation: auto;
}
```

Works in Chrome 126+, Edge 126+. No JavaScript required. Add as progressive enhancement.
