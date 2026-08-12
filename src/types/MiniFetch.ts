export type MiniFetchMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD'
export type MiniFetchResponseType = 'json' | 'blob' | 'text' | 'arrayBuffer'

export interface MiniFetchRequest extends Omit<RequestInit, 'body' | 'method'> {
  body?: BodyInit
  json?: Record<string, unknown> | unknown[]
}

export interface MiniFetchResponse<T = unknown> extends Response {
  data?: T | string | Blob | ArrayBuffer
}

export interface MiniFetchOptions extends MiniFetchRequest {
  responseType?: MiniFetchResponseType
  method?: MiniFetchMethodType
  timeout?: number
}

export interface MiniFetchApi {
  get: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  post: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  patch: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  put: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  delete: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
}
