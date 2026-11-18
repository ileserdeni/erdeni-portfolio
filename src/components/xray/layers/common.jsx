import { getMedia } from '../../media/Picture';

export const C = {
  ice: '#a9e8ff',
  bright: '#dff7ff',
  dim: 'rgba(169,232,255,0.38)',
  faint: 'rgba(169,232,255,0.16)',
  bone: '#ece6da',
  film: '#06101b',
};

/** Dark interior plate with an optional inverted "ghost" of the exterior photo. */
export function Interior({ ghost, viewBox, children }) {
  const media = getMedia(ghost);
  const src = media?.sources[Math.min(1, media.sources.length - 1)].src;
  return (
    <div className="absolute inset-0">
      <div className="xr-tint" />
      {src && <img className="xr-ghost" src={src} alt="" loading="lazy" decoding="async" />}
      <div className="xr-tone" />
      <svg
        className="xr-svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke={C.ice}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}

/** Leader line from a point to a label. */
export function Callout({ x, y, dx = 60, dy = -40, label, sub, size = 17, anchor }) {
  const tx = x + dx;
  const ty = y + dy;
  const end = anchor ?? (dx >= 0 ? 'start' : 'end');
  const pad = end === 'start' ? 6 : -6;
  return (
    <g>
      <circle cx={x} cy={y} r="4" fill={C.bright} stroke="none" />
      <polyline points={`${x},${y} ${tx},${ty} ${tx + pad * 4},${ty}`} stroke={C.bright} strokeWidth="1.5" />
      <text
        x={tx + pad * 5}
        y={ty + size * 0.35}
        fill={C.bright}
        stroke="none"
        fontSize={size}
        textAnchor={end}
      >
        {label}
      </text>
      {sub && (
        <text
          x={tx + pad * 5}
          y={ty + size * 1.5}
          fill={C.ice}
          stroke="none"
          fontSize={size * 0.8}
          textAnchor={end}
          opacity="0.75"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Stamp({ x, y, children, size = 13, anchor = 'start' }) {
  return (
    <text x={x} y={y} fill={C.ice} stroke="none" fontSize={size} textAnchor={anchor} opacity="0.7">
      {children}
    </text>
  );
}

/** Points on a grid spanning a quadrilateral (p0 top-left, p1 top-right, p2 bottom-right, p3 bottom-left). */
export function quadGrid([p0, p1, p2, p3], cols, rows) {
  const pts = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const u = (c + 0.5) / cols;
      const v = (r + 0.5) / rows;
      const top = [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u];
      const bot = [p3[0] + (p2[0] - p3[0]) * u, p3[1] + (p2[1] - p3[1]) * u];
      pts.push([top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v]);
    }
  }
  return pts;
}

export const poly = (pts) => pts.map((p) => p.join(',')).join(' ');

/** A coil spring/solenoid drawn vertically from (x, y1) to (x, y2). */
export function Coil({ x, y1, y2, w = 24, turns = 8 }) {
  const lines = [];
  const step = (y2 - y1) / turns;
  for (let i = 0; i <= turns; i += 1) {
    const y = y1 + step * i;
    lines.push(<line key={i} x1={x - w / 2} y1={y} x2={x + w / 2} y2={y + step * 0.5} strokeWidth="1.3" />);
  }
  return (
    <g>
      <rect x={x - w / 2} y={y1} width={w} height={y2 - y1} rx="3" />
      {lines}
    </g>
  );
}
