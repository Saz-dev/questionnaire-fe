import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'evidence' | 'danger' | 'success'
  className?: string
  dot?: boolean
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent-strong)] border-[var(--accent-soft-border)]',
  evidence: 'bg-[var(--evidence-soft)] text-[var(--evidence-strong)] border-[var(--evidence-soft-border)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/30',
  success: 'bg-[var(--evidence-soft)] text-[var(--success)] border-[var(--evidence-soft-border)]',
}

const dotTones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-[var(--text-faint)]',
  accent: 'bg-[var(--accent)]',
  evidence: 'bg-[var(--evidence)]',
  danger: 'bg-[var(--danger)]',
  success: 'bg-[var(--success)]',
}

export function Badge({ children, tone = 'neutral', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotTones[tone])} />}
      {children}
    </span>
  )
}
