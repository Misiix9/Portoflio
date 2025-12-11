'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function StarField(props: any) {
  const ref = useRef<any>(null);
  
  // Generate random points in a sphere
  const [sphere, setSphere] = useState<Float32Array | null>(null);

  useEffect(() => {
    const temp = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
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
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
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
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
}
