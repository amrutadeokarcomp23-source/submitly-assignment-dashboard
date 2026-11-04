import { useApp } from '../context/AppContext'
import { BannerArt } from './Illustrations'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function WelcomeBanner() {
  const { currentUser } = useApp()
  const isAdmin = currentUser.role === 'admin'
  const firstName = currentUser.name.replace('Prof. ', '').split(' ')[0]

  return (
    <section
      className={`relative mb-6 overflow-hidden rounded-2xl px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8 ${
        isAdmin ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : 'bg-gradient-to-r from-indigo-600 to-sky-500'
      }`}
    >
      <div className="relative z-10 max-w-md">
        <p className="text-sm font-medium text-white/80">{greeting()},</p>
        <p className="text-2xl font-bold tracking-tight sm:text-3xl">{isAdmin ? `Prof. ${firstName}` : firstName} 👋</p>
        <p className="mt-1 text-sm text-white/85">
          {isAdmin
            ? 'Create assignments and see exactly who has submitted.'
            : 'Here is everything on your plate. Stay ahead of your deadlines.'}
        </p>
      </div>
      <BannerArt className="absolute -right-4 top-1/2 hidden h-40 -translate-y-1/2 sm:block" />
    </section>
  )
}
