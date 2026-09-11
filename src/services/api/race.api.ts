import { apiClient, postSSE } from './client'
import type { RaceResults, RaceStreamEvent } from '@/types/api'

export const raceApi = {
  getResults: () => apiClient.get<RaceResults>('/api/race/results'),
  startRace: (onEvent: (event: RaceStreamEvent) => void, signal?: AbortSignal) =>
    postSSE<RaceStreamEvent>('/api/race/start', {}, onEvent, { signal }),
}
