/**
 * Brand mark: a paddle + ball drawn inline so no image assets are needed.
 * `size` is the rendered height in pixels.
 */
export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size * 1.35}
      height={size}
      viewBox="0 0 54 40"
      role="img"
      aria-label="Eliana's Pickleball logo"
      className="logo"
    >
      <defs>
        <linearGradient id="logoCourt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2ea06a" />
          <stop offset="45%" stopColor="#eab73a" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </defs>
      {/* Court oval with the four classic pickleball lines */}
      <ellipse cx="18" cy="20" rx="16" ry="12" fill="#0b0f14" stroke="url(#logoCourt)" strokeWidth="2.4" />
      <line x1="18" y1="9.5" x2="18" y2="30.5" stroke="#eab73a" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="17.4" y1="29.6" x2="17.4" y2="18.4" stroke="#3ecf7a" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="18.6" y1="10.4" x2="18.6" y2="21.6" stroke="#4d86d8" strokeWidth="1.6" strokeLinecap="round" />
      {/* Paddle handle leaning on the court */}
      <line x1="36" y1="9" x2="44" y2="31" stroke="#c4ccd8" strokeWidth="2.6" strokeLinecap="round" />
      {/* Ball pop of coral */}
      <circle cx="47" cy="12" r="3.6" fill="#ff6b35" />
    </svg>
  );
}