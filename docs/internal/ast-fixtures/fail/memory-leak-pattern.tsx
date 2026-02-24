// FAIL: Memory leak pattern - event listener not cleaned up
// Expected violations: MEMORY_LEAK - event listeners not removed

import { useEffect, useRef } from 'react'

export default function MemoryLeakComponent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = () => {
      console.log('Clicked')
    }

    // Event listener added but never removed - MEMORY LEAK
    container.addEventListener('click', handleClick)
    // Missing: container.removeEventListener('click', handleClick)

  }, []) // Empty dependency array means cleanup never runs

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick')
    }, 1000)

    // Timer started but never cleared - MEMORY LEAK
    // Missing: return () => clearInterval(timer)
  }, [])

  return <div ref={containerRef}>Component with memory leaks</div>
}
