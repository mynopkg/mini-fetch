import type { MiniFetchOptions, MiniFetchResponse } from '@/types/MiniFetch'

import { HttpError, TimeoutError, RequestError } from '@/errors'

export async function miniFetch<T = unknown>(
  url: string,
  options?: MiniFetchOptions,
): Promise<MiniFetchResponse<T>> {
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
    const mergedHeaders = new Headers(headers)
    let requestBody: BodyInit | undefined

    if (body !== undefined && json !== undefined) {
      throw new RequestError(
        "Cannot specify both 'body' and 'json'. Use only one or leave both undefined.",
      )
    }

    if (method !== 'GET') {
      if (json !== undefined && Object.keys(json).length > 0) {
        requestBody = JSON.stringify(json)
        mergedHeaders.set('Content-Type', 'application/json')
      } else if (body) {
        requestBody = body
      }
    }

    const fetchOptions = {
      method,
      headers: mergedHeaders,
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

      fetchPromise = fetch(url, {
        ...fetchOptions,
        signal: mergedSignal,
      })
    } else {
      fetchPromise = fetch(url, {
        ...fetchOptions,
        signal: userSignal,
      })
    }

    const response = await fetchPromise

    if (!response.ok) {
      throw new HttpError(method, url, response.status, response)
    }

    let data: T | string | Blob | ArrayBuffer | undefined
    if (responseType === 'json') {
      data = (await response.json()) as T
    } else if (responseType === 'blob') {
      data = await response.blob()
    } else if (responseType === 'text') {
      data = await response.text()
    } else if (responseType === 'arrayBuffer') {
      data = await response.arrayBuffer()
    } else {
      throw new RequestError(`Unsupported responseType: ${responseType}`)
    }

    const miniFetchResponse: MiniFetchResponse<T> = Object.assign(response, { data })
    return miniFetchResponse
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      if (timeout > 0 && (!userSignal || !userSignal.aborted)) {
        throw new TimeoutError(method, url, timeout)
      }
      throw new RequestError('Request aborted')
    }
    if (error instanceof RequestError) {
      throw error
    }
    if (error instanceof Error) {
      throw new RequestError(error.message)
    }
    throw new RequestError(String(error))
  }
}
