'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GraphSystemState } from '@/types/graph';
import { LaserTraversalEdges } from './LaserTraversalEdges';
import { Article3DLabels } from './Article3DLabels';
import { FullGraphNetworkEdges } from './FullGraphNetworkEdges';
import { getOrganicDisplacement, generateSpherePositions, generateOverviewPositions } from '@/lib/utils/math';
import { IDLE_SPHERE_CONFIG, GALAXY_CONFIG } from '@/lib/constants/graphConfig';

interface MorphingGraphUniverseProps {
  state: GraphSystemState;
  pointCount?: number;
  subgraphData?: any;
}

export function MorphingGraphUniverse({
  state,
  pointCount = IDLE_SPHERE_CONFIG.nodeCount,
}: MorphingGraphUniverseProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Precompute 3D Target Coordinate Layouts (Single Sphere vs 5-Part Knowledge Graph Network)
  const { spherePositions, overviewPositions, pointJitters } = useMemo(() => {
    const { spherePositions: sPos, pointJitters: jitters } = generateSpherePositions(pointCount, IDLE_SPHERE_CONFIG.radius);
    const oPos = generateOverviewPositions(pointCount);

    return {
      spherePositions: sPos,
      overviewPositions: oPos,
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
  const cyanPeak = useMemo(() => new THREE.Color(IDLE_SPHERE_CONFIG.coreColor), []);
  const cyanValley = useMemo(() => new THREE.Color('#0284c7'), []);
  const clusterPalette = useMemo(
    () => GALAXY_CONFIG.armColors.map((hex) => new THREE.Color(hex)),
    []
  );

  const morphProgress = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current || !groupRef.current) return;

    const time = Date.now() * 0.0008;
    const isOverview = state === 'STATE_GALAXY_VIEW';
    const isBenchmark = state === 'STATE_BENCHMARK_RADAR';
    const isTraversal = state === 'STATE_GRAPH_TRAVERSAL';

    // Interpolate morph target (0 for sphere, 1 for full overview network)
    const targetProgress = isOverview ? 1.0 : 0.0;
    morphProgress.current = THREE.MathUtils.damp(
      morphProgress.current,
      targetProgress,
      3.5,
      delta
    );
    const progress = morphProgress.current;

    // Rotation control
    if (isOverview) {
      groupRef.current.rotation.y += delta * 0.04;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0.25, 2.0, delta);
    } else if (isBenchmark) {
      groupRef.current.rotation.y += delta * 0.02;
    } else if (isTraversal) {
      // Focus on traversal view with subtle movement
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 2.5, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 2.5, delta);
    } else {
      // IDLE: Serene continuous rotation
      groupRef.current.rotation.y += delta * IDLE_SPHERE_CONFIG.rotationSpeedY;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00012) * IDLE_SPHERE_CONFIG.rotationSpeedX;
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

      const targetOX = overviewPositions[idx];
      const targetOY = overviewPositions[idx + 1];
      const targetOZ = overviewPositions[idx + 2];

      const targetX = THREE.MathUtils.lerp(targetSX, targetOX, progress);
      const targetY = THREE.MathUtils.lerp(targetSY, targetOY, progress);
      const targetZ = THREE.MathUtils.lerp(targetSZ, targetOZ, progress);

      positions[idx] = THREE.MathUtils.damp(positions[idx], targetX, 5.0, delta);
      positions[idx + 1] = THREE.MathUtils.damp(positions[idx + 1], targetY, 5.0, delta);
      positions[idx + 2] = THREE.MathUtils.damp(positions[idx + 2], targetZ, 5.0, delta);

      // Color mapping
      let targetR = 0;
      let targetG = 0;
      let targetB = 0;

      if (isOverview) {
        const clusterColor = clusterPalette[i % 5];
        targetR = clusterColor.r;
        targetG = clusterColor.g;
        targetB = clusterColor.b;
      } else if (isBenchmark) {
        targetR = 0.05;
        targetG = 0.15;
        targetB = 0.25;
      } else if (isTraversal) {
        targetR = 0.05;
        targetG = 0.40;
        targetB = 0.65;
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
          size={state === 'STATE_GALAXY_VIEW' ? 0.032 : state === 'STATE_GRAPH_TRAVERSAL' ? 0.020 : IDLE_SPHERE_CONFIG.nodeSize}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3D Knowledge Graph Network: 5 Part Clusters & Real 299 Relationship Edges */}
      {state === 'STATE_GALAXY_VIEW' && <FullGraphNetworkEdges />}

      {/* 3D Laser Traversal Beams when in STATE_GRAPH_TRAVERSAL */}
      {state === 'STATE_GRAPH_TRAVERSAL' && <LaserTraversalEdges />}

      {/* 3D Floating Article Labels when in STATE_GRAPH_TRAVERSAL */}
      {state === 'STATE_GRAPH_TRAVERSAL' && <Article3DLabels state={state} />}
    </group>
  );
}
