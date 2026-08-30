import { http, HttpResponse } from 'msw'

import { TEST_URLS } from '../constants'

export const handlers = [
  http.get(TEST_URLS.API_USER, () => {
    return HttpResponse.json({
      id: 1,
      name: 'John Doe',
      role: 'test',
    })
  }),

  http.post(TEST_URLS.API_USER, () => {
    return HttpResponse.json({
      id: 1,
      name: 'John Doe',
      role: 'test',
    })
  }),

  http.put(`${TEST_URLS.API_USER}/:id`, () => {
    return HttpResponse.json({
      id: 2,
      name: 'Jane Doe',
      role: 'test',
    })
  }),

  http.patch(`${TEST_URLS.API_USER}/:id`, () => {
    return HttpResponse.json({
      id: 3,
      name: 'James Doe',
      role: 'test',
    })
  }),

  http.delete(`${TEST_URLS.API_USER}/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.head(`${TEST_URLS.API_USER}/:id`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
]
