import type { MiniFetchOptions, MiniFetchResponse } from '../types/MiniFetch'
import { HttpError, TimeoutError, RequestError } from '../errors'

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
    ...rest
  } = options || {}

  try {
    const mergedHeaders = new Headers(headers)
    let requestBody: BodyInit | undefined

    if (body && json) {
      throw new RequestError(
        "Cannot specify both 'body' and 'json'. Use only one or leave both undefined.",
      )
    }

    if (method !== 'GET') {
      if (json && Object.keys(json).length > 0 && !body) {
        requestBody = JSON.stringify(json)
        mergedHeaders.set('Content-Type', 'application/json')
      } else if (body) {
        requestBody = body
      }
    }

    let fetchPromise = fetch(url, {
      method,
      headers: mergedHeaders,
      body: requestBody,
      ...rest,
    })

    if (timeout > 0) {
      fetchPromise = Promise.race([
        fetchPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new TimeoutError(method, url, timeout)), timeout),
        ),
      ])
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

    const miniResponse: MiniFetchResponse<T> = Object.assign(response, { data })
    return miniResponse
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      throw error
    }
    if (error instanceof Error) {
      throw new RequestError(error.message)
    }
    throw new RequestError(String(error))
  }
}
