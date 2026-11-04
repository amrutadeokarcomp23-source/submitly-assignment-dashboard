import { useApp } from '../context/AppContext'

function UserButton({ user, onLogin }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onLogin(user.id)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
        >
          {user.name
            .replace('Prof. ', '')
            .split(' ')
            .map((p) => p[0])
            .join('')}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{user.name}</span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
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
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Assignment &amp; Review Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Demo login: choose a user to continue. No password is needed, and each user only sees their own data.
          </p>
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

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="admins-heading" className="animate-fade-in">
          <h2 id="admins-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Professors (Admin)
          </h2>
          <ul className="space-y-2">
            {admins.map((u) => (
              <UserButton key={u.id} user={u} onLogin={login} />
            ))}
          </ul>
        </section>
        <section aria-labelledby="students-heading" className="animate-fade-in">
          <h2 id="students-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Students
          </h2>
          <ul className="space-y-2">
            {students.map((u) => (
              <UserButton key={u.id} user={u} onLogin={login} />
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-auto pt-10">
        <button type="button" className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={resetDemo}>
          Reset demo data
        </button>
      </div>
    </div>
  )
}
