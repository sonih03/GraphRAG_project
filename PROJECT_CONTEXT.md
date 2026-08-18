# GraphRAG 3D Visualizer & Neural Retrieval Engine

## 1. 프로젝트 개요 (Project Overview)
본 프로젝트는 대규모 지식 그래프(Knowledge Graph) 및 GraphRAG(Graph Retrieval-Augmented Generation) 시스템을 3D Three.js 캔버스 상에서 실시간으로 시각화하고 탐색할 수 있는 차세대 인터랙티브 풀스택 플랫폼입니다.

---

## 2. 시스템 아키텍처 (System Architecture)

```
GraphRAG_project/
├── .env / .env.example                          # Neo4j 계정 & AI API 환경 변수
├── docker-compose.yml                           # Neo4j 5.19 APOC 컨테이너 정의
├── package.json                                 # 루트 통합 빌드/실행 스크립트
├── PROJECT_CONTEXT.md                           # 프로젝트 요구사항 및 상태 머신 명세 (본 문서)
├── PROJECT_PROGRESS.md                          # 파일 레지스트리 및 작업 진행 일지
│
├── frontend/                                    # Next.js 16 (App Router, TypeScript)
│   ├── src/
│   │   ├── app/                                 # Next.js App Router 레이아웃 및 페이지
│   │   │   ├── layout.tsx                       # 전역 메타데이터 및 다크 테마 레이아웃
│   │   │   ├── page.tsx                         # 메인 인터랙티브 대시보드
│   │   │   └── globals.css                      # Tailwind CSS v4 및 글로벌 스타일
│   │   ├── components/
│   │   │   ├── canvas/                          # Three.js / @react-three/fiber 3D 계층
│   │   │   │   ├── GraphCanvas.tsx              # R3F Canvas 루트 컨테이너
│   │   │   │   ├── MorphingGraphUniverse.tsx    # 5,000개 고밀도 입자 구체 ↔ 5-Arm 은하 ↔ 트래버설 통합 모핑 렌더러
│   │   │   │   ├── LaserTraversalEdges.tsx      # 제13조 ➔ 14·15·16조 초록/빨강 3D 레이저 빔 애니메이션
│   │   │   │   ├── Article3DLabels.tsx          # 3D 공간 상의 법률 조문 HTML 빌보드 라벨
│   │   │   │   └── CameraController.tsx         # 상태별 부드러운 카메라 시점 줌인/줌아웃 및 자유 조작 제어
│   │   │   ├── ui/                              # Glassmorphism UI 계층
│   │   │   │   ├── GlassCard.tsx                # 글래스모피즘 컨테이너
│   │   │   │   ├── Header.tsx                   # 상단 시스템 텔레메트리 헤더
│   │   │   │   ├── StatusBadge.tsx              # 그래프 시스템 상태 인디케이터
│   │   │   │   └── ControlBar.tsx               # 하단 프롬프트 쿼리 및 제어바
│   │   │   └── overlays/                        # Framer-Motion 오버레이 계층
│   │   │       ├── OverlayManager.tsx           # 상태별 오버레이 관리자
│   │   │       ├── BenchmarkRadarOverlay.tsx    # 성능 벤치마크 레이더 차트 대시보드
│   │   │       ├── VectorWarningOverlay.tsx     # VectorRAG 단편 검색 한계 경고 팝업
│   │   │       └── CompareAnswersOverlay.tsx    # VectorRAG vs GraphRAG 답변 분할 비교 팝업
│   │   ├── lib/
│   │   │   ├── constants/graphConfig.ts         # 3D 구체 반경, 색상, 애니메이션 파라미터 상수
│   │   │   ├── dummy/legalGraphData.ts          # 민법 조문 노드, 엣지, 벤치마크 단일 출처 데이터
│   │   │   └── utils/
│   │   │       ├── math.ts                      # 3D 기하 및 하모닉 파동 연산 유틸
│   │   │       └── cn.ts                        # Tailwind 클래스 병합 유틸
│   │   └── types/
│   │       └── graph.ts                         # 노드/엣지/그래프 상태 타입
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                                     # Python FastAPI 백엔드
    ├── app/
    │   ├── api/v1/
    │   │   ├── endpoints/
    │   │   │   ├── health.py                    # 헬스체크 엔드포인트
    │   │   │   └── graph.py                     # GraphRAG 쿼리 및 그래프 데이터 API
    │   │   └── router.py                        # v1 라우터 모듈
    │   ├── core/
    │   │   ├── config.py                        # pydantic-settings 기반 환경 설정
    │   │   └── logging.py                       # 표준 로거
    │   ├── models/
    │   │   ├── graph.py                         # Node, Edge Pydantic 스키마
    │   │   └── query.py                         # QueryRequest, QueryResponse 스키마
    │   ├── services/
    │   │   ├── neo4j_service.py                 # Neo4j 그래프 데이터베이스 연동 및 Cypher 2-Hop 탐색
    │   │   └── llm_service.py                   # Groq LLM 추론 서비스
    │   └── main.py                              # FastAPI 애플리케이션 진입점 (lifespan, CORS, /api/query)
    ├── requirements.txt
    └── .env.example
```

---

## 3. 핵심 기능 상태 머신 (Graph States)
1. **`STATE_IDLE`**:
   - 300여 개의 빈 노드가 피보나치 구면 기하 구조를 따라 3D 구체 형태로 배치됨
   - `THREE.InstancedMesh`를 통해 단일 드로우 콜로 60fps 유지
   - 우아하고 지속적인 자전(Auto-Rotation) 애니메이션 및 은은한 발광 효과
2. **`STATE_QUERYING`**: 사용자 질의 입력 시 탐색 파동 및 경로 활성화 애니메이션
3. **`STATE_RETRIEVED`**: Neo4j에서 추출된 서브그래프 하이라이트 및 LLM 근거 제공
4. **`STATE_HIGHLIGHT`**: 특정 엔티티/커뮤니티 집중 탐색 모드
