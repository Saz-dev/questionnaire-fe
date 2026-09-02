import { cn } from '@/utils/cn'
import { useSystemConfig } from '@/features/system/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import type { RetrievalMode } from '@/types/api'

export function ModePicker({ value, onChange }: { value: RetrievalMode; onChange: (mode: RetrievalMode) => void }) {
  const { data, isLoading } = useSystemConfig()

  if (isLoading || !data) return <Skeleton className="h-24" />

  const active = data.retrieval_modes.find((m) => m.id === value)

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {data.retrieval_modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={cn(
              'rounded-sm border px-2 py-1 font-mono text-[11px] transition-colors cursor-pointer',
              value === mode.id
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]',
            )}
          >
            {mode.id}
          </button>
        ))}
      </div>
      {active && <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--text-muted)]">{active.description}</p>}
    </div>
  )
}
