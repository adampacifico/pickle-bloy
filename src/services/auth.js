/**
 * ============================================================
 * AUTH LAYER — the swap point for real authentication.
 * ============================================================
 * Demo guard: a passcode checked against ADMIN_PASSCODE, then
 * remembered in localStorage. When you add a real backend, replace
 * the bodies with token-based calls, e.g.:
 *
 *   export async function login(passcode) {
 *     const res = await fetch('/api/auth/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ passcode }),
 *     });
 *     if (!res.ok) return false;
 *     localStorage.setItem(TOKEN_KEY, (await res.json()).token);
 *     return true;
 *   }
 *
 * Nothing else in the app needs to change.
 */
import { ADMIN_PASSCODE } from '../constants';

const AUTH_KEY = 'eliana-admin-auth';
const TOKEN_KEY = 'eliana-admin-token';

export async function login(passcode) {
  const ok = passcode === ADMIN_PASSCODE;
  if (ok) {
    localStorage.setItem(AUTH_KEY, '1');
    localStorage.setItem(TOKEN_KEY, `demo-token-${Date.now()}`);
  }
  return ok;
}

export async function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export async function isAuthenticated() {
  return Boolean(localStorage.getItem(AUTH_KEY));
}