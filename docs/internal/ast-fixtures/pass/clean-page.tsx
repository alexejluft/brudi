import { Container, Section } from "@/primitives/layout"
import { duration, easing } from "@/primitives/tokens"

export default function HomePage() {
  return (
    <main>
      <Section id="hero" spacing="lg">
        <Container>
          <h1 className="text-5xl font-bold">Welcome</h1>
          <p className="text-lg mt-4">Body text here</p>
        </Container>
      </Section>
      <Section id="features" spacing="md">
        <Container>
          <h2 className="text-3xl font-semibold">Features</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4">Card 1</div>
            <div className="p-4">Card 2</div>
            <div className="p-4">Card 3</div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
