import gsap from "gsap"

export default function HardcodedMotion() {
  gsap.to(".el", { opacity: 1, duration: 0.5, ease: "power2.out" })
  gsap.to(".el2", { y: 0, duration: 0.35, ease: "sine.inOut" })
  return <Section id="motion"><Container><div className="el">Motion</div></Container></Section>
}
