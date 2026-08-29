# @mynopkg/mini-fetch

A minimal, type-safe fetch wrapper with timeout, response type parsing, and structured error handling.

## Features

- Automatic JSON serialization for request body
- Multiple response types: `json`, `text`, `blob`, `arrayBuffer`
- Configurable timeout with `AbortController`
- External `AbortSignal` support
- Structured error classes: `HttpError`, `TimeoutError`, `RequestError`
- ESM and CJS dual build

## Requirements

- Node.js >= 20

## Installation

```bash
npm install @mynopkg/mini-fetch
```

## Usage

### `miniFetch` — core function

```typescript
import { miniFetch } from '@mynopkg/mini-fetch'

const res = await miniFetch<{ id: number; title: string }>('https://api.example.com/todos/1')
console.log(res.data) // { id: 1, title: '...' }
```

### Response types

```typescript
const json = await miniFetch<MyType>(url, { responseType: 'json' }) // default
const text = await miniFetch<string>(url, { responseType: 'text' })
const blob = await miniFetch<Blob>(url, { responseType: 'blob' })
const buffer = await miniFetch<ArrayBuffer>(url, { responseType: 'arrayBuffer' })
```

### Timeout

```typescript
await miniFetch(url, { timeout: 3000 }) // throws TimeoutError after 3s
```

### Custom AbortSignal

```typescript
const controller = new AbortController()

// Abort the request manually
setTimeout(() => controller.abort(), 5000)

try {
  await miniFetch(url, { signal: controller.signal })
} catch (e) {
  if (e instanceof RequestError) {
    console.log('Request was aborted')
  }
}
```

### POST with body

```typescript
// Plain objects are automatically serialized to JSON
await miniFetch(url, {
  method: 'POST',
  json: { name: 'Jane Doe' },
})

// FormData, Blob, ArrayBuffer are passed as body
await miniFetch(url, {
  method: 'POST',
  body: new FormData(),
})
```

### Helper methods

```typescript
import { get, post, put, patch, del, head } from '@mynopkg/mini-fetch'

// Use helper methods directly
const users = await get<User[]>('https://api.example.com/users')
await post('https://api.example.com/users', { json: { name: 'Jane Doe' } })
await del('https://api.example.com/users/1')
```

### `create()` — pre-configured client instance

Create a reusable client instance with a base URL and default options:

```typescript
import { create } from '@mynopkg/mini-fetch'

// Simple instance with baseUrl
const api = create('https://api.example.com')

await api.get<User[]>('/users')
await api.post('/users', { json: { name: 'Jane Doe' } })
await api.put('/users/1', { json: { name: 'John Doe' } })
await api.patch('/users/1', { json: { name: 'Johnny' } })
await api.del('/users/1')
await api.head('/users')
```

#### With default options (headers, timeout, etc.)

```typescript
const api = create('https://api.example.com', {
  headers: {
    Authorization: 'Bearer token123',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

// Headers and timeout are applied to all requests
await api.get<User[]>('/users')

// Override or extend default headers per request
await api.post('/users', {
  json: { name: 'Jane Doe' },
  headers: { 'X-Custom-Header': 'value' }, // merged with defaults
})
```

## Error Handling

```typescript
import { miniFetch, HttpError, TimeoutError, RequestError } from '@mynopkg/mini-fetch'

try {
  await miniFetch('https://api.example.com/users')
} catch (e) {
  if (e instanceof HttpError) {
    console.log(e.status) // 404, 500, etc.
    console.log(e.method) // 'GET'
    console.log(e.url)
  } else if (e instanceof TimeoutError) {
    console.log(e.timeout) // ms
  } else if (e instanceof RequestError) {
    console.log(e.message)
  }
}
```

## Options

| Option         | Type                                              | Default        | Description                  |
| -------------- | ------------------------------------------------- | -------------- | ---------------------------- |
| `method`       | `GET \| POST \| PUT \| PATCH \| DELETE \| HEAD`   | `GET`          | HTTP method                  |
| `body`         | `BodyInit`                                        | —              | Request body                 |
| `json`         | `Record<string, unknown> \| unknown[]`            | —              | Auto-serialized to JSON body |
| `headers`      | `HeadersInit`                                     | —              | Request headers              |
| `responseType` | `json \| text \| blob \| arrayBuffer \| formData` | `json`         | Response parsing type        |
| `timeout`      | `number`                                          | `0` (disabled) | Timeout in milliseconds      |
| `signal`       | `AbortSignal`                                     | —              | External abort signal        |

## License

ISC

## Contributing

Issues and pull requests are welcome!
If you find a bug or have a feature request, please open an issue on [GitHub](https://github.com/mynopkg/mini-fetch/issues).
