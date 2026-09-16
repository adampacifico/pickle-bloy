import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, onAuthStateChange } from '../services/auth';
import AdminHeader from '../components/admin/AdminHeader';
import AdminBookings from '../components/AdminBookings';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSession().then(setSession).finally(() => setChecking(false));
    const { data } = onAuthStateChange(setSession);
    return () => data.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <div className="admin-loading">Checking access…</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="app">
      <AdminHeader />
      <main>
        <AdminBookings />
      </main>
    </div>
  );
}