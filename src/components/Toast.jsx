import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast, dismissToast } = useApp()
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div
        role={isError ? 'alert' : 'status'}
        className={`pointer-events-auto animate-pop-in flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
          isError ? 'bg-rose-600' : 'bg-slate-900 dark:bg-slate-700'
        }`}
      >
        <span>{toast.message}</span>
        <button type="button" onClick={dismissToast} aria-label="Dismiss notification" className="rounded px-1 text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  )
}
