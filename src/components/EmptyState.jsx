import { EmptyArt } from './Illustrations'

export default function EmptyState({ title, message, action }) {
  return (
    <div className="card animate-fade-in flex flex-col items-center px-6 py-12 text-center">
      <EmptyArt />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
