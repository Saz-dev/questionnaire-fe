import { useQuery } from '@tanstack/react-query'
import { raceApi } from '@/services/api/race.api'

export function useRaceResults() {
  return useQuery({
    queryKey: ['race', 'results'],
    queryFn: raceApi.getResults,
    staleTime: 60_000,
  })
}
