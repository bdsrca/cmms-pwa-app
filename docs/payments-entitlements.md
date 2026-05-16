# Payments and Entitlements

Payments are not the main feature of a CMMS PWA, but entitlements are part of the platform boundary.

A tenant may be entitled to:

- mobile PWA access;
- offline draft queues;
- API access;
- export limits;
- AI-assisted summaries;
- premium support or admin features.

Those entitlements should come from server-side billing records, not browser trust.

![Payment entitlement flow](../assets/payment-entitlement-flow.svg)

## Internal records

- `billing_account`
- `subscription`
- `invoice`
- `payment_event`
- `credit_adjustment`
- `module_entitlement`
- `usage_record`
- `billing_audit_log`

## Rules

- The payment provider handles card collection.
- The application stores no raw card data.
- Webhook signatures are verified.
- Provider event IDs are idempotent.
- Entitlements change only after verified billing state.
- Client callbacks can update UI, but they should not be the source of truth.
