const STEPS = [
  { n: '01', label: 'Details' },
  { n: '02', label: 'Court & Time' },
  { n: '03', label: 'Payment' },
  { n: '04', label: 'Confirmed' },
];

/** Horizontal progress indicator shown above the wizard card. */
export default function Stepper({ current }) {
  return (
    <ol className="stepper" aria-label="Booking progress">
      {STEPS.map((step, index) => {
        const state =
          index < current ? 'is-done' : index === current ? 'is-current' : 'is-upcoming';
        return (
          <li key={step.n} className={`stepper__item ${state}`}>
            <span className="stepper__num" aria-hidden={state === 'is-done' ? undefined : true}>
              {state === 'is-done' ? '✓' : step.n}
            </span>
            <span className="stepper__label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}