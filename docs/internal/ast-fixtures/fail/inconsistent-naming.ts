// FAIL: Inconsistent naming conventions
// Expected violations: INCONSISTENT_NAMING - mixed naming styles

// camelCase
const firstName = 'John'
const last_name = 'Doe' // snake_case (inconsistent!)

// PascalCase for classes
class User {}

// CONSTANT_CASE mixed with camelCase
const MAX_SIZE = 100
const minSize = 10 // inconsistent!

// Function naming inconsistent
function getUserData() {} // camelCase
function Get_User_Info() {} // PascalCase_snake_case (inconsistent!)

// Variable naming
const user_id = '123' // snake_case
const userName = 'john' // camelCase

export { firstName, last_name, MAX_SIZE, minSize, getUserData, Get_User_Info, user_id, userName }
