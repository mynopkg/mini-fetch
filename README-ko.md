# @mynopkg/mini-fetch

타임아웃, 응답 타입 파싱, 커스텀 에러 처리를 제공하는 미니멀한 fetch 래퍼입니다.

**[한국어](./README-ko.md)** | **[English](./README.md)**

## 기능

- 요청 본문 자동 JSON 직렬화
- 다양한 응답 타입: `json`, `text`, `blob`, `arrayBuffer`, `formData`
- `AbortController`를 이용한 설정 가능한 타임아웃
- 외부 `AbortSignal` 지원
- 커스텀 에러 클래스: `HttpError`, `TimeoutError`, `RequestError`
- ESM과 CJS 듀얼 빌드

## 요구사항

- Node.js >= 20

## 설치

```bash
npm install @mynopkg/mini-fetch
```

## 사용 예시

### `miniFetch` — Core 함수

```typescript
import { miniFetch } from '@mynopkg/mini-fetch'

const res = await miniFetch<{ id: number; title: string }>('https://api.example.com/todos/1')
console.log(res.data) // { id: 1, title: '...' }
```

### 응답 타입

응답 데이터 타입은 `responseType`에 따라 자동으로 추론됩니다:

```typescript
// JSON (기본값) - data: T
const json = await miniFetch<MyType>(url) // data: MyType
const explicit = await miniFetch<MyType>(url, { responseType: 'json' }) // data: MyType

// Text - data: string
const text = await miniFetch<string, 'text'>(url, { responseType: 'text' }) // data: string

// Blob - data: Blob
const blob = await miniFetch<Blob, 'blob'>(url, { responseType: 'blob' }) // data: Blob

// ArrayBuffer - data: ArrayBuffer
const buffer = await miniFetch<ArrayBuffer, 'arrayBuffer'>(url, { responseType: 'arrayBuffer' }) // data: ArrayBuffer

// FormData - data: FormData
const formData = await miniFetch<FormData, 'formData'>(url, { responseType: 'formData' }) // data: FormData
```

### 타임아웃

```typescript
await miniFetch(url, { timeout: 3000 }) // 3초 후 TimeoutError 발생
```

### 커스텀 AbortSignal

```typescript
const controller = new AbortController()

// 요청을 수동으로 중단
setTimeout(() => controller.abort(), 5000)

try {
  await miniFetch(url, { signal: controller.signal })
} catch (e) {
  if (e instanceof RequestError) {
    console.log('요청이 중단되었습니다')
  }
}
```

### POST 요청 바디

```typescript
// 일반 객체는 자동으로 JSON으로 직렬화됨
await miniFetch(url, {
  method: 'POST',
  json: { name: 'Jane Doe' },
})

// FormData, Blob, ArrayBuffer는 body로 전달됨
await miniFetch(url, {
  method: 'POST',
  body: new FormData(),
})
```

### 헬퍼 메서드

```typescript
import { get, post, put, patch, del, head } from '@mynopkg/mini-fetch'

// JSON 응답 (기본값)
const users = await get<User[]>('https://api.example.com/users')
await post('https://api.example.com/users', { json: { name: 'Jane Doe' } })
await del('https://api.example.com/users/1')

// Text 응답
const content = await get<string, 'text'>('/content', { responseType: 'text' })

// Blob 응답 (파일 다운로드 등)
const file = await get<Blob, 'blob'>('/download/file', { responseType: 'blob' })

// ArrayBuffer 응답
const buffer = await get<ArrayBuffer, 'arrayBuffer'>('/data', { responseType: 'arrayBuffer' })

// FormData 응답
const form = await get<FormData, 'formData'>('/form', { responseType: 'formData' })
```

### `create()` — 클라이언트 인스턴스

기본 URL과 기본 옵션을 사용하여 재사용 가능한 클라이언트 인스턴스를 생성합니다:

```typescript
import { create } from '@mynopkg/mini-fetch'

// baseUrl만 지정
const api = create('https://api.example.com')

await api.get<User[]>('/users')
await api.post('/users', { json: { name: 'Jane Doe' } })
await api.put('/users/1', { json: { name: 'John Doe' } })
await api.patch('/users/1', { json: { name: 'Johnny' } })
await api.del('/users/1')
await api.head('/users')
```

#### 기본 옵션 사용 (headers, timeout 등)

```typescript
const api = create('https://api.example.com', {
  headers: {
    Authorization: 'Bearer token123',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

// headers와 timeout이 모든 요청에 적용됨
await api.get<User[]>('/users')

// Text 응답
await api.get<string, 'text'>('/content', { responseType: 'text' })

// Blob 응답 (파일 다운로드 등)
await api.get<Blob, 'blob'>('/download/file', { responseType: 'blob' })

// ArrayBuffer 응답
await api.get<ArrayBuffer, 'arrayBuffer'>('/data', { responseType: 'arrayBuffer' })

// FormData 응답
await api.get<FormData, 'formData'>('/form', { responseType: 'formData' })

// 요청별로 기본 headers 오버라이드 또는 확장
await api.post('/users', {
  json: { name: 'Jane Doe' },
  headers: { 'X-Custom-Header': 'value' }, // 기본값과 병합됨
})
```

## 에러 처리

```typescript
import { miniFetch, HttpError, TimeoutError, RequestError } from '@mynopkg/mini-fetch'

try {
  await miniFetch('https://api.example.com/users')
} catch (e) {
  if (e instanceof HttpError) {
    console.log(e.status) // 404, 500, 등
    console.log(e.method) // 'GET'
    console.log(e.url)
  } else if (e instanceof TimeoutError) {
    console.log(e.timeout) // ms
  } else if (e instanceof RequestError) {
    console.log(e.message)
  }
}
```

## 옵션

| 옵션           | 타입                                                        | 기본값       | 설명                          |
| -------------- | ----------------------------------------------------------- | ------------ | ----------------------------- |
| `method`       | `GET \| POST \| PUT \| PATCH \| DELETE \| HEAD`             | `GET`        | HTTP 메서드                   |
| `body`         | `BodyInit`                                                  | —            | 요청 body                     |
| `json`         | `Record<string, unknown> \| unknown[]`                      | —            | JSON으로 자동 직렬화되는 body |
| `headers`      | `HeadersInit`                                               | —            | 요청 headers                  |
| `responseType` | `'json' \| 'text' \| 'blob' \| 'arrayBuffer' \| 'formData'` | `'json'`     | 응답 파싱 타입                |
| `timeout`      | `number`                                                    | `0` (비활성) | timeout (밀리초)              |
| `signal`       | `AbortSignal`                                               | —            | 외부 abort 신호               |

## 라이선스

ISC

## 기여

이슈와 풀 리퀘스트는 언제든지 환영합니다!
사용 중 버그를 발견하거나 기능 요청을 원한다면 [GitHub](https://github.com/mynopkg/mini-fetch/issues)에서 이슈를 열어주세요.
