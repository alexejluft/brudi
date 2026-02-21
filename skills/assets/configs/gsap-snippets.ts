// =============================================================
// BRUDI GSAP SNIPPET LIBRARY
// Techniques for award-level animations — adapt per project
// =============================================================
// Usage: Agent copies relevant snippets into project, adapts selectors/timing/easing
// These are TECHNIQUES — the visual result should be different every time
// Install: npm install gsap @gsap/react (for React projects)

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// SHARED UTILITY
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// =============================================================
// 1. REVEAL ON SCROLL
// Technique: Fade + translate elements as they enter viewport
// Agent adapts: target selector, direction (up/down/left), distance, stagger timing
// =============================================================
export function revealOnScroll(selector: string, direction: 'up' | 'down' | 'left' | 'right' = 'up', distance = 40, staggerDelay = 0.1) {
  if (prefersReducedMotion) {
    gsap.set(selector, { opacity: 1, y: 0, x: 0 })
    return
  }

  const startValues = { opacity: 0 }
  if (direction === 'up') startValues['y'] = distance
  if (direction === 'down') startValues['y'] = -distance
  if (direction === 'left') startValues['x'] = distance
  if (direction === 'right') startValues['x'] = -distance

  gsap.set(selector, startValues)

  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      markers: false,
    },
    opacity: 1,
    y: 0,
    x: 0,
    duration: 0.8,
    stagger: staggerDelay,
    ease: 'power2.out',
  })
}

// =============================================================
// 2. TEXT SPLIT REVEAL
// Technique: Split text into chars/words, animate individually
// Agent adapts: split type (char/word/line), direction, stagger, easing
// Note: Uses manual split for accessibility; SplitText plugin optional
// =============================================================
export function textSplitReveal(selector: string, splitType: 'char' | 'word' = 'word', staggerDelay = 0.05) {
  if (prefersReducedMotion) {
    gsap.set(`${selector} span`, { opacity: 1, y: 0 })
    return
  }

  const elements = document.querySelectorAll(selector)
  elements.forEach((el) => {
    const text = el.textContent || ''
    const splits = splitType === 'char' ? text.split('') : text.split(' ')
    el.innerHTML = splits.map((s) => `<span style="display:inline-block;opacity:0;transform:translateY(20px);">${s}${splitType === 'word' ? '&nbsp;' : ''}</span>`).join('')
  })

  gsap.to(`${selector} span`, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 75%',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: staggerDelay,
    ease: 'back.out',
  })
}

// =============================================================
// 3. PARALLAX LAYERS
// Technique: Different scroll speeds for depth effect
// Agent adapts: speed ratios for each layer, direction
// =============================================================
export function parallaxLayers(layers: { selector: string; speed: number }[]) {
  if (prefersReducedMotion) return

  layers.forEach(({ selector, speed }) => {
    gsap.to(selector, {
      scrollTrigger: {
        trigger: selector,
        scrub: 1,
      },
      y: (index, target) => {
        return gsap.getProperty(target, 'offsetHeight') * speed
      },
      ease: 'none',
    })
  })
}

// =============================================================
// 4. MAGNETIC CURSOR EFFECT
// Technique: Elements subtly follow cursor within radius
// Agent adapts: radius threshold, magnetic strength
// =============================================================
export function magneticCursor(selector: string, radius = 150, strength = 0.3) {
  const elements = document.querySelectorAll(selector)

  elements.forEach((el) => {
    let rect = el.getBoundingClientRect()

    document.addEventListener('mousemove', (e) => {
      rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)

      if (distance < radius) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          overwrite: 'auto',
        })
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.3, overwrite: 'auto' })
      }
    })
  })
}

// =============================================================
// 5. STAGGER GRID
// Technique: Grid items animate from origin point with 2D stagger
// Agent adapts: grid dimensions, origin point (center/corners), timing
// =============================================================
export function staggerGrid(selector: string, columns = 3, origin: 'center' | 'topleft' | 'topright' = 'center') {
  if (prefersReducedMotion) {
    gsap.set(selector, { opacity: 1, scale: 1 })
    return
  }

  const items = document.querySelectorAll(selector)
  gsap.set(items, { opacity: 0, scale: 0.8 })

  items.forEach((item, i) => {
    const row = Math.floor(i / columns)
    const col = i % columns
    let staggerValue = 0

    if (origin === 'center') staggerValue = Math.sqrt(row * row + col * col) * 0.1
    if (origin === 'topleft') staggerValue = (row + col) * 0.08
    if (origin === 'topright') staggerValue = (row + (columns - col)) * 0.08

    gsap.to(item, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay: staggerValue,
      ease: 'back.out',
    })
  })
}

// =============================================================
// 6. PAGE TRANSITION
// Technique: Exit current view, enter new view with animated overlay
// Agent adapts: overlay color, direction (left/right/top/bottom), duration
// =============================================================
export function pageTransition(exitColor = '#000', direction: 'left' | 'right' | 'top' | 'bottom' = 'left', duration = 0.6) {
  if (prefersReducedMotion) {
    window.location.href = (event?.target as HTMLAnchorElement)?.href || ''
    return
  }

  const overlay = document.createElement('div')
  overlay.style.cssText = `position:fixed;inset:0;background:${exitColor};z-index:9999;pointer-events:none;`
  document.body.appendChild(overlay)

  const clipOrigin = direction === 'left' ? '100% 0' : direction === 'right' ? '0 0' : direction === 'top' ? '0 100%' : '0 0'
  const clipStart = direction === 'left' || direction === 'right' ? '0% 0 / 0% 100%' : '0 0 / 100% 0%'
  const clipEnd = direction === 'left' || direction === 'right' ? '0% 0 / 100% 100%' : '0 0 / 100% 100%'

  gsap.from(overlay, { clipPath: clipStart, duration, ease: 'power2.inOut' })
}

// =============================================================
// 7. HORIZONTAL SCROLL SECTION
// Technique: Horizontal scrolling within vertical page flow
// Agent adapts: section width multiplier, snap behavior
// =============================================================
export function horizontalScroll(containerSelector: string, widthMultiplier = 3) {
  if (prefersReducedMotion) return

  const container = document.querySelector(containerSelector) as HTMLElement
  if (!container) return

  gsap.to(container, {
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${container.offsetWidth * (widthMultiplier - 1)}`,
      scrub: 1,
      pin: true,
      snap: 0.2,
      markers: false,
    },
    x: -container.offsetWidth * (widthMultiplier - 1),
    ease: 'none',
  })
}

// =============================================================
// 8. PINNED HEADER MORPH
// Technique: Header shrinks and morphs on scroll
// Agent adapts: initial/scroll heights, logo scale, background changes
// =============================================================
export function pinnedHeaderMorph(headerSelector: string, logoSelector: string, initialHeight = 120, scrollHeight = 60) {
  if (prefersReducedMotion) return

  const header = document.querySelector(headerSelector) as HTMLElement
  if (!header) return

  gsap.to(header, {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      scrub: 0.5,
    },
    height: scrollHeight,
    duration: 0,
    ease: 'none',
  })

  gsap.to(logoSelector, {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      scrub: 0.5,
    },
    scale: scrollHeight / initialHeight,
    duration: 0,
    ease: 'none',
  })
}

// =============================================================
// 9. VARIABLE FONT ANIMATION
// Technique: Animate CSS font-variation-settings on scroll/hover
// Agent adapts: weight range (e.g., 400–900), target elements
// =============================================================
export function variableFontAnim(selector: string, weightStart = 400, weightEnd = 900, trigger: 'scroll' | 'hover' = 'scroll') {
  const elements = document.querySelectorAll(selector)

  if (trigger === 'scroll') {
    if (prefersReducedMotion) return

    elements.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
        '--font-weight': weightEnd,
        duration: 0,
        ease: 'none',
        onUpdate: function () {
          const weight = this.progress() * (weightEnd - weightStart) + weightStart;
          (el as HTMLElement).style.fontVariationSettings = `"wght" ${weight}`
        },
      })
    })
  }

  if (trigger === 'hover') {
    elements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) gsap.to(el, { fontVariationSettings: `"wght" ${weightEnd}`, duration: 0.3 })
      })
      el.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) gsap.to(el, { fontVariationSettings: `"wght" ${weightStart}`, duration: 0.3 })
      })
    })
  }
}

// =============================================================
// 10. SMOOTH COUNTER / NUMBER ANIMATION
// Technique: Count from start to end value with snap to integers
// Agent adapts: start/end values, duration, number format
// =============================================================
export function smoothCounter(selector: string, startValue = 0, endValue = 100, duration = 2, formatFn?: (val: number) => string) {
  if (prefersReducedMotion) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = formatFn ? formatFn(endValue) : endValue.toString()
    })
    return
  }

  const counter = { value: startValue }

  gsap.to(counter, {
    value: endValue,
    duration,
    snap: { value: 1 },
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      once: true,
    },
    onUpdate: function () {
      const displayValue = formatFn ? formatFn(Math.round(counter.value)) : Math.round(counter.value).toString()
      document.querySelectorAll(selector).forEach((el) => {
        el.textContent = displayValue
      })
    },
    ease: 'power1.inOut',
  })
}
