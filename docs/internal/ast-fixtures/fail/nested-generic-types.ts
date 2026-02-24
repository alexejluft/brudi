// FAIL: Complex nested generic types that should be simplified
// Expected violations: COMPLEX_GENERICS - excessive type nesting

type Result<T> = {
  data: T
  error: null
} | {
  data: null
  error: Error
}

type AsyncResult<T> = Promise<Result<T>>

type PagedResult<T> = {
  items: T[]
  total: number
  page: number
}

type APIResponse<T> = Result<PagedResult<T>>

// This nesting: Result -> PagedResult -> AsyncResult creates unnecessary complexity
export async function fetchUsers(): AsyncResult<PagedResult<{
  id: string
  name: string
  email: string
  profile: {
    avatar: string
    bio: string
    settings: {
      theme: 'light' | 'dark'
      notifications: boolean
      privacy: 'public' | 'private'
    }
  }
}>> {
  return new Promise((resolve) => {
    resolve({
      data: {
        items: [],
        total: 0,
        page: 1
      },
      error: null
    })
  })
}
