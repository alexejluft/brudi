import gsap from "gsap"

export default function LayoutAnim() {
  gsap.to(".box", { width: 200, height: 100, margin: "20px", padding: "10px" })
  return <div className="box">Layout animated</div>
}
