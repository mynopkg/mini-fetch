import type { MiniFetchMethodType } from '../types/MiniFetch'

import { RequestError } from './RequestError'

export class TimeoutError extends RequestError {
  constructor(
    public method: MiniFetchMethodType,
    public url: string,
    public timeout: number,
  ) {
    super(`Request timed out after ${timeout}ms: ${method} ${url}`)
    this.name = 'TimeoutError'
  }
}
