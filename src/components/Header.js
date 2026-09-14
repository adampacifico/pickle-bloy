import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { BRAND_SHORT } from '../constants';

/** In-page section links (scroll to anchors). */
const SECTION_LINKS = [
  { label: 'Book a Court', href: '#book' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Gallery', href: '#gallery' },
];

/**
 * Sticky top navigation for the public page.
 * - Highlights the section currently in view (scrollspy).
 * - Collapses to a hamburger menu on small screens.
 * - "Admin" is a guarded route at /admin.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY || window.scrollTop || 0;
      setScrolled(top > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scrollspy: mark the nav link for the section that crosses the middle band.
    if (typeof IntersectionObserver !== 'undefined') {
      const ids = SECTION_LINKS.map((item) => item.href.slice(1));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      return () => {
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <a className="header__brand" href="#top" onClick={() => setMenuOpen(false)}>
        <Logo size={26} />
        <span className="header__brand-text">{BRAND_SHORT}</span>
      </a>

      <nav className="header__nav" aria-label="Main">
        {SECTION_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`header__link ${active === item.href.slice(1) ? 'is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <Link
          to="/admin"
          className="header__link header__link--admin"
          onClick={() => setMenuOpen(false)}
        >
          Admin
        </Link>
      </nav>

      <a className="btn btn--accent header__cta" href="#book">
        Book now
      </a>

      <button
        type="button"
        className="header__burger"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`header__menu ${menuOpen ? 'header__menu--open' : ''}`}>
        {SECTION_LINKS.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <Link to="/admin" onClick={() => setMenuOpen(false)}>
          Admin
        </Link>
      </div>
    </header>
  );
}