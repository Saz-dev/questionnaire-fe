import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { documentsApi } from '@/services/api/documents.api'
import type { UploadStageEvent } from '@/types/api'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.list,
  })
}

export function useDeleteDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (filename: string) => documentsApi.delete(filename),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      qc.invalidateQueries({ queryKey: ['system', 'health'] })
    },
  })
}

export function useRebuildIndex() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: documentsApi.rebuild,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      qc.invalidateQueries({ queryKey: ['system', 'health'] })
    },
  })
}

const STAGE_ORDER: UploadStageEvent['stage'][] = ['upload', 'parse', 'chunk', 'embed', 'index', 'ready']

export interface StageState {
  stage: UploadStageEvent['stage']
  status: 'pending' | 'active' | 'done'
  duration_ms?: number
  detail?: Record<string, unknown>
}

export function useDocumentUpload() {
  const qc = useQueryClient()
  const [stages, setStages] = useState<StageState[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const upload = useCallback(
    async (files: File[]) => {
      setError(null)
      setIsUploading(true)
      setStages(STAGE_ORDER.map((stage, i) => ({ stage, status: i === 0 ? 'active' : 'pending' })))

      try {
        await documentsApi.upload(files, (event) => {
          setStages((prev) => {
            if (!prev) return prev
            const idx = STAGE_ORDER.indexOf(event.stage)
            return prev.map((s, i) => {
              if (i < idx) return { ...s, status: 'done' }
              if (i === idx) return { ...s, status: 'done', duration_ms: event.duration_ms, detail: event.detail }
              if (i === idx + 1) return { ...s, status: 'active' }
              return s
            })
          })
        })
        qc.invalidateQueries({ queryKey: ['documents'] })
        qc.invalidateQueries({ queryKey: ['system', 'health'] })
      } catch (err) {
        setError(err)
      } finally {
        setIsUploading(false)
      }
    },
    [qc],
  )

  const reset = useCallback(() => {
    setStages(null)
    setError(null)
  }, [])

  return { upload, stages, isUploading, error, reset }
}
