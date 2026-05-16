function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(String(text).trim().split(/\s+/).filter(Boolean).length * 1.35);
}

function checkAiRequest({ tenantPolicy, feature, prompt, currentUsage = 0 }) {
  if (!tenantPolicy || !tenantPolicy.enabled) return { allowed: false, reason: 'ai_disabled' };
  if (!tenantPolicy.allowedFeatures.includes(feature)) return { allowed: false, reason: 'feature_not_allowed' };
  const estimate = estimateTokens(prompt);
  if (estimate > tenantPolicy.perRequestTokenCap) return { allowed: false, reason: 'request_too_large', estimate };
  if (currentUsage + estimate > tenantPolicy.monthlyTokenCap) return { allowed: false, reason: 'budget_exceeded', estimate };
  return { allowed: true, estimate, route: tenantPolicy.defaultRoute };
}

function sanitizePromptMetadata(input) {
  return {
    feature: input.feature,
    tenantId: input.tenantId,
    actorId: input.actorId,
    sourceRecordType: input.sourceRecordType,
    sourceRecordId: input.sourceRecordId,
    promptCategory: input.promptCategory,
    estimatedTokens: estimateTokens(input.prompt)
  };
}

module.exports = { estimateTokens, checkAiRequest, sanitizePromptMetadata };
