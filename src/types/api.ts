/**
 * Types mirror the Pydantic models in questionnaire/api.py exactly.
 * Keep both sides in sync manually — there is no shared schema generation.
 */

export type RetrievalMode =
  | 'semantic'
  | 'hybrid'
  | 'rerank'
  | 'hybrid_rerank'
  | 'mmr'
  | 'hybrid_mmr'
  | 'rewrite'
  | 'hyde'

export type ModeFamily = 'dense' | 'fusion' | 'rerank' | 'diversity' | 'query-transform'

export interface RetrievalModeInfo {
  id: RetrievalMode
  label: string
  family: ModeFamily
  description: string
}

export interface PipelineStage {
  id: string
  label: string
}

export interface ChunkHit {
  text: string
  source: string
  chunk_id: string | null
  score: number | null
  cosine: number | null
  retrieval_score: number | null
  mmr_score: number | null
}

export interface RetrievalMeta {
  mode: string
  candidate_pool: ChunkHit[] | null
  rewritten: string | null
  hypothetical: string | null
}

export interface RetrieveRequest {
  question: string
  mode: RetrievalMode
  top_k: number
  candidates: number
  mmr_lambda: number
}

export interface RetrieveResponse {
  question: string
  mode: string
  hits: ChunkHit[]
  meta: RetrievalMeta
  duration_ms: number
}

export interface QueryRequest {
  question: string
  mode: RetrievalMode
  top_k: number
  mmr_lambda: number
}

export type GenerationMethod = 'llm' | 'fallback_synthesis' | 'refused'

export interface TimingMs {
  retrieval: number
  generation: number
}

export interface QueryResponse {
  question: string
  answer: string
  grounded: boolean
  evidence: ChunkHit[]
  meta: RetrievalMeta
  best_score: number
  min_score: number
  timing_ms: TimingMs
  generation_method: GenerationMethod
  prompt: string | null
}

/** One event from POST /api/query/stream (Server-Sent Events). */
export type QueryStreamEvent =
  | {
      event: 'retrieved'
      hits: ChunkHit[]
      meta: RetrievalMeta
      best_score: number
      min_score: number
      duration_ms: number
    }
  | {
      event: 'answer'
      answer: string
      grounded: boolean
      generation_method: GenerationMethod
      prompt: string | null
      duration_ms: number
    }

export type DocumentStatus = 'indexed' | 'pending_reindex' | 'not_indexed'

export interface DocumentInfo {
  filename: string
  size_bytes: number
  modified_at: string
  chunk_count: number
  status: DocumentStatus
}

export interface DocumentsResponse {
  documents: DocumentInfo[]
  total_documents: number
  total_chunks: number
  index_in_sync: boolean
}

export interface RebuildStage {
  stage: string
  duration_ms: number
  detail: Record<string, unknown>
}

export interface RebuildResponse {
  stages: RebuildStage[]
  document_count: number
  chunk_count: number
}

export interface DeleteResponse {
  deleted: string
  rebuild: RebuildResponse
}

/** One event from POST /api/documents/upload (Server-Sent Events). */
export interface UploadStageEvent {
  stage: 'upload' | 'parse' | 'chunk' | 'embed' | 'index' | 'ready'
  status: 'done'
  duration_ms?: number
  detail: Record<string, unknown>
}

export interface SystemHealth {
  status: 'ok'
  index: {
    status: 'ready' | 'stale'
    document_count: number
    chunk_count: number
  }
  models: {
    embedding_model: string
    embedding_loaded: boolean
    reranker_model: string
    reranker_loaded: boolean
  }
  llm_configured: boolean
}

export interface SystemConfig {
  retrieval_modes: RetrievalModeInfo[]
  pipeline_stages: PipelineStage[]
  defaults: {
    top_k: number
    candidates: number
    mmr_lambda: number
    min_score: number
  }
  chunking: {
    chunk_size: number
    overlap: number
  }
  models: {
    embedding: string
    reranker: string
    llm: string | null
  }
  bm25: {
    k1: number
    b: number
  }
  rrf_k: number
  prompt_version: string
}

/** Structured error shape this frontend normalizes every failure into. */
export interface ApiErrorShape {
  status: number | null
  message: string
  detail?: unknown
}
