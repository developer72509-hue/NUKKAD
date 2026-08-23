export default function StorefrontIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="480" height="360" rx="24" fill="var(--color-sand-50)" />

      {/* Sky glow */}
      <circle cx="400" cy="70" r="70" fill="var(--color-sand-200)" opacity="0.6" />
      <circle cx="400" cy="60" r="26" fill="var(--color-warning-500)" opacity="0.55" />

      {/* Trees */}
      <rect x="18" y="180" width="8" height="60" rx="3" fill="var(--color-brand-700)" />
      <circle cx="22" cy="168" r="26" fill="var(--color-success-500)" opacity="0.85" />
      <rect x="452" y="120" width="7" height="70" rx="3" fill="var(--color-brand-700)" />
      <circle cx="455" cy="106" r="24" fill="var(--color-success-500)" opacity="0.85" />

      {/* Ground */}
      <rect x="0" y="290" width="480" height="70" fill="var(--color-sand-200)" />

      {/* "Local Shop" hanging tag */}
      <g transform="translate(348, 40) rotate(-6)">
        <rect x="0" y="0" width="108" height="46" rx="8" fill="#fff8ec" stroke="var(--color-brand-300)" strokeWidth="2" />
        <text x="54" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-brand-700)" fontFamily="sans-serif">Local</text>
        <text x="54" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-brand-700)" fontFamily="sans-serif">Shop</text>
        <path d="M92 10 l6 -6 l6 6 l-3 0 l0 8 l-6 0 l0 -8 z" fill="var(--color-brand-500)" />
      </g>

      {/* Shop 1 */}
      <rect x="40" y="140" width="140" height="150" rx="6" fill="#fffaf0" stroke="var(--color-sand-300)" strokeWidth="2" />
      <rect x="40" y="140" width="140" height="26" fill="var(--color-brand-500)" />
      <rect x="55" y="180" width="45" height="60" rx="3" fill="var(--color-sand-200)" />
      <rect x="110" y="180" width="55" height="35" rx="3" fill="var(--color-sand-50)" stroke="var(--color-sand-300)" />
      <rect x="55" y="255" width="110" height="35" rx="3" fill="var(--color-brand-600)" />

      {/* Shop 2 (taller, center) */}
      <rect x="190" y="100" width="170" height="190" rx="6" fill="#fffaf0" stroke="var(--color-sand-300)" strokeWidth="2" />
      <rect x="190" y="100" width="170" height="30" fill="var(--color-brand-700)" />
      <polygon points="185,100 275,70 365,100" fill="var(--color-brand-800)" />
      <rect x="210" y="150" width="50" height="70" rx="3" fill="var(--color-sand-200)" />
      <rect x="275" y="150" width="65" height="45" rx="3" fill="var(--color-sand-50)" stroke="var(--color-sand-300)" />
      <rect x="230" y="235" width="100" height="55" rx="3" fill="var(--color-brand-500)" />
      <rect x="265" y="250" width="30" height="40" fill="var(--color-brand-800)" />

      {/* Shop 3 */}
      <rect x="370" y="150" width="130" height="140" rx="6" fill="#fffaf0" stroke="var(--color-sand-300)" strokeWidth="2" />
      <rect x="370" y="150" width="130" height="26" fill="var(--color-brand-400)" />
      <rect x="385" y="188" width="45" height="55" rx="3" fill="var(--color-sand-200)" />
      <rect x="440" y="188" width="45" height="55" rx="3" fill="var(--color-sand-50)" stroke="var(--color-sand-300)" />
      <rect x="385" y="255" width="100" height="30" rx="3" fill="var(--color-brand-600)" />

      {/* Crates / produce accents */}
      <rect x="60" y="270" width="20" height="20" rx="2" fill="var(--color-warning-500)" />
      <rect x="86" y="270" width="20" height="20" rx="2" fill="var(--color-success-500)" />
      <circle cx="405" cy="270" r="9" fill="var(--color-warning-500)" />
      <circle cx="422" cy="270" r="9" fill="var(--color-brand-500)" />

      {/* Awning stripes on center shop */}
      <rect x="200" y="130" width="18" height="20" fill="var(--color-brand-500)" />
      <rect x="236" y="130" width="18" height="20" fill="#ffffff" />
      <rect x="272" y="130" width="18" height="20" fill="var(--color-brand-500)" />
      <rect x="308" y="130" width="18" height="20" fill="#ffffff" />
      <rect x="344" y="130" width="18" height="20" fill="var(--color-brand-500)" />

      {/* Awning stripes on shop 1 */}
      <rect x="40" y="166" width="17.5" height="14" fill="var(--color-brand-500)" />
      <rect x="57.5" y="166" width="17.5" height="14" fill="#ffffff" />
      <rect x="75" y="166" width="17.5" height="14" fill="var(--color-brand-500)" />
      <rect x="92.5" y="166" width="17.5" height="14" fill="#ffffff" />
      <rect x="110" y="166" width="17.5" height="14" fill="var(--color-brand-500)" />
      <rect x="127.5" y="166" width="17.5" height="14" fill="#ffffff" />
      <rect x="145" y="166" width="17.5" height="14" fill="var(--color-brand-500)" />
      <rect x="162.5" y="166" width="17.5" height="14" fill="#ffffff" />

      {/* Awning stripes on shop 3 */}
      <rect x="370" y="176" width="16.25" height="14" fill="var(--color-brand-400)" />
      <rect x="386.25" y="176" width="16.25" height="14" fill="#ffffff" />
      <rect x="402.5" y="176" width="16.25" height="14" fill="var(--color-brand-400)" />
      <rect x="418.75" y="176" width="16.25" height="14" fill="#ffffff" />
      <rect x="435" y="176" width="16.25" height="14" fill="var(--color-brand-400)" />
      <rect x="451.25" y="176" width="16.25" height="14" fill="#ffffff" />
      <rect x="467.5" y="176" width="16.25" height="14" fill="var(--color-brand-400)" />
    </svg>
  );
}
