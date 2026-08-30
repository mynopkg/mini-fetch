import type { MiniFetchClientType } from '@/core/client'

import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'

import { TEST_URLS } from '../constants'
import { mockServer } from '../mocks/node'

import { create } from '@/core/client'
import { combineUrl } from '@/core/helpers'

describe('miniFetchClient', () => {
  it('should merge baseUrl with path', async () => {
    const client = create(TEST_URLS.API_BASE)
    const response = await client.get('/user')

    expect(response).toMatchObject({
      data: {
        id: 1,
        name: 'John Doe',
        role: 'test',
      },
    })
  })

  it('should automatically set Content-Type header to application/json when JSON body is sent', async () => {
    mockServer.use(
      http.post(combineUrl('/user', TEST_URLS.API_BASE), ({ request }) => {
        const contentType = request.headers.get('content-type')
        expect(contentType).toContain('application/json')
        return HttpResponse.json({ success: true })
      }),
    )

    const client = create(TEST_URLS.API_BASE)
    const response = await client.post('/user', { json: { name: 'John' } })

    expect(response).not.toBeNull()
  })

  it.each([
    {
      method: 'POST',
      call: (client: MiniFetchClientType) => client.post('/user', { json: { name: 'John' } }),
    },
    {
      method: 'PUT',
      call: (client: MiniFetchClientType) => client.put('/user/1', { json: { name: 'Jane' } }),
    },
    {
      method: 'PATCH',
      call: (client: MiniFetchClientType) => client.patch('/user/1', { json: { name: 'John' } }),
    },
  ])('should call fetch with $method method', async ({ call }) => {
    const client = create(TEST_URLS.API_BASE)
    const response = await call(client)

    expect(response.status).toBeGreaterThanOrEqual(200)
    expect(response.status).toBeLessThan(300)

    expect(response.data).toBeDefined()
  })

  it('should return undefined data when request method is "HEAD"', async () => {
    const client = create(TEST_URLS.API_BASE)
    const response = await client.head('/user/1')

    expect(response.data).toBeUndefined()
    expect(response.status).toBe(200)
  })

  it('should return undefined data when response status is 204', async () => {
    const client = create(TEST_URLS.API_BASE)
    const response = await client.del('/user/1')

    expect(response.data).toBeUndefined()
    expect(response.status).toBe(204)
  })

  it('should send custom headers in request', async () => {
    const capturedRequestHeaders: Record<string, string> = {}

    mockServer.use(
      http.post(combineUrl('/user', TEST_URLS.API_BASE), ({ request }) => {
        request.headers.forEach((value, key) => {
          capturedRequestHeaders[key] = value
        })

        return HttpResponse.json({ success: true })
      }),
    )

    const client = create(TEST_URLS.API_BASE)

    await client.post('/user', {
      json: { name: 'John' },
      headers: { 'X-Custom-Header': 'custom-value' },
    })

    expect(capturedRequestHeaders['x-custom-header']).toBe('custom-value')
    expect(capturedRequestHeaders['content-type']).toContain('application/json')
  })

  it('should send custom headers provided in options', async () => {
    mockServer.use(
      http.get(combineUrl('user/protected', TEST_URLS.API_BASE), ({ request }) => {
        const authHeader = request.headers.get('Authorization')
        return HttpResponse.json({ auth: authHeader })
      }),
    )

    const client = create(TEST_URLS.API_BASE, {
      headers: { Authorization: 'Bearer mock-token' },
    })
    const response = await client.get<{ auth: string }>('user/protected')
    const data = response.data as { auth: string }
    expect(data.auth).toBe('Bearer mock-token')
  })
})
