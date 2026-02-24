// FAIL: Multiple different violations in one file
// Expected violations: NO_INLINE_STYLES, NO_HARDCODED_COLORS, NO_PROP_DRILLING, NO_DEEP_NESTING, COMPONENT_DEPTH_CHECK

import React from 'react'

// Violation 1: Anonymous default export
export default function MixedViolations({ user, theme, locale, onAction, level1, level2 }) {
  function nestedLevel2() {
    function nestedLevel3() {
      function nestedLevel4() {
        function nestedLevel5() {
          // Violation 2: NO_DEEP_NESTING (5 levels)
          return <span>Deep</span>
        }
        return nestedLevel5()
      }
      return nestedLevel4()
    }
    return nestedLevel3()
  }

  return (
    // Violation 3: COMPONENT_DEPTH_CHECK (8 levels deep)
    <div style={{ color: '#ff0000', backgroundColor: 'rgb(0, 255, 0)' }}>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <button
                      // Violation 4: NO_INLINE_STYLES with hardcoded colors
                      style={{
                        color: '#ffffff',
                        backgroundColor: '#0066ff',
                        borderColor: 'hsl(0, 100%, 50%)',
                        padding: '10px'
                      }}
                      onClick={onAction}
                    >
                      {/* Violation 5: NO_PROP_DRILLING (theme, locale, onAction passed through) */}
                      {user} - {theme} - {locale}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
