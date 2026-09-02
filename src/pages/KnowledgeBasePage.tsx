import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useDocuments, useRebuildIndex } from '@/features/documents/hooks'
import { UploadDropzone } from '@/features/documents/UploadDropzone'
import { DocumentTable } from '@/features/documents/DocumentTable'
import { IngestionStagePanel } from '@/features/documents/IngestionStagePanel'
import { Badge } from '@/components/ui/Badge'

export function KnowledgeBasePage() {
  const { data } = useDocuments()
  const rebuild = useRebuildIndex()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-xl font-semibold text-[var(--text)]">Knowledge Base</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>
                <span className="font-mono font-medium text-[var(--text)]">{data?.total_documents ?? '—'}</span> documents
              </span>
              <span className="text-[var(--text-faint)]">·</span>
              <span>
                <span className="font-mono font-medium text-[var(--text)]">{data?.total_chunks ?? '—'}</span> chunks
              </span>
              {data && !data.index_in_sync && (
                <Badge tone="accent" dot>
                  Index out of sync with documents/
                </Badge>
              )}
            </p>
          </div>
          <Button
            size="sm"
            icon={<RefreshCw className={rebuild.isPending ? 'size-3.5 animate-spin' : 'size-3.5'} />}
            onClick={() => rebuild.mutate()}
            loading={rebuild.isPending}
          >
            Reindex
          </Button>
        </div>

        <UploadDropzone />

        {rebuild.data && !rebuild.isPending && (
          <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Reindex report
            </p>
            <IngestionStagePanel
              stages={rebuild.data.stages.map((s) => ({
                stage: s.stage as 'parse' | 'chunk' | 'embed' | 'index',
                status: 'done',
                duration_ms: s.duration_ms,
                detail: s.detail,
              }))}
            />
          </div>
        )}

        <DocumentTable />
      </div>
    </div>
  )
}
