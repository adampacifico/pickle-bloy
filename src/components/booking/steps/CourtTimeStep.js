import { useEffect, useState } from 'react';
import {
  BOOKING_DAYS_AHEAD,
  OFF_PEAK_PRICE,
  PEAK_PRICE,
  priceForSlot,
  priceForSlots,
} from '../../../constants';
import {
  buildSlotTimes,
  formatLongDate,
  formatMoney,
  getNextDays,
  slotLabel,
} from '../../../utils/dateHelpers';
import { getActiveCourts } from '../../../services/courtService';

const COURT_COLORS = ['#3ecf7a', '#ff6b35', '#4da3ff', '#d88cff'];

/**
 * Step 2 - pick a date, a court, then one or more hourly slots.
 * Booked slots come from the shared `bookings` list, so if anything
 * else booked the slot it is greyed out and unclickable.
 */
export default function CourtTimeStep({ form, update, bookings, showErrors }) {
  const [courts, setCourts] = useState([]);
  const [courtsLoading, setCourtsLoading] = useState(true);
  const [courtsError, setCourtsError] = useState('');
  const days = getNextDays(BOOKING_DAYS_AHEAD);
  const slots = buildSlotTimes();

  useEffect(() => {
    let mounted = true;

    getActiveCourts()
      .then((data) => {
        if (mounted) setCourts(data);
      })
      .catch((error) => {
        if (mounted) setCourtsError(error.message || 'Unable to load courts.');
      })
      .finally(() => {
        if (mounted) setCourtsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const courtBookings = bookings.filter(
    (booking) => String(booking.courtId) === String(form.courtId) && booking.date === form.date
  );
  const slotStatuses = new Map();
  courtBookings.forEach((booking) => {
    booking.slots.forEach((slot) => slotStatuses.set(slot, booking.status));
  });

  const valid = form.date && form.slots.length > 0;
  const total = priceForSlots(form.slots);

  const pickDate = (iso) => update({ date: iso, slots: [] });
  const pickCourt = (court) => update({ courtId: court.id, courtLabel: court.label, slots: [] });
  const selectedCourt = courts.find((court) => String(court.id) === String(form.courtId));

  const toggleSlot = (slot) => {
    if (slotStatuses.get(slot) === 'confirmed') return;
    const active = form.slots.includes(slot);
    update({
      slots: active
        ? form.slots.filter((s) => s !== slot)
        : [...form.slots, slot].sort(),
    });
  };

  const clearSlots = () => update({ slots: [] });

  return (
    <div className="step-card step-card--board">
      <h3 className="step-card__title step-card__title--compact">Choose your court, date & time</h3>

      {/* Date strip */}
      <div className="field-block field-block--tight">
        <span className="field__label field__label--tight">Date</span>
        <div className="scroll-x scroll-x--tight">
          <div className="date-chips date-chips--tight" role="group" aria-label="Pick a date">
            {days.map((day) => {
              const isActive = form.date === day.iso;
              return (
                <button
                  key={day.iso}
                  type="button"
                  className={`chip ${isActive ? 'chip--active' : ''}`}
                  onClick={() => pickDate(day.iso)}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Court cards - single column */}
      <div className="field-block field-block--tight">
        <span className="field__label field__label--tight">Court</span>
        {courtsLoading && <p className="field__hint">Loading courts...</p>}
        {courtsError && <p className="field__error">{courtsError}</p>}
        {!courtsLoading && !courtsError && courts.length === 0 && (
          <p className="field__hint">No active courts are available.</p>
        )}
        <div className="court-cards court-cards--single court-cards--tight" role="group" aria-label="Pick a court">
          {courts.map((court, index) => {
            const isActive = String(form.courtId) === String(court.id);
            return (
              <button
                key={court.id}
                type="button"
                className={`court-card ${isActive ? 'court-card--active' : ''}`}
                onClick={() => pickCourt(court)}
              >
                <span className="court-card__dot" style={{ background: COURT_COLORS[index % COURT_COLORS.length] }} />
                {court.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* The board - takes full width above the selection card */}
      {form.date && selectedCourt ? (
        <div className="board board--main board--tight">
          <div className="board__head">
            <span className="board__court-dot" style={{ background: COURT_COLORS[courts.indexOf(selectedCourt) % COURT_COLORS.length] }} />
            {selectedCourt.label} -
            <strong>{formatLongDate(form.date)}</strong>
          </div>
          <div className="board__grid board__grid--tight">
            {slots.map((slot) => {
              const status = slotStatuses.get(slot);
              const isConfirmed = status === 'confirmed';
              const isPending = status === 'pending';
              const isSelected = form.slots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  className={`slot ${isSelected ? 'slot--selected' : isConfirmed ? 'slot--confirmed' : isPending ? 'slot--pending' : 'slot--open'}`}
                  disabled={isConfirmed}
                  onClick={() => toggleSlot(slot)}
                >
                  <span className="slot__time">{slotLabel(slot)}</span>
                  <span className="slot__state">
                    {isSelected ? 'Selected' : isConfirmed ? 'Confirmed' : isPending ? 'Pending' : `Open - ${formatMoney(priceForSlot(slot))}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="board__hint board__hint--tight">
            Each selected hour = 1 playing hour. Rates:{' '}
            <strong>{formatMoney(OFF_PEAK_PRICE)}/hr 6AM-5PM</strong> -{' '}
            <strong>{formatMoney(PEAK_PRICE)}/hr 5PM-6AM</strong>. Tap an open
            slot to select it. Confirmed slots are unavailable; pending slots are shown for awareness.
          </p>
        </div>
      ) : (
        <div className="board board--empty">
          <span className="board__empty-icon" aria-hidden="true">[ ]</span>
          <p>Pick a date above to see the board.</p>
        </div>
      )}

      {/* Selection summary */}
      <div className="selection-card selection-card--compact" aria-label="Your selection">
        <div className="selection-card__head">
          <span>Selected</span>
          {form.slots.length > 0 && (
            <button type="button" className="text-btn" onClick={clearSlots}>
              Clear
            </button>
          )}
        </div>
        {form.slots.length === 0 ? (
          <p className="selection-card__empty">Tap an open slot to select it.</p>
        ) : (
          <ul className="selection-card__list">
            {form.slots.map((slot) => (
              <li key={slot}>
                <span>{slotLabel(slot)}</span>
                <button
                  type="button"
                  className="selection-card__remove"
                  aria-label={`Remove ${slotLabel(slot)}`}
                  onClick={() => toggleSlot(slot)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
        <dl className="selection-card__total selection-card__total--compact">
          <dt>Total</dt>
          <dd>
            {formatMoney(total)}
            <small>/ {form.slots.length} hr{form.slots.length === 1 ? '' : 's'}</small>
          </dd>
        </dl>
        {showErrors && !valid && (
          <p className="field__error form-error">
            Pick a date and at least one open slot to continue.
          </p>
        )}
      </div>
    </div>
  );
}

