'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DynamicSubgraphData, DynamicSubgraphNode } from '@/types/graph';
import { getArticlePosition } from '@/lib/utils/math';

interface LaserTraversalEdgesProps {
  subgraphData?: DynamicSubgraphData | null;
}

// Fallback nodes for default 제13조 traversal
const DEFAULT_NODES: DynamicSubgraphNode[] = [
  { id: 'KR-CIVIL-ART-13', articleNumber: '제13조', title: '피한정후견인의 행위와 동의', summary: '한정후견인의 동의를 필요로 하는 행위', type: 'origin_node' },
  { id: 'KR-CIVIL-ART-14', articleNumber: '제14조', title: '한정후견종료의 심판', summary: '한정후견개시 원인 소멸 시 종료 심판', type: 'traversal_node' },
  { id: 'KR-CIVIL-ART-15', articleNumber: '제15조', title: '상대방의 확답촉구권', summary: '1개월 이상 기간 정하여 추인 여부 확답 촉구 (준용)', type: 'traversal_node' },
  { id: 'KR-CIVIL-ART-16', articleNumber: '제16조', title: '피특정후견인의 행위와 보호', summary: '일상용품 구입 등 일상생활 필요행위 예외', type: 'traversal_node' },
];

export function LaserTraversalEdges({ subgraphData }: LaserTraversalEdgesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const drawProgress = useRef(0);

  // Reset draw progress whenever subgraphData changes
  useEffect(() => {
    drawProgress.current = 0.0;
  }, [subgraphData]);

  // Compute exact real-world 3D positions for each article node in the cluster
  const nodesWithPositions = useMemo(() => {
    const rawNodes = subgraphData?.nodes && subgraphData.nodes.length > 0 ? subgraphData.nodes : DEFAULT_NODES;

    return rawNodes.map((node) => {
      const match = node.id.match(/(\d+)/) || (node.articleNumber && node.articleNumber.match(/(\d+)/));
      const artNum = match ? parseInt(match[1], 10) : 13;
      const posVec = getArticlePosition(artNum);

      return {
        ...node,
        position: [posVec.x, posVec.y, posVec.z] as [number, number, number],
      };
    });
  }, [subgraphData]);

  // Position lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    nodesWithPositions.forEach((n) => map.set(n.id, n.position || [0, 0, 0]));
    return map;
  }, [nodesWithPositions]);

  // Build dynamic laser lines with animated vertex positions
  const lineItems = useMemo(() => {
    const rawEdges = subgraphData?.edges && subgraphData.edges.length > 0 ? subgraphData.edges : [
      { id: 'e-13-14', source: 'KR-CIVIL-ART-13', target: 'KR-CIVIL-ART-14', type: 'MUTATIS_MUTANDIS' as const, color: '#10b981' },
      { id: 'e-13-15', source: 'KR-CIVIL-ART-13', target: 'KR-CIVIL-ART-15', type: 'MUTATIS_MUTANDIS' as const, color: '#10b981' },
      { id: 'e-13-16', source: 'KR-CIVIL-ART-13', target: 'KR-CIVIL-ART-16', type: 'EXCEPTION_TO' as const, color: '#ef4444' },
    ];

    return rawEdges.map((edge, idx) => {
      const p1 = nodeMap.get(edge.source) || [0, 0, 0];
      const p2 = nodeMap.get(edge.target) || [0, 0, 0];

      const v1 = new THREE.Vector3(...p1);
      const v2 = new THREE.Vector3(...p2);

      const positions = new Float32Array([
        v1.x, v1.y, v1.z,
        v1.x, v1.y, v1.z // initially at source
      ]);

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const edgeColor = edge.color || (edge.type === 'EXCEPTION_TO' ? '#ef4444' : edge.type === 'REFERENCES' ? '#38bdf8' : '#10b981');

      const mat = new THREE.LineBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: 0.95,
        linewidth: 3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const lineObj = new THREE.Line(geom, mat);
      return {
        id: edge.id || `edge-${idx}`,
        v1,
        v2,
        geom,
        mat,
        lineObj,
      };
    });
  }, [nodeMap, subgraphData]);

  // Smooth progressive laser beam shooting animation
  useFrame(({ clock }, delta) => {
    // S-curve smooth progressive drawing from origin to target
    drawProgress.current = THREE.MathUtils.damp(drawProgress.current, 1.0, 3.2, delta);
    const p = drawProgress.current;

    const t = clock.getElapsedTime();
    lineItems.forEach((item, i) => {
      // Dynamic pulse
      item.mat.opacity = (0.65 + Math.sin(t * 6.0 + i * 1.5) * 0.35) * Math.min(1, p * 1.5);

      // Animate line endpoint outward from v1 towards v2
      const curV2 = new THREE.Vector3().lerpVectors(item.v1, item.v2, p);
      const posAttr = item.geom.attributes.position as THREE.BufferAttribute;
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        arr[0] = item.v1.x;
        arr[1] = item.v1.y;
        arr[2] = item.v1.z;
        arr[3] = curV2.x;
        arr[4] = curV2.y;
        arr[5] = curV2.z;
        posAttr.needsUpdate = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 3D Progressive Laser Lines */}
      {lineItems.map((item) => (
        <primitive key={item.id} object={item.lineObj} />
      ))}

      {/* Traversed Nodes Sleek Point Beacons */}
      {nodesWithPositions.map((node) => {
        const isOrigin = node.type === 'origin_node' || node.id.endsWith('-13');
        const isException = node.id.includes('16') || node.title?.includes('예외');
        const color = isOrigin ? '#38bdf8' : isException ? '#ef4444' : '#10b981';

        return (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[isOrigin ? 0.055 : 0.040, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
