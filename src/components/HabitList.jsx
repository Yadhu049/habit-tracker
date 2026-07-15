import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function HabitList({ userId }) {
  const [habits, setHabits] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHabits() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('habits')
        .select('id, name, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setHabits(data)
      }

      setLoading(false)
    }

    fetchHabits()
  }, [userId])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setSubmitting(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('habits')
      .insert({ name: trimmedName, user_id: userId })
      .select('id, name, created_at')
      .single()

    if (insertError) {
      setError(insertError.message)
    } else {
      setHabits((current) => [data, ...current])
      setName('')
    }

    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Add a habit</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Read for 20 minutes"
            required
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Your habits</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading habits...</p>
        ) : habits.length === 0 ? (
          <p className="text-sm text-gray-500">No habits yet. Add your first one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {habits.map((habit) => (
              <li key={habit.id} className="py-3 text-gray-900">
                {habit.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
