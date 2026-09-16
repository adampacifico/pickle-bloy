/**
 * Pure date/slot helpers. No component logic in here,
 * so they are trivial to unit test and reuse.
 */

import { CURRENCY, SLOT_END_HOUR, SLOT_START_HOUR } from '../constants';

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format a Date as an ISO-ish key: 2026-09-14. Safe to use as an ID. */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}

/** Return the next `count` days starting today, each with a friendly label. */
export function getNextDays(count) {
  const today = new Date();
  return Array.from({ length: count }, (_, offset) => {
    const date = addDays(today, offset);
    return { date, iso: toISODate(date), label: dayLabel(date, offset) };
  });
}

export function dayLabel(date, offset) {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()}`;
}

/** "2026-09-16" -> "Wed, Sep 16" */
export function formatLongDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${MONTHS_SHORT[m - 1]} ${d}`;
}

/** "18:00" -> "6:00 PM"
 * Hours >= 24 are 12AM–5AM of the following day.
 */
export function slotLabel(slot) {
  const [h, mi] = slot.split(':').map(Number);
  const displayHour = h >= 24 ? h - 24 : h;
  const suffix = displayHour < 12 ? 'AM' : 'PM';
  const hour12 = displayHour % 12 === 0 ? 12 : displayHour % 12;
  return `${hour12}:${String(mi).padStart(2, '0')} ${suffix}`;
}

/** Build the hourly slot list for a 24-hour cycle from 6AM to 6AM next day.
 * e.g. ["06:00", "07:00", ..., "23:00", "00:00", ..., "05:00"].
 */
export function buildSlotTimes() {
  const slots = [];
  // First day: 6AM to 11PM (hours 6–23)
  for (let h = SLOT_START_HOUR; h < 24; h += 1) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  // Early morning next day: 12AM to 5AM (hours 0–5)
  for (let h = 0; h < SLOT_START_HOUR; h += 1) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}

/** "09:00" -> 9 (numeric hour), used to position slots on the schedule board. */
export function slotHour(slot) {
  return Number(slot.slice(0, 2));
}

/** Render a money amount: 1250 -> "₱1,250". */
export function formatMoney(amount) {
  return `${CURRENCY}${amount.toLocaleString('en-US')}`;
}

export function makeBookingId() {
  return `PB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

/**
 * Build a calendar grid (6 weeks x 7 days) for a month.
 * Empty leading cells are `null` so the grid aligns with weekdays.
 */
export function monthMatrix(year, month) {
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: startDow }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ day, iso: toISODate(date) });
  }
  return cells;
}

export function monthLabel(year, month) {
  return `${MONTHS[month]} ${year}`;
}

/** True when the given date is today. */
export function isToday(iso) {
  return toISODate(new Date()) === iso;
}