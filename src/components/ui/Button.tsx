import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  icon?: ReactNode
  loading?: boolean
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-strong)] border-transparent',
  secondary:
    'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] border-[var(--border-strong)]',
  ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border-transparent',
  danger: 'bg-transparent text-[var(--danger)] hover:bg-[var(--danger-soft)] border-[var(--danger)]',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm border font-medium tracking-tight transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : icon}
      {children}
    </button>
  )
}
