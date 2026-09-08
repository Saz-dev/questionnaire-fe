import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { evalsApi } from '@/services/api/evals.api'
import type { LabelSubmitRequest } from '@/types/api'

export function useWeek6Eval() {
  return useQuery({
    queryKey: ['evals', 'week6'],
    queryFn: evalsApi.week6,
    staleTime: 60_000,
  })
}

export function useLabelQueue() {
  return useQuery({
    queryKey: ['evals', 'week6', 'label-queue'],
    queryFn: evalsApi.labelQueue,
    staleTime: 0,
  })
}

export function useSubmitLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: LabelSubmitRequest) => evalsApi.submitLabel(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['evals', 'week6'] })
    },
  })
}
