'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface SlideItem {
  index: number;
  category: string;
  title: string;
  subtitle: string;
  bullets: string[];
  isDemo: boolean;
}

export const LECTURE_SLIDES: SlideItem[] = [
  {
    index: 1,
    category: "OVERVIEW",
    title: "GraphRAG 개요",
    subtitle: "민법 조문 준용 체인과 그래프 모델링",
    bullets: [
      "민법 조문들은 독립되지 않고 촘촘한 의존망 형성",
      "제13조 해석 시 제14조 준용 및 제16조 예외 분석 강제",
      "단순 Vector RAG는 준용 체인을 놓쳐 법률 분석 누락 발생",
      "1,118개 민법 조문을 노드/엣지망으로 재구성하여 극복"
    ],
    isDemo: false
  },
  {
    index: 2,
    category: "LIVE DEMO",
    title: "데모 1: 전체 DB 구조",
    subtitle: "5,000 파티클 기반의 민법 지식 그래프 은하",
    bullets: [
      "제1편 총칙부터 제5편 상속까지 5대 편별 클러스터 3D 입체화",
      "조문 간 준용(MUTATIS), 예외(EXCEPTION) 엣지 실시간 렌더링"
    ],
    isDemo: true
  },
  {
    index: 3,
    category: "INGESTION",
    title: "파이프라인: 1·2단계 파싱",
    subtitle: "계층 파서를 통한 구조 위계 보존 및 청킹",
    bullets: [
      "민법 원본(.txt) 로드 및 유니코드 정화 1단계 파이프라인",
      "정규식 /제\\s*(\\d+(?:의\\d+)?)\\s*조/ 로 가지번호 완벽 매칭",
      "동그라미 숫자(①~⑳) 기준 항(Clause) 단위 Sub-chunking",
      "법률적 최소 의미 단위를 복원하여 검색 정밀도 극대화"
    ],
    isDemo: false
  },
  {
    index: 4,
    category: "INGESTION",
    title: "왜 정규식인가? & 3단계",
    subtitle: "결정론적 온톨로지 관계 추출",
    bullets: [
      "LLM 환각(Hallucination) 위험을 배제한 정규식 추출",
      "고도로 정형화된 법률 문법에 최적화된 결정론적 파싱",
      "'준용한다', '불구하고', '다만' 키워드로 3대 온톨로지 적재",
      "상대 지칭('전조') 및 범위 지칭('내지') 자동 전개 완결"
    ],
    isDemo: false
  },
  {
    index: 5,
    category: "INGESTION",
    title: "4단계 Neo4j 적재",
    subtitle: "데이터 정합성 보장 멱등성 벌크 적재",
    bullets: [
      "UNIQUE CONSTRAINT DDL 구조 선행 정의로 무효 유입 방지",
      "500개 단위 UNWIND Cypher 쿼리 활용 대용량 MERGE 배치",
      "총 1,118개 조문 노드, 1,034개 항 서브노드, 530개 엣지 적재",
      "LLM 비용 ₩0원, 로컬 CPU 연산으로 단 3초 만에 DB 구축"
    ],
    isDemo: false
  },
  {
    index: 6,
    category: "SCHEMA",
    title: "Neo4j 노드/엣지 스키마",
    subtitle: "성능과 기하학적 의미론을 융합한 지식 베이스",
    bullets: [
      "Article 노드 내에 id, base_number, fullText 내장",
      "노드 자체에 원문을 내장하여 추가 디스크 IO 없이 단일 획득",
      "CONTAINS(위계), MUTATIS(준용), EXCEPTION(예외) 분류",
      "수정 및 제약 조건(modifications) 속성을 엣지에 주입"
    ],
    isDemo: false
  },
  {
    index: 7,
    category: "CYPHER",
    title: "2-Hop Cypher 탐색",
    subtitle: "RAG 컨텍스트 구성을 위한 실시간 그래프 트래버설",
    bullets: [
      "진입 조문을 기점으로 최대 2단계 연결된 이웃 관계망 획득",
      "1-Hop은 정보 유실, 3-Hop 이상은 노이즈 데이터 유입 발생",
      "2-Hop 탐색이 법률 문맥의 최적 엔지니어링 스위트 스팟",
      "동적 서브그래프를 구성하여 Gemini 프롬프트로 안전하게 라우팅"
    ],
    isDemo: false
  },
  {
    index: 8,
    category: "LIVE DEMO",
    title: "데모 2: 2-Hop 탐색",
    subtitle: "실시간 Cypher 쿼리 및 연관 법조문 확장 시연",
    bullets: [
      "질의 입력 시 실시간으로 Neo4j 2-Hop 트래버설 엣지 점등",
      "준용 조문과 예외 조문이 하이라이트되며 컨텍스트 조립"
    ],
    isDemo: true
  },
  {
    index: 9,
    category: "RAG ENGINE",
    title: "하이브리드 검색 & 컨텍스트",
    subtitle: "Vector 유사도 + Graph 결정론의 융합 구조",
    bullets: [
      "질의 키워드 기반 시작 노드 탐색 후 2-Hop 서브그래프 병합",
      "관련 조문 원문 + 준용/예외 조건 텍스트를 구조화 프롬프트로 변환",
      "단순 텍스트 검색 대비 법적 누락률 0% 달성"
    ],
    isDemo: false
  },
  {
    index: 10,
    category: "COMPARISON",
    title: "MS GraphRAG 비교",
    subtitle: "비용과 속도 혁신",
    bullets: [
      "MS GraphRAG: LLM 호출로 비싸고 수십 분 소요, 요약문 위주",
      "본 시스템: 정규식 추출로 비용 ₩0원, 단 3초 빌드, 원문 팩트 100%",
      "정형 법률 도메인에 극대화된 경량 고속 아키텍처"
    ],
    isDemo: false
  },
  {
    index: 11,
    category: "LIVE DEMO",
    title: "데모 3: 복합 질의 응답",
    subtitle: "무단 구조물 설치 (물권↔채권) 복합 추론",
    bullets: [
      "소유권에 기한 물권적 청구권과 임대차 채권 관계의 교차 분석",
      "Gemini 2.5 Flash가 지식 그래프 컨텍스트를 기반으로 정확한 답변 도출"
    ],
    isDemo: true
  },
  {
    index: 12,
    category: "BENCHMARK",
    title: "성능 벤치마크 결과",
    subtitle: "Vector RAG vs GraphRAG 정량 평가",
    bullets: [
      "준용 조항 탐색 재현율(Recall): Vector 20% ➔ GraphRAG 100%",
      "환각률(Hallucination): Vector 45% ➔ GraphRAG 2%",
      "답변 완결성 점수(Completeness): 3.2/5.0 ➔ 4.9/5.0"
    ],
    isDemo: false
  },
  {
    index: 13,
    category: "SUMMARY",
    title: "결론 및 Q&A",
    subtitle: "결정론(지식 그래프)과 확률론(LLM)의 완벽한 조화",
    bullets: [
      "국내 법률 문서의 정형성을 활용한 저비용 고성능 온톨로지",
      "Neo4j 지식 그래프 엔진과 Gemini 생성 모델의 시너지",
      "질의응답 및 토론"
    ],
    isDemo: false
  }
];

/**
 * Creates high-resolution 1024x640 CanvasTexture with Cyber-Glass UI aesthetics.
 */
function createSlideCanvasTexture(slide: SlideItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background Glass Gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, '#060d16');
  grad.addColorStop(1, '#020408');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Outer Neon Border
  ctx.strokeStyle = slide.isDemo ? '#f59e0b' : '#38bdf8';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 992, 608);

  // Inner Accent Border
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 960, 576);

  // Subtle Grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 40; x < 1024; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }

  // Category Tag
  ctx.fillStyle = slide.isDemo ? '#f59e0b' : '#38bdf8';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillText(`// SLIDE ${String(slide.index).padStart(2, '0')} [ ${slide.category} ]`, 60, 95);

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(slide.title, 60, 175);

  // Subtitle
  ctx.fillStyle = 'rgba(147, 197, 253, 0.85)';
  ctx.font = '26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(slide.subtitle, 60, 225);

  // Horizontal Separator
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 255);
  ctx.lineTo(964, 255);
  ctx.stroke();

  // Bullet points
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  let bulletY = 310;

  slide.bullets.forEach((bullet) => {
    // Bullet Dot
    ctx.fillStyle = slide.isDemo ? '#f59e0b' : '#10b981';
    ctx.beginPath();
    ctx.arc(75, bulletY - 8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bullet Text
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(bullet, 100, bulletY);
    bulletY += 58;
  });

  // Action / Prompt Footer
  if (slide.isDemo) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText('[ ⚡ LIVE DEMO VIEWPORT ACTIVE ]', 60, 580);
  } else {
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText('대한민국 민법 지식그래프 모델링', 60, 580);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

interface HelixSpiralDeckProps {
  currentSlideIndex: number;
  onSlideChange?: (index: number) => void;
}

export function HelixSpiralDeck({ currentSlideIndex, onSlideChange }: HelixSpiralDeckProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Active Theory Reference Helix Mathematics
  const cardRadius = 3.2; // Radius from central DB edge spine
  const ySpacing = 1.8;   // Vertical distance between cards
  const angleStep = 0.75; // Angle increment along spiral (~43 degrees)

  const currentScrollRef = useRef(currentSlideIndex - 1);
  const targetScrollRef = useRef(currentSlideIndex - 1);

  // Synchronize target scroll with incoming currentSlideIndex prop
  useEffect(() => {
    targetScrollRef.current = currentSlideIndex - 1;
  }, [currentSlideIndex]);

  // Pre-generate textures for all 13 slides
  const textures = useMemo(() => {
    return LECTURE_SLIDES.map((slide) => createSlideCanvasTexture(slide));
  }, []);

  // Geometry for 3D card planes (shrunk to fit closer camera Z = 5.4)
  const cardGeometry = useMemo(() => new THREE.PlaneGeometry(2.8, 1.75), []);

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

  // Animation Loop: LERP scroll and position meshes along Helix
  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth LERP interpolation (0.08 damping)
    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
    const scroll = currentScrollRef.current;

    groupRef.current.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      if (!mesh || !mesh.material) return;

      const scrollOffset = idx - scroll;

      // Active Theory Reference Helix Mathematics
      const angle = scrollOffset * angleStep;
      const y = -scrollOffset * ySpacing;
      const x = Math.sin(angle) * cardRadius;
      const z = Math.cos(angle) * cardRadius;

      mesh.position.set(x, y, z);

      // Face forward toward the camera at Z > 0
      mesh.rotation.y = -angle;

      // Subtle tilt towards camera based on Y distance
      mesh.rotation.x = -y * 0.04;

      // Fade out distant cards
      const distFromCenter = Math.abs(scrollOffset);
      const opacity = Math.max(0, 1 - distFromCenter * 0.22);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = opacity;
      mesh.visible = opacity > 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {LECTURE_SLIDES.map((slide, idx) => (
        <mesh key={slide.index} geometry={cardGeometry}>
          <meshStandardMaterial
            map={textures[idx]}
            side={THREE.DoubleSide}
            roughness={0.25}
            metalness={0.2}
            transparent={true}
            opacity={1.0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
