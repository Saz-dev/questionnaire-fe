import { API_BASE_URL } from '@/app/config/env'
import type { ApiErrorShape } from '@/types/api'

export class ApiError extends Error implements ApiErrorShape {
  status: number | null
  detail?: unknown

  constructor(shape: ApiErrorShape) {
    super(shape.message)
    this.name = 'ApiError'
    this.status = shape.status
    this.detail = shape.detail
  }
}

async function parseErrorMessage(res: Response): Promise<{ message: string; detail?: unknown }> {
  try {
    const body = await res.json()
    if (typeof body?.detail === 'string') return { message: body.detail, detail: body }
    if (Array.isArray(body?.detail)) {
      const msg = body.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('; ')
      return { message: msg || `Request failed (${res.status})`, detail: body }
    }
    return { message: `Request failed (${res.status})`, detail: body }
  } catch {
    return { message: `Request failed (${res.status})` }
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError({
      status: null,
      message: `Cannot reach the RAG backend at ${API_BASE_URL}. Is the API server running?`,
    })
  }

  if (!res.ok) {
    const { message, detail } = await parseErrorMessage(res)
    throw new ApiError({ status: res.status, message, detail })
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  postForm: <T>(path: string, form: FormData) => request<T>(path, { method: 'POST', body: form }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export function fileUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

/**
 * Consume a Server-Sent Events endpoint reached via POST, calling
 * `onEvent` with each parsed `data:` payload as it arrives. Used for the
 * two real streaming endpoints the backend exposes (query + upload).
 */
export async function postSSE<TEvent>(
  path: string,
  body: unknown,
  onEvent: (event: TEvent) => void,
  init?: { signal?: AbortSignal; form?: FormData },
): Promise<void> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: init?.form ? {} : { 'Content-Type': 'application/json' },
      body: init?.form ?? JSON.stringify(body),
      signal: init?.signal,
    })
  } catch {
    throw new ApiError({
      status: null,
      message: `Cannot reach the RAG backend at ${API_BASE_URL}. Is the API server running?`,
    })
  }

  if (!res.ok || !res.body) {
    const { message, detail } = await parseErrorMessage(res)
    throw new ApiError({ status: res.status, message, detail })
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() ?? ''
    for (const chunk of chunks) {
      const line = chunk.split('\n').find((l) => l.startsWith('data: '))
      if (!line) continue
      onEvent(JSON.parse(line.slice(6)) as TEvent)
    }
  }
}
