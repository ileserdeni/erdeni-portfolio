// Preview plate for Threshold, used until real app screenshots are supplied. It only
// shows facts from the project description: one dot per trial (1,011), the data
// sources, and the award. The dots are uniform on purpose; nothing here encodes
// results the project hasn't published.

import { useId } from 'react';

const TRIALS = 1011;
const COLS = 37;

export const thresholdFacts = {
  trials: TRIALS,
  sources: ['ClinicalTrials.gov', 'County health', 'Environmental justice'],
};

function Dots({ x, y, w, r }) {
  const step = w / COLS;
  return (
    <g fill="#a9e8ff">
      {Array.from({ length: TRIALS }, (_, i) => (
        <circle key={i} cx={x + (i % COLS) * step + step / 2} cy={y + Math.floor(i / COLS) * step + step / 2} r={r} opacity={0.5 + ((i * 7919) % 13) / 40} />
      ))}
    </g>
  );
}

export default function ThresholdPlate({ award, compact = false, className = '', title }) {
  const id = useId().replace(/:/g, '');
  if (compact) {
    return (
      <svg viewBox="0 0 400 300" className={className} role="img" aria-label={title ?? 'Threshold preview'}>
        <rect width="400" height="300" fill="#050b12" />
        <Dots x={30} y={24} w={340} r={2.6} />
        <line x1="20" y1="282" x2="380" y2="282" stroke="#dff7ff" strokeWidth="3" />
      </svg>
    );
  }
  const rows = Math.ceil(TRIALS / COLS);
  const field = { x: 412, y: 158, w: 344 };
  const sill = field.y + (rows * field.w) / COLS + 14;
  return (
    <svg viewBox="0 0 800 600" className={className} role="img" aria-label={title ?? `Threshold: ${TRIALS.toLocaleString('en-US')} cancer trials with a recruiting Massachusetts site`}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#0b1724" />
          <stop offset="1" stopColor="#04080d" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-bg)`} />
      <g stroke="#a9e8ff" strokeOpacity="0.35" fill="none">
        <path d="M 20 44 V 20 H 44 M 756 20 H 780 V 44 M 780 556 V 580 H 756 M 44 580 H 20 V 556" />
      </g>

      <text x="44" y="70" className="lab-tag" fontSize="15" fill="#a9e8ff">
        Threshold · Team Threshold
      </text>
      {award && (
        <g>
          <rect x="44" y="92" width={award.length * 10.2 + 40} height="34" fill="rgb(169 232 255 / 0.1)" stroke="#dff7ff" strokeOpacity="0.6" />
          <path d="M 58 101 l 6 -3 l 6 3 v 9 l -6 5 l -6 -5 z" fill="none" stroke="#dff7ff" strokeWidth="1.4" />
          <text x="80" y="114" className="lab-tag" fontSize="14" fill="#e8fbff">
            {award}
          </text>
        </g>
      )}

      <text x="40" y="300" className="display" fontSize="150" fill="#ece6da">
        {TRIALS.toLocaleString('en-US')}
      </text>
      <text x="46" y="342" fontSize="22" fill="#c9d4da">
        cancer trials with a recruiting
      </text>
      <text x="46" y="370" fontSize="22" fill="#c9d4da">
        Massachusetts site
      </text>

      <g filter={`url(#${id}-glow)`} opacity="0.35">
        <line x1={field.x - 10} y1={sill} x2={field.x + field.w + 10} y2={sill} stroke="#dff7ff" strokeWidth="6" />
      </g>
      <Dots x={field.x} y={field.y} w={field.w} r={2.9} />
      <line x1={field.x - 10} y1={sill} x2={field.x + field.w + 10} y2={sill} stroke="#dff7ff" strokeWidth="2" />
      <text x={field.x + field.w + 10} y={sill + 26} textAnchor="end" className="lab-tag" fontSize="12" fill="#a9e8ff" opacity="0.8">
        One dot per trial
      </text>

      <text x="44" y="470" className="lab-tag" fontSize="12" fill="#7f97a6">
        Combines
      </text>
      {thresholdFacts.sources.map((s, i) => (
        <text key={s} x="44" y={498 + i * 26} className="lab-tag" fontSize="15" fill="#dff7ff">
          {s}
        </text>
      ))}
      <text x="756" y="566" textAnchor="end" className="lab-tag" fontSize="11" fill="#7f97a6">
        Designed plate · not an app screenshot
      </text>
    </svg>
  );
}
