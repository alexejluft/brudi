// FAIL: Operations on potentially null values without null checks
// Expected violations: NULL_REFERENCE - potential null reference errors

interface User {
  id: string
  name: string
  email?: string
}

export function displayUserEmail(user: User | null) {
  // Accessing property on potentially null value
  return user.email.toLowerCase() // Will error if user is null or email is undefined
}

export function getUserName(user: User | undefined) {
  // Direct access without null check
  return user.name.charAt(0).toUpperCase() // Potential null reference
}

export function processUserList(users: (User | null)[]) {
  return users.map((user) => {
    // Not checking if user is null
    return {
      id: user.id,
      email: user.email.trim() // Will crash if user is null or email is undefined
    }
  })
}
