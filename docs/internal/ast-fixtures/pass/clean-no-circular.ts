// PASS: Clean module structure with no circular imports
// Expected violations: 0
// Demonstrates best practices:
// - One-directional dependency flow
// - No circular imports
// - Clear module boundaries

// module-a.ts (imported by module-b)
export interface User {
  id: string
  name: string
}

export function createUser(name: string): User {
  return {
    id: crypto.randomUUID(),
    name
  }
}

// This would be in a separate file, but shown here for context
// module-b.ts (imports from module-a, not imported by it)
// import { createUser } from './module-a'
// export function processUser(name: string) { return createUser(name) }

// module-c.ts (imports from module-b, not imported by it)
// import { processUser } from './module-b'
// export function initializeUsers() { return processUser('Admin') }

// The dependency chain flows one direction: a -> b -> c
// No module imports from modules that depend on it
