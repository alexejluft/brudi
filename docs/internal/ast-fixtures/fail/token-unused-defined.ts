// FAIL: Exports tokens that are never imported elsewhere
// Expected violations: unused_color, unused_spacing, unused_duration are exported but never used

export const colors = {
  primary: '#0066ff',
  secondary: '#00cc88',
  unused_color: '#ff0000',
  warning: '#ffaa00',
  danger: '#ff3333',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  unused_spacing: '32px',
  lg: '64px',
} as const

export const duration = {
  fast: 0.15,
  normal: 0.3,
  unused_duration: 1.5,
  slow: 0.6,
} as const

// Only these are used elsewhere
export { colors as COLORS, spacing as SPACING }
