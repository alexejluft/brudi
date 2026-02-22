---
name: building-with-threejs
description: Use when building 3D scenes with raw Three.js and WebGL. Covers scene setup, PBR materials, lighting, model loading, and performance optimization.
---

# Building with Three.js

## The Rule

**Scene + Camera + Renderer + rAF loop. MeshStandardMaterial for PBR. 3-point lighting. Always dispose on cleanup. Always handle resize.**

---

## Scene Setup + Animation Loop

```tsx
// ✅ Correct: Complete setup with pixel ratio
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

// ❌ WRONG: setInterval instead of rAF, no pixel ratio
// setInterval(() => renderer.render(scene, camera), 16)
```

---

## Geometry + PBR Materials

```tsx
// ✅ Correct: MeshStandardMaterial for physically-based rendering
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0xff4444, roughness: 0.4, metalness: 0.6
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// ❌ WRONG: MeshBasicMaterial ignores lights entirely
// new THREE.MeshBasicMaterial({ color: 0xff0000 })
```

---

## 3-Point Lighting

```tsx
// ✅ Correct: Ambient (fill) + Directional (key) + Point (accent)
const ambient = new THREE.AmbientLight(0xffffff, 0.4)
const key = new THREE.DirectionalLight(0xffffff, 0.8)
key.position.set(5, 10, 5)
key.castShadow = true
const accent = new THREE.PointLight(0xff6600, 0.6, 100)
accent.position.set(-5, 3, 5)
scene.add(ambient, key, accent)

// ❌ WRONG: Single light, no positioning, no shadows
```

---

## Controls + Resize

```tsx
// ✅ OrbitControls with damping
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// ✅ MANDATORY: Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
// ❌ WRONG: No resize → blurry/stretched on mobile
```

---

## Models + Cleanup

```tsx
// ✅ GLTFLoader with compressed .glb
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
new GLTFLoader().load('/models/scene.glb', (gltf) => scene.add(gltf.scene))

// ✅ MANDATORY: Dispose everything on unmount
function cleanup() {
  geometry.dispose(); material.dispose(); renderer.dispose()
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(animationId)
}
// ❌ WRONG: No dispose → GPU memory leak after scene changes
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No `.dispose()` on cleanup | Dispose geometry, materials, textures, renderer |
| Oversized textures (4K+) | Use KTX2/Basis compression, max 2K |
| Missing resize handler | Listen + update camera aspect + renderer size |
| Blocking main thread | Heavy computation → Web Worker |
| Too many draw calls | Merge geometries, use InstancedMesh, LOD |
| `setInterval` for render | Always `requestAnimationFrame` |
