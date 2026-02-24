// FAIL: String concatenation for SQL (SQL injection vulnerability)
// Expected violations: SQL_INJECTION_RISK - direct string concatenation

export function getUserById(userId: string): string {
  // DANGER: SQL Injection vulnerability!
  const query = "SELECT * FROM users WHERE id = '" + userId + "'"
  return query
}

export function findUserByEmail(email: string): string {
  // DANGER: Using template literals still vulnerable without parameterized queries
  const query = `SELECT * FROM users WHERE email = '${email}'`
  return query
}

export function updateUserName(userId: string, newName: string): string {
  // DANGER: Multiple injection points
  const query = "UPDATE users SET name = '" + newName + "' WHERE id = '" + userId + "'"
  return query
}
