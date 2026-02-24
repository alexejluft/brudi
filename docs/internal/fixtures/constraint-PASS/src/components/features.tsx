import Container from './Container';

export default function Features() {
  return (
    <section id="features" className={`bg-[var(--color-bg)] py-20`}>
      <Container className="max-w-5xl">
        <h2 className="text-3xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded bg-[var(--color-surface)] border border-[var(--color-surface-high)]"
            >
              <h3 className="font-semibold mb-2">Feature {i}</h3>
              <p className="text-sm text-[var(--color-text)]">Description here</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
