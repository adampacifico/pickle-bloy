import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { BookingsProvider } from './context/BookingsContext';
import ScrollToTop from './components/ScrollToTop';
import PublicPage from './pages/PublicPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './components/admin/AdminLogin';
import ResetPassword from './components/admin/ResetPassword';
import './App.css';

/**
 * Eliana's Pickleball Court & Refreshments.
 *
 * Routing + one shared BookingsProvider wrap every page, so the public
 * booking flow and the guarded admin area read from the same data layer
 * (see src/services/bookingsApi.js — the swap point for a real backend).
 */
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <BookingsProvider>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BookingsProvider>
    </BrowserRouter>
  );
}

function AdminLoginPage() {
  const navigate = useNavigate();
  return <AdminLogin onSuccess={() => navigate('/admin', { replace: true })} />;
}
