'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import { PresentationSlideCard } from '@/components/lecture/PresentationSlideCard';
import { SlideVisualType } from '@/components/canvas/CylindricalSlideDeck';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';
import { ChevronLeft, ChevronRight, Play, RotateCcw, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { ControlBar } from '@/components/ui/ControlBar';

interface SlideData {
  index: number;
  title: string;
  subtitle: string;
  bullets: string[];
  visualType: SlideVisualType;
  "3dState": GraphSystemState;
  isBlurred: boolean;
  isDemo: boolean;
}

// 13 Presentation Slides aligned with LECTURE.MD
const SLIDES: SlideData[] = [
  {
    index: 1,
    title: "GraphRAG 개요: 민법 조문 준용 체인과 그래프 모델링",
    subtitle: "법률 정보는 텍스트가 아닌, 관계망의 형태로 복원되어야 한다",
    bullets: [
      "대한민국 민법 조문들은 독립적으로 해석되지 않고 상호 간 촘촘한 의존망을 형성함",
      "제13조(피한정후견) 해석 시 준용 조항인 제14조 및 예외 조항인 제16조 분석이 강제됨",
      "문서를 쪼개어 검색하는 단순 Vector RAG는 준용 체인을 탐색하지 못해 법률 분석 누락 발생",
      "본 프로젝트는 1,118개 민법 조문을 노드와 엣지망으로 재구성하여 RAG 성능 한계 극복"
    ],
    visualType: "text",
    "3dState": "STATE_IDLE",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 2,
    title: "🖥️ 데모 1: 전체 DB 구조 시연",
    subtitle: "5,000 파티클 기반의 민법 지식 그래프 은하 구조",
    bullets: [],
    visualType: "text",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: false,
    isDemo: true
  },
  {
    index: 3,
    title: "② 데이터 적재 파이프라인 (1): 1, 2단계 파싱",
    subtitle: "계층 파서(Parser)를 통한 구조 위계 보존 및 의미론적 청킹",
    bullets: [
      "민법 원본(.txt) 로드 후 유니코드 및 인코딩 정화 과정을 거치는 1단계 파이프라인",
      "정규식 '제\\s*(\\d+(?:의\\d+)?)\\s*조'를 적용해 제14조의2 같은 예외 가지번호 완벽 매칭",
      "동그라미 숫자(①~⑳) 기준의 '항(Clause)' 단위로 Sub-chunking을 수행하는 2단계 파이프라인",
      "단순 글자 수 분할을 배제하고 법률적 최소 의미 단위를 복원하여 검색 정밀도 극대화"
    ],
    visualType: "regex",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 4,
    title: "② 데이터 적재 파이프라인 (2): 왜 정규식인가? & 3단계 관계 추출",
    subtitle: "확률론(LLM)의 한계를 극복하는 정규식 기반 결정론적 온톨로지 추출",
    bullets: [
      "LLM은 확률 예측 모델이므로 조문 번호를 환각(Hallucination)하거나 관계선을 누락할 위험 존재",
      "법률 문장은 문법 규칙이 고도로 약속되어 정형화되어 있으므로 정규식 빌드가 최선의 선택",
      "원문 속 '준용한다', '불구하고', '다만' 등의 키워드를 분석하여 3대 핵심 법률 온톨로지 적재",
      "상대 지칭('전조' ➔ 바로 이전 조문) 및 범위 지칭('내지' ➔ 중간 조문 자동 전개) 전처리 완결"
    ],
    visualType: "ontology",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 5,
    title: "② 데이터 적재 파이프라인 (3): 4단계 Neo4j 적재",
    subtitle: "데이터 정합성 및 무중단 빌드를 보장하는 멱등성 벌크 적재",
    bullets: [
      "데이터 무효 유입 및 유실을 방지하기 위해 UNIQUE CONSTRAINT DDL 구조 선행 정의",
      "500개 단위의 UNWIND Cypher 쿼리를 활용한 대용량 MERGE 배치 파이프라인 적재",
      "총 1,118개 조문 노드, 1,034개 항 서브노드, 530개 온톨로지 엣지 적재 완수",
      "비싼 LLM 호출 비용 ₩0원, 로컬 CPU 연산으로 단 3초 만에 전체 DB 구축 완료"
    ],
    visualType: "architecture",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 6,
    title: "③ 그래프 스키마 & 쿼리 엔진 (1): Neo4j 노드/엣지 스키마",
    subtitle: "성능과 기하학적 의미론을 융합한 지식 베이스 설계",
    bullets: [
      "조문(Article) 노드 프로퍼티 내부에 id, base_number, fullText, contextPath 속성 완비",
      "노드 자체에 조문 원문 전체를 내장하여 런타임 시 추가 디스크 IO 없이 단일 쿼리로 데이터 획득",
      "CONTAINS(편-장-절-조 위계)와 MUTATIS_MUTANDIS(준용), EXCEPTION_TO(예외) 엣지 분류",
      "수정 및 제약 조건(modifications) 속성을 엣지에 주입하여 상세 법적 전제 조건 매핑"
    ],
    visualType: "ontology",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 7,
    title: "③ 그래프 스키마 & 쿼리 엔진 (2): 2-Hop Cypher 탐색의 의의",
    subtitle: "RAG 컨텍스트 구성을 위한 실시간 그래프 트래버설 설계",
    bullets: [
      "질문에서 식별된 진입 조문(Center)을 기점으로 최대 2단계 연결된 이웃 관계망을 긁어오는 Cypher 실행",
      "1-Hop은 정보 유실이 심하며, 3-Hop 이상은 질문과 무관한 노이즈 데이터의 급격한 유입 발생",
      "2-Hop 탐색이 법률 문맥을 가장 정확하게 획득하는 최적의 엔지니어링 스위트 스팟(Suite Spot)",
      "동적 서브그래프(Dynamic Subgraph)를 구성하여 Gemini 프롬프트 인젝션 파이프라인으로 안전하게 라우팅"
    ],
    visualType: "regex",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 8,
    title: "🖥️ 데모 2: 조문 탐색 시각화",
    subtitle: "피한정후견인의 행위 제13조 준용/예외 3D 레이저 빔 트래버설",
    bullets: [],
    visualType: "text",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: false,
    isDemo: true
  },
  {
    index: 9,
    title: "④ RAG 추론 파이프라인 (1): 4단계 실시간 추론 흐름",
    subtitle: "지식 탐색(Neo4j)과 자연어 생성(Gemini)의 안전한 분할 설계",
    bullets: [
      "1단계: 사용자의 자연어 질문 접수 및 핵심 법률 조문 키워드 매핑",
      "2단계: Neo4j 그래프 엔진을 이용해 2-Hop 연관 서브그래프 데이터 추출",
      "3단계: 획득한 원문 텍스트와 관계 정보를 구조화하여 LLM용 프롬프트 컨텍스트(Context)로 융합",
      "4단계: Gemini API를 호출하여 법률 근거 조항을 조목조목 인용한 종합 답변 보고서 최종 생성"
    ],
    visualType: "architecture",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 10,
    title: "④ RAG 추론 파이프라인 (2): Context Injection & 프롬프트 설계",
    subtitle: "환각(Hallucination) 통제 및 API 실패를 극복하는 Fallback 구조",
    bullets: [
      "System Prompt에 '제공된 그래프 컨텍스트 정보에만 전적으로 근거하여 500자 이내로 답하라'는 제약 주입",
      "답변 작성 시 근거가 된 민법 제OO조 및 항 번호를 반드시 명시하도록 프롬프트 가이드라인 설계",
      "Gemini API가 통신 에러 혹은 응답 지연 발생 시 백엔드에서 Groq Llama-3 클라이언트로 즉시 라우팅 전환",
      "안정적인 무중단 서비스 제공을 위한 싱글톤 비동기 폴백(Fallback) 복원력 확보"
    ],
    visualType: "summary",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 11,
    title: "🖥️ 데모 3: 실시간 RAG 쿼리 시연",
    subtitle: "토지 무단 구조물 설치 분쟁에 대한 실시간 GraphRAG 종합 보고서 생성",
    bullets: [],
    visualType: "text",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: false,
    isDemo: true
  },
  {
    index: 12,
    title: "⑤ 차별점 정리: 패러다임의 혁신",
    subtitle: "범용성(Microsoft GraphRAG) vs 전문성(본 특화 GraphRAG)",
    bullets: [
      "MS GraphRAG: LLM으로 관계를 추출하므로 엄청난 빌드 비용 및 오랜 시간(수십 분) 소요",
      "본 시스템: 고도로 정형화된 법률 문법에 맞춘 정규식 매칭을 적용하여 비용 ₩0원, 3초 만에 빌드 완료",
      "MS GraphRAG: 커뮤니티 단위 요약문을 RAG에 활용하여 세부 디테일이 탈락할 리스크 존재",
      "본 시스템: 조문 원문 텍스트를 고스란히 컨텍스트에 꽂아 팩트에 기반한 정교한 100% 진실성 실현"
    ],
    visualType: "comparison",
    "3dState": "STATE_BENCHMARK_RADAR",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 13,
    title: "⑥ 결론 및 아키텍처 비전",
    subtitle: "결정론적 지식 그래프와 확률론적 LLM의 아름다운 시너지",
    bullets: [
      "신뢰성이 생명인 법률/의료 전문 분야에서는 지식 그래프라는 단단한 규칙의 토대 구축이 선행되어야 함",
      "지식망 위에 LLM의 뛰어난 자연어 생성력이 얹힐 때 비로소 상용화 가능한 전문 도메인 AI 탄생",
      "본 시스템은 민법 1,118개 조문 노드와 530개 온톨로지를 ₩0원으로 안전하게 융합한 하이브리드 RAG 설계의 교과서",
      "경청해 주셔서 감사합니다. (Q&A 세션 진행)"
    ],
    visualType: "summary",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: false,
    isDemo: false
  }
];

// Mock Subgraph data for Demo 2 (Article 13 Traversal)
const DEMO2_SUBGRAPH_DATA: DynamicSubgraphData = {
  targetArticle: '13',
  nodes: [
    { id: '13', articleNumber: '제13조', title: '피한정후견인의 행위와 동의', summary: '피한정후견인의 권리 동의 범위', type: 'origin_node', fullText: '제13조(피한정후견인의 행위와 동의) ① 가정법원은 피한정후견인이 한정후견인의 동의를 받아야 하는 행위의 범위를 정할 수 있다...' },
    { id: '14', articleNumber: '제14조', title: '한정후견종료의 심판', summary: '한정후견 심판의 종료 절차', type: 'traversal_node' },
    { id: '15', articleNumber: '제15조', title: '의견청취', summary: '피한정후견인의 의견 개진', type: 'traversal_node' },
    { id: '16', articleNumber: '제16조', title: '피특정후견인의 보호', summary: '특정후견 피보호권 범위', type: 'target_node' }
  ],
  edges: [
    { id: 'e1', source: '13', target: '14', type: 'MUTATIS_MUTANDIS', description: '준용한다' },
    { id: 'e2', source: '13', target: '16', type: 'EXCEPTION_TO', description: '불구하고' },
    { id: 'e3', source: '15', target: '13', type: 'REFERENCES', description: '참조한다' }
  ]
};

// Mock Subgraph data for Demo 3 (Real-time Query)
const DEMO3_SUBGRAPH_DATA: DynamicSubgraphData = {
  targetArticle: '214',
  nodes: [
    { id: '214', articleNumber: '제214조', title: '소유물방해제거, 방해예방청구권', summary: '소유자는 소유권을 방해하는 자에 방해 제거 청구 가능', type: 'origin_node', fullText: '제214조(소유물방해제거, 소유물방해예방청구권) 소유자는 소유권을 방해하는 자에 대하여 방해의 제거를 청구할 수 있고 소유권을 방해할 염려있는 행위를 하는 자에 대하여 그 예방이나 손해배상의 담보를 청구할 수 있다.' },
    { id: '741', articleNumber: '제741조', title: '부당이득의 내용', summary: '법률상 원인 없이 타인 재산으로 얻은 이득 반환 의무', type: 'traversal_node' },
    { id: '750', articleNumber: '제750조', title: '불법행위의 내용', summary: '고의/과실에 따른 손해배상 책임', type: 'traversal_node' },
    { id: '245', articleNumber: '제245조', title: '점유취득시효', summary: '20년간 소유 의사로 점유 시 취득시효 완성', type: 'target_node' }
  ],
  edges: [
    { id: 'e4', source: '214', target: '741', type: 'REFERENCES', description: '부당이득 반환 의무' },
    { id: 'e5', source: '214', target: '750', type: 'REFERENCES', description: '불법행위 손해배상' },
    { id: 'e6', source: '741', target: '245', type: 'EXCEPTION_TO', description: '시효취득 항변' }
  ]
};

export default function LecturePage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [isIntro, setIsIntro] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const [override3DState, setOverride3DState] = useState<GraphSystemState | null>(null);
  const currentSlide = SLIDES[currentSlideIndex - 1];

  // Auto-terminate intro after 2 seconds to show slide deck
  useEffect(() => {
    const timer = setTimeout(() => setIsIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger 750ms dynamic blur bypass whenever slide changes
  useEffect(() => {
    setIsMoving(true);
    setOverride3DState(null); // Reset 3D state override on slide transitions
    const timer = setTimeout(() => setIsMoving(false), 750);
    return () => clearTimeout(timer);
  }, [currentSlideIndex]);

  // Slide state transitions helper
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 1));
  }, []);

  // Keyboard & Hands-Free Sound Pulse navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else {
        // Direct number key navigation (1~9 slides)
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          setCurrentSlideIndex(num);
        } else if (e.key === '0') {
          setCurrentSlideIndex(10);
        } else if (e.key === 'q') {
          setCurrentSlideIndex(11);
        } else if (e.key === 'w') {
          setCurrentSlideIndex(12);
        } else if (e.key === 'e') {
          setCurrentSlideIndex(13);
        }
      }
    };

    // Custom Event triggers from Double/Triple snap detection
    const handleSlideNext = () => {
      console.log("[Lecture Page] Received slide-next event");
      nextSlide();
    };

    const handleSlidePrev = () => {
      console.log("[Lecture Page] Received slide-prev event");
      prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('slide-next', handleSlideNext);
    window.addEventListener('slide-prev', handleSlidePrev);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('slide-next', handleSlideNext);
      window.removeEventListener('slide-prev', handleSlidePrev);
    };
  }, [nextSlide, prevSlide]);

  // Inject Mock Data depending on current slide
  let activeSubgraph: DynamicSubgraphData | null = null;
  if (currentSlideIndex === 8) {
    activeSubgraph = DEMO2_SUBGRAPH_DATA;
  } else if (currentSlideIndex === 11) {
    activeSubgraph = DEMO3_SUBGRAPH_DATA;
  }

  const queryText = currentSlideIndex === 11
    ? "다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?"
    : null;

  // Apply blur ONLY during motion transitions, clear completely (100% crisp) when settled/zoomed
  const active3DState = isIntro ? 'STATE_IDLE' : (override3DState || currentSlide["3dState"]);
  const isBlurredActive = false;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070a] font-sans text-white select-none">
      {/* Post-processing scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-60" />

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <GraphCanvas
          state={active3DState}
          subgraphData={activeSubgraph}
          isBlurred={isBlurredActive}
          panelOpen={currentSlideIndex === 11 && !isIntro}
          currentQuery={queryText}
          currentSlideIndex={currentSlideIndex}
          isIntro={isIntro}
          onSlideChange={(idx) => setCurrentSlideIndex(idx)}
          showEdgeBundle={true}
        />
      </div>

      {/* Top Header */}
      <div className="absolute top-6 left-8 right-8 z-30 flex justify-between items-center pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="text-sm font-mono font-bold tracking-[3px] text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
            GRAPHRAG // HELIX LABS
          </div>
          <span className="text-slate-600 font-mono text-xs">|</span>
          <span className="text-[11px] font-mono text-slate-400">민법 1편-5편 지식 척추망</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <span className="text-[11px] font-mono text-sky-300/60 mr-2">[ SCROLL OR DRAG TO EXPLORE HELIX ]</span>
          <button
            onClick={() => {
              setCurrentSlideIndex(1);
              setIsIntro(false);
            }}
            className="px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-sky-300 hover:text-white hover:border-sky-400 text-xs font-mono tracking-wider transition-all"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Left Category Filter Sidebar */}
      <div className="absolute top-24 left-8 z-30 hidden md:flex flex-col space-y-3 pointer-events-auto max-w-[220px]">
        <div className="text-[11px] font-mono text-sky-400/60 tracking-widest uppercase">
          FILTER BY CATEGORY
        </div>
        <div className="flex flex-col space-y-1.5 font-mono text-xs">
          {[
            { label: "→ 01 OVERVIEW", index: 1 },
            { label: "→ 02 LIVE DEMO", index: 2 },
            { label: "→ 03 INGESTION", index: 3 },
            { label: "→ 06 SCHEMA", index: 6 },
            { label: "→ 07 CYPHER 2-HOP", index: 7 },
            { label: "→ 09 RAG ENGINE", index: 9 },
            { label: "→ 10 COMPARISON", index: 10 },
            { label: "→ 12 BENCHMARK", index: 12 },
          ].map((cat) => (
            <button
              key={cat.index}
              onClick={() => setCurrentSlideIndex(cat.index)}
              className={`text-left py-1 px-2 rounded transition-all ${currentSlideIndex === cat.index
                  ? 'text-sky-300 font-bold translate-x-1.5 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                  : 'text-slate-400/70 hover:text-sky-300 hover:translate-x-1'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo 3 Custom AI Response sliding panel overlay */}
      <AnimatePresence>
        {currentSlideIndex === 11 && (
          <motion.div
            initial={{ opacity: 0, x: 450 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 450 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 1.2 }}
            className="absolute top-8 right-8 bottom-24 z-30 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-xl overflow-y-auto flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-2 text-sky-400">
              <FileText className="w-5 h-5" />
              <h2 className="font-bold text-sm tracking-wider uppercase">AI 실시간 법률 보고서</h2>
            </div>

            <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-200 text-xs font-semibold leading-relaxed flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <span>질문: "다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?"</span>
            </div>

            <div className="text-slate-300 text-xs md:text-sm space-y-3.5 leading-relaxed font-normal">
              <p>
                타인이 귀하의 토지에 무단으로 구조물을 설치한 경우, 민법 <strong className="text-emerald-400">제214조(소유물방해제거청구권)</strong>에 의거하여 무단 설치물에 대한 철거 및 토지 인도를 청구할 수 있습니다.
              </p>
              <p>
                동시에, 상대방이 토지를 무단 점유함으로써 얻은 이득에 대해서는 <strong className="text-sky-400">제741조(부당이득반환청구권)</strong>를 근거로 차임 상당액의 반환을 청구할 수 있으며, 고의 또는 과실로 인한 손해에 대해서는 <strong className="text-rose-400">제750조(불법행위로 인한 손해배상청구권)</strong>를 통해 손해배상을 청구할 수 있습니다.
              </p>
              <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 text-rose-300 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>주의: 상대방이 20년 이상 소유의 의사로 점유를 지속할 경우, <strong>제245조(점유시효취득)</strong>에 의거 소유권을 침해받을 수 있으므로 신속한 권리 행사가 필요합니다.</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-slate-500">
              <span>RAG Response: 0.28s</span>
              <span>Gemini-1.5-Flash</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Presentation Control bar (z-index 40) - Integrated voice/snap dashboard */}
      <ControlBar
        currentState={active3DState}
        onSetState={(state) => setOverride3DState(state)}
        onSearchStart={(queryText) => {
          // Switch automatically to Demo 3 RAG Slide upon speech recognition trigger
          setCurrentSlideIndex(11);
        }}
      />
    </main>
  );
}
