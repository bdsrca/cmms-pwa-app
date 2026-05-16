# API Token Governance

API tokens support integrations around the CMMS/EAM platform. They should be scoped, rotated, and auditable.

![API token lifecycle](../assets/api-token-lifecycle.svg)

## Token rules

- Generate high-entropy values.
- Show the raw token once.
- Store only a hash and display prefix.
- Bind the token to one tenant.
- Attach explicit scopes.
- Support expiry, rotation, and revocation.
- Log last-used metadata.
- Rate-limit by token and tenant.

## Example scopes

- `work_orders:read`
- `work_orders:write`
- `inventory:read`
- `reports:read`
- `reports:export`
- `webhooks:manage`
- `ai:invoke`

## Audit shape

A token audit event should store safe metadata:

- token id;
- display prefix;
- tenant reference;
- route and method;
- required scope;
- result;
- timestamp;
- no raw token value.
