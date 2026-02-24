// PASS: Proper useEffect cleanup
// Expected violations: 0
// Demonstrates best practices:
// - Event listeners properly removed
// - Timers properly cleared
// - Subscriptions properly unsubscribed

import { useEffect, useRef, useState } from 'react'

export default function CleanEffectCleanup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = () => {
      setCount((prev) => prev + 1)
    }

    container.addEventListener('click', handleClick)

    // PROPER CLEANUP
    return () => {
      container.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick')
    }, 1000)

    // PROPER CLEANUP
    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchData() {
      try {
        await fetch('/api/data', { signal: abortController.signal })
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()

    // PROPER CLEANUP
    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div ref={containerRef}>
      <p>Clicked {count} times</p>
    </div>
  )
}
