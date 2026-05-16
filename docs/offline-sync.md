# Offline Sync

Offline support should be scoped and visible. A CMMS should not pretend every action can complete
without a network connection. The safer approach is to support local drafts and queued mutations
for field workflows that can be validated later.

## Offline-Safe Workflows

Good candidates:

- work-order notes
- labor entries
- meter readings
- inspection checklist answers
- parts request drafts
- photo attachments waiting for upload
- status change requests

Poor candidates:

- payment changes
- entitlement changes
- API token creation
- AI provider calls
- final approvals that require current server state
- inventory adjustments that require strict real-time stock validation

## Queue Record

A queued mutation should include:

- local ID
- idempotency key
- tenant reference
- actor reference
- entity reference
- entity version
- action type
- sanitized payload
- created timestamp
- last attempt timestamp
- retry count
- status

The payload can live in IndexedDB or another local storage layer suitable for structured offline
data. Sensitive data should be minimized because local device storage is not a server trust
boundary.

## Sync Flow

1. User edits a supported workflow.
2. App stores the draft locally.
3. Draft enters the sync queue.
4. Network listener or manual retry starts sync.
5. API verifies session, tenant, role, entity access, and idempotency.
6. API compares entity version.
7. Mutation applies or returns `needs_review`.
8. Client updates local status.

## Conflict Handling

Conflicts happen when the server record changed while the device was offline.

Recommended conflict states:

- `server_changed`
- `permission_changed`
- `entity_closed`
- `entity_deleted`
- `inventory_changed`
- `validation_failed`

The user should see a review screen with the local draft and current server state. The app should
avoid silently overwriting server data.

## Retry Behavior

Retries should use backoff and preserve idempotency.

The app should stop retrying automatically when:

- the user signs out
- the tenant context changes
- the action is no longer permitted
- the entity no longer exists
- the server returns a non-retryable validation error

## Observability

Useful sync metrics:

- queued drafts by device
- sync success rate
- conflict count by action type
- retry count by route
- oldest queued draft age
- upload failures
- local storage quota errors

Logs should store metadata and safe references, not full private notes or raw attachments.
