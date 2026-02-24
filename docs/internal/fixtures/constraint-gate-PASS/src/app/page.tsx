import { Container, Section } from '@/components/layout';

// This fixture PASSES all constraint checks

export default function HomePage() {
  return (
    <div>
      {/* PASS A: Consistent max-w usage (all max-w-7xl or Container primitive) */}
      <Section id="hero">
        <Container>
          <h1>Hero Section</h1>
          <p>This section uses Container primitive for consistent max-width</p>
        </Container>
      </Section>

      {/* PASS B: Text properly wrapped with Container and padding */}
      <Section id="services">
        <Container className="px-4">
          <h2>Services</h2>
          <p>All paragraphs have proper padding context via Container</p>
        </Container>
      </Section>

      {/* PASS C: Spacing consistency - only 3 different py-* values */}
      <Section id="features" className="py-16">
        <Container>
          <div className="space-y-8 gap-6">
            <div className="py-6">Feature 1</div>
            <div className="py-6">Feature 2</div>
            <div className="py-6">Feature 3</div>
          </div>
        </Container>
      </Section>

      {/* PASS D: All sections have id attributes */}
      <Section id="cta">
        <Container>
          <h2>Call to Action</h2>
          <button className="bg-[var(--accent)] text-[var(--surface)]">
            Get Started
          </button>
        </Container>
      </Section>

      {/* PASS E: Token references throughout */}
      <footer
        className="py-12 bg-[var(--bg)]"
        style={{
          animationDuration: 'var(--duration-base)',
          animationTimingFunction: 'var(--easing-out)',
        }}
      >
        <Container>
          <p className="text-[var(--text-secondary)]">
            Footer with proper token references
          </p>
        </Container>
      </footer>
    </div>
  );
}
