# Source-Code Map

The source examples are small on purpose. Each file represents one production concern without requiring private application code.

| File | What it shows |
| --- | --- |
| `src/offlineQueue.js` | Queue item creation, payload redaction, idempotency, retry state, and status summary. |
| `src/syncEngine.js` | Server-side validation of queued mutations. |
| `src/cacheStrategy.js` | Route classification for cache-first, network-first, queue-supported, and online-only behavior. |
| `src/entitlementPolicy.js` | Module and limit checks. |
| `src/tokenPolicy.js` | API token hashing and scope verification. |
| `src/aiBudgetGuard.js` | AI request budget checks and safe metadata logging. |
| `src/mobileTaskPolicy.js` | Offline eligibility by task type. |
| `src/demo.js` | A small end-to-end scenario. |
| `tests/run-tests.js` | Assertions for the main rules. |

Run:

```bash
npm test
npm run demo
```
