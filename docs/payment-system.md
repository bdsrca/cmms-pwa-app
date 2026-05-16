# Internal Payment System

The internal payment system manages billing state without storing raw card data. The CMMS keeps
account, plan, invoice, credit, entitlement, usage, and audit records. A payment provider handles
payment methods, card details, authorization, settlement, and provider compliance requirements.

## Boundary

The CMMS stores:

- billing account reference
- subscription plan
- enabled modules
- invoice metadata
- payment status
- internal credits and adjustments
- entitlement state
- usage records
- billing audit logs

The payment provider stores:

- card data
- payment method
- payment authorization
- settlement state
- provider risk checks

The browser should never receive provider secrets. The server creates checkout sessions and
processes verified webhooks.

## Core Records

Suggested records:

- `BillingAccount`
- `Subscription`
- `Plan`
- `PlanModule`
- `Invoice`
- `PaymentEvent`
- `Entitlement`
- `CreditAdjustment`
- `UsageRecord`
- `BillingAuditLog`

Each record should have a public-safe reference for UI display and internal primary keys for
database relations.

## Create Subscription

1. Billing admin selects a plan and modules.
2. Server validates billing permission.
3. Server creates a provider checkout session.
4. Provider collects payment details.
5. Provider sends a verified webhook.
6. CMMS stores the payment event.
7. Invoice and subscription state update.
8. Entitlements update.
9. Billing audit log records the change.

The client callback can show a pending or success screen, but it should not be the source of truth.

## Change Plan

1. Admin selects the new plan.
2. System previews effective date, module changes, and estimated price.
3. Server validates permission and current account state.
4. Provider updates subscription or creates a new billing session.
5. Verified webhook updates internal state.
6. Entitlements are recalculated.

Plan changes should be auditable because they affect access to paid modules.

## Credits and Adjustments

Internal credits should be ledger entries, not direct invoice edits without history.

A credit adjustment should record:

- billing account
- amount
- currency or internal credit unit
- reason
- actor
- approval reference when required
- created timestamp
- linked invoice when applied

## Payment Failure

1. Provider sends failure event.
2. CMMS records failure status.
3. Admin and billing contacts see the issue.
4. System applies grace-period policy.
5. Entitlements stay active, limited, or suspended according to configuration.
6. Audit log records status and policy result.

Failure handling should avoid surprise lockouts for technicians in the middle of operational work.

## Webhooks

Webhook handling should be idempotent.

Rules:

- Verify signature before parsing business meaning.
- Store provider event reference.
- Ignore duplicate provider event references.
- Process invoice and entitlement changes in a transaction.
- Log webhook failures separately from normal application errors.
- Add a replay or reconciliation path for support.

## Access Control

Only authorized billing admins should manage plans, payment sessions, credits, and entitlement
overrides. Technicians should not see payment settings. Integration tokens should not receive
billing write scopes unless there is a specific administrative integration.

## Reconciliation

Billing state should be reconcilable against provider data.

Useful checks:

- invoices paid in provider but unpaid internally
- subscription canceled in provider but active internally
- duplicate webhook attempts
- entitlement mismatch after plan changes
- credits applied without approval
- failed payments older than grace policy
