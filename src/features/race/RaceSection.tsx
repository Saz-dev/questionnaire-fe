import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useRaceResults } from './hooks'
import { raceApi } from '@/services/api/race.api'
import type { RaceStreamEvent } from '@/types/api'

export function RaceSection() {
  const { data: results, refetch, isLoading } = useRaceResults()
  const [logLines, setLogLines] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [finalResults, setFinalResults] = useState<any>(null)
  const abortRef = useRef<AbortController | null>(null)

  const summary = useMemo(() => results?.summaries ?? [], [results])

  const handleStart = () => {
    setLogLines([])
    setFinalResults(null)
    setRunning(true)
    const controller = new AbortController()
    abortRef.current = controller

    raceApi.startRace(
      (event: RaceStreamEvent) => {
        if (event.event === 'started') {
          setLogLines((l) => [...l, `▶ ${event.message}`])
        } else if (event.event === 'log') {
          setLogLines((l) => [...l, event.line])
        } else if (event.event === 'finished') {
          setLogLines((l) => [...l, '✓ Race finished'])
          setFinalResults(event.results)
          setRunning(false)
          refetch()
        } else if (event.event === 'error') {
          setLogLines((l) => [...l, `✗ ${event.message}`])
          setRunning(false)
        }
      },
      controller.signal,
    ).catch((e) => {
      setLogLines((l) => [...l, `✗ ${e.message}`])
      setRunning(false)
    })
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-xl font-semibold text-[var(--text)]">Week 7 — Race</h1>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Agent vs fixed workflow over the 10 service tickets. Start a run to stream live progress and see the final pass rate, latency, tokens and cost.
            </p>
          </div>
          <Button onClick={handleStart} disabled={running}>
            {running ? 'Running…' : 'Start Race'}
          </Button>
        </div>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Live Progress</h2>
            <span className="text-xs text-[var(--text-muted)]">{running ? 'Streaming…' : 'Idle'}</span>
          </div>
          <div className="max-h-[420px] overflow-auto rounded-md bg-[var(--surface-1)] p-3 font-mono text-xs leading-relaxed">
            {logLines.length === 0 && <div className="text-[var(--text-muted)]">No output yet. Click Start Race.</div>}
            {logLines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-sm font-medium">Current Results</h2>
            {isLoading ? (
              <div className="text-sm text-[var(--text-muted)]">Loading…</div>
            ) : summary.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)]">No results yet.</div>
            ) : (
              <div className="space-y-3">
                {summary.map((s) => (
                  <div key={s.system} className="rounded-sm border border-[var(--border)] p-3">
                    <div className="text-sm font-medium">{s.system}</div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                      <div>Pass rate: {(s.pass_rate * 100).toFixed(0)}%</div>
                      <div>p50 latency: {s.p50_latency_s.toFixed(3)}s</div>
                      <div>Total tokens: {s.total_tokens.toLocaleString()}</div>
                      <div>Cost/claim: ${s.cost_per_claim.toFixed(6)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {finalResults && (
            <Card>
              <h2 className="mb-3 text-sm font-medium">Final Answer</h2>
              <pre className="max-h-[320px] overflow-auto rounded-md bg-[var(--surface-1)] p-3 text-xs">
                {JSON.stringify(finalResults, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
