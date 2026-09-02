import { Card, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useSystemConfig } from './hooks'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3.5 py-2 odd:bg-[var(--surface-2)]/40">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <span className="truncate font-mono text-xs text-[var(--text)]">{value}</span>
    </div>
  )
}

export function ConfigPanel() {
  const { data, isLoading, error, refetch } = useSystemConfig()

  if (isLoading) return <Skeleton className="h-64" />
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!data) return null

  return (
    <Card>
      <CardHeader title="Pipeline configuration" meta="/api/system/config" />
      <div className="grid grid-cols-1 divide-y divide-[var(--border)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="divide-y divide-[var(--border)]">
          <Row label="Embedding model" value={data.models.embedding} />
          <Row label="Reranker model" value={data.models.reranker} />
          <Row label="LLM" value={data.models.llm ?? 'not configured'} />
          <Row label="Prompt version" value={data.prompt_version} />
        </div>
        <div className="divide-y divide-[var(--border)]">
          <Row label="Chunk size / overlap" value={`${data.chunking.chunk_size} chars / ${data.chunking.overlap} chars`} />
          <Row label="Default top_k" value={String(data.defaults.top_k)} />
          <Row label="Default candidate pool" value={String(data.defaults.candidates)} />
          <Row label="Groundedness threshold (min cosine)" value={data.defaults.min_score.toFixed(2)} />
          <Row label="BM25 k1 / b" value={`${data.bm25.k1} / ${data.bm25.b}`} />
          <Row label="RRF k" value={String(data.rrf_k)} />
        </div>
      </div>
    </Card>
  )
}
