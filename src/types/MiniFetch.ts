export type MiniFetchResponseDataMap<T = unknown> = {
  json: T
  text: string
  blob: Blob
  arrayBuffer: ArrayBuffer
  formData: FormData
}
export type MiniFetchResponseType = keyof MiniFetchResponseDataMap

export type MiniFetchMethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD'

export interface MiniFetchRequest extends Omit<RequestInit, 'body' | 'method'> {
  body?: BodyInit
  json?: Record<string, unknown> | unknown[]
}

export interface MiniFetchResponse<T = unknown, R extends MiniFetchResponseType = 'json'>
  extends Response {
  data?: R extends 'json' ? T : MiniFetchResponseDataMap<T>[R]
}

export interface MiniFetchOptions<R extends MiniFetchResponseType = 'json'>
  extends MiniFetchRequest {
  responseType?: R
  method?: MiniFetchMethodType
  timeout?: number
}
