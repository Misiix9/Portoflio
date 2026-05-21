'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

// A custom geometry or just a simple Cylinder with low radial segments helps mimic a prism
// Prism: Cylinder with 3 radial segments

// Inner content (The Identity)
function IdentityMesh() {
    // Placeholder texture - in real app would use user photo
    // For now we use a simple color/noise shader or just a box
    return (
        <mesh rotation={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
            <boxGeometry />
            <meshStandardMaterial color="#56020a" emissive="#56020a" emissiveIntensity={0.5} roughness={0.5} />
        </mesh>
    )
}

function Prism({ onHover }: { onHover: (hover: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
        {/* The Glass Prism */}
        <Float floatIntensity={2} rotationIntensity={1}>
            <mesh 
                ref={meshRef} 
                onPointerOver={() => onHover(true)} 
                onPointerOut={() => onHover(false)}
                rotation={[0, 0, 0]} 
            >
                {/* Octahedron or Icosahedron looks more "crystal" like */}
                <icosahedronGeometry args={[1.5, 0]} /> 
                <MeshTransmissionMaterial 
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0.0}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.1}
                    anisotropy={0.1}
                    distortion={0.5}
                    distortionScale={0.3}
                    temporalDistortion={0.1}
                    background={new THREE.Color('#0a0a0a')}
                    color="#ffffff"
                />
            </mesh>
        </Float>
        
        {/* The Inner Identity (Stable inside) */}
        <Center>
             <IdentityMesh />
        </Center>
    </group>
  );
}

export default function IdentityPrism() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <ambientLight intensity={0.5} />
        
        <group>
            <Prism onHover={() => {}} />
            {/* Floating Text inside or behind? */}
            {/* <InnerText /> */}
        </group>
      </Canvas>
    </div>
  );
}
