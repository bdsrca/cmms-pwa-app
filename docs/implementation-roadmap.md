# Implementation Roadmap

This roadmap keeps the work incremental. Each phase produces a usable surface without requiring
the entire platform to be rebuilt at once.

## Phase 1: Mobile Field Workflows

- Audit current work-order, equipment, inventory, and alert screens.
- Convert dense tables into mobile rows.
- Add sticky primary actions for long forms.
- Add mobile-friendly input types.
- Add camera and attachment flows where supported.
- Add clear loading, empty, and error states.
- Verify phone, tablet, and desktop widths.

Exit criteria: technicians can open, update, and review work orders on a phone without horizontal
scrolling or desktop-only controls.

## Phase 2: PWA Shell

- Add manifest.
- Add icons.
- Add service worker.
- Add app shell cache.
- Add offline fallback.
- Add update prompt.
- Add install entry point.

Exit criteria: supported browsers can install the app and open a cached shell with a clear offline
message when the network is unavailable.

## Phase 3: Offline Drafts

- Add local draft storage.
- Add sync queue.
- Add idempotency keys.
- Add sync status labels.
- Add retry behavior.
- Add conflict detection.
- Add review screen for conflicting edits.

Exit criteria: supported work-order edits survive a network drop and sync safely after reconnect.

## Phase 4: Internal Billing Foundation

- Add billing account records.
- Add plan and entitlement records.
- Add invoice metadata.
- Add billing audit logs.
- Add read-only entitlement checks.

Exit criteria: access to paid modules can be controlled by internal entitlement state.

## Phase 5: Payment Provider Integration

- Add server-created checkout session.
- Add webhook verification.
- Add payment event idempotency.
- Add invoice state updates.
- Add entitlement recalculation.
- Add reconciliation report.

Exit criteria: verified provider events update billing state without relying on client callbacks.

## Phase 6: API Token Management

- Add token creation UI.
- Generate high-entropy tokens.
- Store token hashes and prefixes.
- Add scopes.
- Add expiry.
- Add revocation.
- Add rotation.
- Add route-level scope checks.
- Add token audit logs and rate limits.

Exit criteria: integrations can use scoped tenant tokens without exposing raw token values after
creation.

## Phase 7: AI Gateway and Budgets

- Add AI feature policies.
- Add tenant budget records.
- Add model route allowlist.
- Add server-side gateway.
- Add usage estimation.
- Add usage logging.
- Add budget alerts.
- Add admin usage dashboard.

Exit criteria: AI features run through a controlled server-side policy layer with tenant-aware
usage tracking.

## Phase 8: Operational Hardening

- Add monitoring for sync failures.
- Add billing webhook retry dashboards.
- Add token denial reports.
- Add AI budget and error dashboards.
- Add support runbooks.
- Add public-safe screenshot review process.

Exit criteria: support can diagnose common mobile, payment, token, and AI usage issues without
reading private payloads.
