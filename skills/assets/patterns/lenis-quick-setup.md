# Lenis Smooth Scroll Minimal Setup

## Basic Setup
```js
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';

const lenis = new Lenis({
  autoRaf: false,
  duration: 1.2,
});

// Manual RAF integration
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

## GSAP Ticker Integration
```js
lenis.on('scroll', (e) => {
  // Scroll callback
});
```

## ScrollTrigger Proxy (if needed)
```js
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.scrollerProxy(window, {
  scrollTop(value) {
    return arguments.length
      ? lenis.scrollTo(value)
      : lenis.animatedScroll;
  }
});

lenis.on('scroll', () => ScrollTrigger.update());
```

## Cleanup
```js
lenis.destroy();
