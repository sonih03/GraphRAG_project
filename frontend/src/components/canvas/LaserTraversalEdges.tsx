'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LEGAL_DEMO_NODES, LEGAL_DEMO_EDGES } from '@/lib/dummy/legalGraphData';

export function LaserTraversalEdges() {
  const groupRef = useRef<THREE.Group>(null);

  // Lookup node position map
  const nodeMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    LEGAL_DEMO_NODES.forEach((n) => map.set(n.id, n.position));
    return map;
  }, []);

  const lines = useMemo(() => {
    return LEGAL_DEMO_EDGES.map((edge) => {
      const p1 = nodeMap.get(edge.source) || [0, 0, 0];
      const p2 = nodeMap.get(edge.target) || [0, 0, 0];
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...p1),
        new THREE.Vector3(...p2),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: edge.color,
        transparent: true,
        opacity: 0.85,
        linewidth: 2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const lineObj = new THREE.Line(geom, mat);
      return {
        id: edge.id,
        lineObj,
        mat,
      };
    });
  }, [nodeMap]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lines.forEach((item, i) => {
      // Dynamic pulsing laser glow
      item.mat.opacity = 0.65 + Math.sin(t * 5.0 + i * 1.5) * 0.35;
    });
  });

  return (
    <group ref={groupRef}>
      {/* 3D Laser Lines using primitive objects */}
      {lines.map((item) => (
        <primitive key={item.id} object={item.lineObj} />
      ))}

      {/* Target Nodes Glowing Spheres */}
      {LEGAL_DEMO_NODES.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[node.id === 'art-13' ? 0.12 : 0.08, 20, 20]} />
          <meshStandardMaterial
            color={node.id === 'art-13' ? '#38bdf8' : node.id === 'art-16' ? '#ef4444' : '#10b981'}
            emissive={node.id === 'art-13' ? '#38bdf8' : node.id === 'art-16' ? '#ef4444' : '#10b981'}
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
