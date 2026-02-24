// PASS: Clean import patterns
// Expected violations: 0
// Demonstrates best practices:
// - No circular dependencies
// - Proper primitives usage
// - All imports are used
// - Named exports for easy tree-shaking

import type { User, Config } from '@/types'
import { validateEmail, validatePhone } from '@/utils/validators'
import { getUserRepository } from '@/repositories'

export async function processUserSignup(email: string, phone: string): Promise<void> {
  const isValidEmail = validateEmail(email)
  const isValidPhone = validatePhone(phone)

  if (!isValidEmail || !isValidPhone) {
    throw new Error('Invalid input')
  }

  const repository = getUserRepository()
  const user: User = {
    id: crypto.randomUUID(),
    email,
    phone,
    createdAt: new Date()
  }

  await repository.save(user)
}

export async function getUserConfig(userId: string): Promise<Config> {
  const repository = getUserRepository()
  const user = await repository.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  return {
    userId: user.id,
    theme: 'light',
    notifications: true
  }
}
