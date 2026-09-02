import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSystemConfig } from './hooks'

export function ModeCatalog() {
  const { data, isLoading } = useSystemConfig()

  if (isLoading) return <Skeleton className="h-64" />
  if (!data) return null

  return (
    <Card>
      <CardHeader title="Retrieval mode catalog" meta={`${data.retrieval_modes.length} strategies`} />
      <ul className="divide-y divide-[var(--border)]">
        {data.retrieval_modes.map((mode) => (
          <li key={mode.id} className="flex flex-col gap-1 px-3.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <div className="flex shrink-0 items-center gap-2 sm:w-44">
              <Badge tone="accent">{mode.id}</Badge>
              <span className="text-xs font-medium text-[var(--text)]">{mode.label}</span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">{mode.description}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
