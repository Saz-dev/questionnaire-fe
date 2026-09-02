import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatMs } from '@/utils/format'
import { useSystemConfig } from '@/features/system/hooks'
import type { ResearchPhase } from './hooks'

const RETRIEVAL_STAGE_IDS = new Set(['query', 'embedding', 'retrieval', 'ranking'])

interface PipelineTraceProps {
  phase: ResearchPhase
  retrievalMs: number | null
  generationMs: number | null
}

export function PipelineTrace({ phase, retrievalMs, generationMs }: PipelineTraceProps) {
  const { data } = useSystemConfig()
  const stages = data?.pipeline_stages ?? []

  const stageStatus = (id: string): 'pending' | 'active' | 'done' => {
    const isRetrievalStage = RETRIEVAL_STAGE_IDS.has(id)
    if (isRetrievalStage) {
      if (phase === 'retrieving') return 'active'
      if (retrievalMs !== null) return 'done'
      return 'pending'
    }
    if (phase === 'generating') return 'active'
    if (generationMs !== null) return 'done'
    return 'pending'
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5">
      <div className="flex min-w-max items-center gap-1">
        {stages.map((stage, i) => {
          const status = stageStatus(stage.id)
          return (
            <Fragment key={stage.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    status === 'done' && 'bg-[var(--accent)]',
                    status === 'active' && 'bg-[var(--accent)] animate-pulse-soft',
                    status === 'pending' && 'bg-[var(--border-strong)]',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-[11px] uppercase tracking-wide',
                    status === 'pending' ? 'text-[var(--text-faint)]' : 'text-[var(--text)]',
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {i < stages.length - 1 && <ArrowRight className="size-3 shrink-0 text-[var(--border-strong)]" />}
            </Fragment>
          )
        })}
      </div>
      {(retrievalMs !== null || generationMs !== null) && (
        <div className="mt-2 flex gap-4 border-t border-[var(--border)] pt-2 font-mono text-[11px] text-[var(--text-muted)]">
          {retrievalMs !== null && (
            <span>
              retrieval <span className="text-[var(--text)]">{formatMs(retrievalMs)}</span>
            </span>
          )}
          {generationMs !== null && (
            <span>
              generation <span className="text-[var(--text)]">{formatMs(generationMs)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
