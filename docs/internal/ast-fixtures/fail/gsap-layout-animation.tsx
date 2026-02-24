// FAIL: NO_LAYOUT_ANIMATION - GSAP animating layout properties (width, height, margin, padding)
// Expected violations: Animating width, height, margin properties causes layout shift

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function GSAPLayoutAnimation() {
  const boxRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Violation: Animating width causes layout shift
    gsap.to(boxRef.current, {
      width: 300,
      height: 200,
      duration: 0.5
    })

    // Violation: Animating margin triggers reflow
    gsap.to(containerRef.current, {
      marginLeft: 50,
      paddingRight: 30,
      duration: 0.8
    })
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div ref={boxRef} style={{ width: '100px', height: '100px', backgroundColor: 'blue' }}>
        Animated box
      </div>
    </div>
  )
}
