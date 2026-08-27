'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
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
 * Dynamically crops SVG viewBox based on a relative margin ratio.
 * Falls back to 80, 80, 1760, 920 if no viewBox is found.
 */
function cropSVGViewBox(
  svgString: string,
  padding = 20,
  fallbackViewBox = { x: 80, y: 80, width: 1760, height: 920 }
): string {
  if (typeof DOMParser === 'undefined') return svgString;
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (!svgElement) return svgString;

  let cropX = fallbackViewBox.x;
  let cropY = fallbackViewBox.y;
  let cropWidth = fallbackViewBox.width;
  let cropHeight = fallbackViewBox.height;

  const existingViewBox = svgElement.getAttribute('viewBox');
  if (existingViewBox) {
    const viewBoxValues = existingViewBox.split(/[\s,]+/).map(Number);
    if (viewBoxValues.length === 4 && !viewBoxValues.some(isNaN)) {
      const [origX, origY, origW, origH] = viewBoxValues;
      
      // Proportional ratio scaling based on fallback values
      const cropLeftRatio = fallbackViewBox.x / 1920; 
      const cropTopRatio = fallbackViewBox.y / 1080;
      const cropWidthRatio = fallbackViewBox.width / 1920;
      const cropHeightRatio = fallbackViewBox.height / 1080;

      const dynamicPaddingX = padding * (origW / 1920);
      const dynamicPaddingY = padding * (origH / 1080);

      cropX = Math.max(origX, origX + origW * cropLeftRatio - dynamicPaddingX);
      cropY = Math.max(origY, origY + origH * cropTopRatio - dynamicPaddingY);
      cropWidth = Math.min(origW, origW * cropWidthRatio + dynamicPaddingX * 2);
      cropHeight = Math.min(origH, origH * cropHeightRatio + dynamicPaddingY * 2);
    }
  }

  svgElement.setAttribute('viewBox', `${cropX} ${cropY} ${cropWidth} ${cropHeight}`);
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svgElement.setAttribute('width', '100%');
  svgElement.setAttribute('height', '100%');

  // Inject precision rendering parameters to maximize sharpness
  svgElement.setAttribute('text-rendering', 'geometricPrecision');
  svgElement.setAttribute('shape-rendering', 'geometricPrecision');

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * Creates high-resolution Texture from SVG code drawn onto a Canvas.
 */
function createSlideTextureFromSVG(svgString: string, slidePrefix: string): THREE.Texture {
  const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
  const canvas = document.createElement('canvas');
  canvas.width = 1920 * dpr;
  canvas.height = 1080 * dpr;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.Texture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  if (!svgString) return texture;

  // Crop viewBox dynamically and namespace all ids to avoid conflicts
  const croppedSVG = cropSVGViewBox(svgString);
  const namespacedSVG = namespaceSVGIds(croppedSVG, slidePrefix);

  const img = new Image();
  const blob = new Blob([namespacedSVG], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, 1920, 1080);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
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
  const found = PARSED_SLIDES.find(s => s.index === lectureIndex);
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

  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  // Pre-generate textures for all slides (async web font check + cleanup memory leak)
  useEffect(() => {
    let active = true;
    const loadedTextures: THREE.Texture[] = [];

    const loadAllTextures = async () => {
      // 엣지케이스 ②: 웹 폰트(Pretendard 등) 로드 완료 보장
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      const texs = LECTURE_SLIDES.map((slide) => {
        const svgCode = getSVGCodeForSlideIndex(slide.index);
        return createSlideTextureFromSVG(svgCode, `s${slide.index}`);
      });

      if (active) {
        loadedTextures.push(...texs);
        setTextures(texs);
      } else {
        texs.forEach(tex => tex.dispose());
      }
    };

    loadAllTextures();

    return () => {
      active = false;
      // 엣지케이스 ①: WebGL 텍스처 메모리 누수 방지 (cleanup)
      loadedTextures.forEach((tex) => {
        if (tex) tex.dispose();
      });
    };
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
      {textures.length > 0 && LECTURE_SLIDES.map((slide, idx) => (
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
