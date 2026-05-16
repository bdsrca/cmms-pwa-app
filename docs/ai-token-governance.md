# AI Token Governance

AI token governance controls model usage, tenant budgets, feature access, provider routing, and
logging policy. It is separate from API token authentication.

API tokens answer who can call the system. AI token governance answers how much AI usage is
allowed and under which policy.

## Gateway Boundary

The browser should not call a model provider directly with a provider secret. AI requests should
pass through a server-side gateway.

Gateway checks:

- authenticated user or service account
- tenant status
- feature enabled
- user role
- model route allowlist
- monthly tenant budget
- optional user budget
- prompt and tool safety policy
- logging and retention policy

Only after those checks should the gateway call the model provider.

## Budget Model

Budgets can apply at several levels:

- tenant monthly token budget
- tenant monthly cost budget
- user daily token budget
- feature-level budget
- model route budget
- high-cost model approval
- trial account limit

The system should support hard limits and warning thresholds. A tenant admin can receive alerts
before usage is fully blocked.

## Usage Log

AI usage logs should record metadata:

- tenant reference
- actor reference
- feature name
- model route
- prompt category
- estimated prompt tokens
- actual prompt tokens when available
- completion tokens
- cost estimate
- cache hit or miss
- safety result
- request status
- created timestamp

Logs should not store raw work-order notes, private manuals, payment data, credentials, or full
prompts unless there is a clear retention policy and user-facing control.

## Feature Examples

CMMS AI features can include:

- summarize work-order history
- suggest troubleshooting steps
- convert plain language into report filters
- summarize technician notes
- draft preventive maintenance instructions
- explain inventory shortage risk
- answer help questions from approved documentation

Each feature should have its own policy because the risk profile is different. A help question
against public documentation is lower risk than an action that changes operational data.

## Provider Routing

Provider routing should be server-side.

The policy can route by:

- feature
- tenant plan
- sensitivity level
- cost target
- latency requirement
- region requirement

The UI should not receive provider credentials or hidden model routing details.

## Guardrails

Recommended guardrails:

- deny autonomous destructive actions
- require confirmation before operational changes
- redact secrets before logging
- limit prompt size
- enforce feature-specific tool access
- store citations or evidence references where applicable
- keep usage metadata separate from raw content
- provide admin controls for disabling AI features

## Reporting

Admin reporting should show:

- usage by feature
- usage by user or service actor
- usage by model route
- blocked requests
- budget remaining
- cost estimate
- error rate
- cache hit rate

Reports should be aggregated by default and avoid exposing private prompt content.
