// Drawings station: a wall-hung light box with sheets held on a rail by binder
// clips. Sheets show real drawings from content/drawings.js when there are any,
// and stay blank otherwise; nothing is drawn on the user's behalf. Through the
// X-ray, a drawing with a `sketch` stage shows that stage on its sheet.

import { drawings } from '../../../content/drawings';
import { largestSrc } from '../../media/Picture';
import { Art, BloomFilter, FilmFilter, GrainFilter, Lead, RAD, SoftFilter, Tag, ToneFilter, pts, tone, useIds } from '../kit';
import { Radiograph, Solids } from '../kit3d';
import { MAT, box, cylinder, panelMatrix, stationView } from '../room3d';

export const viewBox = '0 0 520 330';
const ORIGIN = [552, 58.5];
const view = stationView(ORIGIN);
const v2 = (p) => view(p).slice(0, 2);

const WALL = -58;
const BOX = { x0: -41, x1: 43, y0: 16, y1: 68, z0: WALL + 0.4, z1: WALL + 4.4, rim: 2 };
const PANEL_Z = BOX.z1 - 0.6;
const SHEET_Z = BOX.z1 + 0.15;
const RAIL = { y: 63.5, z: BOX.z1 + 0.9 };

const aluminium = { base: 0.52, light: 0.36, edge: 0.6, density: 0.5 };

/* frame: four extrusion bars around a recessed panel */
const frame = [
  ...box([BOX.x0, BOX.y0, BOX.z0], [BOX.x1, BOX.y0 + BOX.rim, BOX.z1], aluminium),
  ...box([BOX.x0, BOX.y1 - BOX.rim, BOX.z0], [BOX.x1, BOX.y1, BOX.z1], aluminium),
  ...box([BOX.x0, BOX.y0 + BOX.rim, BOX.z0], [BOX.x0 + BOX.rim, BOX.y1 - BOX.rim, BOX.z1], aluminium),
  ...box([BOX.x1 - BOX.rim, BOX.y0 + BOX.rim, BOX.z0], [BOX.x1, BOX.y1 - BOX.rim, BOX.z1], aluminium),
];
const PANEL = [
  [BOX.x0 + BOX.rim, BOX.y1 - BOX.rim, PANEL_Z],
  [BOX.x1 - BOX.rim, BOX.y1 - BOX.rim, PANEL_Z],
  [BOX.x1 - BOX.rim, BOX.y0 + BOX.rim, PANEL_Z],
  [BOX.x0 + BOX.rim, BOX.y0 + BOX.rim, PANEL_Z],
];
const rail = [
  ...cylinder([BOX.x0 + 3, RAIL.y, RAIL.z], [BOX.x1 - 3, RAIL.y, RAIL.z], 0.22, MAT.steel, { segs: 8 }),
  ...[BOX.x0 + 3.2, BOX.x1 - 3.2].flatMap((x) => box([x - 0.5, RAIL.y - 0.7, BOX.z1], [x + 0.5, RAIL.y + 0.7, RAIL.z + 0.3], MAT.anodized)),
];

/* sheets hang from the rail; sizes in cm, `r` is a small in-plane turn */
const SHEETS = [
  { cx: -21, w: 21, h: 29.7, r: -2.6 },
  { cx: 4, w: 29.7, h: 21, r: 1.4, drop: 1.2 },
  { cx: 28, w: 18, h: 24, r: 3.2, drop: 0.4 },
];

function sheetCorners(s, z = SHEET_Z) {
  const a = (s.r * Math.PI) / 180;
  const top = RAIL.y + 0.6 - (s.drop ?? 0);
  const rot = ([x, y]) => [s.cx + x * Math.cos(a) - y * Math.sin(a), top + x * Math.sin(a) + y * Math.cos(a)];
  return [
    [-s.w / 2, 0],
    [s.w / 2, 0],
    [s.w / 2, -s.h],
    [-s.w / 2, -s.h],
  ].map((p) => [...rot(p), z]);
}

function clipAt(s) {
  const [tl, tr] = sheetCorners(s);
  return [(tl[0] + tr[0]) / 2, (tl[1] + tr[1]) / 2];
}

function clip([x, y]) {
  const z = SHEET_Z;
  return [
    ...box([x - 1.6, y - 1.5, z], [x + 1.6, y + 0.5, z + 1.1], MAT.anodized),
    ...box([x - 1.3, y + 0.5, z + 0.2], [x + 1.3, y + 0.9, z + 0.9], MAT.anodized),
  ];
}

function clipWires([x, y]) {
  const z = SHEET_Z + 1.1;
  return [
    [[x - 1.1, y + 0.4, z], [x - 0.9, y + 2.6, z + 1.6], [x + 0.9, y + 2.6, z + 1.6], [x + 1.1, y + 0.4, z]],
  ];
}

const CLIPS = SHEETS.map(clipAt);
const clips = CLIPS.flatMap(clip);
const CABLE = [
  [BOX.x1 - 6, BOX.y0, BOX.z0 + 1.5],
  [BOX.x1 - 6, BOX.y0 - 6, WALL + 0.6],
  [BOX.x1 - 5, 4, WALL + 0.6],
  [BOX.x1 - 2, 0.4, WALL + 2],
];

const HAS_ART = drawings.length > 0;

function Sheet({ s, i, inside, ids }) {
  const c = sheetCorners(s).map(v2);
  const d = drawings[i];
  const src = d && largestSrc(inside && d.sketch ? d.sketch : d.image);
  const k = 100;
  const m = panelMatrix(c[0], c[1], c[3], s.w * k, s.h * k);
  return (
    <g>
      {!inside && (
        <g filter={`url(#${ids.soft})`} opacity="0.32">
          <polygon points={pts(c.map(([x, y]) => [x + 2.4, y + 3]))} fill="#04080c" />
        </g>
      )}
      <polygon points={pts(c)} fill={inside ? RAD.edge(0.07) : 'rgb(234,243,245)'} stroke={inside ? RAD.edge(0.6) : 'rgba(255,255,255,0.75)'} strokeWidth="0.6" />
      {src && (
        <g transform={m}>
          <image href={src} width={s.w * k} height={s.h * k} preserveAspectRatio="xMidYMid slice" filter={inside ? undefined : `url(#${ids.tone})`} opacity={inside ? 0.85 : 1} style={inside ? { mixBlendMode: 'screen' } : undefined} />
        </g>
      )}
      {/* each layer of paper holds back a little light, so overlaps read darker */}
      {!inside && <polygon points={pts(c)} fill="#0b1824" opacity="0.07" />}
      {!inside && <polygon points={pts(c)} fill="#fff" filter={`url(#${ids.paper})`} />}
    </g>
  );
}

function PaperFilter({ id }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 1.3" numOctaves="3" seed="11" />
      <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.28  0 0 0 0 0.32  0 0 0 0.55 -0.24" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
  );
}

function Wires({ inside }) {
  return CLIPS.map((c, i) => {
    const [w] = clipWires(c);
    return <polyline key={i} points={pts(w.map(v2))} fill="none" stroke={inside ? RAD.edge(0.95) : tone(0.7)} strokeWidth="0.7" strokeLinejoin="round" />;
  });
}

export function Exterior() {
  const id = useIds('glow', 'lit', 'soft', 'paper', 'tone', 'shadow');
  const panel = PANEL.map(v2);
  const cable = CABLE.map(v2);
  return (
    <Art viewBox={viewBox} label="drawings">
      <defs>
        <linearGradient id={id.lit} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor="#eefcff" />
          <stop offset="0.55" stopColor="#bfe7f5" />
          <stop offset="1" stopColor="#8fbccd" />
        </linearGradient>
        <SoftFilter id={id.glow} std={22} />
        <SoftFilter id={id.soft} std={2.2} />
        <SoftFilter id={id.shadow} std={6} />
        <PaperFilter id={id.paper} />
        <ToneFilter id={id.tone} contrast={1} lift={0.04} />
      </defs>
      {/* the panel lights the wall around it */}
      <polygon points={pts(panel)} fill="#a9e8ff" opacity="0.28" filter={`url(#${id.glow})`} />
      <g filter={`url(#${id.shadow})`} opacity="0.5">
        <polygon points={pts([[BOX.x0 + 1, BOX.y1 - 2, WALL], [BOX.x1 + 2, BOX.y1 - 2, WALL], [BOX.x1 + 2, BOX.y0 - 2, WALL], [BOX.x0 + 1, BOX.y0 - 2, WALL]].map(v2))} fill="#000" />
      </g>
      <polyline points={pts(cable)} fill="none" stroke={tone(0.08)} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={pts(panel)} fill={`url(#${id.lit})`} />
      <Solids faces={frame} view={view} />
      {SHEETS.map((s, i) => (
        <Sheet key={i} s={s} i={i} ids={id} />
      ))}
      <Solids faces={rail} view={view} />
      <Solids faces={clips} view={view} />
      <Wires />
      <Tag x="40" y="300" size={9} fill="#16303f" opacity={0.85}>
        {HAS_ART ? 'Drawings · originals' : 'Illustration'}
      </Tag>
    </Art>
  );
}

/* inside: LED strips along the top and bottom edges, a dotted light guide, the
   driver in the corner, and the sheets as faint layers */
export function Interior() {
  const id = useIds('film', 'bloom', 'grain', 'mask', 'soft', 'paper', 'tone');
  const panel = PANEL.map(v2);
  const ledRows = [BOX.y1 - BOX.rim - 0.8, BOX.y0 + BOX.rim + 0.8].map((y) =>
    Array.from({ length: 26 }, (_, i) => v2([BOX.x0 + 4 + (i * (BOX.x1 - BOX.x0 - 8)) / 25, y, BOX.z0 + 1.2])),
  );
  const dots = [];
  for (let gx = 0; gx < 22; gx += 1) {
    for (let gy = 0; gy < 12; gy += 1) {
      const t = Math.abs(gy - 5.5) / 5.5;
      dots.push({ p: v2([BOX.x0 + 4.5 + gx * 3.6, BOX.y0 + 5 + gy * 3.8, BOX.z0 + 1.6]), r: 0.5 + (1 - t) * 0.9 });
    }
  }
  const driver = box([BOX.x1 - 12, BOX.y0 + 2.6, BOX.z0 + 0.4], [BOX.x1 - 4, BOX.y0 + 6.4, BOX.z0 + 1.6], MAT.steel);
  return (
    <Art viewBox={viewBox} label="drawings-inside">
      <defs>
        <FilmFilter id={id.film} opacity={0.85} />
        <BloomFilter id={id.bloom} std={3.5} />
        <GrainFilter id={id.grain} />
        <SoftFilter id={id.soft} std={2} />
        <PaperFilter id={id.paper} />
        <ToneFilter id={id.tone} />
        <mask id={id.mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
          <Solids faces={frame} view={view} />
          <polygon points={pts(panel)} fill="#000" />
        </mask>
      </defs>
      <g filter={`url(#${id.film})`}>
        <Solids faces={frame} view={view} />
        <polygon points={pts(panel)} fill="#000" />
      </g>
      <Radiograph faces={frame} view={view} gain={0.9} />
      {dots.map(({ p, r }, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={r} fill={RAD.edge(0.22)} />
      ))}
      <Radiograph faces={driver} view={view} gain={1.2} />
      <polyline points={pts(CABLE.map(v2))} fill="none" stroke={RAD.edge(0.5)} strokeWidth="1" />
      <g filter={`url(#${id.bloom})`} opacity="0.7">
        {ledRows.flat().map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill="#dff7ff" />
        ))}
      </g>
      {ledRows.flat().map((p, i) => (
        <rect key={i} x={p[0] - 1.2} y={p[1] - 0.8} width="2.4" height="1.6" fill={RAD.edge(1)} />
      ))}
      {SHEETS.map((s, i) => (
        <Sheet key={i} s={s} i={i} inside ids={id} />
      ))}
      <Radiograph faces={rail} view={view} gain={1.3} />
      <Radiograph faces={clips} view={view} gain={1.6} />
      <Wires inside />
      <rect width="520" height="330" filter={`url(#${id.grain})`} mask={`url(#${id.mask})`} opacity="0.2" />
      <Lead from={ledRows[0][23]} to={[500, 16]} label="LED strip" anchor="end" />
      <Lead from={dots[3 * 12 + 8].p} to={[24, 300]} label="Light guide" />
      <Lead from={v2([CLIPS[0][0], CLIPS[0][1] + 1.6, SHEET_Z + 1])} to={[16, 16]} label="Binder clips" />
      <Tag x="512" y="324" anchor="end" size={9} opacity={0.65}>
        {HAS_ART ? 'Sketch stage where supplied' : 'Illustration'}
      </Tag>
    </Art>
  );
}
