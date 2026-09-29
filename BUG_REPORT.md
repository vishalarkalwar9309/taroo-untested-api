# Bug Report

## 1. Pagination skips the first page
- **Expected:** `page=1&limit=10` returns records at indices 0–9.
- **Actual:** The service calculated offset as `page * limit`, so page 1 started at index 10.
- **Discovered:** Service and Supertest pagination tests.
- **Fix:** Use `(page - 1) * limit`.

## 2. Completing a task silently changes its priority
- **Expected:** Completing a task changes its status and completion timestamp, preserving unrelated fields.
- **Actual:** `completeTask` overwrote priority with `medium`.
- **Discovered:** Unit test completing a high-priority task.
- **Fix:** Preserve the existing task priority.

## 3. Status filtering performs substring matching
- **Expected:** A status filter should match the requested status exactly.
- **Actual:** `status.includes(statusQuery)` can match partial or invalid values.
- **Discovered:** Code review and service test.
- **Fix:** Compare `t.status === status`. (Intentionally reported; not modified in this submission.)

## 4. Pagination query values are not validated
- **Expected:** Reject invalid, zero, negative, or non-numeric page/limit values with 400.
- **Actual:** `parseInt(...) || default` silently substitutes defaults and accepts negative values.
- **Discovered:** Route review.
- **Fix:** Validate positive integers and return 400 for invalid input. (Not modified.)

## 5. PUT can overwrite server-managed fields
- **Expected:** Updates should restrict fields to supported mutable task properties.
- **Actual:** The service spreads arbitrary request fields onto the task, allowing callers to alter IDs/timestamps or add unexpected properties.
- **Discovered:** Service and route review.
- **Fix:** Whitelist mutable fields before updating. (Not modified.)
