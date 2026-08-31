---
'@mynopkg/mini-fetch': patch
---

MSW (Mock Service Worker) to improve the testing environment and fixes header handling and response parsing issues in the miniFetch and client modules.

- Established MSW-based Mock Testing Environment: Introduced the msw package and configured vitest.setup.ts to manage the API mocking lifecycle globally across test runs.
- Refactored Core Logic & Resolved Bugs: Switched to standard Headers instances in miniFetch to fix header merging issues and updated response parsing to correctly return undefined for HEAD requests and 204 responses.
- Enhanced CI/CD & Integration Tests: Replaced manual fetch mocking with MSW integration tests and configured workflow path ignores for documentation to prevent unnecessary CI runs.
