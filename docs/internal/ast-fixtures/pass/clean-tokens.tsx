// PASS: Clean token usage
// Expected violations: 0
// Demonstrates best practices:
// - All defined tokens are used
// - No hardcoded color or motion values
// - Proper token imports and references

import { duration, easing } from '@/primitives/tokens'
import { colors, spacing } from '@/primitives/design-tokens'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function CleanTokens() {
  const boxRef = useRef(null)

  useEffect(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        opacity: 1,
        y: 0,
        duration: duration.normal,
        ease: easing.enter
      })
    }
  }, [])

  return (
    <div style={{ padding: spacing.lg }}>
      <div
        ref={boxRef}
        style={{
          backgroundColor: colors.primary,
          color: colors.text,
          padding: spacing.md,
          borderRadius: '8px',
          opacity: 0,
          y: 20
        }}
      >
        <h2>Token-Based Component</h2>
        <p>All colors and spacing use design tokens</p>
      </div>
    </div>
  )
}
