// FAIL: COMPONENT_DEPTH_CHECK - JSX nesting 8 levels deep (exceeds 6-level limit)
// Expected violations: Nesting depth exceeds maximum allowed

export default function ExtremeDepth() {
  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <p>This is 8 levels deep</p>
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
