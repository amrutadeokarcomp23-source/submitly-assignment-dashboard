export const BRAND = {
  name: 'Submitly',
  tagline: 'Every assignment, tracked from assigned to submitted.',
}

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={`${BRAND.name} logo`}>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#logo-g)" />
      <rect x="11" y="9" width="18" height="22" rx="3" fill="#fff" fillOpacity="0.95" />
      <path d="M15 15h10M15 19h6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="28" r="6.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
      <path d="M24 28l2.2 2.2L30 26.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        {BRAND.name}
      </span>
    </span>
  )
}
