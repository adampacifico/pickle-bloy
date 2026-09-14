import { PAYMENT_METHODS, STATUS_LABELS } from '../../../constants';
import { formatLongDate, formatMoney, slotLabel } from '../../../utils/dateHelpers';

/**
 * Step 4 — booking confirmed.
 * Animated check-burst plus a full receipt for the player.
 */
export default function ConfirmedStep({ booking, onReset, onViewBooking }) {
  const method = PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod);

  const rows = [
    ['Booking ID', booking.id],
    ['Name', booking.name],
    ['Phone', booking.phone],
    ['Court', booking.courtLabel],
    ['Date', formatLongDate(booking.date)],
    ['Time', booking.slots.map(slotLabel).join(' · ')],
    ['Payment', method.label],
    ['Amount', formatMoney(booking.amount)],
    ['Status', STATUS_LABELS[booking.status]],
  ];

  return (
    <div className="step-card step-card--success">
      <div className="check-burst" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="check-burst__svg">
          <path
            className="check-burst__ring"
            d="M32 9.5 L53.8 32 L32 54.5 L10.2 32 Z"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
          />
          <path
            className="check-burst__check"
            d="M22 22 L22 40 L42 40 M22 40 L22 46"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle className="check-burst__pulse" cx="32" cy="32" r="30" fill="none" />
        </svg>
      </div>

      <h3 className="step-card__title">You're on the board.</h3>
      <p className="step-card__success-copy">
        Your court is reserved. Details below.
      </p>

      <dl className="receipt">
        {rows.map(([label, value]) => (
          <div className="receipt__row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="confirm-actions">
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Book another slot
        </button>
        <button type="button" className="btn btn--accent" onClick={() => onViewBooking(booking)}>
          View my booking →
        </button>
      </div>
    </div>
  );
}