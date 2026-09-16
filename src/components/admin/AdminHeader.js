import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { BRAND_SHORT } from '../../constants';
import { logout } from '../../services/auth';

/** Slim top bar for the admin area with a quick exit back to the site. */
export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="admin-header">
      <Link to="/" className="admin-header__brand">
        <Logo size={22} />
        <span>{BRAND_SHORT}</span>
      </Link>
      <nav className="admin-header__nav">
        <Link to="/" className="btn btn--ghost btn--sm">
          ← View site
        </Link>
        <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </header>
  );
}