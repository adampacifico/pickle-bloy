import {
  COURTS,
  OFF_PEAK_PRICE,
  PAYMENT_METHODS,
  PEAK_PRICE,
  priceForSlot,
  priceForSlots,
} from '../../../constants';
import { formatLongDate, formatMoney, slotLabel } from '../../../utils/dateHelpers';

/**
 * Step 3 — choose a payment method.
 * GCash / bank transfer ask for an uploaded proof (file name only,
 * kept in local state as a demo).
 */
export default function PaymentStep({ form, update, showErrors }) {
  const offPeakCount = form.slots.filter((s) => priceForSlot(s) === OFF_PEAK_PRICE).length;
  const peakCount = form.slots.length - offPeakCount;
  const offPeakTotal = offPeakCount * OFF_PEAK_PRICE;
  const peakTotal = peakCount * PEAK_PRICE;
  const total = priceForSlots(form.slots);
  const needsProof = form.paymentMethod === 'gcash' || form.paymentMethod === 'bank';
  const proofOk = !needsProof || Boolean(form.proofFile);
  const court = COURTS.find((c) => c.id === form.courtId);

  return (
    <div className="step-card">
      <h3 className="step-card__title">Payment</h3>

      {/* Mini confirmation of what the player is paying for */}
      <div className="payment-summary">
        <p>
          <strong>{court.label}</strong> · {formatLongDate(form.date)}
        </p>
        <p>
          {form.slots.map(slotLabel).join(' · ')} — {form.slots.length} hr
        </p>
        {offPeakCount > 0 && (
          <p className="payment-summary__line">
            Off-peak (6AM–5PM): {offPeakCount} hr × {formatMoney(OFF_PEAK_PRICE)} ={' '}
            {formatMoney(offPeakTotal)}
          </p>
        )}
        {peakCount > 0 && (
          <p className="payment-summary__line">
            Peak (5PM–9PM): {peakCount} hr × {formatMoney(PEAK_PRICE)} ={' '}
            {formatMoney(peakTotal)}
          </p>
        )}
        <p className="payment-summary__total">
          Amount due <strong>{formatMoney(total)}</strong>
        </p>
      </div>

      <div className="pay-methods" role="group" aria-label="Payment method">
        {PAYMENT_METHODS.map((method) => {
          const isActive = form.paymentMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              className={`pay-method ${isActive ? 'pay-method--active' : ''}`}
              onClick={() => update({ paymentMethod: method.id, proofFile: null })}
            >
              <span className="pay-method__icon" aria-hidden="true">
                {method.icon}
              </span>
              <span className="pay-method__copy">
                <strong>{method.label}</strong>
                <small>{method.hint}</small>
              </span>
              <span className="pay-method__radio" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {needsProof && (
        <label className="proof">
          <span className="proof__plus" aria-hidden="true">＋</span>
          <span className="proof__copy">
            <strong>Upload payment proof</strong>
            <small className={`proof__file ${form.proofFile ? 'proof__file--set' : ''}`}>
              {form.proofFile || 'No file selected'}
            </small>
          </span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              update({ proofFile: file ? file.name : null });
            }}
          />
        </label>
      )}

      {showErrors && !proofOk && (
        <p className="field__error form-error">
          Choose a payment method and attach a payment proof.
        </p>
      )}
    </div>
  );
}