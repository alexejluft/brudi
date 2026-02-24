// FAIL: Unused variables declared but not referenced
// Expected violations: NO_UNUSED_VARS - variables declared but never used

export function processData(input: string): string {
  const unused1 = 'This is never used'
  const result = input.toUpperCase()
  const unused2 = 42
  const unused3 = { key: 'value' }

  return result
}

export function calculateTotal(values: number[]): number {
  const threshold = 100
  const multiplier = 2
  const timestamp = Date.now() // declared but not used

  return values.reduce((sum, val) => sum + val, 0)
}
