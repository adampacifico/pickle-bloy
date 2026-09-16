import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../../services/auth';
import Logo from '../Logo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (updateError) {
      setError(updateError.message || 'Unable to change your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <Logo size={30} />
        <h1>Change password</h1>
        {success ? (
          <>
            <p className="field__success">Your password has been changed.</p>
            <button type="button" className="btn btn--accent" onClick={() => navigate('/admin', { replace: true })}>
              Continue to admin
            </button>
          </>
        ) : (
          <>
            <p>Choose a new password for your admin account.</p>
            <input className="input" type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
            <input className="input" type="password" placeholder="Confirm new password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
            {error && <p className="field__error">{error}</p>}
            <button className="btn btn--accent" type="submit" disabled={busy || !password || !confirmation}>
              {busy ? 'Saving…' : 'Change password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}