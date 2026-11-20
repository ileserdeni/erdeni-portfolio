import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import {
  Bounds,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import partsMeta from '../../data/fourBarParts.json';

/**
 * Pin-hole spacing measured on the SolidWorks DXF laser exports from Assem_final.
 * Shortest link = crank (double eighth). Longest = ground (bass).
 */
const LINK = {
  crank: { key: 'eighth', color: '#7dd3fc', name: 'Double eighth · crank' },
  coupler: { key: 'quarter', color: '#c4b5fd', name: 'Quarter note · coupler' },
  rocker: { key: 'treble', color: '#6ee7b7', name: 'Treble clef · rocker' },
  ground: { key: 'bass', color: '#a1a1aa', name: 'Bass clef · ground' },
};

const LEN = {
  crank: partsMeta.eighth.length,
  coupler: partsMeta.quarter.length,
  rocker: partsMeta.treble.length,
  ground: partsMeta.bass.length,
};

const THICK = 3.2;

function solveFourBar(theta2) {
  const a = LEN.crank;
  const b = LEN.coupler;
  const c = LEN.rocker;
  const d = LEN.ground;

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

  const O2 = new THREE.Vector3(0, 0, 0);
  const O4 = new THREE.Vector3(d, 0, 0);
  const Ap = new THREE.Vector3(a * Math.cos(theta2), a * Math.sin(theta2), 0);
  const Bp = new THREE.Vector3(
    O4.x + c * Math.cos(theta4),
    O4.y + c * Math.sin(theta4),
    0,
  );
  return { O2, O4, A: Ap, B: Bp, theta2, theta3, theta4 };
}

function buildExtrusion(svgData) {
  const shapes = [];
  svgData.paths.forEach((path) => {
    SVGLoader.createShapes(path).forEach((s) => shapes.push(s));
  });
  if (!shapes.length) return null;

  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth: THICK,
    bevelEnabled: false,
  });
  // SVG Y grows down; flip so plates sit upright in XY
  geom.scale(1, -1, 1);
  geom.computeVertexNormals();
  return geom;
}

function LinkPlate({ partKey, color, origin, tip, z }) {
  const meta = partsMeta[partKey];
  const svgData = useLoader(SVGLoader, `/projects/four-bar/${meta.file}`);
  const geom = useMemo(() => buildExtrusion(svgData), [svgData]);

  const { angle, p0 } = useMemo(() => {
    const h0 = meta.holes_svg[0];
    const h1 = meta.holes_svg[1];
    // After Y-flip, SVG (x,y) → geom (x, -y)
    const local0 = new THREE.Vector2(h0.x, -h0.y);
    const local1 = new THREE.Vector2(h1.x, -h1.y);
    const localDir = local1.clone().sub(local0).normalize();
    const worldDir = new THREE.Vector2(tip.x - origin.x, tip.y - origin.y).normalize();
    return {
      angle:
        Math.atan2(worldDir.y, worldDir.x) -
        Math.atan2(localDir.y, localDir.x),
      p0: local0,
    };
  }, [meta, origin, tip]);

  if (!geom) return null;

  return (
    <group position={[origin.x, origin.y, z]} rotation={[0, 0, angle]}>
      <mesh
        geometry={geom}
        position={[-p0.x, -p0.y, -THICK / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.18}
          roughness={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function PivotPin({ position, z = THICK }) {
  return (
    <mesh
      position={[position.x, position.y, z]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    >
      <cylinderGeometry args={[2.15, 2.15, THICK * 2.6, 20]} />
      <meshStandardMaterial color="#e4e4e7" metalness={0.85} roughness={0.22} />
    </mesh>
  );
}

function LinkageModel({ angleDeg }) {
  const pose = useMemo(
    () => solveFourBar((angleDeg * Math.PI) / 180),
    [angleDeg],
  );

  if (!pose) {
    return (
      <Html center>
        <p className="rounded-md bg-black/70 px-3 py-2 font-mono text-xs text-zinc-300">
          Pose undefined at this crank angle
        </p>
      </Html>
    );
  }

  return (
    <group rotation={[-0.9, 0.15, 0.05]} position={[-LEN.ground * 0.45, -10, 0]}>
      <LinkPlate
        partKey={LINK.ground.key}
        color={LINK.ground.color}
        origin={pose.O2}
        tip={pose.O4}
        z={-THICK * 1.15}
      />
      <LinkPlate
        partKey={LINK.crank.key}
        color={LINK.crank.color}
        origin={pose.O2}
        tip={pose.A}
        z={0}
      />
      <LinkPlate
        partKey={LINK.rocker.key}
        color={LINK.rocker.color}
        origin={pose.O4}
        tip={pose.B}
        z={0}
      />
      <LinkPlate
        partKey={LINK.coupler.key}
        color={LINK.coupler.color}
        origin={pose.A}
        tip={pose.B}
        z={THICK * 1.2}
      />
      <PivotPin position={pose.O2} />
      <PivotPin position={pose.O4} />
      <PivotPin position={pose.A} />
      <PivotPin position={pose.B} />
    </group>
  );
}

function deg(rad) {
  return ((rad * 180) / Math.PI).toFixed(1);
}

export default function FourBarInteractive() {
  const [angleDeg, setAngleDeg] = useState(35);
  const [playing, setPlaying] = useState(true);
  const pose = useMemo(
    () => solveFourBar((angleDeg * Math.PI) / 180),
    [angleDeg],
  );

  useEffect(() => {
    if (!playing) return undefined;
    let last = performance.now();
    let id = 0;
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setAngleDeg((prev) => (prev + dt * 36) % 360);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            3D model · Assem_final
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            SolidWorks laser-cut profiles extruded to plate stock — orbit with the mouse
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

      <div className="relative h-[min(72vh,560px)] w-full bg-[#0b0b0e]">
        <Canvas
          shadows
          camera={{ position: [160, 120, 210], fov: 38, near: 0.1, far: 4000 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0b0b0e']} />
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[140, 220, 100]}
            intensity={1.2}
            shadow-mapSize={[1024, 1024]}
          />
          <Suspense
            fallback={
              <Html center>
                <p className="font-mono text-xs text-zinc-400">
                  Loading SolidWorks profiles…
                </p>
              </Html>
            }
          >
            <Bounds fit clip observe margin={1.4}>
              <LinkageModel angleDeg={angleDeg} />
            </Bounds>
            <ContactShadows
              position={[0, -55, 0]}
              opacity={0.4}
              scale={320}
              blur={2.8}
              far={120}
            />
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls makeDefault enablePan dampingFactor={0.08} />
        </Canvas>
      </div>

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
            θ₂ ={' '}
            <span className="text-zinc-300">{pose ? deg(pose.theta2) : '—'}°</span>
          </p>
          <p>
            θ₃ ={' '}
            <span className="text-zinc-300">{pose ? deg(pose.theta3) : '—'}°</span>
          </p>
          <p>
            θ₄ ={' '}
            <span className="text-zinc-300">{pose ? deg(pose.theta4) : '—'}°</span>
          </p>
          <p className="sm:col-span-3">
            Geometry from Assem_final DXFs — pin spacing crank {LEN.crank.toFixed(1)}{' '}
            mm · coupler {LEN.coupler.toFixed(1)} mm · rocker {LEN.rocker.toFixed(1)}{' '}
            mm · ground {LEN.ground.toFixed(1)} mm
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Object.values(LINK).map((link) => (
            <span
              key={link.name}
              className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-zinc-500"
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ background: link.color }}
              />
              {link.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
