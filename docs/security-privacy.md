# Security and Privacy

This repository is public-safe documentation. It avoids private tenant data, production URLs,
credentials, real payment payloads, API keys, AI provider keys, and customer names.

## Security Boundaries

Important boundaries:

- Browser cannot hold provider secrets.
- Offline drafts are not trusted until the server validates them.
- Service worker cache is not an authorization layer.
- Payment provider events must be verified before changing billing state.
- API tokens are stored as hashes.
- AI calls go through a server-side gateway.
- Tenant and role checks happen before operational data access.

## Data That Should Not Be Logged

Avoid logging:

- raw API tokens
- authorization headers
- payment method details
- full payment provider payloads
- raw AI provider keys
- raw private prompts
- work-order notes containing sensitive operational details
- full uploaded document text
- database connection strings
- session cookies

## Safer Logging

Prefer logging:

- tenant reference
- actor reference
- route
- feature name
- event type
- status
- error category
- token prefix
- provider event reference
- invoice reference
- usage totals
- timestamps

References should be public-safe or internal opaque IDs, not customer names.

## Tenant Isolation

Tenant isolation should be enforced in every read and write path:

- UI route loaders
- API handlers
- service methods
- background jobs
- sync endpoints
- billing records
- token records
- AI usage records

The database layer should make cross-tenant access difficult by requiring tenant context for
queries that read operational records.

## Secret Handling

Secrets should live in server-managed environment configuration or a secret manager.

Rules:

- Do not commit secrets.
- Do not expose provider keys to client bundles.
- Rotate secrets after suspected exposure.
- Keep separate keys for development, staging, and production.
- Avoid logging environment variables.

## Public Documentation Review

Before publishing screenshots or docs, check for:

- real emails
- customer names
- tenant IDs
- job IDs that reveal production systems
- production URLs
- visible tokens
- visible invoices
- visible payment information
- private operational notes
- internal-only branding that should not appear publicly
