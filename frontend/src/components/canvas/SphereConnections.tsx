'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface SphereConnectionsProps {
  positions: Float32Array;
  color?: string;
  opacity?: number;
}

export function SphereConnections({
  positions,
  color = '#6366f1',
  opacity = 0.35,
}: SphereConnectionsProps) {
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
