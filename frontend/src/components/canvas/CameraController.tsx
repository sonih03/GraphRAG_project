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

  useEffect(() => {
    switch (state) {
      case 'STATE_GALAXY_VIEW':
        // Zoom-out for expansive galaxy view
        targetCamPos.current.set(0, 4.5, 12.0);
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

  useFrame((_, delta) => {
    // Smooth, cinematic spring/damping camera position interpolation
    camera.position.lerp(targetCamPos.current, 3.5 * delta);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 3.5 * delta);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={2.5}
      maxDistance={20.0}
      dampingFactor={0.05}
      enableDamping
    />
  );
}
