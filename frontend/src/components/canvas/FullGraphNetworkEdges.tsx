'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface OverviewEdge {
  source: string;
  target: string;
  type: 'MUTATIS_MUTANDIS' | 'EXCEPTION_TO' | 'REFERENCES';
  color?: string;
}

export interface OverviewNode {
  id: string;
  title: string;
  name: string;
  number: number;
  contextPath?: string;
}

// 5 Part Cluster Centers in 3D Space
export const PART_CLUSTERS = [
  { id: 'part-1', name: '제1편 총칙', range: [1, 184], center: new THREE.Vector3(-4.5, 2.8, 1.0), color: '#38bdf8' },
  { id: 'part-2', name: '제2편 물권', range: [185, 372], center: new THREE.Vector3(4.5, 3.2, -1.5), color: '#818cf8' },
  { id: 'part-3', name: '제3편 채권', range: [373, 766], center: new THREE.Vector3(0.0, -4.0, 3.0), color: '#c084fc' },
  { id: 'part-4', name: '제4편 친족', range: [767, 996], center: new THREE.Vector3(-4.5, -3.0, -3.0), color: '#34d399' },
  { id: 'part-5', name: '제5편 상속', range: [997, 1118], center: new THREE.Vector3(5.0, -2.5, 2.5), color: '#fbbf24' },
];

export function getArticlePosition(num: number): THREE.Vector3 {
  // Find which part
  let cluster = PART_CLUSTERS[0];
  for (const c of PART_CLUSTERS) {
    if (num >= c.range[0] && num <= c.range[1]) {
      cluster = c;
      break;
    }
  }

  // Deterministic spherical distribution around cluster center
  const offsetIndex = num - cluster.range[0];
  const totalInCluster = cluster.range[1] - cluster.range[0] + 1;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (offsetIndex / Math.max(1, totalInCluster - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y)) * 1.8;
  const theta = offsetIndex * goldenAngle;

  const px = cluster.center.x + Math.cos(theta) * r + Math.sin(num * 7.13) * 0.3;
  const py = cluster.center.y + y * 1.5 + Math.cos(num * 3.77) * 0.2;
  const pz = cluster.center.z + Math.sin(theta) * r + Math.sin(num * 5.41) * 0.3;

  return new THREE.Vector3(px, py, pz);
}

export function FullGraphNetworkEdges() {
  const [edgesData, setEdgesData] = useState<OverviewEdge[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  // Fetch live overview edges from FastAPI backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/graph/overview')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.edges && data.edges.length > 0) {
          setEdgesData(data.edges);
        }
      })
      .catch((err) => console.warn('Could not fetch overview edges:', err));
  }, []);

  // Compute 3D Line Geometry for Mutatis Mutandis & Exception Edges
  const { lineSegmentsGeom, lineMaterial } = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];

    const mutatisColor = new THREE.Color('#10b981'); // Emerald
    const exceptColor = new THREE.Color('#ef4444');  // Ruby red
    const refColor = new THREE.Color('#38bdf8');     // Cyan / Sky

    edgesData.forEach((edge) => {
      // Extract number from source & target id (e.g. KR-CIVIL-ART-13 -> 13)
      const srcMatch = edge.source.match(/(\d+)/);
      const tgtMatch = edge.target.match(/(\d+)/);

      if (srcMatch && tgtMatch) {
        const srcNum = parseInt(srcMatch[1], 10);
        const tgtNum = parseInt(tgtMatch[1], 10);

        const p1 = getArticlePosition(srcNum);
        const p2 = getArticlePosition(tgtNum);

        points.push(p1.x, p1.y, p1.z);
        points.push(p2.x, p2.y, p2.z);

        const col = (
          edge.type === 'EXCEPTION_TO' ? exceptColor :
          edge.type === 'REFERENCES' ? refColor : mutatisColor
        );
        colors.push(col.r, col.g, col.b);
        colors.push(col.r, col.g, col.b);
      }
    });

    const geom = new THREE.BufferGeometry();
    if (points.length > 0) {
      geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { lineSegmentsGeom: geom, lineMaterial: mat };
  }, [edgesData]);

  // Pulse edge glow
  useFrame(({ clock }) => {
    if (lineMaterial) {
      const t = clock.getElapsedTime();
      lineMaterial.opacity = 0.50 + Math.sin(t * 3.0) * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Inter-Article Relationship Network Lines */}
      {lineSegmentsGeom.attributes.position && (
        <lineSegments geometry={lineSegmentsGeom} material={lineMaterial} />
      )}

      {/* 5 Part 3D Billboard Labels (No bulky center sphere) */}
      {PART_CLUSTERS.map((part) => (
        <group key={part.id} position={[part.center.x, part.center.y, part.center.z]}>
          {/* 3D Glassmorphism Tag */}
          <Html center distanceFactor={14} position={[0, 0.2, 0]} className="pointer-events-none select-none">
            <div className="flex flex-col items-center">
              <div
                className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border backdrop-blur-md whitespace-nowrap shadow-xl flex items-center gap-1.5"
                style={{
                  backgroundColor: 'rgba(10, 15, 30, 0.85)',
                  borderColor: part.color,
                  color: part.color,
                  boxShadow: `0 0 20px ${part.color}40`,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: part.color }} />
                <span>{part.name}</span>
                <span className="text-[10px] opacity-70 font-normal">
                  ({part.range[0]}조~{part.range[1]}조)
                </span>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
