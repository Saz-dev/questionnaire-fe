import { useMutation } from '@tanstack/react-query'
import { retrievalApi } from '@/services/api/retrieval.api'

export function useRetrieveQuery() {
  return useMutation({
    mutationFn: retrievalApi.retrieve,
  })
}
