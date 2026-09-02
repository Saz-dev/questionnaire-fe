import { useState } from 'react'
import { ArrowUp, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ModePicker } from '@/components/shared/ModePicker'
import { Slider } from '@/components/ui/Slider'
import { cn } from '@/utils/cn'
import type { QueryRequest } from '@/types/api'

interface QuestionFormProps {
  params: QueryRequest
  onChange: (params: QueryRequest) => void
  onSubmit: () => void
  busy: boolean
}

export function QuestionForm({ params, onChange, onSubmit, busy }: QuestionFormProps) {
  const [showParams, setShowParams] = useState(false)

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)]">
      <textarea
        value={params.question}
        onChange={(e) => onChange({ ...params, question: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (params.question.trim() && !busy) onSubmit()
          }
        }}
        placeholder="Ask a question about the indexed documents…"
        rows={3}
        className="w-full resize-none bg-transparent px-4 py-3 font-serif text-[16px] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
      />
      <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-3 py-2">
        <button
          onClick={() => setShowParams((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[11px] transition-colors cursor-pointer',
            showParams ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
          )}
        >
          <Settings2 className="size-3" />
          {params.mode}
        </button>
        <Button
          variant="primary"
          size="sm"
          icon={<ArrowUp className="size-3.5" />}
          onClick={onSubmit}
          loading={busy}
          disabled={!params.question.trim()}
        >
          Ask
        </Button>
      </div>
      {showParams && (
        <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3">
          <ModePicker value={params.mode} onChange={(mode) => onChange({ ...params, mode })} />
          <div className="grid grid-cols-2 gap-4">
            <Slider label="top_k" value={params.top_k} min={1} max={10} onChange={(top_k) => onChange({ ...params, top_k })} />
            {(params.mode === 'mmr' || params.mode === 'hybrid_mmr') && (
              <Slider
                label="mmr_lambda"
                value={params.mmr_lambda}
                min={0}
                max={1}
                step={0.05}
                format={(v) => v.toFixed(2)}
                onChange={(mmr_lambda) => onChange({ ...params, mmr_lambda })}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
