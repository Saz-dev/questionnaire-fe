import { Card, CardHeader } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import type { ModeBreakdownRow } from '@/types/api'

const MODE_LABELS: Record<string, string> = {
  clean: 'Clean (no known issue)',
  'model-conflation': 'Model conflation',
  'fails-to-use-info': 'Fails to use available info',
  'citation-evidence-mismatch': 'Citation / evidence mismatch',
  'appropriate-abstention': 'Appropriate abstention',
  'unsupported-diagnosis': 'Unsupported diagnosis',
}

export function ModeBreakdownPanel({ rows }: { rows: ModeBreakdownRow[] }) {
  return (
    <Card>
      <CardHeader
        title="Assertion pass rate by failure mode"
        meta="assertions.py · one command, per Week 5 taxonomy"
      />
      <div className="divide-y divide-[var(--border)]">
        {rows.map((row) => (
          <div key={row.mode} className="flex items-center gap-3 px-3.5 py-2.5">
            <div className="w-52 shrink-0 truncate text-xs text-[var(--text)]">
              {MODE_LABELS[row.mode] ?? row.mode}
            </div>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
              <div
                className={cn('h-full rounded-full', row.rate >= 0.5 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]')}
                style={{ width: `${row.rate * 100}%` }}
              />
            </div>
            <div className="w-20 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
              {row.pass_count}/{row.total}
            </div>
            <div className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--text-faint)]">
              {(row.rate * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
