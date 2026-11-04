import { useState } from 'react'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import ConfirmDialog from './ConfirmDialog'
import { dueLabel, formatDate, formatDateTime, getAssignedStudentIds, hasSubmitted } from '../utils/helpers'

export default function AdminAssignmentCard({ assignment, users, submissions, stats, overdue, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const studentIds = getAssignedStudentIds(assignment, users)
  const students = studentIds.map((id) => users.find((u) => u.id === id)).filter(Boolean)
  const audience = assignment.assignedTo === 'all' ? 'All students' : `${students.length} selected student${students.length === 1 ? '' : 's'}`

  return (
    <article
      className={`card animate-fade-in p-4 sm:p-5 ${
        overdue ? 'border-rose-300 ring-1 ring-rose-200 dark:border-rose-900 dark:ring-rose-950' : ''
      }`}
      aria-labelledby={`title-${assignment.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`title-${assignment.id}`} className="text-base font-semibold sm:text-lg">
          {assignment.title}
        </h3>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary px-3 py-1.5" onClick={() => onEdit(assignment)}>
            Edit<span className="sr-only"> {assignment.title}</span>
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
            onClick={() => setDeleting(true)}
          >
            Delete<span className="sr-only"> {assignment.title}</span>
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{assignment.description}</p>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-slate-500 dark:text-slate-400">Due:</dt>
          <dd className="font-medium">{formatDate(assignment.dueDate)}</dd>
        </div>
        <div className={`font-medium ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {stats.percent === 100 ? 'Everyone has submitted' : dueLabel(assignment.dueDate)}
        </div>
        <div className="flex gap-1.5">
          <dt className="text-slate-500 dark:text-slate-400">Assigned to:</dt>
          <dd className="font-medium">{audience}</dd>
        </div>
        <div>
          <a href={assignment.driveLink} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400">
            Drive link ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium">Class completion</span>
          <span className="tabular-nums text-slate-600 dark:text-slate-400">
            {stats.done} of {stats.total} · {stats.percent}%
          </span>
        </div>
        <ProgressBar percent={stats.percent} label={`Class completion for ${assignment.title}`} tone="sky" />
      </div>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        aria-expanded={open}
        aria-controls={`students-${assignment.id}`}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide student status' : 'Show student status'}
      </button>

      {open && (
        <ul id={`students-${assignment.id}`} className="animate-fade-in mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {students.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500">No students assigned.</li>
          ) : (
            students.map((s) => {
              const submitted = hasSubmitted(submissions, assignment.id, s.id)
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.name}</p>
                    {submitted && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(submissions[assignment.id][s.id].submittedAt)}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={submitted ? 'submitted' : 'pending'} />
                </li>
              )
            })
          )}
        </ul>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete assignment?"
          message={`"${assignment.title}" and all of its submission records will be permanently removed.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(false)}
          onConfirm={() => {
            setDeleting(false)
            onDelete(assignment.id)
          }}
        />
      )}
    </article>
  )
}
