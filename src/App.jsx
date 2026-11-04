import { useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Header from './components/Header'
import WelcomeBanner from './components/WelcomeBanner'
import Spinner from './components/Spinner'
import ErrorState from './components/ErrorState'
import Toast from './components/Toast'

export default function App() {
  const { status, error, retry, currentUser } = useApp()

  let content
  if (status === 'loading') {
    content = (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading dashboard…" />
      </div>
    )
  } else if (status === 'error') {
    content = (
      <div className="flex min-h-screen items-center justify-center p-4">
        <ErrorState message={error} onRetry={retry} />
      </div>
    )
  } else if (!currentUser) {
    content = <LoginPage />
  } else {
    content = (
      <>
        <Header />
        <main id="main" className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <WelcomeBanner />
          {currentUser.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
        </main>
      </>
    )
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow dark:focus:bg-slate-900"
      >
        Skip to content
      </a>
      {content}
      <Toast />
    </>
  )
}
