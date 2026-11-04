export default function EmptyState({ title, message, action }) {
  return (
    <div className="card animate-fade-in flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl dark:bg-indigo-950" aria-hidden="true">
        📭
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
