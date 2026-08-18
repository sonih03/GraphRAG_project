'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';
import { getInvolvedClusterIndices, calculateClusterCameraFraming } from '@/lib/utils/math';

interface CameraControllerProps {
  state: GraphSystemState;
  subgraphData?: DynamicSubgraphData | null;
}

export function CameraController({ state, subgraphData }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // Trigger smooth transition whenever state or subgraphData changes
  useEffect(() => {
    isTransitioning.current = true;

    switch (state) {
      case 'STATE_GALAXY_VIEW':
        // Centroid Core Regular Tetrahedron Overview (Core [0,0,0] + 4 Vertices R=3.1, Z=11.5 for 100% safe margin)
        targetCamPos.current.set(0, 0.15, 11.5);
        targetLookAt.current.set(0, 0.0, 0);
        break;

      case 'STATE_GRAPH_TRAVERSAL': {
        // Dynamic multi-cluster framing: identify involved clusters and frame them compactly
        const rawNodes = subgraphData?.nodes || [];
        const artNumbers = rawNodes.map((n) => {
          const match = n.id.match(/(\d+)/) || (n.articleNumber && n.articleNumber.match(/(\d+)/));
          return match ? parseInt(match[1], 10) : 13;
        });

        const activeClusters = getInvolvedClusterIndices(artNumbers.length > 0 ? artNumbers : [13]);
        const { camPos, lookAt } = calculateClusterCameraFraming(activeClusters);

        targetCamPos.current.copy(camPos);
        targetLookAt.current.copy(lookAt);
        break;
      }

      case 'STATE_VECTOR_SEARCH':
        targetCamPos.current.set(-1.7, 1.1, 3.2);
        targetLookAt.current.set(-1.7, 1.1, 0.4);
        break;

      case 'STATE_IDLE':
      case 'STATE_COMPARE_ANSWERS':
      case 'STATE_BENCHMARK_RADAR':
      default:
        targetCamPos.current.set(0, 0, 6.8);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [state, subgraphData]);

  // Allow immediate user override on mouse/touch interaction
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      camera.position.lerp(targetCamPos.current, 3.5 * delta);
      controlsRef.current.target.lerp(targetLookAt.current, 3.5 * delta);

      if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableRotate={true}
      enableZoom={true}
      enablePan={true}
      zoomSpeed={1.2}
      rotateSpeed={0.9}
      minDistance={1.2}
      maxDistance={40.0}
      dampingFactor={0.08}
      enableDamping={true}
    />
  );
}
