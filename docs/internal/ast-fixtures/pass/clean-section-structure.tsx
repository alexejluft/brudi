// PASS: Clean Section component structure
// Expected violations: 0
// Demonstrates best practices:
// - Section has proper id prop
// - Limited direct children (best practice)
// - Proper spacing usage
// - Clean nesting (max 6 levels)

import { Container, Section } from '@/primitives/layout'

export default function CleanSectionStructure() {
  return (
    <main>
      <Section id="intro" spacing="lg">
        <Container>
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-lg mt-4">Introduction text</p>
        </Container>
      </Section>

      <Section id="features" spacing="md">
        <Container>
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold">Feature 1</h3>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold">Feature 2</h3>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="conclusion" spacing="lg">
        <Container>
          <p className="text-center">Conclusion section</p>
        </Container>
      </Section>
    </main>
  )
}
