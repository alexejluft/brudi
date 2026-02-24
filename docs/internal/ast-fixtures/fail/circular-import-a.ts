// FAIL: NO_CIRCULAR_IMPORTS - File A imports from File B which imports from File A
// Expected violations: Circular dependency detected

import { getConfig } from './circular-import-b'

export function initializeApp() {
  const config = getConfig()
  return {
    version: '1.0.0',
    config
  }
}

export const APP_NAME = 'TestApp'
