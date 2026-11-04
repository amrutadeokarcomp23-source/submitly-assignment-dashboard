const STYLES = {
  submitted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  overdue: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
}

const LABELS = { submitted: 'Submitted', pending: 'Not submitted', overdue: 'Overdue' }
const ICONS = { submitted: '✓', pending: '•', overdue: '!' }

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}>
      <span aria-hidden="true">{ICONS[status]}</span>
      {LABELS[status]}
    </span>
  )
}
