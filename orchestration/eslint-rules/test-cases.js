/**
 * Test Cases for Brudi Creative DNA ESLint Rules
 *
 * These test cases demonstrate what should and shouldn't be flagged.
 * You can run ESLint on this file to verify rule behavior.
 *
 * Usage:
 *   npx eslint orchestration/eslint-rules/test-cases.js
 *
 * Expected output:
 * - ~12 violations in "SHOULD FAIL" sections
 * - 0 violations in "SHOULD PASS" sections
 */

// ============================================================================
// RULE 1: no-transition-all
// ============================================================================

// ❌ SHOULD FAIL - Tailwind transition-all
function rule1BadTailwind() {
  return <button className="transition-all hover:scale-110">Click</button>;
}

// ❌ SHOULD FAIL - Inline style with transition: all
function rule1BadInlineStyle() {
  return <div style={{ transition: 'all 200ms ease-out' }}>Content</div>;
}

// ❌ SHOULD FAIL - CSS-in-JS object with transition: all
const rule1BadObject = {
  transition: 'all 300ms',
  backgroundColor: '#fff',
};

// ✅ SHOULD PASS - Specific transition property
function rule1GoodSpecific() {
  return <button className="transition-transform duration-200">Click</button>;
}

// ✅ SHOULD PASS - Multiple specific transitions
const rule1GoodMultiple = {
  transition: 'transform 200ms, box-shadow 150ms, background-color 100ms',
};

// ✅ SHOULD PASS - Tailwind specific class
function rule1GoodTailwindClass() {
  return <div className="transition-opacity duration-300">Fade</div>;
}

// ============================================================================
// RULE 2: no-gsap-from-in-react
// ============================================================================

import gsap from 'gsap';
import { useEffect } from 'react';

// ❌ SHOULD FAIL - Direct gsap.from() call
function rule2BadGsapFrom() {
  useEffect(() => {
    gsap.from('.hero', { opacity: 0, duration: 0.8 });
  }, []);
  return <div className="hero">Hero</div>;
}

// ❌ SHOULD FAIL - Timeline.from() call
function rule2BadTimelineFrom() {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from('.card', { y: 20, opacity: 0 });
  }, []);
  return <div className="card">Card</div>;
}

// ❌ SHOULD FAIL - Sequence.from() call
function rule2BadSequenceFrom() {
  useEffect(() => {
    const sequence = gsap.timeline();
    sequence.from('.item', { x: -50 });
  }, []);
  return <div className="item">Item</div>;
}

// ✅ SHOULD PASS - gsap.set() + gsap.to() pattern
function rule2GoodSetTo() {
  useEffect(() => {
    gsap.set('.hero', { opacity: 0 });
    gsap.to('.hero', { opacity: 1, duration: 0.8 });
  }, []);
  return <div className="hero">Hero</div>;
}

// ✅ SHOULD PASS - gsap.fromTo() pattern
function rule2GoodFromTo() {
  useEffect(() => {
    gsap.fromTo(
      '.hero',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);
  return <div className="hero">Hero</div>;
}

// ✅ SHOULD PASS - Context with set/to
function rule2GoodContext() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.item', { opacity: 0 });
      gsap.to('.item', { opacity: 1 });
    });
    return () => ctx.revert();
  }, []);
  return <div className="item">Item</div>;
}

// ============================================================================
// RULE 3: scrolltrigger-cleanup-required
// ============================================================================

import ScrollTrigger from 'gsap/ScrollTrigger';

// ❌ SHOULD FAIL - ScrollTrigger without cleanup
function rule3BadNoCleanup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
      },
      opacity: 1,
    });
    // Missing cleanup!
  }, []);
  return <div className="hero">Hero</div>;
}

// ❌ SHOULD FAIL - ScrollTrigger.create() without cleanup
function rule3BadCreateNoCleanup() {
  useEffect(() => {
    ScrollTrigger.create({
      trigger: '.target',
      onEnter: () => console.log('enter'),
    });
  }, []);
  return <div className="target">Target</div>;
}

// ✅ SHOULD PASS - ScrollTrigger with gsap.context cleanup
function rule3GoodContextCleanup() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('.hero', {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top center',
        },
        opacity: 1,
      });
    });
    return () => ctx.revert();
  }, []);
  return <div className="hero">Hero</div>;
}

// ✅ SHOULD PASS - ScrollTrigger with explicit forEach cleanup
function rule3GoodExplicitCleanup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top center',
      },
      opacity: 1,
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
  return <div className="hero">Hero</div>;
}

// ✅ SHOULD PASS - ScrollTrigger with stagger and cleanup
function rule3GoodStaggerCleanup() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.cards',
          start: 'top center',
        },
      });
      gsap.to('.card', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
      });
    });
    return () => ctx.revert();
  }, []);
  return <div className="cards"><div className="card">Card</div></div>;
}

// ============================================================================
// RULE 4: no-layout-animation
// ============================================================================

// ❌ SHOULD FAIL - Animating width with GSAP
function rule4BadWidth() {
  useEffect(() => {
    gsap.to('.sidebar', {
      width: '300px',
      duration: 0.3,
    });
  }, []);
  return <div className="sidebar">Sidebar</div>;
}

// ❌ SHOULD FAIL - Animating height with GSAP
function rule4BadHeight() {
  useEffect(() => {
    gsap.to('.modal', {
      height: '500px',
      duration: 0.4,
    });
  }, []);
  return <div className="modal">Modal</div>;
}

// ❌ SHOULD FAIL - Animating margin with GSAP
function rule4BadMargin() {
  useEffect(() => {
    gsap.to('.card', {
      margin: '16px',
      duration: 0.2,
    });
  }, []);
  return <div className="card">Card</div>;
}

// ❌ SHOULD FAIL - Animating padding with GSAP
function rule4BadPadding() {
  useEffect(() => {
    gsap.to('.container', {
      paddingTop: '24px',
      paddingBottom: '24px',
      duration: 0.3,
    });
  }, []);
  return <div className="container">Container</div>;
}

// ❌ SHOULD FAIL - Animating position properties
function rule4BadPosition() {
  useEffect(() => {
    gsap.to('.tooltip', {
      top: '50px',
      left: '100px',
      duration: 0.4,
    });
  }, []);
  return <div className="tooltip">Tooltip</div>;
}

// ✅ SHOULD PASS - Using translateX instead of width
function rule4GoodTranslateX() {
  useEffect(() => {
    gsap.to('.sidebar', {
      x: 300,
      duration: 0.3,
    });
  }, []);
  return <div className="sidebar">Sidebar</div>;
}

// ✅ SHOULD PASS - Using scale instead of width/height
function rule4GoodScale() {
  useEffect(() => {
    gsap.to('.growing-box', {
      scale: 2,
      duration: 0.5,
    });
  }, []);
  return <div className="growing-box">Growing</div>;
}

// ✅ SHOULD PASS - Using translateY instead of margin
function rule4GoodTranslateY() {
  useEffect(() => {
    gsap.to('.card', {
      y: 16,
      duration: 0.2,
    });
  }, []);
  return <div className="card">Card</div>;
}

// ✅ SHOULD PASS - Using multiple transforms (GPU-accelerated)
function rule4GoodMultipleTransforms() {
  useEffect(() => {
    gsap.to('.element', {
      x: 50,
      y: 100,
      scale: 1.05,
      rotation: 5,
      opacity: 0.8,
      duration: 0.4,
    });
  }, []);
  return <div className="element">Element</div>;
}

// ✅ SHOULD PASS - No layout animation in stagger
function rule4GoodStagger() {
  useEffect(() => {
    gsap.to('.grid-item', {
      opacity: 1,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.4,
      stagger: 0.1,
    });
  }, []);
  return <div className="grid-item">Item</div>;
}

// ============================================================================
// COMBINED EXAMPLE: All 4 Violations
// ============================================================================

// ❌ SHOULD FAIL - Multiple violations
function combinedBadExample() {
  useEffect(() => {
    // Violation 2: gsap.from()
    gsap.from('.hero', {
      opacity: 0,
      // Violation 4: width animation
      width: '200px',
      duration: 0.8,
    });

    // Violation 3: No cleanup
    gsap.to('.card', {
      scrollTrigger: {
        trigger: '.cards',
        start: 'top center',
      },
      // Violation 4: height animation
      height: '500px',
      duration: 0.6,
    });
  }, []);

  // Violation 1: transition-all
  return <button className="transition-all">Hero</button>;
}

// ✅ SHOULD PASS - All fixed
function combinedGoodExample() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set + To pattern
      gsap.set('.hero', { opacity: 0, scaleX: 0.8 });
      gsap.to('.hero', {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
      });

      // ScrollTrigger with transform instead of layout
      gsap.to('.card', {
        scrollTrigger: {
          trigger: '.cards',
          start: 'top center',
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
      });
    });

    return () => ctx.revert();
  }, []);

  // Specific transition property
  return <button className="transition-transform duration-200">Hero</button>;
}

// ============================================================================
// Export for testing
// ============================================================================

export {
  rule1BadTailwind,
  rule1BadInlineStyle,
  rule1GoodSpecific,
  rule2BadGsapFrom,
  rule2GoodSetTo,
  rule3BadNoCleanup,
  rule3GoodContextCleanup,
  rule4BadWidth,
  rule4GoodTranslateX,
  combinedBadExample,
  combinedGoodExample,
};
