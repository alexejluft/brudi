// PASS: Properly nested functions (max 3 levels)
// Expected violations: 0
// Demonstrates best practices:
// - Functions nested only 3 levels deep
// - Clear separation of concerns
// - Proper typing throughout

interface DataPoint {
  id: string
  value: number
}

export function processDataPipeline(data: DataPoint[]): number {
  function validateData(point: DataPoint): boolean {
    return point.id.length > 0 && point.value > 0
  }

  function transformValue(point: DataPoint): number {
    return point.value * 2
  }

  const validData = data.filter(validateData)
  const transformed = validData.map(transformValue)
  return transformed.reduce((sum, val) => sum + val, 0)
}

export const calculateAverage = (numbers: number[]): number => {
  const sum = (acc: number, num: number): number => acc + num

  const total = numbers.reduce(sum, 0)
  return total / numbers.length
}
