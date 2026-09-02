import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatMs } from '@/utils/format'
import type { StageState } from './hooks'

const LABELS: Record<StageState['stage'], string> = {
  upload: 'Upload',
  parse: 'Parse PDF',
  chunk: 'Chunk',
  embed: 'Embed',
  index: 'Index',
  ready: 'Ready',
}

function detailSummary(stage: StageState['stage'], detail?: Record<string, unknown>): string | null {
  if (!detail) return null
  if (stage === 'parse' && typeof detail.documents === 'number') return `${detail.documents} document(s) parsed`
  if (stage === 'chunk' && typeof detail.chunks === 'number') return `${detail.chunks} chunks created`
  if (stage === 'embed' && typeof detail.vectors === 'number') return `${detail.vectors} vectors embedded`
  if (stage === 'index' && typeof detail.chunk_count === 'number') return `${detail.chunk_count} vectors stored`
  if (stage === 'ready' && typeof detail.chunk_count === 'number')
    return `${detail.document_count} document(s), ${detail.chunk_count} chunks`
  return null
}

export function IngestionStagePanel({ stages }: { stages: StageState[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {stages.map((s, i) => (
        <li key={s.stage} className="relative flex gap-3 pb-4 last:pb-0">
          {i < stages.length - 1 && (
            <span
              className={cn(
                'absolute left-[9px] top-5 h-full w-px',
                s.status === 'done' ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
              )}
            />
          )}
          <span
            className={cn(
              'z-10 flex size-[18px] shrink-0 items-center justify-center rounded-full border',
              s.status === 'done' && 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]',
              s.status === 'active' && 'border-[var(--accent)] text-[var(--accent)]',
              s.status === 'pending' && 'border-[var(--border-strong)] text-transparent',
            )}
          >
            {s.status === 'done' && <Check className="size-3" strokeWidth={3} />}
            {s.status === 'active' && <Loader2 className="size-3 animate-spin" />}
          </span>
          <div className="min-w-0 pt-px">
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  s.status === 'pending' ? 'text-[var(--text-faint)]' : 'text-[var(--text)]',
                )}
              >
                {LABELS[s.stage]}
              </span>
              {s.duration_ms !== undefined && (
                <span className="font-mono text-[10.5px] text-[var(--text-faint)]">{formatMs(s.duration_ms)}</span>
              )}
            </div>
            {detailSummary(s.stage, s.detail) && (
              <p className="text-[11px] text-[var(--text-muted)]">{detailSummary(s.stage, s.detail)}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
