const crypto = require('crypto');

const RETRYABLE_RESULTS = new Set(['network_error', 'timeout', 'server_busy']);
const TERMINAL_STATUSES = new Set(['synced', 'blocked']);

function makeIdempotencyKey({ tenantId, actorId, entityType, entityId, action, clientCreatedAt }) {
  if (!tenantId || !actorId || !entityType || !entityId || !action || !clientCreatedAt) {
    throw new Error('missing fields for idempotency key');
  }
  return crypto
    .createHash('sha256')
    .update(`${tenantId}:${actorId}:${entityType}:${entityId}:${action}:${clientCreatedAt}`)
    .digest('hex')
    .slice(0, 32);
}

function createQueueItem(input) {
  const createdAt = input.clientCreatedAt || new Date().toISOString();
  const idempotencyKey = input.idempotencyKey || makeIdempotencyKey({ ...input, clientCreatedAt: createdAt });
  return {
    id: input.id || `local_${idempotencyKey.slice(0, 10)}`,
    tenantId: input.tenantId,
    actorId: input.actorId,
    entityType: input.entityType,
    entityId: input.entityId,
    entityVersion: input.entityVersion,
    action: input.action,
    payload: sanitizePayload(input.payload || {}),
    status: 'queued',
    retryCount: 0,
    idempotencyKey,
    clientCreatedAt: createdAt,
    lastAttemptAt: null,
    lastResult: null
  };
}

function sanitizePayload(payload) {
  const copy = { ...payload };
  for (const key of Object.keys(copy)) {
    if (/password|secret|token|card|ssn/i.test(key)) {
      copy[key] = '[redacted]';
    }
  }
  return copy;
}

function enqueue(queue, item) {
  if (queue.some(existing => existing.idempotencyKey === item.idempotencyKey)) {
    return queue;
  }
  return [...queue, item];
}

function nextSendable(queue) {
  return queue.find(item => item.status === 'queued' || (item.status === 'retry' && shouldRetry(item)));
}

function markSyncing(item, now = new Date().toISOString()) {
  if (TERMINAL_STATUSES.has(item.status)) return item;
  return { ...item, status: 'syncing', lastAttemptAt: now };
}

function applySyncResult(item, result) {
  if (!result || !result.status) throw new Error('sync result must include status');
  if (result.status === 'accepted') {
    return { ...item, status: 'synced', lastResult: 'accepted', serverVersion: result.serverVersion };
  }
  if (result.status === 'conflict') {
    return { ...item, status: 'needs_review', lastResult: result.reason || 'version_conflict', serverVersion: result.serverVersion };
  }
  if (result.status === 'retry') {
    return { ...item, status: 'retry', retryCount: item.retryCount + 1, lastResult: result.reason || 'network_error' };
  }
  return { ...item, status: 'blocked', lastResult: result.reason || 'blocked' };
}

function shouldRetry(item, maxRetries = 3) {
  return item.retryCount < maxRetries && RETRYABLE_RESULTS.has(item.lastResult);
}

function summarizeQueue(queue) {
  return queue.reduce((acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { total: 0 });
}

module.exports = { createQueueItem, enqueue, nextSendable, markSyncing, applySyncResult, shouldRetry, summarizeQueue, sanitizePayload, makeIdempotencyKey };
