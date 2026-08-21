'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RefractiveGlassCardProps {
  isActive: boolean;
}

export function RefractiveGlassCard({ isActive }: RefractiveGlassCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Dynamic target values for interpolation (LERP)
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));
  const targetOpacity = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate positions & rotations to prevent harsh jumps
    if (isActive) {
      targetPos.current.set(0, 0.4, 1.2); // Positioned slightly in front of the galaxy cluster
      targetRot.current.set(0, 0, 0);
      targetOpacity.current = 0.92;
    } else {
      // Demo Mode: Float card away far below the camera viewport
      targetPos.current.set(0, -12, -4);
      targetRot.current.set(Math.PI * 0.45, Math.PI * 0.1, 0);
      targetOpacity.current = 0.0;
    }

    // Damp calculations for spring-like organic movement
    meshRef.current.position.lerp(targetPos.current, delta * 3.5);
    
    // Euler angles rotation interpolation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRot.current.x, delta * 3.5);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRot.current.y, delta * 3.5);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRot.current.z, delta * 3.5);

    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (mat) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity.current, delta * 4.0);
      // Disable rendering entirely if invisible to optimize WebGL pipeline
      meshRef.current.visible = mat.opacity > 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -12, -4]} castShadow receiveShadow>
      {/* 16:9 Proportional volumetric curved box geometry */}
      <boxGeometry args={[10.5, 6.0, 0.15]} />
      <meshPhysicalMaterial
        color="#080a12"            // Dark high-contrast tint to isolate overlay text
        transmission={0.88}        // Warp the background galaxy particles
        roughness={0.16}           // Smooth volumetric glass frost
        thickness={1.4}            // Volumetric refraction depth distortion
        ior={1.45}                 // Real glass index of refraction
        iridescence={0.8}          // Soap-bubble colorful film coating
        iridescenceIOR={1.3}
        clearcoat={1.0}            // Polished surface layer highlight reflection
        clearcoatRoughness={0.04}
        transparent={true}
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}
