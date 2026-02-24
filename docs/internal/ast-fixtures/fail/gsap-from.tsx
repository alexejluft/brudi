import gsap from "gsap"

export default function MotionBad() {
  gsap.from(".hero", { opacity: 0, y: -50 })
  gsap.from(".card", { scale: 0.8 })
  return <div className="hero"><div className="card">Bad</div></div>
}
