import { apiClient } from './client'
import type { Week6EvalResponse } from '@/types/api'

export const evalsApi = {
  week6: () => apiClient.get<Week6EvalResponse>('/api/eval/week6'),
}
