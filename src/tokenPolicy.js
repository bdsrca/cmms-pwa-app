const crypto = require('crypto');

function createToken({ tenantId, scopes, expiresAt }) {
  if (!tenantId) throw new Error('tenantId required');
  if (!Array.isArray(scopes) || scopes.length === 0) throw new Error('scopes required');
  const raw = `cmms_${crypto.randomBytes(24).toString('base64url')}`;
  return {
    raw,
    record: {
      tenantId,
      tokenHash: hashToken(raw),
      displayPrefix: raw.slice(0, 12),
      scopes: [...new Set(scopes)].sort(),
      expiresAt: expiresAt || null,
      revokedAt: null,
      createdAt: new Date().toISOString()
    }
  };
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function verifyToken(raw, record, requiredScope, now = new Date()) {
  if (!raw || !record) return { allowed: false, reason: 'missing_token' };
  if (record.revokedAt) return { allowed: false, reason: 'revoked' };
  if (record.expiresAt && new Date(record.expiresAt) <= now) return { allowed: false, reason: 'expired' };
  if (hashToken(raw) !== record.tokenHash) return { allowed: false, reason: 'invalid' };
  if (!record.scopes.includes(requiredScope)) return { allowed: false, reason: 'scope_missing' };
  return { allowed: true, tenantId: record.tenantId, prefix: record.displayPrefix };
}

module.exports = { createToken, hashToken, verifyToken };
