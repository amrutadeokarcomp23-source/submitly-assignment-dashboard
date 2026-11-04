import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import ProgressBar from '../components/ProgressBar'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/EmptyState'
import StudentAssignmentCard from '../components/StudentAssignmentCard'
import { hasSubmitted, isAssignedTo, isOverdue, sortAssignments } from '../utils/helpers'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Not submitted' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'overdue', label: 'Overdue' },
]

export default function StudentDashboard() {
  const { currentUser, assignments, submissions, confirmSubmission } = useApp()
  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'due-asc' })

  // Only this student's assignments, each decorated with its status.
  const mine = useMemo(
    () =>
      assignments
        .filter((a) => isAssignedTo(a, currentUser.id))
        .map((a) => {
          const submitted = hasSubmitted(submissions, a.id, currentUser.id)
          const status = submitted ? 'submitted' : isOverdue(a.dueDate, false) ? 'overdue' : 'pending'
          return { assignment: a, submission: submissions[a.id]?.[currentUser.id], status }
        }),
    [assignments, submissions, currentUser.id],
  )

  const total = mine.length
  const done = mine.filter((m) => m.status === 'submitted').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const overdueCount = mine.filter((m) => m.status === 'overdue').length

  const visible = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    const filtered = mine.filter((m) => {
      if (filters.status === 'pending' && m.status === 'submitted') return false
      if (filters.status === 'submitted' && m.status !== 'submitted') return false
      if (filters.status === 'overdue' && m.status !== 'overdue') return false
      if (!q) return true
      return (
        m.assignment.title.toLowerCase().includes(q) || m.assignment.description.toLowerCase().includes(q)
      )
    })
    const order = sortAssignments(filtered.map((m) => m.assignment), filters.sort).map((a) => a.id)
    return order.map((id) => filtered.find((m) => m.assignment.id === id))
  }, [mine, filters])

  return (
    <div className="space-y-6">
      <section className="card p-4 sm:p-6" aria-labelledby="progress-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 id="progress-heading" className="text-xl font-bold sm:text-2xl">
              My assignments
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {done} of {total}
              </span>{' '}
              submitted
              {overdueCount > 0 && (
                <span className="ml-2 font-medium text-rose-600 dark:text-rose-400">· {overdueCount} overdue</span>
              )}
            </p>
          </div>
          <p className="text-2xl font-bold tabular-nums">{percent}%</p>
        </div>
        <div className="mt-3">
          <ProgressBar percent={percent} label={`${done} of ${total} assignments submitted`} />
        </div>
      </section>

      {total > 0 && <FilterBar value={filters} onChange={setFilters} statusOptions={STATUS_OPTIONS} />}

      {total === 0 ? (
        <EmptyState
          title="No assignments yet"
          message="Nothing has been assigned to you. New assignments from your professors will show up here."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No matching assignments"
          message="Try a different search or clear the status filter."
          action={
            <button type="button" className="btn-secondary" onClick={() => setFilters({ query: '', status: 'all', sort: filters.sort })}>
              Clear filters
            </button>
          }
        />
      ) : (
        <ul className="space-y-4" aria-label="Assignments">
          {visible.map((m) => (
            <li key={m.assignment.id}>
              <StudentAssignmentCard
                assignment={m.assignment}
                submission={m.submission}
                status={m.status}
                onConfirm={confirmSubmission}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
