import type { MiniFetchOptions, MiniFetchResponse } from '@/types/MiniFetch'

import { miniFetch } from './miniFetch'

interface MiniFetchNamespace {
  get: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  post: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  patch: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  put: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  delete: <T = unknown>(url: string, options?: MiniFetchOptions) => Promise<MiniFetchResponse<T>>
  create: (baseUrl?: string) => MiniFetchClient
}

export class MiniFetchClient {
  constructor(private baseUrl?: string) {}

  private async request<T = unknown>(url: string, options?: MiniFetchOptions) {
    const mergedUrl = this.baseUrl
      ? `${this.baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
      : url

    return miniFetch<T>(mergedUrl, options)
  }

  get<T = unknown>(url: string, options?: MiniFetchOptions) {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  post<T = unknown>(url: string, options?: MiniFetchOptions) {
    return this.request<T>(url, { ...options, method: 'POST' })
  }

  patch<T = unknown>(url: string, options?: MiniFetchOptions) {
    return this.request<T>(url, { ...options, method: 'PATCH' })
  }

  put<T = unknown>(url: string, options?: MiniFetchOptions) {
    return this.request<T>(url, { ...options, method: 'PUT' })
  }

  delete<T = unknown>(url: string, options?: MiniFetchOptions) {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  static create(baseUrl?: string) {
    return new MiniFetchClient(baseUrl)
  }
}

export const miniFetchClient: typeof miniFetch & MiniFetchNamespace = Object.assign(miniFetch, {
  get: <T = unknown>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'POST' }),
  patch: <T = unknown>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'PATCH' }),
  put: <T = unknown>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'PUT' }),
  delete: <T = unknown>(url: string, options?: MiniFetchOptions) =>
    miniFetch<T>(url, { ...options, method: 'DELETE' }),
  create: (baseUrl?: string) => new MiniFetchClient(baseUrl),
})
