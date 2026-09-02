import { apiClient } from './client'
import type { SystemConfig, SystemHealth } from '@/types/api'

export const systemApi = {
  health: () => apiClient.get<SystemHealth>('/api/system/health'),
  config: () => apiClient.get<SystemConfig>('/api/system/config'),
}
