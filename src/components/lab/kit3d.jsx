// Renders room3d geometry two ways: lit solids for the room, and a radiograph of
// the same faces for the X-ray, so an illustrated station's inside and outside are
// one model seen two ways.

import { RAD, SoftFilter, pts, tone } from './kit';
import { radiograph, solids } from './room3d';

/** Lit, painter-sorted faces with a hairline edge a step lighter than the face. */
export function Solids({ faces, view, edge = 0.06 }) {
  return (
    <g strokeLinejoin="round">
      {solids(faces, view).map((f, i) => {
        const l = f.l;
        return <polygon key={i} points={f.points} fill={f.fill} stroke={f.smooth ? f.fill : tone(l + edge * (f.mat.edge ?? 0.4) * 2)} strokeWidth={f.smooth ? 0.4 : 0.6} />;
      })}
    </g>
  );
}

/** Every face as density: overlaps build up, edges stay bright. */
export function Radiograph({ faces, view, gain = 1 }) {
  return (
    <g strokeLinejoin="round">
      {radiograph(faces, view).map((f, i) => (
        <polygon key={i} points={f.points} fill={RAD.edge(Math.min(0.5, f.density * 0.28 * gain))} stroke={f.smooth ? 'none' : RAD.edge(Math.min(1, f.edge * 0.9 * gain))} strokeWidth="0.7" />
      ))}
    </g>
  );
}

/** A soft shadow from projected footprints (world quads on the bench). */
export function ContactShadow({ id, quads, view, std = 4, opacity = 0.7 }) {
  return (
    <g>
      <defs>
        <SoftFilter id={id} std={std} />
      </defs>
      <g filter={`url(#${id})`} opacity={opacity}>
        {quads.map((q, i) => (
          <polygon key={i} points={pts(q.map(view))} fill="#000" />
        ))}
      </g>
    </g>
  );
}

export { tone };
