import { NavLink } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ThemeToggle } from './ThemeToggle'
import { StatusPill } from './StatusPill'

const NAV_ITEMS = [
  { to: '/', label: 'Research', end: true },
  { to: '/retrieval', label: 'Retrieval' },
  { to: '/knowledge-base', label: 'Knowledge Base' },
  { to: '/race', label: 'Race' },
  { to: '/evals', label: 'Evals' },
  { to: '/system', label: 'System' },
]

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-sm bg-[var(--accent)] text-[var(--accent-fg)]">
            <FlaskConical className="size-3.5" strokeWidth={2.25} />
          </span>
          <span className="font-mono text-[13px] font-semibold tracking-[0.08em] text-[var(--text)]">
            RAG&nbsp;LAB
          </span>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-sm px-2.5 py-1.5 text-xs font-medium tracking-tight transition-colors',
                  isActive
                    ? 'bg-[var(--surface-2)] text-[var(--text)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <StatusPill />
        <ThemeToggle />
      </div>
    </header>
  )
}
