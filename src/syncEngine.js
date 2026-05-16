const { nextSendable, markSyncing, applySyncResult } = require('./offlineQueue');

function validateMutation(item, serverRecord, policy) {
  if (!policy.allowedActions.includes(item.action)) {
    return { status: 'blocked', reason: 'action_not_allowed' };
  }
  if (!policy.offlineActions.includes(item.action)) {
    return { status: 'blocked', reason: 'online_only_action' };
  }
  if (!serverRecord) {
    return { status: 'blocked', reason: 'entity_missing' };
  }
  if (serverRecord.status === 'closed') {
    return { status: 'conflict', reason: 'entity_closed', serverVersion: serverRecord.version };
  }
  if (serverRecord.version !== item.entityVersion) {
    return { status: 'conflict', reason: 'server_changed', serverVersion: serverRecord.version };
  }
  return { status: 'accepted', serverVersion: serverRecord.version + 1 };
}

function processOne(queue, serverState, policy) {
  const item = nextSendable(queue);
  if (!item) return { queue, processed: null };
  const syncing = markSyncing(item);
  const serverRecord = serverState[item.entityId];
  const result = validateMutation(syncing, serverRecord, policy);
  const updated = applySyncResult(syncing, result);
  return {
    processed: updated,
    queue: queue.map(entry => entry.id === item.id ? updated : entry)
  };
}

module.exports = { validateMutation, processOne };
