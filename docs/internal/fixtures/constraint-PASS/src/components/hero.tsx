import Container from './Container';
import { tokens } from '../lib/tokens';

export default function Hero() {
  return (
    <section id="hero" className={`bg-[var(--color-bg-elevated)] py-24`}>
      <Container className="max-w-6xl">
        <h1 className="text-4xl font-bold text-[var(--color-text)]">
          Welcome to Award-Level Design
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text)]">
          Built with consistency and visual depth
        </p>
        <button className="mt-8 px-6 py-3 bg-[var(--color-accent)] rounded">
          Get Started
        </button>
      </Container>
    </section>
  );
}
