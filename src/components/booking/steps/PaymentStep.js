import {
  OFF_PEAK_PRICE,
  PAYMENT_METHODS,
  PEAK_PRICE,
  priceForSlot,
  priceForSlots,
} from '../../../constants';
import { formatLongDate, formatMoney, slotLabel } from '../../../utils/dateHelpers';

/**
 * Step 3 — choose a payment method.
 * GCash / bank transfer ask for an uploaded proof image.
 */
export default function PaymentStep({ form, update, showErrors }) {
  const offPeakCount = form.slots.filter((s) => priceForSlot(s) === OFF_PEAK_PRICE).length;
  const peakCount = form.slots.length - offPeakCount;
  const offPeakTotal = offPeakCount * OFF_PEAK_PRICE;
  const peakTotal = peakCount * PEAK_PRICE;
  const total = priceForSlots(form.slots);
  const needsProof = form.paymentMethod === 'gcash';
  const proofOk = !needsProof || Boolean(form.proofFile);
  const courtLabel = form.courtLabel || 'Selected court';

  return (
    <div className="step-card">
      <h3 className="step-card__title">Payment</h3>

      {/* Mini confirmation of what the player is paying for */}
      <div className="payment-summary">
        <p>
          <strong>{courtLabel}</strong> · {formatLongDate(form.date)}
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
            Peak (5PM–6AM): {peakCount} hr × {formatMoney(PEAK_PRICE)} ={' '}
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
            <div className={`pay-method-option pay-method-option--${method.id}`} key={method.id}>
            <button
              type="button"
              className={`pay-method ${isActive ? 'pay-method--active' : ''}`}
              onClick={() => update({ paymentMethod: method.id, proofFile: null, proofFileName: '' })}
            >
              <span className="pay-method__icon" aria-hidden="true">
                {method.id === 'gcash' ? (
                  <img src="/gcash-com-logo.png" alt="" />
                ) : method.icon}
              </span>
              <span className="pay-method__copy">
                <strong>{method.label}</strong>
                <small>{method.hint}</small>
              </span>
              <span className="pay-method__radio" aria-hidden="true" />
            </button>
            {isActive && method.id === 'gcash' && (
              <div className="gcash-qr">
                <p>Scan to pay with GCash</p>
                <img src="/qr.png" alt="GCash payment QR code" />
              </div>
            )}
            </div>
          );
        })}
      </div>

      {needsProof && (
        <label className="proof">
          <span className="proof__plus" aria-hidden="true">＋</span>
          <span className="proof__copy">
            <strong>Upload payment proof</strong>
            <small className={`proof__file ${form.proofFile ? 'proof__file--set' : ''}`}>
              {form.proofFileName || 'No file selected'}
            </small>
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) {
                update({ proofFile: null, proofFileName: '' });
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                update({ proofFile: null, proofFileName: 'Image must be 5 MB or smaller' });
                return;
              }
              const reader = new FileReader();
              reader.onload = () => update({ proofFile: reader.result, proofFileName: file.name });
              reader.readAsDataURL(file);
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