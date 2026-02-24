// PASS: Optimized algorithms with memoization
// Expected violations: 0
// Demonstrates best practices:
// - Uses memoization to avoid exponential complexity
// - O(n) time complexity for fibonacci
// - Proper algorithm selection

const fibCache: Record<number, number> = {}

export function fibonacci(n: number): number {
  if (n <= 1) return n
  if (fibCache[n]) return fibCache[n]

  fibCache[n] = fibonacci(n - 1) + fibonacci(n - 2)
  return fibCache[n]
}

export function binarySearch<T>(arr: T[], target: T, compare: (a: T, b: T) => number): number {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const cmp = compare(arr[mid], target)

    if (cmp === 0) return mid
    if (cmp < 0) left = mid + 1
    else right = mid - 1
  }

  return -1
}

export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return arr

  const pivot = arr[0]
  const left = arr.slice(1).filter((x) => compare(x, pivot) <= 0)
  const right = arr.slice(1).filter((x) => compare(x, pivot) > 0)

  return [...quickSort(left, compare), pivot, ...quickSort(right, compare)]
}
