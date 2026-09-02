import { apiClient, fileUrl, postSSE } from './client'
import type { DeleteResponse, DocumentsResponse, RebuildResponse, UploadStageEvent } from '@/types/api'

export const documentsApi = {
  list: () => apiClient.get<DocumentsResponse>('/api/documents'),

  delete: (filename: string) =>
    apiClient.delete<DeleteResponse>(`/api/documents/${encodeURIComponent(filename)}`),

  rebuild: () => apiClient.post<RebuildResponse>('/api/index/rebuild'),

  fileUrl: (filename: string) => fileUrl(`/api/documents/${encodeURIComponent(filename)}/file`),

  upload: (files: File[], onEvent: (event: UploadStageEvent) => void, signal?: AbortSignal) => {
    const form = new FormData()
    for (const file of files) form.append('files', file)
    return postSSE<UploadStageEvent>('/api/documents/upload', undefined, onEvent, { form, signal })
  },
}
