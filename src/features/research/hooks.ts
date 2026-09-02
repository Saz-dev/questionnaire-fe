import { useCallback, useRef, useState } from 'react'
import { ragApi } from '@/services/api/rag.api'
import { useSessionLog } from '@/hooks/useSessionLog'
import type { ChunkHit, QueryRequest, QueryResponse, RetrievalMeta } from '@/types/api'

export type ResearchPhase = 'idle' | 'retrieving' | 'generating' | 'done' | 'error'

interface ResearchState {
  phase: ResearchPhase
  question: string | null
  hits: ChunkHit[] | null
  meta: RetrievalMeta | null
  bestScore: number | null
  minScore: number | null
  retrievalMs: number | null
  answer: string | null
  grounded: boolean | null
  generationMethod: QueryResponse['generation_method'] | null
  prompt: string | null
  generationMs: number | null
  error: unknown
}

const INITIAL_STATE: ResearchState = {
  phase: 'idle',
  question: null,
  hits: null,
  meta: null,
  bestScore: null,
  minScore: null,
  retrievalMs: null,
  answer: null,
  grounded: null,
  generationMethod: null,
  prompt: null,
  generationMs: null,
  error: null,
}

interface RetrievedSnapshot {
  question: string
  hits: ChunkHit[]
  meta: RetrievalMeta
  bestScore: number
  minScore: number
  retrievalMs: number
}

export function useResearchQuery() {
  const [state, setState] = useState<ResearchState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)
  // Mirrors the "retrieved" event outside React state so the "answer" event
  // handler can build the session-log entry without reading React state
  // inside a setState updater (updaters must stay pure — React Strict Mode
  // double-invokes them, which turned a zustand call inside one into a
  // "setState during another component's render" warning).
  const retrievedRef = useRef<RetrievedSnapshot | null>(null)
  const addEntry = useSessionLog((s) => s.add)

  const run = useCallback(
    async (req: QueryRequest) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      retrievedRef.current = null

      setState({ ...INITIAL_STATE, phase: 'retrieving', question: req.question })

      try {
        await ragApi.queryStream(
          req,
          (event) => {
            if (event.event === 'retrieved') {
              retrievedRef.current = {
                question: req.question,
                hits: event.hits,
                meta: event.meta,
                bestScore: event.best_score,
                minScore: event.min_score,
                retrievalMs: event.duration_ms,
              }
              setState((prev) => ({
                ...prev,
                phase: 'generating',
                hits: event.hits,
                meta: event.meta,
                bestScore: event.best_score,
                minScore: event.min_score,
                retrievalMs: event.duration_ms,
              }))
            } else if (event.event === 'answer') {
              setState((prev) => ({
                ...prev,
                phase: 'done',
                answer: event.answer,
                grounded: event.grounded,
                generationMethod: event.generation_method,
                prompt: event.prompt,
                generationMs: event.duration_ms,
              }))

              const retrieved = retrievedRef.current
              if (retrieved) {
                addEntry({
                  id: crypto.randomUUID(),
                  question: retrieved.question,
                  mode: req.mode,
                  askedAt: Date.now(),
                  result: {
                    question: retrieved.question,
                    answer: event.answer,
                    grounded: event.grounded,
                    evidence: retrieved.hits,
                    meta: retrieved.meta,
                    best_score: retrieved.bestScore,
                    min_score: retrieved.minScore,
                    timing_ms: { retrieval: retrieved.retrievalMs, generation: event.duration_ms },
                    generation_method: event.generation_method,
                    prompt: event.prompt,
                  },
                })
              }
            }
          },
          controller.signal,
        )
      } catch (error) {
        if (controller.signal.aborted) return
        setState((prev) => ({ ...prev, phase: 'error', error }))
      }
    },
    [addEntry],
  )

  const reset = useCallback(() => setState(INITIAL_STATE), [])

  return { state, run, reset }
}
