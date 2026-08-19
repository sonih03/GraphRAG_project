'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';

/**
 * Panel width in screen pixels ≈ 480px + 24px margin.
 * With a default FoV=42° at distance Z=7–11, the visible half-width (NDC) maps
 * to roughly 5–7 world units at distance 7.  We shift the camera lookAt by
 * PANEL_WORLD_SHIFT units left to compensate the panel occupying the right side.
 */
const PANEL_WORLD_SHIFT_X = -1.8;   // World-space left shift when panel is open
const PANEL_CAM_SHIFT_X = -1.6;   // Camera position X shift (slightly less)

interface CameraControllerProps {
  state: GraphSystemState;
  subgraphData?: DynamicSubgraphData | null;
  panelOpen?: boolean;
}

export function CameraController({ state, subgraphData, panelOpen = false }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // Compute base camera target whenever state or subgraph changes
  useEffect(() => {
    isTransitioning.current = true;

    // Do not shift the camera even when the panel is open, keeping the graph centered at the origin (0, 0, 0)
    const xShift = 0;
    const lookShift = 0;

    switch (state) {
      case 'STATE_GALAXY_VIEW':
      case 'STATE_QUERYING':
      case 'STATE_GRAPH_TRAVERSAL':
      case 'STATE_VECTOR_SEARCH':
        // Maintain the overall DB graph overview camera perspective
        targetCamPos.current.set(0 + xShift, 0.15, 11.5);
        targetLookAt.current.set(0 + lookShift, 0.0, 0);
        break;

      case 'STATE_IDLE':
      case 'STATE_COMPARE_ANSWERS':
      case 'STATE_BENCHMARK_RADAR':
      default:
        targetCamPos.current.set(0, 0, 6.8);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [state, subgraphData, panelOpen]);

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
      // Smooth lerp — slightly faster (4.0) so the panel shift feels snappy
      camera.position.lerp(targetCamPos.current, 4.0 * delta);
      controlsRef.current.target.lerp(targetLookAt.current, 4.0 * delta);

      if (camera.position.distanceTo(targetCamPos.current) < 0.04) {
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
