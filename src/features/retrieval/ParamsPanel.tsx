import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { ModePicker } from '@/components/shared/ModePicker'
import type { RetrieveRequest } from '@/types/api'

const CANDIDATE_MODES = new Set(['rerank', 'hybrid_rerank', 'mmr', 'hybrid_mmr'])
const MMR_MODES = new Set(['mmr', 'hybrid_mmr'])

interface ParamsPanelProps {
  params: RetrieveRequest
  onChange: (params: RetrieveRequest) => void
  onSubmit: () => void
  loading: boolean
}

export function ParamsPanel({ params, onChange, onSubmit, loading }: ParamsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Query</label>
        <textarea
          value={params.question}
          onChange={(e) => onChange({ ...params, question: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="What is semantic search?"
          rows={3}
          className="w-full resize-none rounded-sm border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Retrieval mode</label>
        <ModePicker value={params.mode} onChange={(mode) => onChange({ ...params, mode })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Slider
          label="top_k"
          value={params.top_k}
          min={1}
          max={10}
          onChange={(top_k) => onChange({ ...params, top_k })}
          hint="Chunks returned"
        />
        {CANDIDATE_MODES.has(params.mode) && (
          <Slider
            label="candidates"
            value={params.candidates}
            min={5}
            max={100}
            step={5}
            onChange={(candidates) => onChange({ ...params, candidates })}
            hint="Pool size before ranking"
          />
        )}
        {MMR_MODES.has(params.mode) && (
          <Slider
            label="mmr_lambda"
            value={params.mmr_lambda}
            min={0}
            max={1}
            step={0.05}
            format={(v) => v.toFixed(2)}
            onChange={(mmr_lambda) => onChange({ ...params, mmr_lambda })}
            hint="1.0 = relevance, 0.0 = diversity"
          />
        )}
      </div>

      <Button
        variant="primary"
        icon={<Search className="size-3.5" />}
        onClick={onSubmit}
        loading={loading}
        disabled={!params.question.trim()}
      >
        Retrieve
      </Button>
    </div>
  )
}
