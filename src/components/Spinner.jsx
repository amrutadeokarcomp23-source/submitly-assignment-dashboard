export default function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
