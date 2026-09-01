# @mynopkg/mini-fetch

## 0.4.2

### Patch Changes

- [#27](https://github.com/mynopkg/mini-fetch/pull/27) [`d6553e8`](https://github.com/mynopkg/mini-fetch/commit/d6553e8f199b13d27c46fa3dbcf6d404fcb110dd) Thanks [@mynolog](https://github.com/mynolog)! - Improve `responseType.data` type inference based on `responseType` option using conditional mapping.

## 0.4.1

### Patch Changes

- [#25](https://github.com/mynopkg/mini-fetch/pull/25) [`206b39f`](https://github.com/mynopkg/mini-fetch/commit/206b39fee10ebb9cafe19343246e17694c8d5b10) Thanks [@mynolog](https://github.com/mynolog)! - MSW (Mock Service Worker) to improve the testing environment and fixes header handling and response parsing issues in the miniFetch and client modules.
  - Established MSW-based Mock Testing Environment: Introduced the msw package and configured vitest.setup.ts to manage the API mocking lifecycle globally across test runs.
  - Refactored Core Logic & Resolved Bugs: Switched to standard Headers instances in miniFetch to fix header merging issues and updated response parsing to correctly return undefined for HEAD requests and 204 responses.
  - Enhanced CI/CD & Integration Tests: Replaced manual fetch mocking with MSW integration tests and configured workflow path ignores for documentation to prevent unnecessary CI runs.

## 0.4.0

### Minor Changes

- [#20](https://github.com/mynopkg/mini-fetch/pull/20) [`b08167e`](https://github.com/mynopkg/mini-fetch/commit/b08167e358ba8203f516ad2795e9268ca6bcd884) Thanks [@mynolog](https://github.com/mynolog)! - Overhaul core architecture, standardize error handling, and expand response parsing
  - **Refactored Core Architecture:** Restructured miniFetch client logic for better maintainability.
  - **Standardized Error Handling:** Refined error branching (`HttpError`, `TimeoutError`, `RequestError`).
  - **Enhanced Response Parsing:** Expanded `MiniFetchResponseType` to support `formData` and `204 No Content`.
  - **Updated Test Suite:** Improved test isolation and Vitest mock overrides.
