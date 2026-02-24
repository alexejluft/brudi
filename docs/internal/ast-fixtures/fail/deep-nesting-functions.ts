// FAIL: NO_DEEP_NESTING - Functions nested 5 levels deep (exceeds 3-level limit)
// Expected violations: Nesting depth warnings at levels 4 and 5

function level1() {
  function level2() {
    function level3() {
      function level4() {
        function level5() {
          return 'deeply nested'
        }
        return level5()
      }
      return level4()
    }
    return level3()
  }
  return level2()
}

const deepArrow = () => {
  const l2 = () => {
    const l3 = () => {
      const l4 = () => {
        const l5 = () => {
          return 'arrow deeply nested'
        }
        return l5()
      }
      return l4()
    }
    return l3()
  }
  return l2()
}

export { level1, deepArrow }
