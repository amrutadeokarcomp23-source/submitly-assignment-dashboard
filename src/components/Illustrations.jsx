// Original SVG illustrations (no external images, so they work offline and never break).

export function HeroIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} role="img" aria-label="Illustration of an assignment dashboard with progress and completed tasks">
      <defs>
        <linearGradient id="hero-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef2ff" />
        </linearGradient>
      </defs>

      {/* soft background blobs */}
      <circle cx="90" cy="70" r="60" fill="#ffffff" fillOpacity="0.10" />
      <circle cx="420" cy="300" r="80" fill="#ffffff" fillOpacity="0.10" />
      <circle cx="430" cy="60" r="26" fill="#fde68a" fillOpacity="0.9" />

      {/* main dashboard card */}
      <g transform="translate(60 50)">
        <rect width="320" height="240" rx="20" fill="url(#hero-card)" />
        <rect x="20" y="20" width="110" height="12" rx="6" fill="#4f46e5" />
        <rect x="20" y="40" width="70" height="8" rx="4" fill="#c7d2fe" />

        {/* progress */}
        <rect x="20" y="66" width="280" height="14" rx="7" fill="#e0e7ff" />
        <rect x="20" y="66" width="184" height="14" rx="7" fill="#6366f1" />
        <text x="300" y="60" textAnchor="end" fontSize="12" fontWeight="700" fill="#4338ca" fontFamily="system-ui, sans-serif">
          66%
        </text>

        {/* rows */}
        {[
          { y: 100, done: true, w: 130 },
          { y: 142, done: true, w: 100 },
          { y: 184, done: false, w: 150 },
        ].map((r) => (
          <g key={r.y} transform={`translate(20 ${r.y})`}>
            <rect width="280" height="34" rx="10" fill="#fff" stroke="#e0e7ff" />
            <circle cx="20" cy="17" r="9" fill={r.done ? '#10b981' : '#fbbf24'} />
            {r.done ? (
              <path d="M15.5 17l3 3 6-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ) : (
              <path d="M20 12v5l3 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
            <rect x="40" y="11" width={r.w} height="7" rx="3.5" fill="#c7d2fe" />
            <rect x="40" y="22" width="60" height="5" rx="2.5" fill="#e0e7ff" />
            <rect x="214" y="9" width="52" height="16" rx="8" fill={r.done ? '#d1fae5' : '#fef3c7'} />
          </g>
        ))}
      </g>

      {/* floating badge: submitted */}
      <g transform="translate(300 24)">
        <rect width="150" height="46" rx="14" fill="#fff" />
        <circle cx="26" cy="23" r="13" fill="#10b981" />
        <path d="M20 23l4.5 4.5L33 19" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="48" y="14" width="78" height="8" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <rect x="48" y="27" width="52" height="6" rx="3" fill="#94a3b8" />
      </g>

      {/* floating badge: deadline */}
      <g transform="translate(20 262)">
        <rect width="150" height="46" rx="14" fill="#fff" />
        <circle cx="26" cy="23" r="13" fill="#f43f5e" />
        <path d="M26 15v9l5 3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="48" y="14" width="70" height="8" rx="4" fill="#0f172a" fillOpacity="0.8" />
        <rect x="48" y="27" width="44" height="6" rx="3" fill="#94a3b8" />
      </g>

      {/* sparkles */}
      <g fill="#fff" fillOpacity="0.85">
        <path d="M36 150l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        <path d="M440 190l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </g>
    </svg>
  )
}

export function BannerArt({ className = '' }) {
  return (
    <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
      <circle cx="170" cy="30" r="46" fill="#fff" fillOpacity="0.10" />
      <circle cx="205" cy="95" r="30" fill="#fff" fillOpacity="0.10" />
      <g transform="translate(60 18) rotate(-6)">
        <rect width="86" height="86" rx="14" fill="#fff" fillOpacity="0.95" />
        <rect x="14" y="16" width="44" height="7" rx="3.5" fill="#6366f1" />
        <rect x="14" y="30" width="58" height="6" rx="3" fill="#c7d2fe" />
        <rect x="14" y="42" width="50" height="6" rx="3" fill="#c7d2fe" />
        <circle cx="60" cy="66" r="12" fill="#10b981" />
        <path d="M54 66l4.5 4.5L67 62" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

export function EmptyArt({ className = 'h-28 w-28' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="#e0e7ff" className="dark:opacity-20" />
      <rect x="32" y="26" width="52" height="68" rx="8" fill="#fff" stroke="#a5b4fc" strokeWidth="2" />
      <rect x="42" y="40" width="30" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="42" y="52" width="22" height="5" rx="2.5" fill="#e0e7ff" />
      <rect x="42" y="64" width="26" height="5" rx="2.5" fill="#e0e7ff" />
      <circle cx="84" cy="84" r="16" fill="#6366f1" />
      <path d="M84 76v16M76 84h16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}
