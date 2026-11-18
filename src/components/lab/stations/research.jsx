// Research station: the thin-film rig on an optical breadboard. The tank, the black
// base plate, the white film holder strapped to a black block with rubber bands,
// and the fiber running into the holder follow the project photos. The source box,
// the posts and the lens mounts are generic bench hardware and stay unlabelled. The
// X-ray is the same model as a radiograph, with the working principle (fiber light
// guided in the film, IR heating from above) drawn as an illustration.

import { Art, BloomFilter, FilmFilter, GrainFilter, Lead, RAD, Tag, pts, tone, useIds } from '../kit';
import { ContactShadow, Radiograph, Solids } from '../kit3d';
import { MAT, add, box, cylinder, face, mix, stationView } from '../room3d';

export const viewBox = '0 0 720 351';
const ORIGIN = [104, 297];
const project = stationView(ORIGIN);
// the rig is modelled at bench scale, then enlarged about the tank so it reads at room distance
const K = 1.32;
const PIVOT = [-56, 0, -27];
const view = ([x, y, z]) => project([PIVOT[0] + (x - PIVOT[0]) * K, y * K, PIVOT[2] + (z - PIVOT[2]) * K + 9]);
const v2 = (p) => view(p).slice(0, 2);

/* ---------------------------------------------------------------- model */

const BOARD = { x0: -104, x1: -6, z0: -44, z1: -10, h: 1.3 };
const TANK = { x0: -66, x1: -32, z0: -37, z1: -16, y0: 2.3, y1: 16 };
const WATER_Y = 13.2;
const HOLDER = { x0: -56, x1: -41, z0: -29, z1: -23.5, y0: 5.2, y1: 8.2 };
const FILM = { x0: -54.5, x1: -42.5, z0: -27.6, z1: -24.9 };
const IR = { x: -48.5, z: -26.2, top: 21.5, bottom: 18 };
const POST_IR = { x: -48.5, z: -41.5 };
const MOUNTS = [-25, -15];
const BEAM_Y = 9.5;
const BEAM_Z = -26;

const rubber = { base: 0.55, light: 0.25, edge: 0.3, density: 0.1 };
const filmMat = { base: 0.1, light: 0.1, edge: 0.5, density: 0.2 };

function post(x, z, top, base = BOARD.h) {
  return [
    ...cylinder([x, base, z], [x, base + 1, z], 1.6, MAT.anodized, { segs: 14 }),
    ...cylinder([x, base + 1, z], [x, base + 5.5, z], 1.15, MAT.anodized, { segs: 14 }),
    ...cylinder([x, base + 5.5, z], [x, top, z], 0.62, MAT.brushed, { segs: 12 }),
  ];
}

// mounts face the tank on a diagonal, so their apertures read as ellipses
const AIM = [-0.55, 0, 0.83];
function lensMount(x) {
  const c = [x, BEAM_Y, BEAM_Z];
  const a = (k) => add(c, [AIM[0] * k, 0, AIM[2] * k]);
  return [
    ...post(x, BEAM_Z, BEAM_Y - 2.4),
    ...cylinder(a(-0.6), a(0.6), 2.5, MAT.anodized, { segs: 22 }),
    ...cylinder(a(-0.62), a(0.62), 1.6, { ...MAT.glass, alpha: 0.28 }, { segs: 22 }),
    ...box(add(c, [-0.5, 2.3, -0.5]), add(c, [0.5, 3.4, 0.5]), MAT.brushed),
  ];
}

function tankGlass() {
  const { x0, x1, z0, z1, y0, y1 } = TANK;
  const g = { ...MAT.glass };
  const p = (x, y, z) => [x, y, z];
  return [
    face([p(x1, y0, z0), p(x0, y0, z0), p(x0, y1, z0), p(x1, y1, z0)], g, { twoSided: true }),
    face([p(x0, y0, z0), p(x0, y0, z1), p(x0, y1, z1), p(x0, y1, z0)], g, { twoSided: true }),
    face([p(x1, y0, z1), p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1)], g, { twoSided: true }),
    face([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], g, { twoSided: true }),
  ];
}

const inset = 0.4;
const water = box([TANK.x0 + inset, TANK.y0 + 0.1, TANK.z0 + inset], [TANK.x1 - inset, WATER_Y, TANK.z1 - inset], MAT.water);

const fixture = [
  ...box([-58, TANK.y0 + 0.1, -31], [-39, TANK.y0 + 1.1, -21.5], MAT.anodized),
  ...box([-55, TANK.y0 + 1.1, -28.6], [-42, HOLDER.y0, -23.9], MAT.rubber),
  ...box([HOLDER.x0, HOLDER.y0, HOLDER.z0], [HOLDER.x1, HOLDER.y1, HOLDER.z1], MAT.printed),
  face(
    [
      [FILM.x0, HOLDER.y1 + 0.02, FILM.z1],
      [FILM.x1, HOLDER.y1 + 0.02, FILM.z1],
      [FILM.x1, HOLDER.y1 + 0.02, FILM.z0],
      [FILM.x0, HOLDER.y1 + 0.02, FILM.z0],
    ],
    filmMat,
  ),
  ...[-53, -44].flatMap((x) => [
    ...box([x, TANK.y0 + 1.1, HOLDER.z1], [x + 0.6, HOLDER.y1 + 0.05, HOLDER.z1 + 0.12], rubber),
    ...box([x, HOLDER.y1, HOLDER.z0 - 0.1], [x + 0.6, HOLDER.y1 + 0.12, HOLDER.z1 + 0.1], rubber),
  ]),
];

const source = [
  ...box([-101, BOARD.h, -36], [-84, BOARD.h + 7, -24], MAT.paint),
  ...box([-100.2, BOARD.h + 7, -35.2], [-84.8, BOARD.h + 7.3, -24.8], MAT.anodized),
  ...cylinder([-84, BOARD.h + 3.6, -30], [-81.5, BOARD.h + 3.6, -30], 0.9, MAT.brushed, { segs: 14 }),
  face([[-100, BOARD.h + 1.2, -23.98], [-86, BOARD.h + 1.2, -23.98], [-86, BOARD.h + 5.6, -23.98], [-100, BOARD.h + 5.6, -23.98]], MAT.anodized),
  ...[0, 1, 2, 3, 4].map((i) => face([[-98.6 + i * 1.2, BOARD.h + 2.2, -23.95], [-98.1 + i * 1.2, BOARD.h + 2.2, -23.95], [-98.1 + i * 1.2, BOARD.h + 4.6, -23.95], [-98.6 + i * 1.2, BOARD.h + 4.6, -23.95]], MAT.rubber)),
  face([[-88.4, BOARD.h + 4.4, -23.94], [-87.6, BOARD.h + 4.4, -23.94], [-87.6, BOARD.h + 5.0, -23.94], [-88.4, BOARD.h + 5.0, -23.94]], MAT.brushed),
];

const irPost = [
  ...post(POST_IR.x, POST_IR.z, IR.top + 1.4),
  ...box([POST_IR.x - 1, IR.top - 0.4, POST_IR.z - 1], [POST_IR.x + 1, IR.top + 1.6, POST_IR.z + 1], MAT.anodized),
  ...cylinder([POST_IR.x, IR.top + 0.6, POST_IR.z + 1], [IR.x, IR.top + 0.6, IR.z - 1.4], 0.55, MAT.brushed, { segs: 12 }),
  ...box([IR.x - 1.5, IR.top - 0.6, IR.z - 1.6], [IR.x + 1.5, IR.top + 1.8, IR.z + 1.6], MAT.anodized),
  ...cylinder([IR.x, IR.top - 0.6, IR.z], [IR.x, IR.bottom, IR.z], 1.25, MAT.anodized, { segs: 18 }),
];

const board = box([BOARD.x0, 0, BOARD.z0], [BOARD.x1, BOARD.h, BOARD.z1], MAT.anodized);

const BACK_FACES = [...board, ...source, ...irPost];
const TANK_FACES = [...tankGlass(), ...water, ...fixture];
const FRONT_FACES = MOUNTS.flatMap(lensMount);
const ALL = [...BACK_FACES, ...TANK_FACES, ...FRONT_FACES];

/* 3D curves */
const bez = (a, b, c, d, n = 28) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [0, 1, 2].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]);
  });
const FIBER = bez([-81.5, BOARD.h + 3.6, -30], [-72, 24, -30], [-64, 22, -26.6], [HOLDER.x0 + 0.3, 6.7, -26.2]);
const IR_CABLE = bez([IR.x, IR.top + 1.8, IR.z], [IR.x - 1, IR.top + 4, IR.z - 5], [IR.x - 4, IR.top + 3, -46], [IR.x - 8, 2, -52]);
const SOURCE_CABLE = bez([-92, BOARD.h + 3, -36], [-92, BOARD.h + 2, -46], [-80, 0.6, -50], [-70, 0.6, -57]);
const MOUNT_CABLE = bez([-8, 0.6, -14], [-4, 0.6, -24], [-2, 0.6, -40], [4, 0.6, -57]);

const line2 = (list) => list.map(v2);

/* holes on a 25 mm pitch, skipping what's bolted down */
const HOLES = [];
for (let x = BOARD.x0 + 2; x < BOARD.x1 - 1; x += 2.5) {
  for (let z = BOARD.z0 + 1.75; z < BOARD.z1 - 1; z += 2.5) {
    const under = (x > TANK.x0 - 1 && x < TANK.x1 + 1 && z > TANK.z0 - 1 && z < TANK.z1 + 1) || (x > -102 && x < -83 && z > -37 && z < -23);
    if (!under) HOLES.push(v2([x, BOARD.h + 0.01, z]));
  }
}

const SHADOWS = [
  [
    [BOARD.x0 - 1, 0, BOARD.z0 + 1],
    [BOARD.x1 + 2, 0, BOARD.z0 + 1],
    [BOARD.x1 + 3, 0, BOARD.z1 + 2.5],
    [BOARD.x0 + 1, 0, BOARD.z1 + 2.5],
  ],
];
const ON_BOARD = [
  [
    [TANK.x0 + 1, BOARD.h, TANK.z0],
    [TANK.x1 + 2, BOARD.h, TANK.z0],
    [TANK.x1 + 3, BOARD.h, TANK.z1 + 2],
    [TANK.x0 + 2, BOARD.h, TANK.z1 + 2],
  ],
  [
    [-100, BOARD.h, -36],
    [-83, BOARD.h, -36],
    [-82, BOARD.h, -22],
    [-99, BOARD.h, -22],
  ],
];

/* ------------------------------------------------------------- exterior */

function Cable({ list, w = 1.4, l = 0.12 }) {
  const d = `M ${pts(line2(list)).split(' ').join(' L ')}`;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={tone(0.04)} strokeWidth={w + 0.8} />
      <path d={d} stroke={tone(l)} strokeWidth={w} />
      <path d={d} stroke={tone(l + 0.25)} strokeWidth={w * 0.25} transform="translate(-0.3 -0.4)" opacity="0.7" />
    </g>
  );
}

export function Exterior() {
  const id = useIds('shadow', 'shadow2', 'grain', 'mask');
  return (
    <Art viewBox={viewBox} label="research">
      <defs>
        <GrainFilter id={id.grain} freq={1.1} amount={0.7} />
      </defs>
      <ContactShadow id={id.shadow} quads={SHADOWS} view={v2} std={5} opacity={0.75} />
      <Cable list={SOURCE_CABLE} w={1.6} />
      <Cable list={MOUNT_CABLE} w={1.3} />
      <Solids faces={board} view={view} />
      {HOLES.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="0.85" ry="0.42" fill={tone(0.02)} />
      ))}
      <ContactShadow id={id.shadow2} quads={ON_BOARD} view={v2} std={3} opacity={0.65} />
      <Solids faces={[...source, ...irPost]} view={view} />
      <Cable list={IR_CABLE} w={1.3} />
      <Solids faces={TANK_FACES} view={view} edge={0.12} />
      <Cable list={FIBER} w={1.1} l={0.3} />
      <Solids faces={FRONT_FACES} view={view} />
      <GlassEdges />
      <Tag x="12" y="300" size={9}>
        Thin-film rig · illustration
      </Tag>
    </Art>
  );
}

/* bright verticals and the water line, which carry most of the glass */
function GlassEdges() {
  const { x0, x1, z0, z1, y0, y1 } = TANK;
  const corners = [
    [x0, z1],
    [x1, z1],
    [x1, z0],
    [x0, z0],
  ];
  const wl = [
    [x0, WATER_Y, z1],
    [x1, WATER_Y, z1],
    [x1, WATER_Y, z0],
    [x0, WATER_Y, z0],
  ].map(v2);
  const rim = corners.map(([x, z]) => v2([x, y1, z]));
  return (
    <g fill="none" strokeLinecap="round">
      {corners.map(([x, z], i) => {
        const a = v2([x, y0, z]);
        const b = v2([x, y1, z]);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={tone(0.9)} strokeOpacity={i === 0 ? 0.75 : 0.35} strokeWidth={i === 0 ? 1.1 : 0.7} />;
      })}
      <polygon points={pts(rim)} stroke={tone(0.85)} strokeOpacity="0.5" strokeWidth="0.7" />
      <polygon points={pts(wl)} stroke={tone(0.8)} strokeOpacity="0.35" strokeWidth="0.6" />
    </g>
  );
}

/* ------------------------------------------------------------- interior */

const FIBER_IN_FILM = [HOLDER.x0 + 0.3, 6.7, -26.2];
const SPOT = [IR.x, HOLDER.y1 - 1.5, -26.2];

export function Interior() {
  const id = useIds('bloom', 'grain', 'film', 'mask');
  const glide = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const p = mix(FIBER_IN_FILM, [HOLDER.x1 - 0.6, 6.7, -26.2], t);
    return v2(add(p, [0, i % 2 ? 0.35 : -0.35, 0]));
  });
  const cone = [v2([IR.x - 1.1, IR.bottom, IR.z]), v2([IR.x + 1.1, IR.bottom, IR.z]), v2([SPOT[0] + 0.4, SPOT[1], SPOT[2]]), v2([SPOT[0] - 0.4, SPOT[1], SPOT[2]])];
  const spot = v2(SPOT);
  const fiber = `M ${pts(line2(FIBER)).split(' ').join(' L ')}`;
  return (
    <Art viewBox={viewBox} label="research-inside">
      <defs>
        <BloomFilter id={id.bloom} std={3} />
        <GrainFilter id={id.grain} />
        <FilmFilter id={id.film} opacity={0.6} />
        <mask id={id.mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
          <Solids faces={ALL} view={view} />
        </mask>
      </defs>
      <g filter={`url(#${id.film})`}>
        <Solids faces={ALL} view={view} />
      </g>
      <Radiograph faces={board} view={view} gain={0.5} />
      <Radiograph faces={[...source, ...irPost, ...FRONT_FACES]} view={view} />
      <Radiograph faces={TANK_FACES} view={view} gain={1.6} />
      {/* cables: jacket faint, conductor bright */}
      {[SOURCE_CABLE, IR_CABLE, MOUNT_CABLE].map((c, i) => (
        <path key={i} d={`M ${pts(line2(c)).split(' ').join(' L ')}`} stroke={RAD.edge(0.35)} strokeWidth="1.2" />
      ))}

      {/* illustration of the principle */}
      <g filter={`url(#${id.bloom})`} opacity="0.8">
        <path d={fiber} stroke="#dff7ff" strokeWidth="3" />
        <polyline points={pts(glide)} stroke="#dff7ff" strokeWidth="2.4" />
        <circle cx={spot[0]} cy={spot[1]} r="6" fill="#dff7ff" />
      </g>
      <path d={fiber} stroke={RAD.edge(1)} strokeWidth="0.9" />
      <polyline points={pts(glide)} stroke={RAD.edge(1)} strokeWidth="0.8" />
      <polygon points={pts(cone)} fill={RAD.edge(0.12)} stroke={RAD.edge(0.6)} strokeWidth="0.6" strokeDasharray="2.5 2" />

      <rect width="720" height="351" filter={`url(#${id.grain})`} mask={`url(#${id.mask})`} opacity="0.2" />

      <Lead from={v2([-79, 14, -29.8])} to={[200, 332]} label="Optical fiber" anchor="end" />
      <Lead from={v2([IR.x, IR.top + 1, IR.z])} to={[560, 26]} label="IR heating optics" />
      <Lead from={v2([(FILM.x0 + FILM.x1) / 2 + 3, HOLDER.y1, -26])} to={[330, 312]} label="Oil film" />
      <Lead from={v2([HOLDER.x1 - 2, 6, HOLDER.z1])} to={[468, 312]} label="Film holder" />
      <Lead from={v2([TANK.x1, 5, TANK.z1])} to={[610, 290]} label="Water tank" />
      <Tag x="712" y="344" anchor="end" size={9} opacity={0.65}>
        Beam paths illustrative
      </Tag>
    </Art>
  );
}
