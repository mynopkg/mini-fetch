---
'@mynopkg/mini-fetch': minor
---

Overhaul core architecture, standardize error handling, and expand response parsing

- **Refactored Core Architecture:** Restructured miniFetch client logic for better maintainability.
- **Standardized Error Handling:** Refined error branching (`HttpError`, `TimeoutError`, `RequestError`).
- **Enhanced Response Parsing:** Expanded `MiniFetchResponseType` to support `formData` and `204 No Content`.
- **Updated Test Suite:** Improved test isolation and Vitest mock overrides.
