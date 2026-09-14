import { useEffect } from 'react';
import Logo from './Logo';
import { PAYMENT_METHODS, STATUS_LABELS } from '../constants';
import { formatLongDate, formatMoney, slotLabel } from '../utils/dateHelpers';

/**
 * Receipt popup shown after booking ("View my booking").
 * Closes on backdrop click or the Escape key.
 */
export default function Modal({ booking, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

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
    <div className="modal__backdrop" onClick={onClose}>
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-label="Booking receipt"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close receipt"
        >
          ×
        </button>
        <div className="modal__head">
          <Logo size={20} />
          <h3>Booking receipt</h3>
        </div>
        <dl className="receipt">
          {rows.map(([label, value]) => (
            <div className="receipt__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}