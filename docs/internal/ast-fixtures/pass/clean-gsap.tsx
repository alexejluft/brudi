// PASS: Clean GSAP animations
// Expected violations: 0
// Demonstrates best practices:
// - Only animating transform properties (no layout animations)
// - Using token-based durations
// - Proper cleanup in useEffect
// - No gsap.from() (uses gsap.to() instead)

import gsap from 'gsap'
import { duration, easing } from '@/primitives/tokens'
import { useEffect, useRef } from 'react'

export default function CleanGSAP() {
  const containerRef = useRef(null)
  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate only transform properties (safe for performance)
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: duration.normal,
        ease: easing.enter
      })

      // Stagger animation using transform (safe)
      gsap.to(itemsRef.current, {
        y: 0,
        opacity: 1,
        duration: duration.fast,
        stagger: 0.1,
        ease: easing.enter
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <h2>Animated Container</h2>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) itemsRef.current[i - 1] = el
          }}
          style={{
            transform: 'translateY(20px)',
            opacity: 0,
            marginBottom: '1rem'
          }}
        >
          Item {i}
        </div>
      ))}
    </div>
  )
}
