import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { MiniFetchResponseType } from '../../src/types/MiniFetch'
import { miniFetch } from '../../src/core/miniFetch'
import { TimeoutError } from '../../src/errors/MiniFetchError'

interface FakeResponse {
  message: string
}

describe('miniFetch', () => {
  beforeEach(() => {
    vi.useFakeTimers() // fake timer 활성화
  })

  afterEach(() => {
    vi.useRealTimers() // fake timer 비활성화
  })

  it('should return data on successful response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'hello' }),
      text: async () => 'hello',
    } as Response)

    const response = await miniFetch<FakeResponse>('https://fake-url.com/')
    expect(response.data).toEqual({ message: 'hello' })
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
  })

  it('should return data when responseType is "json"', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'hello' }),
    } as Response)

    const response = await miniFetch<FakeResponse>('https://fake-url.com/', {
      responseType: 'json',
    })
    expect(response.data).toEqual({ message: 'hello' })
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
  })

  it('should return data when responseType is "text"', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => 'hello',
    } as Response)

    const response = await miniFetch<string>('https://fake-url.com/', {
      responseType: 'text',
    })
    expect(response.data).toBe('hello')
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
  })

  it('should return data when responseType is "blob"', async () => {
    const fakeBlob = new Blob(['hello'], { type: 'text/plain' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => fakeBlob,
    } as Response)

    const response = await miniFetch<Blob>('https://fake-url.com/', {
      responseType: 'blob',
    })
    expect(response.data).toBeInstanceOf(Blob)
    expect(response.data).toBe(fakeBlob)
    expect(response.status).toBe(200)
  })

  it('should return data when responseType is "arrayBuffer"', async () => {
    const fakeBuffer = new ArrayBuffer(8)
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => fakeBuffer,
    } as Response)

    const response = await miniFetch<ArrayBuffer>('https://fake-url.com/', {
      responseType: 'arrayBuffer',
    })
    expect(response.data).toBeInstanceOf(ArrayBuffer)
    expect(response.data).toBe(fakeBuffer)
    expect(response.status).toBe(200)
  })

  it('should throw FetchError on unsupported responseTypes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    } as Response)

    await expect(
      miniFetch('https://fake-url.com/', {
        responseType: 'xml' as unknown as MiniFetchResponseType,
      }),
    ).rejects.toThrow(/Unsupported responseType/)
  })

  it('should reject with TimeoutError when request times out', async () => {
    globalThis.fetch = vi.fn().mockImplementation(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new TimeoutError('GET', _url, 1000))
          })
        }),
    )

    const fetchPromise = miniFetch<FakeResponse>('https://fake-url.com/', {
      timeout: 1000,
    })

    vi.advanceTimersByTime(1000)

    await expect(fetchPromise).rejects.toThrow(/Request timed out/i)
  })

  it('should reject with HttpError on HTTP error response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    } as Response)

    await expect(miniFetch<FakeResponse>('https://fake-url.com/')).rejects.toThrow(
      /Request failed with Http/i,
    )
  })
})
