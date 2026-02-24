/**
 * USE-STAGGER-ENTRANCE — Entrance animation for lists/grids
 *
 * Applies a staggered entrance animation to child elements on component mount.
 * Used for: hero headlines, feature lists, portfolio grids, etc.
 *
 * KEY DIFFERENCE from useScrollReveal:
 * - ScrollReveal: Triggers on scroll
 * - StaggerEntrance: Fires immediately on mount (or page load)
 *
 * PHILOSOPHY:
 * - Token-driven timing and easing
 * - Built-in stagger with flexible delay
 * - SSR-safe: checks for window before running GSAP
 * - Returns a GSAP timeline for manual control if needed
 *
 * USAGE:
 * const listRef = useRef<HTMLDivElement>(null)
 * useStaggerEntrance(listRef, {
 *   itemSelector: 'li',
 *   duration: 'normal',
 *   stagger: 'normal',
 * })
 *
 * @example
 * function HeroHeadline() {
 *   const linesRef = useRef<HTMLDivElement>(null)
 *
 *   useStaggerEntrance(linesRef, {
 *     itemSelector: '.headline-line',
 *     duration: 'hero',
 *     stagger: 'dramatic',
 *     ease: 'enter',
 *   })
 *
 *   return (
 *     <div ref={linesRef}>
 *       <div className="headline-line">Line 1</div>
 *       <div className="headline-line">Line 2</div>
 *     </div>
 *   )
 * }
 */

'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { duration, distance, easing, stagger, DistanceToken, DurationToken, EasingToken, StaggerToken } from './tokens';

export interface StaggerEntranceOptions {
  /** CSS selector for child elements to animate */
  itemSelector: string;

  /** Animation duration (token key) — default: 'normal' */
  duration?: keyof typeof duration;

  /** Easing function (token key) — default: 'exit' */
  ease?: keyof typeof easing;

  /** Distance to offset before animation (token key) — default: 'md' */
  distance?: keyof typeof distance;

  /** Delay between staggered items (token key) — default: 'normal' */
  stagger?: keyof typeof stagger;

  /** Delay before animation starts (seconds) — default: 0 */
  delay?: number;

  /** Animation type: fade in from below, or scale from center */
  variant?: 'slideUp' | 'fadeScale' | 'fadeOnly';

  /** Custom GSAP properties to merge (rotation, scale, etc.) */
  additionalProps?: gsap.TweenVars;

  /** Disable animation (useful for conditional rendering) */
  disabled?: boolean;
}

/**
 * Hook: useStaggerEntrance
 * Staggered entrance animation on component mount
 *
 * Returns the GSAP timeline in case you need manual control (scrub, reverse, etc.)
 */
export function useStaggerEntrance(
  ref: React.RefObject<HTMLElement>,
  options: StaggerEntranceOptions
): gsap.core.Timeline | null {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const {
    itemSelector,
    duration: durationKey = 'normal',
    ease: easeKey = 'exit',
    distance: distanceKey = 'md',
    stagger: staggerKey = 'normal',
    delay = 0,
    variant = 'slideUp',
    additionalProps = {},
    disabled = false,
  } = options;

  // Resolve token values
  const durationValue = duration[durationKey];
  const easingValue = easing[easeKey];
  const distanceValue = distance[distanceKey];
  const staggerValue = stagger[staggerKey];

  useEffect(() => {
    if (disabled) return;

    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(itemSelector);
    if (items.length === 0) return;

    // Kill previous timeline if it exists
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create a new timeline
    const tl = gsap.timeline({ delay });

    // Set initial state based on variant
    switch (variant) {
      case 'slideUp':
        gsap.set(items, { opacity: 0, y: distanceValue });
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: durationValue,
          ease: easingValue,
          stagger: staggerValue,
          ...additionalProps,
        });
        break;

      case 'fadeScale':
        gsap.set(items, { opacity: 0, scale: 0.9, y: distanceValue });
        tl.to(items, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: durationValue,
          ease: easingValue,
          stagger: staggerValue,
          ...additionalProps,
        });
        break;

      case 'fadeOnly':
        gsap.set(items, { opacity: 0 });
        tl.to(items, {
          opacity: 1,
          duration: durationValue,
          ease: easingValue,
          stagger: staggerValue,
          ...additionalProps,
        });
        break;
    }

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [itemSelector, durationValue, easingValue, distanceValue, staggerValue, delay, variant, additionalProps, disabled]);

  return timelineRef.current;
}

/**
 * Hook: useCharacterReveal
 * Character-by-character stagger for headlines/titles
 *
 * Splits text into characters and staggers reveal for dramatic effect.
 * REQUIRES: The text element to be a direct child of the ref.
 *
 * USAGE:
 * const headlineRef = useRef<HTMLHeadingElement>(null)
 * useCharacterReveal(headlineRef, { duration: 'hero', stagger: 'tight' })
 *
 * <h1 ref={headlineRef}>Award-Winning Design</h1>
 *
 * HOW IT WORKS:
 * 1. Wraps each character in a <span data-char>
 * 2. Animates with stagger
 * 3. Duration is spread across all characters (not per-character)
 */

export interface CharacterRevealOptions {
  /** Total animation duration (token key) — default: 'hero' */
  duration?: keyof typeof duration;

  /** Easing function (token key) — default: 'enter' */
  ease?: keyof typeof easing;

  /** Stagger between characters (token key) — default: 'tight' */
  stagger?: keyof typeof stagger;

  /** Delay before animation starts (seconds) — default: 0 */
  delay?: number;

  /** Whether to re-render when text changes — default: true */
  observeChildren?: boolean;
}

export function useCharacterReveal(
  ref: React.RefObject<HTMLElement>,
  options: CharacterRevealOptions = {}
): void {
  const {
    duration: durationKey = 'hero',
    ease: easeKey = 'enter',
    stagger: staggerKey = 'tight',
    delay = 0,
    observeChildren = true,
  } = options;

  // Resolve token values
  const durationValue = duration[durationKey];
  const easingValue = easing[easeKey];
  const staggerValue = stagger[staggerKey];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Get the text content
    const text = el.textContent || '';
    if (!text) return;

    // Create a copy of the element to work with
    const originalHTML = el.innerHTML;

    // Clear and rebuild with character spans
    el.innerHTML = '';
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.setAttribute('data-char', '');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    });

    // Animate characters
    gsap.set(chars, { opacity: 0, y: distance.xs });

    const tl = gsap.timeline({ delay });
    tl.to(chars, {
      opacity: 1,
      y: 0,
      duration: durationValue,
      ease: easingValue,
      stagger: staggerValue,
    });

    return () => {
      tl.kill();
    };
  }, [durationValue, easingValue, staggerValue, delay, observeChildren]);
}

/**
 * Hook: useListReveal
 * Simpler alias for common use case: revealing a list of items
 *
 * USAGE:
 * useListReveal(ref, { duration: 'slow', stagger: 'normal' })
 */

export interface ListRevealOptions {
  /** Animation duration — default: 'normal' */
  duration?: keyof typeof duration;

  /** Easing function — default: 'exit' */
  ease?: keyof typeof easing;

  /** Stagger delay — default: 'normal' */
  stagger?: keyof typeof stagger;
}

export function useListReveal(
  ref: React.RefObject<HTMLElement>,
  options: ListRevealOptions = {}
): void {
  useStaggerEntrance(ref, {
    ...options,
    itemSelector: ':scope > *', // Direct children only
    variant: 'slideUp',
  });
}

/**
 * Helper: splitTextIntoLines
 * Utility to split heading text into multiple lines with proper markup
 *
 * USAGE (in JSX):
 * <h1 className="text-5xl">
 *   {splitTextIntoLines("Your Long Heading", ["Your", "Long", "Heading"])}
 * </h1>
 *
 * Then reference with .headline-line selector
 */

export function splitTextIntoLines(text: string, lines: string[]): JSX.Element {
  return (
    <>
      {lines.map((line, idx) => (
        <div key={idx} className="headline-line">
          {line}
        </div>
      ))}
    </>
  );
}
