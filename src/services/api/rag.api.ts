import { apiClient, postSSE } from './client'
import type { QueryRequest, QueryResponse, QueryStreamEvent } from '@/types/api'

export const ragApi = {
  query: (req: QueryRequest) => apiClient.post<QueryResponse>('/api/query', req),

  queryStream: (req: QueryRequest, onEvent: (event: QueryStreamEvent) => void, signal?: AbortSignal) =>
    postSSE<QueryStreamEvent>('/api/query/stream', req, onEvent, { signal }),
}
