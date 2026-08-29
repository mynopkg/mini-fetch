export type MiniFetchMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD'
export type MiniFetchResponseType = 'json' | 'blob' | 'text' | 'arrayBuffer' | 'formData'

export interface MiniFetchRequest extends Omit<RequestInit, 'body' | 'method'> {
  body?: BodyInit
  json?: Record<string, unknown> | unknown[]
}

export interface MiniFetchResponse<T = unknown> extends Response {
  data?: T | string | Blob | ArrayBuffer | FormData
}

export interface MiniFetchOptions extends MiniFetchRequest {
  responseType?: MiniFetchResponseType
  method?: MiniFetchMethodType
  timeout?: number
}
