import { afterEach, afterAll, beforeAll } from 'vitest'

import { mockServer } from './tests/mocks/node'

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
