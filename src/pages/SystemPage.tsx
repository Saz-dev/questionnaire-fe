import { HealthPanel } from '@/features/system/HealthPanel'
import { ConfigPanel } from '@/features/system/ConfigPanel'
import { ModeCatalog } from '@/features/system/ModeCatalog'
import { LimitationsNote } from '@/features/system/LimitationsNote'

export function SystemPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6">
        <div>
          <h1 className="font-serif text-xl font-semibold text-[var(--text)]">System</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Live status and configuration of the RAG pipeline, read directly from the backend.
          </p>
        </div>
        <HealthPanel />
        <ConfigPanel />
        <ModeCatalog />
        <LimitationsNote />
      </div>
    </div>
  )
}
