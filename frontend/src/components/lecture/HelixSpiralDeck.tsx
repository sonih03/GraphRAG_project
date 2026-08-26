'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARSED_SLIDES } from '@/lib/slidesData';

export interface SlideItem {
  index: number;
  category: string;
  title: string;
  subtitle: string;
  bullets: string[];
  isDemo: boolean;
}

export const LECTURE_SLIDES: SlideItem[] = [
  { index: 1, category: "OVERVIEW", title: "GraphRAG 개요", subtitle: "민법 조문 준용 체인과 그래프 모델링", bullets: [], isDemo: false },
  { index: 2, category: "COMPARISON", title: "VectorRAG vs GraphRAG", subtitle: "패러다임 비교", bullets: [], isDemo: false },
  { index: 3, category: "OVERVIEW", title: "GraphRAG 구축 한계", subtitle: "비용, 속도, 환각 한계", bullets: [], isDemo: false },
  { index: 4, category: "INGESTION", title: "파이프라인: 1·2단계 파싱", subtitle: "계층 파서를 통한 구조 위계 보존 및 청킹", bullets: [], isDemo: false },
  { index: 5, category: "INGESTION", title: "파이프라인: 상태 머신 다이어그램", subtitle: "순차 파싱 상태 머신", bullets: [], isDemo: false },
  { index: 6, category: "INGESTION", title: "파이프라인: 3단계 관계 추출", subtitle: "결정론적 온톨로지 관계 추출", bullets: [], isDemo: false },
  { index: 7, category: "CYPHER", title: "2-Hop Cypher 탐색", subtitle: "RAG 컨텍스트 구성을 위한 실시간 그래프 트래버설", bullets: [], isDemo: false },
  { index: 8, category: "RAG ENGINE", title: "초기 단순 검색 실패 원인", subtitle: "단순 검색 실패 분석", bullets: [], isDemo: false },
  { index: 9, category: "INGESTION", title: "파이프라인: 4단계 Neo4j 적재", subtitle: "데이터 정합성 보장 멱등성 벌크 적재", bullets: [], isDemo: false },
  { index: 10, category: "RAG ENGINE", title: "하이브리드 검색 & 컨텍스트", subtitle: "Vector 유사도 + Graph 결정론의 융합 구조", bullets: [], isDemo: false },
  { index: 11, category: "BENCHMARK", title: "성능 벤치마크 결과 및 결론", subtitle: "Vector RAG vs GraphRAG 정량 평가", bullets: [], isDemo: false }
];

/**
 * Scopes all SVG id attributes with a unique prefix to prevent
 * duplicate-id conflicts when multiple SVGs are rendered simultaneously.
 */
function namespaceSVGIds(svgString: string, prefix: string): string {
  return svgString
    .replace(/\bid="([^"]+)"/g, `id="${prefix}_$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}_$1)`)
    .replace(/xlink:href="#([^"]+)"/g, `xlink:href="#${prefix}_$1"`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}_$1"`);
}

/**
 * Creates high-resolution 1920x1080 Texture from SVG code drawn onto a Canvas.
 */
function createSlideTextureFromSVG(svgString: string, slidePrefix: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  if (!svgString) return texture;

  // Namespace all ids to avoid cross-slide filter/gradient conflicts
  const namespacedSVG = namespaceSVGIds(svgString, slidePrefix);

  const img = new Image();
  const blob = new Blob([namespacedSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    if (ctx) {
      ctx.clearRect(0, 0, 1920, 1080);
      ctx.drawImage(img, 0, 0, 1920, 1080);
      texture.needsUpdate = true;
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = (err) => {
    console.error(`Error rendering SVG (${slidePrefix}) to canvas texture`, err);
    URL.revokeObjectURL(url);
  };
  img.src = url;

  return texture;
}



/**
 * Maps lecture slots (1-11) to the corresponding PARSED_SLIDES indexes.
 */
function getSVGCodeForSlideIndex(lectureIndex: number): string {
  const targetIndexes = [1, 2, 3, 6, 7, 8, 9, 11, 12, 13, 14];
  const targetIndex = targetIndexes[lectureIndex - 1] ?? 1;
  const found = PARSED_SLIDES.find(s => s.index === targetIndex);
  return found ? found.svgCode : '';
}

interface HelixSpiralDeckProps {
  currentSlideIndex: number;
  onSlideChange?: (index: number) => void;
}

export function HelixSpiralDeck({ currentSlideIndex, onSlideChange }: HelixSpiralDeckProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Active Theory Reference Helix Mathematics
  const cardRadius = 3.2; // Radius from central DB edge spine
  const ySpacing = 2.5;   // Vertical distance between cards (Y축만 수정)
  const angleStep = 0.75; // Angle increment along spiral (~43 degrees)

  const currentScrollRef = useRef(currentSlideIndex - 1);
  const targetScrollRef = useRef(currentSlideIndex - 1);

  // Synchronize target scroll with incoming currentSlideIndex prop
  useEffect(() => {
    targetScrollRef.current = currentSlideIndex - 1;
  }, [currentSlideIndex]);

  // Pre-generate textures for all slides
  const textures = useMemo(() => {
    return LECTURE_SLIDES.map((slide) => {
      const svgCode = getSVGCodeForSlideIndex(slide.index);
      return createSlideTextureFromSVG(svgCode, `s${slide.index}`);
    });
  }, []);

  // Geometry for 3D card planes (adjusted for 16:9 aspect ratio)
  const cardGeometry = useMemo(() => new THREE.PlaneGeometry(4.0, 2.25), []);

  // Interactive controls: Wheel, Drag, Keyboard
  useEffect(() => {
    let isDragging = false;
    let previousMouseY = 0;

    const onWheel = (e: WheelEvent) => {
      targetScrollRef.current += e.deltaY * 0.0025;
      targetScrollRef.current = Math.max(0, Math.min(LECTURE_SLIDES.length - 1, targetScrollRef.current));

      const newIdx = Math.round(targetScrollRef.current) + 1;
      if (onSlideChange) onSlideChange(newIdx);
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - previousMouseY;
      targetScrollRef.current -= deltaY * 0.006;
      targetScrollRef.current = Math.max(0, Math.min(LECTURE_SLIDES.length - 1, targetScrollRef.current));
      previousMouseY = e.clientY;

      const newIdx = Math.round(targetScrollRef.current) + 1;
      if (onSlideChange) onSlideChange(newIdx);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        targetScrollRef.current = Math.min(LECTURE_SLIDES.length - 1, Math.round(targetScrollRef.current) + 1);
        if (onSlideChange) onSlideChange(Math.round(targetScrollRef.current) + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetScrollRef.current = Math.max(0, Math.round(targetScrollRef.current) - 1);
        if (onSlideChange) onSlideChange(Math.round(targetScrollRef.current) + 1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onSlideChange]);

  // Animation Loop: LERP scroll and update static card opacity based on distance
  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth LERP interpolation (0.08 damping)
    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
    const scroll = currentScrollRef.current;

    groupRef.current.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      if (!mesh || !mesh.material) return;

      // 카드는 3D 공간의 나선형 경로 상에 정적으로 완전히 고정
      const angle = idx * angleStep;
      const y = -(idx - 6) * ySpacing;
      const x = Math.sin(angle) * cardRadius;
      const z = Math.cos(angle) * cardRadius;

      mesh.position.set(x, y, z);

      // 카드의 각도 수정 (앞면이 카메라를 정방향으로 마주보고, 척추망과 나란히 서도록 설정)
      mesh.rotation.y = angle;
      mesh.rotation.x = 0;

      // 홀로그래픽 어라이벌 투명도 연산
      const targetIdx = Math.round(targetScrollRef.current);
      const distFromCenter = Math.abs(idx - scroll);
      const speed = Math.abs(targetScrollRef.current - scroll);

      let opacity = 0;
      if (idx === targetIdx) {
        // 목적지 카드는 도착 직전(speed < 0.33)에만 페이드인 시작
        opacity = Math.max(0, 1.0 - speed * 3.0);
      } else {
        // 이전 카드는 이동 시작 즉시 빠르게 페이드아웃
        opacity = Math.max(0, 1.0 - distFromCenter * 1.5);
      }

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity;
      mesh.visible = opacity > 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {LECTURE_SLIDES.map((slide, idx) => (
        <mesh key={slide.index} geometry={cardGeometry}>
          <meshBasicMaterial
            map={textures[idx]}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={1.0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
