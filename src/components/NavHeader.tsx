import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid, BookOpen, Users, Music } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Серии', icon: LayoutGrid },
  { to: '/contents', label: 'Содержание', icon: BookOpen },
  { to: '/characters', label: 'Персонажи', icon: Users },
  { to: '/sounds', label: 'Звуки', icon: Music },
]

export default function NavHeader() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="text-sm font-bold tracking-wide">
            BEATLAND ACADEMY
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
