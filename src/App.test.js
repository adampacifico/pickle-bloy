import { act, render, screen } from '@testing-library/react';
import App from './App';

/**
 * Render the app and flush the async data load (BookingsProvider fetches
 * bookings on mount). Wrapping in act keeps React happy about state
 * updates that happen right after mount. Starts at the home URL so a
 * previous test's /admin visit can't leak through.
 */
const renderApp = async () => {
  window.history.pushState({}, '', '/');
  let result;
  await act(async () => {
    result = render(<App />);
  });
  return result;
};

test('renders the hero heading', async () => {
  await renderApp();
  expect(
    screen.getByRole('heading', { name: /Dink it\. Drop it\./i })
  ).toBeInTheDocument();
});

test('renders the booking section heading', async () => {
  await renderApp();
  expect(
    screen.getByRole('heading', { name: /Book a court/i })
  ).toBeInTheDocument();
});

test('renders the gallery section heading', async () => {
  await renderApp();
  expect(
    screen.getByRole('heading', { name: /Take a look around/i })
  ).toBeInTheDocument();
});

test('guards the admin route behind the login gate', async () => {
  window.history.pushState({}, '', '/admin');
  await act(async () => {
    render(<App />);
  });
  expect(
    screen.getByRole('heading', { name: /Admin access/i })
  ).toBeInTheDocument();
});
