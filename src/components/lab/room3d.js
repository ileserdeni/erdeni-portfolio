// One camera for the whole lab. World units are centimetres: x to the right,
// y up from the bench top, z toward the viewer. Points project into stage pixels
// (the 1600 × 900 stage the room is laid out in), so every station's drawing and
// the bench share one perspective, one light and one scale. The camera looks down
// about 24°, which is how the Rhythm Punch photo was taken once straightened.

import { tone } from './kit';

const PITCH = (24 * Math.PI) / 180;
const FOCAL = 1800;
const DIST = 300;
const CENTER = [800, 560];

const sin = Math.sin(PITCH);
const cos = Math.cos(PITCH);
const EYE = [0, DIST * sin, DIST * cos];

/** World point → [stageX, stageY, depth]. */
export function project([x, y, z]) {
  const rx = x - EYE[0];
  const ry = y - EYE[1];
  const rz = z - EYE[2];
  const zc = -ry * sin - rz * cos;
  const yc = ry * cos - rz * sin;
  return [CENTER[0] + (FOCAL * rx) / zc, CENTER[1] - (FOCAL * yc) / zc, zc];
}

/** A projector into one station's local SVG coordinates. */
export function stationView(origin) {
  return (p) => {
    const [x, y, d] = project(p);
    return [x - origin[0], y - origin[1], d];
  };
}

/* ------------------------------------------------------------- geometry */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => {
  const l = Math.hypot(...a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Key light from the upper left, slightly in front: the light box and the window.
const LIGHT = norm([-0.45, 0.85, 0.35]);

/**
 * A material is a base tone (0–1 on the room ramp), how much the light changes it,
 * an edge highlight strength, and a radiograph density for the X-ray.
 */
export const MAT = {
  anodized: { base: 0.14, light: 0.3, edge: 0.35, density: 0.35 },
  steel: { base: 0.38, light: 0.42, edge: 0.6, density: 0.6 },
  brushed: { base: 0.5, light: 0.35, edge: 0.55, density: 0.5 },
  rubber: { base: 0.07, light: 0.12, edge: 0.15, density: 0.12 },
  printed: { base: 0.72, light: 0.25, edge: 0.4, density: 0.14 },
  wood: { base: 0.3, light: 0.3, edge: 0.3, density: 0.1 },
  paint: { base: 0.26, light: 0.32, edge: 0.4, density: 0.32 },
  ivory: { base: 0.8, light: 0.2, edge: 0.3, density: 0.1 },
  ebony: { base: 0.05, light: 0.18, edge: 0.3, density: 0.12 },
  felt: { base: 0.42, light: 0.15, edge: 0.1, density: 0.08 },
  glass: { base: 0.6, light: 0.3, edge: 0.7, density: 0.04, alpha: 0.12 },
  water: { base: 0.55, light: 0.2, edge: 0.4, density: 0.03, alpha: 0.1 },
  screen: { base: 0.2, light: 0.05, edge: 0.3, density: 0.05 },
};

export function lightness(n, mat) {
  const d = Math.max(0, dot(n, LIGHT));
  return mat.base + mat.light * (d - 0.35);
}

/** A planar polygon with a material. `pts` wind counter-clockwise seen from outside. */
export function face(pts, mat, extra = {}) {
  const n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
  return { pts, n, mat, ...extra };
}

/** Axis-aligned box from min to max corner. */
export function box(min, max, mat, extra) {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const p = (x, y, z) => [x, y, z];
  return [
    face([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], mat, extra), // front
    face([p(x1, y0, z0), p(x0, y0, z0), p(x0, y1, z0), p(x1, y1, z0)], mat, extra), // back
    face([p(x0, y1, z1), p(x1, y1, z1), p(x1, y1, z0), p(x0, y1, z0)], mat, extra), // top
    face([p(x0, y0, z0), p(x1, y0, z0), p(x1, y0, z1), p(x0, y0, z1)], mat, extra), // bottom
    face([p(x1, y0, z1), p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1)], mat, extra), // right
    face([p(x0, y0, z0), p(x0, y0, z1), p(x0, y1, z1), p(x0, y1, z0)], mat, extra), // left
  ];
}

/** Cylinder from `a` to `b` (world points) with radius r. */
export function cylinder(a, b, r, mat, { segs = 18, caps = true, extra } = {}) {
  const axis = norm(sub(b, a));
  const ref = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = norm(cross(axis, ref));
  const v = cross(axis, u);
  const ring = (c) => Array.from({ length: segs }, (_, i) => {
    const t = (i / segs) * Math.PI * 2;
    return add(c, add(scale(u, Math.cos(t) * r), scale(v, Math.sin(t) * r)));
  });
  const ra = ring(a);
  const rb = ring(b);
  const faces = [];
  for (let i = 0; i < segs; i += 1) {
    const j = (i + 1) % segs;
    faces.push(face([ra[i], ra[j], rb[j], rb[i]], mat, { ...extra, smooth: true }));
  }
  if (caps) {
    faces.push(face([...rb], mat, extra));
    faces.push(face([...ra].reverse(), mat, extra));
  }
  return faces;
}

/** Turns faces about the vertical axis (radians, positive turns +z toward +x) and moves them. */
export function place(faces, { at = [0, 0, 0], yaw = 0 } = {}) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const tf = ([x, y, z]) => [at[0] + x * c + z * s, at[1] + y, at[2] - x * s + z * c];
  return faces.map((f) => ({ ...f, pts: f.pts.map(tf), n: [f.n[0] * c + f.n[2] * s, f.n[1], -f.n[0] * s + f.n[2] * c] }));
}

export function placePoint(p, { at = [0, 0, 0], yaw = 0 } = {}) {
  return place([{ pts: [p], n: [0, 0, 1] }], { at, yaw })[0].pts[0];
}

/**
 * SVG matrix that maps a flat local frame (0,0)–(w,h) onto a projected quad given
 * by its top-left, top-right and bottom-left corners. Good enough for small panels.
 */
export function panelMatrix(tl, tr, bl, w, h) {
  const a = (tr[0] - tl[0]) / w;
  const b = (tr[1] - tl[1]) / w;
  const c = (bl[0] - tl[0]) / h;
  const d = (bl[1] - tl[1]) / h;
  return `matrix(${[a, b, c, d, tl[0], tl[1]].map((v) => v.toFixed(4)).join(' ')})`;
}

/* ------------------------------------------------------------ rendering */

const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/**
 * Painter's-order SVG polygons for the visible faces. Returns plain objects so a
 * station can render them however it likes.
 */
export function solids(faces, view) {
  const eyeLocal = EYE;
  return faces
    .map((f) => {
      const c = scale(f.pts.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / f.pts.length);
      const facing = dot(f.n, sub(eyeLocal, c)) > 0;
      if (!facing && !f.mat.alpha && !f.twoSided) return null;
      const sp = f.pts.map(view);
      const depth = sp.reduce((s, p) => s + p[2], 0) / sp.length;
      const l = lightness(facing ? f.n : scale(f.n, -1), f.mat) + (f.lift ?? 0);
      return { points: sp.map(fmt).join(' '), depth, l, fill: tone(l, f.mat.alpha ?? 1), mat: f.mat, smooth: f.smooth, id: f.id };
    })
    .filter(Boolean)
    .sort((a, b) => b.depth - a.depth);
}

/** All faces as radiograph densities (no culling: an X-ray sees every wall). */
export function radiograph(faces, view) {
  return faces.map((f) => ({
    points: f.pts.map(view).map(fmt).join(' '),
    density: f.mat.density,
    edge: f.mat.edge,
    smooth: f.smooth,
  }));
}

export const P = (view, p) => {
  const [x, y] = view(p);
  return [x, y];
};
