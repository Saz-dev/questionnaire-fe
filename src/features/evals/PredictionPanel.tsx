import { Card, CardHeader } from '@/components/ui/Card'

export function PredictionPanel({
  prediction,
  outcome,
}: {
  prediction: string | null
  outcome: string | null
}) {
  if (!prediction && !outcome) return null
  return (
    <Card>
      <CardHeader title="Prediction, written before iterating" meta="prediction.txt" />
      {prediction && (
        <pre className="whitespace-pre-wrap px-3.5 py-3 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
          {prediction}
        </pre>
      )}
      {outcome && (
        <div className="border-t border-[var(--border)] px-3.5 py-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Scored against the outcome
          </p>
          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
            {outcome}
          </pre>
        </div>
      )}
    </Card>
  )
}
