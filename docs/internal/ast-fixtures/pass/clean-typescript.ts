// PASS: Clean TypeScript with strict typing
// Expected violations: 0
// Demonstrates best practices:
// - No 'any' types
// - Named exports
// - All imports used
// - Proper function typing

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: string): Promise<boolean>
}

class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map()

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id)
  }
}

export { User, UserRepository, InMemoryUserRepository }
