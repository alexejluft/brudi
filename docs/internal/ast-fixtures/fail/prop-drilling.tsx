// FAIL: NO_PROP_DRILLING - Props passed through 4+ component levels
// Expected violations: Deep prop drilling through Component1 > Component2 > Component3 > Component4

interface UserData {
  id: string
  name: string
  email: string
  theme: string
  locale: string
}

function Component1({ user, theme, locale, onAction }: { user: UserData; theme: string; locale: string; onAction: () => void }) {
  return <Component2 user={user} theme={theme} locale={locale} onAction={onAction} />
}

function Component2({ user, theme, locale, onAction }: { user: UserData; theme: string; locale: string; onAction: () => void }) {
  return <Component3 user={user} theme={theme} locale={locale} onAction={onAction} />
}

function Component3({ user, theme, locale, onAction }: { user: UserData; theme: string; locale: string; onAction: () => void }) {
  return <Component4 user={user} theme={theme} locale={locale} onAction={onAction} />
}

function Component4({ user, theme, locale, onAction }: { user: UserData; theme: string; locale: string; onAction: () => void }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={onAction}>Action</button>
    </div>
  )
}

export default Component1
