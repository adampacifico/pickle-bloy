import { useState } from 'react';
import { login } from '../../services/auth';
import { ADMIN_PASSCODE } from '../../constants';
import Logo from '../Logo';

/** Passcode gate for the /admin route (demo auth — swap for real login). */
export default function AdminLogin({ onSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(passcode);
    setBusy(false);
    if (ok) {
      onSuccess();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <Logo size={30} />
        <h1>Admin access</h1>
        <p>Enter the admin passcode to view bookings.</p>
        <input
          className="input"
          type="password"
          value={passcode}
          placeholder="Passcode"
          autoFocus
          onChange={(e) => {
            setPasscode(e.target.value);
            setError(false);
          }}
        />
        {error && <p className="field__error">That passcode isn't right — try again.</p>}
        <button className="btn btn--accent" type="submit" disabled={busy || !passcode}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        <p className="admin-login__hint">
          Demo passcode: <code>{ADMIN_PASSCODE}</code>
        </p>
      </form>
    </div>
  );
}