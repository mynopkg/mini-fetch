export class RequestError extends Error {
  cause?: unknown

  constructor(message?: string, options?: { cause?: unknown }) {
    super(message)
    this.name = 'RequestError'

    if (options?.cause) {
      this.cause = options.cause
    }
  }
}
