/* eslint-disable @typescript-eslint/no-explicit-any */
export type MiniFetchMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface MiniFetchOptions extends MiniFetchRequest {
  autoParseJson?: boolean
  timeout?: number
}

export interface MiniFetchRequest<T = any> extends Omit<RequestInit, 'body'> {
  body?: T
}

export interface MiniFetchResponse<T = any> extends Response {
  data?: T
}

export interface MiniFetchApi {
  get: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  post: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  patch: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  put: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  delete: <T = any>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
}
