// PASS: Clean responsive Tailwind design
// Expected violations: 0
// Demonstrates best practices:
// - Proper mobile-first responsive design
// - Single variant per breakpoint
// - Consistent utility usage
// - No arbitrary values

export default function ResponsiveTailwind() {
  return (
    <div className="w-full h-screen">
      <header className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
          Responsive Design
        </h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 md:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-2">Card {i}</h3>
              <p className="text-sm md:text-base text-gray-600">
                Responsive card with proper spacing
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-12 md:mt-20 px-4 py-8 bg-gray-50 text-center">
        <p className="text-sm md:text-base text-gray-600">
          Clean responsive footer with Tailwind
        </p>
      </footer>
    </div>
  )
}
