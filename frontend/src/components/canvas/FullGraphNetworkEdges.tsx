'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GraphSystemState } from '@/types/graph';
import { PART_CLUSTERS, getArticlePosition } from '@/lib/utils/math';

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

interface FullGraphNetworkEdgesProps {
  state: GraphSystemState;
  activeClusterIndices?: number[];
}

export function FullGraphNetworkEdges({
  state,
  activeClusterIndices = [0],
}: FullGraphNetworkEdgesProps) {
  const [edgesData, setEdgesData] = useState<OverviewEdge[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const edgeProgress = useRef(0);
  const [visibleProgress, setVisibleProgress] = useState(0);

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

  // Compute 3D Line Geometry for Mutatis Mutandis, Exception, and References Edges
  const { lineSegmentsGeom, lineMaterial } = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];

    const mutatisColor = new THREE.Color('#10b981'); // Emerald
    const exceptColor = new THREE.Color('#ef4444');  // Ruby red
    const refColor = new THREE.Color('#38bdf8');     // Cyan / Sky

    edgesData.forEach((edge) => {
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

  // Sequential Ignition & Isolation
  useFrame(({ clock }, delta) => {
    const isOverview = state === 'STATE_GALAXY_VIEW';
    const target = isOverview ? 1.0 : 0.0;

    edgeProgress.current = THREE.MathUtils.damp(
      edgeProgress.current,
      target,
      isOverview ? 2.5 : 8.0,
      delta
    );
    const p = edgeProgress.current;

    if (lineMaterial) {
      const t = clock.getElapsedTime();
      if (isOverview) {
        // Full bright glow in overview
        const clusterSettled = Math.max(0, Math.min(1, (p - 0.4) / 0.6));
        const pulse = 0.55 + Math.sin(t * 3.0) * 0.25;
        lineMaterial.opacity = clusterSettled * pulse;
      } else {
        // Non-overview: Background lines are completely hidden
        lineMaterial.opacity = 0.0;
      }
    }

    if (Math.abs(visibleProgress - p) > 0.05) {
      setVisibleProgress(p);
    }
  });

  const isOverview = state === 'STATE_GALAXY_VIEW';
  const labelOpacity = isOverview ? Math.max(0, Math.min(1, (visibleProgress - 0.35) / 0.65)) : 0;

  if (state === 'STATE_IDLE' && visibleProgress < 0.01) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* 3D Inter-Article Relationship Network Lines (Rendered in full overview mode) */}
      {lineSegmentsGeom.attributes.position && isOverview && (
        <lineSegments geometry={lineSegmentsGeom} material={lineMaterial} />
      )}

      {/* 3D Part Billboard Labels (Perfect sweet-spot size: elegant, readable & non-obstructive) */}
      {labelOpacity > 0.05 && PART_CLUSTERS.map((part) => {
        return (
          <group key={part.id} position={[part.center.x, part.center.y, part.center.z]}>
            <Html center distanceFactor={8} position={[0, 0.48, 0]} className="pointer-events-none select-none">
              <div
                className="flex flex-col items-center transition-opacity duration-300"
                style={{ opacity: labelOpacity, transform: 'scale(0.95)' }}
              >
                <div
                  className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium tracking-tight border-[0.5px] backdrop-blur-md whitespace-nowrap shadow-md flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(6, 9, 18, 0.88)',
                    borderColor: `${part.color}75`,
                    color: part.color,
                    boxShadow: `0 0 8px ${part.color}30`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: part.color }} />
                  <span className="font-semibold tracking-wide">{part.name}</span>
                  <span className="text-[8.5px] opacity-80 font-normal">
                    ({part.range[0]}~{part.range[1]}조)
                  </span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
