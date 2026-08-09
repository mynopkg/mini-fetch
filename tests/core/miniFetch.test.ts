import { describe, it, expect, vi } from 'vitest'

import type { MiniFetchResponseType } from '../../src/types/MiniFetch'
import { miniFetch } from '../../src/core/miniFetch'
import { TEST_URLS } from '../constants'

describe('miniFetch', () => {
  it('should return data on successful response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'hello' }),
      text: async () => 'hello',
    } as Response)

    const response = await miniFetch<{ message: string }>(TEST_URLS.FAKE_BASE)
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

    const response = await miniFetch<{ message: string }>(TEST_URLS.FAKE_BASE, {
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

    const response = await miniFetch<string>(TEST_URLS.FAKE_BASE, {
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

    const response = await miniFetch<Blob>(TEST_URLS.FAKE_BASE, {
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

    const response = await miniFetch<ArrayBuffer>(TEST_URLS.FAKE_BASE, {
      responseType: 'arrayBuffer',
    })
    expect(response.data).toBeInstanceOf(ArrayBuffer)
    expect(response.data).toBe(fakeBuffer)
    expect(response.status).toBe(200)
  })

  it('should throw RequestError on unsupported responseTypes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    } as Response)

    await expect(
      miniFetch(TEST_URLS.FAKE_BASE, {
        responseType: 'xml' as unknown as MiniFetchResponseType,
      }),
    ).rejects.toThrow(/Unsupported responseType/)
  })
})
