import { useCallback, useRef, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useDocumentUpload } from './hooks'
import { IngestionStagePanel } from './IngestionStagePanel'
import { ErrorState } from '@/components/ui/ErrorState'

export function UploadDropzone() {
  const { upload, stages, isUploading, error, reset } = useDocumentUpload()
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      const pdfs = Array.from(fileList).filter((f) => f.name.toLowerCase().endsWith('.pdf'))
      if (pdfs.length === 0) return
      upload(pdfs)
    },
    [upload],
  )

  if (stages) {
    return (
      <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {isUploading ? 'Ingesting…' : 'Ingestion complete'}
          </p>
          {!isUploading && (
            <Button size="sm" variant="ghost" icon={<X className="size-3.5" />} onClick={reset}>
              Close
            </Button>
          )}
        </div>
        <IngestionStagePanel stages={stages} />
        {error !== null && <ErrorState error={error} onRetry={reset} className="mt-3" />}
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed px-6 py-8 text-center transition-colors',
        dragOver
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
          : 'border-[var(--border-strong)] hover:border-[var(--text-faint)]',
      )}
    >
      <UploadCloud className="size-5 text-[var(--text-faint)]" />
      <p className="text-sm font-medium text-[var(--text)]">Drop PDFs here or click to add documents</p>
      <p className="text-xs text-[var(--text-muted)]">
        Adding a document re-embeds the whole knowledge base (the backend fingerprints the entire folder).
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </label>
  )
}
