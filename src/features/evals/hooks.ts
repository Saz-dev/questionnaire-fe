import { useQuery } from '@tanstack/react-query'
import { evalsApi } from '@/services/api/evals.api'

export function useWeek6Eval() {
  return useQuery({
    queryKey: ['evals', 'week6'],
    queryFn: evalsApi.week6,
    staleTime: 60_000,
  })
}
