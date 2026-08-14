import { describe, it, expect } from 'vitest'

import { UnsupportedRuntimeError } from '@/errors/UnsupportedRuntimeError'

describe('UnsupportedRuntimeError', () => {
  it('should set the correct error message', () => {
    const error = new UnsupportedRuntimeError('AbortSignal.any')

    expect(error.message).toBe('AbortSignal.any is not supported in this runtime')
  })

  it('should set the correct name', () => {
    const error = new UnsupportedRuntimeError('WeakRef')

    expect(error.name).toBe('UnsupportedRuntimeError')
  })

  it('should work with any feature name', () => {
    const features = ['AbortSignal.any', 'WeakRef', 'globalThis.crypto']

    features.forEach((feature) => {
      const error = new UnsupportedRuntimeError(feature)
      expect(error.message).toBe(`${feature} is not supported in this runtime`)
    })
  })
})
