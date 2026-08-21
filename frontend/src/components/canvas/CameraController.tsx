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
  currentSlideIndex?: number;
  isIntro?: boolean;
}

export function CameraController({
  state,
  subgraphData,
  panelOpen = false,
  currentSlideIndex,
  isIntro
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 6.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // Compute camera orbit trajectory or fly-through target based on slide status
  useEffect(() => {
    isTransitioning.current = true;

    // Check if component is rendered inside presentation mode (/lecture)
    const isPresentationMode = currentSlideIndex !== undefined;

    if (isPresentationMode) {
      if (isIntro) {
        // Presentation Intro: Calm centering on the rotating IDLE sphere at origin [0,0,0]
        targetCamPos.current.set(0, 0, 6.8);
        targetLookAt.current.set(0, 0, 0);
        return;
      }

      // Demo Mode Specific Fly-Through Camera Overrides
      if (currentSlideIndex === 2) {
        targetCamPos.current.set(0, 2.5, 12.8);
        targetLookAt.current.set(0, 0.3, 0);
      } else if (currentSlideIndex === 8) {
        targetCamPos.current.set(3.5, 2.2, 4.2);
        targetLookAt.current.set(2.4, 1.6, 1.8);
      } else if (currentSlideIndex === 11) {
        targetCamPos.current.set(-2.8, -2.2, 4.0);
        targetLookAt.current.set(-1.8, -1.2, 1.8);
      } else {
        // Standard Slide View: Zoomed-in stable front perspective facing the rotating helix
        targetCamPos.current.set(0, 0, 5.4);
        targetLookAt.current.set(0, 0, 0);
      }
    } else {
      // Main RAG Homepage (http://localhost:3000): 100% Identical to /lecture IDLE camera [0, 0, 6.8]
      switch (state) {
        case 'STATE_GALAXY_VIEW':
        case 'STATE_QUERYING':
        case 'STATE_GRAPH_TRAVERSAL':
        case 'STATE_VECTOR_SEARCH':
          targetCamPos.current.set(0, 0, 11.5);
          targetLookAt.current.set(0, 0, 0);
          break;

        case 'STATE_IDLE':
        case 'STATE_COMPARE_ANSWERS':
        case 'STATE_BENCHMARK_RADAR':
        default:
          targetCamPos.current.set(0, 0, 6.8);
          targetLookAt.current.set(0, 0, 0);
          break;
      }
    }
  }, [state, subgraphData, panelOpen, currentSlideIndex, isIntro]);

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
    }; 0.0
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
      enableRotate={false}
      enableZoom={true}
      enablePan={false}
      zoomSpeed={1.2}
      minDistance={1.2}
      maxDistance={40.0}
      dampingFactor={0.08}
      enableDamping={true}
    />
  );
}
