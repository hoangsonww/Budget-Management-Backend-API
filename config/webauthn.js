/**
 * WebAuthn / passkey relying-party (RP) configuration.
 *
 * The RP ID and origin are dictated by where the *browser* runs the ceremony
 * (the frontend), not by where this API is hosted. To support both local
 * development (frontend on http://localhost:3000) and production without
 * hard-coding a single domain, the values are resolved per-request:
 *
 *   - If WEBAUTHN_ORIGINS (or RP_ORIGIN) is set, it acts as a strict allowlist
 *     of acceptable origins. Requests from any other origin are rejected.
 *   - Otherwise the incoming request's Origin header is trusted (dev-friendly).
 *
 * The RP ID is the registrable domain of the resolved origin (or RP_ID when
 * explicitly configured). Generation and verification both resolve from the
 * same request, so a single ceremony is always internally consistent.
 */

const DEFAULT_ORIGINS = ['http://localhost:3000'];

const RP_NAME = process.env.RP_NAME || 'Budget Management System';

const parseList = value =>
  (value || '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

const getAllowedOrigins = () => parseList(process.env.WEBAUTHN_ORIGINS || process.env.RP_ORIGIN);

const hostnameOf = origin => {
  try {
    return new URL(origin).hostname;
  } catch {
    return null;
  }
};

/**
 * Resolve the RP context for a request.
 * @param {import('express').Request} req
 * @returns {{ rpName: string, rpID: string, origin: string, allowed: boolean }}
 */
const resolveRp = req => {
  const allowlist = getAllowedOrigins();
  const requestOrigin = (req.get && req.get('origin')) || (req.headers && req.headers.origin) || null;

  let origin;
  let allowed = true;

  if (allowlist.length > 0) {
    if (requestOrigin && allowlist.includes(requestOrigin)) {
      origin = requestOrigin;
    } else {
      // Origin not on the allowlist — flag it so the controller can reject.
      // A missing Origin header (non-browser tooling) is tolerated.
      origin = allowlist[0];
      allowed = !requestOrigin;
    }
  } else {
    origin = requestOrigin || DEFAULT_ORIGINS[0];
  }

  const rpID = process.env.RP_ID || hostnameOf(origin) || 'localhost';

  return { rpName: RP_NAME, rpID, origin, allowed };
};

module.exports = {
  resolveRp,
  getAllowedOrigins,
  hostnameOf,
  RP_NAME,
};
