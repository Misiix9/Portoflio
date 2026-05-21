'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Icosahedron, Float } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

function DigitalHead({ activeMotion }: { activeMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!activeMotion) return;
    if (!ref.current) return;
    
    // Look at mouse
    const x = (state.pointer.x * Math.PI) / 4;
    const y = (state.pointer.y * Math.PI) / 4;
    
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, x, 0.1);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -y, 0.1);

    // Glitch jitter on hover
    if (hovered) {
         ref.current.position.x = (Math.random() - 0.5) * 0.1;
         ref.current.position.y = (Math.random() - 0.5) * 0.1;
    } else {
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, 0, delta * 6);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, delta * 6);
    }
  });

  const mesh = (
    <Icosahedron
        args={[1, 1]} 
        ref={ref}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={2.5}
      >
        <meshStandardMaterial 
            color="#56020a" 
            wireframe 
            emissive="#56020a"
            emissiveIntensity={hovered ? 2 : 0.5}
        />
      </Icosahedron>
  );

  if (!activeMotion) {
    return mesh;
  }

  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.35}>
      {mesh}
    </Float>
  );
}

export default function Avatar3D() {
  const profile = usePerformanceMode();
  const activeMotion = profile.mode === 'full' && profile.canUseAmbientMotion;

  if (!profile.canUseHeavyVisuals) {
    return null;
  }

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, profile.maxDpr]}
        frameloop={activeMotion ? 'always' : 'demand'}
        fallback={null}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: activeMotion ? 'high-performance' : 'low-power',
        }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={5} />
        <DigitalHead activeMotion={activeMotion} />
      </Canvas>
    </div>
  );
}
