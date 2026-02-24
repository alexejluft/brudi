// FAIL: MAX_CONTAINER_VARIANTS - Too many stacked Tailwind variants
// Expected violations: sm:hover:bg-blue-500 and similar stacked variants exceed complexity limit

export default function StackedVariants() {
  return (
    <div>
      <button className="sm:hover:bg-blue-500 md:focus:text-white lg:active:border-red-700">
        Complex variant
      </button>
      <div className="sm:md:hover:py-8 sm:lg:focus:px-4">
        Multiple stacked prefixes
      </div>
      <span className="dark:sm:hover:bg-gray-900 dark:lg:focus:text-gray-100">
        Dark mode stacked
      </span>
    </div>
  )
}
