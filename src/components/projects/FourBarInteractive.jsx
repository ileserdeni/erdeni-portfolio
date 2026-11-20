import { useEffect, useMemo, useRef, useState } from 'react';

/** Crank-rocker lengths (relative). Grashof: s+l < p+q */
const LINKS = {
  crank: { len: 1.0, name: 'Quarter note', role: 'Crank' },
  coupler: { len: 2.4, name: 'Double eighth', role: 'Coupler' },
  rocker: { len: 1.8, name: 'Treble clef', role: 'Rocker' },
  ground: { len: 2.6, name: 'Bass clef', role: 'Ground' },
};

function solveFourBar(theta2) {
  const a = LINKS.crank.len;
  const b = LINKS.coupler.len;
  const c = LINKS.rocker.len;
  const d = LINKS.ground.len;

  const K1 = d / a;
  const K2 = d / c;
  const K3 = (a * a - b * b + c * c + d * d) / (2 * a * c);
  const A = Math.cos(theta2) - K1 - K2 * Math.cos(theta2) + K3;
  const B = -2 * Math.sin(theta2);
  const C = K1 - (K2 + 1) * Math.cos(theta2) + K3;
  const disc = B * B - 4 * A * C;
  if (disc < 0 || Math.abs(A) < 1e-9) return null;

  const theta4 = 2 * Math.atan((-B - Math.sqrt(disc)) / (2 * A));
  const theta3 = Math.atan2(
    c * Math.sin(theta4) - a * Math.sin(theta2),
    d + c * Math.cos(theta4) - a * Math.cos(theta2),
  );

  const O2 = { x: 0, y: 0 };
  const O4 = { x: d, y: 0 };
  const Apos = { x: a * Math.cos(theta2), y: a * Math.sin(theta2) };
  const Bpos = {
    x: O4.x + c * Math.cos(theta4),
    y: O4.y + c * Math.sin(theta4),
  };

  const transmission = Math.abs(
    Math.atan2(
      (Bpos.x - Apos.x) * (Bpos.y - O4.y) - (Bpos.y - Apos.y) * (Bpos.x - O4.x),
      (Bpos.x - Apos.x) * (Bpos.x - O4.x) + (Bpos.y - Apos.y) * (Bpos.y - O4.y),
    ),
  );

  return { O2, O4, A: Apos, B: Bpos, theta2, theta3, theta4, transmission };
}

function deg(rad) {
  return ((rad * 180) / Math.PI).toFixed(1);
}

export default function FourBarInteractive() {
  const [angleDeg, setAngleDeg] = useState(35);
  const [playing, setPlaying] = useState(true);
  const raf = useRef(0);

  useEffect(() => {
    if (!playing) return undefined;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setAngleDeg((prev) => (prev + dt * 48) % 360);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const pose = useMemo(
    () => solveFourBar((angleDeg * Math.PI) / 180),
    [angleDeg],
  );

  const W = 640;
  const H = 360;
  const scale = 78;
  const ox = 150;
  const oy = 250;

  const map = (p) => ({ x: ox + p.x * scale, y: oy - p.y * scale });

  if (!pose) {
    return (
      <div className="rounded-xl border border-border bg-surface-raised p-6 text-sm text-muted">
        Linkage pose undefined at this crank angle (branch cut). Nudge the slider.
      </div>
    );
  }

  const O2 = map(pose.O2);
  const O4 = map(pose.O4);
  const A = map(pose.A);
  const B = map(pose.B);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Interactive kinematic model
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Musical-note 4-bar — drag the crank or press play
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-accent/50 hover:text-accent"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full bg-[#0c0c0f]"
        role="img"
        aria-label="Animated four-bar linkage"
      >
        <defs>
          <marker
            id="joint"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
          >
            <circle cx="3" cy="3" r="2.5" fill="#09090b" stroke="#60a5fa" />
          </marker>
        </defs>

        {/* ground */}
        <line
          x1={O2.x}
          y1={O2.y}
          x2={O4.x}
          y2={O4.y}
          stroke="#3f3f46"
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        <line
          x1={O2.x - 28}
          y1={O2.y + 10}
          x2={O4.x + 28}
          y2={O4.y + 10}
          stroke="#27272a"
          strokeWidth="8"
        />

        {/* coupler */}
        <line
          x1={A.x}
          y1={A.y}
          x2={B.x}
          y2={B.y}
          stroke="#a78bfa"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* rocker */}
        <line
          x1={O4.x}
          y1={O4.y}
          x2={B.x}
          y2={B.y}
          stroke="#34d399"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* crank */}
        <line
          x1={O2.x}
          y1={O2.y}
          x2={A.x}
          y2={A.y}
          stroke="#60a5fa"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {[O2, O4, A, B].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#09090b"
            stroke="#e4e4e7"
            strokeWidth="1.5"
          />
        ))}

        <text x={O2.x - 8} y={O2.y + 28} fill="#71717a" fontSize="11" fontFamily="ui-monospace, monospace">
          O₂
        </text>
        <text x={O4.x - 8} y={O4.y + 28} fill="#71717a" fontSize="11" fontFamily="ui-monospace, monospace">
          O₄
        </text>
        <text x={A.x + 10} y={A.y - 8} fill="#93c5fd" fontSize="11" fontFamily="ui-monospace, monospace">
          A · quarter
        </text>
        <text x={B.x + 10} y={B.y - 8} fill="#6ee7b7" fontSize="11" fontFamily="ui-monospace, monospace">
          B · treble
        </text>
        <text
          x={(A.x + B.x) / 2}
          y={(A.y + B.y) / 2 - 12}
          fill="#c4b5fd"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
        >
          coupler · eighths
        </text>
      </svg>

      <div className="space-y-3 border-t border-border-subtle px-4 py-4">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Crank angle θ₂
          </span>
          <input
            type="range"
            min={0}
            max={359}
            value={Math.round(angleDeg)}
            onChange={(e) => {
              setPlaying(false);
              setAngleDeg(Number(e.target.value));
            }}
            className="w-full accent-sky-400"
          />
        </label>

        <div className="grid gap-2 font-mono text-[11px] text-zinc-500 sm:grid-cols-3">
          <p>
            θ₂ = <span className="text-zinc-300">{deg(pose.theta2)}°</span>
          </p>
          <p>
            θ₃ = <span className="text-zinc-300">{deg(pose.theta3)}°</span>
          </p>
          <p>
            θ₄ = <span className="text-zinc-300">{deg(pose.theta4)}°</span>
          </p>
          <p className="sm:col-span-3">
            Transmission angle ≈{' '}
            <span className="text-zinc-300">
              {deg(pose.transmission)}°
            </span>{' '}
            · Grashof crank-rocker (s+ℓ ={' '}
            {(LINKS.crank.len + LINKS.ground.len).toFixed(1)} &lt; p+q ={' '}
            {(LINKS.coupler.len + LINKS.rocker.len).toFixed(1)})
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {Object.values(LINKS).map((link) => (
            <span
              key={link.name}
              className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-zinc-500"
            >
              {link.role}: {link.name} (L={link.len})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
