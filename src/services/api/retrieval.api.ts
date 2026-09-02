import { apiClient } from './client'
import type { RetrieveRequest, RetrieveResponse } from '@/types/api'

export const retrievalApi = {
  retrieve: (req: RetrieveRequest) => apiClient.post<RetrieveResponse>('/api/retrieve', req),
}
