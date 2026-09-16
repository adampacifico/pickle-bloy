/**
 * Step 1 — contact details.
 * Simple controlled inputs with inline validation that only appears
 * after the player has tried to move on.
 */
export default function DetailsStep({ form, update, showErrors }) {
  const nameOk = form.name.trim().length >= 2;
  const phoneOk = /^[+0-9][0-9 ()-]{6,16}$/.test(form.phone.trim());

  return (
    <div className="step-card">
      <h3 className="step-card__title">Who's playing?</h3>

      <label className="field">
        <span className="field__label">Full name</span>
        <input
          className="input"
          type="text"
          value={form.name}
          placeholder="e.g. Albert Carlo"
          autoComplete="name"
          onChange={(e) => update({ name: e.target.value })}
        />
        {showErrors && !nameOk && (
          <span className="field__error">Please enter your full name.</span>
        )}
      </label>

      <label className="field">
        <span className="field__label">Phone number</span>
        <input
          className="input"
          type="tel"
          value={form.phone}
          placeholder="e.g. 0917 555 0184"
          autoComplete="tel"
          onChange={(e) => update({ phone: e.target.value })}
        />
        {showErrors && !phoneOk && (
          <span className="field__error">Enter a valid phone number.</span>
        )}
      </label>

      <label className="field">
        <span className="field__label">Email (optional)</span>
        <input
          className="input"
          type="email"
          value={form.email}
          placeholder="e.g. name@example.com"
          autoComplete="email"
          onChange={(e) => update({ email: e.target.value })}
        />
      </label>

      <p className="step-card__hint">
        We use these details to confirm your slot and reach you on the day.
      </p>
    </div>
  );
}