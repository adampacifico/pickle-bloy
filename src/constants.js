/**
 * Central configuration for the whole app.
 * Change a value here and it updates everywhere it is used.
 */

export const APP_NAME = "Eliana's Pickleball Court & Refreshments";

/** Shorter name used in the navigation bar. */
export const BRAND_SHORT = "Eliana's Pickleball";

export const CURRENCY = '₱';

/**
 * Hourly rates (Philippine pesos), based on when a slot starts.
 * - Off-peak: slots starting 6:00 AM up to (not including) 5:00 PM → ₱100
 * - Peak:     slots starting 5:00 PM onwards → ₱200
 */
export const OFF_PEAK_PRICE = 100;
export const PEAK_PRICE = 200;
export const PEAK_START_HOUR = 17; // 5:00 PM

/** The courts at the club. The color matches the painted court lines. */
export const COURTS = [
  { id: 'court-1', label: 'Court 1', color: '#3ecf7a' },
  { id: 'court-2', label: 'Court 2', color: '#ff6b35' },
];

/** Playing hours are hourly slots, 6:00 AM through 6:00 AM (24 hours). */
export const SLOT_START_HOUR = 6;
export const SLOT_END_HOUR = 30; // wraps past midnight to cover a full 24h cycle

/** How many future days a player can book in advance. */
export const BOOKING_DAYS_AHEAD = 14;

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash on arrival', hint: 'Pay when you get to the court.', icon: '💵' },
  { id: 'gcash', label: 'GCash', hint: 'Attach a screenshot as payment proof.', icon: '📱' },
];

/** localStorage key holding every booking. */
export const STORAGE_KEY = 'eliana-court-bookings-v1';

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

/** Hourly rate for one "HH:00" slot (off-peak vs peak).
 * 6AM–5PM (hours 6–11 and 12–16) → ₱100; 5PM–6AM (hours 17–23 and 0–5) → ₱200.
 */
export function priceForSlot(slot) {
  const hour = Number(slot.slice(0, 2));
  // Normalize hour to 0-23 range for 24-hour slots
  const normalizedHour = hour >= 24 ? hour - 24 : hour;
  // Peak: 5PM (17) through 6AM (5 next day); off-peak: 6AM (6) through 5PM (16).
  return (normalizedHour >= 17 || normalizedHour < 6) ? PEAK_PRICE : OFF_PEAK_PRICE;
}

/** Total rate for a list of slots (each slot is billed at its own rate). */
export function priceForSlots(slots) {
  return slots.reduce((sum, slot) => sum + priceForSlot(slot), 0);
}

/* ============================================================
   Editable marketing content.
   Change any string below and it updates across the site.
   ============================================================ */

/** Hero copy — headline, accent line, subtitle and call-to-action buttons. */
export const HERO = {
  eyebrow: APP_NAME,
  title: 'Dink it. Drop it.',
  accent: 'No back-and-forth.',
  subtitle:
    "Cold drinks waiting courtside.",
  primaryCta: { label: 'Book a court', href: '#book' },
  secondaryCta: { label: 'View schedule', href: '#schedule' },
};

/** Gallery carousel images from the local public folder. */
export const GALLERY = {
  eyebrow: 'The Club',
  title: 'Take a look around',
  subtitle: 'Two courts, one vibe — cold drinks waiting courtside.',
  items: [
    { src: '/images/img1.jpeg', caption: 'Court 1 under the afternoon sun' },
    { src: '/images/img2.png', caption: 'Court 2 beautiful under the afternoon sun' },
    { src: '/images/img3.png', caption: 'Refreshments after the rally' },
  ],
};

/** Upcoming events cards. */
export const EVENTS = {
  eyebrow: 'Events',
  title: "What's happening at the court",
  subtitle: 'A few regulars — drop in anytime.',
  items: [
    {
      tag: 'Open play',
      title: 'Friday Night Lights',
      when: 'Every Friday · 6:00 PM',
      detail: 'Open play under the lights. All levels welcome, paddles and balls provided.',
    },
    {
      tag: 'Clinic',
      title: 'Learn to Play',
      when: 'Every Saturday · 9:00 AM',
      detail: 'Serve, dink, and the kitchen rule — the essentials in 90 minutes.',
    },
    {
      tag: 'Social',
      title: 'Dink & Drink',
      when: 'Every Sunday · 4:00 PM',
      detail: 'Casual round-robins with refreshments on the house.',
    },
  ],
};

/** Passcode for the /admin demo guard. Swap for real auth when the backend lands. */
export const ADMIN_PASSCODE = 'eliana123';