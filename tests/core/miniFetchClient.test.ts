import { describe, it, vi, expect } from 'vitest'

import { TEST_URLS } from '../constants'

import { miniFetchClient } from '@/core/client'

describe('MiniFetchClient', () => {
  it('should merge baseUrl with path', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response)

    const client = miniFetchClient.create(TEST_URLS.API_BASE)
    await client.get('/data')

    expect(fetch).toHaveBeenCalledWith(TEST_URLS.API_DATA, expect.any(Object))
  })

  it('should pass request options to fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' }),
    } as Response)

    const client = miniFetchClient.create(TEST_URLS.API_BASE)

    await client.get('/data')

    expect(fetch).toHaveBeenCalledWith(
      TEST_URLS.API_DATA,
      expect.objectContaining({
        method: 'GET',
      }),
    )
  })

  it('should use correct HTTP methods', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response)

    const client = miniFetchClient.create()

    await client.post('/user', { json: { name: 'John' } })
    expect(fetch).toHaveBeenCalledWith('/user', expect.objectContaining({ method: 'POST' }))

    await client.put('/user/1', { json: { name: 'Jane' } })
    expect(fetch).toHaveBeenCalledWith('/user/1', expect.objectContaining({ method: 'PUT' }))
  })

  it('should work without baseUrl', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' }),
    } as Response)

    const client = miniFetchClient.create()
    await client.get(TEST_URLS.API_DATA)

    expect(fetch).toHaveBeenCalledWith(TEST_URLS.API_DATA, expect.any(Object))
  })
})
