import { RequestError } from './RequestError'

/** @internal */
export class UnsupportedRuntimeError extends RequestError {
  constructor(feature: string) {
    super(`${feature} is not supported in this runtime`)
    this.name = 'UnsupportedRuntimeError'
  }
}
