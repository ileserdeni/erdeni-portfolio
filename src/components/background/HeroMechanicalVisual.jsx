import { motion, useReducedMotion } from 'framer-motion';

const ACCENT = '#5ba4c9';
const DURATION = 56;

/**
 * Blocky spur-gear profile: radial flanks, flat crown arc, flat root arc.
 * Tooth width and gap are equal (classic machined gear look).
 */
function polar(r, angle) {
  return [r * Math.cos(angle), r * Math.sin(angle)];
}

function gearPath(pitchRadius, teeth) {
  const outerR = pitchRadius * 1.06;
  const rootR = pitchRadius * 0.94;
  const step = (Math.PI * 2) / teeth;
  const toothSpan = step / 2;
  const largeArc = toothSpan > Math.PI ? 1 : 0;

  let d = '';

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step - Math.PI / 2;
    const a1 = a0 + toothSpan;
    const a2 = a0 + step;

    const [ox0, oy0] = polar(outerR, a0);
    const [ox1, oy1] = polar(outerR, a1);
    const [rx1, ry1] = polar(rootR, a1);
    const [rx2, ry2] = polar(rootR, a2);
    const [ox2, oy2] = polar(outerR, a2);

    if (i === 0) d += `M ${ox0.toFixed(2)} ${oy0.toFixed(2)}`;
    else d += ` L ${ox0.toFixed(2)} ${oy0.toFixed(2)}`;

    d += ` A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox1.toFixed(2)} ${oy1.toFixed(2)}`;
    d += ` L ${rx1.toFixed(2)} ${ry1.toFixed(2)}`;
    d += ` A ${rootR} ${rootR} 0 ${largeArc} 1 ${rx2.toFixed(2)} ${ry2.toFixed(2)}`;
    d += ` L ${ox2.toFixed(2)} ${oy2.toFixed(2)}`;
  }

  return `${d} Z`;
}

function RotatingGear({ x, y, pitchRadius, teeth, rotation, duration, reduceMotion }) {
  const hubR = pitchRadius * 0.42;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g>
        {!reduceMotion && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to={`${rotation} 0 0`}
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        )}
        <path
          d={gearPath(pitchRadius, teeth)}
          fill="rgba(91, 164, 201, 0.05)"
          stroke={ACCENT}
          strokeWidth="1.15"
          strokeOpacity="0.65"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />
        <circle
          r={hubR}
          fill="#09090b"
          stroke={ACCENT}
          strokeWidth="0.85"
          strokeOpacity="0.45"
        />
      </g>
    </g>
  );
}

// Matched module (~3.9) for consistent tooth scale
const GEARS = {
  large: { pitchRadius: 78, teeth: 20 },
  small: { pitchRadius: 50, teeth: 13 },
};

const GAP = 22;
const outerR = (r) => r * 1.06;

const LARGE = { x: 238, y: 218 };

// Separated composition — no overlap, consistent gaps
const TOP_LEFT = {
  x: LARGE.x + (outerR(GEARS.large.pitchRadius) + GAP + outerR(GEARS.small.pitchRadius)) * Math.cos((-135 * Math.PI) / 180),
  y: LARGE.y + (outerR(GEARS.large.pitchRadius) + GAP + outerR(GEARS.small.pitchRadius)) * Math.sin((-135 * Math.PI) / 180),
};

const RIGHT = {
  x: LARGE.x + outerR(GEARS.large.pitchRadius) + GAP + outerR(GEARS.small.pitchRadius),
  y: LARGE.y,
};

const PAD = 48;

const gearPositions = [
  { key: 'large', ...LARGE, ...GEARS.large, rotation: 360, duration: DURATION },
  { key: 'top-left', ...TOP_LEFT, ...GEARS.small, rotation: -360, duration: DURATION * 1.12 },
  { key: 'right', ...RIGHT, ...GEARS.small, rotation: 360, duration: DURATION * 0.9 },
];

const bounds = {
  minX: Math.min(...gearPositions.map((g) => g.x - outerR(g.pitchRadius))) - PAD,
  minY: Math.min(...gearPositions.map((g) => g.y - outerR(g.pitchRadius))) - PAD,
  maxX: Math.max(...gearPositions.map((g) => g.x + outerR(g.pitchRadius))) + PAD,
  maxY: Math.max(...gearPositions.map((g) => g.y + outerR(g.pitchRadius))) + PAD,
};

const VIEW_W = bounds.maxX - bounds.minX;
const VIEW_H = bounds.maxY - bounds.minY;

export default function HeroMechanicalVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative w-full max-w-[min(100%,420px)] md:max-w-[min(100%,480px)]"
      animate={reduceMotion ? {} : { y: [0, -4, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(91,164,201,0.1) 0%, rgba(91,164,201,0.025) 60%, transparent 80%)',
        }}
        animate={reduceMotion ? {} : { opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        viewBox={`${bounds.minX} ${bounds.minY} ${VIEW_W} ${VIEW_H}`}
        className="relative h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="gear-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#gear-glow)">
          {gearPositions.map((gear) => (
            <RotatingGear
              key={gear.key}
              x={gear.x}
              y={gear.y}
              pitchRadius={gear.pitchRadius}
              teeth={gear.teeth}
              rotation={gear.rotation}
              duration={gear.duration}
              reduceMotion={reduceMotion}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
