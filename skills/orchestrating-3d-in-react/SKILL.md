---
name: orchestrating-3d-in-react
description: Use when integrating Three.js 3D scenes into React/Next.js via React Three Fiber. Covers Canvas setup, useFrame, drei helpers, and scroll-driven 3D.
---

# Orchestrating 3D in React

## The Rule

**Dynamic import Canvas with `ssr: false`. Suspense around models. useFrame with `delta`. drei for common patterns.**

---

## R3F in Next.js App Router

```tsx
// ✅ Correct: Dynamic import prevents SSR hydration errors
'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Canvas = dynamic(() => import('@react-three/fiber').then(m => m.Canvas), { ssr: false })
const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function Page() {
  return (
    <Suspense fallback={<div>Loading 3D...</div>}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
    </Suspense>
  )
}

// ❌ WRONG: Canvas without dynamic import → hydration mismatch
// ❌ WRONG: Canvas in Server Component → DOM API unavailable
```

---

## useFrame: Animation Loop

```tsx
// ✅ Correct: Always multiply by delta for frame-rate independence
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function RotatingBox() {
  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.5
    mesh.current.rotation.y += delta * 0.3
  })
  return <mesh ref={mesh}><boxGeometry /><meshStandardMaterial color="hotpink" /></mesh>
}

// ❌ WRONG: Ignoring delta → animation speed depends on frame rate
// useFrame(() => { mesh.current.rotation.x += 0.01 })
```

---

## drei Helpers + Model Loading

```tsx
// ✅ Correct: drei simplifies common patterns
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}
export function Scene() {
  return (<>
    <OrbitControls enableDamping />
    <Environment preset="sunset" />
    <ambientLight intensity={0.4} />
    <Suspense fallback={<Html center>Loading...</Html>}><Model /></Suspense>
  </>)
}

// ❌ WRONG: useGLTF without Suspense → uncaught promise
```

---

## Scroll-Driven 3D + Performance

```tsx
// ✅ GSAP ScrollTrigger drives 3D via ref
const progress = useRef(0)
useEffect(() => {
  const t = ScrollTrigger.create({
    trigger: '#scene', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => { progress.current = self.progress }
  })
  return () => t.kill()
}, [])
useFrame(() => { mesh.current.rotation.y = progress.current * Math.PI * 2 })

// ✅ InstancedMesh for 100+ identical objects + preload models
<instancedMesh args={[geometry, material, 1000]} />
useGLTF.preload('/model.glb')
// ❌ WRONG: Heavy computation in useFrame, individual meshes for instances
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Canvas without `ssr: false` | `dynamic(() => ..., { ssr: false })` |
| No Suspense around models | Wrap `<Suspense fallback={...}>` |
| useFrame ignores `delta` | Always multiply by `delta` |
| Heavy computation in useFrame | Move to `useEffect`, memoize |
| Individual meshes for instances | Use `<instancedMesh>` for 100+ objects |
| No model preloading | `useGLTF.preload()` at module level |
