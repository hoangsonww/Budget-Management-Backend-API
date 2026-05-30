// Thin client wrapper around the passkey (WebAuthn) endpoints. It orchestrates
// the two-step ceremonies — fetch options from the server, hand them to the
// authenticator via @simplewebauthn/browser, then post the result back for
// verification — and normalises authenticator errors into friendly messages.

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  platformAuthenticatorIsAvailable,
  WebAuthnError,
} from '@simplewebauthn/browser';
import api from './api';

export const isPasskeySupported = () => browserSupportsWebAuthn();

export const isPlatformAuthenticatorAvailable = async () => {
  try {
    return await platformAuthenticatorIsAvailable();
  } catch {
    return false;
  }
};

export const isConditionalMediationAvailable = async () => {
  try {
    return await browserSupportsWebAuthnAutofill();
  } catch {
    return false;
  }
};

// Translate the grab-bag of DOMException / WebAuthnError codes into copy a
// human can act on. Cancellations are flagged so callers can stay silent.
export const describePasskeyError = err => {
  const name = err?.name || err?.code;
  if (err instanceof WebAuthnError || name) {
    switch (name) {
      case 'NotAllowedError':
        return { cancelled: true, message: 'Passkey prompt was dismissed or timed out.' };
      case 'InvalidStateError':
        return { cancelled: false, message: 'This device already has a passkey for your account.' };
      case 'AbortError':
        return { cancelled: true, message: 'Passkey request was cancelled.' };
      case 'SecurityError':
        return { cancelled: false, message: 'This site is not allowed to use passkeys (check the domain/HTTPS).' };
      case 'NotSupportedError':
        return { cancelled: false, message: 'This authenticator is not supported.' };
      default:
        break;
    }
  }
  const apiMessage = err?.response?.data?.error;
  return { cancelled: false, message: apiMessage || err?.message || 'Something went wrong with the passkey.' };
};

/**
 * Run the registration ceremony for the currently authenticated user.
 * @param {string} [name] Optional friendly label.
 * @returns the stored passkey metadata.
 */
export const registerPasskey = async name => {
  const { data: options } = await api.post('/api/passkeys/register/options');
  const attestationResponse = await startRegistration({ optionsJSON: options });
  const { data } = await api.post('/api/passkeys/register/verify', {
    response: attestationResponse,
    name,
  });
  return data.passkey;
};

/**
 * Run the passwordless authentication ceremony.
 * @returns {Promise<string>} a JWT for the authenticated session.
 */
export const authenticateWithPasskey = async () => {
  const { data } = await api.post('/api/passkeys/login/options');
  const assertionResponse = await startAuthentication({ optionsJSON: data.options });
  const { data: result } = await api.post('/api/passkeys/login/verify', {
    flowId: data.flowId,
    response: assertionResponse,
  });
  return result.token;
};

export const listPasskeys = async () => {
  const { data } = await api.get('/api/passkeys');
  return data;
};

export const renamePasskey = async (id, name) => {
  const { data } = await api.patch(`/api/passkeys/${id}`, { name });
  return data;
};

export const deletePasskey = async id => {
  await api.delete(`/api/passkeys/${id}`);
};
