import { CheckCircle2, CircleDashed, Database, Server } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useSystemHealth } from './hooks'

export function HealthPanel() {
  const { data, isLoading, error, refetch } = useSystemHealth()

  if (isLoading) return <Skeleton className="h-48" />
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!data) return null

  return (
    <Card>
      <CardHeader title="Runtime health" meta="/api/system/health" />
      <div className="grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Database className="size-4" />}
          label="Vector index"
          value={data.index.status === 'ready' ? 'Ready' : 'Stale'}
          tone={data.index.status === 'ready' ? 'success' : 'accent'}
        />
        <Stat
          icon={<Server className="size-4" />}
          label="Documents / Chunks"
          value={`${data.index.document_count} / ${data.index.chunk_count}`}
        />
        <Stat
          icon={data.models.embedding_loaded ? <CheckCircle2 className="size-4" /> : <CircleDashed className="size-4" />}
          label="Embedding model"
          value={data.models.embedding_loaded ? 'Loaded' : 'Not loaded yet'}
          sub={data.models.embedding_model}
          tone={data.models.embedding_loaded ? 'success' : 'neutral'}
        />
        <Stat
          icon={data.models.reranker_loaded ? <CheckCircle2 className="size-4" /> : <CircleDashed className="size-4" />}
          label="Reranker model"
          value={data.models.reranker_loaded ? 'Loaded' : 'Not loaded yet'}
          sub={data.models.reranker_model}
          tone={data.models.reranker_loaded ? 'success' : 'neutral'}
        />
      </div>
      <div className="border-t border-[var(--border)] px-3.5 py-2.5">
        <Badge tone={data.llm_configured ? 'evidence' : 'danger'} dot>
          {data.llm_configured ? 'LLM generation configured (Groq)' : 'No LLM key — context-only fallback answers'}
        </Badge>
      </div>
    </Card>
  )
}

function Stat({
  icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  tone?: 'success' | 'accent' | 'neutral'
}) {
  const color =
    tone === 'success' ? 'text-[var(--success)]' : tone === 'accent' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'
  return (
    <div className="flex items-start gap-2.5 bg-[var(--surface)] px-3.5 py-3">
      <span className={color}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--text-faint)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--text)]">{value}</p>
        {sub && <p className="truncate font-mono text-[10.5px] text-[var(--text-faint)]">{sub}</p>}
      </div>
    </div>
  )
}
