import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import HabitList from './components/HabitList'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">Habit Tracker</h1>

        {session ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-medium text-gray-900">{session.user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Sign out
              </button>
            </div>
            <HabitList userId={session.user.id} />
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </main>
  )
}

export default App
