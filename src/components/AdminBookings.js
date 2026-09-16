import { useState } from 'react';
import { COURTS, PAYMENT_METHODS, STATUS_LABELS } from '../constants';
import { useBookings } from '../context/BookingsContext';
import { formatLongDate, formatMoney, slotLabel } from '../utils/dateHelpers';
import PaymentProofModal from './PaymentProofModal';

/**
 * Admin overview: every booking as a sortable table, newest first.
 * Pending bookings can be marked as confirmed right from the row.
 * Reads bookings from the shared context (backed by the data layer).
 */
export default function AdminBookings() {
  const { bookings, confirmBooking } = useBookings();
  const [selectedProof, setSelectedProof] = useState(null);
  const sorted = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const confirmed = sorted.filter((b) => b.status === 'confirmed').length;
  const pending = sorted.filter((b) => b.status === 'pending').length;
  const revenue = sorted
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { value: String(sorted.length), label: 'bookings' },
    { value: String(confirmed), label: 'confirmed' },
    { value: String(pending), label: 'pending' },
    { value: formatMoney(revenue), label: 'collected' },
  ];

  return (
    <section className="section admin" id="admin">
      <div className="section__head">
        <p className="section__eyebrow">Admin</p>
        <h2 className="section__title">Admin bookings</h2>
        <p className="section__sub">
          Every reservation, newest first. Review payment proofs and confirm bookings.
        </p>
      </div>

      <div className="admin__stats">
        {stats.map((stat) => (
          <div className="admin__stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="table-wrap scroll-x">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Court</th>
              <th>Date</th>
              <th>Time</th>
              <th>Payment</th>
              <th>Uploaded payment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr className="admin-table__empty">
                <td colSpan={11}>
                  No bookings yet. Once someone books a court, it'll show up here.
                </td>
              </tr>
            )}
            {sorted.map((booking, index) => {
              // Fall back gracefully in case a booking references an old court id.
              const court =
                COURTS.find((c) => c.id === booking.courtId) ??
                { label: booking.courtLabel || 'Court', color: 'var(--muted)' };
              const method = PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod);
              return (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td className="admin-table__name">{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td className="admin-table__court">
                    <span className="admin-table__dot" style={{ background: court.color }} />
                    {booking.courtLabel}
                  </td>
                  <td>{formatLongDate(booking.date)}</td>
                  <td>{booking.slots.map(slotLabel).join(', ')}</td>
                  <td>
                    {method.label}
                  </td>
                  <td>
                    {booking.proofFile ? (
                      <button type="button" className="text-btn" onClick={() => setSelectedProof(booking.proofFile)}>
                        View image
                      </button>
                    ) : '—'}
                  </td>
                  <td>{formatMoney(booking.amount)}</td>
                  <td className="admin-table__status">
                    <span className={`badge badge--${booking.status}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <button type="button" className="text-btn" onClick={() => confirmBooking(booking.id)}>
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedProof && <PaymentProofModal proof={selectedProof} onClose={() => setSelectedProof(null)} />}
    </section>
  );
}