# Portfolio Notes

## Short version

Public-safe architecture showcase for a mobile-first CMMS/EAM PWA. The project covers field
work-order UX, installable PWA behavior, offline draft queues, sync conflict handling, payment
entitlements, API token lifecycle management, and AI usage governance.

## Resume bullet

Designed a future CMMS/EAM mobile PWA architecture with offline-safe technician workflows, tenant-scoped sync validation, entitlement-driven feature access, hashed API tokens, and budgeted AI assistance; included diagrams, implementation notes, runnable JavaScript examples, sample data, and tests.

## Interview talking points

- Offline convenience is separated from server authority.
- Mobile UX is treated as a workflow problem, not just responsive CSS.
- Risky routes stay online-only: billing, token creation, AI calls, and final approvals.
- Idempotency and version checks keep sync predictable.
- Token and AI governance are included because modern CMMS platforms are integration and
  automation platforms, not just work-order forms.

## What not to claim

Do not claim this public repo is a production deployment. It is a technical showcase and implementation guide.
