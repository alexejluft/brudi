// FAIL: NO_CIRCULAR_IMPORTS - File B imports from File A which imports from File B
// Expected violations: Circular dependency detected

import { APP_NAME } from './circular-import-a'

export function getConfig() {
  return {
    appName: APP_NAME,
    debug: true,
    apiUrl: 'http://localhost:3000'
  }
}

export const DEFAULT_TIMEOUT = 5000
