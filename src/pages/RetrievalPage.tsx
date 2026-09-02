import { useState } from 'react'
import { Search } from 'lucide-react'
import { ParamsPanel } from '@/features/retrieval/ParamsPanel'
import { ResultsPanel } from '@/features/retrieval/ResultsPanel'
import { useRetrieveQuery } from '@/features/retrieval/hooks'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import type { RetrieveRequest } from '@/types/api'

const INITIAL: RetrieveRequest = {
  question: '',
  mode: 'semantic',
  top_k: 5,
  candidates: 50,
  mmr_lambda: 0.7,
}

export function RetrievalPage() {
  const [params, setParams] = useState<RetrieveRequest>(INITIAL)
  const retrieve = useRetrieveQuery()

  return (
    <div className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <div className="border-b border-[var(--border)] p-4 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <h1 className="font-serif text-lg font-semibold text-[var(--text)]">Retrieval Playground</h1>
        <p className="mb-4 mt-1 text-xs text-[var(--text-muted)]">
          Retrieval only — no generation. Inspect exactly what each search strategy surfaces.
        </p>
        <ParamsPanel
          params={params}
          onChange={setParams}
          onSubmit={() => retrieve.mutate(params)}
          loading={retrieve.isPending}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {retrieve.isPending && (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-16" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        )}
        {retrieve.isError && <ErrorState error={retrieve.error} onRetry={() => retrieve.mutate(params)} />}
        {!retrieve.isPending && !retrieve.isError && retrieve.data && <ResultsPanel result={retrieve.data} />}
        {!retrieve.isPending && !retrieve.data && !retrieve.isError && (
          <EmptyState
            icon={<Search className="size-6" />}
            title="Run a query to inspect retrieval."
            description="Try a question about the indexed documents, then compare modes to see how ranking changes."
          />
        )}
      </div>
    </div>
  )
}
