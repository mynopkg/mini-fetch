export type MiniFetchMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
export type MiniFetchResponseType = 'json' | 'blob' | 'text' | 'arrayBuffer'

export interface MiniFetchOptions<T = any> extends MiniFetchRequest<T> {
  responseType?: MiniFetchResponseType
  timeout?: number
}

export interface MiniFetchRequest<T = any> extends Omit<RequestInit, 'body' | 'method'> {
  method?: MiniFetchMethodType
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
