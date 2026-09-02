import { useMemo, useState } from 'react'
import { Layers, SearchX } from 'lucide-react'
import { ChunkCard } from '@/components/shared/ChunkCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Slider } from '@/components/ui/Slider'
import { Badge } from '@/components/ui/Badge'
import { formatMs } from '@/utils/format'
import type { RetrieveResponse } from '@/types/api'

function primaryValue(hit: { cosine: number | null; score: number | null }): number {
  return hit.cosine ?? hit.score ?? 0
}

export function ResultsPanel({ result }: { result: RetrieveResponse }) {
  const [minScore, setMinScore] = useState(0)
  const [showPool, setShowPool] = useState(false)

  const filtered = useMemo(
    () => result.hits.filter((h) => primaryValue(h) >= minScore),
    [result.hits, minScore],
  )

  const pool = result.meta.candidate_pool
  const finalIds = new Set(result.hits.map((h) => h.chunk_id))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span>
            <span className="font-mono font-medium text-[var(--text)]">{result.hits.length}</span> results
          </span>
          <span className="text-[var(--text-faint)]">·</span>
          <span className="font-mono">{formatMs(result.duration_ms)}</span>
          {pool && pool.length > 0 && (
            <>
              <span className="text-[var(--text-faint)]">·</span>
              <span className="font-mono">{pool.length} candidates considered</span>
            </>
          )}
        </div>
        {pool && pool.length > 0 && (
          <button
            onClick={() => setShowPool((v) => !v)}
            className="flex items-center gap-1 rounded-sm border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] cursor-pointer"
          >
            <Layers className="size-3" />
            {showPool ? 'Hide candidate pool' : 'Show candidate pool'}
          </button>
        )}
      </div>

      {result.meta.rewritten && (
        <div className="rounded-sm border border-[var(--accent-soft-border)] bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--accent-strong)]">
          <span className="font-mono text-[10.5px] uppercase tracking-wide">Rewritten query</span>
          <p className="mt-0.5 text-[var(--text)]">{result.meta.rewritten}</p>
        </div>
      )}
      {result.meta.hypothetical && (
        <div className="rounded-sm border border-[var(--accent-soft-border)] bg-[var(--accent-soft)] px-3 py-2 text-xs">
          <span className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--accent-strong)]">
            HyDE hypothetical passage (embedded instead of the question)
          </span>
          <p className="mt-0.5 text-[var(--text)]">{result.meta.hypothetical}</p>
        </div>
      )}

      <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5">
        <Slider
          label="Min similarity filter (display only)"
          value={minScore}
          min={0}
          max={1}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={setMinScore}
        />
      </div>

      {showPool && pool && (
        <div className="rounded-sm border border-[var(--border)] bg-[var(--surface-2)]/50 p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Full candidate pool ({pool.length}) — highlighted rows made the final top {result.hits.length}
          </p>
          <div className="flex flex-col gap-1.5">
            {pool.map((hit, i) => (
              <div
                key={`${hit.chunk_id}-${i}`}
                className={
                  finalIds.has(hit.chunk_id)
                    ? 'rounded-sm border border-[var(--accent-soft-border)] bg-[var(--accent-soft)] px-2 py-1'
                    : 'rounded-sm border border-transparent px-2 py-1 opacity-60'
                }
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="truncate text-[var(--text-muted)]">
                    {String(i + 1).padStart(2, '0')}. {hit.source}
                  </span>
                  <span className="shrink-0 text-[var(--text-faint)]">{hit.score?.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-6" />}
          title="No retrieval results above this threshold."
          description="Try a broader question, a different mode, or lower the similarity filter."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((hit, i) => (
            <ChunkCard key={`${hit.chunk_id}-${i}`} hit={hit} rank={i + 1} tone="accent" />
          ))}
        </div>
      )}
      {filtered.length !== result.hits.length && (
        <p className="text-center text-[11px] text-[var(--text-faint)]">
          <Badge tone="neutral">{result.hits.length - filtered.length} hidden below threshold</Badge>
        </p>
      )}
    </div>
  )
}
