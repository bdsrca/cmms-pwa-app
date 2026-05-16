function hasModule(entitlements, moduleName) {
  return Boolean(entitlements && entitlements.modules && entitlements.modules[moduleName]);
}

function getLimit(entitlements, limitName, fallback = 0) {
  if (!entitlements || !entitlements.limits) return fallback;
  return entitlements.limits[limitName] ?? fallback;
}

function canUseFeature(entitlements, feature, usage = {}) {
  const checks = {
    offline_drafts: () => hasModule(entitlements, 'offline_drafts') && (usage.offlineQueueItems || 0) < getLimit(entitlements, 'offlineQueueItems', 0),
    api_access: () => hasModule(entitlements, 'api_access') && (usage.apiTokens || 0) < getLimit(entitlements, 'apiTokens', 0),
    ai_assist: () => hasModule(entitlements, 'ai_assist') && (usage.aiMonthlyTokens || 0) < getLimit(entitlements, 'aiMonthlyTokens', 0),
    mobile_pwa: () => hasModule(entitlements, 'mobile_pwa')
  };
  if (!checks[feature]) return { allowed: false, reason: 'unknown_feature' };
  return checks[feature]() ? { allowed: true } : { allowed: false, reason: 'not_entitled_or_limit_reached' };
}

module.exports = { hasModule, getLimit, canUseFeature };
