import { createContext, useContext, useEffect, useState } from 'react';
import * as bookingsApi from '../services/bookingsApi';

const BookingsContext = createContext(null);

/**
 * Single source of truth for bookings, loaded through the data layer.
 * The public page (hero stats, wizard, schedule) and the admin page
 * all read from here — so a new booking shows up everywhere, exactly
 * how it will behave once a real backend is plugged in.
 */
export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    bookingsApi.getBookings()
      .then((data) => {
        if (!mounted) return;
        setBookings(data);
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message || 'Unable to load bookings.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const createBooking = async (booking) => {
    const created = await bookingsApi.createBooking(booking);
    setBookings((current) => [created, ...current]);
    return created;
  };

  const confirmBooking = async (id) => {
    const updated = await bookingsApi.updateBookingStatus(id, 'confirmed');
    setBookings((current) => current.map((b) => (b.id === id ? updated : b)));
  };

  return (
    <BookingsContext.Provider value={{ bookings, loading, error, createBooking, confirmBooking }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used inside <BookingsProvider>');
  return ctx;
}