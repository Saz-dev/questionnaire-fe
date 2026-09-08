import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useLabelQueue, useSubmitLabel } from '@/features/evals/hooks'
import type { JudgeVerdict, LabelQueueItem } from '@/types/api'

export function LabelQueuePage() {
  const { data, isLoading, error, refetch } = useLabelQueue()
  const submit = useSubmitLabel()

  // null = "no manual navigation yet" -> default to the first not-yet-labeled
  // case, so resuming a session doesn't make you click through ones you
  // already did. Once the user navigates, their choice takes over.
  const [manualIndex, setManualIndex] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [labeler, setLabeler] = useState(() => localStorage.getItem('week6_labeler_name') ?? '')

  const defaultIndex = data ? Math.max(0, data.findIndex((c) => c.existing_verdict === null)) : 0
  const index = manualIndex ?? defaultIndex
  const setIndex = setManualIndex

  if (isLoading) return <PageShell><Skeleton className="h-96" /></PageShell>
  if (error) return <PageShell><ErrorState error={error} onRetry={() => refetch()} /></PageShell>
  if (!data || data.length === 0) return <PageShell><p className="text-sm text-[var(--text-muted)]">No judge-eligible cases found.</p></PageShell>

  const total = data.length
  const labeledCount = data.filter((c) => c.existing_verdict !== null).length
  const allDone = labeledCount === total
  const item = data[index]

  function persistLabeler(name: string) {
    setLabeler(name)
    localStorage.setItem('week6_labeler_name', name)
  }

  function goNext() {
    setReason('')
    setIndex(Math.min(index + 1, total - 1))
  }

  async function vote(verdict: JudgeVerdict, current: LabelQueueItem) {
    if (!reason.trim()) return
    await submit.mutateAsync({ id: current.id, verdict, reason: reason.trim(), labeler: labeler.trim() || 'human reviewer' })
    if (index < total - 1) goNext()
    else refetch()
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-muted)]">
          Read the question, the full retrieved context, and the answer. The judge's verdict is
          never shown here — that's the point. Grade only: does the answer stay strictly within
          what the context supports?
        </p>
        <Badge tone={allDone ? 'success' : 'accent'} dot>
          {labeledCount} / {data.length} labeled
        </Badge>
      </div>

      <input
        value={labeler}
        onChange={(e) => persistLabeler(e.target.value)}
        placeholder="Your name (for the label file's record)"
        className="w-full max-w-xs rounded-sm border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
      />

      {allDone ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <CheckCircle2 className="size-8 text-[var(--success)]" />
          <p className="text-sm font-medium text-[var(--text)]">All 25 cases labeled.</p>
          <p className="max-w-md text-xs text-[var(--text-muted)]">
            Re-run <code className="font-mono">python judge.py v1</code> and{' '}
            <code className="font-mono">python judge.py v2</code> from the terminal now, so the
            agreement numbers on the Evals page are computed fresh against these real labels —
            that also gives the judge_results files a timestamp properly after labels_25.json,
            which is the ordering proof Week 6 asks for.
          </p>
          <Link to="/evals">
            <Button variant="primary" size="sm">Back to Evals</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader
              title={item.id}
              meta={item.existing_verdict ? `already labeled: ${item.existing_verdict} (editable)` : 'not yet labeled'}
              action={
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>
                    Prev
                  </Button>
                  <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={() => setIndex(Math.min(total - 1, index + 1))}>
                    Next
                  </Button>
                </div>
              }
            />
            <div className="space-y-3 px-3.5 py-3">
              <p className="text-sm font-medium text-[var(--text)]">{item.question}</p>

              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  Retrieved context
                </p>
                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-2.5 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
                  {item.context}
                </pre>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  Answer to grade
                </p>
                <p className="whitespace-pre-wrap rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2.5 p-3.5">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="One-sentence reason for your verdict (required)"
                rows={2}
                className="w-full resize-none rounded-sm border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  icon={<ThumbsUp className="size-3.5" />}
                  disabled={!reason.trim() || submit.isPending}
                  loading={submit.isPending}
                  onClick={() => vote('PASS', item)}
                  className="flex-1"
                >
                  PASS
                </Button>
                <Button
                  variant="danger"
                  icon={<ThumbsDown className="size-3.5" />}
                  disabled={!reason.trim() || submit.isPending}
                  loading={submit.isPending}
                  onClick={() => vote('FAIL', item)}
                  className="flex-1"
                >
                  FAIL
                </Button>
              </div>
              {submit.isError && <ErrorState error={submit.error} />}
            </div>
          </Card>
        </>
      )}
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <div>
          <h1 className="font-serif text-xl font-semibold text-[var(--text)]">Human labeling</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Week 6 — grading each answer blind, before the judge's own verdict is ever run against it.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
