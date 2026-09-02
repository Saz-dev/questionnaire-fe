import { useState } from 'react'
import { ExternalLink, FileText, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatBytes, formatRelativeTime } from '@/utils/format'
import { documentsApi } from '@/services/api/documents.api'
import { useDeleteDocument, useDocuments } from './hooks'
import type { DocumentInfo, DocumentStatus } from '@/types/api'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'

const STATUS_LABEL: Record<DocumentStatus, { label: string; tone: 'success' | 'accent' | 'neutral' }> = {
  indexed: { label: 'Indexed', tone: 'success' },
  pending_reindex: { label: 'Pending reindex', tone: 'accent' },
  not_indexed: { label: 'Not indexed', tone: 'neutral' },
}

export function DocumentTable() {
  const { data, isLoading, error, refetch } = useDocuments()
  const deleteDoc = useDeleteDocument()
  const [pendingDelete, setPendingDelete] = useState<DocumentInfo | null>(null)

  if (isLoading) return <Skeleton className="h-56" />
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!data || data.documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="size-6" />}
        title="No documents yet."
        description="Your knowledge base is empty. Drop a PDF above to build the first index."
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-sm border border-[var(--border)]">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-left text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
              <th className="px-3.5 py-2 font-medium">Document</th>
              <th className="px-3.5 py-2 font-medium">Chunks</th>
              <th className="px-3.5 py-2 font-medium">Size</th>
              <th className="px-3.5 py-2 font-medium">Modified</th>
              <th className="px-3.5 py-2 font-medium">Status</th>
              <th className="px-3.5 py-2" />
            </tr>
          </thead>
          <tbody>
            {data.documents.map((doc) => {
              const status = STATUS_LABEL[doc.status]
              return (
                <tr key={doc.filename} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]/40">
                  <td className="max-w-[220px] truncate px-3.5 py-2.5 font-medium text-[var(--text)]" title={doc.filename}>
                    {doc.filename}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-xs text-[var(--text-muted)]">{doc.chunk_count}</td>
                  <td className="px-3.5 py-2.5 font-mono text-xs text-[var(--text-muted)]">{formatBytes(doc.size_bytes)}</td>
                  <td className="px-3.5 py-2.5 font-mono text-xs text-[var(--text-muted)]">
                    {formatRelativeTime(doc.modified_at)}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <Badge tone={status.tone} dot>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={documentsApi.fileUrl(doc.filename)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex size-7 items-center justify-center rounded-sm text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                        title="Open document"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <button
                        onClick={() => setPendingDelete(doc)}
                        className="flex size-7 items-center justify-center rounded-sm text-[var(--text-faint)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                        title="Delete document"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete ${pendingDelete?.filename}?`}
        description="This removes the file and rebuilds the index from the remaining documents. This cannot be undone."
        confirmLabel="Delete & reindex"
        danger
        loading={deleteDoc.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteDoc.mutate(pendingDelete.filename, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </>
  )
}
