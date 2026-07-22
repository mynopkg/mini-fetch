import type { MiniFetchMethodType } from '../types/MiniFetch'

export class RequestError extends Error {
  constructor(message: string) {
    super(`Request failed with Error: ${message}`)
    this.name = 'RequestError'
  }
}

export class HttpError extends RequestError {
  constructor(
    public method: MiniFetchMethodType,
    public url: string,
    public status: number,
    public response?: Response,
  ) {
    super(`Request failed with HTTP ${status}: ${method} ${url}`)
    this.name = 'HttpError'
  }
}

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
