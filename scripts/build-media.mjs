// Converts originals in media-src/ into responsive WebP files in public/media/
// and writes src/content/media-manifest.json (dimensions + tiny placeholders).
//
//   npm run media
//
// Keys are the source path relative to media-src/, lowercased, without the
// extension, with spaces/underscores turned into dashes:
//   media-src/projects/Rhythm Game_main.JPG  ->  "projects/rhythm-game-main"

import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { applyHomography, invertHomography, pitchHomography } from './homography.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'media-src');
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'content', 'media-manifest.json');
const WIDTHS = [640, 1200, 2000];
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

function keyFor(file) {
  const rel = path.relative(SRC, file);
  const noExt = rel.slice(0, rel.length - path.extname(rel).length);
  return noExt.split(path.sep).join('/').toLowerCase().replace(/[\s_]+/g, '-');
}

async function isFresh(source, target) {
  try {
    const [a, b] = await Promise.all([stat(source), stat(target)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

const files = (await walk(SRC)).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
const manifest = {};

for (const file of files.sort()) {
  const key = keyFor(file);
  const image = sharp(file, { failOn: 'none' }).rotate();
  const { width, height } = await image
    .clone()
    .toBuffer({ resolveWithObject: true })
    .then(({ info }) => info);

  const widths = WIDTHS.filter((w) => w < width);
  if (widths.length === 0 || widths.at(-1) < Math.min(width, WIDTHS.at(-1))) {
    widths.push(Math.min(width, WIDTHS.at(-1)));
  }

  const outDir = path.join(OUT, path.dirname(key));
  await mkdir(outDir, { recursive: true });

  const sources = [];
  for (const w of widths) {
    const name = `${path.basename(key)}-${w}.webp`;
    const target = path.join(outDir, name);
    if (!(await isFresh(file, target))) {
      await image.clone().resize({ width: w }).webp({ quality: 78 }).toFile(target);
    }
    sources.push({ w, src: `/media/${path.dirname(key)}/${name}`.replace('/./', '/') });
  }

  const tiny = await image.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

  manifest[key] = {
    width,
    height,
    sources,
    placeholder: `data:image/webp;base64,${tiny.toString('base64')}`,
  };
  console.log(`${key.padEnd(44)} ${width}×${height}  → ${widths.join(', ')}`);
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\n${Object.keys(manifest).length} images → ${path.relative(ROOT, MANIFEST)}`);

// Lab scene objects made from real photos and renders. Each one produces two files:
//   <name>-cut.webp    the object itself, background removed (toned in the browser)
//   <name>-xray.webp   a radiograph-style plate: edges bright, material as soft density
// The background is removed either with a traced polygon (`polygon`, in the
// coordinates of a `ref`-wide copy of the photo) or, for renders on white, by
// flood-filling the white that touches the border (`white`).
// `straighten` corrects part of a phone photo's camera tilt (a rotation of the
// camera, the same correction as a lens shift), so its verticals don't lean
// against the room's. Where each photo ends up is written to
// src/components/lab/stations/cutouts.json for the stations' traced internals.
const CUTOUTS = [
  {
    name: 'rhythm-game',
    source: 'projects/rhythm-game-main.jpg',
    ref: 1200,
    scale: 1.25,
    straighten: { focal: 850, pitch: -0.28, roll: -0.03 },
    polygon: '200,114 684,64 697,68 697,224 992,290 996,300 910,556 586,862 576,856 312,588 244,294 215,236 206,170',
    density: { edge: 2.6, fill: 0.1, dark: 0.1, blur: 1.4, floor: 0.12 },
  },
  {
    name: 'gearbox',
    source: 'projects/gearbox.png',
    crop: { left: 60, top: 30, width: 930, height: 900 },
    width: 800,
    white: true,
    density: { edge: 2.2, fill: 0.08, dark: 0.55 },
  },
];

const ICE = [223, 247, 255];

function floodWhite(rgb, w, h, threshold = 244) {
  const bg = new Uint8Array(w * h);
  const stack = [];
  const isWhite = (i) => rgb[i * 3] >= threshold && rgb[i * 3 + 1] >= threshold && rgb[i * 3 + 2] >= threshold;
  for (let x = 0; x < w; x += 1) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y += 1) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !isWhite(i)) continue;
    bg[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  const alpha = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i += 1) alpha[i] = bg[i] ? 0 : 255;
  return alpha;
}

async function polygonAlpha(points, w, h) {
  const list = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><polygon points="${list}" fill="#fff"/></svg>`;
  return sharp(Buffer.from(svg)).blur(0.7).extractChannel(0).raw().toBuffer();
}

/** Resample `src` (w×h RGB) through H⁻¹ into an output box; coordinates in ref units × k. */
function warp(src, sw, sh, Hinv, box, k) {
  const ow = Math.round(box.w * k);
  const oh = Math.round(box.h * k);
  const out = Buffer.alloc(ow * oh * 3);
  for (let y = 0; y < oh; y += 1) {
    for (let x = 0; x < ow; x += 1) {
      const [rx, ry] = applyHomography(Hinv, [box.x + x / k, box.y + y / k]);
      const sx = rx * k;
      const sy = ry * k;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      if (x0 < 0 || y0 < 0 || x0 >= sw - 1 || y0 >= sh - 1) continue;
      const fx = sx - x0;
      const fy = sy - y0;
      for (let ch = 0; ch < 3; ch += 1) {
        const i = (y0 * sw + x0) * 3 + ch;
        const top = src[i] * (1 - fx) + src[i + 3] * fx;
        const bot = src[i + sw * 3] * (1 - fx) + src[i + sw * 3 + 3] * fx;
        out[(y * ow + x) * 3 + ch] = top * (1 - fy) + bot * fy;
      }
    }
  }
  return { data: out, width: ow, height: oh };
}

const placements = {};

for (const c of CUTOUTS) {
  const file = path.join(SRC, c.source);
  const cutTarget = path.join(OUT, 'lab', `${c.name}-cut.webp`);
  const xrayTarget = path.join(OUT, 'lab', `${c.name}-xray.webp`);
  await mkdir(path.dirname(cutTarget), { recursive: true });

  let rgb;
  let w;
  let h;
  let alpha;
  if (c.polygon) {
    const k = c.scale;
    const meta = await sharp(file).rotate().metadata();
    const refH = (c.ref * (meta.orientation >= 5 ? meta.width : meta.height)) / (meta.orientation >= 5 ? meta.height : meta.width);
    const H = c.straighten ? pitchHomography({ ...c.straighten, cx: c.ref / 2, cy: refH / 2 }) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const poly = c.polygon.split(' ').map((p) => applyHomography(H, p.split(',').map(Number)));
    const xs = poly.map((p) => p[0]);
    const ys = poly.map((p) => p[1]);
    const box = { x: Math.floor(Math.min(...xs)) - 4, y: Math.floor(Math.min(...ys)) - 4 };
    box.w = Math.ceil(Math.max(...xs)) + 4 - box.x;
    box.h = Math.ceil(Math.max(...ys)) + 4 - box.y;
    placements[c.name] = { H: H.map((v) => +v.toPrecision(9)), box };
    if ((await isFresh(file, cutTarget)) && (await isFresh(file, xrayTarget))) continue;
    const src = await sharp(file, { failOn: 'none' }).rotate().resize({ width: Math.round(c.ref * k) }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = warp(src.data, src.info.width, src.info.height, invertHomography(H), box, k);
    ({ data: rgb, width: w, height: h } = out);
    alpha = await polygonAlpha(poly.map(([x, y]) => [(x - box.x) * k, (y - box.y) * k]), w, h);
  } else {
    if ((await isFresh(file, cutTarget)) && (await isFresh(file, xrayTarget))) continue;
    const out = await sharp(file, { failOn: 'none' }).extract(c.crop).resize({ width: c.width }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    ({ data: rgb } = out);
    ({ width: w, height: h } = out.info);
    alpha = floodWhite(rgb, w, h);
  }



  const cut = Buffer.alloc(w * h * 4);
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    cut[i * 4] = rgb[i * 3];
    cut[i * 4 + 1] = rgb[i * 3 + 1];
    cut[i * 4 + 2] = rgb[i * 3 + 2];
    cut[i * 4 + 3] = alpha[i];
    lum[i] = (0.2126 * rgb[i * 3] + 0.7152 * rgb[i * 3 + 1] + 0.0722 * rgb[i * 3 + 2]) / 255;
  }
  await sharp(cut, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 80, alphaQuality: 90 }).toFile(cutTarget);

  // Radiograph: Sobel edge strength (where walls are seen edge-on, a real X-ray is
  // brightest) over a soft fill, plus extra density for dark material.
  // Grain in wood and paper would read as noise, so edges come from a blurred copy
  // and anything under `floor` is dropped.
  const { edge, fill, dark, blur = 0, floor = 0 } = c.density;
  const soft = blur
    ? new Float32Array(await sharp(rgb, { raw: { width: w, height: h, channels: 3 } }).greyscale().blur(blur).raw().toBuffer()).map((v) => v / 255)
    : lum;
  const xray = Buffer.alloc(w * h * 4);
  const at = (x, y) => soft[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      const gx = at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const gy = at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      const raw = Math.hypot(gx, gy) * edge * 0.25;
      const e = Math.min(1, Math.max(0, raw - floor) / (1 - floor));
      const d = Math.min(1, fill + e + (1 - lum[i]) * dark);
      const a = Math.round(d * alpha[i]);
      xray[i * 4] = ICE[0];
      xray[i * 4 + 1] = ICE[1];
      xray[i * 4 + 2] = ICE[2];
      xray[i * 4 + 3] = a;
    }
  }
  await sharp(xray, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 74, alphaQuality: 80 }).toFile(xrayTarget);
  console.log(`cutout lab/${c.name}-cut.webp + -xray.webp  ${w}×${h}`);
}

await writeFile(path.join(ROOT, 'src', 'components', 'lab', 'stations', 'cutouts.json'), `${JSON.stringify(placements, null, 2)}\n`);
