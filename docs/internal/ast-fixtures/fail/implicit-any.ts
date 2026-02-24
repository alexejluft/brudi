// FAIL: NO_IMPLICIT_ANY - Function parameters without type annotations
// Expected violations: Function params lack explicit type annotations

function processUser(name, email, age) {
  return {
    name,
    email,
    age,
    verified: false
  }
}

const handleRequest = (data, callback) => {
  const processed = data.map(item => item * 2)
  callback(processed)
}

function fetchData(url) {
  return fetch(url).then(response => response.json())
}

export { processUser, handleRequest, fetchData }
