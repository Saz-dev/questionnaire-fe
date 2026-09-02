import { useEffect, useRef } from 'react'
import { FileSearch } from 'lucide-react'
import { ChunkCard } from '@/components/shared/ChunkCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ChunkHit } from '@/types/api'

interface EvidencePanelProps {
  hits: ChunkHit[] | null
  highlightedIndex: number | null
}

export function EvidencePanel({ hits, highlightedIndex }: EvidencePanelProps) {
  const refs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    if (highlightedIndex === null) return
    refs.current[highlightedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightedIndex])

  if (!hits) {
    return (
      <EmptyState
        icon={<FileSearch className="size-6" />}
        title="No evidence yet."
        description="Ask a question to see the retrieved chunks that ground the answer."
      />
    )
  }

  if (hits.length === 0) {
    return (
      <EmptyState
        icon={<FileSearch className="size-6" />}
        title="Nothing retrieved above the threshold."
        description="Try rephrasing, or a different retrieval mode on the Retrieval Playground."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {hits.map((hit, i) => (
        <ChunkCard
          key={`${hit.chunk_id}-${i}`}
          ref={(el) => {
            refs.current[i] = el
          }}
          hit={hit}
          rank={i + 1}
          highlighted={highlightedIndex === i}
        />
      ))}
    </div>
  )
}
