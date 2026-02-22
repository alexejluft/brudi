# GSAP React/Next.js Cleanup Pattern

**NEVER use useEffect for GSAP — ALWAYS useGSAP**

## useGSAP Hook with Context
```js
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function MyComponent() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.to(containerRef.current, { duration: 1, opacity: 1 });
  }, { scope: containerRef });

  return <div ref={containerRef} />;
}
```

## Context Revert Cleanup
```js
useGSAP(() => {
  const ctx = gsap.context(() => {
    gsap.to('.item', { duration: 0.5, x: 100 });
  }, containerRef);

  return () => {
    ctx.revert(); // Cleanup on unmount
  };
}, { scope: containerRef });
```

## ScrollTrigger Kill Pattern
```js
useGSAP(() => {
  const trigger = ScrollTrigger.create({
    trigger: '.element',
    onEnter: () => {}
  });

  return () => {
    trigger.kill(); // Essential cleanup
  };
});
```
