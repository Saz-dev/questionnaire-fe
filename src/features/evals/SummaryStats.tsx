import { CheckCircle2, GitCommitVertical, ListChecks, Scale } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Week6EvalResponse } from '@/types/api'

export function SummaryStats({ data }: { data: Week6EvalResponse }) {
  const passRate = (data.overall_pass_rate * 100).toFixed(0)
  const before = data.agreement_before ? (data.agreement_before.rate * 100).toFixed(0) : null
  const after = data.agreement_after ? (data.agreement_after.rate * 100).toFixed(0) : null

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        icon={<CheckCircle2 className="size-4" />}
        label="Assertion pass rate"
        value={`${passRate}%`}
        sub={`${data.overall_pass_count} / ${data.overall_total} cases`}
      />
      <Stat
        icon={<Scale className="size-4" />}
        label="Assertions vs. judge criteria"
        value={`${data.assertion_names.length} vs ${data.remaining_judge_criteria.length}`}
        sub="rule-checked vs. still LLM-judged"
      />
      <Stat
        icon={<ListChecks className="size-4" />}
        label="Judge agreement"
        value={before && after ? `${before}% → ${after}%` : 'not run yet'}
        sub={
          data.agreement_before && data.agreement_after
            ? `${data.agreement_before.matched}/${data.agreement_before.total} → ${data.agreement_after.matched}/${data.agreement_after.total}`
            : 'run judge.py v1 / v2'
        }
        tone={after && before && after > before ? 'success' : 'neutral'}
      />
      <Stat
        icon={<GitCommitVertical className="size-4" />}
        label="Regression cases"
        value={`${data.regression_cases.length}`}
        sub="verbatim from real failed traces"
      />
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  tone?: 'success' | 'neutral'
}) {
  return (
    <Card className="flex items-start gap-2.5 rounded-none border-none px-3.5 py-3">
      <span className={tone === 'success' ? 'text-[var(--success)]' : 'text-[var(--text-faint)]'}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--text-faint)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--text)]">{value}</p>
        {sub && <p className="truncate text-[10.5px] text-[var(--text-faint)]">{sub}</p>}
      </div>
    </Card>
  )
}
