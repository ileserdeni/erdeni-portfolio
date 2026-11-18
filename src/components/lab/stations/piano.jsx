// Piano station: a four-octave action model in front of the bench. Keys use real
// proportions (23.5 mm white pitch, black keys grouped 2 + 3, raised and shorter),
// under a smoked acrylic cover. The X-ray shows a grand-style action laid out the
// way one works: key levers on a balance rail, one hammer per note under its
// strings, single bass strings doubled and the rest in threes, a damper per note
// except the top few, and tuning pins in two staggered rows. Illustrative, not a
// survey of a specific instrument.

import { Art, BloomFilter, FilmFilter, GrainFilter, Lead, RAD, Tag, pts, tone, useIds } from '../kit';
import { ContactShadow, Radiograph, Solids } from '../kit3d';
import { MAT, box, face, stationView } from '../room3d';

export const viewBox = '0 0 760 330';
const ORIGIN = [40, 603];
const view = stationView(ORIGIN);
const v2 = (p) => view(p).slice(0, 2);

const KY = -4.5;
const PITCH = 2.35;
const WHITES = 29;
const X0 = -86;
const X1 = X0 + WHITES * PITCH;
const Z = { front: 68, keyBack: 54, name: 52.5, back: 38 };
const CHEEK = 4;
const NOTES = 49;
const NOTE = (X1 - X0) / NOTES;
const noteX = (i) => X0 + (i + 0.5) * NOTE;

const ivory = MAT.ivory;
const ebony = MAT.ebony;
const caseMat = { base: 0.12, light: 0.32, edge: 0.45, density: 0.16 };
const smoked = { base: 0.16, light: 0.35, edge: 0.6, density: 0.03, alpha: 0.62 };
const felt = { base: 0.62, light: 0.1, edge: 0.2, density: 0.12 };
const woodLever = { base: 0.5, light: 0.2, edge: 0.3, density: 0.1 };

/* keys ------------------------------------------------------------------ */

const whiteKeys = Array.from({ length: WHITES }, (_, i) => {
  const x0 = X0 + i * PITCH + 0.06;
  const x1 = X0 + (i + 1) * PITCH - 0.06;
  return box([x0, KY - 2.2, Z.keyBack], [x1, KY, Z.front], ivory);
});

// black key centres as offsets from the boundary between white keys
const BLACK_IN_OCTAVE = [
  [1, -0.22],
  [2, 0.22],
  [4, -0.3],
  [5, 0],
  [6, 0.3],
];
const BLACK_X = [];
for (let o = 0; o * 7 < WHITES - 1; o += 1) {
  for (const [b, off] of BLACK_IN_OCTAVE) {
    const k = o * 7 + b;
    if (k < WHITES) BLACK_X.push(X0 + k * PITCH + off);
  }
}

function frustum(cx, w0, w1, z0, z1, z1top, y0, y1, mat) {
  const b = [
    [cx - w0 / 2, y0, z1],
    [cx + w0 / 2, y0, z1],
    [cx + w0 / 2, y0, z0],
    [cx - w0 / 2, y0, z0],
  ];
  const t = [
    [cx - w1 / 2, y1, z1top],
    [cx + w1 / 2, y1, z1top],
    [cx + w1 / 2, y1, z0],
    [cx - w1 / 2, y1, z0],
  ];
  return [
    face([t[0], t[1], t[2], t[3]], mat),
    face([b[0], b[1], t[1], t[0]], mat),
    face([b[1], b[2], t[2], t[1]], mat),
    face([b[3], b[0], t[0], t[3]], mat),
  ];
}

const blackKeys = BLACK_X.map((x) => frustum(x, 1.37, 1.02, Z.keyBack, Z.keyBack + 9.5, Z.keyBack + 8.9, KY, KY + 1.25, ebony));

/* case -------------------------------------------------------------------- */

const keybed = box([X0 - CHEEK, KY - 5, Z.back], [X1 + CHEEK, KY - 2.2, Z.front + 1], caseMat);
const keySlip = box([X0, KY - 3.6, Z.front], [X1, KY - 1.2, Z.front + 1], caseMat);
const cheeks = [
  ...box([X0 - CHEEK, KY - 5, Z.back], [X0, KY + 3.4, Z.front + 1], caseMat),
  ...box([X1, KY - 5, Z.back], [X1 + CHEEK, KY + 3.4, Z.front + 1], caseMat),
];
const nameboard = box([X0, KY, Z.name], [X1, KY + 4.6, Z.keyBack], caseMat);
const feltStrip = box([X0, KY, Z.keyBack - 0.05], [X1, KY + 0.5, Z.keyBack + 0.15], { ...felt, base: 0.3 });
const walls = [
  ...box([X0 - CHEEK, KY - 2.2, Z.back], [X0 - CHEEK + 1.2, KY + 8.2, Z.name], caseMat),
  ...box([X1 + CHEEK - 1.2, KY - 2.2, Z.back], [X1 + CHEEK, KY + 8.2, Z.name], caseMat),
  ...box([X0 - CHEEK, KY - 2.2, Z.back], [X1 + CHEEK, KY + 8.2, Z.back + 1.2], caseMat),
];
const COVER = [
  [X0 - CHEEK, KY + 8.4, Z.name],
  [X1 + CHEEK, KY + 8.4, Z.name],
  [X1 + CHEEK, KY + 8.4, Z.back],
  [X0 - CHEEK, KY + 8.4, Z.back],
];
const cover = [face(COVER, smoked), face([[X0 - CHEEK, KY + 4.6, Z.name], [X1 + CHEEK, KY + 4.6, Z.name], COVER[1], COVER[0]], smoked)];

/* action --------------------------------------------------------------------- */

const A = {
  balance: 58,
  wippen: [46.2, 49],
  flange: 50.2,
  head: [42.6, 44.4],
  restRail: 46,
  string: KY + 6.4,
  pinBlock: [50.8, 53.2],
  agraffe: 50.4,
  damper: [40, 41.6],
  bridge: 39.4,
};
const UNDAMPED = 6;
const strings = Array.from({ length: NOTES }, (_, i) => {
  const n = i < 12 ? 2 : 3;
  const x = noteX(i);
  return Array.from({ length: n }, (_, k) => ({ x: x + (k - (n - 1) / 2) * 0.34, wound: i < 12 }));
}).flat();

const keyLevers = Array.from({ length: WHITES }, (_, i) => box([X0 + i * PITCH + 0.5, KY - 2.2, Z.back + 3], [X0 + (i + 1) * PITCH - 0.5, KY - 0.8, Z.keyBack], woodLever)).flat();
const rails = [
  ...box([X0, KY - 3.2, A.balance - 0.7], [X1, KY - 2.2, A.balance + 0.7], MAT.wood),
  ...box([X0, KY + 2.4, A.flange - 0.6], [X1, KY + 3.6, A.flange + 0.8], MAT.wood),
  ...box([X0, KY + 2.2, A.restRail - 0.3], [X1, KY + 2.8, A.restRail + 0.3], felt),
  ...box([X0, KY + 5, A.pinBlock[0]], [X1, KY + 6, A.pinBlock[1]], { ...MAT.wood, density: 0.22 }),
  ...box([X0, KY + 5.6, A.bridge - 0.4], [X1, KY + 6.4, A.bridge + 0.4], MAT.wood),
];
const hammers = Array.from({ length: NOTES }, (_, i) => {
  const x = noteX(i);
  const w = 0.55;
  return [
    ...box([x - w, KY + 3.5, A.head[0]], [x + w, KY + 5.7, A.head[1]], felt),
    ...box([x - 0.35, KY + 0.6, A.wippen[0]], [x + 0.35, KY + 2.1, A.wippen[1]], MAT.wood),
  ];
}).flat();
const dampers = Array.from({ length: NOTES - UNDAMPED }, (_, i) => {
  const x = noteX(i);
  return box([x - 0.55, A.string + 0.15, A.damper[0]], [x + 0.55, A.string + 1.7, A.damper[1]], felt);
}).flat();

const OUTSIDE = [...keybed, ...walls, ...cheeks, ...nameboard, ...keySlip];
const ACTION = [...keyLevers, ...rails, ...hammers, ...dampers];
const KEYS = [...whiteKeys.flat(), ...blackKeys.flat()];

const FOOT = [
  [X0 - CHEEK - 1, KY - 5, Z.back],
  [X1 + CHEEK + 2, KY - 5, Z.back],
  [X1 + CHEEK + 3, KY - 5, Z.front + 3],
  [X0 - CHEEK, KY - 5, Z.front + 3],
];

/* strings, shanks, pins as lines ---------------------------------------- */

function Strings({ inside }) {
  return strings.map((s, i) => {
    const a = v2([s.x, A.string, A.agraffe]);
    const b = v2([s.x, A.string, Z.back + 1.2]);
    return (
      <line
        key={i}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={inside ? RAD.edge(s.wound ? 0.75 : 0.7) : tone(0.42)}
        strokeOpacity={inside ? 1 : 0.5}
        strokeWidth={s.wound ? 0.7 : 0.45}
      />
    );
  });
}

function Shanks({ inside }) {
  return Array.from({ length: NOTES }, (_, i) => {
    const x = noteX(i);
    const a = v2([x, KY + 3.1, A.flange]);
    const b = v2([x, KY + 4.4, A.head[1]]);
    return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={inside ? RAD.edge(0.6) : tone(0.3)} strokeWidth="0.6" />;
  });
}

function DamperWires() {
  return Array.from({ length: NOTES - UNDAMPED }, (_, i) => {
    const x = noteX(i);
    const a = v2([x, A.string + 0.2, (A.damper[0] + A.damper[1]) / 2]);
    const b = v2([x, KY + 0.4, (A.damper[0] + A.damper[1]) / 2]);
    return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={RAD.edge(0.75)} strokeWidth="0.5" />;
  });
}

function TuningPins() {
  return strings.map((s, i) => {
    const z = A.pinBlock[0] + (i % 2 ? 0.7 : 1.7);
    const p = v2([s.x, KY + 6.8, z]);
    return <circle key={i} cx={p[0]} cy={p[1]} r="0.75" fill={RAD.edge(1)} />;
  });
}

function BalancePins() {
  return Array.from({ length: WHITES }, (_, i) => {
    const p = v2([X0 + (i + 0.5) * PITCH, KY - 2.2, A.balance]);
    return <circle key={i} cx={p[0]} cy={p[1]} r="0.7" fill={RAD.edge(0.9)} />;
  });
}

/* ------------------------------------------------------------- exterior */

export function Exterior() {
  const id = useIds('shadow', 'sheen');
  const c = COVER.map(v2);
  return (
    <Art viewBox={viewBox} label="piano">
      <defs>
        <linearGradient id={id.sheen} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#dff7ff" stopOpacity="0.16" />
          <stop offset="0.35" stopColor="#dff7ff" stopOpacity="0.03" />
          <stop offset="0.6" stopColor="#dff7ff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#dff7ff" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <ContactShadow id={id.shadow} quads={[FOOT]} view={v2} std={6} opacity={0.8} />
      <Solids faces={[...keybed, ...walls]} view={view} />
      {/* the action, dimly, through the smoked cover */}
      <g opacity="0.55">
        <Solids faces={[...rails, ...hammers, ...dampers]} view={view} />
        <Strings />
        <Shanks />
      </g>
      <Solids faces={cover} view={view} />
      <polygon points={pts(c)} fill={`url(#${id.sheen})`} />
      <line x1={c[0][0]} y1={c[0][1]} x2={c[1][0]} y2={c[1][1]} stroke={tone(0.75)} strokeOpacity="0.5" strokeWidth="0.7" />
      <Solids faces={[...nameboard, ...feltStrip]} view={view} />
      <Solids faces={[...keySlip, ...whiteKeys.flat()]} view={view} />
      <Solids faces={blackKeys.flat()} view={view} />
      <Solids faces={cheeks} view={view} />
      <Tag x="752" y="40" anchor="end" size={9}>
        Illustration
      </Tag>
    </Art>
  );
}

/* ------------------------------------------------------------- interior */

export function Interior() {
  const id = useIds('film', 'bloom', 'grain', 'mask');
  const all = [...OUTSIDE, ...KEYS, ...cover];
  return (
    <Art viewBox={viewBox} label="piano-inside">
      <defs>
        <FilmFilter id={id.film} opacity={0.9} />
        <BloomFilter id={id.bloom} std={2.5} />
        <GrainFilter id={id.grain} />
        <mask id={id.mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
          <Solids faces={all} view={view} />
        </mask>
      </defs>
      <g filter={`url(#${id.film})`}>
        <Solids faces={all} view={view} />
      </g>
      <Radiograph faces={OUTSIDE} view={view} gain={0.55} />
      <Radiograph faces={KEYS} view={view} gain={0.5} />
      <Radiograph faces={ACTION} view={view} gain={0.9} />
      <BalancePins />
      <DamperWires />
      <Shanks inside />
      <g filter={`url(#${id.bloom})`} opacity="0.3">
        <Strings inside />
      </g>
      <Strings inside />
      <TuningPins />
      <rect width="760" height="330" filter={`url(#${id.grain})`} mask={`url(#${id.mask})`} opacity="0.2" />

      <Lead from={v2([noteX(30), KY + 5.7, A.head[0] + 0.8])} to={[600, 20]} label="Hammers" />
      <Lead from={v2([noteX(40), A.string, 50])} to={[600, 44]} label="Strings" />
      <Lead from={v2([noteX(20), A.string + 1.7, A.damper[0] + 0.8])} to={[420, 14]} label="Dampers" anchor="end" />
      <Lead from={v2([noteX(8), KY + 6.8, A.pinBlock[0] + 1.2])} to={[150, 26]} label="Tuning pins" anchor="end" />
      <Lead from={v2([X0 + 3.5 * PITCH, KY - 2.2, A.balance])} to={[14, 62]} label="Key levers" />
      <Tag x="752" y="252" anchor="end" size={9} opacity={0.65}>
        Action illustrative
      </Tag>
    </Art>
  );
}
