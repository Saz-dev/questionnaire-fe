import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import type { Disagreement } from '@/types/api'

export function DisagreementsPanel({ disagreements }: { disagreements: Disagreement[] }) {
  const [openId, setOpenId] = useState<string | null>(disagreements[0]?.id ?? null)

  if (disagreements.length === 0) return null

  return (
    <Card>
      <CardHeader
        title="Judge vs. hand-label disagreements"
        meta={`${disagreements.length} of 25 · who was actually right`}
      />
      <div className="divide-y divide-[var(--border)]">
        {disagreements.map((d) => {
          const open = openId === d.id
          return (
            <div key={d.id}>
              <button
                onClick={() => setOpenId(open ? null : d.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-[var(--surface-2)]"
              >
                {open ? (
                  <ChevronDown className="size-3.5 shrink-0 text-[var(--text-faint)]" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0 text-[var(--text-faint)]" />
                )}
                <span className="shrink-0 font-mono text-[11px] text-[var(--text-faint)]">{d.id}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-[var(--text)]">{d.question}</span>
                <VerdictBadge label="label" verdict={d.hand_label} />
                <VerdictBadge label="v1" verdict={d.judge_v1_verdict} />
                {d.judge_v2_verdict && <VerdictBadge label="v2" verdict={d.judge_v2_verdict} />}
                <Badge tone={d.resolved_in_v2 ? 'success' : 'danger'} dot>
                  {d.resolved_in_v2 ? 'resolved in v2' : 'still open'}
                </Badge>
              </button>
              {open && (
                <div className="space-y-2 bg-[var(--surface-2)] px-3.5 py-3 pl-9 text-xs">
                  <p>
                    <span className="font-medium text-[var(--text)]">Hand label ({d.hand_label}):</span>{' '}
                    <span className="text-[var(--text-muted)]">{d.hand_label_reason}</span>
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text)]">judge_v1 ({d.judge_v1_verdict}):</span>{' '}
                    <span className="text-[var(--text-muted)]">{d.judge_v1_reason}</span>
                  </p>
                  {d.judge_v2_verdict && (
                    <p>
                      <span className="font-medium text-[var(--text)]">judge_v2 ({d.judge_v2_verdict}):</span>{' '}
                      <span className="text-[var(--text-muted)]">{d.judge_v2_reason}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function VerdictBadge({ label, verdict }: { label: string; verdict: string }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide',
        verdict === 'PASS'
          ? 'border-[var(--evidence-soft-border)] bg-[var(--evidence-soft)] text-[var(--success)]'
          : 'border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]',
      )}
    >
      {label}:{verdict}
    </span>
  )
}
