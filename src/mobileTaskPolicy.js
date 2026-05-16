const TASKS = {
  work_order_note: { offline: true, needsCurrentStock: false, risk: 'low' },
  labor_entry: { offline: true, needsCurrentStock: false, risk: 'low' },
  meter_reading: { offline: true, needsCurrentStock: false, risk: 'medium' },
  photo_attachment: { offline: true, needsCurrentStock: false, risk: 'low' },
  parts_request: { offline: true, needsCurrentStock: true, risk: 'medium' },
  inventory_adjustment: { offline: false, needsCurrentStock: true, risk: 'high' },
  final_approval: { offline: false, needsCurrentStock: false, risk: 'high' },
  payment_change: { offline: false, needsCurrentStock: false, risk: 'high' },
  api_token_create: { offline: false, needsCurrentStock: false, risk: 'high' }
};

function getTaskPolicy(taskName) {
  return TASKS[taskName] || { offline: false, needsCurrentStock: false, risk: 'unknown' };
}

function canQueueOffline(taskName, context = {}) {
  const policy = getTaskPolicy(taskName);
  if (!policy.offline) return { allowed: false, reason: 'online_only' };
  if (policy.needsCurrentStock && context.requiresImmediateStockCommit) {
    return { allowed: false, reason: 'requires_current_stock' };
  }
  return { allowed: true, risk: policy.risk };
}

module.exports = { TASKS, getTaskPolicy, canQueueOffline };
