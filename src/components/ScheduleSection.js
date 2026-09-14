import { useState } from 'react';
import { COURTS } from '../constants';
import { useBookings } from '../context/BookingsContext';
import {
  WEEKDAYS_SHORT,
  formatLongDate,
  isToday,
  monthLabel,
  monthMatrix,
  slotLabel,
  toISODate,
} from '../utils/dateHelpers';

/** Helper: number of bookings on a given date, possibly 0. */
const countFor = (byDate, iso) => (byDate.get(iso) ?? []).length;

/**
 * Monthly "what's open" board.
 * Days with bookings show court-colored dots; clicking a day opens its
 * per-court detail panel. Reads the same shared bookings list as the
 * wizard and the admin table.
 */
export default function ScheduleSection() {
  const { bookings } = useBookings();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toISODate(today));

  const cells = monthMatrix(year, month);

  const byDate = new Map();
  bookings.forEach((booking) => {
    if (!byDate.has(booking.date)) byDate.set(booking.date, []);
    byDate.get(booking.date).push(booking);
  });

  const dayBookings = byDate.get(selectedDate) ?? [];

  const shiftMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  return (
    <section className="section schedule" id="schedule">
      <div className="section__head">
        <p className="section__eyebrow">Schedule</p>
        <h2 className="section__title">Court schedule</h2>
        <p className="section__sub">
          See what's open across every court, month by month.
        </p>
      </div>

      <div className="schedule__layout">
        <div className="calendar">
          <div className="calendar__nav">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              ← Prev Month
            </button>
            <h3 className="calendar__title">{monthLabel(year, month)}</h3>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              Next →
            </button>
          </div>

          <div className="calendar__weekdays" aria-hidden="true">
            {WEEKDAYS_SHORT.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar__grid">
            {cells.map((cell, index) => {
              if (cell === null) {
                return <span key={`empty-${index}`} className="calendar__cell calendar__cell--empty" />;
              }
              const bookingsCount = countFor(byDate, cell.iso);
              const dayBookingsOnCell = byDate.get(cell.iso) ?? [];
              const dots = COURTS.filter((court) =>
                dayBookingsOnCell.some((b) => b.courtId === court.id)
              );

              return (
                <button
                  key={cell.iso}
                  type="button"
                  className={`calendar__cell ${selectedDate === cell.iso ? 'is-selected' : ''} ${isToday(cell.iso) ? 'is-today' : ''}`}
                  onClick={() => setSelectedDate(cell.iso)}
                >
                  <span className="calendar__day">{cell.day}</span>
                  {bookingsCount > 0 && (
                    <span className="calendar__booked-count">{bookingsCount} booked</span>
                  )}
                  <span className="calendar__dots" aria-hidden="true">
                    {dots.map((court) => (
                      <i key={court.id} style={{ background: court.color }} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="day-board" aria-label={`Slots for ${formatLongDate(selectedDate)}`}>
          <h3 className="day-board__title">{formatLongDate(selectedDate)}</h3>
          {COURTS.map((court) => {
            const booked = dayBookings.filter((b) => b.courtId === court.id);
            const times = booked.flatMap((b) => b.slots.map(slotLabel));
            return (
              <div className="day-board__court" key={court.id}>
                <div className="day-board__court-head">
                  <span className="day-board__dot" style={{ background: court.color }} />
                  {court.label}
                </div>
                {times.length === 0 ? (
                  <p className="day-board__open">Open all day — book it!</p>
                ) : (
                  <ul className="day-board__times">
                    {times.map((time) => (
                      <li key={time} className="day-board__time">
                        {time}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </aside>
      </div>
    </section>
  );
}