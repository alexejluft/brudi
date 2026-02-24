// FAIL: Section component with too many direct children (12 children exceeds reasonable limit)
// Expected violations: SECTION_CHILDREN_LIMIT - too many direct children

import { Section } from '@/primitives/layout'

export default function OvercrowdedSection() {
  return (
    <Section id="overcrowded" spacing="lg">
      <div>Child 1</div>
      <div>Child 2</div>
      <div>Child 3</div>
      <div>Child 4</div>
      <div>Child 5</div>
      <div>Child 6</div>
      <div>Child 7</div>
      <div>Child 8</div>
      <div>Child 9</div>
      <div>Child 10</div>
      <div>Child 11</div>
      <div>Child 12</div>
    </Section>
  )
}
