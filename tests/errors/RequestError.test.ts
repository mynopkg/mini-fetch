import { describe, it, expect } from 'vitest'

import { RequestError } from '@/errors'

describe('RequestError', () => {
  it('should create an instance with correct message', () => {
    const error = new RequestError('Custom error message')

    expect(error).toBeInstanceOf(RequestError)
    expect(error).toBeInstanceOf(Error)
  })

  it('should set the correct error message', () => {
    const error = new RequestError('Test error message')

    expect(error.message).toBe('Test error message')
  })

  it('should set the correct name', () => {
    const error = new RequestError('Some error')

    expect(error.name).toBe('RequestError')
  })
})
