// FAIL: PRIMITIVES_OVERWRITTEN - Imports from primitives and re-exports modified
// Expected violations: Primitive components imported and re-exported as modified versions

import { Section, Container } from '@/primitives/layout'
import { Button } from '@/primitives/forms'

// Re-exporting with modifications/wraps violates primitive constraint
export const CustomSection = (props) => (
  <Section {...props} data-custom="modified" />
)

export const EnhancedContainer = (props) => (
  <div style={{ padding: '20px' }}>
    <Container {...props} />
  </div>
)

export const ThemedButton = (props) => (
  <Button {...props} style={{ color: 'purple' }} />
)

// Direct re-export is fine, but wrapping violates rules
export { Section, Container, Button }
