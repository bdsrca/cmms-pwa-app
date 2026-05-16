# Mobile Optimization

Mobile optimization in a CMMS starts with repeated field workflows, not with screen resizing.
Technicians need to finish tasks quickly while standing near equipment, walking through a facility,
or working with inconsistent connectivity.

## Main Mobile Workflows

- View assigned work orders
- Search equipment and inventory
- Scan an asset tag or QR code
- Add notes and photos
- Add labor time
- Record a meter reading
- Request parts
- Update work status
- Close a work order
- Review alerts
- Approve work as a supervisor
- Check the offline queue

## Navigation

Mobile navigation should prioritize field tasks before administrative tasks.

Primary mobile navigation:

- Work Orders
- Equipment
- Inventory
- Alerts
- Search
- Offline Queue

Secondary navigation:

- Reports
- Billing
- API Tokens
- AI Usage
- Tenant Settings
- Admin Configuration

The mobile shell should avoid deep menus for common technician work. Search, scan, and assigned
work should be reachable within one or two taps after launch.

## Layout

Dense desktop screens should become task-oriented mobile screens.

Recommended layout behavior:

- Use one primary column on small screens.
- Keep the main action close to the bottom of the screen.
- Use sticky save bars for long forms.
- Turn wide tables into stacked rows.
- Place filters in a sheet or drawer.
- Keep destructive actions separated from normal save actions.
- Use compact summaries at the top and details below.
- Do not rely on hover-only controls.

Example work-order mobile row:

- Work-order safe display ID
- Asset name
- Status
- Priority
- Due date
- Assigned person or team
- One primary action such as `Open`

Secondary data can appear after expansion.

## Forms

Long CMMS forms should be split into sections:

- Basic details
- Labor
- Parts
- Meter readings
- Attachments
- Status
- Review and submit

Each section should autosave locally. A failed network request should not clear the form.

Field behavior:

- Numeric fields use numeric keyboards.
- Date fields use date-aware inputs.
- Attachment fields support camera capture where the platform allows it.
- Required fields are visible before submit.
- Validation errors appear next to the field that caused them.
- The submit button explains whether the action saves locally or sends to the server.

## Offline Status

Offline state should be visible and specific.

Useful labels:

- `Online`
- `Offline`
- `Saved locally`
- `Waiting to sync`
- `Syncing`
- `Synced`
- `Needs review`
- `Failed to sync`

Avoid a single vague offline banner. The user needs to know whether the current record is safe,
waiting, or blocked.

## Performance

Recommended mobile performance defaults:

- Keep the initial app shell small.
- Lazy-load charts, report builders, billing pages, token pages, and admin screens.
- Use route-level code splitting.
- Use server pagination for long lists.
- Fetch only fields needed for the current mobile card.
- Compress uploaded photos before upload where quality allows.
- Generate thumbnails instead of rendering full-size images in lists.
- Defer large dashboard widgets until visible.
- Avoid shipping desktop-only chart libraries to technician routes.
- Cache static assets with versioned names.

## Accessibility and Field Use

Mobile field work may happen with gloves, poor lighting, noise, vibration, and limited attention.

Controls should use clear labels, large tap targets, visible focus states, and explicit error
messages. Do not rely only on color to communicate status. Keep contrast high and avoid small
icons without labels for critical actions.

## Mobile Testing Checklist

- The app opens cleanly on narrow phone widths.
- Navigation remains usable with one hand.
- Work-order close flow does not require horizontal scrolling.
- Long notes and attachment names do not break layout.
- Offline status is visible before and after submit.
- Failed sync attempts preserve user input.
- Camera upload works on supported mobile browsers.
- Critical screens work in portrait and tablet widths.
- Admin pages remain usable even if optimized primarily for desktop.
