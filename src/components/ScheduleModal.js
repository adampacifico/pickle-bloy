import { useEffect } from 'react';
import { buildSlotTimes, formatLongDate, slotLabel } from '../utils/dateHelpers';

export default function ScheduleModal({ date, courts, bookings, courtColors, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal__card schedule-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close schedule">×</button>
        <div className="modal__head schedule-modal__head">
          <div>
            <p className="schedule-modal__eyebrow">Schedule</p>
            <h3>{formatLongDate(date)}</h3>
          </div>
          <div className="schedule-modal__legend">
            <span><i className="schedule-slot schedule-slot--open" /> Open</span>
            <span><i className="schedule-slot schedule-slot--pending" /> Pending</span>
            <span><i className="schedule-slot schedule-slot--confirmed" /> Confirmed</span>
          </div>
        </div>
        <div className="schedule-modal__courts">
          {courts.map((court, index) => {
            const bookedSlots = new Map();
            bookings
              .filter((booking) => String(booking.courtId) === String(court.id))
              .forEach((booking) => booking.slots.forEach((slot) => bookedSlots.set(slot, booking.status)));

            return (
              <section className="schedule-modal__court" key={court.id}>
                <h4>
                  <span className="day-board__dot" style={{ background: courtColors[index % courtColors.length] }} />
                  {court.label}
                </h4>
                <div className="schedule-modal__slots">
                  {buildSlotTimes().map((slot) => {
                    const status = bookedSlots.get(slot);
                    return (
                      <div className={`schedule-slot ${status ? `schedule-slot--${status}` : 'schedule-slot--open'}`} key={slot}>
                        <strong>{slotLabel(slot)}</strong>
                        <small>{status || 'Available'}</small>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}