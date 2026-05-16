# API Token System

API tokens support integrations, automation clients, import/export jobs, and controlled
machine-to-machine access. They should be tenant-scoped, least-privilege, auditable, and easy to
rotate.

## Token Responsibilities

An API token should answer:

- which tenant the request belongs to
- which integration or service account owns it
- which scopes it has
- whether it is active
- whether it is expired
- whether it is rate-limited
- when it was last used
- who created or rotated it

It should not act as a permanent administrator password.

## Token Shape

User-visible format:

```text
cmms_live_<random-secret>
```

Stored fields:

- token reference
- tenant reference
- display name
- display prefix
- token hash
- scopes
- status
- created by
- created timestamp
- last used timestamp
- expiry timestamp
- revoked timestamp

The raw token value is shown once. If it is lost, the user rotates the token.

## Scope Model

Common scopes:

- `work_orders:read`
- `work_orders:write`
- `inventory:read`
- `inventory:write`
- `equipment:read`
- `reports:read`
- `reports:export`
- `webhooks:manage`
- `ai:invoke`

Scopes should map to API route groups and service permissions. A token with report access should
not be able to modify inventory unless that scope is explicitly granted.

## Request Flow

1. Client sends `Authorization: Bearer <token>`.
2. Gateway hashes the bearer token.
3. Gateway looks up active token by hash.
4. Gateway checks expiry and revoked state.
5. Gateway checks required route scope.
6. Gateway applies tenant and token rate limits.
7. Gateway writes an audit event.
8. Request receives integration auth context.

The service layer should still check tenant boundaries using the auth context. The gateway should
not be the only tenant guard.

## Rotation

Rotation creates a new token and retires the old token after an optional grace window.

Recommended states:

- `active`
- `rotating`
- `revoked`
- `expired`

The UI should show token prefix, name, scopes, status, created date, expiry, and last-used date.
It should never show the full token after creation.

## Audit Events

Useful events:

- token created
- token rotated
- token revoked
- token expired
- token used
- token denied by scope
- token denied by rate limit
- token denied by tenant policy

Audit logs should include safe references and route metadata. They should not include full tokens,
request bodies with private operational data, or authorization headers.

## Rate Limits

Rate limits can apply at multiple levels:

- per token
- per tenant
- per route group
- per write operation
- per export operation

Export and AI invocation scopes usually need stricter limits than read-only operational routes.
