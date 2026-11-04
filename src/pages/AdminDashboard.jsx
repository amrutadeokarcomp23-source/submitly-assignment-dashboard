import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import AdminAssignmentCard from '../components/AdminAssignmentCard'
import AssignmentForm from '../components/AssignmentForm'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/EmptyState'
import ProgressBar from '../components/ProgressBar'
import { completion, isOverdue, sortAssignments } from '../utils/helpers'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'complete', label: 'Fully submitted' },
  { value: 'overdue', label: 'Overdue (incomplete)' },
]

export default function AdminDashboard() {
  const { currentUser, users, assignments, submissions, createAssignment, updateAssignment, deleteAssignment } = useApp()
  const [filters, setFilters] = useState({ query: '', status: 'all', sort: 'due-asc' })
  const [formState, setFormState] = useState(null) // null | { initial: assignment | null }

  const students = useMemo(() => users.filter((u) => u.role === 'student'), [users])

  // Admins only ever see assignments they created.
  const mine = useMemo(
    () =>
      assignments
        .filter((a) => a.createdBy === currentUser.id)
        .map((a) => {
          const stats = completion(a, users, submissions)
          return { assignment: a, stats, overdue: stats.percent < 100 && isOverdue(a.dueDate, false) }
        }),
    [assignments, users, submissions, currentUser.id],
  )

  const overall = useMemo(() => {
    const done = mine.reduce((n, m) => n + m.stats.done, 0)
    const total = mine.reduce((n, m) => n + m.stats.total, 0)
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
  }, [mine])

  const visible = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    const filtered = mine.filter((m) => {
      if (filters.status === 'complete' && m.stats.percent < 100) return false
      if (filters.status === 'in-progress' && m.stats.percent === 100) return false
      if (filters.status === 'overdue' && !m.overdue) return false
      if (!q) return true
      return m.assignment.title.toLowerCase().includes(q) || m.assignment.description.toLowerCase().includes(q)
    })
    const order = sortAssignments(filtered.map((m) => m.assignment), filters.sort).map((a) => a.id)
    return order.map((id) => filtered.find((m) => m.assignment.id === id))
  }, [mine, filters])

  const handleSubmit = (fields) => {
    if (formState.initial) updateAssignment(formState.initial.id, fields)
    else createAssignment(fields)
    setFormState(null)
  }

  const newButton = (
    <button type="button" className="btn-primary" onClick={() => setFormState({ initial: null })}>
      + New assignment
    </button>
  )

  return (
    <div className="space-y-6">
      <section className="card p-4 sm:p-6" aria-labelledby="admin-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 id="admin-heading" className="text-xl font-bold sm:text-2xl">
              My assignments
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {mine.length} created · {overall.done} of {overall.total} student submissions received
            </p>
          </div>
          {newButton}
        </div>
        {mine.length > 0 && (
          <div className="mt-4">
            <ProgressBar percent={overall.percent} label="Overall submission rate across your assignments" tone="sky" />
          </div>
        )}
      </section>

      {mine.length > 0 && <FilterBar value={filters} onChange={setFilters} statusOptions={STATUS_OPTIONS} />}

      {mine.length === 0 ? (
        <EmptyState
          title="You haven't created any assignments"
          message="Create your first assignment, choose who it is for, and track submissions here."
          action={newButton}
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
        <ul className="space-y-4" aria-label="Assignments you created">
          {visible.map((m) => (
            <li key={m.assignment.id}>
              <AdminAssignmentCard
                assignment={m.assignment}
                users={users}
                submissions={submissions}
                stats={m.stats}
                overdue={m.overdue}
                onEdit={(a) => setFormState({ initial: a })}
                onDelete={deleteAssignment}
              />
            </li>
          ))}
        </ul>
      )}

      {formState && (
        <AssignmentForm
          initial={formState.initial}
          students={students}
          onSubmit={handleSubmit}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  )
}
