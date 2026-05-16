# PWA Offline Sync

A PWA can make a CMMS feel faster and more resilient, but it should not pretend the browser is the source of truth.

## Cache policy

![PWA cache strategy](../assets/pwa-cache-strategy.svg)

| Route type | Suggested strategy |
| --- | --- |
| Static assets | Cache-first |
| App shell | Cache-first with update prompt |
| Operational reads | Network-first with short cache |
| Supported field writes | Queue locally, then sync |
| Billing, tokens, AI, final approvals | Online-only |

## Offline queue states

![Offline state machine](../assets/offline-sync-state-machine.svg)

A queue item should be visible to the user. Hidden offline queues create support problems because users cannot tell whether work is safe.

Useful states:

- `queued`
- `syncing`
- `synced`
- `needs_review`
- `blocked`
- `retry`

## Conflict handling

Conflicts are normal. They happen when a server record changes while a device is offline.

The app should show:

- the local draft;
- the current server state;
- the reason for the conflict;
- the action the user can take next.

The app should not silently overwrite server data.
