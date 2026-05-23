// Lightweight, polling-free auth state.
//
// Tokens are validated on the client by decoding the JWT and inspecting the
// `exp` claim. The server still does the real check on every protected
// request (and the api.js 401 interceptor clears the token if the server ever
// rejects it), so we never need to poll /api/auth/verify-token from the UI.
//
// An "auth-change" CustomEvent is dispatched whenever the token mutates, so
// components subscribe once instead of re-checking on every navigation. The
// browser `storage` event keeps multiple tabs in sync automatically.

const TOKEN_KEY = 'token';
const AUTH_EVENT = 'auth-change';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
  emitAuthChange();
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  emitAuthChange();
};

export const logout = () => removeToken();

// Decode the JWT payload without verifying the signature. The signature is
// verified server-side; client-side decoding only powers UI decisions like
// "is the token already expired, don't bother sending the request".
export const decodeToken = token => {
  const raw = token ?? getToken();
  if (!raw || typeof raw !== 'string') return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const json = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
    const decoded = decodeURIComponent(
      json
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getTokenExpiry = token => {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== 'number') return null;
  return payload.exp * 1000;
};

export const isTokenExpired = token => {
  const expMs = getTokenExpiry(token);
  if (expMs == null) return false; // no exp claim → treat as non-expiring, let server decide
  return Date.now() >= expMs;
};

export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

const emitAuthChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
};

// Subscribe to login/logout transitions. Returns an unsubscribe function.
// Fires on:
//   • setToken / removeToken in the current tab (CustomEvent)
//   • storage mutations from other tabs (storage event)
export const onAuthChange = handler => {
  if (typeof window === 'undefined') return () => {};
  const customHandler = () => handler();
  const storageHandler = e => {
    if (e.key === TOKEN_KEY || e.key === null) handler();
  };
  window.addEventListener(AUTH_EVENT, customHandler);
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(AUTH_EVENT, customHandler);
    window.removeEventListener('storage', storageHandler);
  };
};
