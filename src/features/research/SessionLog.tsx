import { History, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { truncate } from '@/utils/format'
import { useSessionLog } from '@/hooks/useSessionLog'

interface SessionLogProps {
  activeId: string | null
  onSelect: (id: string) => void
}

export function SessionLog({ activeId, onSelect }: SessionLogProps) {
  const entries = useSessionLog((s) => s.entries)
  const clear = useSessionLog((s) => s.clear)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          <History className="size-3" />
          Session log
        </p>
        {entries.length > 0 && (
          <button
            onClick={clear}
            className="text-[var(--text-faint)] transition-colors hover:text-[var(--danger)] cursor-pointer"
            title="Clear session log"
          >
            <Trash2 className="size-3" />
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-[11px] leading-relaxed text-[var(--text-faint)]">
          Questions you ask appear here for this browser session only — the backend keeps no conversation
          memory between turns.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => onSelect(entry.id)}
                className={cn(
                  'block w-full rounded-sm px-2 py-1.5 text-left text-xs transition-colors cursor-pointer',
                  activeId === entry.id
                    ? 'bg-[var(--surface-2)] text-[var(--text)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]/60',
                )}
              >
                <p className="truncate">{truncate(entry.question, 56)}</p>
                <p className="font-mono text-[10px] text-[var(--text-faint)]">
                  {entry.mode} · {entry.result.grounded ? 'grounded' : 'refused'}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
