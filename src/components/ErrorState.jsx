export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="card max-w-md p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl text-rose-600 dark:bg-rose-950 dark:text-rose-300">
        !
      </div>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      {onRetry && (
        <button type="button" className="btn-primary mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
