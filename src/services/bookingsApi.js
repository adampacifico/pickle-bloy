/**
 * ============================================================
 * DATA LAYER — the swap point for a real backend.
 * ============================================================
 * Every function in this module is async and returns a Promise.
 * Right now they read/write localStorage (via utils/storage.js),
 * but components never touch storage directly — they call these
 * functions. When you add a real API, just replace the bodies
 * with fetch() calls, e.g.:
 *
 *   export async function getBookings() {
 *     const res = await fetch('/api/bookings');
 *     return res.json();
 *   }
 *
 * Nothing else in the app needs to change.
 */
import { loadBookings, saveBookings } from '../utils/storage';

/** In-memory mirror of the persisted list (seeded on first load). */
let cache = null;

function ensureLoaded() {
  if (cache === null) cache = loadBookings();
  return cache;
}

export async function getBookings() {
  return [...ensureLoaded()];
}

export async function createBooking(booking) {
  const list = ensureLoaded();
  const created = { ...booking };
  list.unshift(created);
  saveBookings(list);
  return created;
}

export async function updateBookingStatus(id, status) {
  const list = ensureLoaded();
  let updated = null;
  const next = list.map((booking) => {
    if (booking.id !== id) return booking;
    updated = { ...booking, status };
    return updated;
  });
  saveBookings(next);
  return updated;
}