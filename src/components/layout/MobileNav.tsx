import { NavLink } from 'react-router-dom'
import { BookMarked, FlaskConical, ListChecks, Search, SlidersHorizontal, Trophy } from 'lucide-react'
import { cn } from '@/utils/cn'

const ITEMS = [
  { to: '/', label: 'Research', icon: FlaskConical, end: true },
  { to: '/retrieval', label: 'Retrieval', icon: Search },
  { to: '/knowledge-base', label: 'Knowledge', icon: BookMarked },
  { to: '/race', label: 'Race', icon: Trophy },
  { to: '/evals', label: 'Evals', icon: ListChecks },
  { to: '/system', label: 'System', icon: SlidersHorizontal },
]

export function MobileNav() {
  return (
    <nav className="grid shrink-0 grid-cols-6 border-t border-[var(--border)] bg-[var(--bg-elevated)] md:hidden">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
              isActive ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
