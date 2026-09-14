import { useEffect, useState } from 'react';
import { isAuthenticated } from '../services/auth';
import AdminLogin from '../components/admin/AdminLogin';
import AdminHeader from '../components/admin/AdminHeader';
import AdminBookings from '../components/AdminBookings';

/**
 * Guarded admin route. Shows a passcode screen until the visitor
 * signs in; on logout the gate closes again. Swap the auth calls
 * (services/auth.js) for real token auth when the backend lands.
 */
export default function AdminPage() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    let mounted = true;
    isAuthenticated().then((ok) => {
      if (mounted) setAuthed(ok);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (authed === null) {
    return <div className="admin-loading">Checking access…</div>;
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="app">
      <AdminHeader onLogout={() => setAuthed(false)} />
      <main>
        <AdminBookings />
      </main>
    </div>
  );
}