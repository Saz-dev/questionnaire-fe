import { Info } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'

const ITEMS = [
  'Stateless per question — the backend has no conversation memory, so the Session Log on the Research page is a local history, not context sent back to the model.',
  'Token-level LLM streaming is not supported by the Groq client call in rag.py — the "Retrieval → Generation" trace streams as two real stage events, not a token stream.',
  'No page numbers — loader.py concatenates a whole PDF into one text blob before chunking, so citations resolve to document + chunk index, not a PDF page.',
  'One flat collection — vectordb.py indexes a single Qdrant collection; there is no multi-collection or per-document namespace to filter by.',
  'No authentication — this API has no auth layer; it is intended for local, single-user use.',
]

export function LimitationsNote() {
  return (
    <Card>
      <CardHeader title="Known limitations" meta="honest, not fabricated" />
      <ul className="space-y-2.5 px-3.5 py-3">
        {ITEMS.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-[var(--text-muted)]">
            <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--text-faint)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
