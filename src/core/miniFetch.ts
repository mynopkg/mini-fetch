import type { MiniFetchOptions, MiniFetchResponse } from '../types/MiniFetch'
import { HttpError, TimeoutError, FetchError } from '../errors/MiniFetchError'
import { isSerializable } from '../utils/bodySerializer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function miniFetch<T = any>(
  url: string,
  options?: MiniFetchOptions,
): Promise<MiniFetchResponse<T>> {
  const {
    responseType = 'json',
    timeout = 0,
    method = 'GET',
    body,
    headers,
    signal: externalSignal,
    ...rest
  } = options || {}

  const abortController = timeout > 0 ? new AbortController() : null
  let abortTimer: ReturnType<typeof setTimeout> | null = null
  if (abortController) {
    abortTimer = setTimeout(() => abortController.abort(), timeout)
  }

  const signal =
    abortController && externalSignal
      ? AbortSignal.any([abortController.signal, externalSignal])
      : (abortController?.signal ?? externalSignal)

  try {
    const mergedHeaders = new Headers(headers)
    let requestBody: BodyInit | undefined
    if (method !== 'GET' && body !== undefined) {
      if (isSerializable(body)) {
        requestBody = JSON.stringify(body)
        if (!mergedHeaders.has('Content-Type')) {
          mergedHeaders.set('Content-Type', 'application/json')
        }
      } else {
        requestBody = body as BodyInit
      }
    }

    const response = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: requestBody,
      signal,
      ...rest,
    })

    if (!response.ok) {
      throw new HttpError(method, url, response.status)
    }

    let data: T | undefined
    if (responseType === 'json') {
      data = await response.json()
    } else if (responseType === 'blob') {
      data = (await response.blob()) as T
    } else if (responseType === 'text') {
      data = (await response.text()) as T
    } else if (responseType === 'arrayBuffer') {
      data = (await response.arrayBuffer()) as T
    } else {
      throw new FetchError(`Unsupported responseType: ${responseType}`)
    }

    const miniResponse: MiniFetchResponse<T> = Object.assign(response, { data })
    return miniResponse
  } catch (error: unknown) {
    if (!(error instanceof Error) || error instanceof HttpError) {
      throw error
    }
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      if (timeout > 0 && abortController?.signal.aborted) {
        throw new TimeoutError(method, url, timeout)
      }
      throw error
    }
    throw new FetchError(error.message)
  } finally {
    if (abortTimer !== null) {
      clearTimeout(abortTimer)
    }
  }
}
