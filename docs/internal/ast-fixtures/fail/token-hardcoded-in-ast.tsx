// FAIL: NO_HARDCODED_COLORS - Hardcoded colors in JSX StringLiteral (not comments)
// Expected violations: Color values in string literals instead of token references

import React from 'react'

export default function HardcodedTokens() {
  return (
    <div>
      <div style={{ color: '#ff0000' }}>Red text</div>
      <p style={{ backgroundColor: 'rgb(0, 255, 0)' }}>Green background</p>
      <span style={{ borderColor: 'hsl(0, 100%, 50%)' }}>Red border</span>
      <button
        style={{
          color: '#ffffff',
          backgroundColor: '#0066ff',
          borderColor: 'rgba(0, 0, 0, 0.1)'
        }}
      >
        Styled button
      </button>
      <article
        style={{
          background: '#f5f5f5',
          color: '#333333',
          borderLeft: '4px solid #ff6600'
        }}
      >
        Article with hardcoded colors
      </article>
    </div>
  )
}
