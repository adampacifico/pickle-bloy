import {
  BOOKING_DAYS_AHEAD,
  COURTS,
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

/**
 * Step 2 — pick a date, a court, then one or more hourly slots.
 * Booked slots come from the shared `bookings` list, so if anything
 * else booked the slot it is greyed out and unclickable.
 */
export default function CourtTimeStep({ form, update, bookings, showErrors }) {
  const days = getNextDays(BOOKING_DAYS_AHEAD);
  const slots = buildSlotTimes();

  /** Set of "HH:00" times already booked on the chosen court + date. */
  const taken = new Set(
    bookings
      .filter((b) => b.courtId === form.courtId && b.date === form.date)
      .flatMap((b) => b.slots)
  );

  const valid = form.date && form.slots.length > 0;
  const total = priceForSlots(form.slots);

  const pickDate = (iso) => update({ date: iso, slots: [] });
  const pickCourt = (id) => update({ courtId: id, slots: [] });

  const toggleSlot = (slot) => {
    if (taken.has(slot)) return;
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
      <h3 className="step-card__title">Choose your court, date & time</h3>

      {/* Date strip */}
      <div className="field-block">
        <span className="field__label">Date</span>
        <div className="scroll-x">
          <div className="date-chips" role="group" aria-label="Pick a date">
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

      {/* Court cards */}
      <div className="field-block">
        <span className="field__label">Court</span>
        <div className="court-cards" role="group" aria-label="Pick a court">
          {COURTS.map((court) => {
            const isActive = form.courtId === court.id;
            return (
              <button
                key={court.id}
                type="button"
                className={`court-card ${isActive ? 'court-card--active' : ''}`}
                onClick={() => pickCourt(court.id)}
              >
                <span className="court-card__dot" style={{ background: court.color }} />
                {court.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* The board */}
      {form.date && form.courtId ? (
        <div className="board">
          <div className="board__head">
            <span className="board__court-dot" style={{ background: COURTS.find((c) => c.id === form.courtId).color }} />
            {COURTS.find((c) => c.id === form.courtId).label} —
            <strong>{formatLongDate(form.date)}</strong>
          </div>
          <div className="board__grid">
            {slots.map((slot) => {
              const isTaken = taken.has(slot);
              const isSelected = form.slots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  className={`slot ${isSelected ? 'slot--selected' : isTaken ? 'slot--booked' : 'slot--open'}`}
                  disabled={isTaken}
                  onClick={() => toggleSlot(slot)}
                >
                  <span className="slot__time">{slotLabel(slot)}</span>
                  <span className="slot__state">
                    {isSelected ? 'Selected' : isTaken ? 'Booked' : `Open · ${formatMoney(priceForSlot(slot))}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="board__hint">
            Each selected hour = 1 playing hour. Rates:{' '}
            <strong>{formatMoney(OFF_PEAK_PRICE)}/hr 6AM–5PM</strong> ·{' '}
            <strong>{formatMoney(PEAK_PRICE)}/hr 5PM–9PM</strong>. Tap an open
            slot to select it — greyed-out slots are already booked.
          </p>
        </div>
      ) : (
        <div className="board board--empty">
          <span className="board__empty-icon" aria-hidden="true">🗓️</span>
          <p>Pick a date above to see the board.</p>
        </div>
      )}

      {/* Selection summary */}
      <aside className="selection-card" aria-label="Your selection">
        <div className="selection-card__head">
          <span>Selected</span>
          {form.slots.length > 0 && (
            <button type="button" className="text-btn" onClick={clearSlots}>
              Clear selection
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
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <dl className="selection-card__total">
          <dt>Total</dt>
          <dd>
            {formatMoney(total)}
            <small>/ {form.slots.length} hr{form.slots.length === 1 ? '' : 's'}</small>
          </dd>
        </dl>
        <p className="selection-card__rates">
          Off-peak (6AM–5PM) {formatMoney(OFF_PEAK_PRICE)} · Peak (5PM–9PM) {formatMoney(PEAK_PRICE)}
        </p>
        {showErrors && !valid && (
          <p className="field__error form-error">
            Pick a date and at least one open slot to continue.
          </p>
        )}
      </aside>
    </div>
  );
}