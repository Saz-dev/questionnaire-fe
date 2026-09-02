import { create } from 'zustand'
import type { QueryResponse, RetrievalMode } from '@/types/api'

/**
 * Client-side only log of questions asked this session. The backend's
 * RAG.answer() is stateless per call (no conversation memory), so this is
 * a research notebook of past turns, not a multi-turn chat context — past
 * entries are never sent back to the backend as context.
 */
export interface SessionEntry {
  id: string
  question: string
  mode: RetrievalMode
  result: QueryResponse
  askedAt: number
}

interface SessionLogState {
  entries: SessionEntry[]
  activeId: string | null
  add: (entry: SessionEntry) => void
  setActive: (id: string) => void
  clear: () => void
}

export const useSessionLog = create<SessionLogState>((set) => ({
  entries: [],
  activeId: null,
  add: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries].slice(0, 50), activeId: entry.id })),
  setActive: (id) => set({ activeId: id }),
  clear: () => set({ entries: [], activeId: null }),
}))
