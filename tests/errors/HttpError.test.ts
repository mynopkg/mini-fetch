import { describe, it, expect } from 'vitest'

import { HttpError } from '../../src/errors'
import { TEST_URLS } from '../constants'

describe('HttpError', () => {
  it('should set the correct error message with statusText', () => {
    const mockResponse = {
      statusText: 'Not Found',
    } as Response

    const error = new HttpError('GET', TEST_URLS.FAKE_BASE, 404, mockResponse)

    expect(error.message).toBe(`Request failed with HTTP 404 Not Found: GET ${TEST_URLS.FAKE_BASE}`)
  })

  it('should set the correct error message without statusText', () => {
    const mockResponse = {
      statusText: '',
    } as Response

    const error = new HttpError('POST', TEST_URLS.API_BASE, 500, mockResponse)

    expect(error.message).toBe(`Request failed with HTTP 500: POST ${TEST_URLS.API_BASE}`)
  })

  it('should set the correct error message with statusText as null', () => {
    const mockResponse = {
      statusText: null,
    } as any

    const error = new HttpError('PUT', TEST_URLS.API_DATA, 403, mockResponse)

    expect(error.message).toBe(`Request failed with HTTP 403: PUT ${TEST_URLS.API_DATA}`)
  })

  it('should store method, url, status, and response properties', () => {
    const mockResponse = {
      statusText: 'Unauthorized',
    } as Response

    const error = new HttpError('DELETE', TEST_URLS.API_USER, 401, mockResponse)

    expect(error.method).toBe('DELETE')
    expect(error.url).toBe(TEST_URLS.API_USER)
    expect(error.status).toBe(401)
    expect(error.response).toBe(mockResponse)
  })

  it('should set the correct name', () => {
    const mockResponse = {
      statusText: 'Bad Request',
    } as Response

    const error = new HttpError('GET', TEST_URLS.FAKE_BASE, 400, mockResponse)

    expect(error.name).toBe('HttpError')
  })

  it('should include HTTP status and error details in message', () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Internal Server Error',
    } as unknown as Response

    const error = new HttpError('GET', TEST_URLS.FAKE_BASE, 500, mockResponse)

    expect(error.message).toContain('Request failed with HTTP')
    expect(error.message).toContain('500')
  })
})
