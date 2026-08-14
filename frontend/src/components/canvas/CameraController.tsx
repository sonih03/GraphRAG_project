'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GraphSystemState } from '@/types/graph';

interface CameraControllerProps {
  state: GraphSystemState;
}

export function CameraController({ state }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Target camera position based on current state
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // Trigger smooth transition whenever state changes
  useEffect(() => {
    isTransitioning.current = true;

    switch (state) {
      case 'STATE_GALAXY_VIEW':
        // Zoom-out for expansive galaxy view
        targetCamPos.current.set(0, 3.5, 12.0);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'STATE_GRAPH_TRAVERSAL':
        // Zoom-in to focus on Art. 13 traversal
        targetCamPos.current.set(0, 0.4, 4.2);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'STATE_VECTOR_SEARCH':
        targetCamPos.current.set(0, 0, 6.5);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'STATE_IDLE':
      case 'STATE_COMPARE_ANSWERS':
      case 'STATE_BENCHMARK_RADAR':
      default:
        targetCamPos.current.set(0, 0, 7.5);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [state]);

  // Allow immediate user override on mouse/touch interaction
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      // If user drags or scrolls, stop auto-camera transition immediately
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Only interpolate camera when an automated state transition is active
    if (isTransitioning.current) {
      camera.position.lerp(targetCamPos.current, 3.5 * delta);
      controlsRef.current.target.lerp(targetLookAt.current, 3.5 * delta);

      // Once close enough, yield full control to user interactions
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
      maxDistance={35.0}
      dampingFactor={0.08}
      enableDamping={true}
    />
  );
}
