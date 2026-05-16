function classifyRequest({ method = 'GET', path = '' }) {
  const normalized = path.toLowerCase();
  if (/\.(js|css|png|svg|ico|webmanifest)$/.test(normalized)) return 'static_asset';
  if (normalized.includes('/offline')) return 'app_shell';
  if (normalized.includes('/billing') || normalized.includes('/payment')) return 'online_only';
  if (normalized.includes('/api-tokens') || normalized.includes('/tokens')) return 'online_only';
  if (normalized.includes('/ai/')) return 'online_only';
  if (method !== 'GET') return 'queue_or_network';
  if (normalized.includes('/api/work-orders') || normalized.includes('/api/assets')) return 'network_first';
  return 'network_first';
}

function cacheStrategyFor(request) {
  const type = classifyRequest(request);
  const strategies = {
    static_asset: { strategy: 'cache_first', reason: 'safe static file' },
    app_shell: { strategy: 'cache_first_with_update_prompt', reason: 'offline-capable shell' },
    network_first: { strategy: 'network_first_short_cache', reason: 'operational data can change' },
    queue_or_network: { strategy: 'queue_supported_actions_only', reason: 'mutations need server validation' },
    online_only: { strategy: 'online_only', reason: 'requires current permission, billing, or provider state' }
  };
  return { type, ...strategies[type] };
}

module.exports = { classifyRequest, cacheStrategyFor };
