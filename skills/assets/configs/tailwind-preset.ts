// BRUDI TAILWIND PRESET
// Foundations for award-level sites — agent builds unique designs on top
// Usage: Import into tailwind.config.ts via presets: [brudiPreset]

import type { Config } from 'tailwindcss'

const brudiPreset: Config = {
  content: [],
  theme: {
    extend: {
      // SCREENS: Award-site breakpoints (more granular than default)
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px',
      },

      // FONT SIZE: Fluid typography scale with clamp()
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 1rem + 1vw, 2rem)',
        'fluid-xl': 'clamp(1.5rem, 1rem + 2vw, 3rem)',
        'fluid-2xl': 'clamp(2rem, 1rem + 3vw, 4.5rem)',
        'fluid-3xl': 'clamp(2.5rem, 1rem + 4vw, 6rem)',
        'fluid-display': 'clamp(3rem, 1rem + 5vw, 8rem)',
      },

      // ANIMATION: Timing functions for GSAP classes
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-out-quint': 'cubic-bezier(0.83, 0, 0.17, 1)',
      },

      // Z-INDEX: Semantic scale for layering
      zIndex: {
        'behind': '-1',
        'base': '0',
        'above': '10',
        'nav': '100',
        'overlay': '200',
        'modal': '300',
        'toast': '400',
        'max': '9999',
      },

      // BORDER RADIUS: Consistent scale
      borderRadius: {
        'xs': '0.125rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    }
  },
  plugins: []
}

export default brudiPreset
