export const combineUrl = (endpoint: string, baseUrl?: string) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }
  if (!baseUrl) {
    return endpoint
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, '')
  const cleanEndpoint = endpoint.replace(/^\/+/, '')

  return `${cleanBaseUrl}/${cleanEndpoint}`
}

export const combineHeaders = (...headersList: (HeadersInit | undefined)[]): Headers => {
  const mergedHeader = new Headers()

  headersList.forEach((headers) => {
    if (!headers) return

    if (headers instanceof Headers) {
      headers.forEach((value, key) => mergedHeader.set(key, value))
      return
    }

    if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        if (value !== undefined) mergedHeader.set(key, value)
      })
      return
    }

    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) mergedHeader.set(key, String(value))
    })
  })

  return mergedHeader
}
