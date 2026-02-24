// FAIL: NO_DEFAULT_EXPORT_ANON - Default export is anonymous arrow function
// Expected violations: Anonymous default export should be named

export default () => {
  return {
    message: 'This is an anonymous default export',
    timestamp: Date.now()
  }
}

export const named = 'This is a named export'
