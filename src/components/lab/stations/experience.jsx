// Experience station: an archive terminal standing on a steel card cabinet. The
// screen lists the real roles from content/experience.js, and the X-ray opens the
// drawers onto index cards filed under the same kinds (Research, Teaching,
// Industry). The object itself is an illustration, drawn with the room camera.

import { Art, BloomFilter, FilmFilter, GrainFilter, Lead, RAD, Tag, pts, tone, useIds } from '../kit';
import { ContactShadow, Radiograph, Solids } from '../kit3d';
import { MAT, box, cylinder, face, panelMatrix, place, placePoint, stationView } from '../room3d';

export const viewBox = '0 0 260 400';
const ORIGIN = [1232, 243];
const view = stationView(ORIGIN);
const v2 = (p) => view(p).slice(0, 2);

const POSE = { at: [99, 0, -20], yaw: -0.3 };
const W = (p) => placePoint(p, POSE);

/* local frame: x across the front, y up, z out of the front; origin at the base centre */
const CAB = { w: 30, d: 24, h: 21, plinth: 1.4 };
const DRAWERS = 3;
const MON = { w: 27, h: 20.5, d: 4, y0: CAB.h + 2.2, back: { w: 21, h: 15, d: 12 } };
const SCREEN = { w: 21, inset: 1.8, x0: -10.5 };

const steel = { base: 0.27, light: 0.36, edge: 0.45, density: 0.34 };
const bezel = { base: 0.2, light: 0.3, edge: 0.5, density: 0.3 };
const card = { base: 0.78, light: 0.15, edge: 0.3, density: 0.08 };

function drawerY(i) {
  const span = (CAB.h - CAB.plinth - 1.4) / DRAWERS;
  const y0 = CAB.plinth + 0.7 + i * span;
  return [y0 + 0.35, y0 + span - 0.35];
}

const cabinet = [
  ...box([-CAB.w / 2 + 0.8, 0, -CAB.d / 2 + 0.8], [CAB.w / 2 - 0.8, CAB.plinth, CAB.d / 2 - 1.4], MAT.anodized),
  ...box([-CAB.w / 2, CAB.plinth, -CAB.d / 2], [CAB.w / 2, CAB.h, CAB.d / 2], steel),
  ...box([-CAB.w / 2 - 0.3, CAB.h, -CAB.d / 2 - 0.3], [CAB.w / 2 + 0.3, CAB.h + 0.8, CAB.d / 2 + 0.3], steel),
];

const drawerParts = Array.from({ length: DRAWERS }, (_, k) => {
  const i = DRAWERS - 1 - k;
  const [y0, y1] = drawerY(i);
  const z = CAB.d / 2;
  const mid = (y0 + y1) / 2;
  return {
    front: box([-CAB.w / 2 + 1, y0, z], [CAB.w / 2 - 1, y1, z + 0.6], steel),
    details: [
    ...box([-3.6, mid + 0.4, z + 0.6], [3.6, mid + 2.5, z + 0.75], MAT.brushed),
    face([[-3.1, mid + 0.7, z + 0.78], [3.1, mid + 0.7, z + 0.78], [3.1, mid + 2.2, z + 0.78], [-3.1, mid + 2.2, z + 0.78]], card),
    ...box([-2.6, mid - 1.6, z + 0.6], [2.6, mid - 0.9, z + 1.6], MAT.brushed),
    ...box([-2.6, mid - 1.6, z + 1.2], [2.6, mid - 0.4, z + 1.6], MAT.brushed),
    ],
  };
});

const yb = MON.y0;
const monitor = [
  ...box([-5.5, CAB.h + 0.8, -5], [5.5, yb, 2], MAT.anodized),
  ...box([-MON.back.w / 2, yb + 2.5, -MON.d - MON.back.d + 2], [MON.back.w / 2, yb + 2.5 + MON.back.h, -MON.d + 2], bezel),
  // bezel with a recessed screen: four frame bars and the inner walls of the recess
  ...box([-MON.w / 2, yb, -MON.d + 2], [MON.w / 2, yb + 4, 2], bezel),
  ...box([-MON.w / 2, yb + MON.h - 2.8, -MON.d + 2], [MON.w / 2, yb + MON.h, 2], bezel),
  ...box([-MON.w / 2, yb + 4, -MON.d + 2], [SCREEN.x0, yb + MON.h - 2.8, 2], bezel),
  ...box([SCREEN.x0 + SCREEN.w, yb + 4, -MON.d + 2], [MON.w / 2, yb + MON.h - 2.8, 2], bezel),
];

const S = {
  tl: [SCREEN.x0, yb + MON.h - 2.8, 2 - SCREEN.inset],
  tr: [SCREEN.x0 + SCREEN.w, yb + MON.h - 2.8, 2 - SCREEN.inset],
  br: [SCREEN.x0 + SCREEN.w, yb + 4, 2 - SCREEN.inset],
  bl: [SCREEN.x0, yb + 4, 2 - SCREEN.inset],
};
const recess = [
  face([S.tl, S.tr, [S.tr[0], S.tr[1], 2], [S.tl[0], S.tl[1], 2]], MAT.anodized),
  face([[S.bl[0], S.bl[1], 2], [S.br[0], S.br[1], 2], S.br, S.bl], { ...MAT.anodized, base: 0.2 }),
  face([S.tl, [S.tl[0], S.tl[1], 2], [S.bl[0], S.bl[1], 2], S.bl], { ...MAT.anodized, base: 0.18 }),
  face([[S.tr[0], S.tr[1], 2], S.tr, S.br, [S.br[0], S.br[1], 2]], MAT.anodized),
];
const screen = face([S.bl, S.br, S.tr, S.tl], MAT.screen);

const controls = [
  ...[7.2, 9.6].flatMap((x) => cylinder([x, yb + 2, 2], [x, yb + 2, 2.9], 0.75, MAT.brushed, { segs: 14 })),
  ...box([-11.2, yb + 1.4, 2], [-9, yb + 2.6, 2.5], MAT.rubber),
];
const vents = Array.from({ length: 6 }, (_, i) => {
  const z = -MON.d - 1.5 - i * 1.7;
  return face([[-MON.back.w / 2 - 0.02, yb + 6, z], [-MON.back.w / 2 - 0.02, yb + 6, z - 0.9], [-MON.back.w / 2 - 0.02, yb + 14, z - 0.9], [-MON.back.w / 2 - 0.02, yb + 14, z]], MAT.rubber);
}).map((f) => ({ ...f, n: [-1, 0, 0] }));

// drawn in this order; within a group faces are depth-sorted
const GROUPS = [
  [...cabinet, ...monitor.slice(0, 12)],
  drawerParts.flatMap((d) => d.front),
  [...drawerParts.flatMap((d) => d.details), ...vents],
  [...monitor.slice(12), ...recess, screen],
  controls,
].map((g) => place(g, POSE));
const FACES = GROUPS.flat();

function Body() {
  return GROUPS.map((g, i) => <Solids key={i} faces={g} view={view} />);
}

const FOOT = [
  [-CAB.w / 2 - 1, 0, -CAB.d / 2],
  [CAB.w / 2 + 2, 0, -CAB.d / 2],
  [CAB.w / 2 + 3, 0, CAB.d / 2 + 2],
  [-CAB.w / 2, 0, CAB.d / 2 + 2],
].map(W);

/* screen text frame: 270 × 185 local units across the glass */
const SCREEN_W = 270;
const SCREEN_H = 185;
const screenMatrix = () => panelMatrix(v2(W(S.tl)), v2(W(S.tr)), v2(W(S.bl)), SCREEN_W, SCREEN_H);

function ScreenText({ records, bright }) {
  return (
    <g transform={screenMatrix()}>
      <text x="16" y="28" className="lab-tag" fontSize="11" fill={tone(0.7)} opacity="0.75">
        ARCHIVE · {records.length} RECORDS
      </text>
      <line x1="16" y1="38" x2="254" y2="38" stroke={tone(0.6)} strokeOpacity="0.35" />
      {records.map((r, i) => (
        <text key={r} x="16" y={66 + i * 26} className="lab-tag" fontSize="13" fill={bright ? '#e8fbff' : tone(0.86)} opacity={i === 0 ? 1 : 0.78}>
          {r}
        </text>
      ))}
      <rect x="16" y={60 + records.length * 26} width="9" height="13" fill={tone(0.8)} opacity="0.7" />
    </g>
  );
}

function DrawerTags({ kinds }) {
  return Array.from({ length: DRAWERS }, (_, k) => {
    const i = DRAWERS - 1 - k;
    const [y0, y1] = drawerY(i);
    const mid = (y0 + y1) / 2;
    const z = CAB.d / 2 + 0.8;
    const m = panelMatrix(v2(W([-3.1, mid + 2.2, z])), v2(W([3.1, mid + 2.2, z])), v2(W([-3.1, mid + 0.7, z])), 72, 18);
    return (
      <g key={k} transform={m}>
        <text x="36" y="13" textAnchor="middle" className="lab-tag" fontSize="11" fill={tone(0.12)}>
          {(kinds[k] ?? '').toUpperCase()}
        </text>
      </g>
    );
  });
}

function ScreenGlow({ id }) {
  const q = [S.tl, S.tr, S.br, S.bl].map((p) => v2(W(p)));
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="0.45" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#9fd9ee" stopOpacity="0.32" />
          <stop offset="1" stopColor="#9fd9ee" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <polygon points={pts(q)} fill={`url(#${id})`} />
      {/* glass reflection along the top of the screen */}
      <polygon points={pts([q[0], q[1], lerp2(q[1], q[2], 0.22), lerp2(q[0], q[3], 0.32)])} fill="#dff7ff" opacity="0.05" />
    </g>
  );
}
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function Exterior({ records = [], kinds = [] }) {
  const id = useIds('shadow', 'glow', 'bloom');
  const led = v2(W([-7.8, yb + 2, 2.05]));
  return (
    <Art viewBox={viewBox} label="experience">
      <defs>
        <BloomFilter id={id.bloom} std={3} />
      </defs>
      <ContactShadow id={id.shadow} quads={[FOOT]} view={v2} std={5} opacity={0.8} />
      <Body />
      <ScreenGlow id={id.glow} />
      <g filter={`url(#${id.bloom})`} opacity="0.45">
        <ScreenText records={records} bright />
      </g>
      <ScreenText records={records} />
      <DrawerTags kinds={kinds} />
      <circle cx={led[0]} cy={led[1]} r="1.3" fill="#dff7ff" />
      <Tag x="252" y="326" anchor="end" size={9}>
        Illustration
      </Tag>
    </Art>
  );
}

/* inside the drawers: index cards on a rod, a tab per kind */
function cardsFor(k) {
  const i = DRAWERS - 1 - k;
  const [y0, y1] = drawerY(i);
  const list = [];
  for (let c = 0; c < 9; c += 1) {
    const z = CAB.d / 2 - 2.5 - c * 2.1;
    list.push(face([[-CAB.w / 2 + 3, y0 + 0.6, z], [CAB.w / 2 - 3, y0 + 0.6, z], [CAB.w / 2 - 3, y1 - 1.6, z], [-CAB.w / 2 + 3, y1 - 1.6, z]], card));
  }
  return list;
}

export function Interior({ records = [], kinds = [] }) {
  const id = useIds('film', 'bloom', 'grain', 'mask');
  const cards = place(Array.from({ length: DRAWERS }, (_, k) => cardsFor(k)).flat(), POSE);
  const tabs = kinds.slice(0, DRAWERS).map((kind, k) => {
    const i = DRAWERS - 1 - k;
    const [, y1] = drawerY(i);
    const x0 = -CAB.w / 2 + 3 + k * 8;
    const z = CAB.d / 2 - 2.5 - (2 + k) * 2.1;
    const m = panelMatrix(v2(W([x0, y1 - 0.4, z])), v2(W([x0 + 7.6, y1 - 0.4, z])), v2(W([x0, y1 - 2, z])), 100, 18);
    return (
      <g key={kind} transform={m}>
        <rect width="100" height="18" fill={RAD.edge(0.14)} stroke={RAD.edge(0.9)} strokeWidth="1.4" />
        <text x="50" y="13.5" textAnchor="middle" className="lab-tag" fontSize="12" fill="#e8fbff">
          {kind.toUpperCase()}
        </text>
      </g>
    );
  });
  return (
    <Art viewBox={viewBox} label="experience-inside">
      <defs>
        <FilmFilter id={id.film} opacity={0.7} />
        <BloomFilter id={id.bloom} std={3} />
        <GrainFilter id={id.grain} />
        <mask id={id.mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
          <Solids faces={FACES} view={view} />
        </mask>
      </defs>
      <g filter={`url(#${id.film})`}>
        <Body />
      </g>
      <Radiograph faces={FACES} view={view} gain={0.8} />
      <Radiograph faces={cards} view={view} gain={1} />
      {tabs}
      <g filter={`url(#${id.bloom})`} opacity="0.5">
        <ScreenText records={records} bright />
      </g>
      <ScreenText records={records} bright />
      <rect width="260" height="400" filter={`url(#${id.grain})`} mask={`url(#${id.mask})`} opacity="0.2" />
      <Lead from={v2(W([0, CAB.h - 6, 4]))} to={[20, 352]} label="Index cards by kind" />
    </Art>
  );
}
