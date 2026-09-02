import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-sm border border-[var(--border)] bg-[var(--surface)]', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  meta,
  action,
  className,
}: {
  title: ReactNode
  meta?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-[var(--border)] px-3.5 py-2.5',
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </h3>
        {meta && <span className="shrink-0 font-mono text-[11px] text-[var(--text-faint)]">{meta}</span>}
      </div>
      {action}
    </div>
  )
}
