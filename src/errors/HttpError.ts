import type { MiniFetchMethodType } from '@/types/MiniFetch'

import { RequestError } from './RequestError'

export class HttpError extends RequestError {
  constructor(
    public method: MiniFetchMethodType,
    public url: string,
    public status: number,
    public response: Response,
  ) {
    const statusText = response.statusText ?? ''
    const message = statusText
      ? `Request failed with HTTP ${status} ${statusText}: ${method} ${url}`
      : `Request failed with HTTP ${status}: ${method} ${url}`
    super(message)
    this.name = 'HttpError'
  }
}
