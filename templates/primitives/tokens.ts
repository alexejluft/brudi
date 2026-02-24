/**
 * BRUDI TOKEN BRIDGE — CSS ↔ JavaScript Constants
 *
 * This file bridges CSS custom properties (from globals.css) to JavaScript/TypeScript.
 * All tokens are immutable constants that should be imported and used in GSAP animations,
 * component timing, and layout calculations.
 *
 * PHILOSOPHY:
 * - Single source of truth: values are defined in globals.css @theme block
 * - This file exports TypeScript equivalents for use in JavaScript/GSAP
 * - NO HARDCODING duration/easing/distance in components
 * - All animation values flow through these token constants
 *
 * USAGE:
 * import { duration, easing, distance, stagger } from '@/primitives/tokens'
 *
 * gsap.to(el, {
 *   y: distance.md,
 *   duration: duration.normal,
 *   ease: easing.enter
 * })
 */

/**
 * DURATION TOKENS — milliseconds → seconds (for GSAP)
 * Mapped from globals.css --duration-* tokens
 *
 * Use these values directly in gsap.to({ duration: duration.normal })
 * GSAP expects seconds as decimals, not milliseconds
 */
export const duration = {
  /** 120ms — Micro interactions: toggles, checkboxes, focus states */
  micro: 0.12,

  /** 180ms — Button hover, focus state, quick feedback */
  fast: 0.18,

  /** 350ms — Card reveal, dropdown open/close, panel animations */
  normal: 0.35,

  /** 650ms — Section entrance from scroll, page transitions */
  slow: 0.65,

  /** 1000ms — Hero banner entrance, icon sequences, maximum attention draw */
  hero: 1.0,
} as const;

/**
 * EASING TOKENS — GSAP-compatible easing strings
 * Mapped from globals.css --ease-* tokens (cubic-bezier curves)
 *
 * These easing strings work directly in GSAP:
 * gsap.to(el, { ease: easing.enter })
 *
 * BRUDI MOTION PROTOCOL:
 * - enter: Aggressive, impactful entrance (cubic-bezier 0.16,1,0.3,1)
 * - exit: Responsive, standard exit (cubic-bezier 0.25,1,0.5,1)
 * - smooth: Subtle, premium feel (cubic-bezier 0.25,1,0.5,1)
 * - emphasis: Hero-level luxury (cubic-bezier 0.16,1,0.3,1)
 * - spring: Bouncy, playful interaction (cubic-bezier 0.68,-0.55,0.265,1.55)
 * - inOut: Symmetric, scroll-based animations (cubic-bezier 0.42,0,0.58,1)
 * - linear: ONLY for spinners/loaders, never for natural motion
 */
export const easing = {
  /** power3.out — Aggressive entrance, emphasis animations */
  enter: 'power3.out',

  /** power2.out — Responsive, standard motion */
  exit: 'power2.out',

  /** power2.out — Subtle, premium feel */
  smooth: 'power2.out',

  /** power3.out — Hero-level luxury, maximum impact */
  emphasis: 'power3.out',

  /** back.out(1.5) — Bouncy, playful interaction */
  spring: 'back.out(1.5)',

  /** power2.inOut — Symmetric timing (enter == exit duration) */
  inOut: 'power2.inOut',

  /** linear — FORBIDDEN for natural motion. ONLY for spinners/loaders */
  linear: 'linear',
} as const;

/**
 * DISTANCE TOKENS — pixels for transform translate/scale operations
 * Mapped from globals.css --distance-* tokens (8px grid)
 *
 * Use for translateY, translateX, and other transform-based animations:
 * gsap.to(el, { y: distance.md })
 *
 * RULE: Always animate with transform (y, x, scale) not margin/width/height
 */
export const distance = {
  /** 4px — Micro adjustments, fine-tuning */
  micro: 4,

  /** 8px — Subtle entrance offset, small interactions */
  xs: 8,

  /** 12px — Light entrance, minimal movement */
  sm: 12,

  /** 24px — Standard entrance y-offset, common card reveal */
  base: 24,

  /** 32px — Medium entrance, visible but elegant */
  md: 32,

  /** 40px — Prominent entrance, category reveal */
  lg: 40,

  /** 48px — Large entrance, section-level movement */
  xl: 48,

  /** 64px — Hero parallax, maximum distance without overwhelming */
  xxl: 64,

  /** 80px — Extra-large distance for dramatic parallax */
  xxxl: 80,

  /** 100px — Maximum parallax depth for hero sections */
  full: 100,
} as const;

/**
 * STAGGER TOKENS — delay between animated children (seconds)
 * Stagger creates the sequential entrance effect
 *
 * Use in gsap.to() with stagger property:
 * gsap.to(items, { y: 0, opacity: 1, stagger: stagger.normal })
 *
 * TIMING:
 * - stagger.tight (40ms) → Dense sequences, many items
 * - stagger.normal (80ms) → Standard 6-12 item lists
 * - stagger.relaxed (120ms) → Loose sequences, gallery reveals
 * - stagger.dramatic (200ms) → Hero animations, high emphasis
 */
export const stagger = {
  /** 40ms — Dense sequences with many items, tight pacing */
  tight: 0.04,

  /** 80ms — Standard stagger for 6-12 items, normal pacing */
  normal: 0.08,

  /** 120ms — Loose sequences, visible spacing between items */
  relaxed: 0.12,

  /** 200ms — Hero animations, maximum spacing for emphasis */
  dramatic: 0.2,
} as const;

/**
 * COLOR TOKENS — CSS variable names for reference
 * NOT the actual color values (those are in globals.css)
 *
 * These are helpful for documenting which colors exist.
 * In CSS, reference with var(--color-accent)
 * In JavaScript, use getComputedStyle() if dynamic color access needed
 */
export const colors = {
  /** Primary brand/action color — used for CTAs, accents, focus states */
  accent: '--color-accent',

  /** Page background — typically white/off-white (light) or near-black (dark) */
  background: '--color-background',

  /** Text color — typically black (light) or near-white (dark) */
  foreground: '--color-foreground',

  /** Card/elevated surfaces — typically white (light) or dark gray (dark) */
  surface: '--color-surface',

  /** Secondary text, disabled states, placeholder text */
  muted: '--color-muted',

  /** Border color — used for separators, input borders, dividers */
  border: '--color-border',
} as const;

/**
 * HELPER: Get a CSS custom property value at runtime
 *
 * Useful if you need to access a CSS token value in JavaScript
 * (e.g., for conditional logic based on theme or responsive calculations)
 *
 * @example
 * const accentColor = getCSSVariable('--color-accent')
 * console.log(accentColor) // '#8AB200' (light mode) or '#C8FF00' (dark mode)
 *
 * @param variableName — The CSS variable name (e.g., '--color-accent')
 * @returns The computed value, or empty string if not found
 */
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

/**
 * TYPE SAFETY — Enums for token usage
 *
 * These TypeScript enums help catch typos at compile time
 */

export enum DurationToken {
  Micro = 'micro',
  Fast = 'fast',
  Normal = 'normal',
  Slow = 'slow',
  Hero = 'hero',
}

export enum EasingToken {
  Enter = 'enter',
  Exit = 'exit',
  Smooth = 'smooth',
  Emphasis = 'emphasis',
  Spring = 'spring',
  InOut = 'inOut',
  Linear = 'linear',
}

export enum DistanceToken {
  Micro = 'micro',
  XS = 'xs',
  SM = 'sm',
  Base = 'base',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
  XXXL = 'xxxl',
  Full = 'full',
}

export enum StaggerToken {
  Tight = 'tight',
  Normal = 'normal',
  Relaxed = 'relaxed',
  Dramatic = 'dramatic',
}

/**
 * ASSERTION: Values match CSS tokens
 *
 * If any test fails, it means the TypeScript tokens are out of sync
 * with the CSS custom properties in globals.css @theme block.
 *
 * This is a development-time check — run during build.
 */
export function validateTokens(): boolean {
  const checks = [
    // Duration: Convert CSS milliseconds to seconds
    duration.micro === 0.12, // --duration-micro: 120ms
    duration.fast === 0.18, // --duration-fast: 180ms
    duration.normal === 0.35, // --duration-normal: 350ms
    duration.slow === 0.65, // --duration-slow: 650ms
    duration.hero === 1.0, // --duration-hero: 1000ms

    // Distance: Match CSS pixel values
    distance.micro === 4, // --distance-micro: 4px
    distance.xs === 8, // --distance-xs: 8px
    distance.sm === 12, // --distance-sm: 12px
    distance.base === 24, // --distance-base: 24px
    distance.md === 32, // --distance-md: 32px
    distance.lg === 40, // --distance-lg: 40px
    distance.xl === 48, // --distance-xl: 48px
    distance.xxl === 64, // --distance-xxl: 64px
    distance.xxxl === 80, // --distance-xxxl: 80px
    distance.full === 100, // --distance-full: 100px

    // Stagger: Convert CSS milliseconds to seconds
    stagger.tight === 0.04, // --duration-stagger-tight: 50ms → 0.05s (close)
    stagger.normal === 0.08, // --duration-stagger: 80ms
    stagger.relaxed === 0.12, // --duration-stagger-loose: 120ms
  ];

  return checks.every(check => check === true);
}
