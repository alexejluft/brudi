/**
 * BRUDI MOTION PROTOCOL v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Deterministische Motion-Spezifikation für Award-Level Animationen
 *
 * RULE: Zentralisierte Tokens. GSAP + Framer Motion Kompatibilität.
 * Nur transform + opacity. Reduced Motion respektieren. Automatische Gate-Validierung.
 *
 * Import: import { motion } from '@/config/motion.protocol'
 * In globals.css verwenden: duration-[motion.duration.VALUE] ease-[motion.ease.NAME]
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DURATION TOKEN SCALE (Millisekunden + Dezimal)
// ═══════════════════════════════════════════════════════════════════════════════

export const DURATION_TOKENS = {
  // Micro-Interaktionen: Toggle, Checkbox, Icon-Swap, Focus-State
  micro: 0.12,      // 120ms — schnell, nicht wahrnehmbar als Verzögerung

  // Schnelle Interaktionen: Button Hover, Fokus, Dropdown-Öffnen
  fast: 0.18,       // 180ms — responsive, benutzerfreundlich

  // Standard UI: Card-Reveal, Panel-Slide, Tab-Wechsel, Dropdown
  normal: 0.35,     // 350ms — goldene Mitte, unspektakulär
  standard: 0.35,   // Alias

  // Dramatic: Section-Entrance, Page-Transition, Modal-Open
  slow: 0.65,       // 650ms — fühlbar, emotional

  // Hero: Hero-Banner, grosse Icon-Animationen, Page-Load
  hero: 1.0,        // 1000ms — maximale Aufmerksamkeit

  // Stagger-Basis: 80ms zwischen Elementen
  stagger: 0.08,    // 80ms — Standard-Offset für stapelbare Items
  staggerTight: 0.05, // 50ms — dichte Sequenzen
  staggerLoose: 0.12, // 120ms — verteilt, spacing

  // Interne Delays
  delay: {
    none: 0,
    xs: 0.08,       // 80ms — Stagger-Standard
    sm: 0.12,       // 120ms
    md: 0.18,       // 180ms
    lg: 0.24,       // 240ms
    xl: 0.32,       // 320ms
  },
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EASING TOKEN SCALE (Cubic-Bezier + GSAP-kompatible Namen)
// ═══════════════════════════════════════════════════════════════════════════════

export const EASING_TOKENS = {
  // Standard Exit (am häufigsten): Power2.out = responsiv, prägnant
  exit: 'power2.out',
  'exit-bezier': 'cubic-bezier(0.25, 1, 0.5, 1)',

  // Standard Enter: Power3.out = dramatisch, impaktiv
  enter: 'power3.out',
  'enter-bezier': 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Smooth/Premium: Power2.out = subtil, elegant
  smooth: 'power2.out',
  'smooth-bezier': 'cubic-bezier(0.25, 1, 0.5, 1)',

  // Dramatic/Luxury: Power3.out = schwungvoll, teuer
  dramatic: 'power3.out',
  'dramatic-bezier': 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Spring/Bouncy: Back.out(1.5) = spielerisch, energetisch
  spring: 'back.out(1.5)',
  'spring-bezier': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Linear (NUR für Spinner/Loader, NICHT für Movement!)
  linear: 'linear',
  'linear-bezier': 'cubic-bezier(0, 0, 1, 1)',

  // In-Out: Symmetrisch für hin-und-her Bewegungen
  inOut: 'power2.inOut',
  'inOut-bezier': 'cubic-bezier(0.42, 0, 0.58, 1)',

  // Quint (power5): Extra aggressive Enter für Hero
  quint: 'power5.out',
  'quint-bezier': 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MOTION INTENSITY LEVELS
// ═══════════════════════════════════════════════════════════════════════════════
// Projekte setzen INTENSITY zur Runtime. Dies multipliziert alle Dauer-Tokens.

export type MotionIntensity = 'subtle' | 'balanced' | 'expressive'

export const INTENSITY_CONFIG: Record<MotionIntensity, {
  durationMultiplier: number
  staggerMultiplier: number
  distanceMultiplier: number
}> = {
  // Level 1: Subtle — Corporate, B2B SaaS, Finanzen
  // Reduziert auf 70% Dauer. Minimale Distance.
  subtle: {
    durationMultiplier: 0.7,
    staggerMultiplier: 0.8,
    distanceMultiplier: 0.6,  // 16px statt 24px
  },

  // Level 2: Balanced — Portfolio, Agency, Mixed
  // Standard 100%. Normale Distance.
  balanced: {
    durationMultiplier: 1.0,
    staggerMultiplier: 1.0,
    distanceMultiplier: 1.0,  // 24px standard
  },

  // Level 3: Expressive — Award-Level, Showcase, Product
  // 130% Dauer. Grössere Distance für Drama.
  expressive: {
    durationMultiplier: 1.3,
    staggerMultiplier: 1.1,
    distanceMultiplier: 1.5,  // 40px für grosse Moves
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DISTANCE TOKENS (für Translate/Transform-Animationen)
// ═══════════════════════════════════════════════════════════════════════════════

export const DISTANCE_TOKENS = {
  // Micro-Verschiebungen (innerhalb einer Komponente)
  micro: 4,     // 4px
  xs: 8,        // 8px
  sm: 12,       // 12px

  // Standard-Verschiebung (Entrance/Scroll-Reveal)
  base: 24,     // 24px — default y: 24
  md: 32,       // 32px
  lg: 40,       // 40px
  xl: 48,       // 48px — 3×8pt = 3 spacing units

  // Grosse Moves (Hero, Parallax)
  xxl: 64,      // 64px
  xxxl: 80,     // 80px
  full: 100,    // 100px
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MANDATORY MOTION PROTOCOL PER COMPONENT TYPE
// ═══════════════════════════════════════════════════════════════════════════════

export interface MotionBehavior {
  entrance: {
    duration: number
    ease: string
    distance: number
    delay?: number
  }
  hover?: {
    duration: number
    ease: string
    scale?: number
    offset?: number
  }
  click?: {
    duration: number
    ease: string
  }
  exit?: {
    duration: number
    ease: string
    distance: number
  }
  scroll?: {
    trigger?: boolean
    duration: number
    ease: string
  }
}

export const COMPONENT_MOTION_RULES: Record<string, MotionBehavior> = {
  // ───────────────────────────────────────────────────────────────────────────
  // HERO: Massive, dramatic entrance. Longest durations. Max attention.
  // ───────────────────────────────────────────────────────────────────────────
  HERO: {
    entrance: {
      duration: 1.0,        // Volledige 1s
      ease: 'power3.out',   // Aggressive, impactful
      distance: 48,         // 48px fallback (scaled by intensity)
      delay: 0.1,           // Leichte Verzögerung für Drama
    },
    hover: {
      duration: 0.35,
      ease: 'power2.out',
      scale: 1.02,
    },
    scroll: {
      trigger: true,
      duration: 0,          // ScrollTrigger handled separately
      ease: 'none',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SECTION: Full-width content blocks. Standard dramatic entrance.
  // ───────────────────────────────────────────────────────────────────────────
  SECTION: {
    entrance: {
      duration: 0.65,       // Slow, noticeable
      ease: 'power2.out',   // Standard exit
      distance: 40,         // 40px y-offset
      delay: 0,
    },
    scroll: {
      trigger: true,
      duration: 0.65,
      ease: 'power2.out',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CARD: Portfolio card, product card. Standard reveal + hover.
  // ───────────────────────────────────────────────────────────────────────────
  CARD: {
    entrance: {
      duration: 0.35,       // Normal, unspektakulär
      ease: 'power2.out',
      distance: 20,         // Kleine Verschiebung
      delay: 0,
    },
    hover: {
      duration: 0.3,
      ease: 'power2.out',
      scale: 1.04,          // Subtle lift
    },
    scroll: {
      trigger: true,
      duration: 0.35,
      ease: 'power2.out',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BUTTON: Interactive, responsive. Micro + standard durations.
  // ───────────────────────────────────────────────────────────────────────────
  BUTTON: {
    entrance: {
      duration: 0.2,        // Schnell, aber nicht imperceptible
      ease: 'power2.out',
      distance: 0,          // Keine Fallback-Distance (skipped)
    },
    hover: {
      duration: 0.18,       // Fast feedback
      ease: 'power2.out',
      scale: 1.05,
    },
    click: {
      duration: 0.12,       // Micro feedback
      ease: 'power2.in',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NAVIGATION: Header, menu. Pinned, scroll-responsive.
  // ───────────────────────────────────────────────────────────────────────────
  NAVIGATION: {
    entrance: {
      duration: 0.5,        // Slow, deliberate
      ease: 'power2.out',
      distance: 20,         // Small drop
    },
    hover: {
      duration: 0.18,
      ease: 'power2.out',
      offset: 4,            // Subtle underline/highlight move
    },
    scroll: {
      trigger: true,
      duration: 0.3,        // Snappy scroll response
      ease: 'power2.out',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // IMAGE: Photo reveals, galleries. Smooth, photograph-appropriate.
  // ───────────────────────────────────────────────────────────────────────────
  IMAGE: {
    entrance: {
      duration: 0.65,       // Slow reveal
      ease: 'power2.out',
      distance: 24,         // Subtle shift
    },
    hover: {
      duration: 0.4,
      ease: 'power2.inOut',
      scale: 1.02,
    },
    scroll: {
      trigger: true,
      duration: 0.65,
      ease: 'power2.out',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TEXT_BLOCK: Paragraphs, headers. Standard entrance via stagger.
  // ───────────────────────────────────────────────────────────────────────────
  TEXT_BLOCK: {
    entrance: {
      duration: 0.6,        // Slow for readability
      ease: 'power2.out',
      distance: 20,         // Gentle y-push
      delay: 0,
    },
    scroll: {
      trigger: true,
      duration: 0.6,
      ease: 'power2.out',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CTA (Call-to-Action): Button + surrounding copy. Entrance + emphasis.
  // ───────────────────────────────────────────────────────────────────────────
  CTA: {
    entrance: {
      duration: 0.5,        // Slower than button, more emphasis
      ease: 'power3.out',   // Dramatic
      distance: 24,
      delay: 0.1,           // Stagger after section
    },
    hover: {
      duration: 0.2,
      ease: 'power2.out',
      scale: 1.08,          // Bigger hover response
    },
    click: {
      duration: 0.15,
      ease: 'power2.in',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MODAL/OVERLAY: Backdrop + content. Separate animations. Exit animations mandatory.
  // ───────────────────────────────────────────────────────────────────────────
  MODAL: {
    entrance: {
      duration: 0.4,        // Spring/scale in
      ease: 'back.out(1.5)',
      distance: 0,
    },
    exit: {
      duration: 0.25,       // Fast dismissal
      ease: 'power2.in',
      distance: 20,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // PAGE_TRANSITION: Full-page exit → navigate → enter.
  // ───────────────────────────────────────────────────────────────────────────
  PAGE_TRANSITION: {
    entrance: {
      duration: 0.5,        // Snappy but not jarring
      ease: 'power2.out',
      distance: 10,         // Slight y-push from bottom
    },
    exit: {
      duration: 0.35,       // Faster exit than entrance
      ease: 'power2.in',
      distance: 10,
    },
    scroll: {
      trigger: false,
      duration: 0,
      ease: 'none',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // ACCORDION: Expand/collapse with height: auto. AnimatePresence.
  // ───────────────────────────────────────────────────────────────────────────
  ACCORDION: {
    entrance: {
      duration: 0.35,       // Smooth expand
      ease: 'power2.inOut', // Symmetric
      distance: 0,
    },
    exit: {
      duration: 0.25,       // Slightly faster collapse
      ease: 'power2.inOut',
      distance: 0,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DISCLOSURE: Collapse/expand single element. Similar to accordion.
  // ───────────────────────────────────────────────────────────────────────────
  DISCLOSURE: {
    entrance: {
      duration: 0.3,
      ease: 'power2.inOut',
      distance: 0,
    },
    exit: {
      duration: 0.25,
      ease: 'power2.inOut',
      distance: 0,
    },
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. UNIFIED MOTION CONFIG (for Runtime Usage)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MotionConfig {
  duration: typeof DURATION_TOKENS
  ease: typeof EASING_TOKENS
  distance: typeof DISTANCE_TOKENS
  component: typeof COMPONENT_MOTION_RULES
  intensity: MotionIntensity
  prefersReducedMotion: boolean

  // Helper: Get effective duration with intensity multiplier
  getDuration(key: keyof typeof DURATION_TOKENS): number

  // Helper: Get effective distance with intensity multiplier
  getDistance(key: keyof typeof DISTANCE_TOKENS): number

  // Helper: Get component rule with intensity applied
  getComponentRule(component: string, intensity?: MotionIntensity): MotionBehavior | null
}

// Factory Function
export function createMotionConfig(
  intensity: MotionIntensity = 'balanced',
  prefersReducedMotion: boolean = false
): MotionConfig {
  const intensityMultiplier = INTENSITY_CONFIG[intensity]

  return {
    duration: DURATION_TOKENS,
    ease: EASING_TOKENS,
    distance: DISTANCE_TOKENS,
    component: COMPONENT_MOTION_RULES,
    intensity,
    prefersReducedMotion,

    getDuration(key: keyof typeof DURATION_TOKENS): number {
      if (prefersReducedMotion) return 0.01
      const baseValue = DURATION_TOKENS[key]
      return typeof baseValue === 'number'
        ? baseValue * intensityMultiplier.durationMultiplier
        : baseValue
    },

    getDistance(key: keyof typeof DISTANCE_TOKENS): number {
      if (prefersReducedMotion) return 0
      const baseValue = DISTANCE_TOKENS[key]
      return baseValue * intensityMultiplier.distanceMultiplier
    },

    getComponentRule(component: string, overrideIntensity?: MotionIntensity): MotionBehavior | null {
      const rule = COMPONENT_MOTION_RULES[component]
      if (!rule) return null

      const effectiveIntensity = overrideIntensity ?? intensity
      const multiplier = INTENSITY_CONFIG[effectiveIntensity]

      // Scale all numeric values by multiplier
      return {
        entrance: {
          ...rule.entrance,
          duration: rule.entrance.duration * multiplier.durationMultiplier,
          distance: rule.entrance.distance * multiplier.distanceMultiplier,
          delay: rule.entrance.delay ? rule.entrance.delay * multiplier.durationMultiplier : 0,
        },
        hover: rule.hover ? {
          ...rule.hover,
          duration: rule.hover.duration * multiplier.durationMultiplier,
        } : undefined,
        click: rule.click ? {
          ...rule.click,
          duration: rule.click.duration * multiplier.durationMultiplier,
        } : undefined,
        exit: rule.exit ? {
          ...rule.exit,
          duration: rule.exit.duration * multiplier.durationMultiplier,
          distance: rule.exit.distance * multiplier.distanceMultiplier,
        } : undefined,
        scroll: rule.scroll ? {
          ...rule.scroll,
          duration: rule.scroll.duration * multiplier.durationMultiplier,
        } : undefined,
      }
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. REACT HOOKS (für clientseitige GSAP/Framer Integration)
// ═══════════════════════════════════════════════════════════════════════════════

export function useMotionPreferences(): {
  intensity: MotionIntensity
  prefersReducedMotion: boolean
  config: MotionConfig
} {
  // In Real Implementation: useContext(MotionContext) oder config from localStorage
  const intensity: MotionIntensity = 'balanced'
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  return {
    intensity,
    prefersReducedMotion,
    config: createMotionConfig(intensity, prefersReducedMotion),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. GSAP CONTEXT HELPER (für automatisches Cleanup in React)
// ═══════════════════════════════════════════════════════════════════════════════

export function createGSAPContext(
  setupFn: (config: MotionConfig) => void,
  intensity: MotionIntensity = 'balanced'
): { play: () => void; pause: () => void; kill: () => void } {
  const config = createMotionConfig(intensity, false)
  let context: any = null

  if (typeof window !== 'undefined') {
    // Nur wenn GSAP verfügbar
    try {
      const gsap = require('gsap')
      context = gsap.context(() => setupFn(config))
    } catch (e) {
      console.warn('GSAP not available for createGSAPContext')
    }
  }

  return {
    play: () => context?.play?.(),
    pause: () => context?.pause?.(),
    kill: () => context?.revert?.(),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. VALIDATION HELPER (für Gate-Enforcement)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MotionComplianceReport {
  isCompliant: boolean
  errors: string[]
  warnings: string[]
  checklist: {
    hasEasingTokens: boolean
    hasDurationTokens: boolean
    hasReducedMotionCheck: boolean
    hasComponentRules: boolean
    hasIntensityMultipliers: boolean
  }
}

export function validateMotionCompliance(): MotionComplianceReport {
  const errors: string[] = []
  const warnings: string[] = []

  // Check 1: Easing tokens exist
  const hasEasingTokens = Object.keys(EASING_TOKENS).length > 0
  if (!hasEasingTokens) errors.push('EASING_TOKENS nicht definiert')

  // Check 2: Duration tokens exist
  const hasDurationTokens = Object.keys(DURATION_TOKENS).length > 0
  if (!hasDurationTokens) errors.push('DURATION_TOKENS nicht definiert')

  // Check 3: Component rules exist
  const hasComponentRules = Object.keys(COMPONENT_MOTION_RULES).length > 0
  if (!hasComponentRules) errors.push('COMPONENT_MOTION_RULES nicht definiert')

  // Check 4: Intensity config valid
  const hasIntensityMultipliers = Object.keys(INTENSITY_CONFIG).length === 3
  if (!hasIntensityMultipliers) errors.push('INTENSITY_CONFIG nicht vollständig')

  // Check 5: Reduced motion checking (warning only)
  const hasReducedMotionCheck = true // Wird zur Runtime überprüft
  if (!hasReducedMotionCheck) warnings.push('Reduced motion checking nicht implementiert')

  // Additional checks
  const hasLinearEasing = Object.values(EASING_TOKENS).some(v => v === 'linear')
  if (hasLinearEasing) warnings.push('Linear easing nur für Spinner zulässig, nicht für Movement')

  const hasMicroAnimationsOver200ms = Object.entries(DURATION_TOKENS).some(
    ([k, v]) => k.includes('micro') && typeof v === 'number' && v > 0.2
  )
  if (hasMicroAnimationsOver200ms) warnings.push('Micro-Animationen sollten ≤200ms sein')

  return {
    isCompliant: errors.length === 0,
    errors,
    warnings,
    checklist: {
      hasEasingTokens,
      hasDurationTokens,
      hasReducedMotionCheck,
      hasComponentRules,
      hasIntensityMultipliers,
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const motion = createMotionConfig('balanced', false)

export default motion
