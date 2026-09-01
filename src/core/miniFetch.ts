import type { MiniFetchOptions, MiniFetchResponse, MiniFetchResponseType } from '@/types/MiniFetch'

import { HttpError, TimeoutError, RequestError } from '@/errors'

export async function miniFetch<T = unknown, R extends MiniFetchResponseType = 'json'>(
  endpoint: string,
  options?: MiniFetchOptions<R>,
): Promise<MiniFetchResponse<T, R>> {
  const {
    responseType = 'json',
    timeout = 0,
    method = 'GET',
    headers,
    body,
    json,
    signal: userSignal,
    ...rest
  } = options || {}

  try {
    const requestHeaders = new Headers(headers)
    let requestBody: BodyInit | undefined

    if (body !== undefined && json !== undefined) {
      throw new RequestError(
        "Cannot specify both 'body' and 'json'. Use only one or leave both undefined.",
      )
    }

    if (method !== 'GET' && method !== 'HEAD') {
      if (json !== undefined && Object.keys(json).length > 0) {
        requestBody = JSON.stringify(json)
        if (!requestHeaders.has('Content-Type')) {
          requestHeaders.set('Content-Type', 'application/json')
        }
      } else if (body) {
        requestBody = body
      }
    }

    const fetchOptions = {
      method,
      headers: requestHeaders,
      body: requestBody,
      ...rest,
    }

    let fetchPromise: Promise<Response>

    if (timeout > 0) {
      const signals = [AbortSignal.timeout(timeout)]
      if (userSignal) {
        signals.push(userSignal)
      }
      const mergedSignal = signals.length > 1 ? AbortSignal.any(signals) : signals[0]

      fetchPromise = fetch(endpoint, {
        ...fetchOptions,
        signal: mergedSignal,
      })
    } else {
      fetchPromise = fetch(endpoint, {
        ...fetchOptions,
        signal: userSignal,
      })
    }

    const response = await fetchPromise

    if (!response.ok) {
      throw new HttpError(method, endpoint, response.status, response)
    }

    let data: unknown
    if (
      method === 'HEAD' ||
      response.status === 204 ||
      response.headers?.get('content-length') === '0'
    ) {
      data = undefined
    } else {
      switch (responseType) {
        case 'json':
          data = await response.json()
          break
        case 'blob':
          data = await response.blob()
          break
        case 'text':
          data = await response.text()
          break
        case 'arrayBuffer':
          data = await response.arrayBuffer()
          break
        case 'formData':
          data = await response.formData()
          break
        default:
          throw new RequestError(`Unsupported responseType: ${responseType}`)
      }
    }

    const miniFetchResponse: MiniFetchResponse<T, R> = Object.assign(response, {
      data,
    }) as unknown as MiniFetchResponse<T, R>
    return miniFetchResponse
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      if (timeout > 0 && (!userSignal || !userSignal.aborted)) {
        throw new TimeoutError(method, endpoint, timeout)
      }
      throw new RequestError('Request aborted')
    }
    if (error instanceof RequestError) {
      throw error
    }
    if (error instanceof Error) {
      const requestError = new RequestError(error.message)
      requestError.cause = error
      if (error.stack) {
        requestError.stack = error.stack
      }
      throw requestError
    }
    throw new Error(typeof error === 'string' ? error : 'Unknown error occurred')
  }
}
