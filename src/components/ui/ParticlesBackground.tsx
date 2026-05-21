'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

function createSphere(pointCount: number) {
  const temp = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    temp[i * 3] = (Math.random() - 0.5) * 10;
    temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
    temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return temp;
}

function StarField({ pointCount, activeMotion }: { pointCount: number; activeMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => createSphere(pointCount), [pointCount]);

  useFrame((state, delta) => {
    if (!activeMotion) return;
    if (ref.current) {
      ref.current.rotation.x -= delta / 18;
      ref.current.rotation.y -= delta / 24;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
          transparent
          color="#56020a"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.45}
          />
      </Points>
    </group>
  );
}

export default function ParticlesBackground() {
  const profile = usePerformanceMode();

  if (!profile.canUseHeavyVisuals || profile.particleCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, profile.maxDpr]}
        frameloop={profile.canUseAmbientMotion ? 'always' : 'demand'}
        fallback={null}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <StarField
          pointCount={profile.particleCount}
          activeMotion={profile.canUseAmbientMotion}
        />
      </Canvas>
    </div>
  );
}
