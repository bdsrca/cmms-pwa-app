# PWA Implementation

The PWA layer makes the CMMS installable where supported and improves repeat visits through a
cached app shell. It should not weaken authentication, payment safety, tenant isolation, or server
permission checks.

## Files and Capabilities

Core PWA files:

- `manifest.webmanifest`
- service worker script
- offline fallback route
- install icons
- update prompt component
- versioned cache names
- cache cleanup logic

The manifest describes the application name, start URL, icons, display mode, theme color,
background color, and optional shortcuts.

The service worker handles:

- app shell caching
- static asset caching
- offline fallback
- cache version cleanup
- update lifecycle
- optional background sync where supported

## Cache Strategy

Different data types need different cache behavior.

Recommended defaults:

- App shell: cache-first with versioned invalidation
- Static assets: cache-first with hashed filenames
- Public help pages: stale-while-revalidate
- Authenticated CMMS API data: network-first or online-only
- Billing pages: online-only
- Token management pages: online-only
- AI provider calls: online-only
- Uploads: queued request or online-only depending on workflow

Payment and token routes should not be served from stale protected data. They depend on current
account state, permission state, and audit accuracy.

## Install Flow

The install prompt should appear after the user has context, not immediately on first page load.

Good trigger points:

- after a technician opens the app several times
- after a user completes a work-order workflow
- after an admin confirms mobile field usage
- from a visible `Install app` settings item

The prompt text should be practical: installing gives faster access and a home-screen entry point.
It should not promise full native-app behavior.

## Update Flow

Service worker updates can leave users on old code until a refresh. A CMMS should make updates
visible because stale UI can conflict with server validation.

Recommended behavior:

1. New service worker installs in the background.
2. UI shows `Update available`.
3. User can finish current form.
4. User confirms update.
5. App refreshes and uses the new shell.

Do not force refresh while a user is editing a work order unless the current version is unsafe.

## Offline Fallback

The offline page should explain what still works:

- open locally cached shell
- view queued drafts
- continue draft edits
- retry sync when online

It should also explain what does not work:

- payment changes
- token creation
- AI requests
- live report exports
- server-confirmed close or approval actions

## PWA Verification Checklist

- Manifest is valid.
- Required icons exist.
- App can be installed on supported browsers.
- Offline fallback appears when network is unavailable.
- Old caches are removed during activation.
- Protected routes do not expose stale sensitive data.
- Update prompt does not destroy unsaved field work.
- Payment, token, and AI gateway routes remain server-controlled.
