import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-10 text-center',
        className,
      )}
    >
      {icon && <div className="text-[var(--text-faint)]">{icon}</div>}
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--text)]">{title}</p>
        {description && <p className="max-w-sm text-xs text-[var(--text-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
