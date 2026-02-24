// FAIL: Exponential time complexity algorithm (should use DP or memoization)
// Expected violations: EXPONENTIAL_COMPLEXITY - inefficient algorithm

export function fibonacci(n: number): number {
  // Exponential time complexity O(2^n) - very inefficient!
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

export function generateAllSubsets<T>(arr: T[]): T[][] {
  // Exponential time complexity O(2^n)
  if (arr.length === 0) return [[]]

  const head = arr[0]
  const tail = arr.slice(1)
  const subsets = generateAllSubsets(tail)

  return [...subsets, ...subsets.map((subset) => [head, ...subset])]
}

export function permute(arr: number[]): number[][] {
  // Exponential O(n!) time complexity
  if (arr.length <= 1) return [arr]

  const result: number[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)))
    for (const perm of rest) {
      result.push([arr[i], ...perm])
    }
  }
  return result
}
