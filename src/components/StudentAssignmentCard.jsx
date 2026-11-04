import { useState } from 'react'
import StatusBadge from './StatusBadge'
import ConfirmDialog from './ConfirmDialog'
import { dueLabel, formatDate, formatDateTime } from '../utils/helpers'

export default function StudentAssignmentCard({ assignment, submission, status, onConfirm }) {
  const [confirming, setConfirming] = useState(false)
  const submitted = status === 'submitted'
  const overdue = status === 'overdue'

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
        <StatusBadge status={status} />
      </div>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{assignment.description}</p>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-slate-500 dark:text-slate-400">Due:</dt>
          <dd className="font-medium">{formatDate(assignment.dueDate)}</dd>
        </div>
        {!submitted && (
          <div className={`font-medium ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {dueLabel(assignment.dueDate)}
          </div>
        )}
        {submitted && (
          <div className="flex gap-1.5 text-emerald-700 dark:text-emerald-400">
            <dt>Submitted:</dt>
            <dd className="font-medium">{formatDateTime(submission.submittedAt)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Open Drive link <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        {!submitted && (
          <button type="button" className="btn-primary" onClick={() => setConfirming(true)}>
            Yes, I have submitted
          </button>
        )}
      </div>

      {confirming && (
        <ConfirmDialog
          title="Final confirmation"
          message={`You are about to mark "${assignment.title}" as submitted. This confirms that you uploaded your work to the Drive link, and it cannot be undone. Continue?`}
          confirmLabel="Confirm submission"
          cancelLabel="Not yet"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false)
            onConfirm(assignment.id)
          }}
        />
      )}
    </article>
  )
}
