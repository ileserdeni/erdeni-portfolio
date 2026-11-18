// Projects station: the real Rhythm Punch photo and the real gearbox render, cut out
// and toned to the room. The X-ray is a radiograph made from the same photo
// (scripts/build-media.mjs) with the internals traced over it in the photo's own
// pixel coordinates, so inside and outside register exactly. Internal positions are
// based on the housing, wiring and component photos and are approximate.

import { Art, BloomFilter, FilmFilter, GrainFilter, Lead, RAD, SoftFilter, Tag, ToneFilter, applyH, lerp, path, pts, quadAt, subQuad, useIds } from '../kit';
import cutouts from './cutouts.json';

export const viewBox = '0 0 400 330';

/* Points below were measured on the original photo (1200 px wide). The cutout is
   that photo with part of its camera tilt removed, so every point goes through the
   same transform (W) before it's drawn. */
const RG = cutouts['rhythm-game'];
const W = (p) => applyH(RG.H, p);
const CROP = RG.box;
const PLACE = { x: 6, y: 14, h: 296 };
const S = PLACE.h / CROP.h;
const toStation = ([x, y]) => [PLACE.x + (x - CROP.x) * S, PLACE.y + (y - CROP.y) * S];

/* the enclosure as a box in photo space: u runs along the clef side, v along the
   back panel, w from the play surface down to the floor */
const TOP = [
  [245, 295],
  [585, 515],
  [995, 295],
  [697, 224],
].map(W);
const FLOOR = [
  [312, 588],
  [586, 862],
  [910, 556],
  [678, 431],
].map(W);
const at = (u, v, w) => lerp(quadAt(TOP, u, v), quadAt(FLOOR, u, v), w);
const plane = (w) => [0, 1, 2, 3].map((i) => lerp(TOP[i], FLOOR[i], w));

function uvOf(p) {
  let u = 0.5;
  let v = 0.5;
  for (let i = 0; i < 12; i += 1) {
    const f = quadAt(TOP, u, v);
    const fu = quadAt(TOP, u + 1e-3, v);
    const fv = quadAt(TOP, u, v + 1e-3);
    const a = (fu[0] - f[0]) / 1e-3;
    const b = (fv[0] - f[0]) / 1e-3;
    const c = (fu[1] - f[1]) / 1e-3;
    const d = (fv[1] - f[1]) / 1e-3;
    const ex = p[0] - f[0];
    const ey = p[1] - f[1];
    const det = a * d - b * c;
    u += (d * ex - b * ey) / det;
    v += (a * ey - c * ex) / det;
  }
  return [u, v];
}

/* measured on the photo: plunger tops and where they enter their pads */
const PLUNGERS = [
  { top: [572, 338], base: [572, 383] },
  { top: [575, 372], base: [575, 428] },
  { top: [667, 335], base: [666, 390] },
  { top: [812, 238], base: [810, 286] },
  { top: [830, 264], base: [830, 312] },
  { top: [880, 247], base: [880, 290] },
].map((p) => {
  const base = W(p.base);
  return { top: W(p.top), base, uv: uvOf(base) };
});

const PADS = [
  [
    [430, 382],
    [607, 320],
    [767, 397],
    [640, 492],
  ],
  [
    [695, 290],
    [795, 227],
    [967, 292],
    [865, 342],
  ],
].map((q) => q.map(W));

const MATRICES = [
  [
    [352, 312],
    [520, 272],
    [577, 322],
    [402, 372],
  ],
  [
    [600, 232],
    [690, 207],
    [783, 240],
    [705, 266],
  ],
].map((q) => q.map(W));

const LCD = [
  [472, 166],
  [571, 146],
  [573, 191],
  [474, 208],
].map(W);
const KNOB = W([356, 214]);
const SWITCHES = [
  [
    [405, 180],
    [433, 175],
    [434, 222],
    [406, 226],
  ],
  [
    [624, 118],
    [653, 113],
    [654, 176],
    [625, 181],
  ],
].map((q) => q.map(W));

const floorQ = plane(0.97);
const onFloor = (u0, v0, u1, v1) => subQuad(floorQ, u0, v0, u1, v1);

function Cylinder({ top, bottom, rx, ry, m, hatch = 0 }) {
  const side = `M ${top[0] - rx} ${top[1]} L ${bottom[0] - rx} ${bottom[1]} A ${rx} ${ry} 0 0 0 ${bottom[0] + rx} ${bottom[1]} L ${top[0] + rx} ${top[1]} A ${rx} ${ry} 0 0 0 ${top[0] - rx} ${top[1]} Z`;
  return (
    <g>
      <path d={side} fill={m.fill} stroke={m.stroke} strokeWidth="1.1" />
      <ellipse cx={top[0]} cy={top[1]} rx={rx} ry={ry} fill={m.fill} stroke={m.stroke} strokeWidth="1.1" />
      {hatch > 0 &&
        Array.from({ length: hatch }, (_, i) => {
          const p = lerp(top, bottom, (i + 1) / (hatch + 1));
          return <path key={i} d={`M ${p[0] - rx} ${p[1]} A ${rx} ${ry} 0 0 0 ${p[0] + rx} ${p[1]}`} stroke={RAD.edge(0.28)} strokeWidth="0.7" />;
        })}
    </g>
  );
}

function Solenoid({ uv, top, base }) {
  const [u, v] = uv;
  const head = at(u, v, 0.15);
  const foot = at(u, v, 0.44);
  const rod = at(u, v, 0.38);
  return (
    <g>
      {/* steel frame around the coil */}
      <path d={path([[head[0] - 19, head[1] - 3], [head[0] + 19, head[1] - 3], [foot[0] + 19, foot[1] + 3], [foot[0] - 19, foot[1] + 3]])} fill={RAD.metal.fill} stroke={RAD.metal.stroke} strokeWidth="1.2" />
      {/* coil */}
      <Cylinder top={lerp(head, foot, 0.08)} bottom={lerp(head, foot, 0.92)} rx={14} ry={5} m={RAD.copper} hatch={9} />
      {/* return spring above the frame */}
      <path
        d={`M ${top[0]} ${top[1] + 30} ${Array.from({ length: 7 }, (_, i) => {
          const p = lerp([top[0], top[1] + 30], head, (i + 1) / 7);
          return `L ${p[0] + (i % 2 ? -5 : 5)} ${p[1]}`;
        }).join(' ')}`}
        stroke={RAD.edge(0.7)}
        strokeWidth="0.9"
      />
      {/* plunger: plastic striker above the deck, steel core inside the coil */}
      <line x1={top[0]} y1={top[1] + 4} x2={base[0]} y2={base[1]} stroke={RAD.edge(0.4)} strokeWidth="4" strokeLinecap="round" />
      <line x1={base[0]} y1={base[1]} x2={rod[0]} y2={rod[1]} stroke={RAD.steel.stroke} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

function Board({ q, chips = [], pins = 0 }) {
  return (
    <g>
      <polygon points={pts(q)} fill={RAD.board.fill} stroke={RAD.board.stroke} strokeWidth="0.9" />
      {chips.map(([u0, v0, u1, v1], i) => (
        <polygon key={i} points={pts(subQuad(q, u0, v0, u1, v1))} fill={RAD.metal.fill} stroke={RAD.metal.stroke} strokeWidth="0.9" />
      ))}
      {pins > 0 &&
        Array.from({ length: pins }, (_, i) => {
          const p = quadAt(q, 0.06, (i + 0.5) / pins);
          const p2 = quadAt(q, 0.94, (i + 0.5) / pins);
          return (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r="1.3" fill={RAD.edge(0.8)} />
              <circle cx={p2[0]} cy={p2[1]} r="1.3" fill={RAD.edge(0.8)} />
            </g>
          );
        })}
    </g>
  );
}

/* the baseplate, from the wiring photo: a long driver board with six MOSFETs and
   their diodes, the controller board with audio and SD modules, a buck converter,
   and lever connectors */
const DRIVER = onFloor(0.56, 0.08, 0.9, 0.86);
const CONTROL = onFloor(0.2, 0.46, 0.48, 0.9);
const BUCK = onFloor(0.06, 0.08, 0.24, 0.34);
const WAGO = [onFloor(0.07, 0.48, 0.17, 0.62), onFloor(0.07, 0.66, 0.17, 0.8)];
const MOSFETS = Array.from({ length: 6 }, (_, i) => subQuad(DRIVER, 0.18, 0.06 + i * 0.13, 0.46, 0.14 + i * 0.13));

function Internals() {
  const frameTop = plane(0.07);
  return (
    <g>
      {/* inner support frame: top plate, two side panels, base plate */}
      <polygon points={pts(subQuad(frameTop, 0.04, 0.04, 0.96, 0.96))} fill={RAD.wood.fill} stroke={RAD.wood.stroke} strokeWidth="1" strokeDasharray="5 3" />
      {[0.16, 0.86].map((u) => (
        <polygon key={u} points={pts([at(u, 0.1, 0.07), at(u, 0.9, 0.07), at(u, 0.9, 0.97), at(u, 0.1, 0.97)])} fill={RAD.wood.fill} stroke={RAD.wood.stroke} strokeWidth="0.9" />
      ))}
      <polygon points={pts(floorQ)} fill={RAD.wood.fill} stroke={RAD.edge(0.45)} strokeWidth="1" />

      {/* baseplate electronics */}
      <Board q={DRIVER} pins={18} />
      {MOSFETS.map((q, i) => (
        <g key={i}>
          <polygon points={pts(q)} fill={RAD.metal.fill} stroke={RAD.steel.stroke} strokeWidth="0.8" />
          <circle cx={quadAt(q, 0.3, 0.5)[0]} cy={quadAt(q, 0.3, 0.5)[1]} r="1.6" fill="#050b12" />
          <polygon points={pts(subQuad(DRIVER, 0.62, 0.08 + i * 0.13, 0.7, 0.12 + i * 0.13))} fill={RAD.metal.fill} stroke={RAD.metal.stroke} strokeWidth="0.7" />
        </g>
      ))}
      <Board q={CONTROL} chips={[[0.3, 0.3, 0.75, 0.62], [0.1, 0.72, 0.4, 0.94], [0.58, 0.72, 0.9, 0.94]]} pins={12} />
      <Board q={BUCK} chips={[[0.25, 0.25, 0.7, 0.7]]} />
      {WAGO.map((q, i) => (
        <polygon key={i} points={pts(q)} fill={RAD.plastic.fill} stroke={RAD.plastic.stroke} strokeWidth="0.8" />
      ))}

      {/* solenoid brackets under the pads (three holes each, as in the CAD) */}
      {PADS.map((q, k) => (
        <polygon key={k} points={pts(q.map((p) => [p[0], p[1] + 34]))} fill={RAD.plastic.fill} stroke={RAD.plastic.stroke} strokeWidth="1" />
      ))}

      {/* wiring: each solenoid to its MOSFET */}
      {PLUNGERS.map((p, i) => {
        const a = at(p.uv[0], p.uv[1], 0.44);
        const b = quadAt(MOSFETS[i], 0.9, 0.5);
        return <path key={i} d={`M ${a[0]} ${a[1]} C ${a[0]} ${a[1] + 90}, ${b[0] - 40} ${b[1] - 30}, ${b[0]} ${b[1]}`} stroke={RAD.wire} strokeWidth="0.9" />;
      })}
      {(() => {
        const a = quadAt(CONTROL, 0.9, 0.2);
        const b = quadAt(DRIVER, 0.1, 0.9);
        const c = quadAt(MATRICES[0], 0.5, 0.9);
        return (
          <g stroke={RAD.wire} strokeWidth="0.8">
            <path d={`M ${a[0]} ${a[1]} C ${a[0] + 40} ${a[1] - 10}, ${b[0] - 30} ${b[1] + 10}, ${b[0]} ${b[1]}`} />
            <path d={`M ${c[0]} ${c[1]} C ${c[0]} ${c[1] + 120}, ${a[0] - 60} ${a[1] - 80}, ${a[0] - 20} ${a[1]}`} strokeDasharray="4 3" />
          </g>
        );
      })()}

      {/* solenoids */}
      {PLUNGERS.map((p, i) => (
        <Solenoid key={i} uv={p.uv} top={p.top} base={p.base} />
      ))}

      {/* LED matrices: 8 × 8 dense dies */}
      {MATRICES.map((q, k) => (
        <g key={k}>
          <polygon points={pts(q)} fill={RAD.board.fill} stroke={RAD.board.stroke} strokeWidth="0.8" />
          {Array.from({ length: 64 }, (_, i) => {
            const p = quadAt(q, ((i % 8) + 0.5) / 8, (Math.floor(i / 8) + 0.5) / 8);
            return <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill={RAD.edge(0.75)} />;
          })}
        </g>
      ))}

      {/* control panel: LCD module, potentiometer, switch bodies */}
      <polygon points={pts(LCD.map((p) => [p[0] + 6, p[1] - 4]))} fill={RAD.board.fill} stroke={RAD.board.stroke} />
      <polygon points={pts(subQuad(LCD, -0.12, -0.3, 1.12, 1.25).map((p) => [p[0] + 10, p[1] - 6]))} fill={RAD.board.fill} stroke={RAD.edge(0.5)} strokeWidth="0.8" />
      {Array.from({ length: 16 }, (_, i) => {
        const p = quadAt(LCD, (i + 0.5) / 16, -0.2);
        return <circle key={i} cx={p[0] + 10} cy={p[1] - 6} r="1" fill={RAD.edge(0.9)} />;
      })}
      <circle cx={KNOB[0]} cy={KNOB[1]} r="13" fill={RAD.metal.fill} stroke={RAD.metal.stroke} />
      <circle cx={KNOB[0]} cy={KNOB[1]} r="4.5" fill={RAD.steel.fill} stroke={RAD.steel.stroke} />
      {SWITCHES.map((q, i) => (
        <polygon key={i} points={pts(q.map((p) => [p[0] + 4, p[1] - 3]))} fill={RAD.plastic.fill} stroke={RAD.plastic.stroke} />
      ))}
    </g>
  );
}

/* the bright parts, repeated under a blur for bloom */
function Bright() {
  return (
    <g>
      {PLUNGERS.map((p, i) => {
        const rod = at(p.uv[0], p.uv[1], 0.38);
        return <line key={i} x1={p.base[0]} y1={p.base[1]} x2={rod[0]} y2={rod[1]} stroke="#dff7ff" strokeWidth="7" />;
      })}
    </g>
  );
}

const PHOTO = '/media/lab/rhythm-game-cut.webp';
const PHOTO_XRAY = '/media/lab/rhythm-game-xray.webp';
const GEAR = '/media/lab/gearbox-cut.webp';
const GEAR_XRAY = '/media/lab/gearbox-xray.webp';

function Photo({ children }) {
  return (
    <svg x={PLACE.x} y={PLACE.y} width={CROP.w * S} height={PLACE.h} viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} overflow="visible">
      {children}
    </svg>
  );
}

const GEAR_PLACE = { x: 266, y: 101, w: 122, h: 106.75 };
function Gear({ children }) {
  return (
    <svg x={GEAR_PLACE.x} y={GEAR_PLACE.y} width={GEAR_PLACE.w} height={GEAR_PLACE.h} viewBox="130 130 640 560" overflow="visible">
      {children}
    </svg>
  );
}

function Shadows({ id }) {
  return (
    <g filter={`url(#${id})`} opacity="0.75">
      <Photo>
        <polygon points={pts(FLOOR.map(([x, y]) => [x + 14, y + 6]))} fill="#000" />
      </Photo>
      <ellipse cx="326" cy="199" rx="56" ry="8" fill="#000" />
    </g>
  );
}

export function Exterior() {
  const id = useIds('tone', 'gtone', 'shadow');
  return (
    <Art viewBox={viewBox} label="projects">
      <defs>
        <ToneFilter id={id.tone} contrast={1.12} lift={-0.02} />
        <ToneFilter id={id.gtone} contrast={1.25} lift={-0.06} />
        <SoftFilter id={id.shadow} std={5} />
      </defs>
      <Shadows id={id.shadow} />
      <Gear>
        <image href={GEAR} x="0" y="0" width="800" height="774" filter={`url(#${id.gtone})`} />
      </Gear>
      <Photo>
        <image href={PHOTO} x={CROP.x} y={CROP.y} width={CROP.w} height={CROP.h} filter={`url(#${id.tone})`} />
      </Photo>
      <Tag x="10" y="326" size={9}>
        Rhythm Punch · photo
      </Tag>
      <Tag x="392" y="220" anchor="end" size={9}>
        Gearbox · CAD render
      </Tag>
    </Art>
  );
}

export function Interior() {
  const id = useIds('film', 'bloom', 'grain', 'mask', 'gmask');
  const lead = (p) => toStation(p);
  return (
    <Art viewBox={viewBox} label="projects-inside">
      <defs>
        <FilmFilter id={id.film} />
        <BloomFilter id={id.bloom} std={4} />
        <GrainFilter id={id.grain} />
        <mask id={id.mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse">
          <Photo>
            <image href={PHOTO} x={CROP.x} y={CROP.y} width={CROP.w} height={CROP.h} />
          </Photo>
          <Gear>
            <image href={GEAR} width="800" height="774" />
          </Gear>
        </mask>
      </defs>

      <Gear>
        <image href={GEAR} width="800" height="774" filter={`url(#${id.film})`} />
        <image href={GEAR_XRAY} width="800" height="774" />
      </Gear>

      <Photo>
        <image href={PHOTO} x={CROP.x} y={CROP.y} width={CROP.w} height={CROP.h} filter={`url(#${id.film})`} />
        <image href={PHOTO_XRAY} x={CROP.x} y={CROP.y} width={CROP.w} height={CROP.h} opacity="0.8" />
        <g filter={`url(#${id.bloom})`} opacity="0.55">
          <Bright />
        </g>
        <Internals />
      </Photo>

      <rect width="400" height="330" filter={`url(#${id.grain})`} mask={`url(#${id.mask})`} opacity="0.22" />

      <Lead from={lead(at(PLUNGERS[4].uv[0], PLUNGERS[4].uv[1], 0.3))} to={[282, 42]} label="Solenoids ×6" />
      <Lead from={lead(at(0.86, 0.6, 0.55))} to={[282, 236]} label="Inner frame" />
      <Lead from={lead(quadAt(MOSFETS[4], 0.3, 0.5))} to={[282, 262]} label="Drivers ×6" />
      <Lead from={lead(quadAt(CONTROL, 0.5, 0.45))} to={[282, 288]} label="Controller" />
      <Lead from={[300, 160]} to={[392, 92]} label="Gears" anchor="end" />
      <Tag x="392" y="326" anchor="end" size={8.5} opacity={0.65}>
        Internals illustrative
      </Tag>
    </Art>
  );
}
