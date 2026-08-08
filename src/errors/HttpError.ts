import type { MiniFetchMethodType } from '../types/MiniFetch'

import { RequestError } from './RequestError'

export class HttpError extends RequestError {
  constructor(
    public method: MiniFetchMethodType,
    public url: string,
    public status: number,
    public response: Response,
  ) {
    super(`Request failed with HTTP ${status} ${response.statusText}: ${method} ${url}`)
    this.name = 'HttpError'
  }
}
