/**
 * Lightweight inline SVG bus illustration for the hero — no image download,
 * scales cleanly, and stays crisp on every screen. Decorative only.
 */
export default function HeroArt() {
    return (
        <svg viewBox="0 0 520 360" role="img" aria-label="Illustration of a PERJODA bus on the road">
            <defs>
                <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#e8f0fb" />
                </linearGradient>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1c69d6" />
                    <stop offset="1" stopColor="#0a3ea1" />
                </linearGradient>
            </defs>

            <rect x="0" y="0" width="520" height="360" rx="24" fill="url(#sky)" />
            <circle cx="430" cy="80" r="46" fill="#fcd116" opacity="0.9" />

            {/* skyline */}
            <g fill="#0a2f57" opacity="0.55">
                <rect x="20" y="150" width="46" height="120" rx="4" />
                <rect x="74" y="120" width="38" height="150" rx="4" />
                <rect x="120" y="170" width="52" height="100" rx="4" />
                <rect x="360" y="140" width="44" height="130" rx="4" />
                <rect x="412" y="168" width="40" height="102" rx="4" />
                <rect x="458" y="132" width="44" height="138" rx="4" />
            </g>

            {/* road */}
            <rect x="0" y="270" width="520" height="90" fill="#0a2747" />
            <g stroke="#fcd116" strokeWidth="6" strokeDasharray="34 26" strokeLinecap="round">
                <line x1="10" y1="316" x2="510" y2="316" />
            </g>

            {/* bus */}
            <g>
                <rect x="70" y="150" width="330" height="120" rx="20" fill="url(#busBody)" stroke="#c7d7ec" strokeWidth="2" />
                <rect x="70" y="150" width="330" height="26" rx="14" fill="#1552cc" />
                <rect x="88" y="188" width="60" height="42" rx="8" fill="#bcd4f2" />
                <rect x="158" y="188" width="60" height="42" rx="8" fill="#bcd4f2" />
                <rect x="228" y="188" width="60" height="42" rx="8" fill="#bcd4f2" />
                <rect x="300" y="188" width="82" height="42" rx="8" fill="#bcd4f2" />
                <rect x="70" y="236" width="330" height="18" fill="#0a3ea1" />
                <circle cx="140" cy="278" r="26" fill="#10233b" />
                <circle cx="140" cy="278" r="11" fill="#7f97b5" />
                <circle cx="330" cy="278" r="26" fill="#10233b" />
                <circle cx="330" cy="278" r="11" fill="#7f97b5" />
                <rect x="384" y="196" width="14" height="20" rx="3" fill="#fcd116" />
                <text x="235" y="140" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22" fill="#ffffff" letterSpacing="3">PERJODA</text>
            </g>
        </svg>
    );
}
