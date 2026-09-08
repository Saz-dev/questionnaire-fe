import { Link } from 'react-router-dom'
import { UserCheck } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useLabelQueue } from './hooks'

/**
 * The human validation step Week 6 requires: an actual person grades 25
 * answers blind, BEFORE the judge's verdict is ever run against that same
 * label set. Without this, "judge agreement" is meaningless — it would just
 * be one model checking another model's work.
 */
export function HumanJudgePanel() {
  const { data } = useLabelQueue()
  const total = data?.length ?? 25
  const labeled = data?.filter((c) => c.existing_verdict !== null).length ?? 0
  const done = data && labeled === total

  return (
    <Card>
      <CardHeader title="Human judge" meta="the actual validation step — not an LLM grading an LLM" />
      <div className="flex items-center gap-3 px-3.5 py-3">
        <UserCheck className="size-5 shrink-0 text-[var(--accent)]" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--text)]">
            {done
              ? 'All 25 cases labeled by a human reviewer.'
              : `${labeled} / ${total} cases labeled so far. Blind — the judge's verdict is hidden while you grade.`}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">
            Saves to <code className="font-mono">labels_25.json</code> — this is what the agreement
            numbers above are computed against, not an AI-drafted stand-in.
          </p>
        </div>
        <Badge tone={done ? 'success' : 'accent'} dot className="shrink-0">
          {labeled}/{total}
        </Badge>
        <Link to="/evals/label">
          <Button variant="primary" size="sm">
            {labeled === 0 ? 'Start labeling' : done ? 'Review labels' : 'Resume labeling'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
