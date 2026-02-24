// FAIL: Excessive or redundant comments (should use clear code instead)
// Expected violations: EXCESSIVE_COMMENTS - code clarity issues

// This is a function
// It takes a number
// It adds 5 to it
// Then returns the result
function addFive(num: number) {
  // Set result to num + 5
  const result = num + 5 // Add five
  // Return the result
  return result // Done
}

/**
 * Loop through the array
 * For each item in the array
 * We do something
 */
function processItems(items: any[]) {
  // Loop through
  for (let i = 0; i < items.length; i++) {
    // Get item
    const item = items[i]
    // Process it
    console.log(item) // Print the item
  }
  // Done looping
}
