import { duration, easing } from "@/primitives/tokens"
import gsap from "gsap"

export default function AnimatedHero() {
  const animate = () => {
    gsap.set(".hero", { opacity: 0, y: 20 })
    gsap.to(".hero", { opacity: 1, y: 0, duration: duration.fast, ease: easing.enter })
  }
  
  return (
    <Section id="animated-hero">
      <Container>
        <div className="hero">
          <h1 className="text-4xl">Animated</h1>
        </div>
      </Container>
    </Section>
  )
}
