import { useState } from 'react'
import { ChevronDown, ShieldAlert, ShieldCheck, ShieldOff, Sparkles } from 'lucide-react'
import { MarkdownAnswer } from '@/components/shared/MarkdownAnswer'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/utils/cn'
import type { ChunkHit, GenerationMethod } from '@/types/api'
import type { ResearchPhase } from './hooks'

const METHOD_LABEL: Record<GenerationMethod, { label: string; icon: typeof ShieldCheck; tone: 'success' | 'accent' | 'danger' }> = {
  llm: { label: 'LLM generated', icon: Sparkles, tone: 'success' },
  fallback_synthesis: { label: 'Context-only fallback (no LLM key)', icon: ShieldAlert, tone: 'accent' },
  refused: { label: 'Refused — below groundedness threshold', icon: ShieldOff, tone: 'danger' },
}

interface AnswerPanelProps {
  phase: ResearchPhase
  question: string | null
  answer: string | null
  grounded: boolean | null
  generationMethod: GenerationMethod | null
  prompt: string | null
  bestScore: number | null
  minScore: number | null
  hits: ChunkHit[] | null
  error: unknown
  onRetry: () => void
  onCiteClick: (index: number) => void
}

export function AnswerPanel({
  phase,
  question,
  answer,
  grounded,
  generationMethod,
  prompt,
  bestScore,
  minScore,
  hits,
  error,
  onRetry,
  onCiteClick,
}: AnswerPanelProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  if (phase === 'error') return <ErrorState error={error} onRetry={onRetry} />

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-[var(--text-faint)]">Question</p>
        <p className="font-serif text-lg leading-snug text-[var(--text)]">{question}</p>
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--text-faint)]">Answer</p>
          {generationMethod && (
            <MethodBadge method={generationMethod} bestScore={bestScore} minScore={minScore} />
          )}
        </div>

        {(phase === 'retrieving' || phase === 'generating') && (
          <div className="flex items-center gap-2 py-2 text-sm text-[var(--text-muted)]">
            <span className="flex gap-1">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-[var(--accent)]" style={{ animationDelay: '0ms' }} />
              <span className="size-1.5 animate-pulse-soft rounded-full bg-[var(--accent)]" style={{ animationDelay: '150ms' }} />
              <span className="size-1.5 animate-pulse-soft rounded-full bg-[var(--accent)]" style={{ animationDelay: '300ms' }} />
            </span>
            {phase === 'retrieving' ? 'Searching the knowledge base…' : 'Assembling context and generating an answer…'}
          </div>
        )}

        {answer && <MarkdownAnswer text={answer} />}

        {hits && hits.length > 0 && grounded && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] text-[var(--text-faint)]">Evidence used:</span>
            {hits.map((hit, i) => (
              <button
                key={`${hit.chunk_id}-${i}`}
                onClick={() => onCiteClick(i)}
                title={hit.source}
                className="flex size-5 items-center justify-center rounded-full border border-[var(--evidence-soft-border)] bg-[var(--evidence-soft)] font-mono text-[10px] font-semibold text-[var(--evidence-strong)] transition-transform hover:scale-110 cursor-pointer"
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {prompt && (
          <div className="mt-4">
            <button
              onClick={() => setShowPrompt((v) => !v)}
              className="flex items-center gap-1 font-mono text-[11px] text-[var(--text-faint)] transition-colors hover:text-[var(--text)] cursor-pointer"
            >
              <ChevronDown className={cn('size-3 transition-transform', showPrompt && 'rotate-180')} />
              {showPrompt ? 'Hide exact prompt sent to the LLM' : 'Inspect exact prompt sent to the LLM'}
            </button>
            {showPrompt && (
              <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
                {prompt}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MethodBadge({
  method,
  bestScore,
  minScore,
}: {
  method: GenerationMethod
  bestScore: number | null
  minScore: number | null
}) {
  const { label, icon: Icon, tone } = METHOD_LABEL[method]
  return (
    <Badge tone={tone}>
      <Icon className="size-3" />
      {label}
      {method === 'refused' && bestScore !== null && minScore !== null && (
        <span className="text-[var(--text-faint)]">
          ({bestScore.toFixed(2)} &lt; {minScore.toFixed(2)})
        </span>
      )}
    </Badge>
  )
}
