// PASS: Safe database queries using parameterized statements
// Expected violations: 0
// Demonstrates best practices:
// - Parameterized queries to prevent SQL injection
// - Proper query construction

interface QueryExecutor {
  execute(query: string, params: any[]): Promise<any>
}

export class UserService {
  constructor(private db: QueryExecutor) {}

  async getUserById(userId: string): Promise<any> {
    // SAFE: Using parameterized query
    const query = 'SELECT * FROM users WHERE id = ?'
    return this.db.execute(query, [userId])
  }

  async findUserByEmail(email: string): Promise<any> {
    // SAFE: Using parameterized query with named params
    const query = 'SELECT * FROM users WHERE email = :email'
    return this.db.execute(query, { email })
  }

  async updateUserName(userId: string, newName: string): Promise<void> {
    // SAFE: All values are parameterized
    const query = 'UPDATE users SET name = ? WHERE id = ?'
    await this.db.execute(query, [newName, userId])
  }

  async deleteUser(userId: string): Promise<void> {
    // SAFE: Using parameterized query
    const query = 'DELETE FROM users WHERE id = ?'
    await this.db.execute(query, [userId])
  }
}
