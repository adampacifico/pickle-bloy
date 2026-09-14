import { COURTS, STORAGE_KEY, priceForSlot } from '../constants';
import { addDays, makeBookingId, toISODate } from './dateHelpers';

/**
 * Tiny localStorage layer.
 * The first time the app opens we seed a few demo bookings so the
 * schedule board, greyed-out slots and admin table are not empty.
 */

function makeBooking({ dayOffset, courtIndex, hour, name, phone, method, status = 'confirmed' }) {
  const today = new Date();
  const slot = `${String(hour).padStart(2, '0')}:00`;
  return {
    id: makeBookingId(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    courtId: COURTS[courtIndex].id,
    courtLabel: COURTS[courtIndex].label,
    date: toISODate(addDays(today, dayOffset)),
    slots: [slot],
    hours: 1,
    amount: priceForSlot(slot),
    paymentMethod: method,
    proofFile: null,
    status,
  };
}

function seedDemoBookings() {
  return [
    makeBooking({ dayOffset: 0, courtIndex: 0, hour: 18, name: 'Marco Ferrer', phone: '0917 555 0184', method: 'gcash' }),
    makeBooking({ dayOffset: 0, courtIndex: 0, hour: 19, name: 'Marco Ferrer', phone: '0917 555 0184', method: 'gcash' }),
    makeBooking({ dayOffset: 0, courtIndex: 1, hour: 17, name: 'Jade Lim', phone: '0918 442 7712', method: 'cash' }),
    makeBooking({ dayOffset: 0, courtIndex: 0, hour: 6, name: 'Rumble Crew', phone: '0922 109 3350', method: 'bank' }),
    makeBooking({ dayOffset: 0, courtIndex: 0, hour: 7, name: 'Rumble Crew', phone: '0922 109 3350', method: 'bank' }),
    makeBooking({ dayOffset: 1, courtIndex: 0, hour: 16, name: 'Sofia Reyes', phone: '0908 783 2201', method: 'cash' }),
    makeBooking({ dayOffset: 1, courtIndex: 1, hour: 20, name: 'Diego Cruz', phone: '0916 221 8844', method: 'gcash' }),
    makeBooking({ dayOffset: 2, courtIndex: 1, hour: 9, name: 'Ana Villanueva', phone: '0912 660 9031', method: 'cash' }),
  ];
}

export function loadBookings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* storage unavailable (private mode / tests) — fall through to seed */
  }
  const seeded = seedDemoBookings();
  saveBookings(seeded);
  return seeded;
}

export function saveBookings(bookings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    /* ignore quota/security errors — the app still works in memory */
  }
}