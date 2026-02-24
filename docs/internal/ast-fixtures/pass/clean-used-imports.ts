// PASS: All imports are used
// Expected violations: 0
// Demonstrates best practices:
// - No unused imports
// - Every import is referenced in code
// - Clean dependency management

import { validate, parse, format } from '@/utils/string-utils'
import type { ValidationResult } from '@/types'
import { logger } from '@/services/logger'

export function processString(input: string): ValidationResult {
  logger.info('Processing string:', input)

  const validation = validate(input)
  if (!validation.isValid) {
    logger.error('Validation failed:', validation.errors)
    throw new Error('Invalid input')
  }

  const parsed = parse(input)
  const formatted = format(parsed)

  logger.info('Processing complete:', formatted)
  return {
    success: true,
    data: formatted
  }
}

export function batchProcess(inputs: string[]): ValidationResult[] {
  return inputs.map((input) => {
    try {
      return processString(input)
    } catch (error) {
      logger.error('Batch processing error:', error)
      return { success: false, error: String(error) }
    }
  })
}
