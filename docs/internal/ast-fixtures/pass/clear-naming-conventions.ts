// PASS: Consistent naming conventions throughout
// Expected violations: 0
// Demonstrates best practices:
// - Consistent camelCase for variables and functions
// - CONSTANT_CASE for constants
// - PascalCase for classes and types

const MAX_USERS = 100
const DEFAULT_TIMEOUT = 5000
const API_BASE_URL = 'https://api.example.com'

interface User {
  id: string
  name: string
  email: string
}

type UserRole = 'admin' | 'moderator' | 'user'

class UserRepository {
  private users: Map<string, User> = new Map()

  findById(userId: string): User | null {
    return this.users.get(userId) || null
  }

  save(user: User): void {
    this.users.set(user.id, user)
  }

  delete(userId: string): boolean {
    return this.users.delete(userId)
  }
}

export function getUserById(userId: string): User | null {
  const repository = new UserRepository()
  return repository.findById(userId)
}

export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

export const userRoles: UserRole[] = ['admin', 'moderator', 'user']
