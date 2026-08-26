'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import { SlideVisualType } from '@/components/canvas/CylindricalSlideDeck';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';
import { OverlayManager } from '@/components/overlays/OverlayManager';
import { AudioControlManager } from '@/lib/utils/AudioControlManager';


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
// 11 Presentation Slides aligned with Slide.md
const SLIDES: SlideData[] = [
  {
    index: 1,
    title: "① GraphRAG 개요: 민법 조문 준용 체인과 그래프 모델링",
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
    title: "② VectorRAG vs GraphRAG: 패러다임 비교",
    subtitle: "범용성(Microsoft GraphRAG) vs 전문성(본 특화 GraphRAG)",
    bullets: [
      "MS GraphRAG: LLM으로 관계를 추출하므로 엄청난 빌드 비용 및 오랜 시간(수십 분) 소요",
      "본 시스템: 고도로 정형화된 법률 문법에 맞춘 정규식 매칭을 적용하여 비용 ₩0원, 3초 만에 빌드 완료",
      "MS GraphRAG: 커뮤니티 단위 요약문을 RAG에 활용하여 세부 디테일이 탈락할 리스크 존재",
      "본 시스템: 조문 원문 텍스트를 고스란히 컨텍스트에 꽂아 팩트에 기반한 정교한 100% 진실성 실현"
    ],
    visualType: "comparison",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 3,
    title: "③ GraphRAG 구축의 3대 한계",
    subtitle: "비용, 속도, 환각 한계",
    bullets: [
      "비용 한계: 모든 청크를 대상으로 LLM을 호출하여 관계 추출 및 요약 시 기하급수적 API 요금 과금",
      "속도 한계: 대량의 문서 분석 시 LLM API 처리 지연 및 Rate Limit 병목으로 실시간 빌드 불가",
      "환각 한계: 확률적 텍스트 생성 특성상 법조문 번호를 오인하거나 잘못된 관계를 생성하는 법적 치명상 발생"
    ],
    visualType: "summary",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 4,
    title: "④ 데이터 적재 파이프라인 (1): 1, 2단계 파싱",
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
    index: 5,
    title: "⑤ 데이터 적재 파이프라인 (2): 상태 머신 다이어그램",
    subtitle: "순차 파싱 상태 머신을 통한 contextPath 동적 매핑",
    bullets: [
      "파서가 문서를 순차 탐색하며 편, 장, 절, 조, 항 상태를 추적 및 갱신",
      "각 조항의 정확한 소속 위계(contextPath)를 결정론적으로 획득",
      "구조화된 트리를 통해 법률 정보의 무손실 계층 전개 보장"
    ],
    visualType: "regex",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 6,
    title: "⑥ 데이터 적재 파이프라인 (3): 3단계 관계 추출",
    subtitle: "결정론적 온톨로지 추출을 통한 법률 관계망 구축",
    bullets: [
      "LLM은 확률 예측 모델이므로 조문 번호를 환각하거나 관계선을 누락할 위험 존재",
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
    index: 7,
    title: "⑦ 그래프 스키마 & 쿼리 엔진: 2-Hop Cypher 탐색의 의의",
    subtitle: "RAG 컨텍스트 구성을 위한 실시간 그래프 트래버설 설계",
    bullets: [
      "질문에서 식별된 진입 조문(Center)을 기점으로 최대 2단계 연결된 이웃 관계망을 긁어오는 Cypher 실행",
      "1-Hop은 정보 유실이 심하며, 3-Hop 이상은 질문과 무관한 노이즈 데이터의 급격한 유입 발생",
      "2-Hop 탐색이 법률 문맥을 가장 정확하게 획득하는 최적의 엔지니어링 스위트 스팟(Suite Spot)",
      "동적 서브그래프(Dynamic Subgraph)를 구성하여 프롬프트 인젝션 파이프라인으로 안전하게 라우팅"
    ],
    visualType: "regex",
    "3dState": "STATE_GALAXY_VIEW",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 8,
    title: "⑧ 초기 단순 검색 실패 원인 분석",
    subtitle: "벡터 검색의 한계와 조문 고립 문제",
    bullets: [
      "단순 키워드 및 벡터 검색은 조문 내 텍스트 유사성만 측정하여 법조문 간의 준용 관계를 추적하지 못함",
      "제13조 피한정후견인의 행위 검색 시 준용 조항인 제14조 및 예외 조항인 제16조 누락으로 법적 오판 유발",
      "관련성 높은 지식이 고립 청크(Isolated Chunks)로 잔존하여 RAG 시스템의 신뢰도 붕괴"
    ],
    visualType: "summary",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 9,
    title: "⑨ 데이터 적재 파이프라인 (4): 4단계 Neo4j 적재",
    subtitle: "데이터 정합성 및 무중단 빌드를 보장하는 멱등성 벌크 적재",
    bullets: [
      "데이터 무효 유입 및 유실을 방지하기 위해 UNIQUE CONSTRAINT DDL 구조 선행 정의",
      "500개 단위의 UNWIND Cypher 쿼리를 활용한 대용량 MERGE 배치 파이프라인 적재",
      "총 1,118개 조문 노드, 1,034개 항 서브노드, 530개 온톨로지 엣지 적재 완수",
      "비싼 LLM 호출 비용 ₩0원, 로컬 CPU 연산으로 단 3초 만에 전체 DB 구축 완료"
    ],
    visualType: "architecture",
    "3dState": "STATE_GRAPH_TRAVERSAL",
    isBlurred: true,
    isDemo: false
  },
  {
    index: 10,
    title: "⑩ RAG 추론 파이프라인: 4단계 실시간 추론 흐름",
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
    index: 11,
    title: "⑪ 대규모 벤치마크 평가 성과 및 결론",
    subtitle: "결정론적 지식 그래프와 확률론적 LLM의 아름다운 시너지",
    bullets: [
      "신뢰성이 생명인 법률/의료 전문 분야에서는 지식 그래프라는 단단한 규칙의 토대 구축이 선행되어야 함",
      "지식망 위에 LLM의 뛰어난 자연어 생성력이 얹힐 때 비로소 상용화 가능한 전문 도메인 AI 탄생",
      "본 시스템은 민법 1,118개 조문 노드와 530개 온톨로지를 ₩0원으로 안전하게 융합한 하이브리드 RAG 설계의 교과서",
      "경청해 주셔서 감사합니다. (Q&A 세션 진행)"
    ],
    visualType: "summary",
    "3dState": "STATE_BENCHMARK_RADAR",
    isBlurred: false,
    isDemo: false
  }
];

// Mock Subgraph data for Demo 2 (Article 13 Traversal)
export const DEMO2_SUBGRAPH_DATA: DynamicSubgraphData = {
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
export const DEMO3_SUBGRAPH_DATA: DynamicSubgraphData = {
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

  const [override3DState, setOverride3DState] = useState<GraphSystemState | null>(null);
  
  // RAG & Voice recognition states
  const [subgraphData, setSubgraphData] = useState<DynamicSubgraphData | null>(null);
  const [legalAnswer, setLegalAnswer] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  // Transcript states
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechState, setSpeechState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'EMPTY'>('IDLE');

  const audioManagerRef = useRef<AudioControlManager | null>(null);
  const queryStartRef = useRef<number>(0);

  const currentSlide = SLIDES[currentSlideIndex - 1];

  // Auto-terminate intro after 2 seconds to show slide deck
  useEffect(() => {
    const timer = setTimeout(() => setIsIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger 750ms dynamic blur bypass whenever slide changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverride3DState(null); // Reset 3D state override on slide transitions
    }, 0);
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

  // RAG query execution logic
  const executeRAGQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setCurrentQuery(queryText);
    queryStartRef.current = Date.now();
    setOverride3DState('STATE_QUERYING');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${BACKEND_URL}/api/v1/graph/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (result) {
        const elapsed = Date.now() - queryStartRef.current;
        const minAnimationTime = 1200; // 1.2s connection animation
        const delay = Math.max(0, minAnimationTime - elapsed);

        setTimeout(() => {
          const isVector = result.mode === 'vector' || result.subgraph?.mode === 'vector';
          setOverride3DState(isVector ? 'STATE_VECTOR_SEARCH' : 'STATE_GRAPH_TRAVERSAL');

          setTimeout(() => {
            if (result.subgraph) {
              setSubgraphData(result.subgraph);
            }
            if (result.answer) {
              setLegalAnswer(result.answer);
            } else if (result.legal_answer) {
              setLegalAnswer(result.legal_answer);
            }
          }, 800);
        }, delay);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('RAG Query execution timed out (45s).');
      } else {
        console.error('RAG Query execution failed:', err);
      }
      setOverride3DState(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Dispatch speech text commands
  const handleVoiceCommand = async (text: string) => {
    const normalized = text.toLowerCase().replace(/\s+/g, '').trim(); // 공백 제거 전처리
    console.log(`[Lecture Voice] Normalized command evaluated: "${normalized}"`);

    // 1. "원래페이지로" / 원래 페이지로 / 슬라이드로 / 원래대로 복귀
    if (
      normalized.includes('원래페이지로') ||
      normalized.includes('원래페이지') ||
      normalized.includes('원래대로') ||
      normalized.includes('슬라이드로') ||
      normalized.includes('현재페이지로') ||
      normalized.includes('현재페이지')
    ) {
      console.log("[Lecture Voice] Action: Return to last slide");
      setOverride3DState(null);
      setSubgraphData(null);
      setLegalAnswer(null);
      setCurrentQuery('');
      return;
    }

    // 2. "데이터베이스" / 데이터 베이스 / db구조 / 디비구조 전환
    if (
      normalized.includes('데이터베이스') ||
      normalized.includes('데이터베이스구조') ||
      normalized.includes('데이터페이스') ||
      normalized.includes('데이터이스') ||
      normalized.includes('데이터마이스') ||
      normalized.includes('데이터위스') ||
      normalized.includes('대이터') ||
      normalized.includes('전체구조') ||
      normalized.includes('db구조') ||
      normalized.includes('디비구조') ||
      normalized.includes('db') ||
      normalized.includes('디비') ||
      normalized.includes('은하')
    ) {
      console.log("[Lecture Voice] Action: View Galaxy DB Structure");
      setOverride3DState('STATE_GALAXY_VIEW');
      setSubgraphData(null);
      setLegalAnswer(null);
      return;
    }

    // 3. Fallback: Legal RAG Query
    await executeRAGQuery(text);
  };

  // Process voice transcription outcome from AudioControlManager
  const processVoiceResult = async (transcript: string) => {
    const cleanText = transcript.trim();
    
    // Ignore Whisper typical silent hallucination
    const cleanNoSymbol = cleanText.replace(/[.\s]/g, '').trim();
    if (cleanNoSymbol === '감사합니다' || cleanNoSymbol === 'thankyou' || cleanNoSymbol === '감사합니다.') {
      console.log("[Lecture Voice] Suppressed Whisper silent hallucination. Action: Cancel/Empty.");
      setSpeechState('EMPTY');
      setSpeechTranscript('인식된 음성이 없습니다');
      setTimeout(() => {
        setIsRecording(false);
        setSpeechState('IDLE');
      }, 800);
      return;
    }

    if (!cleanText) {
      // Empty input -> Close overlay with cancel feedback
      setSpeechState('EMPTY');
      setSpeechTranscript('인식된 음성이 없습니다');
      setTimeout(() => {
        setIsRecording(false);
        setSpeechState('IDLE');
      }, 800);
      return;
    }

    // Successful transcription
    setSpeechState('SUCCESS');
    setSpeechTranscript(`"${cleanText}"`);

    // Let user read the recognized query for 1.2s before execution
    setTimeout(async () => {
      setIsRecording(false);
      await handleVoiceCommand(cleanText);
    }, 1200);
  };

  // Keep a ref to the latest processVoiceResult to avoid stale closure issues in AudioControlManager
  const processVoiceResultRef = useRef(processVoiceResult);
  useEffect(() => {
    processVoiceResultRef.current = processVoiceResult;
  }, [processVoiceResult]);

  // Initialize AudioControlManager for mechanical mic tap & whisper
  useEffect(() => {
    let audioManager: AudioControlManager | null = null;
    let isCancelled = false;

    audioManager = new AudioControlManager(
      (cmd, data) => {
        if (isCancelled) return;
        switch (cmd) {
          case 'slide-next':
            console.log("[Lecture Voice] Dispatching slide-next custom event");
            window.dispatchEvent(new CustomEvent('slide-next'));
            break;
          case 'slide-prev':
            console.log("[Lecture Voice] Dispatching slide-prev custom event");
            window.dispatchEvent(new CustomEvent('slide-prev'));
            break;
          case 'mic-activate':
            setIsRecording(true);
            setSpeechState('LISTENING');
            setSpeechTranscript('듣고 있습니다...');
            break;
          case 'mic-closing':
            setSpeechState('PROCESSING');
            setSpeechTranscript('분석하는 중...');
            break;
          case 'mic-close-and-query':
            console.log(`[Lecture Voice] mic-close-and-query received transcript: "${data?.transcript || ''}"`);
            processVoiceResultRef.current(data?.transcript || '');
            break;
          case 'acoustic-ripple':
            window.dispatchEvent(new CustomEvent('acoustic-ripple'));
            break;
        }
      }
    );

    const startManager = async () => {
      try {
        await audioManager.initialize();
        if (isCancelled) {
          audioManager.destroy();
          return;
        }
        audioManagerRef.current = audioManager;
        console.log("[Lecture Voice] AudioControlManager registered.");
      } catch (err) {
        console.error("[Lecture Voice] AudioControlManager init failed:", err);
      }
    };

    startManager();

    return () => {
      isCancelled = true;
      if (audioManagerRef.current) {
        audioManagerRef.current.destroy();
        audioManagerRef.current = null;
      }
      if (audioManager) {
        audioManager.destroy();
      }
    };
  }, []);

  // Inject RAG Data and states
  const activeSubgraph = subgraphData;
  const queryText = currentQuery;

  // Apply blur ONLY during motion transitions, clear completely (100% crisp) when settled/zoomed
  const active3DState = isIntro ? 'STATE_IDLE' : (override3DState || currentSlide["3dState"]);
  const isBlurredActive = false;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070a]">
      {/* 3D WebGL Canvas Layer — full screen, slides only */}
      <div className="absolute inset-0 z-0">
        <GraphCanvas
          state={active3DState}
          subgraphData={activeSubgraph}
          isBlurred={isBlurredActive}
          panelOpen={subgraphData !== null}
          currentQuery={queryText}
          currentSlideIndex={currentSlideIndex}
          isIntro={isIntro}
          onSlideChange={(idx) => setCurrentSlideIndex(idx)}
          showEdgeBundle={true}
        />
      </div>

      {/* RAG Answer Overlay Panel */}
      <OverlayManager
        state={active3DState}
        onSetState={(s) => setOverride3DState(s)}
        subgraphData={subgraphData}
        legalAnswer={legalAnswer}
        onPanelClose={() => {
          setOverride3DState(null);
          setSubgraphData(null);
          setLegalAnswer(null);
          setCurrentQuery('');
        }}
      />

      {/* Whisper Speech Capture Visual HUD */}
      {isRecording && (
        <div className="fixed inset-0 z-40 flex items-center justify-center transition-all duration-300">
          {/* Dim Overlay background */}
          <div className="absolute inset-0 bg-[#020408]/85 backdrop-blur-md transition-opacity duration-300" />
          
          {/* Central-bottom small active orb HUD */}
          <div className="relative z-50 flex flex-col items-center gap-6 mt-[25vh]">
            <div className="w-[320px] h-[320px] relative bg-transparent">
              <GraphCanvas
                state="STATE_IDLE"
                isBlurred={false}
                showEdgeBundle={false}
                bgTransparent={true}
              />
            </div>
            
            {/* Transcript Text Glassmorphic Box */}
            <div className="min-w-[280px] max-w-[500px] border border-cyan-500/20 bg-slate-950/75 backdrop-blur-2xl rounded-2xl px-6 py-3.5 text-center text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">
              <span className={`text-sm tracking-wide font-sans ${
                speechState === 'LISTENING' ? 'text-cyan-400 animate-pulse font-medium' :
                speechState === 'PROCESSING' ? 'text-amber-400 font-medium' :
                speechState === 'SUCCESS' ? 'text-emerald-400 font-bold' :
                'text-rose-400'
              }`}>
                {speechTranscript}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
