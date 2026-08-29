import type { MiniFetchClientType } from '@/core/client'

import { describe, it, vi, expect, beforeEach } from 'vitest'

import { TEST_URLS } from '../constants'

import { create } from '@/core/client'
import { HttpError } from '@/errors'

describe('miniFetchClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response)
  })

  it('should merge baseUrl with path', async () => {
    const client = create(TEST_URLS.API_BASE)
    await client.get('/data')

    expect(fetch).toHaveBeenCalledWith(
      TEST_URLS.API_DATA,
      expect.objectContaining({
        method: 'GET',
      }),
    )
  })

  it.each([
    {
      method: 'POST',
      call: (client: MiniFetchClientType) => client.post('/user', { json: { name: 'John' } }),
      expectedUrl: '/user',
    },
    {
      method: 'PUT',
      call: (client: MiniFetchClientType) => client.put('/user/1', { json: { name: 'Jane' } }),
      expectedUrl: '/user/1',
    },
    {
      method: 'PATCH',
      call: (client: MiniFetchClientType) => client.patch('/user/1', { json: { name: 'John' } }),
      expectedUrl: '/user/1',
    },
    {
      method: 'DELETE',
      call: (client: MiniFetchClientType) => client.del('/user/1'),
      expectedUrl: '/user/1',
    },
    {
      method: 'HEAD',
      call: (client: MiniFetchClientType) => client.head('/user'),
      expectedUrl: '/user',
    },
  ])('should call fetch with $method method', async ({ method, call, expectedUrl }) => {
    const client = create()
    await call(client)

    expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({ method }))
  })

  it('should return undefined when response status is 204 No Content', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 204,
      headers: new Headers(),
      json: vi.fn().mockResolvedValue(undefined),
    } as unknown as Response)

    const client = create()
    const result = await client.del('/user/1')

    expect(result.data).toBeUndefined()
  })

  it('should throw HttpError when response status is 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers(),
      json: async () => ({ message: 'Not Found' }),
    } as Response)

    await expect(create().get('/not-found')).rejects.toThrowError(HttpError)
  })
})
