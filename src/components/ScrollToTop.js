import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll back to the top whenever the route changes. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* jsdom (tests) doesn't implement scrollTo — that's fine */
    }
  }, [pathname]);

  return null;
}