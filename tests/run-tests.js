const assert = require('assert');
const { createQueueItem, enqueue, applySyncResult, shouldRetry, sanitizePayload } = require('../src/offlineQueue');
const { validateMutation } = require('../src/syncEngine');
const { cacheStrategyFor } = require('../src/cacheStrategy');
const { canUseFeature } = require('../src/entitlementPolicy');
const { createToken, verifyToken, hashToken } = require('../src/tokenPolicy');
const { checkAiRequest, estimateTokens, sanitizePromptMetadata } = require('../src/aiBudgetGuard');
const { canQueueOffline } = require('../src/mobileTaskPolicy');
const entitlements = require('../data/sample-entitlements.json');

const baseInput = {
  tenantId: 't1', actorId: 'u1', entityType: 'work_order', entityId: 'WO-1',
  entityVersion: 2, action: 'work_order_note', clientCreatedAt: '2026-01-01T00:00:00.000Z',
  payload: { note: 'ok', apiToken: 'secret' }
};

const item = createQueueItem(baseInput);
assert.equal(item.status, 'queued');
assert.equal(item.payload.apiToken, '[redacted]');
assert.equal(enqueue([item], item).length, 1, 'duplicate idempotency key should not enqueue twice');

const accepted = applySyncResult(item, { status: 'accepted', serverVersion: 3 });
assert.equal(accepted.status, 'synced');

const retryItem = applySyncResult(item, { status: 'retry', reason: 'network_error' });
assert.equal(shouldRetry(retryItem), true);

const conflict = validateMutation(item, { id: 'WO-1', version: 3, status: 'open' }, { allowedActions: ['work_order_note'], offlineActions: ['work_order_note'] });
assert.equal(conflict.status, 'conflict');
assert.equal(conflict.reason, 'server_changed');

assert.equal(cacheStrategyFor({ method: 'GET', path: '/billing' }).strategy, 'online_only');
assert.equal(cacheStrategyFor({ method: 'GET', path: '/styles/app.css' }).strategy, 'cache_first');

assert.deepEqual(canUseFeature(entitlements, 'mobile_pwa'), { allowed: true });
assert.equal(canUseFeature(entitlements, 'api_access', { apiTokens: 5 }).allowed, false);

const token = createToken({ tenantId: 't1', scopes: ['reports:read'] });
assert.notEqual(token.raw, token.record.tokenHash);
assert.equal(hashToken(token.raw), token.record.tokenHash);
assert.equal(verifyToken(token.raw, token.record, 'reports:read').allowed, true);
assert.equal(verifyToken(token.raw, token.record, 'work_orders:write').reason, 'scope_missing');

assert.ok(estimateTokens('one two three') >= 4);
const ai = checkAiRequest({ tenantPolicy: { enabled: true, allowedFeatures: ['summary'], perRequestTokenCap: 100, monthlyTokenCap: 1000, defaultRoute: 'small' }, feature: 'summary', prompt: 'short prompt', currentUsage: 0 });
assert.equal(ai.allowed, true);
assert.equal(checkAiRequest({ tenantPolicy: { enabled: false, allowedFeatures: [], perRequestTokenCap: 100, monthlyTokenCap: 1000 }, feature: 'summary', prompt: 'x' }).reason, 'ai_disabled');
assert.equal(sanitizePromptMetadata({ prompt: 'hello world', feature: 'x' }).estimatedTokens, 3);

assert.equal(canQueueOffline('work_order_note').allowed, true);
assert.equal(canQueueOffline('payment_change').reason, 'online_only');

assert.equal(sanitizePayload({ cardNumber: '4111', visible: 'ok' }).cardNumber, '[redacted]');

console.log('All tests passed.');
