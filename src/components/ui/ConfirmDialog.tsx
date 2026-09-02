import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        ref={ref}
        className="w-full max-w-sm rounded-sm border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 shadow-xl animate-fade-in"
      >
        <h2 className="text-sm font-semibold text-[var(--text)]">{title}</h2>
        {description && <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button size="sm" variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
