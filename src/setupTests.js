// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement window.scrollTo — calling it logs "Not
// implemented" via its virtual console and throws. Override it with a
// no-op so ScrollToTop runs quietly under tests.
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});
