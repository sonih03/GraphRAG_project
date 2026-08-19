'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';
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
  subgraphData?: DynamicSubgraphData | null;
  currentQuery?: string | null;
}

/**
 * Builds two separate BufferGeometry:
 * - dimGeom:    all edges (low opacity — dimmed background context)
 * - brightGeom: only edges whose source/target article numbers match the RAG subgraph (vivid highlight)
 */
function buildEdgeGeometries(
  edgesData: OverviewEdge[],
  activeArticleNums: Set<number>
): {
  dimGeom: THREE.BufferGeometry;
  brightGeom: THREE.BufferGeometry;
  dimMat: THREE.LineBasicMaterial;
  brightMat: THREE.LineBasicMaterial;
} {
  const dimPoints: number[] = [];
  const dimColors: number[] = [];
  const brightPoints: number[] = [];
  const brightColors: number[] = [];

  const mutatisColor = new THREE.Color('#10b981');
  const exceptColor = new THREE.Color('#ef4444');
  const refColor = new THREE.Color('#38bdf8');

  edgesData.forEach((edge) => {
    const srcMatch = edge.source.match(/(\d+)/);
    const tgtMatch = edge.target.match(/(\d+)/);
    if (!srcMatch || !tgtMatch) return;

    const srcNum = parseInt(srcMatch[1], 10);
    const tgtNum = parseInt(tgtMatch[1], 10);
    const p1 = getArticlePosition(srcNum);
    const p2 = getArticlePosition(tgtNum);

    const col = edge.type === 'EXCEPTION_TO' ? exceptColor
      : edge.type === 'REFERENCES' ? refColor
        : mutatisColor;

    const isActive = activeArticleNums.has(srcNum) || activeArticleNums.has(tgtNum);

    if (isActive) {
      brightPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      brightColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
    } else {
      dimPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      dimColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
    }
  });

  const makeGeom = (pts: number[], cols: number[]) => {
    const g = new THREE.BufferGeometry();
    if (pts.length > 0) {
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    }
    return g;
  };

  return {
    dimGeom: makeGeom(dimPoints, dimColors),
    brightGeom: makeGeom(brightPoints, brightColors),
    dimMat: new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    brightMat: new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  };
}

function getRelevantClustersFromQuery(query: string): number[] {
  const indices: number[] = [];
  const q = query.toLowerCase();

  // Part 1: General Provisions (총칙)
  if (q.includes('총칙') || q.includes('의사표시') || q.includes('법률행위') || q.includes('미성년자') || q.includes('소멸시효') || q.includes('취소')) {
    indices.push(0);
  }
  // Part 2: Real Rights (물권)
  if (q.includes('물권') || q.includes('소유권') || q.includes('점유') || q.includes('토지') || q.includes('건물') || q.includes('구조물') || q.includes('철거') || q.includes('인도') || q.includes('지상권') || q.includes('저당') || q.includes('전세')) {
    indices.push(1);
  }
  // Part 3: Claims (채권)
  if (q.includes('채권') || q.includes('계약') || q.includes('임대') || q.includes('매매') || q.includes('손해배상') || q.includes('부당이득') || q.includes('불법행위') || q.includes('채무') || q.includes('이행')) {
    indices.push(2);
  }
  // Part 4: Family (친족)
  if (q.includes('친족') || q.includes('부모') || q.includes('혼인') || q.includes('이혼') || q.includes('자녀') || q.includes('부부') || q.includes('가족')) {
    indices.push(3);
  }
  // Part 5: Inheritance (상속)
  if (q.includes('상속') || q.includes('유언') || q.includes('피상속인') || q.includes('유산')) {
    indices.push(4);
  }

  // Default to Part 3 (Core) if no match
  if (indices.length === 0) {
    indices.push(2);
  }
  return indices;
}

let cachedEdgesData: OverviewEdge[] | null = null;

export function FullGraphNetworkEdges({
  state,
  activeClusterIndices = [0],
  subgraphData,
  currentQuery,
}: FullGraphNetworkEdgesProps) {
  const [edgesData, setEdgesData] = useState<OverviewEdge[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const edgeProgress = useRef(0);
  const [visibleProgress, setVisibleProgress] = useState(0);
  const queryStartTime = useRef<number | null>(null);

  // Fetch live overview edges from FastAPI backend on mount
  useEffect(() => {
    if (cachedEdgesData) {
      setEdgesData(cachedEdgesData);
      return;
    }

    fetch('http://localhost:8000/api/v1/graph/overview')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.edges && data.edges.length > 0) {
          cachedEdgesData = data.edges;
          setEdgesData(data.edges);
        }
      })
      .catch((err) => console.warn('Could not fetch overview edges:', err));
  }, []);

  // Collect active article numbers from current subgraphData
  const activeArticleNums = useMemo(() => {
    const nums = new Set<number>();
    if (subgraphData?.nodes) {
      subgraphData.nodes.forEach((node) => {
        const match = node.id.match(/(\d+)/);
        if (match) nums.add(parseInt(match[1], 10));
        if (node.articleNumber) {
          const m2 = node.articleNumber.match(/(\d+)/);
          if (m2) nums.add(parseInt(m2[1], 10));
        }
      });
    }
    return nums;
  }, [subgraphData]);

  // Build all geometry (full + highlighted split)
  const {
    dimGeom,
    brightGeom,
    dimMat,
    brightMat,
    lineSegmentsGeom,
    lineMaterial,
    scanGeomA,
    scanMaterialA,
    scanGeomB,
    scanMaterialB,
  } = useMemo(() => {
    // Original single-pass geometry for STATE_GALAXY_VIEW
    const allPoints: number[] = [];
    const allColors: number[] = [];
    const mutatisColor = new THREE.Color('#10b981');
    const exceptColor = new THREE.Color('#ef4444');
    const refColor = new THREE.Color('#38bdf8');

    edgesData.forEach((edge) => {
      const srcMatch = edge.source.match(/(\d+)/);
      const tgtMatch = edge.target.match(/(\d+)/);
      if (!srcMatch || !tgtMatch) return;
      const srcNum = parseInt(srcMatch[1], 10);
      const tgtNum = parseInt(tgtMatch[1], 10);
      const p1 = getArticlePosition(srcNum);
      const p2 = getArticlePosition(tgtNum);
      const col = edge.type === 'EXCEPTION_TO' ? exceptColor
        : edge.type === 'REFERENCES' ? refColor
          : mutatisColor;
      allPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      allColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
    });

    const allGeom = new THREE.BufferGeometry();
    if (allPoints.length > 0) {
      allGeom.setAttribute('position', new THREE.Float32BufferAttribute(allPoints, 3));
      allGeom.setAttribute('color', new THREE.Float32BufferAttribute(allColors, 3));
    }
    const allMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const scanGeomA = allGeom.clone();
    const scanMaterialA = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const scanGeomB = allGeom.clone();
    const scanMaterialB = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const split = buildEdgeGeometries(edgesData, activeArticleNums);

    return {
      lineSegmentsGeom: allGeom,
      lineMaterial: allMat,
      scanGeomA,
      scanMaterialA,
      scanGeomB,
      scanMaterialB,
      ...split,
    };
  }, [edgesData, activeArticleNums]);

  const queryingGeom = useMemo(() => {
    if (!edgesData || edgesData.length === 0) return null;

    const filteredPoints: number[] = [];
    const filteredColors: number[] = [];
    const mutatisColor = new THREE.Color('#10b981');
    const exceptColor = new THREE.Color('#ef4444');
    const refColor = new THREE.Color('#38bdf8');

    const relevantIndices = getRelevantClustersFromQuery(currentQuery || '');

    edgesData.forEach((edge) => {
      const srcMatch = edge.source.match(/(\d+)/);
      const tgtMatch = edge.target.match(/(\d+)/);
      if (!srcMatch || !tgtMatch) return;
      const srcNum = parseInt(srcMatch[1], 10);
      const tgtNum = parseInt(tgtMatch[1], 10);

      let srcClusterIdx = 0;
      for (let i = 0; i < PART_CLUSTERS.length; i++) {
        if (srcNum >= PART_CLUSTERS[i].range[0] && srcNum <= PART_CLUSTERS[i].range[1]) {
          srcClusterIdx = i;
          break;
        }
      }

      if (relevantIndices.includes(srcClusterIdx)) {
        const p1 = getArticlePosition(srcNum);
        const p2 = getArticlePosition(tgtNum);
        const col = edge.type === 'EXCEPTION_TO' ? exceptColor
          : edge.type === 'REFERENCES' ? refColor
            : mutatisColor;
        filteredPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        filteredColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
      }
    });

    const geom = new THREE.BufferGeometry();
    if (filteredPoints.length > 0) {
      geom.setAttribute('position', new THREE.Float32BufferAttribute(filteredPoints, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(filteredColors, 3));
    }
    return geom;
  }, [edgesData, currentQuery]);

  const queryingMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }, delta) => {
    const isOverview = state === 'STATE_GALAXY_VIEW';
    const isTraversal = state === 'STATE_GRAPH_TRAVERSAL' || state === 'STATE_VECTOR_SEARCH';
    const isQuerying = state === 'STATE_QUERYING';

    if (isQuerying) {
      if (queryStartTime.current === null) {
        queryStartTime.current = clock.getElapsedTime();
      }
    } else {
      queryStartTime.current = null;
    }

    // Progress for overview fade-in
    const overviewTarget = isOverview ? 1.0 : 0.0;
    edgeProgress.current = THREE.MathUtils.damp(
      edgeProgress.current,
      overviewTarget,
      isOverview ? 2.5 : 8.0,
      delta
    );
    const p = edgeProgress.current;

    const t = clock.getElapsedTime();

    if (isOverview) {
      const clusterSettled = Math.max(0, Math.min(1, (p - 0.4) / 0.6));
      const pulse = 0.55 + Math.sin(t * 3.0) * 0.25;
      lineMaterial.opacity = clusterSettled * pulse;
      if (lineSegmentsGeom && lineSegmentsGeom.attributes.position) {
        lineSegmentsGeom.setDrawRange(0, lineSegmentsGeom.attributes.position.count);
      }
      if (scanGeomA && scanGeomA.attributes.position) {
        scanGeomA.setDrawRange(0, scanGeomA.attributes.position.count);
      }
      if (scanGeomB && scanGeomB.attributes.position) {
        scanGeomB.setDrawRange(0, scanGeomB.attributes.position.count);
      }
      dimMat.opacity = 0;
      brightMat.opacity = 0;
    } else if (isQuerying) {
      const t_elapsed = clock.getElapsedTime() - (queryStartTime.current || 0);

      // Looping animation cycle: 20s connection, immediately starting next loop
      const connectDuration = 20.0;
      const cycleIndex = Math.floor(t_elapsed / connectDuration);
      const t_cycle = t_elapsed % connectDuration;
      const scanProgress = t_cycle / connectDuration;

      // Determine active scan buffer and fading buffer
      const isAEven = cycleIndex % 2 === 0;
      const activeGeom = isAEven ? scanGeomA : scanGeomB;
      const activeMat = isAEven ? scanMaterialA : scanMaterialB;
      const fadeGeom = isAEven ? scanGeomB : scanGeomA;
      const fadeMat = isAEven ? scanMaterialB : scanMaterialA;

      // --- Active Scan Wave (Sliding window of 25% of edges at 0.70 opacity) ---
      if (activeGeom && activeGeom.attributes.position) {
        const totalVertices = activeGeom.attributes.position.count;
        const windowSize = Math.floor(totalVertices * 0.25);
        const endIndex = Math.floor(totalVertices * scanProgress);
        const startIndex = Math.floor(Math.max(0, endIndex - windowSize) / 2) * 2;
        const count = Math.floor((endIndex - startIndex) / 2) * 2;

        activeGeom.setDrawRange(startIndex, count);
      }
      if (activeMat) {
        activeMat.opacity = 0.70;
      }

      // --- Fading Previous Scan (Holds 100% position and fades out over 3 seconds) ---
      if (fadeGeom && fadeGeom.attributes.position) {
        const totalVertices = fadeGeom.attributes.position.count;
        const windowSize = Math.floor(totalVertices * 0.25);
        const startIndex = Math.floor((totalVertices - windowSize) / 2) * 2;
        const count = Math.floor(windowSize / 2) * 2;

        fadeGeom.setDrawRange(startIndex, count);
      }
      if (fadeMat) {
        if (cycleIndex === 0) {
          fadeMat.opacity = 0.15; // No previous cycle to fade out on first load
        } else {
          // Fade from 0.70 down to 0.15 over 3.0 seconds
          const fadeProgress = Math.min(1.0, t_cycle / 3.0);
          fadeMat.opacity = 0.70 - fadeProgress * (0.70 - 0.15);
        }
      }

      // Background network: all 530 edges rendered fully at 0.15 opacity
      if (lineSegmentsGeom && lineSegmentsGeom.attributes.position) {
        lineSegmentsGeom.setDrawRange(0, lineSegmentsGeom.attributes.position.count);
      }
      if (lineMaterial) {
        lineMaterial.opacity = 0.15;
      }

      dimMat.opacity = 0;
      brightMat.opacity = 0;
    } else if (isTraversal) {
      lineMaterial.opacity = 0;
      if (lineSegmentsGeom && lineSegmentsGeom.attributes.position) {
        lineSegmentsGeom.setDrawRange(0, lineSegmentsGeom.attributes.position.count);
      }
      if (scanGeomA && scanGeomA.attributes.position) {
        scanGeomA.setDrawRange(0, scanGeomA.attributes.position.count);
      }
      if (scanGeomB && scanGeomB.attributes.position) {
        scanGeomB.setDrawRange(0, scanGeomB.attributes.position.count);
      }
      // Dim: faint background grid so you still see the full network context
      const dimTarget = 0.14;
      dimMat.opacity = THREE.MathUtils.damp(dimMat.opacity, dimTarget, 3.0, delta);
      // Bright: vivid highlight for active nodes/edges
      const brightPulse = 0.80 + Math.sin(t * 2.5) * 0.18;
      brightMat.opacity = THREE.MathUtils.damp(brightMat.opacity, brightPulse, 3.0, delta);
    } else {
      if (lineSegmentsGeom && lineSegmentsGeom.attributes.position) {
        lineSegmentsGeom.setDrawRange(0, lineSegmentsGeom.attributes.position.count);
      }
      if (scanGeomA && scanGeomA.attributes.position) {
        scanGeomA.setDrawRange(0, scanGeomA.attributes.position.count);
      }
      if (scanGeomB && scanGeomB.attributes.position) {
        scanGeomB.setDrawRange(0, scanGeomB.attributes.position.count);
      }
      lineMaterial.opacity = THREE.MathUtils.damp(lineMaterial.opacity, 0.0, 8.0, delta);
      dimMat.opacity = THREE.MathUtils.damp(dimMat.opacity, 0.0, 8.0, delta);
      brightMat.opacity = THREE.MathUtils.damp(brightMat.opacity, 0.0, 8.0, delta);
    }

    if (Math.abs(visibleProgress - p) > 0.05) {
      setVisibleProgress(p);
    }
  });

  const isOverview = state === 'STATE_GALAXY_VIEW';
  const isTraversal = state === 'STATE_GRAPH_TRAVERSAL' || state === 'STATE_VECTOR_SEARCH';
  const labelOpacity = isOverview
    ? Math.max(0, Math.min(1, (visibleProgress - 0.35) / 0.65))
    : 0;

  if (state === 'STATE_IDLE' && visibleProgress < 0.01) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* === STATE_GALAXY_VIEW: Full bright network === */}
      {lineSegmentsGeom.attributes.position && isOverview && (
        <lineSegments geometry={lineSegmentsGeom} material={lineMaterial} />
      )}

      {/* === STATE_QUERYING: Background static network + moving scan wave === */}
      {lineSegmentsGeom.attributes.position && state === 'STATE_QUERYING' && (
        <>
          {/* Background static network */}
          <lineSegments geometry={lineSegmentsGeom} material={lineMaterial} />
          {/* Scan Layer A */}
          {scanGeomA && scanMaterialA && (
            <lineSegments geometry={scanGeomA} material={scanMaterialA} />
          )}
          {/* Scan Layer B */}
          {scanGeomB && scanMaterialB && (
            <lineSegments geometry={scanGeomB} material={scanMaterialB} />
          )}
        </>
      )}

      {/* === STATE_GRAPH_TRAVERSAL: Dimmed background + vivid active highlight === */}
      {isTraversal && (
        <>
          {/* All non-active edges — very faint, just enough to see the whole structure */}
          {dimGeom.attributes.position && (
            <lineSegments geometry={dimGeom} material={dimMat} />
          )}
          {/* Active RAG edges — bright animated glow */}
          {brightGeom.attributes.position && (
            <lineSegments geometry={brightGeom} material={brightMat} />
          )}
        </>
      )}

      {/* Part cluster billboard labels (only in overview) */}
      {labelOpacity > 0.05 && PART_CLUSTERS.map((part) => (
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
      ))}
    </group>
  );
}
