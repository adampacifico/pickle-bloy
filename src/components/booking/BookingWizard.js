import { useState } from 'react';
import Stepper from './Stepper';
import DetailsStep from './steps/DetailsStep';
import CourtTimeStep from './steps/CourtTimeStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmedStep from './steps/ConfirmedStep';
import { priceForSlots } from '../../constants';
import { useBookings } from '../../context/BookingsContext';
import { makeBookingId } from '../../utils/dateHelpers';

const EMPTY_FORM = () => ({
  name: '',
  phone: '',
  email: '',
  courtId: null,
  courtLabel: '',
  date: null,
  slots: [],
  paymentMethod: null,
  proofFile: null,
  proofFileName: '',
});

const NEXT_LABELS = [
  'Next: Choose court & time',
  'Next: Payment',
  'Confirm booking',
];

/**
 * The 4-step booking flow.
 *
 * State lives here as a single `form` object; each step gets the parts it
 * needs plus an `update(patch)` call so the flow stays easy to follow.
 * On confirm the booking goes through the data layer (context → API) so it
 * instantly shows up on the schedule board and in the admin table.
 */
export default function BookingWizard({ onViewBooking }) {
  const { bookings, createBooking } = useBookings();
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(0); // bumped to replay the entrance animation
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [lastBooking, setLastBooking] = useState(null);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canAdvance = [
    form.name.trim().length >= 2 && /^[+0-9][0-9 ()-]{6,16}$/.test(form.phone.trim()),
    Boolean(form.date) && form.slots.length > 0,
    Boolean(form.paymentMethod) &&
      (form.paymentMethod === 'cash' || Boolean(form.proofFile)),
    true,
  ][step];

  const goTo = (target) => {
    setShowErrors(false);
    setStepKey((key) => key + 1);
    setStep(target);
  };

  const next = () => {
    if (!canAdvance) return setShowErrors(true);
    if (step === 2) return confirmBooking();
    goTo(step + 1);
  };

  const back = () => {
    if (step > 0) goTo(step - 1);
  };

  const confirmBooking = async () => {
    const booking = {
      id: makeBookingId(),
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      courtId: form.courtId,
      courtLabel: form.courtLabel,
      date: form.date,
      slots: [...form.slots].sort(),
      hours: form.slots.length,
      amount: priceForSlots(form.slots),
      paymentMethod: form.paymentMethod,
      proofFile: form.proofFile,
      status: 'pending',
    };
    const created = await createBooking(booking);
    setLastBooking(created);
    onViewBooking(created);
    goTo(3);
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setLastBooking(null);
    goTo(0);
  };

  const stepContent = (key) => {
    switch (key) {
      case 0:
        return <DetailsStep form={form} update={update} showErrors={showErrors} />;
      case 1:
        return (
          <CourtTimeStep
            form={form}
            update={update}
            bookings={bookings}
            showErrors={showErrors}
          />
        );
      case 2:
        return <PaymentStep form={form} update={update} showErrors={showErrors} />;
      default:
        return (
          <ConfirmedStep
            booking={lastBooking}
            onReset={reset}
            onViewBooking={onViewBooking}
          />
        );
    }
  };

  return (
    <section className="section wizard" id="book">
      <div className="section__head">
        <p className="section__eyebrow">Booking</p>
        <h2 className="section__title">Book a court</h2>
        <p className="section__sub">
          Pick a time, see it open up on the board in real time, and you're on it.
        </p>
      </div>

      <Stepper current={step} />

      <div className="wizard__card">
        <div key={stepKey} className="wizard__step">
          {stepContent(step)}
        </div>

        {step < 3 && (
          <div className="wizard__foot">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={back}
              disabled={step === 0}
            >
              ← Back
            </button>
            <button type="button" className="btn btn--accent" onClick={next}>
              {NEXT_LABELS[step]} →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}