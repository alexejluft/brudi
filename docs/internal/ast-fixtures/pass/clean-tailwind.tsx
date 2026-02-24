// PASS: Clean Tailwind usage
// Expected violations: 0
// Demonstrates best practices:
// - Uses only predefined Tailwind classes
// - Proper responsive design
// - Consistent spacing scale
// - No arbitrary values

import { Container, Section } from '@/primitives/layout'

export default function CleanTailwind() {
  return (
    <main>
      <Section id="hero" spacing="lg">
        <Container>
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
            <p className="text-lg text-gray-600">This is clean Tailwind code</p>
          </div>
        </Container>
      </Section>

      <Section id="features" spacing="md">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                <p className="text-gray-600">Well-structured feature card</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="cta" spacing="lg">
        <Container>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </Container>
      </Section>
    </main>
  )
}
