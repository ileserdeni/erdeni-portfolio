import { project } from './room3d';

// The bench and wall line, drawn through the shared room camera so the stations
// that sit on it share its perspective.
const WALL_Z = -58;
const FRONT_Z = 40;
const HALF = 175;
const THICK = 5;

const pt = (x, y, z) => {
  const [sx, sy] = project([x, y, z]);
  return `${sx.toFixed(1)},${sy.toFixed(1)}`;
};
const poly = (...p) => p.map((q) => pt(...q)).join(' ');
const line = (a, b) => {
  const [x1, y1] = project(a);
  const [x2, y2] = project(b);
  return { x1, y1, x2, y2 };
};

const TOP = poly([-HALF, 0, WALL_Z], [HALF, 0, WALL_Z], [HALF, 0, FRONT_Z], [-HALF, 0, FRONT_Z]);
const EDGE = poly([-HALF, 0, FRONT_Z], [HALF, 0, FRONT_Z], [HALF, -THICK, FRONT_Z], [-HALF, -THICK, FRONT_Z]);
const APRON = poly([-HALF, -THICK, FRONT_Z - 4], [HALF, -THICK, FRONT_Z - 4], [HALF, -60, FRONT_Z - 4], [-HALF, -60, FRONT_Z - 4]);
const SPLASH = poly([-HALF, 0, WALL_Z], [HALF, 0, WALL_Z], [HALF, 4, WALL_Z], [-HALF, 4, WALL_Z]);
const SEAMS = [-28, 4].map((z) => line([-HALF, 0, z], [HALF, 0, z]));
const LEGS = [-150, 150].map((x) => poly([x - 3, -THICK, FRONT_Z - 6], [x + 3, -THICK, FRONT_Z - 6], [x + 3, -120, FRONT_Z - 6], [x - 3, -120, FRONT_Z - 6]));
const FRONT = line([-HALF, 0, FRONT_Z], [HALF, 0, FRONT_Z]);
const BACK = line([-HALF, 0, WALL_Z], [HALF, 0, WALL_Z]);
const [poolX, poolY] = project([-5, 0, -40]);

export default function Scenery() {
  return (
    <>
      <div className="room__layer" style={{ '--d': 0.3 }} aria-hidden="true" data-backdrop="">
        <div className="room__wall" />
        <div className="room__marks" />
      </div>
      <div className="room__layer" style={{ '--d': 0.6 }} aria-hidden="true" data-backdrop="">
        <svg className="room__bench" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bench-top" x1="0" y1="0.48" x2="0" y2="0.78" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#0d1a27" />
              <stop offset="1" stopColor="#16283a" />
            </linearGradient>
            <radialGradient id="bench-pool" gradientUnits="userSpaceOnUse" cx={poolX} cy={poolY} r="620" gradientTransform={`translate(${poolX} ${poolY}) scale(1 0.32) translate(${-poolX} ${-poolY})`}>
              <stop offset="0" stopColor="#bfeeff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#bfeeff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bench-apron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#081019" />
              <stop offset="1" stopColor="#04080c" />
            </linearGradient>
            <filter id="bench-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="2" seed="4" />
              <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.9  0 0 0 0 1  0 0 0 0.05 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          {LEGS.map((p, i) => (
            <polygon key={i} points={p} fill="#060b10" />
          ))}
          <polygon points={APRON} fill="url(#bench-apron)" />
          <polygon points={SPLASH} fill="#0a141e" />
          <polygon points={TOP} fill="url(#bench-top)" />
          <polygon points={TOP} fill="url(#bench-pool)" />
          <polygon points={TOP} fill="#fff" filter="url(#bench-grain)" />
          {SEAMS.map((l, i) => (
            <line key={i} {...l} stroke="#000" strokeOpacity="0.35" />
          ))}
          <line {...BACK} stroke="#a9e8ff" strokeOpacity="0.14" />
          <polygon points={EDGE} fill="#101c28" />
          <line {...FRONT} stroke="#dff7ff" strokeOpacity="0.42" />
        </svg>
      </div>
    </>
  );
}
