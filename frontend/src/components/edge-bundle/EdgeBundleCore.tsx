'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PILLAR_HEIGHT = 36;
const STRAND_COUNT = 240;

// 메인 색상(딥퍼플 35% + 민트 35% = 70%)과 포인트 색상(골드 15% + 시안 10% + 화이트 5% = 30%) 배분
function getRandomSolidColor(): THREE.Color {
  const rand = Math.random();

  if (rand < 0.35) {
    return new THREE.Color('#7e22ce'); // 35% 딥 퍼플 (Main)
  } else if (rand < 0.70) {
    return new THREE.Color('#2dd4bf'); // 35% 민트 (Main)
  } else if (rand < 0.85) {
    return new THREE.Color('#fbbf24'); // 15% 골드 (Point)
  } else if (rand < 0.95) {
    return new THREE.Color('#38bdf8'); // 10% 시안 (Point)
  } else {
    return new THREE.Color('#ffffff'); // 5% 화이트 하이라이트 (Point)
  }
}

interface EdgeBundleCoreProps {
  state?: string;
  visible?: boolean;
}

export function EdgeBundleCore({ state, visible = true }: EdgeBundleCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  // 1. 불규칙한 각도 및 반경을 가진 직선 좌표와 고유 단색 생성
  const strandConfigs = useMemo(() => {
    const list = [];

    for (let i = 0; i < STRAND_COUNT; i++) {
      const baseAngle = (i / STRAND_COUNT) * Math.PI * 2;
      const strandColor = getRandomSolidColor();
      const direction = Math.random() > 0.45 ? 1 : -1;

      // 불규칙 꺾임 계수: 수직에 가까운 선부터 크게 기울어진 선까지 분산
      const slantIntensity = Math.pow(Math.random(), 2.2) * 0.85 + (Math.random() < 0.15 ? 0.01 : 0.08);
      const topAngle = baseAngle + direction * (slantIntensity * Math.PI * 2);

      // 상/하단 반경 독립 분산 (0.4 ~ 1.2로 두께 대폭 축소)
      const bottomRadius = 0.4 + Math.random() * 0.8;
      const topRadius = 0.4 + Math.random() * 0.8;

      // 상/하단 끝점 높이 지그재그 편차
      const bottomY = -PILLAR_HEIGHT / 2 + (Math.random() - 0.5) * 1.5;
      const topY = PILLAR_HEIGHT / 2 + (Math.random() - 0.5) * 1.5;

      const startX = Math.cos(baseAngle) * bottomRadius;
      const startZ = Math.sin(baseAngle) * bottomRadius;

      const endX = Math.cos(topAngle) * topRadius;
      const endZ = Math.sin(topAngle) * topRadius;

      list.push({
        start: new THREE.Vector3(startX, bottomY, startZ),
        end: new THREE.Vector3(endX, topY, endZ),
        strandColor,
      });
    }
    return list;
  }, []);

  // 2. 가닥별 단색 1:1 매핑 (직선 세그먼트 생성)
  const { linePositions, lineColors } = useMemo(() => {
    const posList: number[] = [];
    const colList: number[] = [];

    strandConfigs.forEach((cfg) => {
      // 시작점
      posList.push(cfg.start.x, cfg.start.y, cfg.start.z);
      // 끝점
      posList.push(cfg.end.x, cfg.end.y, cfg.end.z);

      // 가닥 전체에 동일한 고유 단색 주입
      colList.push(cfg.strandColor.r, cfg.strandColor.g, cfg.strandColor.b);
      colList.push(cfg.strandColor.r, cfg.strandColor.g, cfg.strandColor.b);
    });

    return {
      linePositions: new Float32Array(posList),
      lineColors: new Float32Array(colList),
    };
  }, [strandConfigs]);

  useFrame((stateContext, delta) => {
    if (!visible) return;

    if (groupRef.current) {
      groupRef.current.rotation.y = stateContext.clock.getElapsedTime() * 0.05;
    }

    if (materialRef.current) {
      // lecture 전용 모드이므로 상태와 관계없이 항상 선명하게 노출(0.35)
      const targetOpacity = 0.35;

      materialRef.current.opacity = THREE.MathUtils.damp(
        materialRef.current.opacity,
        targetOpacity,
        3.5,
        delta
      );

      if (meshRef.current) {
        meshRef.current.visible = true; // 항상 보이도록 고정
      }
    }
  });

  return (
    <group ref={groupRef} visible={visible}>
      <lineSegments ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          vertexColors={true}
          transparent={true}
          opacity={0.0} // useFrame에서 즉시 damp보간되어 나타나므로 초기값 0.0 설정
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
