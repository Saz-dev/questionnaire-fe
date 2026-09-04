import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { EvalCaseDetail } from '@/types/api'

export function RegressionPanel({ cases }: { cases: EvalCaseDetail[] }) {
  return (
    <Card>
      <CardHeader title="Regression cases" meta="verbatim from real failed traces" />
      <div className="divide-y divide-[var(--border)]">
        {cases.map((c) => (
          <div key={c.id} className="flex flex-col gap-1.5 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--text-faint)]">{c.id}</span>
              <span className="text-xs font-medium text-[var(--text)]">{c.question}</span>
              <Badge tone={c.assertions_passed ? 'success' : 'danger'} dot>
                {c.assertions_passed ? 'PASS' : 'FAIL'}
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">{c.answer}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
