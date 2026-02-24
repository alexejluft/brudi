/**
 * USE-SCROLL-REVEAL — Reusable GSAP scroll trigger animation hook
 *
 * Eliminates ScrollTrigger boilerplate. Every scroll-triggered entrance
 * follows the same pattern: fade-in + translateY with consistent timing.
 *
 * PHILOSOPHY:
 * - One hook, infinite reuse
 * - Token-driven: no hardcoded duration/easing/distance
 * - Cleanup built-in: ScrollTrigger.getAll() properly killed
 * - StrictMode safe: uses gsap.set() + gsap.to() pattern
 *
 * USAGE:
 * const ref = useRef<HTMLDivElement>(null)
 * useScrollReveal(ref, { distance: 'md', duration: 'normal' })
 *
 * @example
 * function FeatureCard() {
 *   const cardRef = useRef<HTMLDivElement>(null)
 *   useScrollReveal(cardRef, { distance: 'lg', duration: 'slow' })
 *
 *   return <div ref={cardRef}>Card content...</div>
 * }
 */

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { duration, distance, easing, DistanceToken, DurationToken, EasingToken } from './tokens';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealOptions {
  /** Distance to translate (in token keys) — default: 'md' (32px) */
  distance?: keyof typeof distance;

  /** Animation duration (in token keys) — default: 'normal' (0.35s) */
  duration?: keyof typeof duration;

  /** Easing function (in token keys) — default: 'exit' (power2.out) */
  ease?: keyof typeof easing;

  /** Scroll trigger start position — default: 'top 85%' */
  triggerStart?: string;

  /** Whether animation fires only once — default: true */
  once?: boolean;

  /** Additional GSAP properties to merge — e.g., { rotation: 5 } */
  additionalProps?: gsap.TweenVars;

  /** Custom ScrollTrigger config (merges with defaults) */
  scrollTriggerConfig?: Partial<ScrollTrigger.Vars>;
}

/**
 * Hook: useScrollReveal
 * Attaches a scroll-triggered fade + translateY animation to a ref
 */
export function useScrollReveal(
  ref: React.RefObject<HTMLElement>,
  options: ScrollRevealOptions = {}
): void {
  const {
    distance: distanceKey = 'md',
    duration: durationKey = 'normal',
    ease: easeKey = 'exit',
    triggerStart = 'top 85%',
    once = true,
    additionalProps = {},
    scrollTriggerConfig = {},
  } = options;

  // Resolve token values
  const distanceValue = distance[distanceKey];
  const durationValue = duration[durationKey];
  const easingValue = easing[easeKey];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ✅ Set initial state: fully transparent, offset down
    gsap.set(el, { opacity: 0, y: distanceValue });

    // ✅ Animate to final state with ScrollTrigger
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: durationValue,
      ease: easingValue,
      ...additionalProps,
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        once,
        ...scrollTriggerConfig,
      },
    });

    // ✅ Cleanup: kill tween and associated ScrollTrigger
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [distanceValue, durationValue, easingValue, triggerStart, once, additionalProps, scrollTriggerConfig]);
}

/**
 * Hook: useStaggerReveal
 * Reveals a list of children with staggered entrance animation
 *
 * USAGE:
 * const parentRef = useRef<HTMLDivElement>(null)
 * useStaggerReveal(parentRef, { itemSelector: '.feature-card' })
 *
 * <div ref={parentRef}>
 *   <div className="feature-card">Item 1</div>
 *   <div className="feature-card">Item 2</div>
 * </div>
 */

export interface StaggerRevealOptions extends Omit<ScrollRevealOptions, 'additionalProps'> {
  /** CSS selector for children to animate */
  itemSelector: string;

  /** Stagger delay between items (in token keys) — default: 'normal' (0.08s) */
  staggerDelay?: keyof typeof distance; // Misnamed but reusable for numeric delays

  /** Custom stagger value in seconds (overrides staggerDelay token) */
  customStaggerSeconds?: number;

  /** Additional GSAP properties for children */
  additionalProps?: gsap.TweenVars;
}

export function useStaggerReveal(
  ref: React.RefObject<HTMLElement>,
  options: StaggerRevealOptions
): void {
  const {
    distance: distanceKey = 'md',
    duration: durationKey = 'normal',
    ease: easeKey = 'exit',
    triggerStart = 'top 85%',
    once = true,
    itemSelector,
    customStaggerSeconds = 0.08,
    additionalProps = {},
    scrollTriggerConfig = {},
  } = options;

  // Resolve token values
  const distanceValue = distance[distanceKey];
  const durationValue = duration[durationKey];
  const easingValue = easing[easeKey];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(itemSelector);
    if (items.length === 0) return;

    // ✅ Set initial state for all items
    gsap.set(items, { opacity: 0, y: distanceValue });

    // ✅ Animate all items with stagger
    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: durationValue,
      ease: easingValue,
      stagger: customStaggerSeconds,
      ...additionalProps,
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        once,
        ...scrollTriggerConfig,
      },
    });

    // ✅ Cleanup
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [distanceValue, durationValue, easingValue, triggerStart, once, itemSelector, customStaggerSeconds, additionalProps, scrollTriggerConfig]);
}

/**
 * Hook: useParallax
 * Subtle parallax background movement on scroll
 *
 * USAGE:
 * const bgRef = useRef<HTMLDivElement>(null)
 * useParallax(bgRef, { speed: 0.3 })
 *
 * Speed values:
 * - 0.3: Subtle (recommended)
 * - 0.5: Moderate
 * - 1.0: Aggressive (rarely needed)
 */

export interface ParallaxOptions {
  /** Parallax speed multiplier (0.1–1.0, default: 0.3) */
  speed?: number;

  /** Direction: 'y' or 'x' — default: 'y' */
  direction?: 'x' | 'y';

  /** Maximum distance to move (pixels) — default: auto-calculated */
  maxDistance?: number;
}

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  options: ParallaxOptions = {}
): void {
  const { speed = 0.3, direction = 'y', maxDistance } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Create a simple scroll-linked animation
    const tween = gsap.to(el, {
      [direction]: maxDistance ? maxDistance * speed : 100 * speed,
      ease: easing.smooth,
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5, // Smooth follow (not snappy)
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [speed, direction, maxDistance]);
}
