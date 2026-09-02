import { cn } from '@/utils/cn'
import { formatScore, scoreToPercent } from '@/utils/format'

interface ScoreBarProps {
  score: number | null | undefined
  label?: string
  tone?: 'accent' | 'evidence'
  className?: string
}

/**
 * A visual bar for a similarity/relevance score. Not all retrieval modes
 * produce a 0..1 cosine score (cross-encoder logits and MMR scores are on
 * different scales) — the bar clamps for display, and the raw number is
 * always shown alongside it so nothing is misrepresented as a percentage.
 */
export function ScoreBar({ score, label, tone = 'accent', className }: ScoreBarProps) {
  const pct = scoreToPercent(score)
  const barColor = tone === 'accent' ? 'bg-[var(--accent)]' : 'bg-[var(--evidence)]'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--surface-3)]">
        <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
        {label ?? formatScore(score)}
      </span>
    </div>
  )
}
