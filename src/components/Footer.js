import { Link } from 'react-router-dom';
import Logo from './Logo';
import { APP_NAME } from '../constants';

const LINKS = [
  { label: 'Book a Court', href: '#book' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schedule', href: '#schedule' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Logo size={22} />
        <p>
          <strong>{APP_NAME}</strong> — reserve your court. No back-and-forth.
        </p>
      </div>
      <nav className="footer__nav" aria-label="Footer">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <Link to="/admin">Admin</Link>
      </nav>
      <p className="footer__note">
        © {year} {APP_NAME}. Demo build — bookings are saved in your browser
        so the schedule board, wizard and admin table always agree.
      </p>
    </footer>
  );
}