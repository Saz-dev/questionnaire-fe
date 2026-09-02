import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from './Button'
import { ApiError } from '@/services/api/client'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  className?: string
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const isOffline = error instanceof ApiError && error.status === null
  const message = error instanceof Error ? error.message : 'Something went wrong.'

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-sm border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-6 py-8 text-center ${className ?? ''}`}
    >
      {isOffline ? (
        <WifiOff className="size-5 text-[var(--danger)]" />
      ) : (
        <AlertTriangle className="size-5 text-[var(--danger)]" />
      )}
      <p className="max-w-sm text-sm text-[var(--text)]">{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" icon={<RefreshCw className="size-3.5" />} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
