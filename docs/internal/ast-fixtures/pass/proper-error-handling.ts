// PASS: Proper error handling with null checks
// Expected violations: 0
// Demonstrates best practices:
// - Null safety checks before operations
// - Proper error handling
// - Type guards

interface User {
  id: string
  name: string
  email?: string
}

export function getUserEmail(user: User | null | undefined): string | null {
  if (!user) return null
  if (!user.email) return null
  return user.email.trim()
}

export function getUserNameInitials(user: User | null): string {
  if (!user) return 'Unknown'
  return user.name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function processUserList(users: (User | null)[]): Array<{ id: string; email: string | null }> {
  return users
    .filter((user) => user !== null)
    .map((user) => {
      const email = user.email ? user.email.trim() : null
      return {
        id: user.id,
        email
      }
    })
}

export function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return fallback
  }
}
