import { useEffect } from 'react';

export default function PaymentProofModal({ proof, onClose }) {
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
      <div className="modal__card payment-proof-modal" role="dialog" aria-modal="true" aria-label="Payment proof" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close payment proof">×</button>
        <div className="modal__head"><h3>Uploaded payment</h3></div>
        <img className="payment-proof-modal__image" src={proof} alt="Uploaded payment proof" />
      </div>
    </div>
  );
}