# Eliana's Pickleball Court & Refreshments

A Pickleball court booking site built in React with a fresh "sunset on the
court" theme. Visitors get a hero, an image gallery carousel, upcoming
events, and a 4-step booking flow across two courts. The admin area lives on
its own guarded route (`/admin`) and is **built to be plugged into a real
backend** — the data and auth layers are already split into swap-ready
services.

Built with **React 19** (Create React App) + **React Router 6**. No backend
yet: bookings and the admin passcode currently persist in `localStorage`.

## Run it

```bash
npm start       # dev server → http://localhost:3000
npm run build   # production bundle to /build
npm test        # run the test suite
```

## Routes

| Route    | What it is                                              |
| -------- | ------------------------------------------------------- |
| `/`      | Public page — hero, gallery, booking wizard, events, schedule |
| `/admin` | Guarded admin — passcode login, then the bookings table |

Admin demo passcode: `eliana123` (change it in `src/constants.js`).

## What's inside

| Path                                   | What it does                                                   |
| -------------------------------------- | -------------------------------------------------------------- |
| `src/constants.js`                     | All config: courts, off-peak/peak ₱ rates, hero copy, gallery, events, passcode |
| `src/services/bookingsApi.js`          | **Data layer** — async get/create/update bookings (swap point for a real API) |
| `src/services/auth.js`                 | **Auth layer** — async login/logout/check (swap point for real auth) |
| `src/context/BookingsContext.js`       | Shares one bookings list across the public + admin pages       |
| `src/pages/PublicPage.js` / `AdminPage.js` | The two routes                                            |
| `src/components/Gallery.js`            | Auto-rotating image carousel (arrows + dots)                   |
| `src/components/Events.js`             | Upcoming events cards                                          |
| `src/components/booking/`              | The 4-step wizard (state machine + step components)            |
| `src/components/ScheduleSection.js`    | Month-by-month calendar with per-day, per-court availability   |
| `src/components/AdminBookings.js`      | Bookings table with stats + "mark paid" action                 |
| `src/App.js`                           | Router + shared provider wrapping everything                   |

## How a booking flows

1. **Details** — name + phone (validated inline).
2. **Court & Time** — pick a date, court, and one or more hourly slots.
   Slots already booked are greyed out and disabled.
3. **Payment** — cash, GCash or bank transfer (+ payment proof upload).
   The total is the sum of each slot's rate: **₱100/hr off-peak (6AM–5PM)**
   and **₱200/hr peak (5PM–9PM)**, shown as an itemized breakdown.
4. **Confirmed** — animated check + full receipt.

The booking is created through `bookingsApi.createBooking()` (via the shared
context), so it instantly shows up in the hero stats, schedule calendar, and
admin table.

## Adding a real backend

- **Bookings** — open `src/services/bookingsApi.js` and replace the
  localStorage bodies with `fetch()` calls (examples are in the file header).
  No component changes needed.
- **Auth** — open `src/services/auth.js` and swap the passcode check for a
  token-based login (example in the file header). The `/admin` route stays
  guarded the same way.

## Easy tweaks (all in `src/constants.js`)

- **Hero copy** — edit the `HERO` object (headline, tagline, subtitle, CTAs).
- **Gallery photos** — replace the `GALLERY.items` image URLs with real photos.
- **Events** — edit the `EVENTS.items` list.
- **Rates** — edit `OFF_PEAK_PRICE` / `PEAK_PRICE` / `PEAK_START_HOUR`.
- **Admin passcode** — edit `ADMIN_PASSCODE`.
- **Courts / payment methods** — extend the arrays in the same file.
- **Reset demo data** — clear the `eliana-court-bookings-v1` key in your
  browser's localStorage (or use incognito mode).

## Structure notes

- Components are small, named after their job, and read data through the
  shared context — no prop drilling.
- Styles use CSS variables (in `src/index.css`) so the whole palette can
  be re-themed from one place; `src/App.css` is organized top-to-bottom
  in the same order as the UI.
- Motion is decorative only, respects `prefers-reduced-motion`, and the
  site is fully responsive down to ~360px wide screens.