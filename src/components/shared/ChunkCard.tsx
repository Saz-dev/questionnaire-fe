import { forwardRef, useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatScore, truncate } from '@/utils/format'
import { ScoreBar } from '@/components/ui/ScoreBar'
import { documentsApi } from '@/services/api/documents.api'
import type { ChunkHit } from '@/types/api'

interface ChunkCardProps {
  hit: ChunkHit
  rank: number
  highlighted?: boolean
  tone?: 'accent' | 'evidence'
}

export const ChunkCard = forwardRef<HTMLDivElement, ChunkCardProps>(function ChunkCard(
  { hit, rank, highlighted, tone = 'evidence' },
  ref,
) {
  const [expanded, setExpanded] = useState(false)
  const chunkIndex = hit.chunk_id?.split('::')[1]

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-sm border bg-[var(--surface)] p-3 transition-shadow',
        highlighted
          ? 'border-[var(--accent)] shadow-[0_0_0_2px_var(--accent-soft)]'
          : 'border-[var(--border)]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="font-mono text-[11px] font-semibold text-[var(--text-faint)]">
            {String(rank).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[var(--text)]" title={hit.source}>
              {hit.source}
            </p>
            {chunkIndex !== undefined && (
              <p className="font-mono text-[10.5px] text-[var(--text-faint)]">chunk #{chunkIndex}</p>
            )}
          </div>
        </div>
        <a
          href={documentsApi.fileUrl(hit.source)}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-1 text-[10.5px] text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <ExternalLink className="size-3" />
          Open
        </a>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <ScoreBar score={hit.score} tone={tone} />
        {hit.cosine !== null && hit.cosine !== hit.score && (
          <ScoreTag label="cosine" value={hit.cosine} />
        )}
        {hit.retrieval_score !== null && (
          <ScoreTag label="pre-rerank" value={hit.retrieval_score} />
        )}
        {hit.mmr_score !== null && hit.mmr_score !== hit.score && (
          <ScoreTag label="mmr" value={hit.mmr_score} />
        )}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 block w-full text-left text-xs leading-relaxed text-[var(--text-muted)] cursor-pointer"
      >
        {expanded ? (
          <span className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed">{hit.text}</span>
        ) : (
          truncate(hit.text, 200)
        )}
      </button>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 flex items-center gap-1 text-[10.5px] font-medium text-[var(--text-faint)] transition-colors hover:text-[var(--text)] cursor-pointer"
      >
        <ChevronDown className={cn('size-3 transition-transform', expanded && 'rotate-180')} />
        {expanded ? 'Show less' : 'Show full chunk'}
      </button>
    </div>
  )
})

function ScoreTag({ label, value }: { label: string; value: number }) {
  return (
    <span className="font-mono text-[10.5px] text-[var(--text-faint)]">
      {label} <span className="text-[var(--text-muted)]">{formatScore(value)}</span>
    </span>
  )
}
