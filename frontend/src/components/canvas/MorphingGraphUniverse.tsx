'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GraphSystemState } from '@/types/graph';

interface MorphingGraphUniverseProps {
  state: GraphSystemState;
  pointCount?: number;
}

// Low-frequency gentle micro-wave displacement that keeps the spherical silhouette stable
function getOrganicDisplacement(x: number, y: number, z: number, time: number): number {
  const wave1 = Math.sin(x * 1.6 + time * 0.5) * Math.cos(y * 1.6 + time * 0.4) * Math.sin(z * 1.6 + time * 0.35);
  const gentleTwitch = Math.pow(Math.sin(time * 0.6), 6) * 0.035;
  const wave2 = Math.sin(x * 3.2 - time * 0.8) * Math.cos(z * 3.2 + time * 0.7) * (0.02 + gentleTwitch);
  const wave3 = Math.sin((x * 4.5 + y * 4.5 + z * 4.5) + time * 1.0) * 0.015;
  return wave1 * 0.035 + wave2 + wave3;
}

export function MorphingGraphUniverse({
  state,
  pointCount = 5000,
}: MorphingGraphUniverseProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Precompute 3D Target Coordinate Layouts (Sphere vs Galaxy)
  const { spherePositions, galaxyPositions, pointJitters } = useMemo(() => {
    const sPos = new Float32Array(pointCount * 3);
    const gPos = new Float32Array(pointCount * 3);
    const jitters = new Float32Array(pointCount);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const sphereRadius = 2.1;
    const numArms = 5; // 5 Civil Act chapters (총칙, 물권, 채권, 친족, 상속)

    for (let i = 0; i < pointCount; i++) {
      // 1. Sphere Layout (Fibonacci sphere with organic scatter)
      const y = 1 - (i / (pointCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = 2 * Math.PI * i / goldenRatio;
      const jAngle = Math.sin(i * 13.37) * 0.045 + Math.cos(i * 7.77) * 0.035;
      const jY = Math.sin(i * 23.45) * 0.025;

      const finalY = Math.max(-0.99, Math.min(0.99, y + jY));
      const finalRadiusAtY = Math.sqrt(Math.max(0, 1 - finalY * finalY));
      const finalTheta = theta + jAngle;

      const sx = Math.cos(finalTheta) * finalRadiusAtY * sphereRadius;
      const sy = finalY * sphereRadius;
      const sz = Math.sin(finalTheta) * finalRadiusAtY * sphereRadius;

      sPos[i * 3] = sx;
      sPos[i * 3 + 1] = sy;
      sPos[i * 3 + 2] = sz;

      // 2. Galaxy Network Layout (Logarithmic 5-arm spiral disk)
      const armIndex = i % numArms;
      const armAngleOffset = (armIndex * 2 * Math.PI) / numArms;
      const distanceFraction = Math.pow(Math.random(), 0.7);
      const galaxyRadius = 0.5 + distanceFraction * 6.5;
      const spiralAngle = armAngleOffset + distanceFraction * 4.5;
      
      const spreadX = (Math.random() - 0.5) * (0.3 + distanceFraction * 0.8);
      const spreadY = (Math.random() - 0.5) * (0.2 + distanceFraction * 0.4);
      const spreadZ = (Math.random() - 0.5) * (0.3 + distanceFraction * 0.8);

      const gx = Math.cos(spiralAngle) * galaxyRadius + spreadX;
      const gy = spreadY;
      const gz = Math.sin(spiralAngle) * galaxyRadius + spreadZ;

      gPos[i * 3] = gx;
      gPos[i * 3 + 1] = gy;
      gPos[i * 3 + 2] = gz;

      jitters[i] = (i * 0.17) % (Math.PI * 2);
    }

    return {
      spherePositions: sPos,
      galaxyPositions: gPos,
      pointJitters: jitters,
    };
  }, [pointCount]);

  // Current interpolated positions and colors buffers
  const [currentPositions, currentColors] = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    const col = new Float32Array(pointCount * 3);
    pos.set(spherePositions);
    return [pos, col];
  }, [spherePositions, pointCount]);

  // Color constants
  const cyanPeak = useMemo(() => new THREE.Color('#38bdf8'), []);
  const cyanValley = useMemo(() => new THREE.Color('#0284c7'), []);
  const galaxyArmPalette = useMemo(
    () => [
      new THREE.Color('#38bdf8'), // 총칙: Cyan
      new THREE.Color('#818cf8'), // 물권: Indigo
      new THREE.Color('#a855f7'), // 채권: Purple
      new THREE.Color('#34d399'), // 친족: Emerald
      new THREE.Color('#fbbf24'), // 상속: Amber
    ],
    []
  );

  const morphProgress = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current || !groupRef.current) return;

    const time = Date.now() * 0.0008;
    const isGalaxy = state === 'STATE_GALAXY_VIEW';
    const isBenchmark = state === 'STATE_BENCHMARK_RADAR';

    // Interpolate morph target (0 for sphere, 1 for galaxy)
    const targetProgress = isGalaxy ? 1.0 : 0.0;
    morphProgress.current = THREE.MathUtils.damp(
      morphProgress.current,
      targetProgress,
      4.0,
      delta
    );
    const progress = morphProgress.current;

    // Rotation control
    if (isGalaxy) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0.45, 2.0, delta);
    } else if (isBenchmark) {
      groupRef.current.rotation.y += delta * 0.02;
    } else {
      // IDLE: Serene continuous rotation
      groupRef.current.rotation.y += delta * 0.07;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00012) * 0.04;
      groupRef.current.rotation.z = Math.cos(Date.now() * 0.00010) * 0.03;
    }

    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    if (!posAttr || !colAttr) return;

    const positions = posAttr.array as Float32Array;
    const colors = colAttr.array as Float32Array;

    for (let i = 0; i < pointCount; i++) {
      const idx = i * 3;
      const phase = pointJitters[i];

      const sx = spherePositions[idx];
      const sy = spherePositions[idx + 1];
      const sz = spherePositions[idx + 2];
      const sDisplacement = getOrganicDisplacement(sx, sy, sz, time + phase * 0.05);
      const curSphereRadiusMult = 1 + sDisplacement;

      const targetSX = sx * curSphereRadiusMult;
      const targetSY = sy * curSphereRadiusMult;
      const targetSZ = sz * curSphereRadiusMult;

      const targetGX = galaxyPositions[idx];
      const targetGY = galaxyPositions[idx + 1];
      const targetGZ = galaxyPositions[idx + 2];

      const targetX = THREE.MathUtils.lerp(targetSX, targetGX, progress);
      const targetY = THREE.MathUtils.lerp(targetSY, targetGY, progress);
      const targetZ = THREE.MathUtils.lerp(targetSZ, targetGZ, progress);

      positions[idx] = THREE.MathUtils.damp(positions[idx], targetX, 5.0, delta);
      positions[idx + 1] = THREE.MathUtils.damp(positions[idx + 1], targetY, 5.0, delta);
      positions[idx + 2] = THREE.MathUtils.damp(positions[idx + 2], targetZ, 5.0, delta);

      // Color mapping
      let targetR = 0;
      let targetG = 0;
      let targetB = 0;

      if (isGalaxy) {
        const armColor = galaxyArmPalette[i % 5];
        targetR = armColor.r;
        targetG = armColor.g;
        targetB = armColor.b;
      } else if (isBenchmark) {
        targetR = 0.05;
        targetG = 0.15;
        targetB = 0.25;
      } else {
        const norm = (sDisplacement + 0.05) / 0.10;
        const clampedNorm = Math.max(0, Math.min(1, norm));
        targetR = clampedNorm > 0.65 ? cyanPeak.r : cyanValley.r;
        targetG = clampedNorm > 0.65 ? cyanPeak.g : cyanValley.g;
        targetB = clampedNorm > 0.65 ? cyanPeak.b : cyanValley.b;
      }

      colors[idx] = THREE.MathUtils.damp(colors[idx], targetR, 4.0, delta);
      colors[idx + 1] = THREE.MathUtils.damp(colors[idx + 1], targetG, 4.0, delta);
      colors[idx + 2] = THREE.MathUtils.damp(colors[idx + 2], targetB, 4.0, delta);
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
          size={state === 'STATE_GALAXY_VIEW' ? 0.038 : 0.026}
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
