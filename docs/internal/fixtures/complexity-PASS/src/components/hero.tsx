'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current || !buttonRef.current) return;

    const ctx = gsap.context(() => {
      // Animation 1: Headline stagger with power2.out
      gsap.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Animation 2: Button scale on hover with power3.out
      gsap.set(buttonRef.current, { scale: 1 });
      buttonRef.current?.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power3.out',
        });
      });

      buttonRef.current?.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'sine.inOut',
        });
      });

      // Animation 3: Scroll indicator @keyframes (using gsap timeline)
      gsap.timeline({ repeat: -1 })
        .to('#scroll-indicator', {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
        })
        .to(
          '#scroll-indicator',
          {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut',
          },
          0
        );

      // Animation 4: Background shift parallax with sine.inOut
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          markers: false,
        },
        backgroundColor: 'var(--color-bg-elevated)',
        duration: 1,
        ease: 'sine.inOut',
      });

      // Animation 5: Shadow elevation on button with power2.out
      gsap.set(buttonRef.current, { boxShadow: 'var(--shadow-md)' });
      buttonRef.current?.addEventListener('mouseenter', () => {
        gsap.to(buttonRef.current, {
          boxShadow: 'var(--shadow-xl)',
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      buttonRef.current?.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, {
          boxShadow: 'var(--shadow-md)',
          duration: 0.3,
          ease: 'sine.inOut',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center"
    >
      <div className="text-center">
        <h1
          ref={headlineRef}
          className="text-6xl font-bold text-[var(--color-text)] opacity-0 translate-y-4"
        >
          Award-Level Design System
        </h1>
        <p className="mt-4 text-xl text-[var(--color-surface)]">
          With full complexity orchestration
        </p>
        <button
          ref={buttonRef}
          className="mt-12 px-8 py-4 bg-[var(--color-accent)] text-white rounded-lg font-semibold transition-shadow"
        >
          Explore Now
        </button>
        <div
          id="scroll-indicator"
          className="mt-12 text-[var(--color-surface-high)]"
        >
          ↓
        </div>
      </div>
    </section>
  );
}
