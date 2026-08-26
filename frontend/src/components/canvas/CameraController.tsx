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
const CARD_RADIUS = 3.2;
const Y_SPACING   = 2.5;
const ANGLE_STEP  = 0.75;
// Card geometry from HelixSpiralDeck: PlaneGeometry(4.0, 2.25) at FOV 48
const CARD_W  = 4.0;
const CARD_H  = 2.25;
const CAM_FOV = 48; // degrees — matches <Canvas camera={{ fov: 48 }}>

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

  // Force camera aspect update on fullscreen toggle (F11) and window resize.
  // Do NOT call gl.setSize() — R3F handles renderer sizing automatically.
  useEffect(() => {
    const handleResize = () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };

    // Use requestAnimationFrame to ensure window dimensions are final
    const handleFullscreen = () => requestAnimationFrame(handleResize);

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreen);
    document.addEventListener('webkitfullscreenchange', handleFullscreen);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreen);
      document.removeEventListener('webkitfullscreenchange', handleFullscreen);
    };
  }, [camera]);

  const targetCamPos = useRef(new THREE.Vector3(0, 0, 6.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);
  const currentScroll = useRef(0);

  // 컴포넌트 마운트 시 초기 슬라이드 인덱스 반영
  useEffect(() => {
    if (currentSlideIndex !== undefined) {
      currentScroll.current = currentSlideIndex - 1;
    }
  }, []);

  // Compute camera orbit trajectory or fly-through target based on slide status
  useEffect(() => {
    isTransitioning.current = true;

    // Check if component is rendered inside presentation mode (/lecture)
    const isPresentationMode = currentSlideIndex !== undefined;

    if (isPresentationMode) {
      // 프리젠테이션 모드에서는 useFrame 내부에서 나선형 동적 연산을 수행하므로 타겟 세팅을 스킵합니다.
      return;
    }

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
    };
  }, []);

  useFrame((state, delta) => {
    const isPresentationMode = currentSlideIndex !== undefined;

    if (isPresentationMode) {
      // 1. 슬라이드 인덱스 변화에 맞추어 스크롤 값을 0.08 댐핑 계수로 보간 (카드 덱과 싱크 동기화)
      const targetScroll = currentSlideIndex - 1;
      currentScroll.current += (targetScroll - currentScroll.current) * 0.08;

      const scrollVal = currentScroll.current;
      const angle = scrollVal * ANGLE_STEP;
      const y = -(scrollVal - 6) * Y_SPACING; // 카드 덱 높이 오프셋 동기화

      // 2. 현재 캔버스의 실제 종횡비로 화면을 꽉 채우는 거리를 동적 계산 (cover 모드)
      //    Math.min → 더 가까운 거리 선택 = 작은 방향이 꽉 참 (CSS object-fit: cover 와 동일)
      //    16:9 이외 비율에서는 한쪽 방향이 약간 잘릴 수 있으나 항상 풀사이즈로 보임
      const aspect = state.size.width / state.size.height;
      const halfFovRad = (CAM_FOV * Math.PI) / 180 / 2;
      const tanHalfFov = Math.tan(halfFovRad);
      const distForH = (CARD_H / 2) / tanHalfFov;             // 수직 기준 거리
      const distForW = (CARD_W / 2) / (aspect * tanHalfFov);  // 수평 기준 거리
      const camDist  = Math.min(distForH, distForW);           // cover: 더 가까운 쪽 선택

      // 3. 카드가 위치한 나선형 바깥 반경(CARD_RADIUS + camDist)에 카메라 좌표 세팅
      const camX = Math.sin(angle) * (CARD_RADIUS + camDist);
      const camZ = Math.cos(angle) * (CARD_RADIUS + camDist);

      camera.position.set(camX, y, camZ);

      // 3. 카메라가 카드의 중심점을 똑바로 마주보도록 직접 lookAt 실행 (OrbitControls 미관여)
      const lookX = Math.sin(angle) * CARD_RADIUS;
      const lookZ = Math.cos(angle) * CARD_RADIUS;
      camera.lookAt(lookX, y, lookZ);
    } else {
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
    }
  });

  const isPresentationMode = currentSlideIndex !== undefined;
  if (isPresentationMode) {
    return null; // 프리젠테이션 모드에서는 마우스/휠 카메라 충돌을 원천 차단하기 위해 controls 비활성화
  }

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
