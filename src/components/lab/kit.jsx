// Shared drawing kit for the lab stations: one tonal ramp for everything seen at
// rest (photos are mapped onto it by <ToneFilter>, illustrations take colours from
// `tone()`), and one radiograph vocabulary for everything seen through the X-ray
// (density fills, bright edges, bloom and grain). Keeping both in one place is what
// lets a real photo and a drawn object sit in the same room.

import { useId } from 'react';

/* ------------------------------------------------------------------ tones */

// Cold studio light: near-black → deep blue → steel → ice. Stops are [L, r, g, b].
const RAMP = [
  [0, 4, 7, 11],
  [0.22, 12, 22, 33],
  [0.45, 34, 58, 78],
  [0.68, 92, 128, 150],
  [0.86, 176, 210, 224],
  [1, 236, 248, 252],
];

export function tone(l, a = 1) {
  const t = Math.min(1, Math.max(0, l));
  let i = 1;
  while (i < RAMP.length - 1 && RAMP[i][0] < t) i += 1;
  const [l0, ...c0] = RAMP[i - 1];
  const [l1, ...c1] = RAMP[i];
  const k = (t - l0) / (l1 - l0 || 1);
  const [r, g, b] = c0.map((c, j) => Math.round(c + (c1[j] - c) * k));
  return a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}

const table = (ch) =>
  Array.from({ length: 11 }, (_, i) => {
    const v = tone(i / 10)
      .match(/\d+/g)
      .map(Number)[ch];
    return (v / 255).toFixed(3);
  }).join(' ');

/** Maps any image onto the room's ramp by luminance. `lift` brightens midtones. */
export function ToneFilter({ id, contrast = 1.05, lift = 0 }) {
  const k = contrast;
  const o = (1 - k) / 2 + lift;
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values={`0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0`} />
      <feComponentTransfer>
        <feFuncR type="linear" slope={k} intercept={o} />
        <feFuncG type="linear" slope={k} intercept={o} />
        <feFuncB type="linear" slope={k} intercept={o} />
      </feComponentTransfer>
      <feComponentTransfer>
        <feFuncR type="table" tableValues={table(0)} />
        <feFuncG type="table" tableValues={table(1)} />
        <feFuncB type="table" tableValues={table(2)} />
      </feComponentTransfer>
    </filter>
  );
}

/** Fills whatever it's applied to with film black, keeping its alpha. */
export function FilmFilter({ id, opacity = 0.95 }) {
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      <feFlood floodColor="#050b12" floodOpacity={opacity} />
      <feComposite operator="in" in2="SourceAlpha" />
    </filter>
  );
}

export function BloomFilter({ id, std = 3 }) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={std} />
    </filter>
  );
}

export function SoftFilter({ id, std = 6 }) {
  return (
    <filter id={id} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation={std} />
    </filter>
  );
}

/** Fine static grain, white specks only, for drawing inside a mask. */
export function GrainFilter({ id, freq = 0.9, amount = 1 }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed="7" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values={`0 0 0 0 0.88  0 0 0 0 0.97  0 0 0 0 1  0 0 0 ${2.4 * amount} ${-1.25 * amount}`} />
    </filter>
  );
}

/* ------------------------------------------------------------- radiograph */

// Densities for the X-ray layer: brighter = denser. Strokes are the edge
// highlights; fills are what builds up where parts overlap.
const ICE = '223,247,255';
export const RAD = {
  edge: (a = 0.9) => `rgba(${ICE},${a})`,
  metal: { fill: `rgba(${ICE},0.3)`, stroke: `rgba(${ICE},0.95)` },
  steel: { fill: `rgba(${ICE},0.5)`, stroke: `rgba(${ICE},1)` },
  copper: { fill: `rgba(${ICE},0.2)`, stroke: `rgba(${ICE},0.7)` },
  board: { fill: `rgba(${ICE},0.09)`, stroke: `rgba(${ICE},0.55)` },
  plastic: { fill: `rgba(${ICE},0.07)`, stroke: `rgba(${ICE},0.45)` },
  wood: { fill: `rgba(${ICE},0.05)`, stroke: `rgba(${ICE},0.35)` },
  glass: { fill: `rgba(${ICE},0.03)`, stroke: `rgba(${ICE},0.5)` },
  wire: `rgba(${ICE},0.55)`,
  faint: `rgba(${ICE},0.22)`,
};

/* ----------------------------------------------------------------- labels */

export function Tag({ x, y, children, anchor = 'start', size = 8, opacity = 0.7, fill = '#a9e8ff' }) {
  return (
    <text x={x} y={y} className="lab-tag" fontSize={size} textAnchor={anchor} fill={fill} stroke="none" opacity={opacity}>
      {children}
    </text>
  );
}

/** A callout: dot on the part, an elbow, and the label. */
export function Lead({ from, to, label, anchor = 'start', size = 11 }) {
  const dx = anchor === 'start' ? 5 : -5;
  return (
    <g className="lab-lead">
      <circle cx={from[0]} cy={from[1]} r="2" fill="#dff7ff" stroke="#050b12" strokeWidth="1" />
      <polyline points={`${from[0]},${from[1]} ${to[0]},${to[1]} ${to[0] + dx * 3},${to[1]}`} fill="none" stroke="#dff7ff" strokeWidth="0.75" />
      <text x={to[0] + dx * 4} y={to[1] + size * 0.35} className="lab-tag lab-tag--lead" fontSize={size} textAnchor={anchor} fill="#dff7ff" stroke="none">
        {label}
      </text>
    </g>
  );
}

/** Root SVG for a station layer. */
export function Art({ viewBox, children, label }) {
  return (
    <svg className="lab-art" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true" data-label={label}>
      {children}
    </svg>
  );
}

/** Stable ids for a station's <defs>. */
export function useIds(...names) {
  const base = useId().replace(/:/g, '');
  return Object.fromEntries(names.map((n) => [n, `${base}-${n}`]));
}

/* --------------------------------------------------------------- geometry */

export const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const pts = (list) => list.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
export const path = (list, close = true) => `M ${list.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}${close ? ' Z' : ''}`;

/** Applies a row-major 3×3 homography (see scripts/homography.mjs). */
export function applyH(H, [x, y]) {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
}

/** Bilinear point in a quad given as [p00, p10, p11, p01]. */
export function quadAt(q, u, v) {
  return lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
}

/** Sub-quad of a quad, in its own (u, v) space. */
export function subQuad(q, u0, v0, u1, v1) {
  return [quadAt(q, u0, v0), quadAt(q, u1, v0), quadAt(q, u1, v1), quadAt(q, u0, v1)];
}
