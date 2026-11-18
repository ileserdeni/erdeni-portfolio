import { C, Callout, Coil, Interior, Stamp, poly, quadGrid } from './common';

// Coordinates are pixels of the 1024×768 rendition of projects/rhythm-game-main.
const deck = [[245, 265], [590, 170], [845, 255], [495, 440]];
const base = [[262, 545], [592, 452], [830, 522], [497, 708]];
const leftMatrix = [[300, 262], [440, 232], [493, 275], [355, 312]];
const rightMatrix = [[515, 205], [605, 178], [668, 208], [578, 235]];
const leftPad = [[368, 325], [525, 272], [655, 345], [500, 420]];
const rightPad = [[592, 240], [735, 205], [825, 252], [685, 300]];
const lcd = [[403, 135], [488, 123], [490, 165], [405, 177]];

const buttons = [
  [490, 318],
  [570, 322],
  [488, 368],
  [690, 236],
  [755, 244],
  [708, 266],
];

function planePoint([p0, p1, p2, p3], u, v) {
  const top = [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u];
  const bot = [p3[0] + (p2[0] - p3[0]) * u, p3[1] + (p2[1] - p3[1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
}

function PlaneRect({ quad, u0, v0, u1, v1, ...rest }) {
  const pts = [
    planePoint(quad, u0, v0),
    planePoint(quad, u1, v0),
    planePoint(quad, u1, v1),
    planePoint(quad, u0, v1),
  ];
  return <polygon points={poly(pts)} {...rest} />;
}

export default function RhythmGameInterior() {
  const mosfets = Array.from({ length: 6 }, (_, i) => {
    const u = 0.5 + i * 0.075;
    return { u, at: planePoint(base, u + 0.03, 0.86) };
  });

  return (
    <Interior ghost="projects/rhythm-game-main" viewBox="0 0 1024 768">
      {/* housing edges */}
      <g stroke={C.bone} strokeWidth="1.1" opacity="0.8">
        <polyline points="170,100 585,52 590,170" />
        <polyline points="170,100 205,250 245,265 590,170" />
        <polygon points={poly(deck)} />
        <polyline points="245,265 262,545 497,708 830,522 845,255" />
        <line x1="495" y1="440" x2="497" y2="708" />
      </g>

      {/* inner support frame */}
      <g stroke={C.dim} strokeDasharray="6 5">
        <polygon points={poly(deck.map(([x, y]) => [x + (x < 500 ? 22 : -22), y + 26]))} />
        <line x1="420" y1="360" x2="430" y2="610" />
        <line x1="700" y1="295" x2="705" y2="560" />
        <line x1="560" y1="235" x2="565" y2="500" />
      </g>

      {/* baseplate with drivers */}
      <polygon points={poly(base)} stroke={C.ice} strokeWidth="1.2" fill="rgba(169,232,255,0.05)" />
      <PlaneRect quad={base} u0={0.12} v0={0.2} u1={0.38} v1={0.5} stroke={C.bright} />
      <PlaneRect quad={base} u0={0.44} v0={0.18} u1={0.62} v1={0.4} stroke={C.ice} />
      <PlaneRect quad={base} u0={0.68} v0={0.18} u1={0.86} v1={0.4} stroke={C.ice} />
      <PlaneRect quad={base} u0={0.14} v0={0.6} u1={0.36} v1={0.84} stroke={C.ice} />
      {mosfets.map(({ u }, i) => (
        <PlaneRect key={i} quad={base} u0={u} v0={0.72} u1={u + 0.055} v1={0.92} stroke={C.bright} />
      ))}

      {/* LED matrices */}
      {[leftMatrix, rightMatrix].map((quad, qi) => (
        <g key={qi}>
          <polygon points={poly(quad)} stroke={C.ice} />
          {quadGrid(quad, 8, 8).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.7" fill={C.bright} stroke="none" opacity="0.85" />
          ))}
        </g>
      ))}

      {/* button pads */}
      <polygon points={poly(leftPad)} stroke={C.dim} />
      <polygon points={poly(rightPad)} stroke={C.dim} />

      {/* solenoids, plungers, limit switches, and drive wires */}
      {buttons.map(([x, y], i) => {
        const top = y + 18;
        const bottom = y + (i < 3 ? 150 : 135);
        const [mx, my] = mosfets[i].at;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y - 6} rx="13" ry="6" stroke={C.bright} />
            <line x1={x} y1={y - 6} x2={x} y2={top + 6} stroke={C.bright} strokeWidth="2" />
            <Coil x={x} y1={top} y2={bottom} w={22} turns={9} />
            <path d={`M${x + 16},${y + 52} l18,-6 l0,14 l-18,6 z`} stroke={C.ice} />
            <line x1={x + 34} y1={y + 46} x2={x + 46} y2={y + 32} stroke={C.ice} />
            <circle cx={x + 47} cy={y + 30} r="3" stroke={C.ice} />
            <path
              d={`M${x},${bottom} C${x},${bottom + 50} ${mx},${my - 70} ${mx},${my}`}
              stroke={C.ice}
              strokeWidth="1"
              opacity="0.7"
              className={i === 0 ? 'xr-glow' : undefined}
            />
          </g>
        );
      })}

      {/* LCD + controls */}
      <polygon points={poly(lcd)} stroke={C.bright} className="xr-glow" />
      <circle cx="300" cy="187" r="13" stroke={C.ice} />
      <rect x="347" y="157" width="18" height="26" stroke={C.ice} />
      <rect x="533" y="112" width="24" height="30" stroke={C.ice} />
      <path d="M447,177 C450,260 330,380 330,560" stroke={C.ice} strokeWidth="1" opacity="0.6" />

      <Callout x={490} y={392} dx={-150} dy={185} label="Solenoid ×6" sub="raises each note" />
      <Callout x={539} y={366} dx={-10} dy={-150} anchor="end" label="Limit switch" sub="hit detection" />
      <Callout x={605} y={205} dx={60} dy={-120} label="LED matrix" sub="note preview" />
      <Callout x={446} y={150} dx={-150} dy={-90} label="16×2 LCD" />
      <Callout x={720} y={640} dx={80} dy={50} label="MOSFET drivers" sub="+ flyback diodes" />
      <Callout x={330} y={595} dx={-100} dy={70} label="Controller · audio · SD" />
      <Stamp x={1004} y={748} anchor="end">Illustrative cutaway · positions approximate</Stamp>
    </Interior>
  );
}
