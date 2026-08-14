'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NoiseWaveSphereProps {
  radius?: number;
  pointCount?: number;
}

// Low-frequency gentle micro-wave displacement that keeps the spherical silhouette stable
function getOrganicDisplacement(x: number, y: number, z: number, time: number): number {
  const wave1 = Math.sin(x * 1.6 + time * 0.5) * Math.cos(y * 1.6 + time * 0.4) * Math.sin(z * 1.6 + time * 0.35);
  const gentleTwitch = Math.pow(Math.sin(time * 0.6), 6) * 0.035;
  const wave2 = Math.sin(x * 3.2 - time * 0.8) * Math.cos(z * 3.2 + time * 0.7) * (0.02 + gentleTwitch);
  const wave3 = Math.sin((x * 4.5 + y * 4.5 + z * 4.5) + time * 1.0) * 0.015;

  return (wave1 * 0.035 + wave2 + wave3);
}

export function NoiseWaveSphere({
  radius = 2.1,
  pointCount = 2700, // Increased by 50% for dense, rich, tightly-packed particle distribution
}: NoiseWaveSphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate 2,700 irregularly scattered points distributed organically across the 3D sphere
  const { basePositions, pointJitters, pointSizes } = useMemo(() => {
    const coords: number[] = [];
    const jitters: number[] = [];
    const sizes: number[] = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = 2 * Math.PI * i / goldenRatio;
      
      const jitterAngle = Math.sin(i * 13.37) * 0.045 + Math.cos(i * 7.77) * 0.035;
      const jitterY = Math.sin(i * 23.45) * 0.025;

      const finalY = Math.max(-0.99, Math.min(0.99, y + jitterY));
      const finalRadiusAtY = Math.sqrt(Math.max(0, 1 - finalY * finalY));
      const finalTheta = theta + jitterAngle;

      const x = Math.cos(finalTheta) * finalRadiusAtY;
      const z = Math.sin(finalTheta) * finalRadiusAtY;

      const len = Math.sqrt(x * x + finalY * finalY + z * z);
      const nx = x / len;
      const ny = finalY / len;
      const nz = z / len;

      coords.push(nx, ny, nz);
      jitters.push((i * 0.17) % (Math.PI * 2));
      sizes.push(0.018 + Math.abs(Math.sin(i * 3.14)) * 0.014);
    }

    return {
      basePositions: new Float32Array(coords),
      pointJitters: new Float32Array(jitters),
      pointSizes: new Float32Array(sizes),
    };
  }, [pointCount]);

  const [currentPositions, currentColors] = useMemo(() => {
    const pos = new Float32Array(basePositions.length);
    const col = new Float32Array(basePositions.length);
    pos.set(basePositions);
    return [pos, col];
  }, [basePositions]);

  // Color palette: deep ocean -> luminous cyan -> soft highlight
  const peakColor = useMemo(() => new THREE.Color('#38bdf8'), []);
  const valleyColor = useMemo(() => new THREE.Color('#0284c7'), []);
  const highlightColor = useMemo(() => new THREE.Color('#e0f2fe'), []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.07;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.00012) * 0.04;
    groupRef.current.rotation.z = Math.cos(Date.now() * 0.00010) * 0.03;

    const time = Date.now() * 0.0008;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;

    if (!posAttr || !colAttr) return;

    const positions = posAttr.array as Float32Array;
    const colors = colAttr.array as Float32Array;

    for (let i = 0; i < pointCount; i++) {
      const idx = i * 3;
      const nx = basePositions[idx];
      const ny = basePositions[idx + 1];
      const nz = basePositions[idx + 2];
      const phase = pointJitters[i];

      const displacement = getOrganicDisplacement(nx, ny, nz, time + phase * 0.05);
      const r = radius * (1 + displacement);

      positions[idx] = nx * r;
      positions[idx + 1] = ny * r;
      positions[idx + 2] = nz * r;

      const norm = (displacement + 0.05) / 0.10;
      const clampedNorm = Math.max(0, Math.min(1, norm));

      let rC: number, gC: number, bC: number;
      if (clampedNorm > 0.65) {
        const t = (clampedNorm - 0.65) / 0.35;
        rC = peakColor.r + (highlightColor.r - peakColor.r) * t;
        gC = peakColor.g + (highlightColor.g - peakColor.g) * t;
        bC = peakColor.b + (highlightColor.b - peakColor.b) * t;
      } else {
        const t = clampedNorm / 0.65;
        rC = valleyColor.r + (peakColor.r - valleyColor.r) * t;
        gC = valleyColor.g + (peakColor.g - valleyColor.g) * t;
        bC = valleyColor.b + (peakColor.b - valleyColor.b) * t;
      }

      colors[idx] = rC;
      colors[idx + 1] = gC;
      colors[idx + 2] = bC;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[currentColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.026}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
