import { apiClient } from './client'
import type { LabelQueueItem, LabelSubmitRequest, LabelSubmitResponse, Week6EvalResponse } from '@/types/api'

export const evalsApi = {
  week6: () => apiClient.get<Week6EvalResponse>('/api/eval/week6'),
  labelQueue: () => apiClient.get<LabelQueueItem[]>('/api/eval/week6/label-queue'),
  submitLabel: (body: LabelSubmitRequest) =>
    apiClient.post<LabelSubmitResponse>('/api/eval/week6/labels', body),
}
