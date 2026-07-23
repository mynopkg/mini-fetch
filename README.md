# @mynopkg/mini-fetch

A minimal, type-safe TypeScript fetch wrapper with timeout, response type parsing, and structured error handling.

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

### POST with body

```typescript
// Plain objects are automatically serialized to JSON
await miniFetch(url, {
  method: 'POST',
  body: { name: 'Jane Doe' },
})

// FormData, Blob, ArrayBuffer are passed through as-is
await miniFetch(url, {
  method: 'POST',
  body: new FormData(),
})
```

### `miniFetchApi` — pre-built instance

```typescript
import { miniFetchApi } from '@mynopkg/mini-fetch'

const res = await miniFetchApi.get<User[]>('https://api.example.com/users')
await miniFetchApi.post('https://api.example.com/users', { body: { name: 'Jane Doe' } })
```

### `createMiniFetch` — factory with baseUrl

```typescript
import { createMiniFetch } from '@mynopkg/mini-fetch'

const api = createMiniFetch('https://api.example.com')

await api.get<User[]>('/users')
await api.post('/users', { body: { name: 'Jane Doe' } })
await api.delete('/users/1')
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

| Option         | Type                                    | Default        | Description             |
| -------------- | --------------------------------------- | -------------- | ----------------------- |
| `method`       | `GET \| POST \| PUT \| PATCH \| DELETE` | `GET`          | HTTP method             |
| `body`         | `any`                                   | —              | Request body            |
| `headers`      | `HeadersInit`                           | —              | Request headers         |
| `responseType` | `json \| text \| blob \| arrayBuffer`   | `json`         | Response parsing type   |
| `timeout`      | `number`                                | `0` (disabled) | Timeout in milliseconds |
| `signal`       | `AbortSignal`                           | —              | External abort signal   |

## License

ISC
