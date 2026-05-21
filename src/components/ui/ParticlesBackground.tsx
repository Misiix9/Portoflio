'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const POINT_COUNT = 1600;

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points in a sphere
  const [sphere, setSphere] = useState<Float32Array | null>(null);

  useEffect(() => {
    const temp = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        temp[i*3] = x;
        temp[i*3+1] = y;
        temp[i*3+2] = z;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSphere(temp);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {sphere && (
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial
            transparent
            color="#56020a"
            size={0.02}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.5}
            />
        </Points>
      )}
    </group>
  );
}

export default function ParticlesBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setIsEnabled(query.matches && !shouldReduceMotion);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [shouldReduceMotion]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.25]}>
        <StarField />
      </Canvas>
    </div>
  );
}
