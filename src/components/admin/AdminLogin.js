import { useState } from 'react';
import { login, requestPasswordReset } from '../../services/auth';
import Logo from '../Logo';

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (resetMode) {
        await requestPasswordReset(email);
        setMessage('Password reset link sent. Check your email.');
      } else {
        await login(email, password);
        onSuccess();
      }
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Check your email and password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <Logo size={30} />
        <h1>Admin access</h1>
        <p>{resetMode ? 'Enter your email to reset your password.' : 'Sign in to manage bookings.'}</p>
        <input
          className="input"
          type="email"
          value={email}
          placeholder="Email"
          autoFocus
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
        {!resetMode && <input
          className="input"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />}
        {error && <p className="field__error">{error}</p>}
        {message && <p className="field__success">{message}</p>}
        <button className="btn btn--accent" type="submit" disabled={busy || !email || (!resetMode && !password)}>
          {busy ? 'Please wait…' : resetMode ? 'Send reset link' : 'Sign in'}
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => {
            setResetMode((mode) => !mode);
            setError('');
            setMessage('');
          }}
        >
          {resetMode ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </form>
    </div>
  );
}