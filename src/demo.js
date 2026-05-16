const entitlements = require('../data/sample-entitlements.json');
const { createQueueItem, enqueue, summarizeQueue } = require('./offlineQueue');
const { processOne } = require('./syncEngine');
const { cacheStrategyFor } = require('./cacheStrategy');
const { canUseFeature } = require('./entitlementPolicy');
const { createToken, verifyToken } = require('./tokenPolicy');
const { checkAiRequest, sanitizePromptMetadata } = require('./aiBudgetGuard');
const { canQueueOffline } = require('./mobileTaskPolicy');

let queue = [];
const item = createQueueItem({
  tenantId: 'demo-tenant',
  actorId: 'tech-42',
  entityType: 'work_order',
  entityId: 'WO-1048',
  entityVersion: 7,
  action: 'work_order_note',
  payload: { note: 'Compressor is noisy after startup.', secretToken: 'should-not-log' },
  clientCreatedAt: '2026-04-01T12:00:00.000Z'
});
queue = enqueue(queue, item);

const syncResult = processOne(queue, {
  'WO-1048': { id: 'WO-1048', version: 7, status: 'open' }
}, {
  allowedActions: ['work_order_note', 'labor_entry', 'meter_reading', 'photo_attachment'],
  offlineActions: ['work_order_note', 'labor_entry', 'meter_reading', 'photo_attachment']
});

const token = createToken({ tenantId: 'demo-tenant', scopes: ['work_orders:read', 'reports:read'] });
const aiCheck = checkAiRequest({
  tenantPolicy: { enabled: true, allowedFeatures: ['work_order_summary'], perRequestTokenCap: 1200, monthlyTokenCap: entitlements.limits.aiMonthlyTokens, defaultRoute: 'small-summary-model' },
  feature: 'work_order_summary',
  prompt: 'Summarize the technician note and suggest what should be checked next.',
  currentUsage: 1200
});

const output = {
  offlineTask: canQueueOffline('work_order_note'),
  queueBeforeSync: summarizeQueue(queue),
  processed: syncResult.processed,
  cachePaymentRoute: cacheStrategyFor({ method: 'GET', path: '/billing/checkout' }),
  entitlementCheck: canUseFeature(entitlements, 'ai_assist', { aiMonthlyTokens: 1200 }),
  tokenVerification: verifyToken(token.raw, token.record, 'reports:read'),
  aiCheck,
  aiLogShape: sanitizePromptMetadata({ tenantId: 'demo-tenant', actorId: 'tech-42', feature: 'work_order_summary', sourceRecordType: 'work_order', sourceRecordId: 'WO-1048', promptCategory: 'summary', prompt: 'Summarize the work order.' })
};

console.log(JSON.stringify(output, null, 2));
