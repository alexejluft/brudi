// PASS: Proper prop pattern using context instead of drilling
// Expected violations: 0
// Demonstrates best practices:
// - Uses React Context to avoid prop drilling
// - Clean component hierarchy
// - Proper type definitions

import React, { createContext, useContext } from 'react'

interface ThemeContextType {
  theme: string
  locale: string
  onAction: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

function Component4() {
  const { theme, locale, onAction } = useTheme()
  return (
    <div>
      <h1>Component 4</h1>
      <p>Theme: {theme}</p>
      <p>Locale: {locale}</p>
      <button onClick={onAction}>Action</button>
    </div>
  )
}

function Component3() {
  return <Component4 />
}

function Component2() {
  return <Component3 />
}

function Component1() {
  return <Component2 />
}

export default function ProperPropPattern() {
  const handleAction = () => {
    console.log('Action triggered')
  }

  return (
    <ThemeContext.Provider value={{ theme: 'light', locale: 'en', onAction: handleAction }}>
      <Component1 />
    </ThemeContext.Provider>
  )
}
