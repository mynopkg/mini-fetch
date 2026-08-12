import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { TEST_URLS } from '../constants'

import { TimeoutError, RequestError } from '@/errors'

describe('TimeoutError', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should set the correct error message', () => {
    const error = new TimeoutError('GET', TEST_URLS.FAKE_BASE, 5000)

    expect(error.message).toBe(`Request timed out after 5000ms: GET ${TEST_URLS.FAKE_BASE}`)
  })

  it('should set the correct name', () => {
    const error = new TimeoutError('POST', TEST_URLS.API_DATA, 3000)

    expect(error.name).toBe('TimeoutError')
  })

  it('should store method, url, and timeout properties', () => {
    const error = new TimeoutError('DELETE', TEST_URLS.API_USER, 10000)

    expect(error.method).toBe('DELETE')
    expect(error.url).toBe(TEST_URLS.API_USER)
    expect(error.timeout).toBe(10000)
  })

  it('should inherit from RequestError and Error', () => {
    const error = new TimeoutError('GET', TEST_URLS.FAKE_BASE, 1000)

    expect(error).toBeInstanceOf(TimeoutError)
    expect(error).toBeInstanceOf(RequestError)
    expect(error).toBeInstanceOf(Error)
  })
})
