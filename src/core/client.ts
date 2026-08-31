import type { MiniFetchOptions } from '@/types/MiniFetch'

import { combineHeaders, combineUrl } from './helpers'
import { miniFetch } from './miniFetch'

export const get = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'GET' })

export const post = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'POST' })

export const put = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'PUT' })

export const patch = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'PATCH' })

export const del = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'DELETE' })

export const head = <T = unknown>(endpoint: string, options?: MiniFetchOptions) =>
  miniFetch<T>(endpoint, { ...options, method: 'HEAD' })

export const create = (baseUrl?: string, defaultOptions?: MiniFetchOptions) => {
  const request = <T = unknown>(endpoint: string, options?: MiniFetchOptions) => {
    const mergedUrl = combineUrl(endpoint, baseUrl)
    const mergedHeaders = combineHeaders(defaultOptions?.headers, options?.headers)
    const mergedOptions: MiniFetchOptions = {
      ...defaultOptions,
      ...options,
      headers: mergedHeaders,
    }

    return miniFetch<T>(mergedUrl, mergedOptions)
  }

  return {
    request,
    get: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'GET' }),
    post: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'POST' }),
    put: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'PUT' }),
    patch: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'PATCH' }),
    del: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'DELETE' }),
    head: <T = unknown>(endpoint: string, opts?: MiniFetchOptions) =>
      request<T>(endpoint, { ...opts, method: 'HEAD' }),
  }
}

export type MiniFetchClientType = ReturnType<typeof create>
