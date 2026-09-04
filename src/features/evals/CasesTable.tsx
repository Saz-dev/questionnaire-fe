import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import type { EvalCaseDetail, FailureModeTag } from '@/types/api'

const ALL: FailureModeTag | 'all' = 'all'

export function CasesTable({ cases }: { cases: EvalCaseDetail[] }) {
  const [filter, setFilter] = useState<FailureModeTag | 'all'>(ALL)
  const [openId, setOpenId] = useState<string | null>(null)

  const modes = useMemo(() => {
    const set = new Set(cases.map((c) => c.failure_mode_tag))
    return Array.from(set).sort()
  }, [cases])

  const visible = filter === 'all' ? cases : cases.filter((c) => c.failure_mode_tag === filter)

  return (
    <Card>
      <CardHeader
        title="All eval cases"
        meta={`${visible.length} / ${cases.length}`}
        action={
          <div className="flex flex-wrap items-center gap-1">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              all
            </FilterChip>
            {modes.map((m) => (
              <FilterChip key={m} active={filter === m} onClick={() => setFilter(m)}>
                {m}
              </FilterChip>
            ))}
          </div>
        }
      />
      <div className="divide-y divide-[var(--border)]">
        {visible.map((c) => {
          const open = openId === c.id
          return (
            <div key={c.id}>
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--surface-2)]"
              >
                {open ? (
                  <ChevronDown className="size-3.5 shrink-0 text-[var(--text-faint)]" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0 text-[var(--text-faint)]" />
                )}
                <span className="shrink-0 font-mono text-[11px] text-[var(--text-faint)]">{c.id}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-[var(--text)]">{c.question}</span>
                {c.regression_case && (
                  <Badge tone="accent" className="shrink-0">
                    regression
                  </Badge>
                )}
                <Badge tone="neutral" className="hidden shrink-0 sm:inline-flex">
                  {c.failure_mode_tag}
                </Badge>
                <Badge tone={c.assertions_passed ? 'success' : 'danger'} dot className="shrink-0">
                  {c.assertions_passed ? 'pass' : 'fail'}
                </Badge>
              </button>
              {open && (
                <div className="space-y-2.5 bg-[var(--surface-2)] px-3.5 py-3 pl-9 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(c.assertions).map(([name, value]) => (
                      <span
                        key={name}
                        className={cn(
                          'rounded-sm border px-1.5 py-0.5 font-mono text-[10px]',
                          value === true &&
                            'border-[var(--evidence-soft-border)] bg-[var(--evidence-soft)] text-[var(--success)]',
                          value === false && 'border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]',
                          value === null && 'border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-faint)]',
                        )}
                      >
                        {name}: {value === null ? 'n/a' : value ? 'pass' : 'fail'}
                      </span>
                    ))}
                  </div>
                  {(c.hand_label || c.judge_v1_verdict) && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.hand_label && (
                        <span className="font-mono text-[10.5px] text-[var(--text-faint)]">
                          hand label: <span className="text-[var(--text-muted)]">{c.hand_label}</span>
                        </span>
                      )}
                      {c.judge_v1_verdict && (
                        <span className="font-mono text-[10.5px] text-[var(--text-faint)]">
                          judge v1: <span className="text-[var(--text-muted)]">{c.judge_v1_verdict}</span>
                        </span>
                      )}
                      {c.judge_v2_verdict && (
                        <span className="font-mono text-[10.5px] text-[var(--text-faint)]">
                          judge v2: <span className="text-[var(--text-muted)]">{c.judge_v2_verdict}</span>
                        </span>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-[var(--text-muted)]">{c.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide transition-colors',
        active
          ? 'border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-strong)]'
          : 'border-[var(--border)] text-[var(--text-faint)] hover:text-[var(--text-muted)]',
      )}
    >
      {children}
    </button>
  )
}
