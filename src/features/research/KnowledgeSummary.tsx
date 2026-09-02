import { Link } from 'react-router-dom'
import { Database } from 'lucide-react'
import { useSystemHealth } from '@/features/system/hooks'

export function KnowledgeSummary() {
  const { data } = useSystemHealth()

  return (
    <Link
      to="/knowledge-base"
      className="flex items-center justify-between gap-2 rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="flex items-center gap-2">
        <Database className="size-3.5 text-[var(--text-faint)]" />
        <div>
          <p className="text-xs font-medium text-[var(--text)]">
            {data ? `${data.index.document_count} documents` : '—'}
          </p>
          <p className="font-mono text-[10.5px] text-[var(--text-faint)]">
            {data ? `${data.index.chunk_count} chunks indexed` : 'loading…'}
          </p>
        </div>
      </div>
    </Link>
  )
}
