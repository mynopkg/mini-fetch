import type { MiniFetchOptions, MiniFetchResponseType } from '@/types/MiniFetch'

import { combineHeaders, combineUrl } from './helpers'
import { miniFetch } from './miniFetch'

/**
 * Merge options with HTTP method
 * Helper to reduce repetitive type assertions in method shortcuts
 */
const withMethod = <R extends MiniFetchResponseType = 'json'>(
  options: MiniFetchOptions<R> | undefined,
  method: string,
): MiniFetchOptions<R> =>
  ({
    ...options,
    method,
  }) as MiniFetchOptions<R>

export const get = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'GET'))

export const post = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'POST'))

export const put = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'PUT'))

export const patch = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'PATCH'))

export const del = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'DELETE'))

export const head = <T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
) => miniFetch<T, R>(endpoint, withMethod(options, 'HEAD'))

export const create = (baseUrl?: string, defaultOptions?: MiniFetchOptions) => {
  const request = <T = unknown, R extends MiniFetchResponseType = 'json'>(
    endpoint: string,
    options?: MiniFetchOptions<R>,
  ) => {
    const mergedUrl = combineUrl(endpoint, baseUrl)
    const mergedHeaders = combineHeaders(defaultOptions?.headers, options?.headers)
    const mergedOptions: MiniFetchOptions<R> = {
      ...defaultOptions,
      ...options,
      headers: mergedHeaders,
    } as MiniFetchOptions<R>

    return miniFetch<T, R>(mergedUrl, mergedOptions)
  }

  return {
    request,
    get: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'GET')),
    post: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'POST')),
    put: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'PUT')),
    patch: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'PATCH')),
    del: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'DELETE')),
    head: <T = unknown, R extends MiniFetchResponseType = 'json'>(
      endpoint: string,
      opts?: MiniFetchOptions<R>,
    ) => request<T, R>(endpoint, withMethod(opts, 'HEAD')),
  }
}

export type MiniFetchClientType = ReturnType<typeof create>
