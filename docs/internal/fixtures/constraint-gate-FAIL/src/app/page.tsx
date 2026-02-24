// This fixture FAILS all constraint checks intentionally

export default function HomePage() {
  return (
    <div>
      {/* FAIL A: Multiple inconsistent max-w values — 5 different widths */}
      <div className="max-w-2xl mx-auto">
        <h1>Hero</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1>Section 1</h1>
      </div>

      <div className="max-w-5xl mx-auto">
        <h1>Section 2</h1>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1>Section 3</h1>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1>Section 4</h1>
      </div>

      {/* FAIL C: Spacing chaos - 7 different space/gap values (exceeds limit of 6) */}
      <div className="space-y-2">
        <div className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-8">
              <div className="space-y-10">
                <div className="space-y-12">
                  <div className="space-y-16">Item chaos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAIL D: Multiple sections without id attributes */}
      <section className="py-20">
        <h2>Section Without ID 1</h2>
      </section>

      <section className="py-20">
        <h2>Section Without ID 2</h2>
      </section>

      <footer className="bg-gray-800">
        <p>Footer</p>
      </footer>
    </div>
  );
}
