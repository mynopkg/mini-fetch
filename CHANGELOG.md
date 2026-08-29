# @mynopkg/mini-fetch

## 0.4.0

### Minor Changes

- [#20](https://github.com/mynopkg/mini-fetch/pull/20) [`b08167e`](https://github.com/mynopkg/mini-fetch/commit/b08167e358ba8203f516ad2795e9268ca6bcd884) Thanks [@mynolog](https://github.com/mynolog)! - Overhaul core architecture, standardize error handling, and expand response parsing
  - **Refactored Core Architecture:** Restructured miniFetch client logic for better maintainability.
  - **Standardized Error Handling:** Refined error branching (`HttpError`, `TimeoutError`, `RequestError`).
  - **Enhanced Response Parsing:** Expanded `MiniFetchResponseType` to support `formData` and `204 No Content`.
  - **Updated Test Suite:** Improved test isolation and Vitest mock overrides.
