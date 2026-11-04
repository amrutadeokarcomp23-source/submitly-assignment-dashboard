import { useApp } from '../context/AppContext'

export default function Header() {
  const { currentUser, logout, theme, toggleTheme } = useApp()
  const isAdmin = currentUser.role === 'admin'

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-base">{currentUser.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAdmin ? 'Professor / Admin' : 'Student'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-2.5"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <button type="button" className="btn-secondary" onClick={logout}>
            Switch user
          </button>
        </div>
      </div>
    </header>
  )
}
