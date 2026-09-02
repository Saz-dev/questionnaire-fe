import { Link } from 'react-router-dom'
import { useSystemHealth } from '@/features/system/hooks'
import { ApiError } from '@/services/api/client'

export function StatusPill() {
  const { data, error, isLoading } = useSystemHealth()

  let tone: 'ok' | 'warn' | 'down' | 'loading' = 'loading'
  let label = 'Connecting…'

  if (!isLoading) {
    if (error) {
      tone = 'down'
      label = error instanceof ApiError && error.status === null ? 'Backend offline' : 'Backend error'
    } else if (data) {
      tone = data.index.status === 'ready' ? 'ok' : 'warn'
      label = data.index.status === 'ready' ? 'Index ready' : 'Index stale'
    }
  }

  const dotColor = {
    ok: 'bg-[var(--success)]',
    warn: 'bg-[var(--accent)]',
    down: 'bg-[var(--danger)]',
    loading: 'bg-[var(--text-faint)]',
  }[tone]

  return (
    <Link
      to="/system"
      className="flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-2 py-1 font-mono text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)]"
    >
      <span className={`size-1.5 rounded-full ${dotColor} ${tone === 'loading' ? 'animate-pulse-soft' : ''}`} />
      {label}
    </Link>
  )
}
