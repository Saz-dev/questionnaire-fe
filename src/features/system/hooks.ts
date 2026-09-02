import { useQuery } from '@tanstack/react-query'
import { systemApi } from '@/services/api/system.api'

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.health,
    refetchInterval: 15_000,
    retry: 1,
  })
}

export function useSystemConfig() {
  return useQuery({
    queryKey: ['system', 'config'],
    queryFn: systemApi.config,
    staleTime: Infinity,
  })
}
