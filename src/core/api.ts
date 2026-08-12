import type { MiniFetchApi, MiniFetchOptions } from '../types/MiniFetch'

import { miniFetch } from './miniFetch'

export const miniFetchApi: MiniFetchApi = {
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
}
