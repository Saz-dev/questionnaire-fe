import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useWeek6Eval } from '@/features/evals/hooks'
import { SummaryStats } from '@/features/evals/SummaryStats'
import { HumanJudgePanel } from '@/features/evals/HumanJudgePanel'
import { ModeBreakdownPanel } from '@/features/evals/ModeBreakdownPanel'
import { RegressionPanel } from '@/features/evals/RegressionPanel'
import { DisagreementsPanel } from '@/features/evals/DisagreementsPanel'
import { PredictionPanel } from '@/features/evals/PredictionPanel'
import { CasesTable } from '@/features/evals/CasesTable'

export function EvalsPage() {
  const { data, isLoading, error, refetch } = useWeek6Eval()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6">
        <div>
          <h1 className="font-serif text-xl font-semibold text-[var(--text)]">Evals</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Week 6 — the eval set, deterministic assertions, and the LLM judge validated against
            hand labels before being trusted.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-64" />
          </div>
        )}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}
        {data && (
          <>
            <SummaryStats data={data} />
            <HumanJudgePanel />
            <ModeBreakdownPanel rows={data.mode_breakdown} />
            <RegressionPanel cases={data.regression_cases} />
            <DisagreementsPanel disagreements={data.disagreements} />
            <PredictionPanel prediction={data.prediction} outcome={data.prediction_outcome} />
            <CasesTable cases={data.cases} />
          </>
        )}
      </div>
    </div>
  )
}
