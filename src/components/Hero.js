import { useEffect, useState } from 'react';
import { COURTS, CURRENCY, HERO, OFF_PEAK_PRICE, PEAK_PRICE } from '../constants';
import { useBookings } from '../context/BookingsContext';

const PREVIEW_START = 6;
const PREVIEW_HOURS = 12; // 6 AM -> 6 PM previewed on the hero board

/** Start a preview board: every cell open except a few random "booked" ones. */
function makeBoard() {
  return COURTS.map((court) =>
    Array.from({ length: PREVIEW_HOURS }, () => ({ booked: Math.random() < 0.28 }))
  );
}

/**
 * Small live animation on the hero: a real-time "board" that flips one
 * random slot open/booked every couple of seconds. Purely decorative —
 * the real data lives in the booking wizard below it.
 */
function LiveBoardPreview() {
  const [board, setBoard] = useState(makeBoard);
  const [change, setChange] = useState(null); // last cell that flipped

  useEffect(() => {
    const timer = setInterval(() => {
      const courtIdx = Math.floor(Math.random() * COURTS.length);
      const cellIdx = Math.floor(Math.random() * PREVIEW_HOURS);
      setBoard((prev) =>
        prev.map((row, r) =>
          r === courtIdx
            ? row.map((cell, c) => (c === cellIdx ? { booked: !cell.booked } : cell))
            : row
        )
      );
      setChange({ courtIdx, cellIdx, at: Date.now() });
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero__board" aria-hidden="true">
      <div className="hero__board-head">
        <span className="hero__board-dot" />
        Live court board
        <span className="hero__board-live">● live</span>
      </div>
      <div className="hero__board-rows">
        {COURTS.map((court, r) => (
          <div className="hero__board-row" key={court.id}>
            <span className="hero__board-court" style={{ background: court.color }}>
              {r + 1}
            </span>
            {board[r].map((cell, c) => {
              const justFlipped =
                change && change.courtIdx === r && change.cellIdx === c;
              return (
                <span
                  key={c}
                  className={`hero__board-cell ${cell.booked ? 'is-booked' : 'is-open'} ${justFlipped ? 'just-flipped' : ''}`}
                  style={{ background: cell.booked ? undefined : court.color }}
                  title={`${PREVIEW_START + c}:00`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="hero__board-legend">
        <span className="hero__board-legend-item">
          <i className="hero__board-swatch is-open" /> open
        </span>
        <span className="hero__board-legend-item">
          <i className="hero__board-swatch is-booked" /> booked
        </span>
      </div>
    </div>
  );
}

/**
 * Hero section. All copy comes from the HERO config in constants.js,
 * stats are computed from real bookings via the shared context.
 */
export default function Hero() {
  const { bookings } = useBookings();
  const totalHours = bookings.reduce((sum, b) => sum + b.hours, 0);

  const stats = [
    { value: String(bookings.length), label: 'bookings' },
    { value: String(totalHours), label: 'hours booked' },
    { value: `${COURTS.length}`, label: 'courts' },
    { value: `${CURRENCY}${OFF_PEAK_PRICE}–${PEAK_PRICE}`, label: 'pesos / hr' },
  ];

  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">{HERO.eyebrow}</p>
          <h1 className="hero__title">
            {HERO.title}
            <span className="hero__title-accent"> {HERO.accent}</span>
          </h1>
          <p className="hero__sub">{HERO.subtitle}</p>
          <div className="hero__actions">
            <a className="btn btn--accent btn--lg" href={HERO.primaryCta.href}>
              {HERO.primaryCta.label}
            </a>
            <a className="btn btn--ghost btn--lg" href={HERO.secondaryCta.href}>
              {HERO.secondaryCta.label}
            </a>
          </div>
          <dl className="hero__stats">
            {stats.map((stat) => (
              <div className="hero__stat" key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <LiveBoardPreview />
      </div>
    </section>
  );
}