import { useApp } from '../context/AppContext'
import Logo, { BRAND } from '../components/Logo'
import { HeroIllustration } from '../components/Illustrations'

const FEATURES = [
  { icon: '✅', text: 'Two-step submission confirmation' },
  { icon: '📊', text: 'Live class completion tracking' },
  { icon: '⏰', text: 'Deadlines and overdue alerts' },
]

const initials = (name) =>
  name
    .replace('Prof. ', '')
    .split(' ')
    .map((p) => p[0])
    .join('')

function UserButton({ user, onLogin, accent }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onLogin(user.id)}
        className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
      >
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${accent}`}
        >
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{user.name}</span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
        </span>
        <span aria-hidden="true" className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">
          →
        </span>
      </button>
    </li>
  )
}

export default function LoginPage() {
  const { users, login, theme, toggleTheme, resetDemo } = useApp()
  const admins = users.filter((u) => u.role === 'admin')
  const students = users.filter((u) => u.role === 'student')

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section
        aria-label={`About ${BRAND.name}`}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12"
      >
        <div className="relative z-10 flex h-full flex-col">
          <Logo light />

          <div className="mt-8 lg:mt-14">
            <h1 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-4 max-w-md text-sm text-indigo-100 sm:text-base">
              {BRAND.name} connects professors and students in one simple place: assign work, confirm submissions and see class progress at a glance.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-indigo-50">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                  {f.icon}
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          <HeroIllustration className="mx-auto mt-8 w-full max-w-md lg:mt-auto" />
        </div>
      </section>

      {/* Login panel */}
      <section className="flex flex-col px-4 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pick who you want to sign in as.</p>
          </div>
          <button
            type="button"
            className="btn-secondary shrink-0 px-2.5"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </div>

        <div className="mt-8 space-y-7">
          <div className="animate-fade-in" role="group" aria-labelledby="students-heading">
            <h3 id="students-heading" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span aria-hidden="true">🎓</span> Students
            </h3>
            <ul className="space-y-2">
              {students.map((u) => (
                <UserButton key={u.id} user={u} onLogin={login} accent="bg-gradient-to-br from-sky-500 to-indigo-500" />
              ))}
            </ul>
          </div>

          <div className="animate-fade-in" role="group" aria-labelledby="admins-heading">
            <h3 id="admins-heading" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span aria-hidden="true">🧑‍🏫</span> Professors
            </h3>
            <ul className="space-y-2">
              {admins.map((u) => (
                <UserButton key={u.id} user={u} onLogin={login} accent="bg-gradient-to-br from-violet-500 to-fuchsia-500" />
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-10 text-xs text-slate-500 dark:text-slate-400">
          <span>Demo mode: no password needed.</span>
          <button type="button" className="underline hover:text-slate-700 dark:hover:text-slate-200" onClick={resetDemo}>
            Reset demo data
          </button>
        </div>
      </section>
    </div>
  )
}
