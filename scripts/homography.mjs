// Projective transform helpers shared by the media build (to straighten photos)
// and the lab stations (to map points traced on the original photo into the
// straightened cutout).

/** 3×3 homography (row-major, h33 = 1) taking four `src` points onto `dst`. */
export function solveHomography(src, dst) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i += 1) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  for (let c = 0; c < 8; c += 1) {
    let p = c;
    for (let r = c + 1; r < 8; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r += 1) {
      if (r === c) continue;
      const k = A[r][c] / A[c][c];
      for (let j = c; j < 8; j += 1) A[r][j] -= k * A[c][j];
      b[r] -= k * b[c];
    }
  }
  return [...b.map((v, i) => v / A[i][i]), 1];
}

/** The homography of rotating a pinhole camera (focal length and centre in pixels). */
export function pitchHomography({ focal: f, pitch, roll = 0, cx, cy }) {
  const mul = (X, Y) => {
    const R = [];
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        let s = 0;
        for (let k = 0; k < 3; k += 1) s += X[i * 3 + k] * Y[k * 3 + j];
        R.push(s);
      }
    }
    return R;
  };
  const K = [f, 0, cx, 0, f, cy, 0, 0, 1];
  const Ki = [1 / f, 0, -cx / f, 0, 1 / f, -cy / f, 0, 0, 1];
  const c = Math.cos(pitch);
  const s = Math.sin(pitch);
  const cz = Math.cos(roll);
  const sz = Math.sin(roll);
  const Rx = [1, 0, 0, 0, c, -s, 0, s, c];
  const Rz = [cz, -sz, 0, sz, cz, 0, 0, 0, 1];
  const H = mul(K, mul(mul(Rz, Rx), Ki));
  return H.map((v) => v / H[8]);
}

export function applyHomography(H, [x, y]) {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
}

export function invertHomography(H) {
  const [a, b, c, d, e, f, g, h, i] = H;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const inv = [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map((v) => v / det);
  return inv.map((v) => v / inv[8]);
}
