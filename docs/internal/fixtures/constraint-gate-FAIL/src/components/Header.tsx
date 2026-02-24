// This component has text without proper wrapping context

export function Header() {
  return (
    <header>
      {/* No padding, no Container import */}
      <h1>Services Section</h1>
      <p>This paragraph is edge-to-edge without padding context</p>
    </header>
  );
}
