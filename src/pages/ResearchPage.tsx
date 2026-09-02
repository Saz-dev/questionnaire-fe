import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { QuestionForm } from '@/features/research/QuestionForm'
import { PipelineTrace } from '@/features/research/PipelineTrace'
import { AnswerPanel } from '@/features/research/AnswerPanel'
import { EvidencePanel } from '@/features/research/EvidencePanel'
import { SessionLog } from '@/features/research/SessionLog'
import { KnowledgeSummary } from '@/features/research/KnowledgeSummary'
import { useResearchQuery } from '@/features/research/hooks'
import { useSessionLog } from '@/hooks/useSessionLog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs } from '@/components/ui/Tabs'
import type { QueryRequest } from '@/types/api'

const INITIAL: QueryRequest = { question: '', mode: 'rerank', top_k: 3, mmr_lambda: 0.7 }

type MobileTab = 'ask' | 'evidence' | 'log'

export function ResearchPage() {
  const [params, setParams] = useState<QueryRequest>(INITIAL)
  const { state, run, reset } = useResearchQuery()
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>('ask')

  const entries = useSessionLog((s) => s.entries)
  const activeId = useSessionLog((s) => s.activeId)
  const setActive = useSessionLog((s) => s.setActive)

  const viewingHistory = state.phase === 'idle' && activeId !== null
  const historyEntry = viewingHistory ? entries.find((e) => e.id === activeId) ?? null : null

  const submit = () => {
    if (!params.question.trim()) return
    reset()
    setHighlightedIndex(null)
    useSessionLog.setState({ activeId: null })
    run(params)
    setMobileTab('ask')
  }

  const displayHits = historyEntry ? historyEntry.result.evidence : state.hits
  const showAnswer = historyEntry !== null || state.phase !== 'idle'

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left rail: knowledge base + session log */}
      <aside className="hidden w-[260px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[var(--border)] p-4 lg:flex">
        <KnowledgeSummary />
        <SessionLog activeId={activeId} onSelect={setActive} />
      </aside>

      <div className="shrink-0 lg:hidden">
        <Tabs
          tabs={[
            { id: 'ask', label: 'Research' },
            { id: 'evidence', label: 'Evidence' },
            { id: 'log', label: 'Log' },
          ]}
          active={mobileTab}
          onChange={setMobileTab}
          className="px-3"
        />
      </div>

      {/* Center: question + trace + answer */}
      <div
        className={`min-h-0 flex-1 overflow-y-auto p-4 ${mobileTab === 'ask' ? 'block' : 'hidden'} lg:block`}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <QuestionForm params={params} onChange={setParams} onSubmit={submit} busy={state.phase === 'retrieving' || state.phase === 'generating'} />

          {(state.phase !== 'idle' || historyEntry) && (
            <PipelineTrace
              phase={historyEntry ? 'done' : state.phase}
              retrievalMs={historyEntry ? historyEntry.result.timing_ms.retrieval : state.retrievalMs}
              generationMs={historyEntry ? historyEntry.result.timing_ms.generation : state.generationMs}
            />
          )}

          {!showAnswer && (
            <EmptyState
              icon={<FlaskConical className="size-6" />}
              title="Ask your first question."
              description="Every answer is grounded in retrieved chunks from your indexed documents — you'll see exactly which ones, and why."
            />
          )}

          {historyEntry ? (
            <AnswerPanel
              phase="done"
              question={historyEntry.question}
              answer={historyEntry.result.answer}
              grounded={historyEntry.result.grounded}
              generationMethod={historyEntry.result.generation_method}
              prompt={historyEntry.result.prompt}
              bestScore={historyEntry.result.best_score}
              minScore={historyEntry.result.min_score}
              hits={historyEntry.result.evidence}
              error={null}
              onRetry={() => {}}
              onCiteClick={(i) => {
                setHighlightedIndex(i)
                setMobileTab('evidence')
              }}
            />
          ) : (
            state.phase !== 'idle' && (
              <AnswerPanel
                phase={state.phase}
                question={state.question}
                answer={state.answer}
                grounded={state.grounded}
                generationMethod={state.generationMethod}
                prompt={state.prompt}
                bestScore={state.bestScore}
                minScore={state.minScore}
                hits={state.hits}
                error={state.error}
                onRetry={submit}
                onCiteClick={(i) => {
                  setHighlightedIndex(i)
                  setMobileTab('evidence')
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Right rail: evidence */}
      <aside
        className={`w-full overflow-y-auto border-t border-[var(--border)] p-4 lg:block lg:w-[340px] lg:shrink-0 lg:border-l lg:border-t-0 ${mobileTab === 'evidence' ? 'block' : 'hidden'} lg:block`}
      >
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Evidence</p>
        <EvidencePanel hits={displayHits} highlightedIndex={highlightedIndex} />
      </aside>

      {/* Mobile-only log tab */}
      <div className={`overflow-y-auto border-t border-[var(--border)] p-4 lg:hidden ${mobileTab === 'log' ? 'block' : 'hidden'}`}>
        <SessionLog activeId={activeId} onSelect={(id) => { setActive(id); setMobileTab('ask') }} />
      </div>
    </div>
  )
}
