import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';

const MODEL_URL = '/projects/four-bar/assembly.glb';

function AssemblyModel() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

useGLTF.preload(MODEL_URL);

export default function FourBarInteractive() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="border-b border-border-subtle px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          3D assembly · Assem_final
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          SolidWorks model - drag to orbit, scroll to zoom
        </p>
      </div>

      <div className="relative h-[min(72vh,560px)] w-full bg-[#0b0b0e]">
        <Canvas
          shadows
          camera={{ position: [0.35, 0.25, 0.45], fov: 40, near: 0.001, far: 100 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#0b0b0e']} />
          <ambientLight intensity={0.55} />
          <directionalLight
            castShadow
            position={[2, 4, 3]}
            intensity={1.25}
            shadow-mapSize={[1024, 1024]}
          />
          <Suspense
            fallback={
              <Html center>
                <p className="font-mono text-xs text-zinc-400">
                  Loading Assem_final…
                </p>
              </Html>
            }
          >
            <Bounds fit clip observe margin={1.25}>
              <AssemblyModel />
            </Bounds>
            <ContactShadows
              position={[0, -0.08, 0]}
              opacity={0.4}
              scale={1.2}
              blur={2.5}
              far={0.4}
            />
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan
            autoRotate
            autoRotateSpeed={0.6}
            dampingFactor={0.08}
          />
        </Canvas>
      </div>
    </div>
  );
}
