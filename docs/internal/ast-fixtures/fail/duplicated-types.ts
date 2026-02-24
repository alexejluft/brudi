// FAIL: NO_DUPLICATED_TYPES - Two interfaces with identical structure but different names
// Expected violations: UserInfo and PersonData have identical structure

interface UserInfo {
  id: string
  name: string
  email: string
  createdAt: Date
  isActive: boolean
}

interface PersonData {
  id: string
  name: string
  email: string
  createdAt: Date
  isActive: boolean
}

type CustomerRecord = {
  id: string
  name: string
  email: string
  createdAt: Date
  isActive: boolean
}

function processUser(user: UserInfo) {
  return user
}

function processPerson(person: PersonData) {
  return person
}

export { UserInfo, PersonData, CustomerRecord, processUser, processPerson }
