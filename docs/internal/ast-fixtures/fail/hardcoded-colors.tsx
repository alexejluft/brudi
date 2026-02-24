export default function ColorViolation() {
  return (
    <div>
      <p style={{color: "#ff0000"}}>Red text</p>
      <span style={{backgroundColor: "rgb(255, 0, 0)"}}>RGB</span>
      <div style={{borderColor: "hsl(120, 100%, 50%)"}}>HSL</div>
      <button style={{color: "#fff"}}>White</button>
    </div>
  )
}
