// PASS: Tailwind classes without arbitrary values
// Expected violations: 0
// Demonstrates best practices:
// - Uses only predefined Tailwind classes
// - No arbitrary values like w-[123px]
// - Consistent with design system

export default function CleanTailwindClasses() {
  return (
    <div className="w-full h-full">
      <section className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="w-32 h-32 bg-blue-500 rounded-lg"></div>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md">
              Button 1
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
              Button 2
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-md">
                Item {i}
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-300 pt-4">
            <p className="text-sm text-gray-600">Footer text</p>
          </div>
        </div>
      </section>
    </div>
  )
}
