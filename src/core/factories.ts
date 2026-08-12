import type { MiniFetchOptions } from '@/types/MiniFetch'

import { miniFetch } from './miniFetch'

export function createMiniFetch(baseUrl?: string) {
  async function request<T = unknown>(url: string, options?: MiniFetchOptions) {
    const mergedUrl = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}` : url
    return miniFetch<T>(mergedUrl, options)
  }

  return {
    request,
    get: <T = unknown>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'GET' }),
    post: <T = unknown>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'POST' }),
    patch: <T = unknown>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'PATCH' }),
    put: <T = unknown>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'PUT' }),
    delete: <T = unknown>(url: string, options?: MiniFetchOptions) =>
      request<T>(url, { ...options, method: 'DELETE' }),
  }
}
