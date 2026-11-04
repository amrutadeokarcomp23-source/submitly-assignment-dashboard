export default function ProgressBar({ percent, label, tone = 'indigo' }) {
  const color = percent === 100 ? 'bg-emerald-500' : tone === 'indigo' ? 'bg-indigo-600' : 'bg-sky-500'
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }} />
    </div>
  )
}
